import React from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaStore, FaUsers } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus size={36} className="text-purple-500" />,
    title: "Sign Up Instantly",
    description:
      "Create a free LogaLuxe account in seconds to kickstart your professional beauty brand. Your dream starts here and become a successful professional beauty brand.",
  },
  {
    icon: <FaStore size={36} className="text-green-500" />,
    title: "Showcase Your Services",
    description:
      "Craft a stunning storefront, highlight your specialties, set competitive prices, and stand out to potential clients.",
  },
  {
    icon: <FaUsers size={36} className="text-red-500" />,
    title: "Grow your Customer Base",
    description:
      "List your offerings, manage bookings seamlessly, and boost your beauty business with a growing community of loyal clients.",
  },
];

// Animation variants for each step card
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.2,
    },
  },
};

const ThreeSteps = () => {
  return (
    <div className="py-12 bg-white border-t border-gray-200">
      {/* Vital Message (always visible) */}
      <div className="mb-4 text-center font-semibold text-[#38312F]">
        Your success is our priority—start your beauty journey now!
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold text-gray-800 mb-8 text-center"
        >
          Get Started in <span className="text-[#CA4372]">3 Easy Steps</span>
        </motion.h2>

        <motion.div
          className="flex flex-col md:flex-row items-stretch gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white/95 p-8 rounded-lg shadow-lg 
                         flex-1 flex flex-col items-center justify-center
                         border-t-6 border-transparent hover:border-[#8E523E]  hover:shadow-xl  transform hover:scale-105
                         transition-all"
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ThreeSteps;
