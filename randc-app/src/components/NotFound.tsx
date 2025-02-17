import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';

// Optional: an illustration for the 404 (you can replace with your own SVG or image)
import errorIllustration from '../assets/images/co.png';

const NotFoundPage: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden text-gray-700">
      {/* Top wave divider */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-32 md:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10">
        {/* Animated heading */}
        <motion.h1
          className="text-7xl sm:text-9xl font-extrabold text-blue-600 drop-shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          404
        </motion.h1>

        {/* Subheading */}
        <motion.h2
          className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Oops! Page not found.
        </motion.h2>

        {/* Description / CTA */}
        <motion.p
          className="max-w-md text-center text-gray-600 mt-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          The page you are looking for might have been moved or deleted. 
          Please check the URL or go back home.
        </motion.p>

        {/* Illustration */}
        <motion.div
          className="w-full max-w-md mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img
            src={errorIllustration}
            alt="404 Illustration"
            className="w-full h-auto object-cover"
          />
        </motion.div>

        {/* Back to Home button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaHome />
            Go to Homepage
          </Link>
        </motion.div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-32 md:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L40,74.7C80,85,160,107,240,128C320,149,400,171,480,192C560,213,640,235,720,234.7C800,235,880,213,960,181.3C1040,149,1120,107,1200,101.3C1280,96,1360,128,1400,144L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default NotFoundPage;
