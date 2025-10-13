import React, { useState } from "react";
import ForgetPassword from "./ForgetPassword";
import VerifyOtp from "./VerifyOtp";
//import { Navigate } from "react-router-dom";

const ForgetFlow = ({ setIsOtpVerified }) => {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  return !token ? (
    <ForgetPassword setOtpToken={setToken} setOtpEmail={setEmail} />
  ) : (
    <VerifyOtp
      token={token}
      email={email}
      setToken={setToken}
      setisOtpVerified={setIsOtpVerified} // ✅ set true here
    />
  );
};


export default ForgetFlow;
