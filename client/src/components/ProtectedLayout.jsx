// components/ProtectedLayout.jsx
import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

const ProtectedLayout = () => {
  const location = useLocation();
  const hideHeroPaths = [
    "/cart",
    "/favorites",
    "/success",
    "/cancel",
    "/restaurant",
    "/add/dish",
    "/admin/booking",
    "/manage/dish",
    "/edit/dish",
    "/admin/order",
    "/event-payment-info",
    "/event-catering",
    "/book",
  ];

  const hideHero = hideHeroPaths.includes(location.pathname);

  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="flex-fill">
        {!hideHero && <HeroSection />}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
