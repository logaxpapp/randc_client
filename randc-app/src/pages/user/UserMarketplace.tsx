// src/pages/user/UserMarketplace.tsx
import React, { useState, useMemo } from 'react';
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
import AddFavoriteModal from './AddFavoriteModal';
// RTK Query hooks
import {
  useListWithoutParamsCategoriesQuery,
  useListMarketplaceServicesQuery,
  useListAmenitiesQuery,
} from '../../features/public/publicApi';

// Example price ranges
const priceRanges = [
  { label: '0 - 10', min: 0, max: 10 },
  { label: '10 - 20', min: 10, max: 20 },
  { label: '20 - 30', min: 20, max: 30 },
  { label: '30 - 50', min: 30, max: 50 },
  { label: '50 - 100', min: 50, max: 100 },
];

const UserMarketplace: React.FC = () => {
  // ─────────────────────────────────────────────────
  // 1) States
  // ─────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnSaleOnly, setShowOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'lowToHigh' | 'highToLow'>('latest');

  // Selected categories, ratings, amenities, and price range
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] =
    useState<{ min: number; max: number } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(12);

  // ─────────────────────────────────────────────────
  // 2) Data from server (categories, amenities)
  // ─────────────────────────────────────────────────
  const {
    data: categoriesData = [],
    isLoading: catLoading,
    isError: catError,
  } = useListWithoutParamsCategoriesQuery();

  const { data: amenitiesData = [] } = useListAmenitiesQuery();

  // ─────────────────────────────────────────────────
  // 3) Build query params from filters
  // ─────────────────────────────────────────────────
  const categoriesParam = selectedCategories.join(',');
  const highestRatingParam = selectedRatings.length
    ? Math.max(...selectedRatings.map((r) => parseInt(r))) // or parse the "5 Stars" string if needed
    : undefined;
  const amenitiesParam = selectedAmenities.join(',');
  const minPrice = selectedPriceRange?.min;
  const maxPrice = selectedPriceRange?.max;

  // ─────────────────────────────────────────────────
  // 4) RTK Query for marketplace services
  // ─────────────────────────────────────────────────
  const { data: response, isLoading, isError, refetch } = useListMarketplaceServicesQuery({
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

  // extracted
  const services = response?.data || [];
  const totalPages = response?.totalPages || 1;
  const totalResults = response?.totalResults || 0;

  // ─────────────────────────────────────────────────
  // 5) Handlers
  // ─────────────────────────────────────────────────
  const handleCategoryToggle = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
    setCurrentPage(1);
  };

  const handlePriceRangeSelect = (range: { min: number; max: number }) => {
    if (selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max) {
      setSelectedPriceRange(null); // unselect if user clicks the same range
    } else {
      setSelectedPriceRange(range);
    }
    setCurrentPage(1);
  };

  const handleRatingToggle = (rating: string) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
    setCurrentPage(1);
  };

  const handleAmenitiesToggle = (amen: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amen) ? prev.filter((a) => a !== amen) : [...prev, amen]
    );
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // 6) NEW: State to manage the favorite modal
  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false);
  const [favoriteService, setFavoriteService] = useState<any | null>(null);

  function handleOpenFavorite(svc: any) {
    setFavoriteService(svc);
    setFavoriteModalOpen(true);
  }
  function handleCloseFavorite() {
    setFavoriteService(null);
    setFavoriteModalOpen(false);
  }


  // ─────────────────────────────────────────────────
  // 6) Render
  // ─────────────────────────────────────────────────
  return (
    <section className="relative min-h-screen w-full">
      {/* Top Wave or Banner */}
      <div className="sticky top-0 z-20 bg-yellow-300 text-yellow-900 p-1 font-semibold shadow">
        <p>Your Marketplace: Find Services & Book Now!</p>
      </div>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-white z-0" />

      <div className="relative z-10 p-4 md:p-8">
        {/* Title + Search Row */}
        <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Marketplace
          </motion.h1>

          {/* Search & On-Sale toggle */}
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showOnSaleOnly}
                onChange={(e) => {
                  setShowOnSaleOnly(e.target.checked);
                  setCurrentPage(1);
                }}
              />
              <span>On Sale Only</span>
            </label>
          </div>
        </div>

        {/* Filter Sidebar + Results layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 mt-4">
          {/* Filter Sidebar */}
          <aside className="bg-white rounded-md shadow p-4 hidden lg:block">
            <h2 className="text-sm font-semibold mb-4">Filters</h2>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-600 mb-2 uppercase">Categories</h3>
              {catLoading && <p className="text-xs text-gray-500 mb-2">Loading...</p>}
              {catError && <p className="text-xs text-red-500 mb-2">Error loading categories</p>}
              {!catLoading &&
                !catError &&
                categoriesData.map((cat) => (
                  <label key={cat._id} className="flex items-center text-sm mb-1">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={() => handleCategoryToggle(cat._id)}
                    />
                    {cat.name}
                  </label>
                ))}
            </div>

            {/* Price Ranges */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-600 mb-2 uppercase">Price Range</h3>
              {priceRanges.map((range) => {
                const isSelected =
                  selectedPriceRange?.min === range.min &&
                  selectedPriceRange?.max === range.max;
                return (
                  <label key={range.label} className="flex items-center text-sm mb-1">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={isSelected}
                      onChange={() => handlePriceRangeSelect(range)}
                    />
                    {range.label}
                  </label>
                );
              })}
            </div>

            {/* Ratings */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-600 mb-2 uppercase">Ratings</h3>
              {['5', '4', '3'].map((rating) => {
                const label = `${rating} Stars`;
                return (
                  <label key={rating} className="flex items-center text-sm mb-1">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedRatings.includes(rating)}
                      onChange={() => handleRatingToggle(rating)}
                    />
                    {label}
                  </label>
                );
              })}
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-600 mb-2 uppercase">Amenities</h3>
              {amenitiesData.map((amen) => (
                <label key={amen._id} className="flex items-center text-sm mb-1">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedAmenities.includes(amen._id)}
                    onChange={() => handleAmenitiesToggle(amen._id)}
                  />
                  {amen.name}
                </label>
              ))}
            </div>
          </aside>

          {/* Main Results */}
          <div className="min-h-[500px]">
            {/* Sort + Results Info */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <p className="text-sm text-gray-600 mb-2 md:mb-0">
                {`Showing ${services.length} of ${totalResults} result(s)`}
              </p>
              <div className="flex items-center space-x-3">
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
                  className="flex items-center space-x-1 bg-white border px-3 py-1 text-xs rounded-md"
                >
                  <span>
                    Sort by:{' '}
                    {sortBy === 'latest'
                      ? 'Latest'
                      : sortBy === 'lowToHigh'
                      ? 'Price: Low → High'
                      : 'Price: High → Low'}
                  </span>
                  <FaChevronDown className="text-gray-400" />
                </button>

                {/* Results Per Page */}
                <div className="flex items-center space-x-2 text-xs">
                  <span>Show:</span>
                  {[12, 24, 48].map((val) => (
                    <button
                      key={val}
                      onClick={() => {
                        setResultsPerPage(val);
                        setCurrentPage(1);
                      }}
                      className={`px-2 py-1 rounded ${
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

            {/* Loading/Errors */}
            {isLoading && <div>Loading services...</div>}
            {isError && <div className="text-red-500">Error loading marketplace services.</div>}

            {/* Results Grid */}
            {!isLoading && !isError && (
              <>
                {services.length === 0 ? (
                  <div className="text-center text-sm text-gray-500">
                    No services found. Try different filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
                    {services.map((svc) => (
                      <motion.div
                        key={svc._id}
                        whileHover={{ scale: 1.02 }}
                        className="relative bg-white rounded-md shadow-sm overflow-hidden flex flex-col"
                      >
                        {/* Image */}
                        <div className="h-40 w-full bg-gray-100">
                          <img
                            src={svc.images?.[0] || 'https://via.placeholder.com/300x200'}
                            alt={svc.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {svc.name}
                          </h3>
                          {svc.tenant && (
                            <p className="text-xs text-gray-500 line-clamp-1">{svc.tenant.name}</p>
                          )}
                          {/* Price/Duration */}
                          <div className="mt-auto text-xs font-medium text-gray-800">
                            ${svc.price} / {svc.duration} mins
                          </div>
                           {/* Link moved to a wrapper around non-interactive elements */}
                           <Link
                            to={`/seeker/dashboard/marketplace/${svc.tenant?._id || 'tenant-id'}`}
                            className="absolute inset-0"
                            aria-label={`Go to ${svc.name} details`}
                            title='Go to details'
                          >
                            {/* Empty span to take space, preventing full overlay */}
                            <span className="sr-only">{svc.name} Details</span>
                          </Link>

                        </div>
                        {/* Footer actions */}
                        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 text-xs text-gray-500 relative cursor-pointer">
                         
                          {/* Favorite Button */}
                          <button
                            className="flex items-center hover:text-blue-500 relative z-10"
                            onClick={() => handleOpenFavorite(svc)} 
                          >
                            <FaRegHeart className="mr-1" />
                            Favorite
                          </button>

                          {/* Share Button */}
                          <button className="flex items-center hover:text-blue-500 relative z-10">
                            <FaRegShareSquare className="mr-1" />
                            Share
                          </button>
                        </div>

                      </motion.div>
                    ))}
                  </div>
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
                    >
                      <FaAngleLeft />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
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
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
                    >
                      <FaAngleRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

     
      <AddFavoriteModal
        isOpen={favoriteModalOpen}
        onClose={handleCloseFavorite}
        service={favoriteService}
      />
    </section>
  );
};

export default UserMarketplace;
