import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apis } from "../utils/apis";
import { getCategoryIcon, getCategoryLabel } from "../utils/categoryUtils";
import "../App.css";
import "animate.css";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md"; // if you're using Material Icons
import HuggingFaceAI from "./HuggingFaceAI";

const getIconComponent = (iconName) => {
  return FaIcons[iconName] || MdIcons[iconName] || null;
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [howItWorks, setHowItWorks] = useState([]);
  const [features, setFeatures] = useState([]);
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await fetch(apis().userMenu, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          const uniqueCategories = [
            ...new Set(data.map((d) => d.category?.name).filter(Boolean)),
          ];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Failed to load categories:", error.message);
      }
    };

    const fetchTestimonials = async () => {
      try {
        const res = await fetch(apis().userTestimonials, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error("Failed to load testimonials:", error.message);
      }
    };

    const fetchHowItWorks = async () => {
      try {
        const res = await fetch(apis().userHowItWorks, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);
        if (Array.isArray(data)) {
          setHowItWorks(data);
        }
      } catch (error) {
        console.error("Failed to load How It Works:", error.message);
      }
    };

    const fetchWhyChoose = async () => {
      try {
        const res = await fetch(apis().userWhyChoose, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setFeatures(data);
        }
      } catch (error) {
        console.error("Failed to load Why Choose Us:", error.message);
      }
    };

    fetchWhyChoose();
    fetchDishes();
    fetchTestimonials();
    fetchHowItWorks();
  }, []);

  useEffect(() => {
    // Existing fetch calls ...

    const fetchHotels = async () => {
      try {
        const res = await fetch(apis().usergetRoom, { credentials: "include" });
        const data = await res.json();
        if (Array.isArray(data)) {
          setHotels(data);
        }
      } catch (error) {
        console.error("Failed to load hotels/rooms:", error.message);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="home-page">
      {/* Hotels & Rooms */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="mb-4 text-primary">Room Types</h2>
          <div className="row g-4">
            {hotels.length === 0 ? (
              <p className="text-muted">No rooms available.</p>
            ) : (
              hotels.map((room, i) => (
                <div key={i} className="col-md-4">
                  <div className="card shadow-sm border-0 h-100 hover-scale">
                    {room.coverImage && (
                      <img
                        src={room.coverImage}
                        className="card-img-top"
                        alt={room.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{room.name}</h5>
                      <p className="card-text">{room.type}</p>
                      <span className="badge bg-success me-2">
                        ${room.price}/night
                      </span>
                      <span className="badge bg-warning text-dark">
                        {room.rating || "N/A"} ★
                      </span>
                    </div>
                    <Link
                      to={`/rooms/${room._id}`}
                      className="stretched-link"
                    ></Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Categories */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="mb-4">Food Categories</h2>
          <div className="row g-4">
            {categories.map((cat, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="card shadow-sm border-0 h-100 hover-scale p-4 position-relative">
                  <div className="fs-1 mb-2">{getCategoryIcon(cat)}</div>
                  <h5 className="card-title">{getCategoryLabel(cat)}</h5>
                  <Link
                    to={`/menu?category=${encodeURIComponent(cat)}`}
                    className="stretched-link"
                  ></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hugging Face AI Section */}
      <HuggingFaceAI />

      {/* Why Choose Us */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container">
          <h2 className="mb-4">Why Choose Velora?</h2>
          <div className="row g-4">
            {features.map((item, i) => {
              const Icon = getIconComponent(item.icon);
              return (
                <div key={i} className="col-md-4">
                  <div className="p-4 border rounded bg-light bg-opacity-10 h-100 hover-scale">
                    {Icon ? (
                      <Icon size={40} className="fa-2x text-danger mb-3 " />
                    ) : (
                      <span>🧩</span>
                    )}
                    <h5>{item.title}</h5>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works - Dynamic */}
      <section className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="mb-4 text-primary">How It Works?</h2>
          <div className="row g-4">
            {howItWorks.length === 0 ? (
              <p className="text-muted">No steps found.</p>
            ) : (
              howItWorks.map((step, i) => (
                <div key={i} className="col-md-4">
                  <div className="p-4 border rounded shadow-sm h-100">
                    <h1>{step.icon || "🧩"}</h1>
                    <h5>{step.title}</h5>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="mb-4 text-success">What Our Customers Say?</h2>
          <div className="row g-4">
            {testimonials.length === 0 ? (
              <p className="text-muted">No testimonials yet.</p>
            ) : (
              testimonials.map((t, i) => (
                <div key={i} className="col-md-4">
                  <div className="p-4 bg-white border rounded shadow-sm h-100">
                    <p className="fst-italic">“{t.review}”</p>
                    <h6 className="mt-3 fw-bold">{t.name}</h6>
                    <small className="text-muted">{t.location}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="text-center py-5 bg-danger text-white">
        <div className="container">
          <h2 className="mb-4">Craving Something Delicious?</h2>
          <Link to="/menu" className="btn btn-light btn-lg px-5 cta-btn">
            Order Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
