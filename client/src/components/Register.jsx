import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaMagic, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Input from "../ui/input";
import Button from "../ui/button";
import LoadingButton from "../ui/LoadingButton";
import BackToLogin from "../ui/BackToLogin";
import "bootstrap/dist/css/bootstrap.min.css";
import { apis } from "../utils/apis";
import {
  auth,
  sendSignInLinkToEmail,
  googleProvider,
  signInWithPopup,
} from "./firebase"
import { useUser } from "./UserContext";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 new toggle state

  const navigate = useNavigate();
  const { setUserDetails } = useUser();

  const actionCodeSettings = {
  url: `http://localhost:3000/finishSignIn?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`,
    handleCodeInApp: true,
  };

  const nameChange = (e) => setName(e.target.value);
  const emailChange = (e) => setEmail(e.target.value);
  const passwordChange = (e) => setPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword((prev) => !prev); // 👈 toggle handler

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(apis().registerUser, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-type": "application/json" },
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) throw new Error(result?.message);

      if (result?.status) {
        toast.success(result?.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

 const sendMagicLink = async () => {
  if (!email || !name)
    return toast.error("Please enter your name and email first");

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    setUserDetails({ email, name }); // ✅ Use the hook from top scope

    toast.success("Magic link sent! Check your email.");
  } catch (error) {
    toast.error("Failed to send magic link: " + error.message);
  }
};



  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await fetch(apis().loginviaFirebase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: user.displayName || "Google User",
          email: user.email,
          platform: "google",
        }),
      });

      toast.success(`Welcome ${user.displayName}`);
      navigate("/home");
    } catch (error) {
      toast.error("Google login failed: " + error.message);
    }
  };

  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card p-4 shadow-sm">
            <div className="text-center mb-4">
              <FaLock size={36} />
              <h3 className="mt-2">Welcome</h3>
              <p className="text-muted">
                Create a new account or use Magic Link / Google login
              </p>
            </div>
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label className="form-label">Name *</label>
                <Input
                  onChange={nameChange}
                  type="text"
                  required
                  className="form-control"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email *</label>
                <Input
                  onChange={emailChange}
                  type="email"
                  required
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                />
              </div>
              <div className="mb-4 position-relative">
                <label className="form-label">Password *</label>
                <Input
                  onChange={passwordChange}
                  type={showPassword ? "text" : "password"} // 👈 toggle input type
                  required
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                />
                <span
                  onClick={toggleShowPassword}
                  style={{
                    position: "absolute",
                    top: "38px",
                    right: "15px",
                    cursor: "pointer",
                    color: "#555",
                    userSelect: "none",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="d-grid mb-3">
                <Button type="submit" className="btn btn-success">
                  <LoadingButton loading={loading} title="Register" />
                </Button>
              </div>
            </form>

            {/* Magic Link Section */}
            <div className="mb-3">
              <button className="btn btn-outline-primary w-100 mb-2" onClick={sendMagicLink}>
               <FaMagic className="me-2" /> Send Magic Link
              </button>

              {/* Google Sign-in */}
              <button className="btn btn-outline-danger w-100" onClick={handleGoogleLogin}>
               <FaGoogle className="me-2" /> Sign in with Google
              </button>
            </div>

            <div className="text-center">
              <BackToLogin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
