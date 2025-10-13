import React, { useState } from 'react';
import Input from '../ui/input';
import Button from '../ui/button';
import AdminBackToLogin from '../ui/AdminBackToLogin';
import { MdMarkEmailRead } from "react-icons/md";
//import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apis } from "../utils/apis";
import LoadingButton from '../ui/LoadingButton';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminForgetPassword = ({ setOtpToken, setOtpEmail }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
 // const navigate = useNavigate();

  const emailChanger = (event) => {
    setEmail(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      const response = await fetch(apis().adminforgetPassword, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON from server");
      }

      setLoading(false);

      if (!response.ok) {
        throw new Error(result?.message);
      }

      if (result?.status) {
        toast.success(result?.message);
        setOtpToken(result?.token); // ✅ triggers VerifyOtp
        setOtpEmail(email); // ✅ sets email for use
        // ✅ remove navigate("/otp/verify")
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <form
        onSubmit={submitHandler}
        className="w-100"
        style={{ maxWidth: "500px" }}
      >
        <div className="card shadow-sm p-4">
          <div className="text-center mb-4">
            <MdMarkEmailRead size={40} className="text-primary" />
            <h4 className="mt-2">Forget your Password</h4>
            <p className="text-muted">
              Enter your registered email to receive a 6-digit OTP
            </p>
          </div>

          <div className="mb-3">
            <label className="form-label">Email *</label>
            <Input
              type="email"
              className="form-control"
              onChange={emailChanger}
              placeholder="Enter your Email"
              required
            />
          </div>

          <div className="d-grid mb-3">
            <Button type="submit" variant='primary'>
              <LoadingButton loading={loading} title="Send OTP" />
            </Button>
          </div>

          <div className="text-center">
            <AdminBackToLogin />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminForgetPassword;
