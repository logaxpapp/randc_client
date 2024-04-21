import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardActionArea } from '@mui/material';

// Images
import bugQueuesImage from '../../assets/images/taskScheduler.png';
import productBriefImage from '../../assets/images/taskbrick.png';
import simpleSprintsImage from '../../assets/images/taskScheduler.png';
import roadmapTimelineImage from '../../assets/images/taskbrick.png';
import './heroSection.css';

const InsightComponent = () => {
  const [selectedOption, setSelectedOption] = useState('Progress Tracking');

  const imageMap = {
    'Progress Tracking': bugQueuesImage,
    'Workflow Analysis': productBriefImage,
    'Team Momentum': simpleSprintsImage,
    'Task Lifecycle': roadmapTimelineImage,
  };

  return (
    <Box sx={{
      maxWidth: '100%',
      mx: 'auto',
      mt: '180px',
      p: 5,
      bgcolor: '#e9f5db', 
      borderRadius: '16px',
      maxWidth: '1200px', // Adjust the max width as needed
      boxShadow: 3,
      '& .MuiCard-root': {
        bgcolor: 'transparent', // Remove specific card background
        boxShadow: 'none'
      }
    }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
      Discover actionable insights with live reporting.
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, maxWidth: '800px', mx: 'auto' }}>
      Get clear insights on projects with automated dashboards that highlight team progress and project capacity.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {Object.keys(imageMap).map((option) => (
          <Button
            key={option}
            variant={selectedOption === option ? 'contained' : 'text'}
            onClick={() => setSelectedOption(option)}
            sx={{ margin: '4px' }} 
          >
            {option}
          </Button>
        ))}
      </Box>

      <Card sx={{ maxWidth: '100%', overflow: 'hidden' }}>
        <CardActionArea>
          <CardMedia
            component="img"
            image={imageMap[selectedOption]}
            alt={selectedOption}
            sx={{ maxHeight: '450px', width: 'auto', mx: 'auto' }} 
          />
        </CardActionArea>
      </Card>

      <Typography variant="body2" sx={{ textAlign: 'center', mt: 4 }}>
      Optimize your workflow by identifying team capacity and bottlenecks. Monitor task durations from initiation to completion.
      </Typography>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button variant="contained" color="primary">
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default InsightComponent;
