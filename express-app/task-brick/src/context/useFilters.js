// FilterContext.js

import React, { createContext, useContext, useState } from 'react';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const initialFilters = { type: '', status: '', assignee: '' }; // Default filter values
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = (filterType, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters); // Reset to initial state
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilter, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => useContext(FilterContext);
