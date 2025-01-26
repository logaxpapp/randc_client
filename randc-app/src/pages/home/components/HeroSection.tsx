import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Remove if you don't need Leaflet or replace with your own CSS
import 'leaflet/dist/leaflet.css';

// Sample images; replace with your own
import bannerImage from '../../../assets/images/one.png';
import imgStatic from '../../../assets/images/image2.png';
import imgSet1A from '../../../assets/images/image3.png';
import imgSet1B from '../../../assets/images/image1.png';
import imgSet2A from '../../../assets/images/image2.png';
import imgSet2B from '../../../assets/images/stock2.png';

function HeroSection() {
  // -- Rotating images state/logic for the 3-column grid below
  const [showFirstMidImage, setShowFirstMidImage] = useState(true);
  const [showFirstRightImage, setShowFirstRightImage] = useState(true);

  useEffect(() => {
    const midInterval = setInterval(() => {
      setShowFirstMidImage((prev) => !prev);
    }, 4000);
    const rightInterval = setInterval(() => {
      setShowFirstRightImage((prev) => !prev);
    }, 5000);

    return () => {
      clearInterval(midInterval);
      clearInterval(rightInterval);
    };
  }, []);

  const midImageSrc = showFirstMidImage ? imgSet1A : imgSet1B;
  const rightImageSrc = showFirstRightImage ? imgSet2A : imgSet2B;

  // -- Search bar state
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Example "recent searches" and "collections"
  const recentSearches = [
    'Office Cleaning',
    'Move-Out Cleaning',
    'Green Cleaning',
    'Hotel Housekeeping',
    'Laundry',
    'Bathroom Cleaning',
  ];
  const collections = [
    { title: 'Residential', count: 67 },
    { title: 'Commercial', count: 85 },
    { title: 'Industrial', count: 92 },
    { title: 'Carpet Cleaning', count: 21 },
    { title: 'Deep Clean', count: 15 },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <div
        className="relative w-full h-[700px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        {/* Dark overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-5" />

        {/* Optional floating motion elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-40">
          <motion.div
            className="absolute z-50 w-12 h-12 rounded-full bg-yellow-200 bg-opacity-40 top-16 left-8 animate-bounce-slow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.div
            className="absolute z-50 w-16 h-16 rounded-full bg-white bg-opacity-30 top-44 right-16 animate-bounce-fast"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: -5 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>

        {/* Main hero content */}
        <motion.div
          className="relative z-50 flex flex-col items-center justify-center h-full text-white text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
        >
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            Empowering Cleaners & Clients
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl mb-5 font-semibold italic">
            Book or Offer Professional Services with Ease
          </h2>
          

          {/* SEARCH BAR */}
          <div className="relative mb-8 w-full sm:w-[600px]" ref={dropdownRef}>
            <div className="flex flex-col sm:flex-row items-center bg-white rounded-full shadow-lg overflow-hidden w-full">
              {/* "What" Input */}
              <div className="flex items-center px-3 py-2 w-full sm:w-auto">
                <i className="fas fa-search text-gray-400 mr-2"></i>
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  className="outline-none text-gray-800 flex-1 bg-transparent text-sm sm:text-base"
                />
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gray-200 sm:w-px sm:h-auto sm:mx-1" />

              {/* "Where" Input */}
              <div className="flex items-center px-3 py-2 w-full sm:w-[150px]">
                <i className="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                <input
                  type="text"
                  placeholder="City or ZIP"
                  className="outline-none text-gray-800 flex-1 bg-transparent text-sm sm:text-base"
                />
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gray-200 sm:w-px sm:h-auto sm:mx-1" />

              {/* "When" Input */}
              <div className="flex items-center px-3 py-2 w-full sm:w-[130px]">
                <i className="far fa-clock text-gray-400 mr-2"></i>
                <input
                  type="date"
                  className="outline-none text-gray-800 flex-1 bg-transparent text-sm sm:text-base"
                />
              </div>

              {/* Search Button */}
              <button className="bg-[#2F1C6A] hover:bg-blue-500 text-white px-4 py-1 font-semibold rounded-full transition sm:w-auto w-full">
                Search
              </button>
            </div>

            {/* The dropdown (conditional) */}
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 w-full bg-white text-gray-900 rounded shadow-lg z-50 p-4"
              >
                <h3 className="text-sm mb-2 font-medium">Recent searches</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recentSearches.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(item);
                        setShowDropdown(false);
                      }}
                      className="bg-gray-100 px-2 py-1 rounded text-sm hover:bg-gray-200 flex items-center space-x-1"
                    >
                      <span>{item}</span>
                      <i className="fas fa-search text-xs"></i>
                    </button>
                  ))}
                </div>
                <h3 className="text-sm mb-2 font-medium">Collections</h3>
                <div className="flex flex-wrap gap-3">
                  {collections.map((col, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center w-20"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded mb-1" />
                      <p className="text-xs font-semibold">{col.title}</p>
                      <p className="text-xs text-gray-500">{col.count} Photos</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/marketplace"
              className="bg-[#D63063] hover:bg-[#c9184a] text-white px-6 py-3 rounded text-lg font-semibold transition"
            >
              Explore Marketplace
            </Link>
            <a
              href="#list-service"
              className="hover:border-[#c9184a] bg-gray-100 text-[#D63063] hover:text-[#c9184a] px-6 py-3 rounded text-lg font-semibold transition"
            >
              List Your Service
            </a>
          </div>
        </motion.div>
      </div>

      {/* 3-COLUMN GRID BELOW HERO */}
      <div className="relative w-full bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* 1) Static left */}
            <img
              src={imgStatic}
              alt="Static Cleaning"
              className="w-full h-64 object-cover"
            />
            {/* 2) Middle rotating */}
            <motion.img
              key={showFirstMidImage ? imgSet1A : imgSet1B}
              src={midImageSrc}
              alt="Rotating Middle"
              className="w-full h-64 object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            {/* 3) Right rotating */}
            <motion.img
              key={showFirstRightImage ? imgSet2A : imgSet2B}
              src={rightImageSrc}
              alt="Rotating Right"
              className="w-full h-64 object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroSection;
