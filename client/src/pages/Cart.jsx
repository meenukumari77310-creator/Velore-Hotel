import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, clearCart, setCart } from "../Redux/CartSlice";
import { apis } from "../utils/apis";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch cart items from backend and sync with Redux
  // inside useEffect
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(apis().getCart, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok && data.cart) {
          dispatch(setCart(data.cart));
        } else {
          console.error(
            "Failed to load cart:",
            data.message || "Unknown error"
          );
        }
      } catch (err) {
        console.error("Fetch cart failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [dispatch]);

  // 🧮 Total price calculation
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // ❌ Remove item from cart
  const handleRemove = async (id) => {
    try {
      const res = await fetch(apis().deleteCart(id), {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        dispatch(removeFromCart(id));
      } else {
        const data = await res.json();
        console.error("Failed to remove item:", data.error || data.message);
      }
    } catch (err) {
      console.error("Remove failed:", err.message);
    }
  };

  // 🗑 Clear entire cart
  const handleClearCart = async () => {
    try {
      const res = await fetch(apis().clearCart, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        dispatch(clearCart());
      } else {
        console.error("Failed to clear cart");
      }
    } catch (err) {
      console.error("Clear failed:", err.message);
    }
  };

  return (
    <div className="container py-5 mt-5">
      <h2 className="mb-4 text-center fw-bold text-danger">🛒 Your Cart</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-danger" />
        </div>
      ) : cart.length === 0 ? (
        <div className="alert alert-info text-center">
          Your cart is empty. Start adding some dishes!
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={item.dishId}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    </td>
                    <td>{item.title || "Untitled"}</td>
                    <td>
                      {item.category?.icon} {item.category?.name || "N/A"}
                    </td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemove(item.dishId)}
                      >
                        ❌ Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-3">
            <h4>Total: ₹{total.toFixed(2)}</h4>
            <button className="btn btn-warning mt-2" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
