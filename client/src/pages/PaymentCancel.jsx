// src/pages/PaymentCancel.jsx

import React from "react";
import { Link } from "react-router-dom";

const PaymentCancel = () => {
  return (
    <div className="container text-center py-5">
      <h1 className="text-danger mb-4">❌ Payment Cancelled</h1>
      <p className="lead">Your payment was not completed. You can try again later.</p>
      <Link to="/menu" className="btn btn-warning mt-4">Return to Menu</Link>
    </div>
  );
};

export default PaymentCancel;
