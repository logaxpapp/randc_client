// src/pages/booking/Step4GuestOrEmail.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationCircle } from 'react-icons/fa';
import { BookingFlowState } from './BookingManager';

/**
 * We define a function type for `registerAndLoginUser`,
 * which calls POST /auth/register-and-login with {email, code?, firstName?, lastName?, password?}.
 */
type RegisterAndLoginFn = (args: {
  email: string;
  code?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}) => Promise<any>;

interface Step4GuestOrEmailProps {
  flow: BookingFlowState;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  onGuestSelected: (guestEmail: string) => void;
  onSignUpComplete: (fields: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
  registerAndLoginUser: RegisterAndLoginFn;
  onBack: () => void;
}

const Step4GuestOrEmail: React.FC<Step4GuestOrEmailProps> = ({
  flow,
  errorMessage,
  setErrorMessage,
  onGuestSelected,
  onSignUpComplete,
  registerAndLoginUser,
  onBack,
}) => {
  const [subStep, setSubStep] = useState(1);

  // For "guest" flow:
  const [guestEmail, setGuestEmail] = useState('');

  // For sign-up via OTP
  const [email, setEmail] = useState('');
  // Instead of a single code string, let's store 6 separate digits:
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const digitRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);

  // If all 6 digits are typed, auto verify
  useEffect(() => {
    if (subStep === 3) {
      const code = otpDigits.join('');
      // If code is fully typed (no empty digits):
      if (!otpDigits.includes('') && code.length === 6) {
        handleVerifyCode(code);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpDigits, subStep]);

  function gotoSubStep(step: number) {
    setErrorMessage(null);
    setSubStep(step);
  }

  // ========== 1) Guest flow
  function handleGuestContinue() {
    if (!guestEmail) {
      setErrorMessage('Please enter an email to continue as guest.');
      return;
    }
    setErrorMessage(null);
    onGuestSelected(guestEmail);
  }

  // ========== 2) "registerAndLoginUser" approach
  async function handleRequestCode() {
    if (!email) {
      setErrorMessage('Email is required');
      return;
    }
    setErrorMessage(null);
    setLoading(true);
    try {
      await registerAndLoginUser({ email });
      // success => subStep=3 => show OTP input
      gotoSubStep(3);
    } catch (err: any) {
      setErrorMessage(err.data?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(code: string) {
    if (!code) {
      setErrorMessage('Enter 6-digit code');
      return;
    }
    setErrorMessage(null);
    setLoading(true);
    try {
      // call with {email, code} => verifies
      await registerAndLoginUser({ email, code });
      // success => subStep=4 => input name/password
      gotoSubStep(4);
    } catch (err: any) {
      setErrorMessage(err.data?.message || 'Invalid code');
      // if code is invalid => reset OTP
      setOtpDigits(['', '', '', '', '', '']);
      digitRefs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleFinishSignUp() {
    if (!firstName || !lastName || !email || !password) {
      setErrorMessage('All fields required');
      return;
    }
    
    const code = otpDigits.join('');
    if (!code) {
      setErrorMessage('No code, please re-verify?');
      return;
    }
    
    setErrorMessage(null);
    setLoading(true);
    
    try {
      const userData = await registerAndLoginUser({
        email,
        code,
        firstName,
        lastName,
        password,
      });
  
      // Ensure user details are stored and replace guest email
      onSignUpComplete({ firstName, lastName, email });
    } catch (err: any) {
      setErrorMessage(err.data?.message || 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  }

  // ----------- OTP digit fields -----------
  function handleDigitChange(value: string, idx: number) {
    // only keep last typed digit
    const digit = value.replace(/\D/, '').slice(-1);
    setOtpDigits((prev) => {
      const copy = [...prev];
      copy[idx] = digit;
      return copy;
    });
    // if typed a digit, focus next
    if (digit && idx < 5) {
      digitRefs[idx + 1].current?.focus();
    }
  }
  function handleDigitKeyDown(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      // go back to prev
      setOtpDigits((prev) => {
        const copy = [...prev];
        copy[idx - 1] = '';
        return copy;
      });
      digitRefs[idx - 1].current?.focus();
    }
  }

  // ========== Render sub-step content
  function renderContent() {
    switch (subStep) {
      case 1:
        // Let user pick guest or sign-up
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Continue as Guest or Sign Up</h2>
            {errorMessage && (
              <div className="text-red-500 flex items-center gap-2">
                <FaExclamationCircle />
                <span>{errorMessage}</span>
              </div>
            )}
            <div>
              <label className="block mb-1 text-sm text-gray-600">Guest Email</label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>
            <button
              onClick={handleGuestContinue}
              className="bg-green-600 text-white px-4 py-2 w-full rounded"
            >
              Continue as Guest
            </button>

            <div className="text-center text-gray-500">OR</div>

            <button
              onClick={() => gotoSubStep(2)}
              className="bg-blue-600 text-white px-4 py-2 w-full rounded"
            >
              Sign Up (Email Verification)
            </button>
          </div>
        );

      case 2:
        // user enters email to request code
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Enter Your Email</h2>
            {errorMessage && (
              <div className="text-red-500 flex items-center gap-2">
                <FaExclamationCircle />
                <span>{errorMessage}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>
            <button
              onClick={handleRequestCode}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 w-full rounded disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
            <button
              onClick={() => gotoSubStep(1)}
              className="bg-gray-200 text-gray-700 px-4 py-2 w-full rounded"
            >
              Back
            </button>
          </div>
        );

      case 3:
        // user enters 6-digit OTP => auto verifies when last digit is typed
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Enter 6-Digit Code</h2>
            {errorMessage && (
              <div className="text-red-500 flex items-center gap-2">
                <FaExclamationCircle />
                <span>{errorMessage}</span>
              </div>
            )}
            <p className="text-sm text-gray-700">
              We have sent a 6‐digit OTP to <strong>{email}</strong>.
            </p>

            {/* The 6 OTP inputs */}
            <div className="flex gap-2 justify-center">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={digitRefs[idx]}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl border border-gray-300 rounded"
                  value={digit}
                  onChange={(e) => handleDigitChange(e.target.value, idx)}
                  onKeyDown={(e) => handleDigitKeyDown(e, idx)}
                />
              ))}
            </div>

            {/* If you want a "Resend code" link: */}
            <div className="text-center mt-2">
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={handleRequestCode}
              >
                Resend code
              </button>
            </div>

            <button
              onClick={() => gotoSubStep(2)}
              className="bg-gray-200 text-gray-700 px-4 py-2 w-full rounded"
            >
              Back
            </button>
          </div>
        );

      case 4:
        // user enters first/last name + password => finalize sign up
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Finish Sign Up</h2>
            {errorMessage && (
              <div className="text-red-500 flex items-center gap-2">
                <FaExclamationCircle />
                <span>{errorMessage}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>
            <button
              onClick={handleFinishSignUp}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 w-full rounded disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Account & Login'}
            </button>
            <button
              onClick={() => gotoSubStep(3)}
              className="bg-gray-200 text-gray-700 px-4 py-2 w-full rounded"
            >
              Back
            </button>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* top back button */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="bg-gray-300 text-gray-700 px-4 py-1 rounded"
        >
          Back
        </button>
      </div>

      {renderContent()}
    </motion.div>
  );
};

export default Step4GuestOrEmail;
