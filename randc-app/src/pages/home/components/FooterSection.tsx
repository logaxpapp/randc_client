import React from "react";
import { motion } from "framer-motion";
import logo from "../../../assets/images/logo.png"; // Replace with your actual logo path

function FooterSection() {
  return (
    <footer className="relative bg-[#101820] text-gray-300 overflow-hidden">
      {/* === Shape Divider (Top) === */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0 bg-gray-800">
        <svg
          className="block w-full h-16 md:h-24 lg:h-32"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#101820"
            fillOpacity="1"
            d="M0,224L48,186.7C96,149,192,75,288,85.3C384,96,480,192,576,234.7C672,277,768,267,864,224C960,181,1056,107,1152,96C1248,85,1344,139,1392,165.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & About */}
          <div>
            <div className="flex items-center mb-4">
              <img src={logo} alt="R&C Logo" className="h-10 w-auto mr-2" />
              <span className="text-xl font-bold text-white uppercase tracking-wide">
                R&C Cleaning
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              We’re a professional cleaning company offering a wide range of
              services to meet your every need. From deep cleans to ongoing
              maintenance, our team is dedicated to delivering top-tier results.
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-amber-400 transition">
                  Inventory Management
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition">
                  Deep Cleaning
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition">
                  Renovations & Additions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition">
                  Kitchen Remodeling
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Info
            </h4>
            <div className="space-y-2 text-sm">
              <p>Address: 1108 Berry Street, Old Hickory</p>
              <p>Phone: +1 (615) 481-3592</p>
              <p>Email: support@rnc.com</p>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Stay up-to-date with the latest news, cleaning tips, and trends in
              the industry. Subscribe to our newsletter!
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your Email"
                className="border border-gray-600 rounded-l px-3 py-2 w-full
                  focus:outline-none focus:ring-2 focus:ring-amber-400 transition
                  text-gray-800"
              />
              <button className="bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-2 px-4 rounded-r transition">
                →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      {/* === Shape Divider (Bottom) === */}
      <div className="absolute bottom-0 left-0 w-full leading-none z-0 ">
        <svg
          className="block w-full h-16 md:h-24 lg:h-32 bg-amber-400 mt-8"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#171717"
            fillOpacity="1"
            d="M0,32L48,42.7C96,53,192,75,288,85.3C384,96,480,96,576,122.7C672,149,768,203,864,224C960,245,1056,235,1152,218.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
       {/* Bottom bar */}
       <div className="bg-[#171717] py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>
            © 2024 R&C Cleaning <span className="hidden md:inline-block">|</span>{" "}
            All rights reserved.
          </p>
          <p className="mt-2 md:mt-0">
            Designed by{" "}
            <a
              href="#"
              className="text-white hover:text-amber-500 transition"
            >
              Chris Bajo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
