import React from 'react';
import {
  Box, Typography, TextField, InputAdornment, IconButton, Grid, Card, CardMedia, Accordion, AccordionSummary,
  AccordionDetails, List, ListItem, ListItemText, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Dummy image import, replace with your own imports
import sampleImage from '../../assets/images/taskbrick4.png';

// Categories array
const categories = [
  { name: 'Creative & Design', count: 101 },
  { name: 'Engineering & Product', count: 130 },
    { name: 'Marketing & Sales', count: 80 },
    { name: 'Customer Service', count: 60 },
    { name: 'Human Resources', count: 40 },
    { name: 'Legal & Compliance', count: 30 },
    { name: 'Project Management', count: 20 },
    { name: 'Quality Assurance', count: 10 },
  // ... other categories
];

const TemplateDetailsComponent = () => {
  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 4, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2, marginTop: '40px', marginBottom: '40px' }}>
      <Grid container spacing={2}>
        {/* First Row: Search and Categories */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            id="search-templates"
            placeholder="Find template"
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <List>
            {categories.map((category, index) => (
              <ListItem key={index} sx={{ py: 1, px: 0 }}>
                <ListItemText primary={`${category.name} (${category.count})`} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={9}>
          <Typography variant="h5" gutterBottom>
            Bug & Issue Tracking
          </Typography>
          <Card>
            <CardMedia
              component="img"
              image={sampleImage}
              alt="Bug & Issue Tracking"
            />
          </Card>
          <Button variant="contained" color="primary" sx={{ my: 2 }}>
            Get Free Solution
          </Button>
        </Grid>

        {/* Second Row: Template Details */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Template details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Template details content goes here */}
            
              <Typography variant="body2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                
              </Typography>
            </AccordionDetails>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Template details</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {/* Template details content goes here */}
                <Typography variant="body2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Template details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Template details content goes here */}
            
              <Typography variant="body2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                
              </Typography>
            </AccordionDetails>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Template details</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {/* Template details content goes here */}
                <Typography variant="body2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Template details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Template details content goes here */}
            
              <Typography variant="body2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                
              </Typography>
            </AccordionDetails>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Template details</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {/* Template details content goes here */}
                <Typography variant="body2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TemplateDetailsComponent;
