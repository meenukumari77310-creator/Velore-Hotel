import React, { useState } from 'react';
import Input from '../ui/input';
import Button from '../ui/button';
import BackToLogin from '../ui/BackToLogin';
import { MdOutlineBrowserUpdated } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";  // 👈 import eye icons
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apis } from '../utils/apis';
import LoadingButton from '../ui/LoadingButton';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token;

  const PasswordChange = (e) => setPassword(e.target.value);
  const ConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token missing. Please retry the flow.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(apis().updatePassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          confirmPassword,
          token,
        }),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) throw new Error(result?.message);

      if (result?.status) {
        toast.success(result?.message);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card p-4 shadow-sm">
            <div className="text-center mb-4">
              <MdOutlineBrowserUpdated size={36} />
              <h3 className="mt-2">New Password</h3>
              <p className="text-muted">Enter at least a 6-character password</p>
            </div>
            <form onSubmit={submitHandler}>
              {/* Password */}
              <div className="mb-3 position-relative">
                <label className="form-label">Password *</label>
                <Input
                  onChange={PasswordChange}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="New Password"
                  className="form-control"
                />
                <span
                  onClick={toggleShowPassword}
                  style={{
                    position: 'absolute',
                    top: '38px',
                    right: '15px',
                    cursor: 'pointer',
                    color: '#555'
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="mb-3 position-relative">
                <label className="form-label">Confirm Password *</label>
                <Input
                  onChange={ConfirmPasswordChange}
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm Password"
                  className="form-control"
                />
                <span
                  onClick={toggleShowConfirmPassword}
                  style={{
                    position: 'absolute',
                    top: '38px',
                    right: '15px',
                    cursor: 'pointer',
                    color: '#555'
                  }}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="d-grid mb-3">
                <Button type="submit" className="btn btn-primary">
                  <LoadingButton loading={loading} title="Update Password" />
                </Button>
              </div>

              <div className="text-center">
                <BackToLogin />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;  