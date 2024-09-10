import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LogoutModal from '../modal/LogoutModal';
import { useSelector } from'react-redux';
import SignUpModal from '../modal/SignUpModal';
import Logo from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenLogoutModal = () => setIsLogoutModalOpen(true);
  const handleCloseLogoutModal = () => setIsLogoutModalOpen(false);
  const handleOpenSignUpModal = () => setIsSignUpModalOpen(true);
  const handleCloseSignUpModal = () => setIsSignUpModalOpen(false);

  const performLogout = async () => {
    logout();
    handleCloseLogoutModal(); // Ensure the modal is closed before navigating
    navigate('/login');
  };

  const navigationLinks = [
    { name: 'Home', path: '/' },
    { name: 'Solutions', path: '/solution' },
    { name: 'About Us', path: '/about_us' },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
  <div className="flex justify-between items-center py-4">
    <div className="flex items-center"> {/* Add flex container to align items horizontally */}
      <RouterLink to="/" className="flex items-center"> {/* Nested flex container for logo and text */}
        <img src={Logo} alt="TaskBrick Logo" className="h-10 mr-2" /> {/* Add margin to the right */}
        <span className="text-2xl font-bold text-gray-900">
          Task<span className='text-green-500'>Brick</span>
        </span>
      </RouterLink>
    </div>
    <div className="hidden lg:flex font-medium text-blue-700  text-xl space-x-6">
      {navigationLinks.map((link) => (
        <RouterLink key={link.name} to={link.path} className=" hover:text-blue-800">
          {link.name}
        </RouterLink>
      ))}
    </div>
          <div className="flex items-center text-blue-700  space-x-4 text-xl font-medium">
            {isAuthenticated ? (
              <>
                <button className="text-blue-600  text-xl hover:text-blue-500" onClick={handleOpenLogoutModal}>Logout</button>
                <LogoutModal open={isLogoutModalOpen} handleClose={handleCloseLogoutModal} onLogout={performLogout} />
              </>
            ) : (
              <>
                <RouterLink to="/login" className="text-blue-600  text-xl hover:text-blue-500">Login</RouterLink>
                <button className="hover:text-blue-500" onClick={handleOpenSignUpModal}>Sign Up</button>
                {isSignUpModalOpen && <SignUpModal open={isSignUpModalOpen} handleClose={handleCloseSignUpModal} onClose={handleCloseSignUpModal} />}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
