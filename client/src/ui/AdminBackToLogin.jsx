import React from 'react';
import './backToLogin.css';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const AdminBackToLogin = () => {
  const navigate = useNavigate();

  const navigateHandler = () => {
    navigate('/admin/login');
  };

  return (
    <div
      onClick={navigateHandler}
      className="d-inline-flex align-items-center gap-2 px-3 py-2 border rounded bg-light text-primary fw-medium back-to-login-hover"
      role="button"
    >
      <FaArrowLeftLong size={18} />
      <span>Back to Login</span>
    </div>
  );
};

export default AdminBackToLogin;
