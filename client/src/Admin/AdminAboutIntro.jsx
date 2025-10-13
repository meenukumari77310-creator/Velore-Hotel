import React, { useState, useEffect, useRef } from "react";
import { apis } from "../utils/apis";
import './admin.css';
import Quill from "quill";
import "quill/dist/quill.snow.css";

const AboutAdmin = () => {
  const [form, setForm] = useState({
    header: "",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Quill editor ref
  const subHeaderRef = useRef(null);
  const quillInstance = useRef(null);

  // ------------------- Initialize Quill -------------------
  useEffect(() => {
    if (subHeaderRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(subHeaderRef.current, {
        theme: "snow",
        placeholder: "Enter sub text or description",
      });
    }
  }, []);

  // ------------------- Load Data -------------------
  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const res = await fetch(apis().adminIntro, { credentials: "include" });
        const data = await res.json();
        if (data) {
          setForm({
            header: data.header || "",
            image: null,
          });
          if (quillInstance.current) {
            quillInstance.current.root.innerHTML = data.subHeader || "";
          }
          setPreviewUrl(data.imageUrl || "");
        }
      } catch (err) {
        console.error("Failed to fetch intro data", err);
      }
    };
    fetchIntro();
  }, []);

  // ------------------- File Change -------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ------------------- Submit -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("header", form.header);
    formData.append(
      "subHeader",
      quillInstance.current?.root.innerHTML || ""
    );
    if (form.image) formData.append("image", form.image);

    try {
      const res = await fetch(apis().adminIntro, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      alert("Intro section updated successfully!");
      if (data.imageUrl) setPreviewUrl(data.imageUrl);
    } catch (err) {
      console.error("Failed to update intro", err);
      alert("Error saving intro section.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Render -------------------
  return (
    <div className="container admin-container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h2 className="mb-4 fw-bold text-primary">Edit About Intro</h2>

          <form onSubmit={handleSubmit} className="admin-form">
            {/* Header */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Header</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter main headline"
                value={form.header}
                onChange={(e) => setForm({ ...form, header: e.target.value })}
                required
              />
            </div>

            {/* Sub Header (Quill) */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Sub Header</label>
              <div ref={subHeaderRef} style={{ minHeight: "150px" }} />
            </div>

            {/* Upload Image */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <div className="preview-wrapper mt-3 text-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="img-fluid rounded shadow"
                  />
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="mb-4">
              <h5>Live Preview</h5>
              <div className="p-3 border rounded bg-light">
                <h3>{form.header}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: quillInstance.current
                      ? quillInstance.current.root.innerHTML
                      : "",
                  }}
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="img-fluid mt-2 rounded"
                  />
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="d-grid">
              <button
                className="btn btn-primary btn-lg"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AboutAdmin;
