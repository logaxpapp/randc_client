// src/pages/projects/Project.tsx
import React from "react";
import { motion } from "framer-motion";
// Example placeholder icons or images
import { FaBuilding, FaHome, FaWarehouse, FaRegHospital } from "react-icons/fa";

interface ProjectItem {
  title: string;
  icon: React.ReactNode;
  description: string;
}

const projects: ProjectItem[] = [
  {
    title: "Downtown Office Renovation",
    icon: <FaBuilding className="text-3xl text-blue-500" />,
    description:
      "A comprehensive cleanup and re-organization for a corporate high-rise. We tackled post-renovation dust, deep carpet cleaning, and window polishing.",
  },
  {
    title: "Suburban Home Makeover",
    icon: <FaHome className="text-3xl text-amber-400" />,
    description:
      "Transforming a family home—removing stains, refreshing furniture, and applying eco-friendly products for a healthy living space.",
  },
  {
    title: "Warehouse Overhaul",
    icon: <FaWarehouse className="text-3xl text-lime-500" />,
    description:
      "Industrial-level cleaning of a large warehouse, ensuring dust-free storage zones, organized shelving, and sanitized loading docks.",
  },
  {
    title: "Hospital Wing Deep Clean",
    icon: <FaRegHospital className="text-3xl text-purple-500" />,
    description:
      "Specialized sanitization and disinfection services for a new hospital wing, adhering to strict healthcare regulations.",
  },
];

const Project: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden">
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

      {/* Main container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
            Our Recent Projects
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore how R&C’s Cleaning SaaS and professional services have
            redefined spaces—from bustling offices to cozy homes, every project
            shines bright.
          </p>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
          viewport={{ once: true }}
        >
          {projects.map((proj, idx) => (
            <motion.div
              key={idx}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">{proj.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {proj.title}
              </h3>
              <p className="text-sm text-gray-600">{proj.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA / Start a Project */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Interested in Starting a Project?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            Whether you’re renovating, relocating, or simply refreshing your
            environment, our expert team is ready. Kickstart your next cleaning
            venture today!
          </p>
          <button className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-6 py-3 rounded-md transition transform hover:scale-105">
            Start a Project
          </button>
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

export default Project;
