import React from 'react';
import { Typography, Grid, useTheme } from '@mui/material';
import useThemeSwitcher from '../themes/useThemeSwitcher'; 

const Header = ({ category, title }) => {
  const theme = useTheme(); // Access the MUI theme
  const { currentTheme } = useThemeSwitcher();  // Access the custom theme

  return (
    <Grid container justifyContent="space-between" alignItems="center" sx={{
      padding: theme.spacing(1),
      backgroundColor: currentTheme.bgColor, // Use the background color from the current theme
      color: currentTheme.textColor, // Optional: set text color based on the current theme
    }}>
      <Grid item>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 'bold',
            // color: theme.palette.text.secondary, // You may want to use currentTheme.textColor if you want consistency with your theme
            textTransform: 'uppercase',
            padding: theme.spacing(1),
          }}
        >
          {category}
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            // color: theme.palette.text.primary, // Similarly, consider currentTheme.textColor for theme consistency
          }}
        >
          {title}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Header;
