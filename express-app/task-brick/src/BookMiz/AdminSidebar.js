import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import LogoutModal from './modal/LogoutModal';
import ResetPasswordModal from './modal/ResetPasswordModal';
import DashboardIcon from './assets/dashboards.svg';
import CountryIcon from './assets/flag.svg';
import CompanyIcon from './assets/shop.svg';
import UserIcon from './assets/users.svg';
import AdminIcon from './assets/user-tag.svg';
import BillionPlanIcon from './assets/bill.svg';
import MessagesIcon from './assets/message-add.svg';
import ChangePasswordIcon from './assets/password-check.svg';
import SettingsIcon from './assets/settings.svg';
import LogoutIcon from './assets/logout.svg';
import logo from '../assets/images/logo.png';
import './adminSidebar.css';

const AdminSidebar = () => {
  const [activeLink, setActiveLink] = useState('dashboard'); 
  const navItemClass = "flex items-center justify-start p-2 text-base font-normal mb-4 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700";
  const iconStyle = { width: '20px', height: '18px', margin: '0 12px',  top: '2px', left: '2px', fill: '#adb5bd' }; 
  const activeStyle = 'bg-gray-100'; 

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

   // Function to handle opening of the Reset Password modal
   const handleResetPasswordClick = () => {
    setIsResetPasswordModalOpen(true);
  };

  // Function to handle the actual password reset logic
  const handlePasswordReset = (oldPassword, newPassword) => {
    console.log("Password reset logic goes here.");
    setIsResetPasswordModalOpen(false); 
  };

  const handleLogoutClick = () => { setIsLogoutModalOpen(true)};

  const handleLogout = () => {
    // Logic to handle the logout action, e.g., clearing user data, tokens, etc.
    setIsLogoutModalOpen(false);
   
  };
  return (
    <aside className="font-jakata-sidebar w-60 justify-center" aria-label="Sidebar">
     <div className="flex flex-col  justify-center overflow-y-auto py-4 px-3 border bg-white rounded dark:bg-gray-800">
        <ul className="space-y-6 gap-8  ">
          <li>
            <a href="#" className="flex items-center p-2 text-base font-normal mb-20 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <img className="h-10 w-10 rounded-full border bg-green-400" src={logo} alt="LogaXP logo" />
              <span className="ml-3">LogaXP</span>
            </a>
          </li>
          <li>
          <li>
          <NavLink 
            to="/book-admin" 
            className={({ isActive }) => isActive ? `${navItemClass} ${activeStyle}` : navItemClass}
            end // This ensures the NavLink is active only when the route is exactly "/book-admin"
          >
            <img src={DashboardIcon} style={iconStyle} alt="Dashboard" />
            <span className="flex-1 min-w-0 text-sm ml-3">Dashboard</span>
          </NavLink>

          </li>
          </li>
          <li>
          <NavLink
            to="/book-admin/countries"
            className={({ isActive }) => isActive ? `${navItemClass} ${activeStyle}` : navItemClass}
          >
            <img src={CountryIcon} style={iconStyle} alt="Country" />
            <span className="flex-1 ml-3 min-w-0 text-sm">Country</span>
          </NavLink>

          </li>
          <li>
            <NavLink to="/book-admin/companies"
         className={({ isActive }) => isActive ? `${navItemClass} ${activeStyle}` : navItemClass}
            onClick={() => handleLinkClick('company')}>
            <img src={CompanyIcon}  style={iconStyle} className="text-black" />
            
              <span className="ml-3 text-sm">Company</span>
            </NavLink>
          </li>
          <li>
          <NavLink
              to="/book-admin/users"
              className={({ isActive }) =>
                isActive ? `${navItemClass} ${activeStyle}` : navItemClass
              }
            >
              <img src={UserIcon} style={iconStyle} alt="Users" />
              <span className="ml-3 text-sm">Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/book-admin/admin-users"   className={({ isActive }) => isActive ? `${navItemClass} ${activeStyle}` : navItemClass}
            onClick={() => handleLinkClick('admins')}>
            <img src={AdminIcon}  style={iconStyle} className="text-black" />
             
              <span className="ml-3 text-sm">Admins</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/book-admin/subscriptions"   className={({ isActive }) => isActive ? `${navItemClass} ${activeStyle}` : navItemClass}
            onClick={() => handleLinkClick('billingPlans')}>
            <img src={BillionPlanIcon} style={iconStyle} className="text-black" />
             
              <span className="ml-3 text-sm">Billing Plans</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/book-admin/messages"   className={({ isActive }) => isActive ? `${navItemClass} ${activeStyle}` : navItemClass}
            onClick={() => handleLinkClick('messages')}>
            <img src={MessagesIcon}  style={iconStyle} className="text-black" />
              <span className="ml-3 text-sm">Messages</span>
            </NavLink>
          </li>
          <li>
            
          <button
            className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
              activeLink === 'changePassword' ? activeStyle : ''
            }`}
            onClick={() => {
              handleLinkClick('changePassword');
              handleResetPasswordClick(); // This will open the ResetPasswordModal
            }}
          >
            <img src={ChangePasswordIcon} style={iconStyle} alt="Change Password" />
            <span className="ml-3 text-sm">Change Password</span>
          </button>
          </li>

          <li>
            <div className="mb-24 border-b ">

            </div>
          </li>
         

          <li>
          <NavLink to="/book-admin/settings"   className={({ isActive }) => isActive ? `${navItemClass} ${activeStyle}` : navItemClass}
          onClick={() => handleLinkClick('settings')}>
              <img src={SettingsIcon}  style={iconStyle} className="text-black" />
              <span className="ml-3 text-sm">Settings</span>
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogoutClick} className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <img src={LogoutIcon}  style={iconStyle} className="text-black" />

              <span className="ml-3 text-sm">Log out</span>
            </button>
          </li>
        </ul>
        <LogoutModal
        isOpen={isLogoutModalOpen}
        onLogout={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onPasswordReset={handlePasswordReset}
        onClose={() => setIsResetPasswordModalOpen(false)}
      />
      </div>
    </aside>
  );
};

export default AdminSidebar;
