// AdminRoomBookings.js
import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminRoomBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(apis().getAllRoomBookings, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdate = async (id, updates) => {
    try {
      const res = await fetch(apis().updateRoomBooking(id), {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update booking");
      fetchBookings();
      alert("Booking updated successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(apis().deleteRoomBooking(id), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete booking");
      fetchBookings();
      alert("Booking deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Room Bookings</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Country</th>
              <th>Room</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.name}</td>
                <td>{b.email}</td>
                <td>{b.phone}</td>
                <td>{b.address}</td>
                <td>{b.country}</td>
                <td>
                  {b.room?.roomSummary?.name || "No room"} - ${b.room?.price || "N/A"}
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={b.status}
                    onChange={(e) =>
                      handleUpdate(b._id, { status: e.target.value })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(b._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRoomBookings;
