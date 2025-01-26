// src/pages/inventory/ListSuppliesByLocationPage.tsx

import React, { useState, useMemo } from 'react';
import { useListSuppliesQuery, useListSuppliesByLocationQuery } from '../../features/inventory/inventoryApi';
import { FaSpinner } from 'react-icons/fa';

const ListSuppliesByLocationPage: React.FC = () => {
  // 1) We'll fetch all supplies to gather potential distinct locations
  const {
    data: allSupplies,
    isLoading: loadingAllSupplies,
    isError: errorAllSupplies,
  } = useListSuppliesQuery();

  // 2) We'll also fetch location-specific supplies if we have a location set
  const [location, setLocation] = useState('');
  const [fetchLocation, setFetchLocation] = useState<string | null>(null);

  const {
    data: locationSupplies,
    isLoading: loadingLocation,
    isError: errorLocation,
    error: locationError,
    refetch,
  } = useListSuppliesByLocationQuery(fetchLocation || '', {
    skip: !fetchLocation, // skip if we haven't chosen a location
  });

  // 3) Create a set of unique locations from allSupplies
  //    We'll map over them to create an optional dropdown
  const distinctLocations = useMemo(() => {
    if (!allSupplies || allSupplies.length === 0) return [];
    // Gather unique location strings
    const setOfLocations = new Set<string>();
    for (const s of allSupplies) {
      if (s.location) {
        setOfLocations.add(s.location);
      }
    }
    return Array.from(setOfLocations).sort();
  }, [allSupplies]);

  const handleFetch = () => {
    if (location.trim()) {
      setFetchLocation(location.trim());
    } else {
      // If user cleared out, we skip
      setFetchLocation(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Search Supplies by Location</h1>

      {/* 4) If we want to show a dropdown of distinct locations, let's do that here. */}
      {loadingAllSupplies && (
        <div className="flex items-center text-gray-500 mb-4">
          <FaSpinner className="animate-spin mr-2 text-indigo-500" />
          Loading all supplies to gather location list...
        </div>
      )}
      {errorAllSupplies && (
        <p className="text-red-500 mb-2">Failed to fetch distinct locations!</p>
      )}

      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
        {/* Dropdown for known locations */}
        <select
          className="border px-3 py-2 rounded w-64"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">-- Choose location --</option>
          {distinctLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* OR manually type a location */}
        <input
          type="text"
          className="border px-3 py-2 rounded w-64"
          placeholder="Or type location e.g. Warehouse A"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={handleFetch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fetch Supplies
        </button>
      </div>

      {/* 5) Show loading or error states for location-based fetch */}
      {loadingLocation && fetchLocation && (
        <div className="flex items-center text-gray-500">
          <FaSpinner className="animate-spin mr-2 text-indigo-500" />
          Loading supplies for location: {fetchLocation}
        </div>
      )}

      {errorLocation && (
        <div className="text-red-500 mb-2">
          <p>Error fetching supplies at location: {fetchLocation}</p>
          <p>
            {locationError && 'data' in locationError
              ? (locationError as any).data.message
              : 'Unknown error'}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* 6) Render results if we have locationSupplies */}
      {locationSupplies && locationSupplies.length === 0 && (
        <p className="text-gray-600">
          No supplies found at location: {fetchLocation}
        </p>
      )}

      {locationSupplies && locationSupplies.length > 0 && (
        <div className="overflow-x-auto bg-white shadow rounded p-4 mt-4">
          <table className="table-auto w-full text-sm">
            <thead className="bg-gray-100">
              <tr className="text-gray-700 border-b">
                <th className="py-2 px-3 text-left font-medium">Name</th>
                <th className="py-2 px-3 text-left font-medium">Quantity</th>
                <th className="py-2 px-3 text-left font-medium">Unit</th>
                <th className="py-2 px-3 text-left font-medium">Threshold</th>
                <th className="py-2 px-3 text-left font-medium">Description</th>
                <th className="py-2 px-3 text-left font-medium">Location</th>
              </tr>
            </thead>
            <tbody>
              {locationSupplies.map((supply) => (
                <tr key={supply._id} className="hover:bg-gray-50">
                  <td className="py-2 px-3 border-b">{supply.name}</td>
                  <td className="py-2 px-3 border-b">{supply.quantity}</td>
                  <td className="py-2 px-3 border-b">{supply.unitOfMeasure}</td>
                  <td className="py-2 px-3 border-b">{supply.threshold}</td>
                  <td className="py-2 px-3 border-b">
                    {supply.description || '—'}
                  </td>
                  <td className="py-2 px-3 border-b">{supply.location || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListSuppliesByLocationPage;
