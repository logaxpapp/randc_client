import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Box, InputBase, Menu, MenuItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Settings } from '@mui/icons-material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';
import InvitePeopleModal from '../modal/InvitePeopleModal';
import CreateTeamModal from '../modal/CreateTeamModal';
import  MyTeamModal from '../modal/MyTeamModal';
import SearchPeopleModal from '../modal/SearchPeopleModal';
import Hero from '../../assets/images/hero.png';
import useThemeSwitcher from '../themes/useThemeSwitcher';

function DashboardHeader() {
  const [menuStates, setMenuStates] = useState({
    projects: null,
    filters: null,
    teams: null,
    myspace: null,
    notifications: null,
    setting: null,
    profile: null,
  });
  const navigate = useNavigate();
  const { currentTheme } = useThemeSwitcher();

  const handleMenuClick = (event, menu) => {
    // Close any already open menu before opening a new one
    const newMenuStates = Object.keys(menuStates).reduce((acc, key) => {
      acc[key] = null; // Close all menus
      return acc;
    }, {});
    setMenuStates({ ...newMenuStates, [menu]: event.currentTarget });
  };

  const handleMenuClose = (menu) => {
    setMenuStates({ ...menuStates, [menu]: null });
  };

  const renderMenu = (menu) => (
    <Menu
      id={`menu-${menu}`}
      anchorEl={menuStates[menu]}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={Boolean(menuStates[menu])}
      onClose={() => handleMenuClose(menu)}
      sx={{ mt: 1 }}
    >
      <MenuItem onClick={() => handleMenuClose(menu)}>{menu} 1</MenuItem>
      <MenuItem onClick={() => handleMenuClose(menu)}>{menu} 2</MenuItem>
      {/* Add more menu items as needed */}
    </Menu>
  );

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [searchPeopleModalOpen, setSearchPeopleModalOpen] = useState(false);
  const [myTeamModalOpen, setMyTeamModalOpen] = useState(false);

  const handleOpenInviteModal = () => {
    setInviteModalOpen(true);
    handleMenuClose('teams'); // Close the teams menu
  };

  const handleCloseInviteModal = () => {
    setInviteModalOpen(false);
  };

  const handleOpenCreateTeamModal = () => {
    setCreateTeamModalOpen(true);
    handleMenuClose('teams'); // Close the teams menu
  };

  const handleCloseCreateTeamModal = () => {
    setCreateTeamModalOpen(false);
  };

  const handleOpenSearchPeopleModal = () => {
    setSearchPeopleModalOpen(true);
    handleMenuClose('teams'); // Close the teams menu
  };

  const handleCloseSearchPeopleModal = () => {
    setSearchPeopleModalOpen(false);
  };

  const handleOpenMyTeamModal = () => {
    setMyTeamModalOpen(true);
    handleMenuClose('teams'); // Close the teams menu
  };

  const handleCloseMyTeamModal = () => {
    setMyTeamModalOpen(false);
  };

  const navigateToCreateProject = () => {
    navigate('/dashboard/private-projects');
  };

  const renderTeamsMenu = () => (
    <>
      <Menu
        id="menu-teams"
        anchorEl={menuStates.teams}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(menuStates.teams)}
        onClose={() => handleMenuClose('teams')}
        sx={{
          mt: 1,
          '& .MuiPaper-root': { // This targets the paper component inside the menu
            minWidth: '220px', // Minimum width of the menu
            backgroundColor: '#fafafa', // Background color of the menu
            boxShadow: '0px 8px 16px rgba(0,0,0,0.1)', // Custom box shadow for the dropdown
            borderRadius: '8px', // Rounded corners for the dropdown
            '.MuiMenuItem-root': { // This targets all menu items
              padding: '12px 16px', // Padding inside each menu item
              '&:hover': {
                backgroundColor: '#f0f0f0', // Background color on hover
              },
              '& .MuiSvgIcon-root': { // This targets icons inside menu items
                marginRight: '8px', // Margin right for icons
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleOpenMyTeamModal}>
          <GroupIcon />
          My teams (12 members)
        </MenuItem>
        <MenuItem onClick={handleOpenInviteModal}>
          <GroupAddIcon />
          Invite people to TaskBrick
        </MenuItem>
        <MenuItem onClick={handleOpenCreateTeamModal}>
          <GroupIcon />
          Create a Team
        </MenuItem>
        <MenuItem onClick={handleOpenSearchPeopleModal}>
          <SearchIcon />
          Search people and teams
        </MenuItem>
      </Menu>
  
      {/* Modals */}
      <InvitePeopleModal open={inviteModalOpen} onClose={handleCloseInviteModal} />
      <CreateTeamModal open={createTeamModalOpen} onClose={handleCloseCreateTeamModal} />
      <SearchPeopleModal open={searchPeopleModalOpen} onClose={handleCloseSearchPeopleModal} />
      <MyTeamModal open={myTeamModalOpen} onClose={handleCloseMyTeamModal} />
    </>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: currentTheme.bgColor, color: currentTheme.textColor }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
        {/* Left section */}
        <Box>
          <Button sx={{ fontSize: { xs: '10px', sm: '12px' }, mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }} color="inherit" onClick={(e) => handleMenuClick(e, 'projects')}>
          Tasks
          </Button>
          {renderMenu('projects')}

          <Button sx={{ fontSize: { xs: '10px', sm: '12px' }, mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }} color="inherit" onClick={(e) => handleMenuClick(e, 'filters')}>
            Filters
          </Button>
          {renderMenu('filters')}

          <Button sx={{ fontSize: { xs: '10px', sm: '12px' }, mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }} color="inherit" onClick={(e) => handleMenuClick(e, 'teams')}>
            Teams
          </Button>
          {renderTeamsMenu()}

          <Button sx={{ fontSize: { xs: '10px', sm: '12px' }, mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }} color="inherit" onClick={(e) => handleMenuClick(e, 'myspace')}>
            My Space
          </Button>
          {renderMenu('myspace')}

          <Button  variant="contained" color="primary" sx={{ fontSize: { xs: '10px', sm: '12px' }, mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }}  onClick={navigateToCreateProject} >
            Create Project
          </Button>
        </Box>
        {/* Center section - Search input */}
        <Box sx={{ flexGrow: 1, mx: 2 }}>
          <Box sx={{
            position: 'relative',
            backgroundColor: currentTheme.searchBgColor || 'inherit',
            borderRadius: '4px',
            '&:hover': { backgroundColor: currentTheme.searchHoverBgColor || 'inherit' },
            width: '100%'
          }}>
            <IconButton sx={{ p: '10px', color: currentTheme.iconColor, position: 'absolute', pointerEvents: 'none' }}>
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{
                pl: '40px',
                width: '100%',
                border: '1px solid',
                borderColor: currentTheme.borderColor || 'rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                color: currentTheme.textColor,
                backgroundColor: currentTheme.searchBackgroundColor || '#fff',
                '&:hover': {
                  borderColor: currentTheme.borderHoverColor || 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused': {
                  borderColor: currentTheme.borderFocusColor || currentTheme.primaryColor || 'blue',
                  boxShadow: `0 0 0 2px ${currentTheme.borderFocusShadow || 'rgba(0, 0, 0, 0.1)'}`,
                },
              }}
              placeholder="Search……"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Box>
        </Box>

        {/* Right section - Notifications, Settings, and Profile */}
        <Box>
          <IconButton
            size="large"
            edge="end"
            onClick={(e) => handleMenuClick(e, 'notifications')}
            sx={{ color: currentTheme.iconColor }}
          >
            <NotificationsNoneOutlinedIcon />
          </IconButton>
          {renderMenu('notifications')}

          <IconButton
            size="large"
            edge="end"
            onClick={(e) => handleMenuClick(e, 'settings')}
            sx={{ color: currentTheme.iconColor }}
          >
            <Settings />
          </IconButton>
          {renderMenu('settings')}

          <IconButton size="large" edge="end" color="inherit" onClick={(e) => handleMenuClick(e, 'profile')}>
            <img src={Hero} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          </IconButton>
          {renderMenu('profile')}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default DashboardHeader;
