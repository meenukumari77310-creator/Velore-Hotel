import React, { useEffect, useRef, useState } from "react";
import { MdMarkEmailRead } from "react-icons/md";
import Button from "../ui/button";
import AdminBackToLogin from "../ui/AdminBackToLogin";
import "./auth.css";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";
import LoadingButton from "../ui/LoadingButton";

const AdminVerifyOtp = ({ setisOtpVerified, token, email, setToken }) => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);

  const navigate = useNavigate();

  const inputRef = [ref1, ref2, ref3, ref4, ref5, ref6];

  useEffect(() => {
    if (ref1.current) {
      ref1.current.focus();
    }
  }, []);

  const [otpTime, setotpTime] = useState(null);
  const [isExpire, setisExpire] = useState(false);
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otp5, setOtp5] = useState("");
  const [otp6, setOtp6] = useState("");
  const [loading, setLoading] = useState(false);

  const otpArray = [setOtp1, setOtp2, setOtp3, setOtp4, setOtp5, setOtp6];

  const inputChange = (event, location) => {
    const value = event.target.value;
    otpArray[location](value);

    if (location < 5 && value) {
      inputRef[location + 1].current.focus();
    }
  };

  const inputKeyDown = (event, location) => {
    if (event.key === "Backspace") {
      if (!event.target.value && location > 0) {
        otpArray[location - 1]("");
        inputRef[location - 1].current.focus();
      }
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const finalOtp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    console.log("Final OTP:", finalOtp, "Token:", token);

    try {
      setLoading(true);
      const response = await fetch(apis().adminotpVerify, {
        method: "POST",
        body: JSON.stringify({ otp: finalOtp, token }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      setLoading(false);

      if (response.status === 400) {
        console.log("Status 400 received, redirecting...");
        navigate("/admin/forget/password");
        return;
      }

      if (!response.ok) {
        throw new Error(result?.message);
      }

      if (result?.status) {
        setisOtpVerified(true);
        navigate("/admin/password/update", { state: { token } });
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    console.log("Sending token to backend:", token);

    const getTime = async () => {
      try {
        const response = await fetch(apis().admingetOtpTime, {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();
        console.log(result);

        if (response.status === 400) {
          console.log("OTP time expired or invalid, redirecting...");
          navigate("/admin/forget/password");
          return;
        }

        if (!response.ok) {
          throw new Error(result?.message);
        }

        if (result?.status) {
          const remainingTime =
            new Date(result?.sendTime).getTime() - new Date().getTime();
          if (remainingTime > 0) {
            setotpTime(remainingTime);
          } else {
            setisExpire(true);
          }
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };

    getTime();
  }, [navigate, token]);

  const resendHandler = async () => {
    try {
      const response = await fetch(apis().adminforgetPassword, {
        method: "POST",
        body: JSON.stringify({ email }), // ✅ use prop instead of localStorage
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message);
      }

      if (result?.status) {
        toast.success(result?.message);
        setToken(result?.token); // ✅ use setToken from props
        setotpTime(1 * 60 * 1000); // 1 minute
        setisExpire(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth_main container py-4">
      <form
        onSubmit={submitHandler}
        className="mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <div className="auth_container card p-4 shadow-sm">
          <div className="auth_header text-center mb-2">
            <MdMarkEmailRead size={48} className="mb-2 text-primary" />
            <p className="auth_heading h4 fw-bold">Verify your OTP</p>
            <p className="auth_title text-muted">
              Enter 6 digit OTP here we just sent at your email
            </p>
          </div>
          <div className="auth_item mb-2">
            <label className="form-label fw-semibold">OTP *</label>
            <div className="otp_input_container d-flex justify-content-between">
              {inputRef.map((item, index) => (
                <input
                  required
                  key={index}
                  maxLength={1}
                  onChange={(event) => inputChange(event, index)}
                  onKeyDown={(event) => inputKeyDown(event, index)}
                  ref={item}
                  onInput={(event) => {
                    if (event.target.value.length > 1) {
                      event.target.value = event.target.value.slice(0, 1);
                    }
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="ui_input otp_input form-control text-center fs-4"
                  style={{ width: "3rem", height: "3rem" }}
                />
              ))}
            </div>
          </div>
          <div className="auth_action mb-1">
            <Button type="submit" variant="primary">
              <LoadingButton loading={loading} title="Verify" />
            </Button>
          </div>
          <div className="mb-2 text-center">
            {otpTime !== null && !isExpire ? (
              <Timer setisExpire={setisExpire} time={otpTime} />
            ) : (
              <span
                onClick={resendHandler}
                className="otp_resend_action btn btn-link p-0"
                style={{ cursor: "pointer" }}
              >
                Resend
              </span>
            )}
          </div>
          <div className="text-center">
            <AdminBackToLogin />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminVerifyOtp;
