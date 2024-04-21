import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  LinearProgress,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea
} from '@mui/material';

import useOutsideClick from './useOutsideClick';
import { useRef } from 'react';



import sampleTask from '../../assets/images/hero.png';
import sampleTask2 from '../../assets/images/hero.png';
import sampleTask3 from '../../assets/images/hero.png';
import sampleTask4 from '../../assets/images/hero.png';


const teamMembers = [
    { name: 'John Doe', role: 'Software Engineer', picture: sampleTask },
    { name: 'Jane Doe', role: 'Project Manager', picture: sampleTask2 },
    { name: 'Bob Smith', role: 'Software Engineer', picture: sampleTask3 },
    { name: 'Sarah Johnson', role: 'Project Manager', picture: sampleTask4 },
    { name: 'John Doe', role: 'Software Engineer', picture: sampleTask },
    { name: 'Jane Doe', role: 'Project Manager', picture: sampleTask2 },
]

const teamActivities = [
    { description: 'Created a new project', date: '2024-02-08T13:10:00Z' },
    { description: 'Created a new project', date: '2024-02-08T13:10:00Z' },
    { description: 'Created a new project', date: '2024-02-08T13:10:00Z' },
]

const teamProjects = [
    { name: 'Project 1', progress: 45, dueDate: '2024-02-08T13:10:00Z' },
    { name: 'Project 2', progress: 45, dueDate: '2024-02-08T13:10:00Z' },
    { name: 'Project 3', progress: 45, dueDate: '2024-02-08T13:10:00Z' },

];

const teamIssues = [
    { name: 'Issue 1', progress: 45, dueDate: '2024-02-08T13:10:00Z' },
    { name: 'Issue 2', progress: 45, dueDate: '2024-02-08T13:10:00Z' },
    { name: 'Issue 3', progress: 45, dueDate: '2024-02-08T13:10:00Z' },
]


const MyTeamModal = ({ open, onClose }) => {
    const [selectedIssueId, setSelectedIssueId] = useState(null);

    const modalRef = useRef();
    useOutsideClick(modalRef, onClose);
  
    if (!open) return null;
  
  
    const handleWorkOnIssue = (issueId) => {
      console.log(`Working on issue with ID: ${issueId}`);
      setSelectedIssueId(issueId);
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" ref={modalRef}>
        <DialogTitle>My Team</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {/* Team Members as Cards */}
              <Typography variant="h6" gutterBottom>Team Members</Typography>
              <Grid container spacing={2}>
                {teamMembers.map((member, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Card>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image={member.picture}
                          alt={member.name}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6">{member.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{member.role}</Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
  
            <Grid item xs={12} md={6}>
              {/* Recent Activities */}
              <Typography variant="h6" gutterBottom>Recent Activities</Typography>
              {teamActivities.map((activity, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="body1">{activity.description}</Typography>
                  <Typography variant="caption">{activity.date}</Typography>
                </Box>
              ))}
            </Grid>
          </Grid>
  
          {/* Team Projects */}
          <Typography variant="h6" gutterBottom>Team Projects</Typography>
          {teamProjects.map((project, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body1">{project.name}</Typography>
              <Box width="50%">
                <LinearProgress variant="determinate" value={project.progress} />
                <Typography variant="caption" display="block">{`Due date: ${project.dueDate}`}</Typography>
              </Box>
            </Box>
          ))}
          <Button color="primary">View all project activities</Button>
  
          {/* Issues Assigned to the Team */}
          <Typography variant="h6" gutterBottom>Issues Assigned</Typography>
          {teamIssues.map((issue, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body1">{issue.name}</Typography>
              <Button variant="outlined" onClick={() => handleWorkOnIssue(issue.id)}>Work On This</Button>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    );
  };
  
  export default MyTeamModal;