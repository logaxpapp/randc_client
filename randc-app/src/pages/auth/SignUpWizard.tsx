// // src/pages/auth/SignUpWizard.tsx

// import React, { useState, useEffect, useRef } from 'react';
// import clsx from 'clsx';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FaUser,
//   FaBuilding,
//   FaEnvelope,
//   FaLock,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaKey,
// } from 'react-icons/fa';
// import { MdOutlineDomain } from 'react-icons/md';

// // Import the RTK Query hooks
// import {
//   useRegisterTempUserMutation,
//   useRequestEmailVerificationMutation,
//   useVerifyEmailCodeMutation,
// } from '../../features/auth/authApi';
// import { useCreateTenantMutation } from '../../features/tenant/tenantApi';

// // Your custom UI components
// import Button from '../../components/ui/Button';
// import Loader from '../../components/common/Loader';
// import Tooltip from '../../components/Tooltip';

// /** 4 total steps now */
// enum Step {
//   USER_INFO = 1,
//   EMAIL_VERIFICATION,
//   TENANT_INFO,
//   SUMMARY,
// }

// const SignUpWizard: React.FC = () => {
//   // ──────────  RTK Query hooks  ──────────
//   const [registerTempUser, { isLoading: isRegisteringTempUser }] =
//     useRegisterTempUserMutation();

//   const [requestEmailVerification, { isLoading: isSendingVerification }] =
//     useRequestEmailVerificationMutation();

//   const [verifyEmailCode, { isLoading: isVerifyingCode }] =
//     useVerifyEmailCodeMutation();

//   const [createTenant, { isLoading: isCreatingTenant }] = useCreateTenantMutation();

//   // ──────────  Local state  ──────────

//   // Step 1: user info
//   const [firstName, setFirstName] = useState('');
//   const [lastName,  setLastName]  = useState('');
//   const [email,     setEmail]     = useState('');
//   const [password,  setPassword]  = useState('');

//   // We'll store the newly created user _id (from the back end) if needed
//   const [tempUserId, setTempUserId] = useState<string | null>(null);

//   // Step 2: 6-digit OTP
//   // We store each digit in an array
//   const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
//   // We'll create refs for each input so we can auto-focus next/previous
//   const digitRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

//   // We'll derive verificationCode from otpDigits
//   const verificationCode = otpDigits.join('');
//   const [emailVerified, setEmailVerified] = useState(false);

//   // Step 3: tenant info
//   const [createNewTenant, setCreateNewTenant] = useState(false);
//   const [tenantName,     setTenantName]       = useState('');
//   const [tenantDomain,   setTenantDomain]     = useState('');

//   // Step Management
//   const [step, setStep] = useState<Step>(Step.USER_INFO);

//   // Toast or inline error messages
//   const [toast, setToast] = useState<{
//     type: 'success' | 'error';
//     message: string;
//   } | null>(null);

//   // Resend code cooldown
//   const [resendCooldown, setResendCooldown] = useState(0);
//   const cooldownRef = useRef<NodeJS.Timeout | null>(null);

//   // Final states
//   const [tenantSuccess, setTenantSuccess] = useState(false);
//   const [registrationComplete, setRegistrationComplete] = useState(false);

//   // ──────────  Step navigation  ──────────
//   const goNext = () => setStep((prev) => Math.min(prev + 1, Step.SUMMARY));
//   const goPrev = () => setStep((prev) => Math.max(prev - 1, Step.USER_INFO));

//   // ──────────  Helpers  ──────────
//   function validateEmailAddress(e: string): boolean {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(e);
//   }

//   // Cleanup cooldown timer on unmount
//   useEffect(() => {
//     return () => {
//       if (cooldownRef.current) clearInterval(cooldownRef.current);
//     };
//   }, []);

//   // Auto-focus the first OTP box when we enter Step 2
//   useEffect(() => {
//     if (step === Step.EMAIL_VERIFICATION) {
//       digitRefs[0].current?.focus();
//     }
//   }, [step]);

//   // ──────────  STEP 1: Create temp user  ──────────
//   const handleSubmitUserInfo = async () => {
//     setToast(null);

//     if (!firstName || !lastName || !email || !password) {
//       setToast({ type: 'error', message: 'Please fill out all required fields.' });
//       return;
//     }
//     if (!validateEmailAddress(email)) {
//       setToast({ type: 'error', message: 'Please enter a valid email address.' });
//       return;
//     }
//     if (password.length < 6) {
//       setToast({ type: 'error', message: 'Password must be at least 6 characters long.' });
//       return;
//     } 
//     // PASSWORD VALIDATION MUST HAVE ONE UPPERCASE, ONE LOWERCASE, ONE NUMBER, AND ONE SPECIAL CHARACTER
//     const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
//     if (!passwordRegex.test(password)) {
//       setToast({ type: 'error', message: 'Password must contain at least one uppercase, one lowercase, one number, and one special character.' });
//       return;
//     }

//     try {
//       // 1) Create "temp" user
//       const res = await registerTempUser({ firstName, lastName, email, password }).unwrap();
//       if (res.data && res.data._id) {
//         setTempUserId(res.data._id);
//       }

//       // 2) Attempt to send the verification email
//       try {
//         await requestEmailVerification({ email }).unwrap();
//         setToast({ type: 'success', message: 'Verification code sent. Check your inbox!' });
//       } catch (sendEmailErr: any) {
//         // If sending email fails, log or show a gentle message
//         const emailErrMsg =
//           sendEmailErr?.data?.message ||
//           'We created your account, but sending the verification email failed. You can resend it on the next step.';
//         setToast({ type: 'error', message: emailErrMsg });
//       }

//       // Move to Step 2 (EMAIL_VERIFICATION)
//       setStep(Step.EMAIL_VERIFICATION);
//     } catch (error: any) {
//       // If user creation fails (e.g., email in use)
//       const errorMsg = error?.data?.message || 'Failed to register. Please try again.';
//       setToast({ type: 'error', message: errorMsg });
//     }
//   };

//   // ──────────  STEP 2: OTP Verification  ──────────

//   // Update a single digit in the array
//   function updateDigit(newVal: string, idx: number) {
//     setOtpDigits((prev) => {
//       const updated = [...prev];
//       updated[idx] = newVal;

//       // If all 6 are filled, auto-verify
//       if (updated.every((d) => d.length === 1)) {
//         // Slight delay to ensure state is fully updated
//         setTimeout(() => {
//           handleVerifyCode();
//         }, 50);
//       }
//       return updated;
//     });
//   }

//   // Handle changes in each digit input
//   function handleChangeDigit(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
//     const val = e.target.value.replace(/\D/, ''); // Only keep digits
//     if (!val) {
//       // If empty or non-digit, clear this digit
//       updateDigit('', idx);
//       return;
//     }

//     // Only take first digit if user typed multiple
//     const newDigit = val[0];
//     updateDigit(newDigit, idx);

//     // Move focus to next if not last
//     if (idx < 5 && newDigit) {
//       digitRefs[idx + 1].current?.focus();
//     }
//   }

//   // Handle keyDown for backspace, etc.
//   function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
//     if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
//       // Move focus back if current is empty
//       digitRefs[idx - 1].current?.focus();
//       updateDigit('', idx - 1);
//     }
//   }

//   // Manually triggered verify
//   const handleVerifyCode = async () => {
//     setToast(null);
//     const code = otpDigits.join('');
//     if (code.length < 6) {
//       setToast({ type: 'error', message: 'Please enter the 6-digit code.' });
//       return;
//     }

//     try {
//       await verifyEmailCode({ email, code }).unwrap();
//       setEmailVerified(true);
//       setToast({ type: 'success', message: 'Email verified successfully!' });
//     } catch (error: any) {
//       const errorMsg = error?.data?.message || 'Code verification failed. Try again.';
//       setToast({ type: 'error', message: errorMsg });
//     }
//   };

//   // Resend code logic
//   const handleResendCode = async () => {
//     if (resendCooldown > 0) return; // prevent spam

//     setToast(null);
//     try {
//       await requestEmailVerification({ email }).unwrap();
//       setToast({ type: 'success', message: 'Verification code resent. Check your inbox.' });

//       // Start 30s cooldown
//       setResendCooldown(30);
//       cooldownRef.current = setInterval(() => {
//         setResendCooldown((prev) => {
//           if (prev <= 1 && cooldownRef.current) {
//             clearInterval(cooldownRef.current);
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     } catch (error: any) {
//       const errorMsg = error?.data?.message || 'Failed to resend code. Try again.';
//       setToast({ type: 'error', message: errorMsg });
//     }
//   };

//   // Only allow continuing if email is verified
//   const handleEmailVerificationContinue = () => {
//     if (!emailVerified) {
//       setToast({ type: 'error', message: 'Please verify your email before continuing.' });
//       return;
//     }
//     goNext();
//   };

//   // ──────────  STEP 3: Tenant Info  ──────────
//   const handleSubmitTenantInfo = () => {
//     if (createNewTenant && !tenantName) {
//       setToast({ type: 'error', message: 'Please provide a Tenant/Company name.' });
//       return;
//     }
//     if (createNewTenant && tenantDomain) {
//       const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
//       if (!domainRegex.test(tenantDomain)) {
//         setToast({
//           type: 'error',
//           message: 'Please enter a valid domain (e.g. example.com).',
//         });
//         return;
//       }
//     }
//     setToast(null);
//     goNext();
//   };

//   // ──────────  STEP 4: Summary & Finalize  ──────────
//   const handleFinalSubmit = async () => {
//     setToast(null);
//     try {
//       let createdTenantId: string | undefined;

//       // 1) Create Tenant if needed
//       if (createNewTenant) {
//         const tenantRes = await createTenant({
//           name: tenantName,
//           domain: tenantDomain || undefined,
//         }).unwrap();

//         createdTenantId = tenantRes._id || tenantRes.data?._id;
//         setTenantSuccess(true);
//       }

//       // 2) (Optional) finalizeUserActivation or something similar
//       // e.g.,
//       // await AuthService.finalizeUserActivation(tempUserId, createdTenantId);

//       setToast({ type: 'success', message: 'Registration complete!' });
//       setRegistrationComplete(true);
//     } catch (error: any) {
//       const errorMsg =
//         error?.data?.message || 'An error occurred during finalization. Please try again.';
//       setToast({ type: 'error', message: errorMsg });
//     }
//   };

//   // ──────────  Animations & Step definitions  ──────────
//   const formVariants = {
//     initial: { opacity: 0, x: 50 },
//     animate: { opacity: 1, x: 0 },
//     exit:    { opacity: 0, x: -50 },
//   };

//   const stepsDefinition = [
//     { id: Step.USER_INFO,          label: 'User Info',        icon: <FaUser /> },
//     { id: Step.EMAIL_VERIFICATION, label: 'Verify Email',     icon: <FaEnvelope /> },
//     { id: Step.TENANT_INFO,        label: 'Tenant Info',      icon: <FaBuilding /> },
//     { id: Step.SUMMARY,            label: 'Summary',          icon: <FaCheckCircle /> },
//   ];

//   // ──────────  RENDER  ──────────
//   return (
//     <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-blue-50 to-blue-100 to-white px-4">
//       <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
//         <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
//           Create Your Account
//         </h1>

//         {/* Toast Notification */}
//         <AnimatePresence>
//           {toast && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className={`mb-4 p-4 rounded ${
//                 toast.type === 'success'
//                   ? 'bg-green-100 text-green-700'
//                   : 'bg-red-100 text-red-700'
//               } flex items-center`}
//               role="alert"
//               aria-live="assertive"
//             >
//               {toast.type === 'success' ? (
//                 <FaCheckCircle className="mr-2" />
//               ) : (
//                 <FaTimesCircle className="mr-2" />
//               )}
//               <span>{toast.message}</span>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Step Indicators */}
//         <div className="flex justify-between mb-8">
//           {stepsDefinition.map((s) => (
//             <div key={s.id} className="flex-1 text-center">
//               <div
//                 className={clsx(
//                   'flex flex-col items-center transition-colors duration-300',
//                   step >= s.id ? 'text-blue-600' : 'text-gray-400'
//                 )}
//               >
//                 <div className="text-2xl">{s.icon}</div>
//                 <span className="mt-2 font-medium">{s.label}</span>
//               </div>
//               {s.id !== Step.SUMMARY && (
//                 <div
//                   className={clsx(
//                     'h-1 mt-2 mx-auto w-10 rounded-full',
//                     step > s.id ? 'bg-blue-600' : 'bg-gray-300'
//                   )}
//                 />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Step forms */}
//         <div className="relative">
//           <AnimatePresence>
//             {/* Step #1: USER_INFO */}
//             {step === Step.USER_INFO && (
//               <motion.div
//                 key="user-info"
//                 variants={formVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 transition={{ duration: 0.3 }}
//                 className="space-y-6"
//               >
//                 <p className="text-gray-600 dark:text-gray-300">
//                   Welcome! Let&apos;s get to know you better. Provide your details below.
//                 </p>
//                 <div className="space-y-4">
//                   {/* FirstName */}
//                   <div className="relative">
//                     <FaUser className="absolute left-3 top-3 text-gray-400" />
//                     <input
//                       type="text"
//                       className="pl-10 block w-full border border-gray-300 dark:border-gray-600
//                                  rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500
//                                  dark:bg-gray-700 dark:text-white"
//                       value={firstName}
//                       onChange={(e) => setFirstName(e.target.value)}
//                       placeholder="First Name"
//                       required
//                     />
//                   </div>
//                   {/* LastName */}
//                   <div className="relative">
//                     <FaUser className="absolute left-3 top-3 text-gray-400" />
//                     <input
//                       type="text"
//                       className="pl-10 block w-full border border-gray-300 dark:border-gray-600
//                                  rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500
//                                  dark:bg-gray-700 dark:text-white"
//                       value={lastName}
//                       onChange={(e) => setLastName(e.target.value)}
//                       placeholder="Last Name"
//                       required
//                     />
//                   </div>
//                   {/* Email */}
//                   <div className="relative">
//                     <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
//                     <input
//                       type="email"
//                       className="pl-10 block w-full border border-gray-300 dark:border-gray-600
//                                  rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500
//                                  dark:bg-gray-700 dark:text-white"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="Email Address"
//                       required
//                     />
//                   </div>
//                   {/* Password */}
//                   <div className="relative">
//                     <FaLock className="absolute left-3 top-3 text-gray-400" />
//                     <input
//                       type="password"
//                       className="pl-10 block w-full border border-gray-300 dark:border-gray-600
//                                  rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500
//                                  dark:bg-gray-700 dark:text-white"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="Password (6+ chars)"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-end">
//                   <Button onClick={handleSubmitUserInfo} loading={isRegisteringTempUser}>
//                     Next
//                   </Button>
//                 </div>
//               </motion.div>
//             )}

//             {/* Step #2: EMAIL_VERIFICATION (6-digit OTP) */}
//             {step === Step.EMAIL_VERIFICATION && (
//               <motion.div
//                 key="email-verification"
//                 variants={formVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 transition={{ duration: 0.3 }}
//                 className="space-y-6"
//               >
//                 <p className="text-gray-600 dark:text-gray-300 text-center">
//                   We have sent a <strong>6–digit OTP</strong> to <strong>{email}</strong>.<br />
//                   Please enter the code below to verify your email.
//                 </p>

//                 {/* 6 OTP inputs in a row */}
//                 <div className="flex justify-center space-x-2">
//                   {otpDigits.map((digit, idx) => (
//                     <input
//                       key={idx}
//                       ref={digitRefs[idx]}
//                       type="text"
//                       inputMode="numeric"
//                       maxLength={1}
//                       className="w-12 h-12 text-center text-2xl border border-gray-300
//                                  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={digit}
//                       onChange={(e) => handleChangeDigit(e, idx)}
//                       onKeyDown={(e) => handleKeyDown(e, idx)}
//                     />
//                   ))}
//                 </div>

//                 {/* Buttons for manual Verify & Resend */}
//                 <div className="flex flex-col items-center space-y-4 mt-4">
//                   <Button onClick={handleVerifyCode} loading={isVerifyingCode}>
//                     Verify
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     onClick={handleResendCode}
//                     disabled={resendCooldown > 0}
//                   >
//                     {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
//                   </Button>
//                 </div>

//                 <div className="flex justify-between mt-8">
//                   <Button variant="secondary" onClick={goPrev}>
//                     Back
//                   </Button>
//                   <Button onClick={handleEmailVerificationContinue}>
//                     Continue
//                   </Button>
//                 </div>
//               </motion.div>
//             )}

//             {/* Step #3: TENANT_INFO */}
//             {step === Step.TENANT_INFO && (
//               <motion.div
//                 key="tenant-info"
//                 variants={formVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 transition={{ duration: 0.3 }}
//                 className="space-y-6"
//               >
//                 <p className="text-gray-600 dark:text-gray-300">
//                   Would you like to create a new Tenant/Company for your account?
//                 </p>

//                 <div className="flex items-center gap-3">
//                   <input
//                     type="checkbox"
//                     id="createTenant"
//                     checked={createNewTenant}
//                     onChange={(e) => setCreateNewTenant(e.target.checked)}
//                     className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label
//                     htmlFor="createTenant"
//                     className="text-gray-700 dark:text-gray-200 cursor-pointer"
//                   >
//                     Yes, I want to create a new Tenant/Company
//                   </label>
//                 </div>

//                 {createNewTenant && (
//                   <div className="space-y-4">
//                     <div className="relative">
//                       <FaBuilding className="absolute left-3 top-3 text-gray-400" />
//                       <input
//                         type="text"
//                         className="pl-10 block w-full border border-gray-300 dark:border-gray-600
//                                    rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500
//                                    dark:bg-gray-700 dark:text-white"
//                         value={tenantName}
//                         onChange={(e) => setTenantName(e.target.value)}
//                         placeholder="Company Name"
//                         required
//                       />
//                     </div>

//                     <div className="relative">
//                       <MdOutlineDomain className="absolute left-3 top-3 text-gray-400" />
//                       <input
//                         type="text"
//                         className="pl-10 block w-full border border-gray-300 dark:border-gray-600
//                                    rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500
//                                    dark:bg-gray-700 dark:text-white"
//                         value={tenantDomain}
//                         onChange={(e) => setTenantDomain(e.target.value)}
//                         placeholder="Domain (optional)"
//                       />
//                       <Tooltip
//                         message="Enter a unique domain for your company (e.g. example.com)"
//                         position="right"
//                       >
//                         <FaKey className="absolute right-3 top-3 text-gray-400 cursor-pointer" />
//                       </Tooltip>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex justify-between">
//                   <Button variant="secondary" onClick={goPrev}>
//                     Back
//                   </Button>
//                   <Button onClick={handleSubmitTenantInfo}>Next</Button>
//                 </div>
//               </motion.div>
//             )}

//             {/* Step #4: SUMMARY */}
//             {step === Step.SUMMARY && (
//               <motion.div
//                 key="summary"
//                 variants={formVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 transition={{ duration: 0.3 }}
//                 className="space-y-6"
//               >
//                 {!registrationComplete ? (
//                   <>
//                     <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
//                       Review Your Information
//                     </h2>
//                     <div className="space-y-2">
//                       <div className="flex items-center">
//                         <FaEnvelope className="text-gray-400 mr-2" />
//                         <span className="text-gray-700 dark:text-gray-200">
//                           <strong>Email:</strong> {email}
//                         </span>
//                       </div>
//                       <div className="flex items-center">
//                         <FaLock className="text-gray-400 mr-2" />
//                         <span className="text-gray-700 dark:text-gray-200">
//                           <strong>Password:</strong> ••••••
//                         </span>
//                       </div>
//                       {createNewTenant && (
//                         <>
//                           <div className="flex items-center">
//                             <FaBuilding className="text-gray-400 mr-2" />
//                             <span className="text-gray-700 dark:text-gray-200">
//                               <strong>Tenant Name:</strong> {tenantName}
//                             </span>
//                           </div>
//                           <div className="flex items-center">
//                             <MdOutlineDomain className="text-gray-400 mr-2" />
//                             <span className="text-gray-700 dark:text-gray-200">
//                               <strong>Tenant Domain:</strong> {tenantDomain || 'N/A'}
//                             </span>
//                           </div>
//                         </>
//                       )}
//                     </div>

//                     {isCreatingTenant && (
//                       <div className="flex items-center text-blue-600">
//                         <Loader />
//                         <span>Creating tenant, please wait...</span>
//                       </div>
//                     )}

//                     <div className="flex justify-between">
//                       <Button variant="secondary" onClick={goPrev} disabled={isCreatingTenant}>
//                         Back
//                       </Button>
//                       <Button
//                         onClick={handleFinalSubmit}
//                         loading={isCreatingTenant}
//                         disabled={isCreatingTenant}
//                       >
//                         Finish
//                       </Button>
//                     </div>
//                   </>
//                 ) : (
//                   /* If user is fully registered + tenant creation done */
//                   <div className="text-center space-y-4">
//                     <FaCheckCircle className="text-green-500 mx-auto text-4xl" />
//                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
//                       Success!
//                     </h2>
//                     <p className="text-gray-600 dark:text-gray-300">
//                       You have successfully signed up.
//                     </p>
//                     {tenantSuccess && (
//                       <p className="text-green-600 dark:text-green-400">
//                         Tenant was also created successfully.
//                       </p>
//                     )}
//                     <Button onClick={() => (window.location.href = '/dashboard')}>
//                       Go to Dashboard
//                     </Button>
//                   </div>
//                 )}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpWizard;
