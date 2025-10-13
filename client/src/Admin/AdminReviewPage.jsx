import React, { useEffect, useState } from "react";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import { apis } from "../utils/apis";

const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState("");
  const [editComment, setEditComment] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(apis().adminGetAllReviews, {
        credentials: "include",
      });
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    setDeleting(id);
    try {
      const res = await fetch(apis().adminDeleteReview(id), {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Error deleting review.");
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = async () => {
    if (!editRating || !editComment) {
      alert("Rating and comment are required");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(apis().adminUpdateReview(editingReview._id), {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: editRating,
          comment: editComment,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      setReviews((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
      setEditingReview(null);
    } catch (err) {
      alert("Error updating review.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">📋 Review Management</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : reviews.length === 0 ? (
        <Alert variant="info">No reviews found.</Alert>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id}>
                <td>{r.user?.name || "Anonymous"}</td>
                <td>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      style={{
                        color: i < r.rating ? "#f5c518" : "#ccc",
                        fontSize: "1.2rem",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </td>

                <td>{r.comment}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditClick(r)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={deleting === r._id}
                    onClick={() => handleDelete(r._id)}
                  >
                    {deleting === r._id ? "Deleting..." : "Delete"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Edit Form */}
      {editingReview && (
        <div className="mt-4 border p-3">
          <h5>Edit Review</h5>
          <div className="mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setEditRating(star)}
                style={{
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: star <= editRating ? "#f5c518" : "#ccc",
                }}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            className="form-control mb-2"
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
          />
          <Button variant="primary" onClick={handleUpdate} disabled={updating}>
            {updating ? "Updating..." : "Update Review"}
          </Button>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => setEditingReview(null)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminReviewPage;
