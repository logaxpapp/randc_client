import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import {
  FaChevronDown,
  FaToolbox,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaInfoCircle,   // New icons
} from 'react-icons/fa';

import Logo from '../assets/images/logo.png'; // Adjust path if necessary
import { getNavItems, NavItem } from './NavItems';

interface SidebarProps {
  role: 'admin' | 'cleaner' | 'user';
  
}



/* ----------------------------------------------------------------------------
 * SidebarHeader
 * ------------------------------------------------------------------------- */
const SidebarHeader: React.FC<{
  isCollapsed: boolean;
  toggleSidebar: () => void;
}> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-between p-3',
        'bg-indigo-700 text-white'
      )}
    >
      {!isCollapsed && (
        <NavLink to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-wide">R&C</span>
        </NavLink>
      )}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded hover:bg-indigo-600 focus:outline-none"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <FaAngleDoubleRight className="text-xl" />
        ) : (
          <FaAngleDoubleLeft className="text-xl" />
        )}
      </button>
    </div>
  );
};

/* ----------------------------------------------------------------------------
 * SubMenuItem
 * ------------------------------------------------------------------------- */
const SubMenuItem: React.FC<{
  subItem: NavItem;
  isCollapsed: boolean;
  parentIndex: number;
  subIndex: number;
}> = ({ subItem, isCollapsed, parentIndex, subIndex }) => {
  const SubIcon = subItem.icon;
  return (
    <li>
      <NavLink
        to={subItem.to}
        className={({ isActive }) =>
          clsx(
            'flex items-center p-2 rounded transition-colors text-sm hover:bg-indigo-700',
            isActive && 'bg-indigo-800'
          )
        }
        data-tip={isCollapsed ? subItem.label : undefined}
        data-for={`tooltip-sub-${parentIndex}-${subIndex}`}
      >
        <SubIcon className="text-base" />
        {!isCollapsed && <span className="ml-3">{subItem.label}</span>}
      </NavLink>

      {/* Tooltip for SubItems (collapsed) */}
      {isCollapsed && (
        <Tooltip
          id={`tooltip-sub-${parentIndex}-${subIndex}`}
          place="right"
          className="z-50"
        />
      )}
    </li>
  );
};

/* ----------------------------------------------------------------------------
 * SidebarItem (handles both main nav and sub-items)
 * ------------------------------------------------------------------------- */
const SidebarItem: React.FC<{
  item: NavItem;
  index: number;
  isCollapsed: boolean;
  isOpen: boolean;
  onToggle: (i: number) => void;
}> = ({ item, index, isCollapsed, isOpen, onToggle }) => {
  const IconComp = item.icon;

  return (
    <li className="px-2">
      <div>
        {/* Main NavLink (only clickable if item.to !== '#') */}
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            clsx(
              'flex items-center p-2 rounded transition-colors hover:bg-indigo-700',
              // if item.to === '#', style as disabled or not clickable
              item.to === '#' && 'cursor-default pointer-events-none bg-indigo-600',
              isActive && item.to !== '#' && 'bg-indigo-800'
            )
          }
          data-tip={isCollapsed ? item.label : undefined}
          data-for={`tooltip-${index}`}
        >
          <IconComp className="text-lg" />
          {!isCollapsed && <span className="ml-3">{item.label}</span>}
        </NavLink>

        {/* Tooltip (collapsed mode) */}
        {isCollapsed && (
          <Tooltip id={`tooltip-${index}`} place="right" className="z-50" />
        )}

        {/* Submenu Toggle Button */}
        {item.subItems && item.subItems.length > 0 && (
          <>
            <button
              onClick={() => onToggle(index)}
              className={clsx(
                'flex items-center w-full p-2 mt-1 rounded transition-colors hover:bg-indigo-700',
                isOpen && 'bg-indigo-800'
              )}
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              {!isCollapsed && (
                <span className="ml-6 text-sm font-medium">More</span>
              )}
              {!isCollapsed && (
                <FaChevronDown
                  className={clsx(
                    'ml-auto transition-transform duration-300',
                    isOpen ? 'transform rotate-180' : ''
                  )}
                />
              )}
            </button>

            {/* Submenu Items */}
            <AnimatePresence>
              {isOpen && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4 mt-1 space-y-1"
                >
                  {item.subItems.map((subItem, subIdx) => (
                    <SubMenuItem
                      key={subItem.to}
                      subItem={subItem}
                      isCollapsed={isCollapsed}
                      parentIndex={index}
                      subIndex={subIdx}
                    />
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </li>
  );
};

/* ----------------------------------------------------------------------------
 * SidebarFooter
 * ------------------------------------------------------------------------- */
const SidebarFooter: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  return (
    <div className="p-4 border-t border-red-800">
      {/* Could place logout button, version info, or settings here */}
      {!isCollapsed ? (
        <div className="flex items-center space-x-2 text-sm font-medium">
          <FaToolbox />
          <span>Logout</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <FaToolbox />
        </div>
      )}
    </div>
  );
};

/* ----------------------------------------------------------------------------
 * Main Sidebar
 * ------------------------------------------------------------------------- */
const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const storedState = localStorage.getItem('sidebar-collapsed');
    return storedState ? JSON.parse(storedState) : false;
  });

  const [openIndices, setOpenIndices] = useState<number[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Get navigation items based on role
  const navItems: NavItem[] = getNavItems(role);

  // Toggle sidebar collapse/expand
  const toggleSidebar = () => {
    setIsCollapsed((prev: boolean) => {
      const newValue = !prev;
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newValue));
      return newValue;
    });
  };

  // Toggle submenu open/close
  const toggleSubMenu = (index: number) => {
    if (openIndices.includes(index)) {
      setOpenIndices((prev) => prev.filter((i) => i !== index));
    } else {
      setOpenIndices((prev) => [...prev, index]);
    }
  };

  // Close all submenus when clicking outside
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpenIndices([]);
      }
    },
    [sidebarRef]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Mock data for vital Message data
   const vitalMessage = {
     title: 'Vital Notice:',
     message: 'R&C Cleaning is now live!',
   };

  return (
    <aside
      ref={sidebarRef}
      className={clsx(
        'bg-indigo-900 text-white h-auto transition-all duration-300 flex flex-col justify-between shadow-lg',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* TOP: Logo + Collapse Button */}
      <SidebarHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* VITAL MESSAGE (Example placeholder for a pinned/vital message) */}
      {!isCollapsed && (
        <div className="bg-indigo-800 mx-2 mt-2 p-2 rounded">
          <div className="flex items-center space-x-2 text-sm">
            <FaInfoCircle className="text-sky-400" />
            <span className="font-semibold">Vital Notice:</span>
          </div>
          <p className="text-xs mt-1 text-slate-100">
            {vitalMessage.title} {vitalMessage.message}

          </p>
        </div>
      )}

      {/* NAV ITEMS */}
      <nav className="mt-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <SidebarItem
              key={item.to}
              item={item}
              index={index}
              isCollapsed={isCollapsed}
              isOpen={openIndices.includes(index)}
              onToggle={toggleSubMenu}
            />
          ))}
        </ul>
      </nav>

      {/* FOOTER SECTION */}
      <SidebarFooter isCollapsed={isCollapsed} />
    </aside>
  );
};

export default Sidebar;
