import React, { useEffect, useState } from "react";
import "../App.css";
import { apis } from "../utils/apis";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/CartSlice";
import { addToFavorite } from "../Redux/FavoriteSlice";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import { BsEyeFill } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import UserInfo from "./UserInfo";
import { useLocation } from "react-router-dom";

const categoryMeta = {
  appetizers: { icon: "🥟", label: "Appetizers" },
  "main course": { icon: "🍛", label: "Main Course" },
  desserts: { icon: "🍰", label: "Desserts" },
  beverages: { icon: "🥤", label: "Beverages" },
  vegan: { icon: "🥦", label: "Vegan" },
  "kids menu": { icon: "🧒", label: "Kids Menu" },
};

const getCategoryIcon = (category) =>
  categoryMeta[category?.toLowerCase()]?.icon || "🍽️";
const getCategoryLabel = (category) =>
  categoryMeta[category?.toLowerCase()]?.label || capitalize(category);
const getCategoryColor = (category) => {
  const c = category?.toLowerCase();
  if (c === "appetizers") return "text-warning";
  if (c === "main course") return "text-danger";
  if (c === "desserts") return "text-pink";
  if (c === "beverages") return "text-primary";
  if (c === "vegan") return "text-success";
  if (c === "kids menu") return "text-info";
  return "text-secondary";
};
const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [checkoutDish, setCheckoutDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get("category");

  const handleAddToCart = async (dish) => {
    try {
      const res = await fetch(apis().addCart, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dishId: dish._id }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(addToCart(dish));
        toast.success(`${dish.title} added to cart!`);
      } else toast.error(data.message || "Failed to add to cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleAddToFavorite = async (dish) => {
    try {
      const res = await fetch(apis().addFavorite, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dishId: dish._id }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(addToFavorite(dish));
        toast.success(`${dish.title} added to favorites`);
      } else toast.error(data.message || "Failed to add to favorites");
    } catch {
      toast.error("Error adding to favorites");
    }
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(apis().userMenu, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Menu data invalid");
        setDishes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredDishes = dishes.filter((dish) => {
    const titleMatch = dish.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatch = dish.category?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const queryMatch = selectedCategory
      ? dish.category?.name?.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    return (titleMatch || categoryMatch) && queryMatch;
  });

  const categorizedDishes = filteredDishes.reduce((acc, dish) => {
    const key = dish.category?.name?.toLowerCase();
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(dish);
    return acc;
  }, {});

  const titleSuggestions = filteredDishes.slice(0, 5);
  const categorySuggestions = Object.keys(categorizedDishes)
    .filter((cat) =>
      getCategoryLabel(cat).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 3);
  const allSuggestions = [...titleSuggestions, ...categorySuggestions];

  return (
    <section className="py-5 bg-light position-relative">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container">
        <h2 className="mb-4 text-center fw-bold text-danger">Our Menu</h2>

        {/* Search Input */}
        <div className="mb-4 text-center position-relative">
          <input
            type="text"
            placeholder="🔍 Search dishes or category..."
            className="form-control w-50 mx-auto"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHighlightedIndex(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                  prev + 1 >= allSuggestions.length ? 0 : prev + 1
                );
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                  prev <= 0 ? allSuggestions.length - 1 : prev - 1
                );
              } else if (e.key === "Enter") {
                if (highlightedIndex >= 0) {
                  const item = allSuggestions[highlightedIndex];
                  if (typeof item === "string") {
                    setSearchTerm(getCategoryLabel(item));
                  } else {
                    setSearchTerm(item.title);
                  }
                  setHighlightedIndex(-1);
                }
              }
            }}
            autoComplete="off"
          />

          {searchTerm && (
            <div
              className="suggestion-box mx-auto mt-2 bg-white border rounded shadow-sm text-start"
              style={{
                maxWidth: "50%",
                zIndex: 1000,
                position: "absolute",
                left: "25%",
                right: "25%",
                padding: "0.5rem 0",
              }}
            >
              {allSuggestions.map((item, idx) => {
                const isHighlighted = idx === highlightedIndex;
                const isCategory = typeof item === "string";
                return (
                  <div
                    key={isCategory ? `cat-${idx}` : `dish-${item._id}`}
                    className={`px-3 py-2 suggestion-item ${
                      isHighlighted ? "bg-light fw-bold" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => {
                      if (isCategory) {
                        setSearchTerm(getCategoryLabel(item));
                      } else {
                        setSearchTerm(item.title);
                      }
                      setHighlightedIndex(-1);
                    }}
                  >
                    {isCategory
                      ? `${getCategoryIcon(item)} ${getCategoryLabel(item)} (category)`
                      : `🍽️ ${item.title}`}
                  </div>
                );
              })}

              {allSuggestions.length === 0 && (
                <div className="px-3 py-2 text-muted">No matches found</div>
              )}
            </div>
          )}
        </div>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-danger">{error}</p>}

        {!loading && !error && Object.keys(categorizedDishes).length > 0 ? (
          Object.entries(categorizedDishes).map(([category, items]) => (
            <DishSection
              key={category}
              title={getCategoryLabel(category)}
              icon={getCategoryIcon(category)}
              dishes={items}
              colorClass={getCategoryColor(category)}
              setSelectedDish={setSelectedDish}
              handleAddToCart={handleAddToCart}
              handleAddToFavorite={handleAddToFavorite}
              setCheckoutDish={setCheckoutDish}
            />
          ))
        ) : (
          <p className="text-center text-muted">No dishes match your search.</p>
        )}

        <div className="text-center mt-5">
          <a href="/menu" className="btn btn-lg btn-danger px-5 shadow">
            Order Your Favorites Now
          </a>
        </div>
      </div>

      {selectedDish && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <button
              className="close-button"
              onClick={() => setSelectedDish(null)}
            >
              &times;
            </button>
            <img
              src={selectedDish.image}
              alt={selectedDish.title}
              className="img-fluid rounded mb-3"
            />
            <h4>{selectedDish.title}</h4>
            <p>{selectedDish.description}</p>
            <h5>₹{selectedDish.price.toFixed(2)}</h5>
            <div className="d-flex gap-2 justify-content-center">
              <button
                className="btn btn-danger"
                onClick={async () => {
                  await handleAddToFavorite(selectedDish);
                  setSelectedDish(null);
                }}
              >
                ❤️ Favorite
              </button>
              <button
                className="btn btn-secondary"
                onClick={async () => {
                  await handleAddToCart(selectedDish);
                  setSelectedDish(null);
                }}
              >
                🛒 Cart
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  setCheckoutDish(selectedDish);
                  setSelectedDish(null);
                }}
              >
                ✅ Order
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutDish && (
        <UserInfo dish={checkoutDish} onClose={() => setCheckoutDish(null)} />
      )}
    </section>
  );
};

const DishSection = ({
  title,
  icon,
  dishes,
  colorClass,
  setSelectedDish,
  handleAddToCart,
  handleAddToFavorite,
  setCheckoutDish,
}) => (
  <>
    <h4 className={`mb-4 text-center text-uppercase fw-semibold ${colorClass}`}>
      {icon} {title}
    </h4>
    <div className="row g-4 mb-5">
      {dishes.map((dish, i) => (
        <div key={i} className="col-sm-6 col-md-4">
          <div className="card p-4 h-100 text-center shadow-sm rounded dish-cards">
            <div className="image-wrapper position-relative">
              <img
                src={dish.image}
                alt={dish.title}
                className="w-100 rounded"
              />
              <div className="icon-stack position-absolute top-0 end-0 m-2 d-flex flex-column gap-2">
                <div
                  className="icon-box"
                  title="Favorite"
                  onClick={() => handleAddToFavorite(dish)}
                >
                  <FaHeart size={22} color="#e63946" />
                </div>
                <div
                  className="icon-box"
                  title="Cart"
                  onClick={() => handleAddToCart(dish)}
                >
                  <FaCartPlus size={22} color="#343a40" />
                </div>
                <div
                  className="icon-box"
                  title="Details"
                  onClick={() => setSelectedDish(dish)}
                >
                  <BsEyeFill size={22} color="#0d6efd" />
                </div>
              </div>
            </div>
            <h5 className="mt-3">{dish.title}</h5>
            <span
              className="price-badge"
              style={{ cursor: "pointer" }}
              onClick={() => setCheckoutDish(dish)}
              title="Order this now"
            >
              ₹{dish.price.toFixed(2)}
            </span>
            <p className="mt-2 text-muted">{dish.description}</p>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default Menu;
