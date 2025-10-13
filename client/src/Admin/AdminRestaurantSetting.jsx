import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";

const AdminRestaurantSettings = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    openTime: "",
    closeTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [settingsExist, setSettingsExist] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(apis().getRestaurantDetails, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok && data.name) {
          const [openTime = "", closeTime = ""] = (data.hours || "").split(" - ");
          setFormData({
            name: data.name || "",
            address: data.address || "",
            phone: data.phone || "",
            email: data.email || "",
            openTime,
            closeTime,
          });
          setSettingsExist(true);
          setEditMode(false);
        } else {
          setSettingsExist(false);
          setEditMode(true); // show add form if no settings exist
        }
      } catch (err) {
        toast.error("Server error while fetching settings");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const hours = `${formData.openTime} - ${formData.closeTime}`;
    const method = settingsExist ? "PUT" : "POST";

    try {
      const res = await fetch(
        settingsExist ? apis().updateRestaurantDetails : apis().addRestaurantDetails,
        {
          method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...formData, hours }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success(
          settingsExist ? "✅ Settings updated successfully!" : "✅ Settings created!"
        );
        setSettingsExist(true);
        setEditMode(false);
      } else {
        toast.error(result.message || "Failed to save settings");
      }
    } catch (err) {
      toast.error("❌ Server error");
    }

    setLoading(false);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center text-success fw-bold">
        Admin Restaurant Settings
      </h2>

      {!editMode && settingsExist ? (
        <div className="bg-white p-4 rounded shadow-sm">
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Address:</strong> {formData.address}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Hours:</strong> {formData.openTime} - {formData.closeTime}</p>
          <button className="btn btn-primary mt-3" onClick={() => setEditMode(true)}>
            ✏️ Edit Settings
          </button>
        </div>
      ) : (
        <form
          className="p-4 bg-white rounded shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">
              Restaurant Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label fw-semibold">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label fw-semibold">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Opening Hours</label>
            <div className="row">
              <div className="col">
                <input
                  type="time"
                  id="openTime"
                  className="form-control"
                  value={formData.openTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="time"
                  id="closeTime"
                  className="form-control"
                  value={formData.closeTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="submit"
              className="btn btn-success px-4 shadow"
              disabled={loading}
            >
              {loading
                ? settingsExist
                  ? "Updating..."
                  : "Saving..."
                : settingsExist
                ? "Update Settings"
                : "Add Settings"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary px-4 shadow"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminRestaurantSettings;
