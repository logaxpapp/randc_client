import React, { createContext, useState, useMemo } from 'react';
import { themes } from './themes'; // Assuming this is the path to your updated themes array

export const ThemeContext = createContext({
  theme: themes.find(theme => theme.name === 'Default'), // Starting with the Default theme object
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('Default');
  const theme = useMemo(() => themes.find(t => t.name === themeName) || themes[0], [themeName]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};
