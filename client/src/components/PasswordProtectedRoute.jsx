// components/PasswordProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export const PasswordProtectedRoute = ({ children, isOtpVerified }) => {
  if (!isOtpVerified) {
    return <Navigate to="/forget/password" replace />;
  }

  return children;
};

