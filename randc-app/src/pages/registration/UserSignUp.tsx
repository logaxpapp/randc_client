// src/pages/auth/UserSignUp.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaCheckCircle,
  FaArrowLeft,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Fae assistant image
import Fae from '../../assets/images/fae.svg';

// RTK Query hooks
import { useRequestEmailVerificationMutation, useVerifyEmailCodeMutation, useRegisterUserOnlyMutation } from '../../features/auth/authApi';

// Our custom UI components
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';

// Formik / Yup
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// ----------------------------------------------------------------
//        Define Steps
// ----------------------------------------------------------------
enum Step {
  BASIC_INFO = 1,
  REQUEST_CODE,
  VERIFY_CODE,
  CREATE_USER,
  SUMMARY
}

// Fae messages for each step
const faeMessages: Record<Step, string> = {
  [Step.BASIC_INFO]:  "Welcome! Let's gather some basic information to set up your user profile.",
  [Step.REQUEST_CODE]: "Next, we need to verify your email. Enter it so we can send you a code.",
  [Step.VERIFY_CODE]:  "We’ve sent you a verification code. Please enter the 6 digits here.",
  [Step.CREATE_USER]:  "Almost there! Choose a secure password to finalize your user account.",
  [Step.SUMMARY]:      "All done! Your user has been created successfully. Enjoy the platform!"
};

const UserSignUp: React.FC = () => {
  // ----------------------------------------------------------------
  //        RTK Query Hooks
  // ----------------------------------------------------------------
  const [requestEmailVerification, { isLoading: isSendingVerification }] = useRequestEmailVerificationMutation();
  const [verifyEmailCode,          { isLoading: isVerifyingCode }]       = useVerifyEmailCodeMutation();
  const [registerUserOnly,         { isLoading: isRegisteringUser }]     = useRegisterUserOnlyMutation();

  // ----------------------------------------------------------------
  //        Step & Local State
  // ----------------------------------------------------------------
  const [currentStep, setCurrentStep] = useState<Step>(Step.BASIC_INFO);

  // (1) Basic info
  const [basicData, setBasicData] = useState<{ firstName: string; lastName: string; tenantId?: string }>({
    firstName: '',
    lastName:  '',
    tenantId:  ''
  });

  // (2) Request code
  const [email, setEmail] = useState('');

  // (3) Verify code
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const digitRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  // (4) Create user => only password needed at that step 
  // (the user’s firstName, lastName, tenantId, & email already known)
  const [password, setPassword] = useState('');

  // (Toast) success / error
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((old) => ({ ...old, show: false })), 5000);
  };
  const closeToast = () => setToast((old) => ({ ...old, show: false }));

  // Step transitions
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // ----------------------------------------------------------------
  //        Loading Screen Between Steps
  // ----------------------------------------------------------------
  const [loadingScreen, setLoadingScreen] = useState(false);
  useEffect(() => {
    // Show a brief "loading" animation when step changes
    setLoadingScreen(true);
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    show:   { opacity: 1, x: 0 },
    exit:   { opacity: 0, x: -50 },
  };

  // Fae’s message for the current step
  const faeMessage = faeMessages[currentStep];

  // ----------------------------------------------------------------
  //        Step 1) Basic Info
  // ----------------------------------------------------------------
  const BasicInfoSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName:  Yup.string().required('Last Name is required'),
    tenantId:  Yup.string().nullable() // optional
  });

  const handleBasicSubmit = (vals: typeof basicData) => {
    setBasicData(vals);
    nextStep();
  };

  // ----------------------------------------------------------------
  //        Step 2) Request Code
  // ----------------------------------------------------------------
  const EmailSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required')
  });

  const handleRequestCode = async (theEmail: string) => {
    try {
      // store email in local state
      setEmail(theEmail);

      // call the API
      await requestEmailVerification({ email: theEmail }).unwrap();
      showToast('Verification code sent to your email!', 'success');
      nextStep();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to send code', 'error');
    }
  };

  // ----------------------------------------------------------------
  //        Step 3) Verify Code
  // ----------------------------------------------------------------
  // If user typed all 6 digits, auto verify
  useEffect(() => {
    if (currentStep === Step.VERIFY_CODE) {
      const code = otpDigits.join('');
      if (code.length === 6 && !otpDigits.includes('')) {
        handleVerifyCode(code);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpDigits]);

  const handleVerifyCode = async (theCode: string) => {
    try {
      // call the API
      await verifyEmailCode({ email, code: theCode }).unwrap();
      showToast('Email verified successfully!', 'success');
      nextStep();
    } catch (err: any) {
      showToast(err?.data?.message || 'Verification failed', 'error');
      // reset OTP
      setOtpDigits(['', '', '', '', '', '']);
      digitRefs[0].current?.focus();
    }
  };

  // handle digit changes
  const handleDigitChange = (value: string, idx: number) => {
    const digit = value.replace(/\D/, '').slice(-1);
    setOtpDigits((prev) => {
      const copy = [...prev];
      copy[idx] = digit || '';
      return copy;
    });
    // auto-focus next
    if (digit && idx < 5) {
      digitRefs[idx + 1].current?.focus();
    }
  };
  const handleDigitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      setOtpDigits((prev) => {
        const copy = [...prev];
        copy[idx - 1] = '';
        return copy;
      });
      digitRefs[idx - 1].current?.focus();
    }
  };

  // ----------------------------------------------------------------
  //        Step 4) Create User
  // ----------------------------------------------------------------
  const PasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Must be at least 6 chars')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])/,
        'Must contain uppercase, lowercase, digit, and special char.'
      )
  });

  const handleCreateUser = async (thePassword: string) => {
    try {
      setPassword(thePassword);

      // call the final user creation
      await registerUserOnly({
        firstName: basicData.firstName,
        lastName:  basicData.lastName,
        email,
        password:  thePassword,
        roles:     ['SEEKER'], // or your chosen role
        tenantId:  basicData.tenantId || undefined
      }).unwrap();

      showToast('User created successfully!', 'success');
      nextStep();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to create user. Please try again.', 'error');
    }
  };

  // ----------------------------------------------------------------
  //        Step 5) Summary
  // ----------------------------------------------------------------
  const handleGoToLogin = () => {
    // Or you could do something else (like route to a different page)
    window.location.href = '/login';
  };

  // ----------------------------------------------------------------
  //        Render Each Step
  // ----------------------------------------------------------------
  const renderStep = () => {
    switch (currentStep) {
      case Step.BASIC_INFO:
        return (
          <motion.div
            key="basic-info"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FaUser /> Basic Info
            </h2>
            <Formik
              enableReinitialize
              initialValues={basicData}
              validationSchema={BasicInfoSchema}
              onSubmit={handleBasicSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  {/* First Name / Last Name */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block font-medium mb-1">First Name</label>
                      <Field
                        name="firstName"
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block font-medium mb-1">Last Name</label>
                      <Field
                        name="lastName"
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    fullWidth
                  >
                    Next
                  </Button>
                </Form>
              )}
            </Formik>
          </motion.div>
        );

      case Step.REQUEST_CODE:
        return (
          <motion.div
            key="request-code"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
              <FaEnvelope /> Request Verification Code
            </h2>
            <Formik
              enableReinitialize
              initialValues={{ email }}
              validationSchema={EmailSchema}
              onSubmit={async (vals) => {
                await handleRequestCode(vals.email);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 mt-4">
                  {/* Email */}
                  <div>
                    <label className="block font-medium mb-1">Email</label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="user@example.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    loading={isSendingVerification || isSubmitting}
                    fullWidth
                  >
                    {isSendingVerification || isSubmitting
                      ? 'Sending Code...'
                      : 'Next'}
                  </Button>

                  {/* Back */}
                  <div className="flex justify-between mt-4">
                    <Button variant="secondary" onClick={() => prevStep()}>
                      <FaArrowLeft className="mr-2" /> Back
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        );

      case Step.VERIFY_CODE:
        return (
          <motion.div
            key="verify-code"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
              <FaEnvelope /> Verify Code
            </h2>
            <p className="text-gray-500 text-sm mb-3">
              Enter the 6-digit code we emailed to <strong>{email}</strong>.
            </p>

            {/* 6-digit OTP inputs */}
            <div className="flex justify-center gap-2 mb-4">
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

            {/* if user needs a "Resend Code" button: */}
            {/* <Button
              variant="secondary"
              onClick={() => handleRequestCode(email)}
              fullWidth
            >
              Resend Code
            </Button> */}

            {/* or a more advanced cooldown button if you prefer */}
            {/* Back */}
            <div className="flex justify-between mt-4">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(Step.REQUEST_CODE)}
              >
                <FaArrowLeft className="mr-2" /> Back
              </Button>
            </div>
          </motion.div>
        );

      case Step.CREATE_USER:
        return (
          <motion.div
            key="create-user"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FaLock /> Create Password
            </h2>
            <Formik
              enableReinitialize
              initialValues={{ password }}
              validationSchema={PasswordSchema}
              onSubmit={async (vals) => {
                await handleCreateUser(vals.password);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">Password</label>
                    <Field
                      name="password"
                      type="password"
                      className="w-full border border-gray-300 p-2 rounded"
                      placeholder="********"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={isRegisteringUser || isSubmitting}
                    fullWidth
                  >
                    {isRegisteringUser || isSubmitting
                      ? 'Creating User...'
                      : 'Create User'}
                  </Button>

                  <div className="flex justify-between mt-4">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentStep(Step.VERIFY_CODE)}
                    >
                      <FaArrowLeft className="mr-2" /> Back
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        );

      case Step.SUMMARY:
        return (
          <motion.div
            key="summary"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FaCheckCircle /> Registration Complete
            </h2>
            <p className="text-gray-700 text-sm mb-3">
              Your user has been created successfully under email: <strong>{email}</strong>.
            </p>
            <Button
              onClick={handleGoToLogin}
              fullWidth
            >
              Go to Login
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // ----------------------------------------------------------------
  //        Main Return
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-600 flex text-gray-900">
      {/* Left “Fae” assistant panel */}
      <div className="hidden md:flex flex-col items-center justify-center w-2/5 bg-gray-950 text-white p-8 relative">
        <motion.img
          src={Fae}
          alt="Fae Avatar"
          className="w-36 h-36 rounded-full object-cover border-4 border-pink-500 mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        />
        <motion.h2
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Hi, I'm Fae!
        </motion.h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={`fae-message-${currentStep}`}
            className="text-center text-lg max-w-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5 }}
          >
            {faeMessage}
          </motion.p>
        </AnimatePresence>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />
      </div>

      {/* Right panel: Steps and forms */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="max-w-md w-full bg-gray-50 text-gray-900 p-6 rounded-lg shadow relative z-10">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaUser /> User Sign Up
          </h1>

          {/* Toast */}
          <Toast show={toast.show} message={toast.message} onClose={closeToast} />

          {/* Step Indicators */}
          <div className="flex justify-between mb-8">
            {[Step.BASIC_INFO, Step.REQUEST_CODE, Step.VERIFY_CODE, Step.CREATE_USER, Step.SUMMARY].map((step) => (
              <div key={step} className="flex-1 text-center">
                <div
                  className={clsx(
                    'flex flex-col items-center transition-colors',
                    currentStep >= step ? 'text-blue-400' : 'text-gray-400'
                  )}
                >
                  {step === Step.BASIC_INFO &&    <FaUser className="text-2xl" />}
                  {step === Step.REQUEST_CODE &&  <FaEnvelope className="text-2xl" />}
                  {step === Step.VERIFY_CODE &&   <FaCheckCircle className="text-2xl" />}
                  {step === Step.CREATE_USER &&   <FaLock className="text-2xl" />}
                  {step === Step.SUMMARY &&       <FaCheckCircle className="text-2xl" />}

                  <span className="mt-2 font-medium text-sm text-whit">
                    {step === Step.BASIC_INFO &&    'Info'}
                    {step === Step.REQUEST_CODE &&  'Email'}
                    {step === Step.VERIFY_CODE &&   'Code'}
                    {step === Step.CREATE_USER &&   'Password'}
                    {step === Step.SUMMARY &&       'Done'}
                  </span>
                </div>
                {step !== Step.SUMMARY && (
                  <div
                    className={clsx(
                      'h-1 mt-2 mx-auto w-10 rounded-full',
                      currentStep > step ? 'bg-blue-400' : 'bg-gray-500'
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {loadingScreen ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <motion.div
                  className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
                <p className="text-sm text-gray-500">Please wait...</p>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {renderStep()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;
