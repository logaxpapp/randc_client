import React from "react";
import { motion } from "framer-motion";
import { FaHandsWash, FaRegSmile, FaGlobe, FaLifeRing, FaRocket, FaChartLine } from "react-icons/fa";

const featuresData = [
  {
    icon: <FaHandsWash />,
    title: "Cutting-Edge Cleaning Tools",
    description: "Access specialized solutions for smarter cleaning.",
  },
  {
    icon: <FaRegSmile />,
    title: "Boost Customer Confidence",
    description: "Build trust with reviews and custom profiles.",
  },
  {
    icon: <FaGlobe />,
    title: "Expand Your Reach",
    description: "Grow locally or globally with built-in marketing.",
  },
  {
    icon: <FaLifeRing />,
    title: "24/7 Support",
    description: "Get assistance whenever you need it.",
  },
  {
    icon: <FaRocket />,
    title: "Growth Insights",
    description: "Use analytics to optimize your services and pricing.",
  },
  {
    icon: <FaChartLine />,
    title: "Seamless Payments",
    description: "Get paid instantly with secure payment gateways.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-white via-gray-50 to-gray-200 overflow-hidden relative"> 
      

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          className="text-center mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-gray-800 mb-2 leading-tight">
            Power Up Your Cleaning Business
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Our platform equips you with the tools you need to succeed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {featuresData.map((feat, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-3xl shadow-lg p-10 hover:shadow-xl transition duration-300 ease-in-out relative overflow-hidden group" // Added group class
              variants={itemVariants}
            >
              <div className="text-yellow-500 text-6xl mb-8 flex items-center justify-center transition duration-300 group-hover:scale-110"> {/* Scaled on hover */}
                {feat.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center transition duration-300 group-hover:text-yellow-500"> {/* Title color change on hover */}
                {feat.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-center transition duration-300 group-hover:text-gray-800"> {/* Description color change on hover */}
                {feat.description}
              </p>
              {/* Subtle Gradient Overlay on Hover - Now more visible */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none rounded-3xl"></div> {/* Rounded corners for gradient */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;