
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardActionArea, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import backgroundImage from '../../assets/images/taskScheduler.png';
import agileManagementTemplateImage from '../../assets/images/taskScheduler.png';
import bugQueuesImage from '../../assets/images/taskScheduler.png';
import productBriefImage from '../../assets/images/taskbrick.png';
import simpleSprintsImage from '../../assets/images/taskbrick.png';
import roadmapTimelineImage from '../../assets/images/taskbrick.png';

const cardsData = [
    { image: backgroundImage, title: 'Background Image', link: '/template-one'  },
    { image: agileManagementTemplateImage, title: 'Agile Management Template', link: '/template-two'  },
    { image: bugQueuesImage, title: 'Bug Queues', link: '/template-three'  },
    { image: productBriefImage, title: 'Product Brief', link: '/template-four'  },
    { image: simpleSprintsImage, title: 'Simple Sprints', link: '/template-five'  },
    { image: roadmapTimelineImage, title: 'Roadmap Timeline', link: '/template-six'  },  
];

const CardGrid = () => {
    return (
      <Box sx={{ maxWidth: 1500, margin: 'auto', flexGrow: 1, mt: '180px', backgroundColor: '#3a5a40', borderRadius: '80px', 
      padding: '40px',  background: 'linear-gradient(45deg, #FFF6FA 30%, #FFF6FA 90%)',  }}>
        <Box sx={{ maxWidth: 1100, margin: 'auto', flexGrow: 1, mt: '180px', mt: '80px' }}>
        <Typography
            variant="h4"
            gutterBottom
            sx={{
                textAlign: 'center', 
                fontWeight: 'bold', 
                color: '#3a5a40', 
                my: 4, 
                textTransform: 'uppercase', 
                letterSpacing: 2, 
                lineHeight: 1.2, 
            }}
            >
            QuickStart with our Templates
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {cardsData.map((card, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ maxWidth: 345, flexGrow: 1, flexBasis: '100%' }}>
                    <CardActionArea component={Link} to={card.link}>
                        <CardMedia
                        component="img"
                        height="140"
                        image={card.image}
                        alt={card.title}
                />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      </Box>
    );
  };
  
  export default CardGrid;
  