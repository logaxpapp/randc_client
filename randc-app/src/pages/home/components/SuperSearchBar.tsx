// src/components/search/SuperSearchBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';

// icon for filters 
import { BiFilterAlt } from 'react-icons/bi';

// RTK Query hooks
import { useListCategoriesQuery, useListServicesQuery } from '../../../features/public/publicApi';

// ============== LocalStorage Keys ==============
const LOCALSTORAGE_LAT = 'userLat';
const LOCALSTORAGE_LNG = 'userLng';

// ============== Minimal Types ==============
interface Category {
  _id: string;
  name: string;
}
interface Service {
  _id: string;
  name: string;
  category?: string;
}

interface SuperSearchBarProps {
  onResults?: (data: any) => void;
}

// ============== Fake Geocoding (Replace w/ Real) ==============
async function geocodeCityZip(cityZip: string): Promise<{ lat: number; lng: number } | null> {
  if (!cityZip) return null;
  const dummyApiKey = 'YOUR_MAPBOX_TOKEN';
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    cityZip
  )}.json?access_token=${dummyApiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      const coords = data.features[0].center; // [lng, lat]
      return { lat: coords[1], lng: coords[0] };
    }
  } catch (err) {
    console.error('Geocoding failed:', err);
  }
  return null;
}

// ============== Framer Motion Variants ==============
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// ============== Debounce Helper ==============
function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

const SuperSearchBar: React.FC<SuperSearchBarProps> = ({ onResults }) => {
  const queryClient = useQueryClient();

  // ============== Basic States ==============
  const [searchTerm, setSearchTerm] = useState('');       // "Search for services..."
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced searchTerm => used to query categories/services
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // ============== Advanced Search States ==============
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [location, setLocation] = useState('');      // e.g. City or Zip Code
  const [category, setCategory] = useState('');

  // ============== Stored Lat/Lng ==============
  const [lat, setLat] = useState<string | null>(null);
  const [lng, setLng] = useState<string | null>(null);

  // ============== On Mount, Load Lat/Lng ==============
  useEffect(() => {
    const savedLat = localStorage.getItem(LOCALSTORAGE_LAT);
    const savedLng = localStorage.getItem(LOCALSTORAGE_LNG);
    if (savedLat && savedLng) {
      setLat(savedLat);
      setLng(savedLng);
    }
  }, []);

  // ============== RTK Queries for Debounced Term ==============
  // Will skip fetch if debouncedSearchTerm is empty
  const { data: catData = [] } = useListCategoriesQuery(
    { name: debouncedSearchTerm },
    { skip: !debouncedSearchTerm }
  );
  const { data: srvData = [] } = useListServicesQuery(
    { name: debouncedSearchTerm },
    { skip: !debouncedSearchTerm }
  );

  // ============== If user clicks outside dropdown, close it ==============
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============== Handle Main Search Submit ==============
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);

    try {
      let finalLat = lat;
      let finalLng = lng;

      // Geocode user input if we don't have lat/lng
      if (location && !lat && !lng) {
        const geoResult = await geocodeCityZip(location);
        if (geoResult) {
          finalLat = geoResult.lat.toString();
          finalLng = geoResult.lng.toString();
          localStorage.setItem(LOCALSTORAGE_LAT, finalLat);
          localStorage.setItem(LOCALSTORAGE_LNG, finalLng);
          setLat(finalLat);
          setLng(finalLng);
        }
      }

      // Build aggregator query
      const params = new URLSearchParams();
      if (searchTerm) params.append('service', searchTerm);
      if (finalLat && finalLng) {
        params.append('lat', finalLat);
        params.append('lng', finalLng);
      }
      if (location) {
        params.append('location', location);
      }
      if (category) params.append('category', category);

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      if (!data.success) {
        throw new Error('Search failed');
      }
      console.log('Search results:', data);
      onResults?.(data.data);

      // Optionally: queryClient.setQueryData(['searchResults'], data.data);
    } catch (err) {
      console.error('Error in search:', err);
      alert('Search error: ' + (err as Error).message);
    }
  };

  // ============== Merge category & service results for dropdown ==============
  // We only show them if user typed something (debouncedSearchTerm).
  const combinedResults = [
    ...catData.map((c: Category) => ({ id: c._id, name: c.name, type: 'category' })),
    ...srvData.map((s: Service) => ({ id: s._id, name: s.name, type: 'service' })),
  ];

  // ============== Render ==============
  return (
    <motion.div
      className="mt-8 max-w-xl w-full"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      ref={dropdownRef}
    >
      {/* ---------- Main Form: Basic + Advanced ---------- */}
      <form onSubmit={handleSearchSubmit}>
        {/* ========== Basic Keyword Search ========== */}
        <div className="flex mb-4 relative text-white">
          <input
            type="text"
            placeholder="Search for services..."
            className="w-full rounded-l-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-50"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            aria-label="Search for services"
          />
          <button
            type="submit"
            className="bg-amber-400 text-gray-800 font-semibold px-6 py-3 rounded-r-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-transform transform hover:scale-105"
          >
            Search
          </button>

          {/* ======= Dropdown for Debounced Results ======= */}
          <AnimatePresence>
            {showDropdown && combinedResults.length > 0 && (
              <motion.div
                className="absolute left-0 top-full mt-1 w-full bg-black text-gray-50 rounded shadow-lg z-999"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {combinedResults.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    className="w-full text-left px-4 py-2 hover:bg-gray-400"
                    onClick={() => {
                      setSearchTerm(item.name);
                      setShowDropdown(false);
                    }}
                  >
                    <span className="font-semibold">{item.name}</span>
                    <span className="ml-2 text-xs italic text-amber-300">
                      ({item.type})
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========== Advanced Search Toggle ========== */}
        <div className="mb-2">
          <button
            type="button"
            onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
            className="text-sm underline focus:outline-none"
          >
            {isAdvancedSearchOpen ? 'Hide Advanced Search' : 'Show Advanced Search'}
          </button>
        </div>

        {/* ========== Advanced Search Fields ========== */}
        <AnimatePresence>
          {isAdvancedSearchOpen && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 p-4 border border-gray-300 rounded-md bg-white/20 text-gray-50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {/* Location */}
              <div className="flex flex-col text-sm">
                <label className="mb-1 font-semibold">Location</label>
                <input
                  type="text"
                  placeholder="e.g. City, Zip Code"
                  className="rounded-md border border-gray-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Category (manual select from all categories) */}
              <div className="flex flex-col text-sm">
                <label className="mb-1 font-semibold">Category</label>
                <select
                  className="rounded-md border border-gray-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-black/50 text-gray-50"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {/* Suppose you want to fetch an unfiltered list of categories => 
                      You can create a separate RTK query or reuse the existing `catData`
                      but be careful if it’s already filtered by name.
                  */}
                  {catData.map((cat: Category) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Apply Filters */}
              <div className="col-span-1 sm:col-span-2 flex justify-end mt-2">
                <button
                  type="submit"
                  className="bg-amber-400 text-gray-800 font-semibold px-6 py-2 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-transform transform hover:scale-105"
                >
                  Apply
                  <BiFilterAlt className="inline-block ml-2" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default SuperSearchBar;
