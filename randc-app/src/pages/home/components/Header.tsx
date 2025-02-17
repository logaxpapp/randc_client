// src/components/HeaderWideDropdownResponsive.tsx (example path)
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes, FaArrowRight } from "react-icons/fa";
import { useAppSelector } from "../../../app/hooks"; // Adjust path if needed
import logo from "../../../assets/images/logo.png"; // Example brand logo

// Example center nav links
const navLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Services", path: "/services" },
];

// Helper: decide which dashboard path to go to
function getDashboardPath(roles: string[]): string {
  if (roles.includes("ADMIN")) {
    return "/admin/dashboard";
  } else if (roles.includes("CLEANER") || roles.includes("STAFF")) {
    return "/cleaner/dashboard";
  } else if (roles.includes("SEEKER")) {
    return "/seeker/dashboard";
  } else {
    return "/seeker/dashboard"; 
  }
}

const HeaderWideDropdownResponsive: React.FC = () => {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Grab user & roles from Redux
  const user = useAppSelector((state) => state.auth.user);
  const userRoles: string[] = user?.roles ?? [];

  // Close mobile menu if resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On "Dashboard" click
  const handleGoToDashboard = () => {
    const dashPath = getDashboardPath(userRoles);
    navigate(dashPath);
  };

  // Example “Logout” click (stub)
  const handleLogout = () => {
    // If you have a logout action, call it here
    // e.g. dispatch(logout()), remove token, etc.
    console.log("Logout clicked");
  };

  return (
    <header className="w-full bg-[#101820] text-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 py-5 flex items-center">
        {/* Left: Brand & Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Brand Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-extrabold text-lime-600 border-b-4 border-amber-400 inline-block pb-1">
            R&C
          </h1>
        </Link>

        {/* Center: Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-6 mx-auto text-lg">
          {navLinks.map((link, idx) => (
            <li key={idx}>
              <Link
                to={link.path}
                className="hover:text-lime-400 transition font-semibold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: Desktop => either "Get Started" or a "User Menu" */}
        <div className="hidden md:block">
          {!user ? (
            // If NO user => Show "Get Started"
            <Link
              to="/signup-select"
              className="bg-lime-500 text-white font-semibold px-5 py-3 rounded hover:bg-lime-600 transition flex items-center"
            >
              Get Started
              <FaArrowRight className="ml-2" />
            </Link>
          ) : (
            // If user => show user dropdown (just a sample)
            <div className="relative inline-block">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="px-4 py-2 bg-lime-500 hover:bg-lime-600 rounded font-semibold flex items-center"
              >
                {/** Display user’s name or email */}
                {user.firstName
                  ? `Hi, ${user.firstName}`
                  : `Hi, ${user.email}`}
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-20"
                  >
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleGoToDashboard();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden ml-auto">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="bg-[#101820] text-white md:hidden shadow-lg origin-top"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 flex flex-col space-y-4 border-t border-gray-700">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="font-semibold text-sm hover:text-lime-400 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* If user is not logged in, show "Get Started" in mobile menu */}
              {!user ? (
                <Link
                  to="/signup-select"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-lime-400 text-gray-900 font-semibold px-4 py-2 
                            rounded w-full text-center hover:bg-lime-500 transition
                            flex items-center justify-center"
                >
                  Get Started <FaArrowRight className="ml-2" />
                </Link>
              ) : (
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleGoToDashboard();
                    }}
                    className="bg-lime-400 text-gray-900 font-semibold px-4 py-2 
                              rounded w-full text-center hover:bg-lime-500 transition
                              flex items-center justify-center"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="bg-red-500 text-white font-semibold px-4 py-2 
                              rounded w-full text-center hover:bg-red-600 transition
                              flex items-center justify-center"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default HeaderWideDropdownResponsive;
