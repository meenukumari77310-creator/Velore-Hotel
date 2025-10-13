import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";

const AdminMission = () => {
  const [missions, setMissions] = useState([]);
  const [form, setForm] = useState({ icon: "", title: "", description: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    const res = await fetch(apis().adminMission, {
      credentials: "include",
    });
    const data = await res.json();
    setMissions(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `${apis().adminMission}/${editId}`
      : apis().adminMission;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });

    setForm({ icon: "", title: "", description: "" });
    setEditId(null);
    fetchMissions();
  };

  const handleDelete = async (id) => {
    await fetch(`${apis().adminMission}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchMissions();
  };

  const startEdit = (item) => {
    setForm({
      icon: item.icon,
      title: item.title,
      description: item.description,
    });
    setEditId(item._id);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Missions</h2>

      <form onSubmit={handleSubmit} className="row g-2 mb-4">
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Icon (e.g. FaBullseye)"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Icon</th>
            <th>Title</th>
            <th>Description</th>
            <th style={{ width: "160px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((m) => (
            <tr key={m._id}>
              <td>{m.icon}</td>
              <td>{m.title}</td>
              <td>{m.description}</td>
              <td>
                <button
                  onClick={() => startEdit(m)}
                  className="btn btn-sm btn-warning me-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {missions.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No missions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMission;
