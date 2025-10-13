import React from 'react';

const Button = ({
  onClick,
  type = "button",
  children,
  variant = "success",
  className = "",
}) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
