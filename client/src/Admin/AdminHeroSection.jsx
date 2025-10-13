// AdminHeroSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { apis } from "../utils/apis";

const AdminHeroSection = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [slidesPreview, setSlidesPreview] = useState([]);
  const [slidesFiles, setSlidesFiles] = useState([]);
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHeroSection = useCallback(async () => {
    try {
      const res = await fetch(apis().getHeroSection, {
        credentials: "include",
      });
      const data = await res.json();
      setHeroData(data);

      if (data) {
        setValue("greeting", data.greeting || "");
        setValue("description", data.description || "");
        setValue("textColor", data.textColor || "#ffffff");
        setValue("fontSize", data.fontSize || 36);
        setValue("textAlign", data.textAlign || "center");
        setSlidesPreview(data.slides?.map((slide) => slide.url) || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, [setValue]);

  useEffect(() => {
    fetchHeroSection();
  }, [fetchHeroSection]);

  const handleSlidesChange = (e) => {
    const files = Array.from(e.target.files);

    // Append new files to the old ones
    setSlidesFiles((prev) => [...prev, ...files]);

    // Create previews for new files
    const previews = files.map((file) => URL.createObjectURL(file));
    setSlidesPreview((prev) => [...prev, ...previews]);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
formData.append("greetings[morning]", data.greetingMorning);
formData.append("greetings[afternoon]", data.greetingAfternoon);
formData.append("greetings[evening]", data.greetingEvening);
formData.append("greetings[night]", data.greetingNight);
formData.append("description", data.description);
formData.append("textColor", data.textColor);
formData.append("fontSize", data.fontSize);
formData.append("textAlign", data.textAlign);
slidesFiles.forEach((file) => formData.append("slides", file));

      const endpoint = heroData
        ? apis().updateHeroSection
        : apis().addHeroSection;
      const method = heroData ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to save hero section");
      await res.json();
      alert("Hero section updated!");
      setSlidesFiles([]);
      fetchHeroSection();
    } catch (err) {
      console.error(err);
      alert("Error updating hero section");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlide = async (slideUrl) => {
    try {
      const res = await fetch(`${apis().deleteHeroSection}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slidesToDelete: [slideUrl] }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete slide");
      await res.json();

      // Remove slide locally from previews and files
      setSlidesPreview((prev) => prev.filter((url) => url !== slideUrl));
      setSlidesFiles((prev) =>
        prev.filter((file) => URL.createObjectURL(file) !== slideUrl)
      );
    } catch (err) {
      console.error(err);
      alert("Error deleting slide");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Admin Hero Section</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Morning Greeting (6 AM - 12 PM)</label>
          <input
            type="text"
            className="form-control"
            {...register("greetingMorning")}
          />
        </div>

        <div className="mb-3">
          <label>Afternoon Greeting (12 PM - 6 PM)</label>
          <input
            type="text"
            className="form-control"
            {...register("greetingAfternoon")}
          />
        </div>

        <div className="mb-3">
          <label>Evening Greeting (6 PM - 10 PM)</label>
          <input
            type="text"
            className="form-control"
            {...register("greetingEvening")}
          />
        </div>

        <div className="mb-3">
          <label>Night Greeting (10 PM - 6 AM)</label>
          <input
            type="text"
            className="form-control"
            {...register("greetingNight")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            {...register("description")}
            className="form-control"
            rows="3"
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Text Color:</label>
          <input
            type="color"
            {...register("textColor")}
            className="form-control form-control-color"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Font Size:</label>
          <input
            type="number"
            {...register("fontSize")}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Text Align:</label>
          <select {...register("textAlign")} className="form-select">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Slides:</label>
          <input
            type="file"
            multiple
            onChange={handleSlidesChange}
            className="form-control"
          />
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {slidesPreview.map((slide, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={slide}
                alt={`slide-${index}`}
                className="img-thumbnail"
                style={{ width: "150px", height: "100px", objectFit: "cover" }}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm"
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  padding: "2px 6px",
                  fontSize: "12px",
                }}
                onClick={() => handleDeleteSlide(slide)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Hero Section"}
        </button>
      </form>
    </div>
  );
};

export default AdminHeroSection;
