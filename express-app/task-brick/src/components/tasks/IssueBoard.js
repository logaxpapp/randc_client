// IssueBoard.js
import React, { useState } from 'react';
import IssueList from './IssueList';
import IssueDetails from './IssueDetails';
import IssueAttributes from './IssueAttributes';

import { FilterContext } from '../../context/FilterContext';
import Header from './Header';

const IssueBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
 
  const [view, setView] = useState('list');

  const [filters, setFilters] = useState({});

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Implement search functionality here
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
    // Implement filter functionality here
  };

  const handleExport = () => {
    // Implement export functionality here
  };

  const handleViewChange = (newView) => {
    setView(newView);
    // Implement view change functionality here
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
  <div className="flex flex-col bg-gray-50">
    <Header
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      onExport={handleExport}
      onViewChange={handleViewChange}
    />
    <main className="flex-1 flex flex-col md:flex-row">
      {/* Issue List - Keep this small */}
      <div className="w-full md:w-1/4 lg:w-1/5 overflow-y-auto min-h-screen">
        <IssueList />
      </div>

      {/* Issue Details - This should take up the majority of the space */}
      <div className="flex-1 overflow-y-auto min-h-screen">
        <IssueDetails />
      </div>

      {/* Issue Attributes - Give it more space than the list but less than details */}
      <div className="w-full md:w-1/4 lg:w-1/3 overflow-y-auto min-h-screen">
        <IssueAttributes />
      </div>
    </main>
  </div>
</FilterContext.Provider>

  );
};

export default IssueBoard;
