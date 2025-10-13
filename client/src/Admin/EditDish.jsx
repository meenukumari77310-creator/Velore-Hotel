// src/components/EditDish.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apis } from "../utils/apis";
import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormFileInput,
} from "./FormComponent";
import { toast } from "react-hot-toast";

const EditDish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dishRes, categoryRes] = await Promise.all([
          fetch(apis().adminMenuById(id), { credentials: "include" }),
          fetch(apis().adminGetCategories, { credentials: "include" }),
        ]);

        if (!dishRes.ok || !categoryRes.ok) throw new Error("Fetch failed");

        const dishData = await dishRes.json();
        const categoryData = await categoryRes.json();

        const actualDish = dishData.data || dishData;
        const categoryList = Array.isArray(categoryData)
          ? categoryData
          : categoryData.data || [];

        setForm({
          ...actualDish,
          category: actualDish.category?._id || "",
          image: null,
        });
        setPreview(actualDish.image);
        setCategories(categoryList);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAll();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === "price" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null) formData.append(key, form[key]);
    }

    try {
      const res = await fetch(apis().updateMenu(id), {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        toast.success("✅ Dish updated.");
        setTimeout(() => navigate("/manage/dish"), 1500);
      } else {
        toast.error("❌ Failed to update dish.");
      }
    } catch (error) {
      toast.error("❌ Something went wrong.");
    }
  };

  if (!form) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container py-2">
      <h2 className="mb-4 text-center">Edit Dish</h2>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="p-4 border rounded"
      >
        <FormInput
          name="title"
          label="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <FormInput
          name="price"
          type="number"
          label="Price (₹)"
          value={form.price}
          onChange={handleChange}
          required
        />
        <FormSelect
          name="category"
          label="Category"
          value={form.category}
          onChange={handleChange}
          options={categories.map((cat) => ({
            value: cat._id,
            label: `${cat.icon || ""} ${cat.name}`,
          }))}
        />
        <FormTextArea
          name="description"
          label="Description"
          value={form.description || ""}
          onChange={handleChange}
        />
        <FormFileInput
          name="image"
          label="New Image (optional)"
          onChange={handleChange}
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="img-fluid rounded mb-3"
            width={100}
          />
        )}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">
            Update
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/manage/dish")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDish;
