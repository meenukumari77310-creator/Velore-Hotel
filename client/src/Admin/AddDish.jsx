// === src/components/AddDish.jsx ===
import React, { useState, useEffect } from "react";
import { apis } from "../utils/apis";
import { FormInput, FormSelect, FormTextArea, FormFileInput } from "./FormComponent";
import { toast } from "react-hot-toast";

const defaultForm = {
  title: "",
  price: "",
  category: "",
  description: "",
  image: null,
};

const AddDish = () => {
  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

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


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);

    try {
      const res = await fetch(apis().createMenu, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add dish");

      toast.success("✅ Dish added successfully");
      setForm(defaultForm);
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error adding dish.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-2">
      <h2 className="mb-4 text-center">Add New Dish</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <FormInput name="title" label="Title" value={form.title} onChange={handleChange} required />
        <FormInput name="price" type="number" label="Price (₹)" value={form.price} onChange={handleChange} required />
        <FormSelect
          name="category"
          label="Category"
          value={form.category}
          onChange={handleChange}
          options={categories.map((cat) => ({ value: cat._id, label: `${cat.icon || ""} ${cat.name}` }))}
        />
        <FormTextArea name="description" label="Description" value={form.description} onChange={handleChange} />
        <FormFileInput name="image" label="Dish Image" onChange={handleChange} required />

        {preview && <img src={preview} alt="Preview" className="img-fluid rounded border mb-3" />}

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Uploading..." : "Add Dish"}
        </button>
      </form>
    </div>
  );
};

export default AddDish;
