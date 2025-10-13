import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiLoginBoxLine } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";  // 👈 eye icons
import toast from 'react-hot-toast';
import { apis } from '../utils/apis';
import Input from '../ui/input';
import Button from '../ui/button';
import LoadingButton from '../ui/LoadingButton';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state
  const navigate = useNavigate();

  const emailChange = (e) => setEmail(e.target.value);
  const passwordChange = (e) => setPassword(e.target.value);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(apis().adminloginUser, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) throw new Error(result?.message);

      if (result?.status) {
        toast.success(result?.message);
        navigate("/admin/dashboard");
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
              <RiLoginBoxLine size={40} />
              <h3 className="mt-2">Welcome Back</h3>
              <p className="text-muted">Login to continue</p>
            </div>
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label className="form-label">Email*</label>
                <Input
                  onChange={emailChange}
                  type="email"
                  required
                  className="form-control"
                  placeholder="Enter your Email"
                />
              </div>

              {/* Password Input with toggle */}
              <div className="mb-3 position-relative">
                <label className="form-label">Password*</label>
                <Input
                  onChange={passwordChange}
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-control"
                  placeholder="Enter your Password"
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

              <div className="d-grid mb-3">
                <Button type="submit" variant='primary'>
                  <LoadingButton loading={loading} title="Login" />
                </Button>
              </div>
              <div className="d-flex justify-content-between">
                <Link to="/admin/register">Create new account?</Link>
                <Link to="/admin/forget/password">Forget Password</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;  