// src/pages/home/components/HeaderWideDropdownResponsive.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaVimeoV,
  FaBars,
  FaTimes,
  FaArrowRight,
  FaChevronDown,
  FaServicestack,
  FaInfoCircle,
  FaBlog,
  FaEnvelope,
  FaTools,
  FaChartLine,
} from 'react-icons/fa';
import logo from '../../../assets/images/logo.png';

interface SubSubLink {
  label: string;
  href: string;
}

interface SubLink {
  label: string;
  href: string;
  subSubLinks?: SubSubLink[];
}

interface NavItem {
  label: string;
  icon?: React.ReactNode;
  href?: string; // Direct link
  subLinks?: SubLink[];
}

// Only the three center nav items
const navItems: NavItem[] = [
  {
    label: 'SERVICES',
    icon: <FaServicestack />,
    subLinks: [
      {
        label: 'Cleaning Services',
        href: '#',
        subSubLinks: [
          { label: 'Deep Cleaning', href: '#' },
          { label: 'Office Cleaning', href: '#' },
        ],
      },
      {
        label: 'Maintenance Services',
        href: '#',
        subSubLinks: [
          { label: 'Plumbing', href: '#' },
          { label: 'Electrical', href: '#' },
        ],
      },
    ],
  },
  {
    label: 'ABOUT',
    icon: <FaInfoCircle />,
    subLinks: [
      { label: 'Our Story', href: '#' },
      { label: 'Mission & Vision', href: '#' },
      {
        label: 'Team',
        href: '#',
        subSubLinks: [
          { label: 'Management', href: '#' },
          { label: 'Staff', href: '#' },
        ],
      },
    ],
  },
  {
    label: 'BLOG',
    icon: <FaBlog />,
    subLinks: [
      { label: 'Latest Posts', href: '#' },
      { label: 'Categories', href: '#' },
      { label: 'Archives', href: '#' },
    ],
  },
];

const HeaderWideDropdownResponsive: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<null | number>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isGetStartedDropdownOpen, setIsGetStartedDropdownOpen] = useState(false); // "Get Started" dropdown
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const getStartedRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns when clicking outside
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      // Close nav item dropdowns
      dropdownRefs.current.forEach((ref) => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenIndex(null);
        }
      });

      // Close Get Started dropdown
      if (getStartedRef.current && !getStartedRef.current.contains(event.target as Node)) {
        setIsGetStartedDropdownOpen(false);
      }
    },
    [dropdownRefs, getStartedRef]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <header className="w-full text-white">
      {/* Top Info Bar */}
      <div className=" bg-gradient-to-b from-blue-200 to-blue-800 text-base">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          {/* Left: Contact Info */}
          <div className="flex items-center space-x-6">
            <ContactInfo icon={<FaTools />} text="(615) 554-3592" />
            <ContactInfo icon={<FaEnvelope />} text="helprandc@gmail.com" />
            <ContactInfo icon={<FaChartLine />} text="Nashville, TN 37138" />
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center space-x-4">
            <SocialIcon href="https://facebook.com" icon={<FaFacebookF />} />
            <SocialIcon href="https://twitter.com" icon={<FaTwitter />} />
            <SocialIcon href="https://linkedin.com" icon={<FaLinkedinIn />} />
            <SocialIcon href="https://vimeo.com" icon={<FaVimeoV />} />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        className="bg-white text-blue-800 shadow-md relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          {/* Left: Logo & Brand */}
          <div className="flex items-center space-x-2 text-[#2F1C6A] ">
            <img src={logo} alt="R&C Cleaning Logo" className="h-10 w-10 object-contain" />
            <div className="leading-5">
              <h1 className="text-lg font-bold">R&C Cleaning</h1>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Cleaning Services
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-6 font-semibold mx-auto">
            {navItems.map((item, idx) => (
              <NavItemComponent
                key={item.label}
                item={item}
                isOpen={openIndex === idx}
                onToggle={() => toggleDropdown(idx)}
                ref={(el) => (dropdownRefs.current[idx] = el)}
              />
            ))}
          </ul>

          {/* Right: Login + GET STARTED */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {/* LOGIN Button */}
            <Link
              to="/login"
              className="bg-[#2F1C6A] text-white px-3 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              LOGIN
            </Link>

            {/* GET STARTED Dropdown */}
            <div className="relative" ref={getStartedRef}>
              <button
                onClick={() => setIsGetStartedDropdownOpen((prev) => !prev)}
                className="bg-[#D63063] text-white font-semibold px-4 py-2 rounded hover:bg-[#D63034] transition flex items-center justify-center"
              >
                GET STARTED <FaArrowRight className="ml-1" />
                {/* Dropdown Arrow */}
                <FaChevronDown
                  className={`ml-2 transition-transform ${isGetStartedDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                />
              </button>

              {/* GET STARTED Dropdown Menu */}
              <AnimatePresence>
                {isGetStartedDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ul className="py-1">
                      <li>
                        <Link
                          to="/user-signup"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsGetStartedDropdownOpen(false)}
                        >
                          Register as a User
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/company-signup"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsGetStartedDropdownOpen(false)}
                        >
                          Register as a Business
                        </Link>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle (visible on mobile) */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="bg-white text-blue-800 md:hidden shadow-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-4 flex flex-col space-y-4 border-t border-gray-200">
                {navItems.map((item) => (
                  <MobileNavItem key={item.label} item={item} />
                ))}

                {/* LOGIN Button in Mobile */}
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  LOGIN
                </Link>

                {/* GET STARTED Dropdown in Mobile */}
                <div className="relative" ref={getStartedRef}>
                  <button
                    onClick={() => setIsGetStartedDropdownOpen((prev) => !prev)}
                    className="bg-yellow-400 text-blue-800 font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition flex items-center justify-center w-full"
                  >
                    GET STARTED <FaArrowRight className="ml-1" />
                    {/* Dropdown Arrow */}
                    <FaChevronDown
                      className={`ml-2 transition-transform ${isGetStartedDropdownOpen ? 'transform rotate-180' : ''
                        }`}
                    />
                  </button>

                  {/* GET STARTED Dropdown Menu */}
                  <AnimatePresence>
                    {isGetStartedDropdownOpen && (
                      <motion.div
                        className="mt-2 w-full bg-white rounded-md shadow-lg z-50"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ul className="py-1">
                          <li>
                            <Link
                              to="/user-signup"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsGetStartedDropdownOpen(false)}
                            >
                              Register as a User
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/company-signup"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsGetStartedDropdownOpen(false)}
                            >
                              Register as a Business
                            </Link>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
};

export default HeaderWideDropdownResponsive;

/** ---------------------------------------
 *  Sub-Components
 *  ------------------------------------- */

interface ContactInfoProps {
  icon: React.ReactNode;
  text: string;
}
const ContactInfo: React.FC<ContactInfoProps> = ({ icon, text }) => (
  <div className="flex items-center space-x-1">
    {icon}
    <span>{text}</span>
  </div>
);

interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
}
const SocialIcon: React.FC<SocialIconProps> = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="text-lg hover:text-gray-200 transition"
  >
    {icon}
  </a>
);

/** Desktop Nav Item with optional dropdown */
interface NavItemComponentProps {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
}
const NavItemComponent = React.forwardRef<HTMLDivElement, NavItemComponentProps>(
  ({ item, isOpen, onToggle }, ref) => {
    // If direct link (no subLinks)
    if (item.href && (!item.subLinks || item.subLinks.length === 0)) {
      return (
        <li>
          <Link
            to={item.href}
            className="flex items-center space-x-1 hover:text-blue-500 focus:outline-none transition"
          >
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        </li>
      );
    }

    // If there are subLinks, render a dropdown
    return (
      <li className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onToggle}
          className="flex items-center space-x-1 hover:text-blue-500 transition focus:outline-none"
          aria-haspopup={!!item.subLinks}
          aria-expanded={isOpen}
        >
          {item.icon && <span className="text-lg">{item.icon}</span>}
          <span>{item.label}</span>
          {item.subLinks && item.subLinks.length > 0 && (
            <FaChevronDown
              className={`transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            />
          )}
        </button>

        <AnimatePresence>
          {isOpen && item.subLinks && (
            <motion.div
              ref={ref as React.RefObject<HTMLDivElement>}
              className="
                absolute left-0 top-full mt-2 bg-white text-blue-800 
                shadow-lg z-50 py-4 rounded-md w-56
              "
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ul>
                {item.subLinks.map((sub, subIdx) => (
                  <li key={subIdx} className="px-3 py-1">
                    {sub.subSubLinks ? (
                      <>
                        <p className="font-semibold text-sm mb-1">{sub.label}</p>
                        <ul className="pl-2 space-y-1">
                          {sub.subSubLinks.map((subSub, subSubIdx) => (
                            <li key={subSubIdx}>
                              <a
                                href={subSub.href}
                                className="block text-sm hover:text-blue-600 transition"
                              >
                                {subSub.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <a
                        href={sub.href}
                        className="block text-sm hover:text-blue-600 transition"
                      >
                        {sub.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    );
  }
);
NavItemComponent.displayName = 'NavItemComponent';

/** Mobile Nav Item */
interface MobileNavItemProps {
  item: NavItem;
}
const MobileNavItem: React.FC<MobileNavItemProps> = ({ item }) => {
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [activeSubIndex, setActiveSubIndex] = useState<null | number>(null);

  // Direct link
  if (item.href && (!item.subLinks || item.subLinks.length === 0)) {
    return (
      <Link
        to={item.href}
        className="font-semibold text-sm hover:text-blue-500 transition flex items-center space-x-1"
      >
        {item.icon && <span className="text-lg">{item.icon}</span>}
        <span>{item.label}</span>
      </Link>
    );
  }

  // Dropdown
  const toggleSubMenu = () => setIsSubOpen((prev) => !prev);
  const toggleSubSubMenu = (idx: number) => {
    setActiveSubIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div>
      <button
        onClick={toggleSubMenu}
        className="w-full text-left font-semibold text-sm hover:text-blue-500 transition flex items-center justify-between"
        aria-haspopup={!!item.subLinks}
        aria-expanded={isSubOpen}
      >
        <span className="flex items-center space-x-1">
          {item.icon && <span className="text-lg">{item.icon}</span>}
          <span>{item.label}</span>
        </span>
        {item.subLinks && (
          <FaChevronDown className={`transition-transform ${isSubOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      <AnimatePresence>
        {isSubOpen && item.subLinks && (
          <motion.div
            className="pl-4 mt-1 space-y-1"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.subLinks.map((sub, subIdx) => (
              <div key={subIdx} className="my-2">
                <button
                  onClick={() => toggleSubSubMenu(subIdx)}
                  className="flex items-center justify-between w-full text-sm font-semibold hover:text-blue-500"
                  aria-haspopup={!!sub.subSubLinks}
                  aria-expanded={activeSubIndex === subIdx}
                >
                  <span>{sub.label}</span>
                  {sub.subSubLinks && (
                    <FaChevronDown
                      className={`transition-transform ${
                        activeSubIndex === subIdx ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {activeSubIndex === subIdx && sub.subSubLinks && (
                    <motion.div
                      className="pl-4 mt-1 space-y-1"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {sub.subSubLinks.map((subSub, subSubIdx) => (
                        <a
                          key={subSubIdx}
                          href={subSub.href}
                          className="block text-sm hover:text-blue-500 transition"
                        >
                          {subSub.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
