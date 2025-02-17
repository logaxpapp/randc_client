import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash, FaFacebookF, FaGoogle, FaLinkedinIn } from "react-icons/fa"; // Import eye icons
import { useLoginUserMutation } from "../../features/auth/authApi";
import { useAppDispatch } from "../../app/hooks";
import { setLogin } from "../../features/auth/authSlice";
import loginIllustration from "../../assets/images/login1.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      const response = await loginUser({ email, password }).unwrap();
      dispatch(setLogin(response.user));

      const roles = response.user.roles || [];
      if (roles.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else if (roles.includes("CLEANER") || roles.includes("STAFF")) {
        navigate("/cleaner/dashboard");
      } 
      else if (roles.includes("SEEKER")) {
        navigate("/seeker/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      const msg = err?.data?.message || "Invalid credentials. Please try again.";
      setErrorMsg(msg);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Framer Motion Variants (no changes needed)
  const containerVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative z-30 flex min-h-screen overflow-hidden bg-gradient-to-b from-gray-900/80 via-black/40 to-black/70 text-gray-100">
      {/* Decorative Circles (slightly adjusted) */}
      <motion.div
        className="absolute w-80 h-80 bg-amber-400 opacity-10 rounded-full top-[-5rem] left-[-10rem] z-100" // Reduced opacity
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.4, scale: 1 }} // Adjusted animation
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 bottom-[-5rem] right-[-5rem] z-100" // Reduced opacity
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.3, scale: 1 }} // Adjusted animation
        transition={{ duration: 1.2, delay: 0.3 }}
      />

      {/* LEFT COLUMN: Illustration (no changes needed) */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 px-8 z-100">
        <img src={loginIllustration} alt="Login Illustration" className="w-full max-w-md" />
        <h2 className="text-4xl font-bold mt-8 text-center">Welcome Back!</h2>
        <p className="text-lg text-center mt-4">
          Please enter your details to login.
        </p>
      </div>
      
    

      {/* RIGHT COLUMN: Form */}
      <motion.div
        className="flex-1 flex items-center justify-center px-6 py-12 z-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="max-w-sm w-full bg-gray-100/80 backdrop-blur-md text-gray-800 p-8 rounded-xl shadow-2xl relative">
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

          <h2 className="text-3xl font-bold mb-4 text-center">Welcome Back!</h2> {/* Centered title */}
          <p className="text-gray-600 mb-8 leading-relaxed text-center"> {/* Centered description */}
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                E-mail Address
              </label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 transition bg-gray-50" // Added background
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="relative"> {/* Added relative wrapper for icon positioning */}
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"} // Toggle password visibility
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400 transition bg-gray-50" // Added background
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
              <button
                type="button" // Important: Don't submit the form
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-14 -translate-y-1/2 text-gray-500 hover:text-gray-700 justify-center"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Submit + Forgot Password */}
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-amber-400 text-white font-medium rounded-lg hover:bg-amber-600 transition disabled:opacity-50 shadow-md"
              >
                {isLoading ? "Logging in..." : "Login"}
              </motion.button>

              <Link
                to="/forgot-password"
                className="text-amber-500 hover:underline text-sm font-medium"
              >
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
              className="inline-block mt-6 text-amber-600 hover:underline font-bold"
            >
              Create an account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
