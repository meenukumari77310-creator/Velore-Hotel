import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apis } from "../utils/apis";
import Papa from "papaparse";
import "./admin.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const totalTables = 10;

  // Fetch Bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch(apis().getBooking, { credentials: "include" });
      const data = await res.json();
      setBookings(data);
    } catch {
      toast.error("Failed to fetch bookings");
    }
  };

  // Update Status
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(apis().putBooking(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b._id === updated._id ? updated : b))
      );
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Delete Booking
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      const res = await fetch(apis().deleteBooking(id), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success("Booking deleted");
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  // Filter Bookings
  const filterBookings = () => {
    return bookings.filter((b) => {
      const statusMatch = filterStatus === "all" || b.status === filterStatus;

      const bookingDate = new Date(b.date).setHours(0, 0, 0, 0);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

      const dateMatch =
        (!start || bookingDate >= start) && (!end || bookingDate <= end);

      return statusMatch && dateMatch;
    });
  };

  // Download Filtered CSV
  const handleDownloadCSV = () => {
    const filtered = filterBookings();
    if (filtered.length === 0) {
      toast.error("No bookings match the filters.");
      return;
    }
    const csv = Papa.unparse(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `bookings_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats
  const today = new Date().toISOString().split("T")[0];
  const confirmedToday = bookings.filter(
    (b) =>
      new Date(b.date).toISOString().split("T")[0] === today &&
      b.status === "confirmed"
  ).length;
  const availableTables = totalTables - confirmedToday;

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="admin-bookings-container py-2">
      <h2>📋 Booking Dashboard</h2>

      {/* Stats */}
      <div className="booking-stats mt-4">
        <p>
          <strong>Reserved Tables Today:</strong> {confirmedToday} /{" "}
          {totalTables}
        </p>
        <p>
          <strong>Available Tables:</strong>{" "}
          {availableTables >= 0 ? availableTables : 0}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-3 d-flex flex-wrap gap-2 align-items-end">
        <div>
          <label className="form-label mb-0">Status</label>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <div>
          <label className="form-label mb-0">From Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label mb-0">To Date</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button onClick={handleDownloadCSV} className="btn btn-success">
          📥 Download CSV
        </button>
      </div>

      {/* Bookings Table */}
      {bookings.length === 0 ? (
        <p className="no-bookings">No bookings yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date & Time</th>
                <th>Guests</th>
                <th>Country</th> {/* Added */}
                <th>Address</th> {/* Added */}
                <th>Status</th>
                <th>Change</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterBookings().map((b) => (
                <tr key={b._id}>
                  <td>{b.name}</td>
                  <td>{b.email}</td>
                  <td>
                    {new Date(b.date).toLocaleDateString()} @ {b.time}
                  </td>
                  <td>{b.guests}</td>
                  <td>{b.country || "-"}</td>{" "}
                  {/* Show country or dash if empty */}
                  <td>{b.address || "-"}</td>{" "}
                  {/* Show address or dash if empty */}
                  <td>
                    <span className={`status-badge ${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="btn btn-sm btn-danger"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
