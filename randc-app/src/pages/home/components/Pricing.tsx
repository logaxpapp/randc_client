// src/components/Pricing.tsx

import React from 'react';
import { motion } from 'framer-motion';
import SubscriptionSection from './SubscriptionSection';

const Pricing: React.FC = () => {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section heading */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
            Choose Your Plan
          </h2>
          <p className="text-gray-500">
            Simple, transparent pricing for our Cleaning SaaS platform.
          </p>
        </motion.div>
        

        </div>

      {/* Subscription Section imported at the bottom */}
      <SubscriptionSection />
    </section>
  );
};

export default Pricing;
