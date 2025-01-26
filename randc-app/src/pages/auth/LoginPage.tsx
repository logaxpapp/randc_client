// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebookF, FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import { useLoginUserMutation } from '../../features/auth/authApi';
import { useAppDispatch } from '../../app/hooks';
import { setLogin } from '../../features/auth/authSlice';

// Example illustration
import loginIllustration from '../../assets/images/login.svg';

const LoginPage: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      const response = await loginUser({ email, password }).unwrap();
      dispatch(setLogin(response.user));

      const roles = response.user.roles || [];
      if (roles.includes('ADMIN')) {
        navigate('/admin/dashboard');
      }else if (roles.includes('CLEANER') || roles.includes('STAFF')) {
        navigate('/cleaner/dashboard');   //TENANT DASHBOARD
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      const msg = err?.data?.message || 'Invalid credentials. Please try again.';
      setErrorMsg(msg);
    }
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    exit: {
      opacity: 0, 
      y: 50, 
      transition: { duration: 0.3 }
    },
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Decorative Circle (Behind the Scenes) */}
      <motion.div
        className="absolute w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 top-[-5rem] left-[-10rem] z-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 bottom-[-5rem] right-[-5rem] z-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />

      {/* LEFT COLUMN: Illustration */}
      <motion.div
        className="relative flex-1 hidden lg:flex flex-col items-center justify-center bg-white z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="max-w-md px-8">
          <img
            src={loginIllustration}
            alt="Login illustration"
            className="w-full h-auto"
          />
        </div>
        <p className="absolute bottom-4 text-sm text-gray-400">
          Illustration from{' '}
          <a href="https://illlustrations.co" className="underline" target="_blank" rel="noreferrer">
            illlustrations.co
          </a>
        </p>
      </motion.div>

      {/* RIGHT COLUMN: Form */}
      <motion.div
        className="flex-1 flex items-center justify-center px-8 py-12 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="max-w-sm w-full bg-white p-8 rounded-xl shadow-2xl relative">
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                className="mb-4 p-3 bg-red-100 text-red-600 rounded"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sign in to your account and continue leveraging R&C Cleaning Services. 
            Schedule, manage, and streamline your cleaning tasks with ease!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                E-mail Address
              </label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded 
                  focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded 
                  focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>

            {/* Submit + Forgot Password */}
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg 
                  hover:bg-purple-700 transition disabled:opacity-50 shadow-md"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </motion.button>

              <Link to="/forgot-password" className="text-purple-600 hover:underline text-sm">
                Forgot Password?
              </Link>
            </div>
          </form>

          {/* Social Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">Or login with</p>
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition rounded-full text-sm flex items-center gap-2"
              >
                <FaFacebookF />
                Facebook
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition rounded-full text-sm flex items-center gap-2"
              >
                <FaGoogle />
                Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition rounded-full text-sm flex items-center gap-2"
              >
                <FaLinkedinIn />
                LinkedIn
              </motion.button>
            </div>

            {/* Register */}
            <Link
              to="/signup"
              className="inline-block mt-6 text-purple-600 hover:underline font-medium"
            >
              Register new account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
