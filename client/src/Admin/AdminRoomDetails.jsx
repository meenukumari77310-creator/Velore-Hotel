import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import toast, { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminRoomDetail() {
  const [summaries, setSummaries] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [details, setDetails] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    price: "",
    totalRooms: "",
    amenities: "",
    availableRooms: "",
    isAvailable: true,
    description: "",
    maxGuests: "",
    size: "",
    bedType: "",
    rating: "",
    images: [],
  };

  const [formData, setFormData] = useState(emptyForm);

  // Fetch summaries
  useEffect(() => {
    fetch(apis().getRoom, { credentials: "include" })
      .then((res) => res.json())
      .then(setSummaries)
      .catch(() => toast.error("Failed to fetch rooms"));
  }, []);

  // Fetch room details
  const fetchDetails = (id) => {
    if (!id) return setDetails([]);
    fetch(apis().getRoomDetail(id), { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setDetails(Array.isArray(data) ? data : []))
      .catch(() => setDetails([]));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData({ ...formData, images: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!selectedId) return toast.error("Select a room first");

    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (key === "images" && val.length > 0) {
        val.forEach((file) => fd.append("images", file));
      } else {
        fd.append(key, val);
      }
    });

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? apis().updateRoomDetail(editingId)
      : apis().addRoomDetail(selectedId);

    try {
      const res = await fetch(url, {
        method,
        body: fd,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save detail");
      await res.json();
      toast.success(editingId ? "Detail updated" : "Detail added");
      fetchDetails(selectedId);
      setFormData(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this detail?")) return;

    try {
      const res = await fetch(apis().deleteRoomDetail(id), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete detail");
      await res.json();
      toast.success("Detail deleted");
      fetchDetails(selectedId);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Delete failed");
    }
  };

  const handleEdit = (detail) => {
    setEditingId(detail._id);
    setFormData({
      price: detail.price || "",
      totalRooms: detail.totalRooms || "",
      availableRooms: detail.availableRooms || 0,
      isAvailable: detail.isAvailable ?? true,
      amenities: detail.amenities?.join(",") || "",
      description: detail.description || "",
      maxGuests: detail.maxGuests || 2,
      size: detail.size || "",
      bedType: detail.bedType || "",
      rating: detail.rating || 0,
      images: [],
    });
  };

  // Delete a single image
  const handleRemoveImage = async (detailId, imgUrl) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await fetch(apis().removeRoomImage, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ detailId, imageUrl: imgUrl }),
      });
      if (!res.ok) throw new Error("Failed to remove image");
      const data = await res.json();
      toast.success("Image removed");
      setDetails((prev) =>
        prev.map((item) =>
          item._id === detailId ? { ...item, images: data.images } : item
        )
      );
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Remove failed");
    }
  };

  return (
    <div className="container my-4">
      <Toaster position="top-right" />
      <h1 className="mb-4">Admin - Manage Room Details</h1>

      <div className="mb-4">
        <select
          className="form-select"
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setFormData(emptyForm);
            setEditingId(null);
            fetchDetails(e.target.value);
          }}
        >
          <option value="">Select a room</option>
          {summaries.map((room) => (
            <option key={room._id} value={room._id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      {selectedId && (
        <div className="card mb-4 p-3 shadow-sm">
          <h5>{editingId ? "Edit Room Detail" : "Add Room Detail"}</h5>
          <div className="row g-3 mt-2">
            <div className="col-md-3">
              <input
                className="form-control"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                name="totalRooms"
                placeholder="Total Rooms"
                value={formData.totalRooms}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                name="amenities"
                placeholder="Amenities (comma separated)"
                value={formData.amenities}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                name="maxGuests"
                placeholder="Max Guests"
                value={formData.maxGuests}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                name="size"
                placeholder="Size"
                value={formData.size}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                name="bedType"
                placeholder="Bed Type"
                value={formData.bedType}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                name="rating"
                placeholder="Rating"
                value={formData.rating}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="col-md-12">
              <textarea
                className="form-control"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12">
              <input
                type="file"
                className="form-control"
                name="images"
                multiple
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                name="availableRooms"
                placeholder="Available Rooms"
                value={formData.availableRooms}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="col-md-3 form-check mt-4">
              <input
                type="checkbox"
                className="form-check-input"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) =>
                  setFormData({ ...formData, isAvailable: e.target.checked })
                }
              />
              <label className="form-check-label">Available?</label>
            </div>
            <div className="col-md-12">
              <button className="btn btn-success mt-2" onClick={handleSave}>
                {editingId ? "Update Detail" : "Add Detail"}
              </button>
            </div>
          </div>
        </div>
      )}

      {details.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Price</th>
                <th>Total Rooms</th>
                <th>Amenities</th>
                <th>Max Guests</th>
                <th>Size</th>
                <th>Available Rooms</th>
                <th>Status</th>
                <th>Bed Type</th>
                <th>Rating</th>
                <th>Description</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {details.map((d, idx) => (
                <tr key={d._id}>
                  <td>{idx + 1}</td>
                  <td>{d.price}</td>
                  <td>{d.totalRooms}</td>
                  <td>{d.amenities?.join(", ")}</td>
                  <td>{d.maxGuests}</td>
                  <td>{d.size}</td>
                  <td>{d.availableRooms}</td>
                  <td>{d.isAvailable ? "Available ✅" : "Not Available ❌"}</td>
                  <td>{d.bedType}</td>
                  <td>{d.rating}</td>
                  <td title={d.description}>
                    {d.description.length > 20
                      ? d.description.substring(0, 20) + "..."
                      : d.description}
                  </td>
                  <td>
                    {d.images && d.images.length > 0 && (
                      <div className="d-flex flex-wrap gap-1">
                        {d.images.map((imgUrl, i) => (
                          <div key={i} className="position-relative">
                            <img
                              src={imgUrl}
                              alt={`room-${i}`}
                              width="50"
                              className="rounded"
                            />
                            <button
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                              style={{ fontSize: "10px", padding: "2px 5px" }}
                              onClick={() => handleRemoveImage(d._id, imgUrl)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-1"
                      onClick={() => handleEdit(d)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(d._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminRoomDetail;
