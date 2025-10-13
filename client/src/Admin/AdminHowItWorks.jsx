import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";

const AdminHowItWorks = () => {
  const [steps, setSteps] = useState([]);
  const [form, setForm] = useState({ icon: "", title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      const res = await fetch(apis().adminHowItWorks, {
        credentials: "include",
      });
      const data = await res.json();
      setSteps(data);
    } catch (err) {
      console.error("Failed to load steps:", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${apis().adminHowItWorks}/${editingId}`
        : apis().adminHowItWorks;

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ icon: "", title: "", description: "" });
        setEditingId(null);
        fetchSteps();
      }
    } catch (err) {
      console.error("Failed to submit step:", err.message);
    }
  };

  const handleEdit = (step) => {
    setForm(step);
    setEditingId(step._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this step?")) return;
    try {
      const res = await fetch(`${apis().adminHowItWorks}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchSteps();
    } catch (err) {
      console.error("Failed to delete step:", err.message);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage “How It Works” Steps</h2>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="row g-3">
          <div className="col-md-2">
            <input
              type="text"
              placeholder="Emoji/Icon"
              className="form-control"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Title"
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="col-md-5">
            <input
              type="text"
              placeholder="Description"
              className="form-control"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" type="submit">
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Icon</th>
              <th>Title</th>
              <th>Description</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s) => (
              <tr key={s._id}>
                <td style={{ fontSize: "1.5rem" }}>{s.icon}</td>
                <td>{s.title}</td>
                <td>{s.description}</td>
                <td>
                  <button
                    onClick={() => handleEdit(s)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {steps.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No steps added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHowItWorks;
