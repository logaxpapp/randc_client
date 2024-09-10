import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { useSelector, useDispatch } from 'react-redux';
import { getProfilePicture } from '../../features/user/profilePictureSlice';
import useThemeSwitcher from '../themes/useThemeSwitcher';
import UserModal from '../modal/UserManagementModal';
import InvitePeopleModal from '../modal/InvitePeopleModal';
import ProjectModal from '../modal/ProjectModal';
import MyTeamModal from '../modal/MyTeamModal';
import ProfileModal from '../modal/ProfileModal';
import CreateTeamModal from '../modal/CreateTeamModal';
import CreateTeamMembersModal from '../modal/CreateTeamMembersModal';
import SearchPeopleModal from '../modal/SearchPeopleModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import defaultProfilePic from '../../assets/images/logo.png';
import {  faUserFriends, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../features/auth/authSlice';
import { InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Utility function to convert hex to RGBA
function hexToRGBA(hex, opacity) {
  let r = 0, g = 0, b = 0;
  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return `rgba(${r},${g},${b},${opacity})`;
}

function DashboardHeaderAdmin() {
  const navigate = useNavigate();
  const { currentTheme } = useThemeSwitcher();
  const userDetails = useSelector((state) => state.users.currentUser);
  const user = useSelector((state) => state.auth.user);
  const tenantId = useSelector((state) => state.auth.user?.tenantId);
  const profilePictureUrl = useSelector(state => state.profilePicture.profile?.profilePictureUrl);
  const logoutUser = useSelector(state => state.auth.logoutUser);
  const { logout } = useAuth(); // If using Auth Conte
  const dispatch = useDispatch();

  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isInvitePeopleModalOpen, setInvitePeopleModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isMyTeamModalOpen, setMyTeamModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [searchPeopleModalOpen, setSearchPeopleModalOpen] = useState(false);
  const [createTeamMembersModalOpen, setCreateTeamMembersModalOpen] = useState(false);
  const [searchPeopleMembersModalOpen, setSearchPeopleMembersModalOpen] = useState(false);

  const handleOpenCreateTeamMembersModal = () => {
    setCreateTeamMembersModalOpen(true);
    setCreateTeamModalOpen(false);
  };

  const handleCloseCreateTeamMembersModal = () => {
    setCreateTeamMembersModalOpen(false);
  };


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSetActiveLink = (linkName, event) => {
    event.preventDefault();
    setActiveLink(linkName);

    // TemList
    const handleTeamList = () => {
      navigate('/dashboard/team-list');
    };
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

  const linkStyle = (linkName) => (
    `relative inline-flex items-center px-2 py-1 border border-white text-xs font-medium 
    rounded-md text-gray-700 bg-slate-200 hover:text-gray-500 focus:z-10 focus:outline-none 
    focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 
    focus:ring-white ${activeLink === linkName ? 'bg-gray-200' : ''}`
  );

  useEffect(() => {
    if (userDetails?._id) {
      dispatch(getProfilePicture());
    }
  }, [userDetails?._id, dispatch]);


    // Convert hex color to RGBA
    const hexToRGBA = (hex, opacity = 1) => {
      let r = 0, g = 0, b = 0;
      hex = hex.replace('#', '');
      
      if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
  
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
  
    // Determine the background color, considering opacity if defined
    const backgroundColor = currentTheme.opacity 
        ? hexToRGBA(currentTheme.bgColor, currentTheme.opacity) 
        : currentTheme.bgColor;

        const handleLogout = () => {
          // If using Redux:
          //dispatch(logoutUser()); // Assume logoutUser is an action creator for logging out
      
          // If using Auth Context:
          logout(); // Call logout method from useAuth
      
          navigate('/login'); // Redirect to login after logout
        };
        const [searchQuery, setSearchQuery] = useState('');

        const handleSearch = (event) => {
          event.preventDefault();
          console.log('Searching for:', searchQuery);
          // Implement your search logic here
          // For example: navigate(`/search?query=${searchQuery}`);
        };

  return (
    <nav className="text-xs" style={{ backgroundColor: currentTheme.textColor }}>
  <div className="flex justify-between items-center bg-custom-green-3 text-white p-2"  style={{ backgroundColor: currentTheme.bgColor }}>
    <div className="flex items-center justify-start">
      <Link to="/">
        <img src={Logo} alt="Home" style={{ height: '50px', marginRight: '20px' }} />
      </Link>
      <div className="font-bold text-lg" style={{ color: currentTheme.textColor }}>
        Hi, {user?.firstName || user?.lastName}
        <span style={{ marginLeft: '15px', color: '#FFD700' }}>👑</span>
      </div>
    </div>
  
        <div className="flex items-center justify-center h-4">
          <div className="flex space-x-4">
            <Link to="#" className={linkStyle('Projects')} onClick={(e) => handleSetActiveLink('Projects', e)}>Projects</Link>
            <Link to="#" className={linkStyle('Invitation')} onClick={(e) => handleSetActiveLink('Invitation', e)}>Invitation</Link>
            <Link to="#" className={linkStyle('Users')} onClick={(e) => handleSetActiveLink('Users', e)}>Users</Link>
            <Link to="#" className={linkStyle('Teams')} onClick={(e) => handleSetActiveLink('Teams', e)}>Teams</Link>
            <a href="#" className={linkStyle('Create User')} onClick={() => navigate('/dashboard/create-user')}>Create User</a>
            <a href="#" className={linkStyle('User List')} onClick={() => navigate('/dashboard/user-list')}>User List</a>
            <a href="#" className={linkStyle('Team List')} onClick={() => navigate('/dashboard/team-list')}>Team List</a>
            <div className="hidden sm:flex sm:items-center ml-auto ">
                <Menu as="div" className="relative">
                  <Menu.Button className="inline-flex items-right justify-end w-full px-2 py-1 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    Teams
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } group flex rounded-md items-center w-full p-2 text-sm`}
                            onClick={() => console.log('Open My Teams Modal')}
                          >
                            <FontAwesomeIcon icon={faUserFriends} className="w-5 h-5 mr-2" />
                            My teams (12 members)
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } group flex rounded-md items-center w-full p-2 text-sm`}
                            onClick={handleOpenCreateTeamMembersModal}
                          >
                            <FontAwesomeIcon icon={faUserPlus} className="w-5 h-5 mr-2" />
                            Create Team
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } group flex rounded-md items-center w-full p-2 text-sm`}
                            onClick={() => setSearchPeopleModalOpen(true)}
                          >
                            <FontAwesomeIcon icon={faSearch} className="w-5 h-5 mr-2" />
                            Search
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } group flex rounded-md items-center w-full p-2 text-sm`}
                            onClick={() => setCreateTeamModalOpen(true)}
                          >
                            <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" />
                            Create Team
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } group flex rounded-md items-center w-full p-2 text-sm`}
                            onClick={() => setCreateTeamMembersModalOpen(true)}
                          >
                            <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" />
                            Create Team Members
                          </button>
                        )}
                      </Menu.Item>
                      {/* Repeat for other Menu.Item components using FontAwesome icons */}
                    </div>
                  </Menu.Items>
                </Menu>
              </div>
          </div>
        </div>
   {/* Search Bar */}
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            p: '1px 8px',
            display: 'flex',
            alignItems: 'center',
            width: 300,
            borderRadius: '20px',
            backgroundColor: currentTheme.searchBackgroundColor || '#fff', // Use theme or default
            boxShadow: 'none', // Remove Paper component's default shadow
            border: `1px solid ${currentTheme.searchBorderColor || '#ccc'}`, // Use theme or default
            '&:hover': {
              boxShadow: `0 0 11px rgba(33,33,33,.2)`, // Soft shadow on hover
            },
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: '5px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <div className="flex items-center justify-end">
          <div className="h-8 w-8 border rounded-full bg-white py-1 px-1">
            <img
              src={profilePictureUrl || defaultProfilePic}
              alt="Profile"
              id="profilePicture"
              onError={(e) => { e.target.onerror = null; e.target.src = defaultProfilePic; }}
              onClick={() => setProfileModalOpen(true)}
            />
          </div>
          <div className="flex items-center justify-end ml-2">
      <button onClick={handleLogout} className={linkStyle('Projects')}>
        Logout
      </button>
    </div>
        </div>
       
      </div>
      <div className="sm:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
        </div>
       
  
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
  
  <UserModal open={isUserModalOpen} onClose={() => setUserModalOpen(false)} />
        <InvitePeopleModal open={isInvitePeopleModalOpen} onClose={() => setInvitePeopleModalOpen(false)} />
        <ProjectModal open={isProjectModalOpen} onClose={() => setProjectModalOpen(false)} />
        <MyTeamModal open={isMyTeamModalOpen} onClose={() => setMyTeamModalOpen(false)} tenantId={tenantId} />
        <ProfileModal open={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
        <CreateTeamMembersModal open={createTeamMembersModalOpen} onClose={() => setCreateTeamMembersModalOpen(false)} />
        <CreateTeamModal open={createTeamModalOpen} onClose={() => setCreateTeamModalOpen(false)} tenantId={tenantId} />
        <SearchPeopleModal open={searchPeopleModalOpen} onClose={handleCloseCreateTeamMembersModal} />
        
    </nav>
  );
  }
export default DashboardHeaderAdmin;


