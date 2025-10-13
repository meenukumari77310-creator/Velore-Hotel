import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useDiscount } from "../UploadDocument/DiscountContext";

const NotificationIcon = () => {
  const { discountAvailable, discountAmount, clearDiscount } = useDiscount();
  const navigate = useNavigate();

  const handleClick = () => {
    if (discountAvailable) {
      clearDiscount();
      navigate("/upload", { state: { discount: discountAmount } });
    }
  };

  return (
    <div className="position-relative" onClick={handleClick} style={{ cursor: "pointer" }}>
      <FaBell size={24} />
      {discountAvailable && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          1
        </span>
      )}
    </div>
  );
};

export default NotificationIcon;
