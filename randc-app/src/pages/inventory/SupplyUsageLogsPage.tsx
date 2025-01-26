// src/pages/inventory/SupplyUsageLogsPage.tsx
import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useListSuppliesUsagePaginatedQuery } from '../../features/inventory/inventoryApi';

const SupplyUsageLogsPage: React.FC = () => {
  // Local state for pagination & search
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');

  // Query the server with those params
  const { data, isLoading, isError, error } = useListSuppliesUsagePaginatedQuery({
    page,
    limit,
    search,
    sortBy,
  });

  // Helpers
  const totalPages = data?.totalPages || 1;
  const supplies = data?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to page 1 whenever we search
    setPage(1);
    // The query will re-run automatically
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Render logic
  if (isLoading) {
    return (
      <div className="p-4 flex items-center text-gray-500">
        <FaSpinner className="animate-spin mr-2" />
        Loading supply usage logs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        <p>Failed to load supply usage logs.</p>
        <p>{(error as any)?.data?.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-6">Supply Usage Logs</h1>

      {/* Search & Sort Bar */}
      <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search by supply name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="-createdAt">Sort by Newest</option>
          <option value="createdAt">Sort by Oldest</option>
        </select>
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Limit Selector */}
      <div className="mb-4">
        <label className="mr-2">Items per page:</label>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1); // reset to first page
          }}
          className="border p-1 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {supplies.length === 0 ? (
        <p className="text-gray-500">No supplies found.</p>
      ) : (
        <>
          {/* Supplies List */}
          {supplies.map((supply) => (
            <div key={supply._id} className="mb-6 border p-4 rounded shadow-sm">
              <h2 className="font-semibold text-lg mb-2 flex justify-between items-center">
                <span>{supply.name}</span>
                <span className="text-sm text-gray-600">Qty: {supply.quantity}</span>
              </h2>

              {/* Usage logs table */}
              {supply.usageLogs && supply.usageLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Quantity Used</th>
                        <th className="p-2 text-left">Reason</th>
                        <th className="p-2 text-left">Used By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supply.usageLogs.map((log, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-2">
                            {new Date(log.date).toLocaleString()}
                          </td>
                          <td className="p-2">{log.quantityUsed}</td>
                          <td className="p-2">{log.reason || '—'}</td>
                          <td className="p-2">
                            {log.userId
                              ? `${log.userId.firstName || ''} ${log.userId.lastName || ''} (${log.userId.email})`
                              : 'Unknown'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No usage logged yet.</p>
              )}
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              disabled={page <= 1}
            >
              Previous
            </button>
            <div className="px-3 py-2">{`Page ${page} of ${data?.totalPages}`}</div>
            <button
              onClick={() => handlePageChange(page + 1)}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              disabled={page >= (data?.totalPages || 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SupplyUsageLogsPage;
