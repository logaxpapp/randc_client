// src/components/SearchBarDropdown.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * A responsive "sticky dropdown" search bar that slides in after a user scrolls
 * a certain distance, with a polished design and advanced styling.
 *
 * Usage:
 *   1. Make sure you have tailwind and framer-motion installed.
 *   2. Ensure icons (Font Awesome) are available (CDN or library).
 *   3. Insert <SearchBarDropdown /> at a top-level in your layout.
 */
function SearchBarDropdown() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const currentScroll = window.scrollY;

      // Show the bar if we've scrolled at least 100px and are still scrolling down.
      if (currentScroll > 100 && currentScroll > lastScrollY) {
        setShowSearchBar(true);
      } else {
        setShowSearchBar(false);
      }
      setLastScrollY(currentScroll);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full z-50"
      initial={{ y: -120 }}
      animate={{ y: showSearchBar ? 0 : -120 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* The gradient background & container */}
      <div className="bg-gradient-to-r from-green-700 via-green-200 to-blue-500 shadow-lg p-4">
        <div className="flex items-center justify-center">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full max-w-4xl">
            {/* Search Input */}
            <div className="relative flex items-center bg-white/90 rounded px-3 py-2 flex-1 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <i className="fas fa-search text-gray-400 mr-2"></i>
              <input
                type="text"
                placeholder="Search services or businesses"
                className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
              />
            </div>

            {/* Where? Input */}
            <div className="relative flex items-center bg-white/90 rounded px-3 py-2 flex-1 sm:max-w-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
              <i className="fas fa-map-marker-alt text-gray-400 mr-2"></i>
              <input
                type="text"
                placeholder="Where?"
                className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
              />
            </div>

            {/* When? Input */}
            <div className="relative flex items-center bg-white/90 rounded px-3 py-2 flex-1 sm:max-w-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
              <i className="far fa-clock text-gray-400 mr-2"></i>
              <input
                type="text"
                placeholder="When?"
                className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
              />
            </div>

            {/* Submit button */}
            <button className="bg-blue-00 text-white px-5 py-2 rounded font-semibold hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-200 transition">
              Search
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SearchBarDropdown;
