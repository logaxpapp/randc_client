import React from 'react';
import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import CheckedIcon from '../../assets/images/CheckedIcon.svg';
import TaskSchedule from '../../assets/images/taskScheduler.png';

const FeatureList = () => {
  const features = [
    'TRACK GOALS',
    'SET MILESTONES',
    'COLLABORATE ON DOCS',
    'AUTOMATE BUSY WORK',
    'CUSTOMIZE TASKS',
    'CREATE CUSTOM FIELDS',
    'WHITEBOARD IDEAS',
  ];

  return (
    <List>
      {features.map((feature, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <img src={CheckedIcon} alt="Checkmark" style={{ width: '24px', height: '24px' }} />
          </ListItemIcon>
          <ListItemText primary={feature} />
        </ListItem>
      ))}
    </List>
  );
};

const TaskProgressCard = () => (
  <Card sx={{ maxWidth: 345, bgcolor: 'background.paper', borderRadius: '16px' }}>
    <CardContent>
      <Box component="img" src={TaskSchedule} alt="Task Schedule" sx={{ width: '100%', height: 'auto' }} />
      <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', mt: 2 }}>
        Launch TaskBrick App
      </Typography>
      <Typography variant="body2">
        With our app, you can easily track your team's progress and achieve your goals. 
      </Typography> 
    </CardContent>
  </Card>
);

const AgileToolsComponent = () => {
  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden', margin: 20,  px: 3, py: 9, bgcolor: 'white', borderRadius: '24px', boxShadow: 3, maxWidth: 1245, margin: '0 auto', backgroundColor: '#edf2fb'}}>
       <ListItemIcon>
            <img src={CheckedIcon} alt="Checkmark" style={{ width: '84px', height: '64px', marginLeft: '1100px' }} />
          </ListItemIcon>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h1" gutterBottom>
            We bring your office home.
          </Typography>
          <Grid container spacing={1} ml={15}>
          <FeatureList />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <TaskProgressCard />
        </Grid>
      </Grid>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button variant="contained" color="primary">
          Explore the platform
        </Button>
      </Box>
    </Box>
  );
};

export default AgileToolsComponent;
