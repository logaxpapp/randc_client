import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(true); // Assuming true means sidebar is visible

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  return (
    <StateContext.Provider value={{ isActive, toggleSidebar }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
