import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestPasswordResetMutation } from '../../features/auth/authApi';
import Button from '../../components/ui/Button';
import forgotIllustration from '../../assets/images/image3.png';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [requestPasswordReset, { isLoading }] = useRequestPasswordResetMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      // 1) Request the code
      const res = await requestPasswordReset({ email }).unwrap();
      // e.g. { success: true, message: 'Password reset code sent' }

      // 2) Immediately navigate to Reset Password page
      // Pass the user’s email along so they don’t have to re-enter it
      navigate('/reset-password', {
        state: {
          email,
          // optional: successMessage: res.message || 'A password reset code has been sent.'
        },
      });
    } catch (err: any) {
      const msg = err?.data?.message || 'Error requesting password reset.';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER / HERO SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-br from-blue-50 to-blue-100">
        <img src={forgotIllustration} alt="Forgot your password?" className="w-40 h-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Forgot Your Password?</h1>
        <p className="text-gray-500 text-center max-w-md">
          Enter your email below and we’ll send you a reset code to get back into your account.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="-mt-12 px-4">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          {/* Error message (only if the call fails) */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email Address</label>
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

            <Button
              type="submit"
              loading={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
            >
              Send Reset Code
            </Button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            We’ll navigate you to the reset code page once the code is sent.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-gray-50" />
    </div>
  );
};

export default ForgotPasswordPage;
