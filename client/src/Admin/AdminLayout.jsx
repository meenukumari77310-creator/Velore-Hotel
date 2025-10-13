import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../App.css";
import { toast } from "react-hot-toast";
import { apis } from "../utils/apis";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [loadingAll, setLoadingAll] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
    profileImage: null,
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const res = await fetch(apis().getAdminProfile, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setAdminProfile(data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch admin profile");
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(apis().addAdminProfile, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      toast.success("Profile image updated");
      setAdminProfile((prev) => ({ ...prev, profileImage: data.imageUrl }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(apis().adminlogout, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");

      toast.success("Logged out successfully");
      navigate("/admin/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout");
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      setLoadingAll(true);
      const res = await fetch(apis().adminlogoutAllDevices, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout from all devices failed");

      toast.success("Logged out from all devices");
      navigate("/admin/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout from all devices");
    } finally {
      setLoadingAll(false);
    }
  };

  return (
    <div className="admin-dashboard d-flex">
      {/* Mobile Toggle Button */}
      <button
        className="sidebar-toggle d-md-none btn btn-dark"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar bg-dark text-white p-3 ${
          sidebarOpen ? "open" : ""
        }`}
      >
        {/* Profile Section */}
        <div className="text-center mb-4">
          <label htmlFor="profileImageInput" style={{ cursor: "pointer" }}>
            <img
              src={
                adminProfile.profileImage
                  ? adminProfile.profileImage
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${adminProfile.email}`
              }
              alt="Admin"
              className="rounded-circle border"
              style={{ width: 80, height: 80, objectFit: "cover" }}
            />
          </label>
          <input
            type="file"
            id="profileImageInput"
            className="d-none"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
          <h6 className="mt-2 mb-0">{adminProfile.name || "Admin"}</h6>
          <small className="text-muted">{adminProfile.email}</small>
          <hr className="bg-secondary" />
        </div>

        {/* Theme Toggle */}
        <div className="d-flex justify-content-center mb-3">
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="nav flex-column">
          <NavLink to="/admin/dashboard" className="nav-link">
            📊 Dashboard
          </NavLink>
          <NavLink to="/admin/booking" className="nav-link">
            📅 Bookings
          </NavLink>
          <NavLink to="/admin/events" className="nav-link">
            🎉 Event Bookings
          </NavLink>
          <NavLink to="/admin/event-info" className="nav-link">
            🎉 Event Catering Info
          </NavLink>
          <NavLink to="/admin/orders" className="nav-link">
            🧾 Orders
          </NavLink>
          <NavLink to="/admin/category" className="nav-link">
            📦 Categories
          </NavLink>
          <NavLink to="/admin/messages" className="nav-link">
            📬 Messages
          </NavLink>
          <NavLink to="/admin/room-booking" className="nav-link">
            🏨 Room Bookings
          </NavLink>
          <NavLink to="/admin/hero-section" className="nav-link">
            🎨 Hero Section
          </NavLink>
          <NavLink to="/admin/book-room" className="nav-link">
            🛏️ Book Room
          </NavLink>
          <NavLink to="/admin/room-details" className="nav-link">
            📋 Room Details
          </NavLink>
          <NavLink to="/manage/dish" className="nav-link">
            📋 Dishes
          </NavLink>
          <NavLink to="/admin/gallery" className="nav-link">
            📷 Gallery
          </NavLink>
          <NavLink to="/admin/blog" className="nav-link">
            📝 Blog
          </NavLink>
          <NavLink to="/admin/reviews" className="nav-link">
            ⭐ Reviews
          </NavLink>
          <NavLink to="/admin/users" className="nav-link">
            👥 Users
          </NavLink>
          <NavLink to="/admin/loyalty" className="nav-link">
            🎁 Loyalty Panel
          </NavLink>
          <NavLink to="/admin/team" className="nav-link">
            👥 Team
          </NavLink>
          <NavLink to="/admin/restaurant-settings" className="nav-link">
            🏢 Settings
          </NavLink>

          <NavLink to="/admin/testimonials" className="nav-link">
            💬 Testimonials
          </NavLink>
          <NavLink to="/admin/how-it-works" className="nav-link">
            🛠️ How It Works
          </NavLink>
          <NavLink to="/admin/why-choose" className="nav-link">
            🌟 Why Choose Us
          </NavLink>
          <NavLink to="/admin/mission" className="nav-link">
            🎯 Mission
          </NavLink>
          <NavLink to="/admin/about-intro" className="nav-link">
            📖 About Intro
          </NavLink>
        </nav>

        <button className="btn btn-danger mt-4 w-100" onClick={handleLogout}>
          Logout
        </button>
        <button
          className="btn btn-warning mt-2 w-100"
          onClick={handleLogoutAllDevices}
          disabled={loadingAll}
        >
          {loadingAll ? "Logging out..." : "Logout All Devices"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-fill p-4 main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
