import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaHeart, FaEdit } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import NotificationDropdown from "./Notification";

import "../App.css";
import { apis } from "../utils/apis";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useCheckAuth } from "./check_auth";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useCheckAuth();

  const cartCount = useSelector((state) => state.cart.length);
  const favoriteCount = useSelector((state) => state.favorite?.length || 0);

  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProfile = async () => {
      try {
        const res = await fetchWithAuth(apis().GetProfile);
        if (res.ok) {
          const data = await res.json();
          setUserData({ _id: data._id, name: data.name, email: data.email });
          setProfileImage(data.profileImage || null);
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await fetchWithAuth(apis().AddProfile, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setProfileImage(data.imageUrl);
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("https://velore-hotel.onrender.com/foodie/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      const res = await fetchWithAuth(apis().logoutAllDevices, {
        method: "POST",
      });
      if (res.ok) navigate("/login");
    } catch (err) {
      console.error("Logout all devices error", err);
    }
  };

  if (loading) return null;

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top shadow-sm"
        style={{
          background: "rgba(31, 22, 23, 0.9)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="container-fluid">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/home">
            <span
              className="ms-2 fw-bold fs-2"
              style={{
                background: "linear-gradient(90deg, #b31217, #ffb347)", // red gradient
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Playfair Display', serif", // or your chosen font
              }}
            >
              Velora
            </span>
          </Link>

          {/* Mobile toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Nav Links & User Section */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Navigation Links */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {[
                "Home",
                "About",
                "Blog",
                "Book Room",
                "Menu",
                "Images",
                "Contact",
                "Book Table",
                "Event Catering",
              ].map((name, idx) => {
                const path =
                  name.toLowerCase() === "home"
                    ? "/home"
                    : name === "Event Catering"
                      ? "/booking-info"
                      : name === "Book Room"
                        ? "/room-booking"
                        : `/${name.toLowerCase().replace(" ", "-")}`;
                return (
                  <li className="nav-item" key={idx}>
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        `nav-link mx-2 px-3 py-2 rounded-pill fw-semibold ${isActive
                          ? "bg-danger text-white shadow-sm"
                          : "text-light"
                        }`
                      }
                    >
                      {name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* Authenticated Section */}
            {isAuthenticated && (
              <div className="d-flex align-items-center gap-3 ms-3 mt-3 mt-lg-0 position-relative">
                {/* Cart Icon */}
                <Link to="/cart" className="position-relative text-light">
                  <FaShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Favorite Icon */}
                <Link to="/favorites" className="position-relative text-light">
                  <FaHeart size={18} />
                  {favoriteCount > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
                      {favoriteCount}
                    </span>
                  )}
                </Link>

                {/* 🔔 Notification Icon */}
                <NotificationDropdown email={userData.email} />

                {/* Profile Image Button */}
                <button
                  onClick={() => setShowModal(true)}
                  className="btn p-0 border-0 bg-transparent"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: 24, height: 24, objectFit: "cover" }}
                    />
                  ) : userData.email ? (
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        userData.email
                      )}`}
                      alt="Avatar"
                      className="rounded-circle"
                      style={{ width: 24, height: 24, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white border"
                      style={{ width: 24, height: 24, fontSize: 8 }}
                    >
                      No Img
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>My Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column align-items-center text-center">
            {/* Profile Image Upload */}
            <div className="position-relative mb-3">
              <img
                src={
                  profileImage
                    ? profileImage
                    : userData.email
                      ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        userData.email
                      )}`
                      : "https://via.placeholder.com/120?text=No+Img"
                }
                alt="Profile"
                className="rounded-circle border"
                style={{ width: 120, height: 120, objectFit: "cover" }}
              />

              <label
                htmlFor="profile-upload"
                className="position-absolute bottom-0 end-0 bg-dark rounded-circle p-2 border border-white"
                style={{ cursor: "pointer", transform: "translate(30%, 30%)" }}
              >
                <FaEdit size={16} color="#fff" />
              </label>

              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            {/* User Info */}
            <div className="w-100 text-start px-3">
              <h5 className="fw-bold mb-1">
                {userData.name || "Unnamed User"}
              </h5>
              <p className="text-muted mb-3">{userData.email}</p>
              <hr />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-end gap-2">
          <Button variant="warning" onClick={handleLogout}>
            Logout
          </Button>
          <Button variant="danger" onClick={handleLogoutAllDevices}>
            Logout All Devices
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Navbar;
