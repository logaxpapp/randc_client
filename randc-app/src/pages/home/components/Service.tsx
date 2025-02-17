// src/pages/services/Service.tsx
import React from "react";
import { motion } from "framer-motion";
// Example icon imports from react-icons (or your own icons)
import { FaBroom, FaHandsWash, FaSprayCan, FaSyncAlt } from "react-icons/fa";

const servicesData = [
  {
    title: "Standard Cleaning",
    icon: <FaBroom className="text-3xl text-lime-500" />,
    description:
      "Regular upkeep and tidying for your home or office—dusting, vacuuming, surface cleaning, and more.",
  },
  {
    title: "Deep Clean",
    icon: <FaHandsWash className="text-3xl text-blue-500" />,
    description:
      "Comprehensive, floor-to-ceiling scrubbing that reaches hidden corners, ensuring a like-new sparkle.",
  },
  {
    title: "Eco-Friendly Wash",
    icon: <FaSprayCan className="text-3xl text-amber-400" />,
    description:
      "Green cleaning solutions, free of harsh chemicals, to keep your environment healthy for all.",
  },
  {
    title: "On-Demand Scheduling",
    icon: <FaSyncAlt className="text-3xl text-purple-500" />,
    description:
      "Flexible time slots and automated calendar integration, so you can book and reschedule with ease.",
  },
];

const Service: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen py-10 bg-white overflow-hidden">
      {/* === Wave Divider (Top) === */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-10">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#101820"
            fillOpacity="1"
            d="M0,256L48,224C96,192,192,128,288,112C384,96,480,128,576,149.3C672,171,768,181,864,202.7C960,224,1056,256,1152,240C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        {/* Title & Intro */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
            Our Cleaning Services
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            R&C’s powerful SaaS platform keeps you on top of every cleaning need.
            From regular upkeep to deep cleans, we’ve got you covered—quickly,
            easily, and always eco-friendly.
          </p>
        </motion.div>

        {/* Service Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
          viewport={{ once: true }}
        >
          {servicesData.map((service, idx) => (
            <motion.div
              key={idx}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA / Booking Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Ready for a Sparkling Space?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            Take advantage of our advanced scheduling features, user-friendly
            portal, and dedicated support. Book a cleaning today or learn how
            R&C can streamline your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-6 py-3 rounded-md transition transform hover:scale-105">
              Book a Cleaning
            </button>
            <button className="bg-amber-400 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition transform hover:scale-105">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>

      {/* === Wave Divider (Bottom) === */}
      <div className="absolute bottom-0 w-full leading-[0]">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#101820"
            fillOpacity="1"
            d="M0,32L48,42.7C96,53,192,75,288,85.3C384,96,480,96,576,122.7C672,149,768,203,864,224C960,245,1056,235,1152,218.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default Service;
