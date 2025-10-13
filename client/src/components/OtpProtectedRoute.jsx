// src/routes/OtpProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export const OtpProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("passToken");

  if (!token) {
    // If no OTP token found, redirect to forget password page
    return <Navigate to="/forget/password" replace />;
  }

  return children;
}