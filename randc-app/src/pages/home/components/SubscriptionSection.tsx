import React from "react";
import { motion } from "framer-motion";

function SubscriptionSection() {
  // Pricing plan data
  const plans = [
    {
      id: "premium",
      name: "Premium",
      oldPrice: 12.19,
      newPrice: 2.49,
      discount: "80% OFF",
      renewalPrice: 7.99,
      termDetail: "For 48-month term + 3 months free",
      features: [
        "Unlimited service bookings",
        "Advanced scheduling tools",
        "Comprehensive client management system",
        "Employee time tracking and scheduling",
        "Inventory management for cleaning supplies",
        "Online booking portal for clients",
        "Automated appointment reminders",
        "Mobile app access for on-the-go management",
        "Integrated payment processing",
        "Detailed reporting and analytics",
        "Customizable service menus",
        "Client feedback and review collection",
        "Priority customer support",
        "Dedicated account manager",
        "Optimized for small teams",
      ],
    },
    {
      id: "business",
      name: "Business",
      oldPrice: 12.49,
      newPrice: 3.49,
      discount: "75% OFF",
      renewalPrice: 8.99,
      termDetail: "For 48-month term + 3 months free",
      features: [
        "Up to 200 monthly service bookings",
        "Standard scheduling tools",
        "Basic client management",
        "Employee scheduling",
        "Inventory tracking for cleaning supplies",
        "Online booking capabilities",
        "Automated reminders",
        "Mobile access for managers",
        "Payment gateway integration",
        "Basic reporting and analytics",
        "Service menu customization",
        "Customer feedback collection",
        "Priority support",
        "Dedicated account manager",
        "Optimized for small teams",
      ],
      mostPopular: true,
    },
    {
      id: "cloud-startup",
      name: "Cloud Startup",
      oldPrice: 24.99,
      newPrice: 7.59,
      discount: "70% OFF",
      renewalPrice: 19.99,
      termDetail: "For 48-month term + 3 months free",
      features: [
        "Up to 300 monthly service bookings",
        "Comprehensive scheduling solutions",
        "Advanced client relationship management (CRM)",
        "Employee performance tracking",
        "Advanced inventory management",
        "Branded online booking platform",
        "Automated reminders and notifications",
        "Full mobile application access",
        "Multiple payment gateways",
        "Advanced analytics and reporting",
        "Customized service offerings",
        "In-depth customer feedback and review system",
        "Dedicated account manager",
        "24/7 priority support",
      ],
    },
  ];

  // Framer Motion container variants for staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        // Stagger each child by 0.1s
        staggerChildren: 0.1,
      },
    },
  };

  // Each card’s variant for a smooth, bouncy fade-up
  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  return (
    <section className="relative bg-gradient-to-b from-purple-50 to-gray-50 overflow-hidden">
   
      {/* Darker Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b " />

      {/* === Top Wave Divider === */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-10 bg-gray-900">
        <svg
          className="block w-[140%] h-20 md:h-32 lg:h-48 ml-[-20%]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff"
            fillOpacity="1"
            d="M0,192L48,186.7C96,181,192,171,288,154.7C384,139,480,117,576,117.3C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

     

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-20">
        {/* “MOST POPULAR” heading, if needed */}
        {plans.some((p) => p.mostPopular) && (
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 text-purple-800 font-bold px-4 py-1 rounded-full shadow">
              MOST POPULAR
            </div>
          </div>
        )}

        {/* Pricing Plans (Cards) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              className={`
                relative bg-white p-6 rounded-md shadow-lg 
                hover:shadow-xl transition-all 
                hover:-translate-y-1 
                flex flex-col
                ${
                  plan.mostPopular
                    ? "border-3 border-amber-200"
                    : "border border-gray-200"
                }
              `}
              style={{
                transformStyle: "preserve-3d",
              }}
              whileHover={{
                rotateX: 3,
                rotateY: -3,
              }}
            >
              {/* Discount Badge */}
              <div className="absolute top-3 left-3 bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded shadow-sm">
                {plan.discount}
              </div>

              {/* Plan Title & Subtitle */}
              <h2 className="text-xl font-bold text-gray-800 mt-3 mb-1">
                {plan.name}
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                {plan.id === "premium"
                  ? "Everything you need to get started"
                  : plan.id === "business"
                  ? "Level up your cleaning operation"
                  : "Enjoy optimized performance & resources"}
              </p>

              {/* Pricing Row */}
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

              {/* Feature List */}
              <ul className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
                {plan.features.slice(0, 8).map((feature) => (
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

              {/* Choose Plan Button */}
              <button
                className={`w-full py-2 font-semibold rounded-md text-white transition-colors 
                  ${
                    plan.mostPopular
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                `}
              >
                Choose plan
              </button>

              {/* “See all features” Link */}
              <div className="mt-4 text-center">
                <a
                  href="#"
                  className="text-purple-600 hover:underline text-sm font-medium"
                >
                  See all features
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment Terms Link */}
        <div className="text-center mt-8">
          <a
            href="#"
            className="text-sm font-medium text-gray-500 hover:text-gray-700 underline"
          >
            Payment terms
          </a>
        </div>
      </div>

      {/* === Bottom Wave Divider === */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg
          className="block w-full h-16 md:h-24 lg:h-40"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff"
            fillOpacity="1"
            d="M0,224L48,192C96,160,192,96,288,69.3C384,43,480,53,576,74.7C672,96,768,128,864,122.7C960,117,1056,75,1152,74.7C1248,75,1344,117,1392,138.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
}

export default SubscriptionSection;
