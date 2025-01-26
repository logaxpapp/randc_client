// src/pages/marketplace/PublicMarketplace.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaStar,
  FaRegHeart,
  FaRegShareSquare,
  FaAngleLeft,
  FaAngleRight,
  FaChevronDown
} from 'react-icons/fa';
import bannerImage from '../../assets/images/banner1.png';

import {
  MOCK_BUSINESSES,
  MOCK_FILTERS,
  TOP_CATEGORIES,
} from '../../data/mockData';

// Main Component
const PublicMarketplace: React.FC = () => {
 

  // State Variables
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnSaleOnly, setShowOnSaleOnly] = useState(false);
  const [resultsPerPage, setResultsPerPage] = useState(28);
  const [sortBy, setSortBy] = useState<'latest' | 'lowToHigh' | 'highToLow'>('latest');

  // Additional Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Toggle Handlers
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handlePriceRangeToggle = (price: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(price)
        ? prev.filter((p) => p !== price)
        : [...prev, price]
    );
    setCurrentPage(1);
  };

  const handleRatingToggle = (rating: string) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
    setCurrentPage(1);
  };

  const handleAmenitiesToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
    setCurrentPage(1);
  };

  // Filtering
  const filteredBusinesses = MOCK_BUSINESSES.filter((biz) => {
    const matchesSearch = !searchTerm || biz.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSale = !showOnSaleOnly || !!biz.onSale;
    const matchesCategory =
      selectedCategories.length === 0 ||
      biz.categories.some((cat) => selectedCategories.includes(cat));
    const matchesPrice =
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.includes(biz.priceRange);
    const matchesRating =
      selectedRatings.length === 0 ||
      selectedRatings.some((r) => {
        const starNumber = parseInt(r.split(' ')[0]); // e.g., "5 Stars" -> 5
        return Math.floor(biz.rating) === starNumber;
      });
    const matchesAmenity =
      selectedAmenities.length === 0 ||
      selectedAmenities.some((a) => biz.amenities.includes(a));

    return (
      matchesSearch &&
      matchesSale &&
      matchesCategory &&
      matchesPrice &&
      matchesRating &&
      matchesAmenity
    );
  });

  // Sorting
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    if (sortBy === 'latest') {
      return b.id.localeCompare(a.id); // Higher ID => latest
    } else if (sortBy === 'lowToHigh') {
      const priceA = parseFloat(a.services[0].price.replace('$', ''));
      const priceB = parseFloat(b.services[0].price.replace('$', ''));
      return priceA - priceB;
    } else {
      // highToLow
      const priceA = parseFloat(a.services[0].price.replace('$', ''));
      const priceB = parseFloat(b.services[0].price.replace('$', ''));
      return priceB - priceA;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedBusinesses.length / resultsPerPage);
  const displayedBusinesses = sortedBusinesses.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-8">
      {/* Breadcrumb */}
      <div className="px-4 py-3 text-sm text-gray-500">
        Home &gt; <span className="text-black font-semibold">Marketplace</span>
      </div>

      {/* Hero Banner */}
      <div className="relative h-52 bg-gray-200 flex items-center justify-center mb-6">
        <img
          src={bannerImage}
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative text-center z-10 bg-black bg-opacity-20 p-6 rounded-md">
          <motion.h1
            className="text-5xl font-extrabold text-yellow-400 drop-shadow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find the Best Services
          </motion.h1>
          <motion.p
            className="mt-2 text-white text-sm font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Book an appointment for haircuts, nails, beauty, and more!
          </motion.p>
        </div>
      </div>

      {/* Search Bar & OnSale Toggle */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between mb-4">
        <div className="relative w-full sm:w-1/2 lg:w-1/3 mb-4 sm:mb-0">
          <input
            type="text"
            value={searchTerm}
            placeholder="Search by business name..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-2 rounded-md bg-white border border-gray-300 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FaSearch className="absolute left-2 top-2 text-gray-400" />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="onSaleCheckbox"
            type="checkbox"
            checked={showOnSaleOnly}
            onChange={(e) => {
              setShowOnSaleOnly(e.target.checked);
              setCurrentPage(1);
            }}
            className="cursor-pointer"
          />
          <label htmlFor="onSaleCheckbox" className="text-sm text-gray-700 cursor-pointer">
            On Sale Only
          </label>
        </div>
      </div>

      {/* Top Category Chips */}
      <div className="px-4 mb-4 space-x-2 overflow-x-auto hide-scrollbar max-w-7xl mx-auto">
        {TOP_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 mr-2 mb-2 border border-blue-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Section: Filters + Results */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
        {/* Left sidebar: Filters */}
        <aside className="bg-white p-4 rounded shadow hidden lg:block">
          <h3 className="text-base font-semibold mb-6">Filters</h3>

          {/* Categories Filter */}
          <div className="mb-5">
            <h4 className="text-xs font-bold mb-2 uppercase text-gray-600">Categories</h4>
            <ul className="space-y-2 text-sm">
              {MOCK_FILTERS.Categories.map((category) => (
                <li key={category.name} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryToggle(category.name)}
                    />
                    <span>{category.name}</span>
                  </label>
                  <span className="text-gray-400 text-xs">{category.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div className="mb-5">
            <h4 className="text-xs font-bold mb-2 uppercase text-gray-600">Price Range</h4>
            <ul className="space-y-2 text-sm">
              {MOCK_FILTERS.PriceRanges.map((price) => (
                <li key={price.name} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes(price.name)}
                      onChange={() => handlePriceRangeToggle(price.name)}
                    />
                    <span
                      className="px-2 py-1 rounded text-white text-xs"
                      style={{ backgroundColor: price.color }}
                    >
                      {price.name}
                    </span>
                  </label>
                  <span className="text-gray-400 text-xs">{price.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ratings Filter */}
          <div className="mb-5">
            <h4 className="text-xs font-bold mb-2 uppercase text-gray-600">Ratings</h4>
            <ul className="space-y-2 text-sm">
              {MOCK_FILTERS.Ratings.map((rating) => (
                <li key={rating.name} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(rating.name)}
                      onChange={() => handleRatingToggle(rating.name)}
                    />
                    <span>{rating.name}</span>
                  </label>
                  <span className="text-gray-400 text-xs">{rating.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Amenities Filter */}
          <div>
            <h4 className="text-xs font-bold mb-2 uppercase text-gray-600">Amenities</h4>
            <ul className="space-y-2 text-sm">
              {MOCK_FILTERS.Amenities.map((amenity) => (
                <li key={amenity.name} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.name)}
                      onChange={() => handleAmenitiesToggle(amenity.name)}
                    />
                    <span>{amenity.name}</span>
                  </label>
                  <span className="text-gray-400 text-xs">{amenity.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right content: Results */}
        <div>
          {/* Top row: Results count + sorting */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <p className="text-gray-700 text-xs mb-2 md:mb-0">
              Showing {displayedBusinesses.length} of {filteredBusinesses.length} results
            </p>
            <div className="flex items-center space-x-4">
              {/* Sort By */}
              <button
                onClick={() =>
                  setSortBy(
                    sortBy === 'latest'
                      ? 'lowToHigh'
                      : sortBy === 'lowToHigh'
                      ? 'highToLow'
                      : 'latest'
                  )
                }
                className="flex items-center space-x-2 bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                <span>
                  Sort by:{' '}
                  {sortBy === 'latest'
                    ? 'Latest'
                    : sortBy === 'lowToHigh'
                    ? 'Price: Low to High'
                    : 'Price: High to Low'}
                </span>
                <FaChevronDown className="text-gray-400" />
              </button>

              {/* Results Per Page */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 text-xs">Show:</span>
                {[28, 56, 84].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setResultsPerPage(val);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      resultsPerPage === val
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {displayedBusinesses.length === 0 ? (
            <div className="text-center py-10 text-gray-600">
              No businesses found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayedBusinesses.map((biz) => (
                <motion.div
                  key={biz.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-lg shadow transition cursor-pointer overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="h-40 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={biz.images[0]}
                      alt={biz.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                      {biz.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {biz.address}
                    </p>

                    <div className="flex items-center text-yellow-500 text-xs mb-2">
                      {Array.from({ length: Math.floor(biz.rating) }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                      <span className="ml-2 text-gray-700">
                        {biz.rating.toFixed(1)} ({biz.reviewCount})
                      </span>
                    </div>

                    <div className="mt-auto">
                      <p className="text-xs text-gray-700 line-clamp-1">
                        {biz.services[0].name}
                      </p>
                      <p className="text-xs font-bold text-gray-900">
                        {biz.services[0].price}
                      </p>
                      <p className="text-xs text-gray-400">
                        {biz.services[0].duration}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200">
                    <button className="flex items-center text-gray-500 hover:text-blue-600 text-xs">
                      <FaRegHeart className="mr-1" />
                      Favorite
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-blue-600 text-xs">
                      <FaRegShareSquare className="mr-1" />
                      Share
                    </button>
                    <Link
                      to={`/marketplace/${biz.id}`}
                      className="absolute inset-0"
                      aria-label={`Go to ${biz.name} details`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <FaAngleLeft />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <FaAngleRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicMarketplace;
