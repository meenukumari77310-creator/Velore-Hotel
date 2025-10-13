import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import "animate.css";
import "../App.css";
import { apis } from "../utils/apis";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
        setResponseMsg("❗ Please fill in all fields.");
        setLoading(false);
        return;
      }

      const res = await fetch(apis().Contact, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (res.ok) {
        setResponseMsg("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        const errData = await res.json();
        setResponseMsg(`❌ ${errData.error || "Failed to send message."}`);
      }
    } catch (err) {
      setResponseMsg("❌ Failed to send message. Please try again later.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const res = await fetch(apis().usergetRestaurantDetails, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setRestaurant(data);
        }
      } catch (err) {
        console.error("Error fetching restaurant settings:", err);
      }
    };

    fetchRestaurantDetails();
  }, []);

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4 fw-bold contact-heading">Contact Us</h2>
        <p className="mb-5 text-center text-success fs-5">
          Have questions or want to make a reservation? We’re here to help.
        </p>

        <div className="row g-5 align-items-center animate__animated animate__fadeIn">
          {/* Contact Info */}
          <div className="col-lg-5 text-start">
            <h4 className="mb-4" style={{ color: "#198754" }}>Our Address</h4>
            <p>
              <FaMapMarkerAlt className="text-success me-2" />
              {restaurant?.address || "123 Food Street, Arya Nagar, Mumbai"}
            </p>

            <h4 className="mt-4 mb-3" style={{ color: "#198754" }}>Phone</h4>
            <p>
              <FaPhoneAlt className="text-success me-2" />
              <a
                href={`tel:${restaurant?.phone || "+91 00000 00000"}`}
                className="text-decoration-none text-dark"
              >
                {restaurant?.phone || "+91 00000 00000"}
              </a>
            </p>

            <h4 className="mt-4 mb-3" style={{ color: "#198754" }}>Email</h4>
            <p>
              <FaEnvelope className="text-success me-2" />
              <a
                href={`mailto:${restaurant?.email || "info@restaurant.com"}`}
                className="text-decoration-none text-dark"
              >
                {restaurant?.email || "info@restaurant.com"}
              </a>
            </p>

            <h4 className="mt-4 mb-3" style={{ color: "#198754" }}>Opening Hours</h4>
            <p>
              <FaClock className="text-success me-2" />
              {restaurant?.hours || "Monday – Sunday: 10:00 AM to 10:00 PM"}
            </p>

            {/* Google Maps */}
            <div
              className="mt-5 rounded shadow-sm overflow-hidden"
              style={{ height: "250px" }}
            >
              <iframe
                title="Restaurant Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.589763956776!2d72.87765571539056!3d19.07609068667486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c63c7028e5d7%3A0x2be7c8f93b8f3f08!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sus!4v1688600000000!5m2!1sen!2sus"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-7">
            <form
              onSubmit={handleSubmit}
              className="p-4 bg-white rounded shadow-sm contact-form"
              noValidate
            >
              <h4 className="mb-4 text-success fw-semibold">
                Send Your Feedback
              </h4>

              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter your name"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label fw-semibold">Message</label>
                <textarea
                  id="message"
                  className="form-control"
                  rows="5"
                  placeholder="Enter your message"
                  required
                  value={form.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="d-flex justify-content-start gap-3">
                <button
                  type="submit"
                  className="btn btn-success px-4 shadow"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
                <button
                  type="reset"
                  className="btn btn-outline-danger px-4 shadow"
                  onClick={() => setForm({ name: "", email: "", message: "" })}
                >
                  Reset
                </button>
              </div>

              {responseMsg && <p className="mt-3">{responseMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
