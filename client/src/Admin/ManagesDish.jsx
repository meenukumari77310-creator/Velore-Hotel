// src/components/ManageDishes.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apis } from "../utils/apis";
import { Toaster, toast } from "react-hot-toast";

const ManageDishes = () => {
  const [dishes, setDishes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const res = await fetch(apis().adminMenu, { credentials: "include" });
      const data = await res.json();
      setDishes(data);
    } catch (error) {
      console.error("Failed to fetch dishes", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const res = await fetch(apis().deleteMenu(id), {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setDishes((prev) => prev.filter((dish) => dish._id !== id));
      toast.success("✅ Dish deleted.");
    } else {
      toast.error("❌ Failed to delete.");
    }
  };

  return (
    <div className="container py-2">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">📋 Manage Dishes</h2>
        <button
          className="btn btn-success"
          onClick={() => navigate("/add/dish")}
        >
          + Add Dish
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((dish) => (
            <tr key={dish._id}>
              <td>
                <img src={dish.image} alt={dish.title} width="60" />
              </td>
              <td>{dish.title}</td>
              <td>₹{dish.price}</td>
              <td>
                {dish.category?.icon} {dish.category?.name}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => navigate(`/edit/dish/${dish._id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(dish._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageDishes;
