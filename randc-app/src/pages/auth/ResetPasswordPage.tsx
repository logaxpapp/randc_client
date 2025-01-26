// src/pages/auth/ResetPasswordPage.tsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useResetPasswordMutation } from '../../features/auth/authApi';
import Button from '../../components/ui/Button';
import resetIllustration from '../../assets/images/image4.png';

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();

  // If the user came from ForgotPasswordPage, we might have an email in location.state
  const prefilledEmail = (location.state as { email?: string })?.email || '';

  const [email, setEmail] = useState(prefilledEmail);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // RTK Query mutation hook
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    // If no email was provided, user might be here directly (optional logic)
    if (!prefilledEmail) {
      // e.g. navigate('/forgot-password');
    }
  }, [prefilledEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMsg(null);

    try {
      // Call the mutation and unwrap the result (success => returns data, error => throws)
      const res = await resetPassword({ email, code, newPassword }).unwrap();

      // If success, res might be { success: true, message: '...' }
      setMessage(res.message || 'Your password has been reset. You can now log in.');
    } catch (err: any) {
      // If server returned error, err.data?.message should be the server’s message
      const msg = err?.data?.message || 'Error resetting password.';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HERO SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-br from-blue-50 to-blue-100">
        <img src={resetIllustration} alt="Reset your password" className="w-48 h-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Reset Your Password</h1>
        <p className="text-gray-500 text-center max-w-md">
          Enter the same email, the 6-digit code we sent you, and pick a new password.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="-mt-12 px-4">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          {message && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded">
              {message}
            </div>
          )}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none
                           focus:ring-2 focus:ring-blue-400 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Reset Code</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none
                           focus:ring-2 focus:ring-blue-400 transition"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6-digit code from email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">New Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none
                           focus:ring-2 focus:ring-blue-400 transition"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
            >
              Reset Password
            </Button>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            Haven&apos;t received your code? Check your spam folder or
            <span className="text-blue-600 cursor-pointer hover:underline ml-1">
              request a new one
            </span>.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-gray-50" />
    </div>
  );
};

export default ResetPasswordPage;
