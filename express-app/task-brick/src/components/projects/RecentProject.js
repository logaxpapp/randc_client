import React from 'react';
import { Paper, Typography, Box, Button, Grid } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { styled } from '@mui/material/styles';
import useThemeSwitcher from '../themes/useThemeSwitcher';

// Registering components for Chart.js



// Registering components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function RecentProject() {
  const { currentTheme } = useThemeSwitcher();

  // Dummy data for the chart
  const doughnutData = {
    labels: ['To Do', 'Concepting', 'Design', 'Testing', 'Launch'],
    datasets: [
      {
        label: 'Project Status',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [50, 75, 110, 100],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'New Tasks',
        data: [80, 100, 70, 90],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    maintainAspectRatio: false,
    legend: {
      labels: {
        fontColor: currentTheme.textColor,
      },
    },
  };

  // Function to render a chart with given parameters
  const renderChart = (ChartComponent, data, options) => (
    <Box className="relative h-64 w-full">
      <ChartComponent data={data} options={options} />
    </Box>
  );
  const WelcomeBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
  }));


  return (
    <Box className="p-6" style={{ backgroundColor: currentTheme.bgColor }}>
     <WelcomeBox className="mb-4">
        <Typography variant="h4" gutterBottom>
          Good Morning, Christopher
        </Typography>
        <Typography variant="subtitle1">
          Here's the latest update on your projects and tasks.
        </Typography>
      </WelcomeBox>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className="p-6" elevation={1}>
            <Typography variant="subtitle1" className="mb-2" style={{ color: currentTheme.textColor }}>
              Status Overview
            </Typography>
            {renderChart(Doughnut, doughnutData, options)}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="p-6" elevation={1}>
            <Typography variant="subtitle1" className="mb-2" style={{ color: currentTheme.textColor }}>
              Quarterly Tasks
            </Typography>
            {renderChart(Bar, barData, options)}
          </Paper>
        </Grid>
        {/* ... More Grid items for additional charts and features */}
      </Grid>
      <Box className="flex justify-between items-center bg-white p-4 rounded-md shadow-md mt-6">
        <Typography variant="h6">Recent Activities</Typography>
        <Button variant="contained" color="primary">
          Create an item
        </Button>
      </Box>
      <Box className="flex justify-between items-center bg-white p-4 rounded-md shadow-md mt-6">
        <Typography variant="h6">Teams</Typography>
        <Button variant="contained" color="primary">
          Invite Team Member
        </Button>
      </Box>
    </Box>
  );
}

export default RecentProject;
