// components/PasswordProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export const AdminPasswordProtectedRoute = ({ children, isOtpVerified }) => {
  if (!isOtpVerified) {
    return <Navigate to="/admin/forget/password" replace />;
  }

  return children;
};

