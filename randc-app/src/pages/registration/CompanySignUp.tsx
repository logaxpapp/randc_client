import React, { useState, useEffect, useRef } from 'react';
import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowCircleLeft,
} from 'react-icons/fa';
import { MdOutlineDomain } from 'react-icons/md';

import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

import {
  useCreateTenantMutation,
} from '../../features/tenant/tenantApi';

import {
  useRequestEmailVerificationMutation,
  useVerifyEmailCodeMutation,
  useRegisterUserOnlyMutation,
} from '../../features/auth/authApi';

import Button from '../../components/ui/Button';
import Tooltip from '../../components/Tooltip';
import Toast from '../../components/ui/Toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// --- Avatars (example images; adjust paths as needed) ---
import FaeAvatar from '../../assets/images/fae.svg';
import KaiAvatar from '../../assets/images/Naya.svg';
import ZaraAvatar from '../../assets/images/Fago.svg';
import RileyAvatar from '../../assets/images/Fago.svg';

/**
 * Steps for multi-step sign-up flow:
 *  1) TENANT_GENERAL
 *  2) TENANT_ADDRESS
 *  3) REQUEST_CODE
 *  4) VERIFY_CODE
 *  5) USER_CREATION
 *  6) SUMMARY
 */
enum Step {
  TENANT_GENERAL = 1,
  TENANT_ADDRESS,
  REQUEST_CODE,
  VERIFY_CODE,
  USER_CREATION,
  SUMMARY,
}

/** Assistant text shown at each step */
const assistantMessages: Record<Step, string> = {
  [Step.TENANT_GENERAL]:
    "Tenant name must be unique. Let's set up your new company so you can get started quickly!",
  [Step.TENANT_ADDRESS]:
    "Hi, I'm Riley! Let's set up your company's address details to complete the registration.",
  [Step.REQUEST_CODE]:
    "You're doing awesome! Next, let's verify your email. I'll take over from here!",
  [Step.VERIFY_CODE]:
    "We just emailed you a code! Enter those 6 digits to confirm your email. I’m with you 'til the finish line!",
  [Step.USER_CREATION]:
    "Great job verifying your email! Now let’s create your owner account. Almost there!",
  [Step.SUMMARY]:
    "Perfect! Tenant creation complete and user is set up. You’re all set to explore your new platform!",
};

/** Assistant configurations for each step: avatar, name, background style, etc. */
const assistantConfigs: Record<
  Step,
  {
    name: string;
    avatar: string;
    bgClasses: string;    // background + text colors
    headingColor: string; // heading text color
    messageColor: string; // main message color
  }
> = {
  [Step.TENANT_GENERAL]: {
    name: 'Fae',
    avatar: FaeAvatar,
    bgClasses: 'bg-gray-950 text-white',
    headingColor: 'text-yellow-300',
    messageColor: 'text-white',
  },
  [Step.TENANT_ADDRESS]: {
    name: 'Riley',
    avatar: RileyAvatar,
    bgClasses: 'bg-pink-900 text-white',
    headingColor: 'text-teal-300',
    messageColor: 'text-white',
  },
  [Step.REQUEST_CODE]: {
    name: 'Kai',
    avatar: KaiAvatar,
    bgClasses: 'bg-purple-900 text-white',
    headingColor: 'text-green-300',
    messageColor: 'text-white',
  },
  [Step.VERIFY_CODE]: {
    name: 'Zara',
    avatar: ZaraAvatar,
    bgClasses: 'bg-blue-800 text-white',
    headingColor: 'text-pink-300',
    messageColor: 'text-white',
  },
  [Step.USER_CREATION]: {
    name: 'Fae',
    avatar: FaeAvatar,
    bgClasses: 'bg-green-900 text-white',
    headingColor: 'text-yellow-300',
    messageColor: 'text-white',
  },
  [Step.SUMMARY]: {
    name: 'Kai',
    avatar: KaiAvatar,
    bgClasses: 'bg-black text-white',
    headingColor: 'text-purple-300',
    messageColor: 'text-white',
  },
};

const CompanySignUp: React.FC = () => {
  // ----------------------------------------------------------------
  //                 API Call Hooks
  // ----------------------------------------------------------------
  const [createTenant, { isLoading: isCreatingTenant }] = useCreateTenantMutation();
  const [requestEmailVerification, { isLoading: isSendingVerification }] =
    useRequestEmailVerificationMutation();
  const [verifyEmailCode, { isLoading: isVerifyingCode }] = useVerifyEmailCodeMutation();
  const [registerUserOnly, { isLoading: isRegisteringUser }] = useRegisterUserOnlyMutation();

  // ----------------------------------------------------------------
  //                 Step State & Data
  // ----------------------------------------------------------------
  const [currentStep, setCurrentStep] = useState<Step>(Step.TENANT_GENERAL);

  // Track whether each step is “done” so we can skip re-submitting
  const [isTenantCreated, setIsTenantCreated] = useState(false);
  const [isCodeRequested, setIsCodeRequested] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);

  // Tenant data
  const [tenantData, setTenantData] = useState<{
    tenantName: string;
    domain: string;
    aboutUs: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    _id?: string;
  }>({
    tenantName: '',
    domain: '',
    aboutUs: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    _id: '',
  });

  // Email data
  const [email, setEmail] = useState('');

  // OTP fields
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const digitRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  // User data
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    password: '',
  });

  // Toast
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Resend code timer
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Loading screen on step change
  const [loadingScreen, setLoadingScreen] = useState(false);

  // ----------------------------------------------------------------
  //                 Navigation Helpers
  // ----------------------------------------------------------------
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // ----------------------------------------------------------------
  //                 Toast Helpers
  // ----------------------------------------------------------------
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((old) => ({ ...old, show: false }));
    }, 5000);
  };
  const closeToast = () => setToast((old) => ({ ...old, show: false }));

  // Cleanup cooldown on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  // If we have 6 digits, attempt verification
  useEffect(() => {
    if (currentStep === Step.VERIFY_CODE) {
      const code = otpDigits.join('');
      if (code.length === 6 && !otpDigits.includes('')) {
        handleVerifyCode(code);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpDigits]);

  // Show a brief loading screen between steps
  useEffect(() => {
    setLoadingScreen(true);
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // ----------------------------------------------------------------
  //                 Yup Validation Schemas
  // ----------------------------------------------------------------
  // Step 1: General tenant info
  const TenantGeneralSchema = Yup.object().shape({
    tenantName: Yup.string().required('Company Name is required'),
    domain: Yup.string().nullable(),
    aboutUs: Yup.string().nullable(),
  });

  // Step 2: Tenant address
  const TenantAddressSchema = Yup.object().shape({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    postalCode: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required'),
  });

  // Step 5: User creation
  const UserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Must be at least 6 chars')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])/,
        'Must have uppercase, lowercase, digit, special char.'
      ),
  });

  // ----------------------------------------------------------------
  //     Step 1) Tenant (General Info) - just store in state
  // ----------------------------------------------------------------
  const handleTenantGeneralSubmit = async (vals: {
    tenantName: string;
    domain?: string;
    aboutUs?: string;
  }) => {
    // Save into tenantData state, then move to next step
    setTenantData((prev) => ({
      ...prev,
      tenantName: vals.tenantName,
      domain: vals.domain || '',
      aboutUs: vals.aboutUs || '',
    }));
    nextStep();
  };

  // ----------------------------------------------------------------
  //     Step 2) Tenant (Address) - createTenant API call here
  // ----------------------------------------------------------------
  const handleTenantAddressSubmit = async (vals: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    // If already created, skip
    if (isTenantCreated && tenantData._id) {
      nextStep();
      return;
    }

    // Combine new address data into tenantData
    const updatedTenant = {
      ...tenantData,
      address: {
        street: vals.street,
        city: vals.city,
        state: vals.state,
        postalCode: vals.postalCode,
        country: vals.country,
      },
    };

    setTenantData(updatedTenant);

    try {
      // Simulate short delay
      await new Promise((res) => setTimeout(res, 500));

      // Now create tenant
      const result = await createTenant({
        name: updatedTenant.tenantName,
        domain: updatedTenant.domain,
        aboutUs: updatedTenant.aboutUs,
        address: updatedTenant.address,
      }).unwrap();

      // Save _id
      setTenantData((prev) => ({
        ...prev,
        _id: result.data?._id || result._id,
      }));

      setIsTenantCreated(true);
      showToast('Tenant created successfully!', 'success');
      nextStep();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to create tenant', 'error');
    }
  };

  // ----------------------------------------------------------------
  //     Step 3) Request Email Code
  // ----------------------------------------------------------------
  const handleRequestCode = async (emailVal: string) => {
    // If we've already requested code, skip
    if (isCodeRequested) {
      nextStep();
      return;
    }

    setEmail(emailVal);
    try {
      await new Promise((res) => setTimeout(res, 500));

      await requestEmailVerification({ email: emailVal }).unwrap();

      setIsCodeRequested(true);
      showToast('Verification code sent to your email!', 'success');
      nextStep();
      startResendCooldown();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to send code', 'error');
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(30);
    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    try {
      showToast('Requesting new code...', 'success');
      await requestEmailVerification({ email }).unwrap();
      showToast('Verification code resent!', 'success');
      startResendCooldown();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to resend code', 'error');
    }
  };

  // ----------------------------------------------------------------
  //     Step 4) Verify Code
  // ----------------------------------------------------------------
  const handleVerifyCode = async (theCode: string) => {
    if (isEmailVerified) {
      nextStep();
      return;
    }

    try {
      await new Promise((res) => setTimeout(res, 500));

      await verifyEmailCode({ email, code: theCode }).unwrap();
      setIsEmailVerified(true);
      showToast('Email verified successfully!', 'success');
      nextStep();
    } catch (err: any) {
      showToast(err?.data?.message || 'Verification failed', 'error');
      // Clear OTP
      setOtpDigits(['', '', '', '', '', '']);
      digitRefs[0].current?.focus();
    }
  };

  // ----------------------------------------------------------------
  //     Step 5) Create Owner User
  // ----------------------------------------------------------------
  const handleUserSubmit = async (vals: typeof userData) => {
    if (isUserCreated) {
      nextStep();
      return;
    }

    setUserData(vals);
    try {
      await new Promise((res) => setTimeout(res, 500));

      await registerUserOnly({
        firstName: vals.firstName,
        lastName: vals.lastName,
        email,
        password: vals.password,
        roles: ['CLEANER'],
        tenantId: tenantData._id,
      }).unwrap();

      setIsUserCreated(true);
      showToast('User created successfully!', 'success');
      nextStep();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to create user.', 'error');
    }
  };

  // ----------------------------------------------------------------
  //     OTP Helpers
  // ----------------------------------------------------------------
  const handleDigitChange = (value: string, idx: number) => {
    const digit = value.replace(/\D/, '').slice(-1);
    setOtpDigits((prev) => {
      const updated = [...prev];
      updated[idx] = digit || '';
      return updated;
    });
    if (digit && idx < 5) {
      digitRefs[idx + 1].current?.focus();
    }
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      setOtpDigits((prev) => {
        const updated = [...prev];
        updated[idx - 1] = '';
        return updated;
      });
      digitRefs[idx - 1].current?.focus();
    }
  };

  // ----------------------------------------------------------------
  //     Animations
  // ----------------------------------------------------------------
  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // Choose config for the current step
  const { name, avatar, bgClasses, headingColor, messageColor } = assistantConfigs[currentStep];
  const assistantMessage = assistantMessages[currentStep];

  // ----------------------------------------------------------------
  //     Render Each Step
  // ----------------------------------------------------------------
  const renderStep = () => {
    switch (currentStep) {
      /** STEP 1: TENANT_GENERAL */
      case Step.TENANT_GENERAL:
        return (
          <motion.div
            key="tenant-general"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FaBuilding /> Tenant: General Info
            </h2>
            <Formik
              initialValues={{
                tenantName: tenantData.tenantName,
                domain: tenantData.domain,
                aboutUs: tenantData.aboutUs,
              }}
              validationSchema={TenantGeneralSchema}
              onSubmit={handleTenantGeneralSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">Company Name</label>
                    <Field
                      name="tenantName"
                      type="text"
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="e.g. Awesome Inc."
                    />
                    <ErrorMessage
                      name="tenantName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      (This name needs to be unique)
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Domain (optional)</label>
                    <div className="relative">
                      <MdOutlineDomain className="absolute left-3 top-3 text-gray-400" />
                      <Field
                        name="domain"
                        type="text"
                        placeholder="example.com"
                        className="pl-10 w-full border border-gray-300 rounded p-2"
                      />
                      <Tooltip
                        message="Unique domain for your company (optional)"
                        position="right"
                      >
                        <FaEnvelope className="absolute right-3 top-3 text-gray-400 cursor-pointer" />
                      </Tooltip>
                    </div>
                    <ErrorMessage
                      name="domain"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">About Us (optional)</label>
                    <Field
                      as="textarea"
                      name="aboutUs"
                      rows={3}
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="Short description..."
                    />
                    <ErrorMessage
                      name="aboutUs"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Next Button */}
                  <Button type="submit" loading={isSubmitting} fullWidth>
                    Next
                  </Button>
                </Form>
              )}
            </Formik>
          </motion.div>
        );

      /** STEP 2: TENANT_ADDRESS */
      case Step.TENANT_ADDRESS:
        return (
          <motion.div
            key="tenant-address"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FaBuilding /> Tenant: Address
            </h2>
            <Formik
              initialValues={{
                street: tenantData.address.street,
                city: tenantData.address.city,
                state: tenantData.address.state,
                postalCode: tenantData.address.postalCode,
                country: tenantData.address.country,
              }}
              validationSchema={TenantAddressSchema}
              onSubmit={handleTenantAddressSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">Street</label>
                    <Field
                      name="street"
                      type="text"
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="123 Main St"
                    />
                    <ErrorMessage
                      name="street"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">City</label>
                    <Field
                      name="city"
                      type="text"
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="Springfield"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">State</label>
                    <Field
                      name="state"
                      type="text"
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="Illinois"
                    />
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Postal Code</label>
                    <Field
                      name="postalCode"
                      type="text"
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="12345"
                    />
                    <ErrorMessage
                      name="postalCode"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Country</label>
                    <Field
                      name="country"
                      type="text"
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="USA"
                    />
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Button row */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => prevStep()}
                    >
                      <FaArrowCircleLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      type="submit"
                      loading={isCreatingTenant || isSubmitting}
                      fullWidth
                    >
                      {isTenantCreated
                        ? 'Next'
                        : isCreatingTenant || isSubmitting
                        ? 'Creating Tenant...'
                        : 'Create Tenant'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        );

      /** STEP 3: REQUEST_CODE */
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
              <FaEnvelope /> Request Email Verification
            </h2>
            <Formik
              enableReinitialize
              initialValues={{ email }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email('Invalid email')
                  .required('Email is required'),
              })}
              onSubmit={async (vals) => {
                await handleRequestCode(vals.email);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 mt-4">
                  <div>
                    <label className="block font-medium mb-1">Email</label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="owner@company.com"
                      disabled={isCodeRequested}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={isSendingVerification || isSubmitting}
                    fullWidth
                  >
                    {isCodeRequested
                      ? 'Next'
                      : isSendingVerification || isSubmitting
                      ? 'Sending Code...'
                      : 'Next'}
                  </Button>

                  <div className="flex justify-between mt-4">
                    <Button variant="secondary" onClick={() => prevStep()}>
                      <FaArrowCircleLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        );

      /** STEP 4: VERIFY_CODE */
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
              <FaEnvelope /> Verify Email Code
            </h2>
            <p className="text-gray-300 text-sm mb-3">
              Enter the 6-digit code we sent to <strong>{email}</strong>.
            </p>

            <div className="flex justify-center gap-2 mb-4">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={digitRefs[idx]}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl border border-gray-300 rounded focus:outline-none bg-gray-100"
                  value={digit}
                  disabled={isEmailVerified}
                  onChange={(e) => handleDigitChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                />
              ))}
            </div>

            {!isEmailVerified && (
              <Button
                variant="secondary"
                onClick={handleResendCode}
                disabled={resendCooldown > 0}
                fullWidth
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend Code'}
              </Button>
            )}

            <div className="flex justify-between mt-4">
              <Button variant="secondary" onClick={() => setCurrentStep(Step.REQUEST_CODE)}>
                <FaArrowLeft className="w-4 h-4" />
              </Button>

              {/* If user isEmailVerified, show "Next" button */}
              {isEmailVerified && (
                <Button variant="primary" onClick={() => nextStep()}>
                  Next
                </Button>
              )}
            </div>
          </motion.div>
        );

      /** STEP 5: USER_CREATION */
      case Step.USER_CREATION:
        return (
          <motion.div
            key="user-creation"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
              <FaUser /> Create Owner Account
            </h2>
            <Formik
              enableReinitialize
              initialValues={userData}
              validationSchema={UserSchema}
              onSubmit={handleUserSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 mt-4">
                  <div>
                    <label className="block font-medium mb-1">First Name</label>
                    <Field
                      name="firstName"
                      type="text"
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="John"
                      disabled={isUserCreated}
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Last Name</label>
                    <Field
                      name="lastName"
                      type="text"
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="Doe"
                      disabled={isUserCreated}
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Password</label>
                    <Field
                      name="password"
                      type="password"
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="StrongPass1!"
                      disabled={isUserCreated}
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
                    {isUserCreated
                      ? 'Next'
                      : isRegisteringUser || isSubmitting
                      ? 'Creating User...'
                      : 'Create User'}
                  </Button>

                  <div className="flex justify-between mt-4">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentStep(Step.VERIFY_CODE)}
                    >
                      Back
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        );

      /** STEP 6: SUMMARY */
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
            <p className="text-gray-300 mb-4">
              Tenant <strong className="text-white">{tenantData.tenantName}</strong>{' '}
              has been created.<br />
              The owner’s email{' '}
              <strong className="text-white">{email}</strong> is verified and a user account is now active.
            </p>
            <Button
              onClick={() => (window.location.href = '/login')}
              fullWidth
              className="mt-2"
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
  //                 Main Render
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900">
      {/* Left “assistant” panel */}
      <div
        className={clsx(
          'hidden md:flex flex-col items-center justify-center w-2/5 p-8 relative',
          bgClasses // e.g. "bg-gray-950 text-white"
        )}
      >
        <motion.img
          src={avatar}
          alt={`${name} Avatar`}
          className="w-36 h-36 rounded-full object-cover border-4 border-pink-500 mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        />
        <motion.h2
          className={clsx(
            'text-3xl font-bold mb-2',
            headingColor // e.g. "text-yellow-300"
          )}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Hi, I'm {name}!
        </motion.h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={`assistant-message-${currentStep}`}
            className={clsx(
              'text-center text-lg max-w-xs',
              messageColor // e.g. "text-white"
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5 }}
          >
            {assistantMessage}
          </motion.p>
        </AnimatePresence>

        {/* Vital message always visible */}
        <p className="absolute bottom-4 left-4 text-xs text-gray-300 italic">
          Vital message: Keep your personal credentials safe!
        </p>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" />
      </div>

      {/* Right panel: Steps and forms */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="max-w-md w-full bg-gray-50 text-gray-900 p-6 rounded-lg shadow relative z-10">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaBuilding /> Company Sign Up
          </h1>

          {/* Toast */}
          <Toast show={toast.show} message={toast.message} onClose={closeToast} />

          {/* Step Indicators */}
          <div className="flex justify-between mb-8">
            {[
              Step.TENANT_GENERAL,
              Step.TENANT_ADDRESS,
              Step.REQUEST_CODE,
              Step.VERIFY_CODE,
              Step.USER_CREATION,
              Step.SUMMARY,
            ].map((step) => (
              <div key={step} className="flex-1 text-center">
                <div
                  className={clsx(
                    'flex flex-col items-center transition-colors',
                    currentStep >= step ? 'text-blue-400' : 'text-gray-400'
                  )}
                >
                  {step === Step.TENANT_GENERAL && (
                    <FaBuilding className="text-2xl" />
                  )}
                  {step === Step.TENANT_ADDRESS && (
                    <FaBuilding className="text-2xl" />
                  )}
                  {step === Step.REQUEST_CODE && (
                    <FaEnvelope className="text-2xl" />
                  )}
                  {step === Step.VERIFY_CODE && (
                    <FaCheckCircle className="text-2xl" />
                  )}
                  {step === Step.USER_CREATION && (
                    <FaUser className="text-2xl" />
                  )}
                  {step === Step.SUMMARY && (
                    <FaCheckCircle className="text-2xl" />
                  )}

                  <span className="mt-2 font-medium text-sm text-white/90">
                    {step === Step.TENANT_GENERAL && 'General'}
                    {step === Step.TENANT_ADDRESS && 'Address'}
                    {step === Step.REQUEST_CODE && 'Email'}
                    {step === Step.VERIFY_CODE && 'Code'}
                    {step === Step.USER_CREATION && 'User'}
                    {step === Step.SUMMARY && 'Summary'}
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
                <p className="text-sm text-gray-300">Please wait...</p>
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

export default CompanySignUp;
