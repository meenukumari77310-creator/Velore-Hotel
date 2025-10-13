import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apis } from "../utils/apis";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingButton from "../ui/LoadingButton";
import { useUser } from "./UserContext"; // ✅ Import context

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { userDetails } = useUser(); // ✅ Access user context
  const { email, name } = userDetails || {};

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !name) {
      toast.error("User info not found. Please use the magic link again.");
      return navigate("/register");
    }

    try {
      setLoading(true);
      const res = await fetch(apis().savePasswordMagicLink, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, name, password }),
      });

      const result = await res.json();
      setLoading(false);

      if (!res.ok) throw new Error(result.message || "Failed to set password");

      toast.success("Password saved! Redirecting...");
      navigate("/login");
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h3 className="text-center mb-3">Create Your Password</h3>
            <form onSubmit={handleSubmit}>
              {/* Password Field with Eye Toggle */}
              <div className="mb-3 position-relative">
                <label className="form-label">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <span
                  onClick={toggleShowPassword}
                  style={{
                    position: "absolute",
                    top: "38px",
                    right: "15px",
                    cursor: "pointer",
                    color: "#555",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button className="btn btn-primary w-100" type="submit">
                <LoadingButton loading={loading} title="Set Password" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
