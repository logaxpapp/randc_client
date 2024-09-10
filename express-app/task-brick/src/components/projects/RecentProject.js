import React, { useEffect } from 'react';
import { Paper, Typography, Box, Button, Grid } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { styled } from '@mui/material/styles';
import useThemeSwitcher from '../themes/useThemeSwitcher';

import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import CustomCircularProgress from '../global/CustomCircularProgress';
import { fetchTasks, setSelectedIssueId } from '../../features/tasks/taskSlice';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function RecentProject() {
  const { currentTheme } = useThemeSwitcher();
  const dispatch = useDispatch();
  const { tasks, status: fetchStatus, error } = useSelector((state) => state.tasks);
  const tenantId = useSelector((state) => state.auth.user?.tenantId);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!tenantId) {
      toast.error('Tenant ID not found. Please log in again.');
      return;
    }
    dispatch(fetchTasks({ tenantId }));
  }, [dispatch, tenantId]);

  useEffect(() => {
    if (tasks.length > 0) {
      dispatch(setSelectedIssueId(tasks[0]._id));
    }
  }, [dispatch, tasks]);

  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const priorityCounts = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  const priorityColors = [
    'rgba(255, 99, 132, 0.2)', // High
    'rgba(54, 162, 235, 0.2)', // Medium
    'rgba(255, 206, 86, 0.2)', // Low
    'rgba(75, 192, 192, 0.2)', // None
    'rgba(153, 102, 255, 0.2)', // Critical
    'rgba(255, 159, 64, 0.2)', // Blocker
    'rgba(199, 199, 199, 0.2)', // Major
    'rgba(83, 102, 255, 0.2)', // Minor
    'rgba(40, 159, 64, 0.2)', // Trivial
    'rgba(255, 99, 132, 0.2)' // Urgent
  ];
  
  const priorityBorderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 199, 1)',
    'rgba(83, 102, 255, 1)',
    'rgba(40, 159, 64, 1)',
    'rgba(255, 99, 132, 1)'
  ];
  

  const doughnutData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Task Status',
        data: Object.values(statusCounts),
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
    labels: Object.keys(priorityCounts),
    datasets: [{
      label: 'Task Priority',
      data: Object.values(priorityCounts),
      backgroundColor: Object.keys(priorityCounts).map((_, index) => priorityColors[index % priorityColors.length]), // Cycle through colors if more priorities than colors
      borderColor: Object.keys(priorityCounts).map((_, index) => priorityBorderColors[index % priorityBorderColors.length]),
      borderWidth: 1
    }]
  };
  

  const options = {
    maintainAspectRatio: false,
    legend: {
      labels: {
        fontColor: currentTheme.textColor,
      },
    },
  };

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
          Good Morning, {user?.firstName}!
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
