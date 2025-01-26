// src/components/PricingSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

 function SubscriptionSection() {
  // Pricing plan data that mimics the screenshot’s structure:
  const plans = [
    {
      id: 'premium',
      name: 'Premium',
      oldPrice: 12.19,
      newPrice: 2.49,
      discount: '80% OFF',
      renewalPrice: 7.99,
      termDetail: 'For 48-month term + 3 months free',
      features: [
        'Unlimited service bookings',
        'Advanced scheduling tools',
        'Comprehensive client management system',
        'Employee time tracking and scheduling',
        'Inventory management for cleaning supplies',
        'Online booking portal for clients',
        'Automated appointment reminders',
        'Mobile app access for on-the-go management',
        'Integrated payment processing',
        'Detailed reporting and analytics',
        'Customizable service menus',
        'Client feedback and review collection',
        'Priority customer support',
        'Dedicated account manager',
        'Optimized for small teams',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      oldPrice: 12.49,
      newPrice: 3.49,
      discount: '75% OFF',
      renewalPrice: 8.99,
      termDetail: 'For 48-month term + 3 months free',
      features: [
        'Up to 200 monthly service bookings',
        'Standard scheduling tools',
        'Basic client management',
        'Employee scheduling',
        'Inventory tracking for cleaning supplies',
        'Online booking capabilities',
        'Automated reminders',
        'Mobile access for managers',
        'Payment gateway integration',
        'Basic reporting and analytics',
        'Service menu customization',
        'Customer feedback collection',
        'Priority support',
        'Dedicated account manager',
        'Optimized for small teams',
      ],
      mostPopular: true, // to add that purple “MOST POPULAR” label
    },
    {
      id: 'cloud-startup',
      name: 'Cloud Startup',
      oldPrice: 24.99,
      newPrice: 7.59,
      discount: '70% OFF',
      renewalPrice: 19.99,
      termDetail: 'For 48-month term + 3 months free',
      features: [
        'Up to 300 monthly service bookings',
        'Comprehensive scheduling solutions',
        'Advanced client relationship management (CRM)',
        'Employee performance tracking',
        'Advanced inventory management',
        'Branded online booking platform',
        'Automated reminders and notifications',
        'Full mobile application access',
        'Multiple payment gateways',
        'Advanced analytics and reporting',
        'Customized service offerings',
        'In-depth customer feedback and review system',
        'Dedicated account manager',
        '24/7 priority support',
      ],
    },
  ];
  

  // Simple card animation presets
  const cardVariants = {
    hiddenLeft:  { opacity: 0, x: -50 },
    hiddenRight: { opacity: 0, x:  50 },
    hiddenDown:  { opacity: 0, y:  50 },
    visible:     { opacity: 1, x:  0, y:  0 },
  };

  return (
    <div className="bg-gray-50 py-10 px-4">
      {/* Vital message banner at all times */}
      <motion.div
        className="bg-[#2F1C6A] text-white font-semibold text-center py-3 mb-8"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Choose your perfect cleaning service subscription!
      </motion.div>

      {/* “MOST POPULAR” heading exactly like the middle highlight bar */}
      <div className="flex justify-center mb-6">
        <div className="bg-purple-100 text-purple-800 font-bold px-4 py-1 rounded-full">
          MOST POPULAR
        </div>
      </div>

      {/* Pricing plans container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          // For a 3-column layout, we can fade from left, bottom, right
          const initialVariant =
            index === 0
              ? 'hiddenLeft'
              : index === 1
              ? 'hiddenDown'
              : 'hiddenRight';

          return (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              initial={initialVariant}
              whileInView="visible"
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative bg-white p-6 rounded-md shadow hover:shadow-lg transition-transform hover:-translate-y-1 
                ${plan.mostPopular ? 'border-2 border-purple-200' : 'border border-gray-200'}
              `}
            >
              {/* Discount badge in top-left corner */}
              <div className="absolute top-3 left-3 bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                {plan.discount}
              </div>

              {/* Plan name */}
              <h2 className="text-xl font-bold text-gray-800 mt-3 mb-1">
                {plan.name}
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                {plan.id === 'premium'
                  ? 'Everything you need to get started'
                  : plan.id === 'business'
                  ? 'Level up your cleaning operation'
                  : 'Enjoy optimized performance & resources'}
              </p>

              {/* Pricing row */}
              <div className="mb-4">
                <div className="line-through text-sm text-gray-400 mb-1">
                  US${plan.oldPrice}
                </div>
                <div className="text-3xl font-extrabold text-gray-900">
                  US${plan.newPrice}
                  <span className="text-base font-medium ml-1">/mo</span>
                </div>
                <div className="text-xs text-gray-500">{plan.termDetail}</div>
                <div className="text-xs text-gray-500">
                  +US${plan.renewalPrice}/mo when you renew
                </div>
              </div>

              {/* Feature list */}
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Choose Plan button */}
              <button
                className={`w-full py-2 font-semibold rounded-md text-white transition-colors 
                  ${
                    plan.mostPopular
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }
                `}
              >
                Choose plan
              </button>

              {/* “See all features” link at bottom (like in the screenshot) */}
              <div className="mt-4 text-center">
                <a
                  href="#"
                  className="text-purple-600 hover:underline text-sm font-medium"
                >
                  See all features
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Payment terms link at bottom */}
      <div className="text-center mt-8">
        <a
          href="#"
          className="text-sm font-medium text-gray-500 hover:text-gray-700 underline"
        >
          Payment terms
        </a>
      </div>
    </div>
  );
}


export default SubscriptionSection;