import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import toast, { Toaster } from "react-hot-toast";

export const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await fetchWithAuth(apis().getFavorite);
      const data = await res.json();
      if (res.ok) {
        setFavorites(data);
      } else {
        toast.error("Failed to fetch favorites");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Error fetching favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (dishId) => {
    try {
      const res = await fetch(apis().deleteFavorite(dishId), {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setFavorites(favorites.filter((item) => item.dishId !== dishId));
        toast.success("Removed from favorites");
      } else {
        toast.error("Failed to remove");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing item");
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetchWithAuth(apis().clearFavorite, {
        method: "DELETE",
      });

      if (res.ok) {
        setFavorites([]);
        toast.success("Favorites cleared");
      } else {
        toast.error("Failed to clear favorites");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error clearing favorites");
    }
  };

  return (
    <div className="page-content container my-5">
      <Toaster position="top-right" />
      <h2 className="mb-4 text-center fw-bold text-danger">Your Favorites</h2>

      {loading ? (
        <p className="text-center text-muted">Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <p className="text-center text-warning">No favorite items found.</p>
      ) : (
        <>
          <table className="table table-striped table-hover shadow">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Dish</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={item.dishImage}
                      alt={item.dishTitle}
                      style={{
                        width: 60,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </td>
                  <td>{item.dishTitle}</td>
                  <td>
                    {item.dishCategory?.icon} {item.dishCategory?.name || "N/A"}
                  </td>
                  <td>{item.dishPrice.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemove(item.dishId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center mt-4">
            <button className="btn btn-outline-danger" onClick={handleClearAll}>
              Clear All Favorites
            </button>
          </div>
        </>
      )}
    </div>
  );
};
