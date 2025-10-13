import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";

const AdminBlogPanel = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", image: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchPosts = async () => {
    const res = await fetch(apis().adminGetBlogs, { credentials: "include" });

    if (!res.ok) {
      const text = await res.text(); // show the actual error HTML
      console.error("Fetch failed:", text);
      return toast.error("Failed to fetch blog posts");
    }

    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? apis().adminBlogById(editingId)
      : apis().adminCreateBlog;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("author", "Admin");

    // Only add image if a new file was selected
    if (form.image instanceof File) {
      formData.append("image", form.image);
    }

    const res = await fetch(url, {
      method,
      credentials: "include",
      body: formData,
    });

    if (res.ok) {
      toast.success("Saved");
      setForm({ title: "", content: "", image: "" });
      setEditingId(null);
      fetchPosts();
    } else {
      toast.error("Error saving post");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await fetch(apis().adminBlogById(id), {
      method: "DELETE",
      credentials: "include",
    });
    fetchPosts();
  };

  return (
    <div className="container mt-4">
      <h2>📝 Admin Blog Panel</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Title"
          className="form-control mb-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          className="form-control mb-2"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          className="form-control mb-2"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />

        <button className="btn btn-primary" type="submit">
          {editingId ? "Update" : "Create"} Post
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingId(null);
              setForm({ title: "", content: "", image: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p._id}>
              <td>{p.title}</td>
              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-secondary me-2"
                  onClick={() => {
                    setEditingId(p._id);
                    setForm({
                      title: p.title,
                      content: p.content,
                      image: p.image,
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(p._id)}
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

export default AdminBlogPanel;
