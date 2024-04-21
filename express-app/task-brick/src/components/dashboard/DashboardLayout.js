import React from 'react';
import { Grid, Paper } from '@mui/material';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import DashboardHeaderAdmin from './DashboardHeaderAdmin'; // Assuming you have this component
import useThemeSwitcher from '../themes/useThemeSwitcher';
import { useSelector } from 'react-redux'; // Import useSelector hook

const DashboardLayout = ({ children }) => {
  const { currentTheme } = useThemeSwitcher();  // Access the current theme
  const user = useSelector((state) => state.auth.user); // Access user info from Redux store

  // Apply the theme color as a background to the main content area
  const mainContentStyle = {
    backgroundColor: currentTheme.layoutColor,
    color: currentTheme.textColor,
    // Apply other styles based on the theme
    minHeight: '100vh',
    padding: '2px',
    margin: '2px',
    backgroundColor: currentTheme.layoutColor,
  };

  // Determine which header to render based on the user's role or admin flag
  const renderHeader = () => {
    if (user && (user.role === 'Admin' || user.admin)) {
      return <DashboardHeaderAdmin />;
    }
    return <DashboardHeader />;
  };

  return (
    <Grid container style={{ background: currentTheme.layoutColor, color: currentTheme.textColor }}>
      <Grid item>
        <Sidebar />
      </Grid>
      <Grid item xs>
        {renderHeader()}  {/* Conditionally render the header */}
        <Paper elevation={3} style={{ ...mainContentStyle }}>
          {children} {/* children will inherit the theme styles */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardLayout;
