import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";

const AdminWhyChoose = () => {
  const [features, setFeatures] = useState([]);
  const [form, setForm] = useState({ icon: "", title: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    const res = await fetch(apis().adminWhyChoose,{
        credentials: 'include',
    });
    const data = await res.json();
    setFeatures(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `${apis().adminWhyChoose}/${editId}`
      : apis().adminWhyChoose;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: 'include',
    });

    setForm({ icon: "", title: "" });
    setEditId(null);
    fetchFeatures();
  };

  const handleDelete = async (id) => {
    await fetch(`${apis().adminWhyChoose}/${id}`, { method: "DELETE", credentials: 'include',});
    fetchFeatures();
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setForm({ icon: item.icon, title: item.title });
  };

  return (
    <div className="container py-4">
      <h2>Manage Why Choose Us</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Icon class (e.g. fa-leaf)"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          required
          className="me-3"
        />
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary ms-2">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(features) &&
            features.map((item) => (
              <tr key={item._id}>
                <td>
                  <i className={`fas ${item.icon}`}></i> {item.icon}
                </td>
                <td>{item.title}</td>
                <td>
                  <button
                    onClick={() => startEdit(item)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminWhyChoose;
