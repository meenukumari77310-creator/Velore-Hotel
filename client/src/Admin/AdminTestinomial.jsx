import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ name: "", review: "", location: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchTestimonials = async () => {
    const res = await fetch(apis().adminTestimonials, { credentials: "include" });
    const data = await res.json();
    setTestimonials(data || []);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${apis().adminTestimonials}/${editingId}`
      : apis().adminTestimonials;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(editingId ? "Updated" : "Added");
      setForm({ name: "", review: "", location: "" });
      setEditingId(null);
      fetchTestimonials();
    } else {
      toast.error(data.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const res = await fetch(`${apis().adminTestimonials}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      toast.success("Deleted");
      fetchTestimonials();
    } else {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (t) => {
    setForm({ name: t.name, review: t.review, location: t.location });
    setEditingId(t._id);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center text-success mb-4">Admin Testimonials</h2>

      <form className="p-4 bg-light rounded shadow-sm mb-4" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Customer Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="location"
              className="form-control"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="review"
              className="form-control"
              placeholder="Review"
              value={form.review}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mt-3">
          <button className="btn btn-success me-2" type="submit">
            {editingId ? "Update" : "Add"} Testimonial
          </button>
          {editingId && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", review: "", location: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="row g-3">
        {testimonials.map((t) => (
          <div className="col-md-4" key={t._id}>
            <div className="p-3 bg-white border rounded shadow-sm h-100">
              <p className="fst-italic">“{t.review}”</p>
              <h6 className="fw-bold mb-1">{t.name}</h6>
              <small className="text-muted">{t.location}</small>
              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(t)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;
