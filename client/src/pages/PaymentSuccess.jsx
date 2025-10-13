// src/pages/PaymentSuccess.jsx

import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="container text-center py-5">
      <h1 className="text-success mb-4">🎉 Payment Successful!</h1>
      <p className="lead">Thank you for your order. Your payment has been confirmed.</p>
      <Link to="/" className="btn btn-primary mt-4">Go Back to Home</Link>
    </div>
  );
};

export default PaymentSuccess;
