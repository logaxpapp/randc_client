import React from 'react';
import { IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import { useTheme } from '@mui/material/styles';
import { themes } from './themes';
import useThemeSwitcher from './useThemeSwitcher';

const ThemeSelector = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentTheme, setTheme } = useThemeSwitcher();
  const muiTheme = useTheme();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (themeName) => {
    setTheme(themeName);
    handleClose();
  };

  return (
    <div>
      <Tooltip title="Change Theme">
        <IconButton onClick={handleOpen} sx={{ color: currentTheme.primaryColor }}>
          <PaletteIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: currentTheme.bgColor,
            color: currentTheme.textColor,
          },
        }}
      >
        <Typography variant="h6" sx={{ p: 1, color: currentTheme.primaryColor }}>
          Pick Theme
        </Typography>
        <Divider sx={{ bgcolor: currentTheme.textColor }} />
        {themes.map((theme) => (
          <MenuItem
            key={theme.name}
            selected={theme.name === currentTheme.name}
            onClick={() => handleThemeChange(theme.name)}
            sx={{ 
              backgroundColor: theme.name === currentTheme.name ? muiTheme.palette.action.selected : 'none',
              '&:hover': {
                backgroundColor: muiTheme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon>
              <Tooltip title={theme.description}>
                <PaletteIcon sx={{ color: theme.primaryColor }} />
              </Tooltip>
            </ListItemIcon>
            <ListItemText 
            primary={theme.name} 
            sx={{
              '.MuiTypography-root': { // Targets the Typography component within ListItemText
                fontSize: '0.675rem', // Reduces the font size
                textTransform: 'uppercase', // Changes the text transform to uppercase
                letterSpacing: 2, // Changes the letter spacing to 2px
                lineHeight: 1.2, // Changes the line height to 1.2  

              }
            }} 
          />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ThemeSelector;
