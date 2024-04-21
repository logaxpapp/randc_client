import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import InputAdornment from '@mui/material/InputAdornment';

// Dummy image import, replace with your own imports
import sampleTask from '../../assets/images/hero.png';
import sampleTask2 from '../../assets/images/hero.png';
import sampleTask3 from '../../assets/images/hero.png';
import sampleTask4 from '../../assets/images/hero.png';
import sampleTask6 from '../../assets/images/hero.png';
import sampleTask7 from '../../assets/images/hero.png';
import sampleTask8 from '../../assets/images/hero.png';
import sampleTask9 from '../../assets/images/hero.png';
import sampleTask10 from '../../assets/images/hero.png';
import sampleTask11 from '../../assets/images/hero.png';

// Sample data for demonstration purposes
const samplePeople = [
  // Populate with your data
  { name: 'John Doe', role: 'Software Engineer', avatar: sampleTask }
  , { name: 'Jane Doe', role: 'Project Manager', avatar: sampleTask2 }
  , { name: 'Bob Smith', role: 'Software Engineer', avatar: sampleTask3 }
  , { name: 'Sarah Johnson', role: 'Project Manager', avatar: sampleTask4 }
];

const sampleTeams = [
  // Populate with your data
  { name: 'Team 1', members: samplePeople, avatar: sampleTask6 }
    , { name: 'Team 2', members: samplePeople, avatar: sampleTask7 }
    , { name: 'Team 3', members: samplePeople, avatar: sampleTask8 }
    , { name: 'Team 4', members: samplePeople, avatar: sampleTask9 }
    , { name: 'Team 5', members: samplePeople, avatar: sampleTask10 }
    , { name: 'Team 6', members: samplePeople, avatar: sampleTask11 }

];



const SearchPeopleModal = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogContent>
      <Box sx={{ padding: 4 }}>
  {/* Header section with buttons */}
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 2, // This adds space between the items
      marginBottom: 4, // This adds space below the header section
    }}
  >
    <TextField
      variant="outlined"
      placeholder="Search for people and teams"
      size="small"
      sx={{ flex: 1, marginRight: 2 }} // Flex grow to use available space, margin for spacing
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <Box sx={{ display: 'flex', gap: 1 }}> {/* Adds space between buttons */}
      <Button startIcon={<PeopleIcon />} variant="outlined">
        Manage users
      </Button>
      <Button startIcon={<GroupAddIcon />} variant="outlined">
        Create team
      </Button>
      <Button startIcon={<AddIcon />} variant="outlined">
        Add people
      </Button>
    </Box>
  </Box>



          {/* People section */}
          <Typography variant="h6">People</Typography>
          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            {samplePeople.map((person, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={person.avatar}
                      alt={person.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6">
                        {person.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {person.role}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button variant="text">More search options</Button>

          {/* Teams section */}
          <Typography variant="h6" sx={{ marginTop: 2 }}>Your teams</Typography>
          <Grid container spacing={2}>
            {sampleTeams.map((team, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={team.avatar}
                      alt={team.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6">
                        {team.name}
                      </Typography>
                      {/* Include any additional details for the team here */}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button variant="text">Browse all teams</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SearchPeopleModal;