import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, ListSubheader, Box, Typography} from '@mui/material';
import { MdOutlineCancel, MdOutlineMenu, MdExpandLess, MdExpandMore } from 'react-icons/md';
import useThemeSwitcher from '../themes/useThemeSwitcher';
import { links } from './Links';
import ThemeSelector from '../themes/ThemeSelector';
import { useStateContext } from '../../context/ContextProvider';


const Sidebar = () => {
  const { activeMenu, setActiveMenu } = useStateContext();
  const { currentTheme } = useThemeSwitcher();
  const [openDropdown, setOpenDropdown] = useState({});

  const toggleDrawer = () => {
    setActiveMenu(!activeMenu);
  };

  const handleClick = (title) => {
    setOpenDropdown(prevOpenDropdown => ({
      ...prevOpenDropdown,
      [title]: !prevOpenDropdown[title]
    }));
  };


  return (
    <div style={{ backgroundColor: currentTheme.bgColor, minHeight: '120vh' }}>
    <IconButton
        onClick={toggleDrawer}
        sx={{
          color: currentTheme.iconColor,
          position: 'absolute',
          top: 0,
          left: activeMenu ? 150 : 150, // Adjust based on the sidebar width when open
          margin: '1rem',
          zIndex: 1300, // Ensure it is above the Drawer's z-index
         
          '&:hover': {
            backgroundColor: currentTheme.secondaryColor,
            color: currentTheme.primaryColor,
            transform: 'scale(1.1)',
            transition: 'all 0.3s ease-in-out',         
          },
        }}
      >
        {/* Toggle between icons based on activeMenu */}
        {activeMenu ? <MdOutlineCancel /> : <MdOutlineMenu />}
      </IconButton>
    <Drawer
      variant="permanent"
      anchor="left"
      onClose={toggleDrawer}
      open={activeMenu}
      sx={{
        width: activeMenu ? 240 : 0,
        '& .MuiDrawer-paper': {
          width: activeMenu ? 240 : 0,
          backgroundColor: currentTheme.bgColor,
          position: 'relative',
        },
      }}
    >
       <List sx={{ mt: 2 }}>
        <ListSubheader component="div" sx={{ color: currentTheme.textColor,  backgroundColor: currentTheme.bgColor }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Task<span style={{ color: currentTheme.primaryColor }}>Brick</span></p> 
        </ListSubheader>
        {links.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem button onClick={() => handleClick(item.title)}>
              <ListItemText primary={item.title} sx={{ fontWeight: 'bold', color: currentTheme.textColor }} />
              {openDropdown[item.title] ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={openDropdown[item.title]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.links.map((link) => (
                  <ListItem 
                    button 
                    key={link.name} 
                    component={NavLink} 
                    to={`${link.url}`} 
                    onClick={toggleDrawer}
                    sx={{ pl: 4 }} // Indent the sub-items for better visual hierarchy
                  >
                    <ListItemIcon sx={{ color: currentTheme.iconColor }}>
                      {link.icon}
                    </ListItemIcon>
                    <ListItemText sx={{ color: currentTheme.textColor }} primary={link.name} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
      <Box
      sx={{
        display: 'flex', // Use flexbox to align items in a row
        alignItems: 'center', // Center-align items vertically
        justifyContent: 'space-between', // Space out the title and selector
        p: 2, // Add some padding
        bgcolor: currentTheme.bgColor, // Use the current theme's background color
        color: currentTheme.textColor, // Use the current theme's text color
        borderBottom: currentTheme.borderBottom, // Add a border to the bottom
        position: 'absolute', // Make the sidebar sticky to the top of the screen
        top: 0,
       
        zIndex: 1000,
      }}
    >
      <Typography variant="subtitle1" sx={{ color: currentTheme.linkColor, mr: 2 }}>
        Theme Customizer
      </Typography>

      <ThemeSelector />
    </Box>
    </Drawer>
    </div>
  );
};

export default Sidebar;