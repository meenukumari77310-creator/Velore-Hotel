import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { apis } from "../utils/apis";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(apis().order, { credentials: "include" });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(`${apis().order}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } else {
      toast.error("Failed to update status");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    const res = await fetch(`${apis().order}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      toast.success("Order deleted");
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } else {
      toast.error("Failed to delete order");
    }
  };

  const downloadCSV = () => {
    if (orders.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Country/Address",
      "Dish",
      "Quantity",
      "Total Amount",
      "Status",
      "Placed At",
    ];

    const rows = orders.map((o) => [
      o.name,
      o.email,
      o.phone,
      o.country || o.address || "N/A",
      o.dishName,
      o.quantity,
      o.totalAmount,
      o.status,
      new Date(o.createdAt).toLocaleString(),
    ]);

    const csvContent =
      [headers, ...rows]
        .map((e) => e.map((x) => `"${x}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "failed":
        return "danger";
      default:
        return "warning";
    }
  };

  return (
    <div className="container my-4">
      <Toaster />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📦 Manage Orders</h2>
        <button className="btn btn-primary" onClick={downloadCSV}>
          📥 Download CSV
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info text-center">No orders available.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country/Address</th>
                <th>Dish</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o.name}</td>
                  <td>{o.email}</td>
                  <td>{o.phone}</td>
                  <td>{o.country || o.address || "N/A"}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={o.dishImage}
                        alt={o.dishName}
                        className="rounded me-2"
                        style={{ width: "45px", height: "45px", objectFit: "cover" }}
                      />
                      {o.dishName}
                    </div>
                  </td>
                  <td>{o.quantity}</td>
                  <td>₹{o.totalAmount}</td>
                  <td>
                    <span className={`badge bg-${getStatusBadge(o.status)} px-3 py-2`}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>
  <select
    className="form-select form-select-sm mb-1"
    value={o.status}
    onChange={(e) => updateStatus(o._id, e.target.value)}
  >
    <option value="pending">Pending</option>
    <option value="completed">Completed</option>
    <option value="failed">Failed</option>
  </select>
  <button
    className="btn btn-sm btn-outline-secondary"
    onClick={() => deleteOrder(o._id)}
  >
    🗑️ Delete
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

export default AdminOrders;
