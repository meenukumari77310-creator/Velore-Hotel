// src/components/ManageCategories.jsx
import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import { toast } from "react-hot-toast";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "", description: "" });
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
  try {
    const res = await fetch(apis().adminGetCategories, {
      credentials: "include",
    });
    const data = await res.json();
    console.log("Categories fetched:", data); // Debug line
    setCategories(Array.isArray(data) ? data : data.data || []);
  } catch (err) {
    toast.error("❌ Failed to load categories");
  }
};


  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setForm({ name: "", icon: "", description: "" });
    setEditMode(false);
    setModalVisible(true);
  };

  const openEditModal = (category) => {
    setForm({
      name: category.name,
      icon: category.icon,
      description: category.description,
    });
    setEditId(category._id);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    const res = await fetch(apis().adminDeleteCategory(id), {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("✅ Category deleted.");
    } else {
      toast.error("❌ Delete failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode ? apis().adminUpdateCategory(editId) : apis().adminCreateCategory;
    const method = editMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success(editMode ? "✅ Category updated." : "✅ Category added.");
      setModalVisible(false);
      fetchCategories();
    } else {
      toast.error("❌ Failed to submit.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between mb-3">
        <h2>📦 Manage Categories</h2>
        <button className="btn btn-success" onClick={openAddModal}>
          + Add Category
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.icon}</td>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEditModal(cat)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(cat._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalVisible && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <form onSubmit={handleSubmit} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit Category" : "Add Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Icon (Emoji)</label>
                  <input
                    type="text"
                    name="icon"
                    className="form-control"
                    value={form.icon}
                    onChange={handleChange}
                    placeholder="e.g. 🥟"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={form.description}
                    onChange={handleChange}
                    rows="2"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  {editMode ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
