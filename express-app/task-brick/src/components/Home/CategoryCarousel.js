

import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, CardActionArea, Grid, useTheme, useMediaQuery } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

import  imageOne from '../../assets/images/taskbrick.png';
import  imageTwo from '../../assets/images/template2.png'; 
import  imageThree from '../../assets/images/taskScheduler.png';
import  imageFour from '../../assets/images/taskbrick.png';
import  imageFive from '../../assets/images/taskbrick3.png';
import  imageSix from '../../assets/images/tasklist.png';
import  imageSeven from '../../assets/images/taskbrick4.png';
import  imageEight from '../../assets/images/taskbrick.png';

const categories = [
  { title: 'Agile Tools', img: imageOne },
  { title: 'Templates', img: imageTwo },
  { title: 'Insights', img: imageThree },
  { title: 'Task Scheduler', img: imageFour },
  { title: 'Task Brick', img: imageFive },
  { title: 'Task List', img: imageSix },
  { title: 'Task Brick', img: imageSeven },
  { title: 'Task Brick', img: imageEight },
];


const CategoryCard = ({ category }) => (
  <Grid item xs={6} sm={4} md={3} lg={3}>
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          image={category.img}
          alt={category.title}
          sx={{
            height: 380, // fixed height for all images
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%', // fixed width for all images
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.3s ease-in-out',
            }

          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {category.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);

const CategoryCarousel = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  // Determine the number of slides to show based on the screen width
  const slidesToShow = isLargeDesktop ? 4 : isDesktop ? 3 : 2;

  // Prepare the slides based on the number of slides to show
  const getSlides = () => {
    let slides = [];
    for (let i = 0; i < categories.length; i += slidesToShow) {
      slides.push(
        <Grid container spacing={2} key={i}>
          {categories.slice(i, i + slidesToShow).map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </Grid>
      );
    }
    return slides;
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#e9ecef', maxWidth: '80%', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Get inspired with LogaXP
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Read thousands of professional articles
      </Typography>
      <Carousel
        fullHeightHover={false}
        navButtonsAlwaysVisible={isDesktop}
        navButtonsProps={{
          'aria-label': 'Previous',
          style: {
            backgroundColor: 'BLACK',
            color: 'white',
            borderRadius: '50%',
            padding: '2px',
            marginLeft: '10px',
            marginRight: '10px',
          }
        }}
        indicators={!isDesktop}
        animation="slide" // This prop changes the animation to slide from right to left
        swipe={true} // This prop allows swipe functionality
        indicatorsColor="primary"
      >
        {getSlides()}
      </Carousel>
    </Box>
  );
};

export default CategoryCarousel;