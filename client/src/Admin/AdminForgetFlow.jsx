import React, { useState } from "react";
import AdminForgetPassword from "./AdminForgetPassword";
import AdminVerifyOtp from "./AdminVerifyOtp";
//import { Navigate } from "react-router-dom";

const AdminForgetFlow = ({ setIsOtpVerified }) => {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  return !token ? (
    <AdminForgetPassword setOtpToken={setToken} setOtpEmail={setEmail} />
  ) : (
    <AdminVerifyOtp
      token={token}
      email={email}
      setToken={setToken}
      setisOtpVerified={setIsOtpVerified} // ✅ set true here
    />
  );
};


export default AdminForgetFlow;