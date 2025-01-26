// src/pages/marketplace/BusinessDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaRegClock,
  FaRegHeart,
  FaRegShareSquare,
  FaGift,
} from 'react-icons/fa';
import {
  MOCK_BUSINESSES,
  Business,
} from '../../data/mockData';
import ReviewsSection from './ReviewsSection';
import imgSet1A from '../../assets/images/r3.png';
import imgSet2A from '../../assets/images/r4.png';
import imgSet2B from '../../assets/images/banner.jpeg';
import imgStatic from '../../assets/images/r2.png';



const BusinessDetailPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();

  // 1. Declare all hooks at the top (unconditionally).
  const [business, setBusiness] = useState<Business | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // 2. Use effects at the top as well.
  useEffect(() => {
    if (businessId) {
      const foundBusiness = MOCK_BUSINESSES.find((biz) => biz.id === businessId);
      setBusiness(foundBusiness || null);
    }
  }, [businessId]);

  useEffect(() => {
    // Auto-slide every 5 seconds
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => {
        if (!business || !business.images) return prev;
        const total = business.images.length;
        return (prev + 1) % total;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [business]);

  // Safely calculate total images (handles case if `business` is null)
  const totalImages = business?.images?.length ?? 0;

  // Slideshow Handlers
  const handleNext = () => {
    setCurrentImgIndex((prev) => (prev + 1) % totalImages);
  };
  const handlePrev = () => {
    setCurrentImgIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  // 3. Conditionally render the UI, but do not skip hooks.
  if (!business) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Business not found.</p>
      </div>
    );
  }


  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="bg-white shadow p-4 flex items-center">
        <button className="text-gray-600 hover:text-gray-800 mr-4" onClick={() => navigate(-1)}>
          <FaChevronLeft />
        </button>
        <h1 className="text-lg font-bold text-gray-800">{business.name}</h1>
      </div>

      {/* Slideshow */}
      <div className="relative bg-black h-80 flex items-center justify-center overflow-hidden max-w-7xl mx-auto">
        <AnimatePresence>
          <motion.img
            key={business.images[currentImgIndex]}
            src={business.images[currentImgIndex]}
            alt="detail"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
        <button
          onClick={handlePrev}
          className="absolute left-4 text-white bg-gray-800 bg-opacity-50 p-2 rounded hover:bg-opacity-75"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 text-white bg-gray-800 bg-opacity-50 p-2 rounded hover:bg-opacity-75"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Content: Two Columns */}
      <div className="max-w-7xl mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        {/* Left column (Main) */}
        <div className="space-y-6">
          {/* Business Header Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{business.name}</h2>
            <div className="flex items-center text-yellow-500 text-sm">
              <FaStar />
              <span className="ml-1">
                {business.rating.toFixed(1)} ({business.reviewCount} reviews)
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <FaMapMarkerAlt className="mr-2" />
              {business.address}
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <FaPhone className="mr-2" />
              {business.phone}
            </div>
            {business.aboutMsg && (
              <p className="text-sm text-gray-700 mt-4">{business.aboutMsg}</p>
            )}
          </div>

          {/* Services */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <div className="space-y-4">
              {business.services.map((srv) => (
                <div
                  key={srv.id}
                  className="border-b pb-3 last:border-none flex items-start justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{srv.name}</p>
                    <p className="text-sm text-gray-600">{srv.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{srv.price}</p>
                    <p className="text-sm text-gray-500">{srv.duration}</p>
                    <Link
                      to={`/book/${business.id}/${srv.id}`}
                      className="mt-2 px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* See Our Work + Amenities */}
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            {/* See Our Work */}
            <div>
              <h3 className="text-xl font-bold mb-4">See Our Work</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Replace with real images as needed */}
                <img src={imgStatic} alt="Work1" className="w-full h-24 object-cover rounded" />
                <img src={imgSet1A} alt="Work2" className="w-full h-24 object-cover rounded" />
                <img src={imgSet2A} alt="Work3" className="w-full h-24 object-cover rounded" />
                <img src={imgSet2B} alt="Work4" className="w-full h-24 object-cover rounded" />
              </div>
              <Link to="/marketplace" className="mt-4 inline-block px-4 py-2 bg-gray-200 text-sm text-gray-700 rounded hover:bg-gray-300">
                SEE ALL WORKS
              </Link>
            </div>

            {/* Amenities */}
            {business.amenities && business.amenities.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  {business.amenities.map((am, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="bg-gray-100 p-2 rounded">{am}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4 text-lg text-gray-800">Reviews</h3>

            {business.reviews && business.reviews.length > 0 ? (
                <ReviewsSection reviews={business.reviews} />
            ) : (
                <p className="text-gray-600">No reviews yet.</p>
            )}
            </div>

        </div>

        {/* Right column (Sidebar) */}
        <div className="space-y-6">
          {/* Gift Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-lg text-gray-800">
              <FaGift className="text-yellow-600" />
              Gift Cards
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Looking for the perfect present? Explore available Gift Cards.
            </p>
            <Link to="/gift-cards" className="w-full px-4 py-2 bg-yellow-400 text-blue-800 text-sm font-semibold rounded hover:bg-yellow-300">
              Show Gift Cards
            </Link>
          </div>

          {/* Location Map */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4 text-lg text-gray-800">Location</h3>
            <div className="relative w-full h-40 bg-gray-200">
              {/* Placeholder map image or embed */}
              <img
                src="https://via.placeholder.com/600x400?text=Map+Placeholder"
                alt="map"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* About Us */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4 text-lg text-gray-800">About Us</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Hair Units Installations</li>
              <li>Non-Surgical Approach</li>
              <li>Man Weaves</li>
              <li>Man Units</li>
              <li>Wig Shop</li>
            </ul>
            <Link to="/about" className="mt-2 text-sm text-blue-600 hover:underline">
              Show more
            </Link>
          </div>

          {/* Business Hours */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-lg text-gray-800">
              <FaRegClock />
              Business Hours
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Mon: 09:00 AM - 06:00 PM</li>
              <li>Tue: 09:00 AM - 11:00 AM</li>
              <li>Wed: Closed</li>
              <li>Thu: 09:00 AM - 04:00 PM</li>
              <li>Fri: 09:00 AM - 06:00 PM</li>
              <li>Sat: 10:00 AM - 02:00 PM</li>
              <li>Sun: Closed</li>
            </ul>
            <Link to="/business-hours" className="mt-2 text-sm text-blue-600 hover:underline">
              Show full week
            </Link>
          </div>

          {/* Additional Actions */}
          <div className="bg-white p-6 rounded-lg shadow flex justify-around">
            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm">
              <FaRegHeart /> <span>Add to Favorites</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm">
              <FaRegShareSquare /> <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
