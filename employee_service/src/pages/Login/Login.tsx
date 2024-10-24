// src/pages/Login/Login.tsx

import React, { useState } from 'react';
import { useLoginMutation } from '../../api/apiSlice';
import { useAppDispatch } from '../../app/hooks';
import { setUserInfo } from '../../store/slices/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Importing icons from react-icons

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Clear errors as user types
    setFormErrors((prev) => ({
      ...prev,
      [e.target.name]: undefined,
    }));
  };

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!credentials.email) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(credentials.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!credentials.password) {
      errors.password = 'Password is required.';
    } else if (credentials.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const userData = await login(credentials).unwrap();
      dispatch(setUserInfo(userData));

      if (rememberMe) {
        // Optionally, store token in localStorage or cookies
        localStorage.setItem('token', userData.token);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login to Your Account</h2>
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                name="email"
                id="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-2 border ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="you@example.com"
              />
            </div>
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaLock />
              </span>
              <input
                type="password"
                name="password"
                id="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-2 border ${
                  formErrors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                placeholder="********"
              />
            </div>
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Remember Me</span>
            </label>
            <Link to="/password-reset" className="text-blue-600 hover:text-blue-800 text-sm">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-red-500 text-center">
              {('data' in error && typeof error.data === 'string')
                ? error.data
                : 'An error occurred. Please try again.'}
            </div>
          )}
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col space-y-4">
          <button className="flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors">
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.615 3.184a10.027 10.027 0 00-2.834-.778 10.058 10.058 0 00-3.313.592A4.918 4.918 0 0012 7.532a4.918 4.918 0 00-4.928 4.928c0 .39.044.765.127 1.124A13.978 13.978 0 011.671 4.149a4.918 4.918 0 00-.666 2.475c0 1.708.87 3.216 2.188 4.096a4.904 4.904 0 01-2.23-.616v.062a4.918 4.918 0 003.946 4.827 4.996 4.996 0 01-2.224.084 4.923 4.923 0 004.6 3.417A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 4.557a9.93 9.93 0 00-.385-1.373z" />
            </svg>
            Continue with Facebook
          </button>

          <button className="flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors">
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.338 3.608 1.313.975.975 1.251 2.242 1.313 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.338 2.633-1.313 3.608-.975.975-2.242 1.251-3.608 1.313-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.338-3.608-1.313-.975-.975-1.251-2.242-1.313-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.338-2.633 1.313-3.608C4.52 2.501 5.787 2.225 7.153 2.163 8.419 2.105 8.799 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.6.397 3.678 1.319c-.923.923-1.189 2.098-1.248 3.375C2.013 5.668 2 6.077 2 12s.013 6.332.072 7.612c.059 1.277.325 2.452 1.248 3.375.923.923 2.098 1.189 3.375 1.248C8.332 24 8.741 24 12 24s3.668-.013 4.948-.072c1.277-.059 2.452-.325 3.375-1.248.923-.923 1.189-2.098 1.248-3.375.059-1.28.072-1.689.072-7.612s-.013-6.332-.072-7.612c-.059-1.277-.325-2.452-1.248-3.375C19.4.397 18.225.131 16.948.072 15.668.013 15.259 0 12 0z" />
              <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998z" />
              <circle cx="18.406" cy="5.594" r="1.44" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
