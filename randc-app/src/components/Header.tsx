import React, { useState } from 'react';
import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaBars,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import { useAppSelector } from '../app/hooks';

function getProfileRoute(user: any): string {
  if (!user) return '/';
  if (user.roles?.includes('ADMIN')) {
    return '/admin/dashboard/profile';
  } else if (user.roles?.includes('CLEANER')) {
    return '/cleaner/dashboard/profile';
  } else {
    return '/user/dashboard/profile';
  }
}

function getSettingsRoute(user: any): string {
  if (!user) return '/';
  if (user.roles?.includes('ADMIN')) {
    return '/admin/dashboard/settings';
  } else if (user.roles?.includes('CLEANER')) {
    return '/cleaner/dashboard/settings';
  } else {
    return '/user/dashboard/settings';
  }
}

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const user = useAppSelector((state) => state.auth.user);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      setSuggestions(['Booking Service', 'Manage Bookings', 'Profile Settings', 'Support']);
    } else {
      setSuggestions([]);
    }
  };

  const handleThemeClick = () => {
    toggleTheme();
  };

  // For the dynamic link
  const profileRoute = getProfileRoute(user);

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white shadow-md dark:bg-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LEFT: Mobile menu button + Brand */}
        <div className="flex items-center space-x-3">
          <button
            className="md:hidden p-2 rounded hover:bg-indigo-800 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <FaBars className="w-6 h-6" />
          </button>
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide uppercase hover:text-indigo-200"
          >
            R&C Cleaning
          </Link>
        </div>

        {/* CENTER: Search bar */}
        <div className="flex-1 hidden sm:flex items-center justify-center px-4">
          <div className="relative w-full max-w-lg">
            <FaSearch className="absolute left-3 top-3 text-indigo-200" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="
                w-full pl-10 pr-4 py-2
                rounded-md
                text-gray-800
                focus:outline-none
                focus:ring-2 focus:ring-indigo-300
              "
            />
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="
                    absolute left-0 right-0 mt-1
                    bg-white text-gray-800
                    rounded-md shadow-lg border border-gray-200
                    z-50
                  "
                >
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>
                      <Link
                        to={`/${suggestion.toLowerCase().replace(/\s/g, '-')}`}
                        onClick={() => setSuggestions([])}
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        {suggestion}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Theme toggle, Notifications, Profile */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={handleThemeClick}
            className="p-2 rounded hover:bg-indigo-800 focus:outline-none"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <FaMoon className="text-white" /> : <FaSun className="text-yellow-300" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded hover:bg-indigo-800 focus:outline-none"
              aria-label="Notifications"
              aria-haspopup="true"
              aria-expanded={isNotificationsOpen}
            >
              <FaBell />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                3
              </span>
            </button>
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-white text-gray-700 border border-gray-300 rounded-md shadow-lg z-50"
                >
                  {/* ...notifications content */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center p-2 rounded hover:bg-indigo-800 focus:outline-none"
              aria-label="User Profile"
              aria-haspopup="true"
              aria-expanded={isProfileOpen}
            >
              <FaUserCircle className="text-2xl" />

              {/* If user is defined, show their name; else show "Guest" */}
              <span className="hidden md:block ml-2 text-sm font-medium">
                {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
              </span>

              <FaChevronDown className="hidden md:block ml-1 text-xs" />
            </button>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, translateY: -10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white text-gray-700 border border-gray-300 rounded-md shadow-lg z-50"
                >
                  {/* A link to the user profile page (dynamically assigned) */}
                  <Link
                    to={profileRoute} 
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    to={getSettingsRoute(user)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>

                  {/* Logout button or other items */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Optional subheader for pinned/vital messages */}
      <div className="bg-yellow-400 text-white text-sm py-1 px-4">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-semibold">
            Special Message: System maintenance scheduled for <strong>Dec 10</strong>.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
