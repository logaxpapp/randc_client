import taskImage from '../assets/images/hero.png';
import React from 'react';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';

function Profile() {
  return (
    <Grid container className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-40'>
      {[...Array(3)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={taskImage}
                alt="Task Manager"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
                  Task Manager
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Streamline your projects and tasks with TaskBrick, the intuitive management tool that adapts to your team's needs.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default Profile