import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProfilePicture } from '../../features/user/profilePictureSlice';
import useThemeSwitcher from '../themes/useThemeSwitcher';
import UserModal from '../modal/UserManagementModal';
import InvitePeopleModal from '../modal/InvitePeopleModal';
import ProjectModal from '../modal/ProjectModal';
import MyTeamModal from '../modal/MyTeamModal';
import ProfileModal from '../modal/ProfileModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'; // Added faUserCircle for default profile icon
import defaultProfilePic from '../../assets/images/logo.png';

function DashboardHeaderAdmin() {
  const navigate = useNavigate();
  const { currentTheme } = useThemeSwitcher();
  const userDetails = useSelector((state) => state.users.currentUser);
  const user = useSelector((state) => state.auth.user);
  const profilePictureUrl = useSelector(state => state.profilePicture.profile?.profilePictureUrl);
 
  const dispatch = useDispatch();

  // State for modals and mobile menu
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isInvitePeopleModalOpen, setInvitePeopleModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isMyTeamModalOpen, setMyTeamModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (userDetails?._id) {
      dispatch(getProfilePicture());
    }
  }, [userDetails?._id, dispatch]);

  // Handle setting active link and open respective modal
  const handleSetActiveLink = (linkName, event) => {
    event.preventDefault();
    setActiveLink(linkName);

    // Close all modals first
    setUserModalOpen(false);
    setInvitePeopleModalOpen(false);
    setProjectModalOpen(false);
    setMyTeamModalOpen(false);
    setProfileModalOpen(false);

    switch (linkName) {
      case 'Users':
        setUserModalOpen(true);
        break;
      case 'Invitation':
        setInvitePeopleModalOpen(true);
        break;
      case 'Projects':
        setProjectModalOpen(true);
        break;
      case 'Teams':
        setMyTeamModalOpen(true);
        break;
      case 'Profile':
        setProfileModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Determine link style based on active state
  const linkStyle = (linkName) => (
    `relative inline-flex items-center px-4 py-2 border border-white text-sm font-medium 
    rounded-md text-white bg-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none 
    focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 
    focus:ring-white ${activeLink === linkName ? 'bg-gray-200' : ''}`
  );
  const header = "#432818";

  return (
    <nav className="bg-gray-800" style={{ backgroundColor: currentTheme.none }}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 ">
            <div className="hidden sm:flex sm:items-center ml-auto">
              {/* Profile button with conditional rendering based on profile picture */}
              <div className="ml-12 h-12 w-12 border rounded-full mr-10 bg-white py-1 px-1">
                <img
                  src={profilePictureUrl || defaultProfilePic}
                  alt="Profile"
                  id="profilePicture"
                  onError={(e) => { e.target.onerror = null; e.target.src = defaultProfilePic; }} // Fallback to default image on error
                  onClick={() => setProfileModalOpen(true)} // Open the profile update modal
                />
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              {/* Interactive Links */}
              <Link to="#" className={linkStyle('Projects')} onClick={(e) => handleSetActiveLink('Projects', e)}>Projects</Link>
              <Link to="#" className={linkStyle('Invitation')} onClick={(e) => handleSetActiveLink('Invitation', e)}>Invitation</Link>
              <Link to="#" className={linkStyle('Users')} onClick={(e) => handleSetActiveLink('Users', e)}>Users</Link>
              <Link to="#" className={linkStyle('Teams')} onClick={(e) => handleSetActiveLink('Teams', e)}>Teams</Link>
              <a href="#" className={linkStyle('Create User')} onClick={() => navigate('/dashboard/create-user')}>Create Users</a>
              <a href="#" className={linkStyle('User List')} onClick={() => navigate('/dashboard/user-list')}>User List</a>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
            >
              <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
            </button>
          </div>

          {/* Right section for search and profile button */}
          <div className="hidden sm:flex sm:items-center ml-auto">
            {/* Search bar */}
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
              </div>
              <input
                className="pl-10 w-full border py-2 border-gray-200 rounded-lg text-gray-700 bg-white hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Search…"
                aria-label="Search"
              />
            </div>
            <div className="text-white font-bold text-xl ml-10 mt-2">Hi, {user?.firstName || user?.lastName}</div>
          </div>
        </div>

      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Projects</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Invitation</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Users</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Teams</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Create Users</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">User List</a>
          </div>
        </div>
      )}
      {/* Modals */}
      <UserModal open={isUserModalOpen} onClose={() => setUserModalOpen(false)} />
      <InvitePeopleModal open={isInvitePeopleModalOpen} onClose={() => setInvitePeopleModalOpen(false)} />
      <ProjectModal open={isProjectModalOpen} onClose={() => setProjectModalOpen(false)} />
      <MyTeamModal open={isMyTeamModalOpen} onClose={() => setMyTeamModalOpen(false)} />
      <ProfileModal open={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </nav>
  );

}

export default DashboardHeaderAdmin;
