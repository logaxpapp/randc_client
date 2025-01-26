// src/pages/home/components/FeaturesSection.tsx

import React from 'react';
import { motion } from 'framer-motion';

function FeaturesSection() {
  const features = [
    {
      icon: 'fas fa-bullhorn',
      title: 'Market Your Services',
      description:
        'Showcase your specialties and get discovered by a broader audience searching for top-rated cleaners.',
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'Smart Scheduling',
      description:
        'Enjoy flexible booking tools that help you set availability and let clients reserve spots effortlessly.',
    },
    {
      icon: 'fas fa-home',
      title: 'Personalized Listings',
      description:
        'Create a dedicated profile detailing your expertise, photos of past work, pricing, and more.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure Transactions',
      description:
        'Count on safe, seamless payments and built-in protections, reassuring both cleaners and clients.',
    },
    {
      icon: 'fas fa-thumbs-up',
      title: 'Ratings & Feedback',
      description:
        'Gain client trust through genuine reviews, helping seekers find the perfect match for their needs.',
    },
    {
      icon: 'fas fa-user-friends',
      title: '24/7 Support',
      description:
        'Our dedicated team is always available, ensuring any questions or issues get resolved promptly.',
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* TILTED/ANGLED BACKGROUND - using a pseudo element or an absolute div */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#918BFF] via-blue-100 to-yello transform rotate-3 origin-top-left" />

      {/* Actual content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Heading + subheading row */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold text-[#D63063]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Empowering Cleaners & Clients
          </motion.h2>
          <motion.p
            className="mt-4 text-lg max-w-2xl mx-auto text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Our platform provides powerful tools and a supportive environment for professional 
            cleaners to grow their business—and for clients to easily find, book, and review 
            services that meet their highest standards.
          </motion.p>
        </div>

        {/* Feature cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition transform hover:-translate-y-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Icon or image */}
              <div className="mb-4 text-green-600 text-4xl">
                <i className={feat.icon}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feat.title}
              </h3>
              <p className="text-gray-600">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
