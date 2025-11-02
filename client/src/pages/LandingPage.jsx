import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export default function LandingPage() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center text-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.75)), url('/images/hotel-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        animation: "zoomBg 12s ease-in-out infinite"
      }}
    >
      <style>
        {`
        @keyframes zoomBg {
          0% { background-size: 100% }
          50% { background-size: 108% }
          100% { background-size: 100% }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }

        .lux-btn {
          transition: 0.35s;
        }

        .lux-btn:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.5);
        }

        .animated-title {
          background: linear-gradient(90deg, #ffd700, #fff4c2, #ffd700);
          -webkit-background-clip: text;
          color: transparent;
          font-family: 'Playfair Display', serif;
          text-shadow: 0 0 20px rgba(255,215,0,0.6);
          animation: glowText 4s infinite ease-in-out;
        }

        @keyframes glowText {
          0% { text-shadow: 0 0 10px rgba(255,215,0,0.5) }
          50% { text-shadow: 0 0 32px rgba(255,215,0,1) }
          100% { text-shadow: 0 0 10px rgba(255,215,0,0.5) }
        }

        .tagline {
          letter-spacing: 1px;
          font-weight: 300;
        }
        `}
      </style>

      <div className="container position-relative">
        <div className="p-5 mx-auto glass-card animate__animated animate__fadeInUp" style={{ maxWidth: "750px" }}>
          <h1 className="display-3 fw-bold mb-4 animated-title animate__animated animate__fadeInDown">
            Hotel Velore
          </h1>

          <p className="lead mb-4 text-light tagline animate__animated animate__fadeInUp animate__delay-1s">
            Luxury Stays • Royal Weddings • World-Class Dining
          </p>

          <div className="d-grid gap-3 mt-4 animate__animated animate__zoomIn animate__delay-2s">
            
            <Link
              to="/home"
              className="btn btn-outline-warning lux-btn btn-lg fw-semibold"
              style={{ borderRadius: "14px", backdropFilter: "blur(8px)" }}
            >
              Enter as Guest / User
            </Link>

            <Link
              to="/admin/dashboard"
              className="btn btn-outline-light lux-btn btn-lg fw-semibold"
              style={{ borderRadius: "14px", backdropFilter: "blur(8px)" }}
            >
              Go to Admin Dashboard
            </Link>
          </div>
        </div>

        <p className="mt-4 text-white-50 small animate__animated animate__fadeInUp animate__delay-3s">
          © {new Date().getFullYear()} Hotel Velore | Crafted For Luxury Living
        </p>
      </div>
    </div>
  );
}
