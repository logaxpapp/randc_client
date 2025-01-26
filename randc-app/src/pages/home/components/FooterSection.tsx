// src/components/FooterSection.tsx


import { motion } from 'framer-motion';

function FooterSection() {
  return (
    <footer className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-gray-100 overflow-hidden">
      {/* Larger Wave at the BOTTOM */}
      <div 
        className="
          absolute 
          bottom-0 
          left-0 
          w-full 
          h-28 
          bg-white
          clip-path-[polygon(0_50%,100%_0%,100%_100%,0_100%)]
        "
      />

      <motion.div
        className="relative z-10 pt-16 pb-8 px-6 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* TOP ROW */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* LEFT BLOCK: BRAND + ABOUT + SOCIAL */}
          <div className="md:max-w-sm space-y-5">
            <h2 className="text-3xl font-extrabold text-white">
              R&C Cleaning
            </h2>
            <p className="text-base leading-relaxed text-gray-200">
              We connect professional cleaners with clients worldwide. 
              Discover top-rated experts and exceptional services for 
              all your cleaning needs, right at your fingertips.
            </p>
            <div className="flex space-x-4 text-2xl mt-2">
              <a href="#" className="hover:text-green-400">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="hover:text-green-400">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-green-400">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-green-400">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* LINKS BLOCKS */}
          <div className="grid grid-cols-2 gap-8 md:flex md:space-x-16">
            {/* QUICK LINKS */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Quick Links</h3>
              <ul className="text-base space-y-2">
                <li>
                  <a href="#" className="hover:text-green-400">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            {/* RESOURCES */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">
                Resources
              </h3>
              <ul className="text-base space-y-2">
                <li>
                  <a href="#" className="hover:text-green-400">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="space-y-4 md:max-w-xs">
            <h3 className="text-xl font-semibold text-white">
              Stay Updated
            </h3>
            <p className="text-base text-gray-200 leading-relaxed">
              Sign up for cleaning tips and news about our platform.
              We’ll never spam you, guaranteed!
            </p>
            <form className="flex flex-col space-y-3">
              <div className="flex items-center bg-white rounded-full px-3 py-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 text-gray-700 outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="
                  bg-yellow-400
                  hover:bg-green-400
                  text-white
                  font-bold
                  py-2
                  rounded-full
                  transition
                  duration-200
                    ease-in-out
                "
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* BOTTOM ROW: COPYRIGHT, TERMS, ETC. */}
      <div className="relative z-10 bg-[#081a10] bg-opacity-80 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-50">
          <div className="text-center md:text-left mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} R&C Cleaning. All rights reserved.
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4 text-center md:text-right">
            <a href="#" className="hover:text-green-400">
              Terms of Service
            </a>
            <a href="#" className="hover:text-green-400">
              Cookie Policy
            </a>
            <a href="#" className="hover:text-green-400">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
