// useThemeSwitcher.js
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const useThemeSwitcher = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return { currentTheme: theme, setTheme }; // return the whole theme object
};

export default useThemeSwitcher;
