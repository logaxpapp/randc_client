// src/pages/signup/SignUpSelect.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaBuilding, FaSignInAlt } from "react-icons/fa";

const SignUpSelect: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-lime-100 via-white to-lime-50">
      {/* Optional Wave Divider at Top */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#101820"
            fillOpacity="1"
            d="M0,256L48,224C96,192,192,128,288,112C384,96,480,128,576,149.3C672,171,768,181,864,202.7C960,224,1056,256,1152,240C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <motion.div
        className="relative z-10 max-w-xl w-full bg-white rounded-md shadow-2xl p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Your Account
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Select how you’d like to sign up.
        </p>

        {/* Buttons Area */}
        <div className="flex flex-col space-y-4">
          {/* Sign Up as User */}
          <Link
            to="/user-signup"
            className="block w-full bg-lime-400 hover:bg-lime-500 
                       text-gray-900 font-semibold text-center py-3 rounded-md 
                       transition transform hover:scale-[1.02] flex items-center justify-center"
          >
            <FaUser className="mr-2 text-xl" />
            Sign Up as a User
          </Link>

          {/* Sign Up as Business */}
          <Link
            to="/company-signup"
            className="block w-full bg-blue-500 hover:bg-blue-600 
                       text-white font-semibold text-center py-3 rounded-md 
                       transition transform hover:scale-[1.02] flex items-center justify-center"
          >
            <FaBuilding className="mr-2 text-xl" />
            Sign Up as a Business
          </Link>
        </div>

        {/* Already have an account? */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-lime-600 hover:underline font-medium inline-flex items-center"
            >
              <FaSignInAlt className="mr-1" />
              Login
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Optional Wave Divider at Bottom */}
      <div className="absolute bottom-0 w-full leading-[0]">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#101820"
            fillOpacity="1"
            d="M0,64L48,74.7C96,85,192,107,288,101.3C384,96,480,64,576,53.3C672,43,768,53,864,80C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default SignUpSelect;
