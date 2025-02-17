// src/pages/marketplace/PublicMarketplace.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaStar,
  FaRegHeart,
  FaRegShareSquare,
  FaAngleLeft,
  FaAngleRight,
  FaChevronDown,
} from 'react-icons/fa';
import heroBackground from "../../assets/images/three.png";

// Hooks from our publicApi
import {
  useListWithoutParamsCategoriesQuery,
  useListMarketplaceServicesQuery,
  useListAmenitiesQuery,
} from '../../features/public/publicApi';

const priceRanges = [
  { label: '0 - 10', min: 0, max: 10 },
  { label: '10 - 20', min: 10, max: 20 },
  { label: '20 - 30', min: 20, max: 30 },
  { label: '30 - 50', min: 30, max: 50 },
  { label: '50 - 100', min: 50, max: 100 },
];

const PublicMarketplace: React.FC = () => {
  // 1) Basic states
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnSaleOnly, setShowOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'lowToHigh' | 'highToLow'>('latest');

  // 2) Filter states
  // - We'll store selected category IDs in an array
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // For rating, amenities, etc. 
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Price range filter: user picks from our local `priceRanges`
  // We can store a single selected range or multiple. Let’s store only one for demo:
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(
    null
  );

  // 3) Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(28);

  // 4) Load global categories from backend
  const {
    data: categoriesData = [],
    isLoading: catLoading,
    isError: catError,
  } = useListWithoutParamsCategoriesQuery(); // no params for now

  // 4A Load amenities from backend
  const { data: amenitiesData = [] } = useListAmenitiesQuery();

  // 5) Transform selectedCategories into a CSV string for the query param
  const categoriesParam = selectedCategories.join(',');

  // 6) If you only allow one rating param, pick the highest (like before)
  const highestRatingParam = selectedRatings.length
    ? Math.max(...selectedRatings.map((r) => parseInt(r.split(' ')[0])))
    : undefined;

  // 7) Amenities param is CSV
  const amenitiesParam = selectedAmenities.join(',');

  // 8) Convert selectedPriceRange -> minPrice / maxPrice
  const minPrice = selectedPriceRange ? selectedPriceRange.min : undefined;
  const maxPrice = selectedPriceRange ? selectedPriceRange.max : undefined;

  // 9) RTK Query for marketplace services
  const {
    data: response,
    isLoading,
    isError,
  } = useListMarketplaceServicesQuery({
    search: searchTerm || undefined,
    category: categoriesParam || undefined,
    rating: highestRatingParam,
    amenities: amenitiesParam || undefined,
    onSale: showOnSaleOnly || undefined,
    sort: sortBy,
    page: currentPage,
    limit: resultsPerPage,
    minPrice,
    maxPrice,
  });

  const services = response?.data || [];
  const totalPages = response?.totalPages || 1;
  const totalResults = response?.totalResults || 0;

  // *** Handler for categories chip click
  const handleCategoryToggle = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
    setCurrentPage(1);
  };

  // *** Handler for price range
  const handlePriceRangeSelect = (range: { min: number; max: number }) => {
    // If user clicks the same range again, we might un-select it, or just store it once
    if (selectedPriceRange && selectedPriceRange.min === range.min && selectedPriceRange.max === range.max) {
      // unselect
      setSelectedPriceRange(null);
    } else {
      setSelectedPriceRange(range);
    }
    setCurrentPage(1);
  };

  // *** Handler for rating
  const handleRatingToggle = (ratingLabel: string) => {
    setSelectedRatings((prev) =>
      prev.includes(ratingLabel) ? prev.filter((r) => r !== ratingLabel) : [...prev, ratingLabel]
    );
    setCurrentPage(1);
  };

  // *** Handler for amenities
  const handleAmenitiesToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
    setCurrentPage(1);
  };

  // *** Pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800  bg-gradient-to-b from-blue-200 via-white to-lime-100 mb-2">


      {/* Breadcrumb */}
      <div className="px-4 py-3 text-sm text-gray-500">
       <Link to="/" className='text-amber-400 font-bold mr-4'>
         Home
        </Link>&gt; <span className="text-black font-semibold ml-4">Marketplace</span>
      </div>

      {/* Hero Banner */}
      <div className="relative h-52 bg-gray-200 flex items-center justify-center mb-6">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundAttachment: "fixed", // Parallax effect
        }}
      />
      {/* Darker Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        <img
          src={heroBackground}
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

      {/* Search & On Sale Toggle */}
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
          <FaSearch className="absolute left-2 top-2 text-gray-400 mr-4" />
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

      {/* Category Chips (from server) */}
      <div className="px-4 mb-4 space-x-2 overflow-x-auto hide-scrollbar max-w-7xl mx-auto">
        {catLoading && <p className="text-sm text-gray-500">Loading categories...</p>}
        {catError && <p className="text-sm text-red-500">Error loading categories.</p>}
        {!catLoading && !catError && categoriesData.length > 0 && (
          <>
            {categoriesData.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryToggle(cat._id)} // or cat.name
                className={`inline-block px-3 py-1 text-xs font-medium rounded mr-2 mb-2 
                  border hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    selectedCategories.includes(cat._id)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-blue-100 text-blue-700 border-blue-300'
                  }
                `}
              >
                {cat.name}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Main Section: Sidebar + Results */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white p-4 rounded shadow hidden lg:block">
          <h3 className="text-base font-semibold mb-6">Filters</h3>

          {/* Price Range Filter */}
          <div className="mb-5">
            <h4 className="text-xs font-bold mb-2 uppercase text-gray-600">Price Range</h4>
            <ul className="space-y-2 text-sm">
              {priceRanges.map((range) => {
                const isSelected = !!(
                  selectedPriceRange &&
                  selectedPriceRange.min === range.min &&
                  selectedPriceRange.max === range.max
                );                
                return (
                  <li key={range.label} className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handlePriceRangeSelect(range)}
                      />
                      <span>{range.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Ratings Filter Example */}
          <div className="mb-5">
            <h4 className="text-xs font-bold mb-2 uppercase text-gray-600">Ratings</h4>
            <ul className="space-y-2 text-sm">
              {['5 Stars', '4 Stars', '3 Stars'].map((ratingLabel) => (
                <li key={ratingLabel} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(ratingLabel)}
                      onChange={() => handleRatingToggle(ratingLabel)}
                    />
                    <span>{ratingLabel}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Amenities Filter */}
          <div className="mb-5">
            <h4 className="text-xs font-bold mb-2 uppercase text-gray-600">Amenities</h4>
            <ul className="space-y-2 text-sm">
              {amenitiesData.map((amen) => (
                <li key={amen._id} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amen._id)}
                      onChange={() => handleAmenitiesToggle(amen._id)}
                    />
                    <span>{amen.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* // Category Filter (dynamic from server) */} 
          <div className="mb-5">
            <h4 className="text-xs font-bold mb-2 uppercase text-gray-600">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categoriesData.map((cat) => (
                <li key={cat._id} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={() => handleCategoryToggle(cat._id)}
                    />
                    <span>{cat.name}</span>
                  </label>
                </li>
              ))}
            </ul>
            </div>
        </aside>

        {/* Right Column: Results */}
        <div>
          {/* Loading / Error states for services */}
          {isLoading && <div className="text-center py-10">Loading services...</div>}
          {isError && <div className="text-center py-10 text-red-500">Error loading data.</div>}

          {/* If we have data */}
          {!isLoading && !isError && (
            <>
              {/* Top row: Results count + sorting */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <p className="text-gray-700 text-xs mb-2 md:mb-0">
                  {`Showing ${services.length} of ${totalResults} results`}
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
              {services.length === 0 ? (
                <div className="text-center py-10 text-gray-600">
                  No businesses found. Try adjusting your filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {services.map((svc) => (
                    <motion.div
                      key={svc._id}
                      whileHover={{ scale: 1.02 }}
                      className="relative bg-white rounded-lg shadow transition cursor-pointer overflow-hidden flex flex-col"
                    >
                      {/* Image */}
                      <div className="h-40 w-full bg-gray-100 overflow-hidden">
                        {/* We'll assume you have svc.images or a placeholder */}
                        <img
                          src={svc.images?.[0] || 'https://via.placeholder.com/300x200'}
                          alt={svc.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                          {svc.name}
                        </h3>
                        {/* If tenant is populated: */}
                        {svc.tenant && (
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                            {svc.tenant.name}
                          </p>
                        )}

                        {/* If you track rating on tenant */}
                        {svc.tenant?.rating && (
                          <div className="flex items-center text-yellow-500 text-xs mb-2">
                            {Array.from({
                              length: Math.floor(svc.tenant.rating),
                            }).map((_, i) => (
                              <FaStar key={i} />
                            ))}
                            <span className="ml-2 text-gray-700">
                              {svc.tenant.rating.toFixed(1)} rating
                            </span>
                          </div>
                        )}

                        {/* Price & Duration */}
                        <div className="mt-auto">
                          <p className="text-xs font-bold text-gray-900">
                            ${svc.price} / {svc.duration} mins
                          </p>
                        </div>
                      </div>

                      {/* Footer actions */}
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
                          to={`/marketplace/${svc.tenant?._id || 'tenant-id'}`}
                          className="absolute inset-0"
                          aria-label={`Go to ${svc.name} details`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination Controls (server-based) */}
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PublicMarketplace;
