// components/FavoriteButton.jsx
import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { toast } from "react-hot-toast";
import { apis } from "../../utils/apis";

export const FavoriteButton = ({ note, initiallyLiked = false }) => {
  const [liked, setLiked] = useState(initiallyLiked);

  const toggleFavorite = async () => {
    const url = liked ? apis().RemoveFromFavorite : apis().AddToFavorite;

    try {
      const res = await fetchWithAuth(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notesName: note.title,
          price: note.price,
          pdfUrl: note.url,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to update favorites");
        return;
      }

      setLiked(!liked);
      toast.success(
        liked
          ? `${note.title} removed from favorites`
          : `${note.title} added to favorites`
      );
    } catch (err) {
      console.error("Favorite toggle failed:", err);
      toast.error("Error updating favorites");
    }
  };

  return (
    <span
      style={{ cursor: "pointer", fontSize: "1.5rem" }}
      title={liked ? "Remove from favorites" : "Add to favorites"}
      onClick={toggleFavorite}
    >
      {liked ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
    </span>
  );
};


