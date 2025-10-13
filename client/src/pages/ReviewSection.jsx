import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { apis } from "../utils/apis";

const StarRating = ({ current, setCurrent, disabled = false }) => (
  <div>
    {[1, 2, 3, 4, 5].map((i) =>
      i <= current ? (
        <AiFillStar
          key={i}
          size={24}
          className="me-1 text-warning"
          style={{ cursor: disabled ? "default" : "pointer" }}
          onClick={() => !disabled && setCurrent(i)}
        />
      ) : (
        <AiOutlineStar
          key={i}
          size={24}
          className="me-1 text-warning"
          style={{ cursor: disabled ? "default" : "pointer" }}
          onClick={() => !disabled && setCurrent(i)}
        />
      )
    )}
  </div>
);

const ReviewSection = ({ reviews = [], onlyDisplay = false, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(apis().addReview, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });

      if (res.ok) {
        toast.success("Review submitted");
        setRating(0);
        setComment("");
        if (onReviewAdded) onReviewAdded(); // notify parent to refresh
      } else {
        const text = await res.text();
        toast.error("Failed: " + text);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="py-3">
      {!onlyDisplay && (
        <>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Your Rating</label>
              <StarRating current={rating} setCurrent={setRating} />
            </div>
            <div className="mb-3">
              <label className="form-label">Your Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-control"
                rows="3"
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Submit</button>
          </form>
          <hr />
        </>
      )}

      <h5 className="text-success mb-3">User Feedback</h5>
      {reviews.length > 0 ? (
        reviews.map((r) => (
          <div key={r._id} className="mb-3 border-bottom pb-2">
            <strong>{r.user?.name || "Anonymous"}</strong>
            <div className="mb-1">
              <StarRating current={r.rating} setCurrent={() => {}} disabled={true} />
            </div>
            <p>{r.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-muted">No reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewSection;
