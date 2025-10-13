import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";

const AdminGalleryManager = () => {
  const [images, setImages] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
      const res = await fetch(apis().adminGetImages, { credentials: "include" });
      const data = await res.json();
      setImages(data);
    } catch (err) {
      toast.error("Failed to fetch images");
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please select an image");

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch(apis().adminAddImage, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success("✅ Image uploaded successfully!");
      setImage(null);
      setPreview(null);
      fetchImages();
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      const res = await fetch(apis().adminDeleteImage(id), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("🗑️ Image deleted");
      fetchImages();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🖼️ Admin Gallery Manager</h2>

      <form onSubmit={handleUpload} className="mb-4">
        <div className="mb-3">
          <label>Select Image</label>
          <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
        </div>

        {preview && (
          <div className="text-center mb-3">
            <img src={preview} alt="Preview" style={{ maxHeight: "250px" }} />
          </div>
        )}

        <button className="btn btn-success w-100" disabled={loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      <h4>📂 Existing Images:</h4>
      <div className="row">
        {images.map((img) => (
          <div key={img._id} className="col-md-4 mb-3">
            <div className="card">
              <img src={img.url} alt="Gallery" className="card-img-top" />
              <div className="card-body text-center">
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(img._id)}>
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

export default AdminGalleryManager;
