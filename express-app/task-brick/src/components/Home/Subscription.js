import React, { useState } from 'react';
import { Button, Slider, Typography } from '@mui/material';

const Subscription = () => {
  const [sliderValue, setSliderValue] = useState(30);
  const enterprisePrice = 33.33 + (Math.ceil(sliderValue / 100) - 1) * 10;

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const sliderThumbStyle = {
    // Add custom styles or classes for the thumb here
    '& .MuiSlider-thumb': {
      backgroundColor: '#blue', // The outer circle color
      position: 'relative',
      height: 48, // Example size, adjust as needed
      width: 48, // Example size, adjust as needed
      // Add an animation that changes the boxShadow
      animation: 'pulse 2s infinite',
      // Pseudo-element for the inner circle
      '&::after': {
        content: '""', // Necessary for pseudo-elements
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%', // Inner circle size relative to the parent thumb
        height: '80%', // Inner circle size relative to the parent thumb
        backgroundColor: '#fff', // Start with white color
        borderRadius: '50%', // Make it round
        // Transition effect for color change
        transition: 'background-color 0.3s ease',
      },
    },
    '& .MuiSlider-track': {
        height: 8, // Example size, adjust as needed
      },
      // Adjust the rail size
      '& .MuiSlider-rail': {
        height: 8, // Example size, adjust as needed
      },
    // Change the inner circle color on hover
    '& .MuiSlider-thumb:hover::after': {
      backgroundColor: 'lightblue', // Transition to light blue on hover
    },
    // Define keyframes for the pulse animation
    '@keyframes pulse': {
      '0%, 100%': {
        boxShadow: '0 0 0 0px rgba(0, 123, 255, 0.5)',
      },
      '50%': {
        boxShadow: '0 0 0 10px rgba(0, 123, 255, 0)',
      },
    },
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* Slider Section */}
      <div className="my-10 justify-between max-w-3xl mx-auto font-bold">
        <Typography variant="h5" className="text-center">
          Slide to select your team size and see Enterprise pricing
        </Typography>
        <Slider
          defaultValue={30}
          step={10}
          marks
          min={5}
          max={1000}
          valueLabelDisplay="auto"
          onChange={handleSliderChange}
          sx={{ ...sliderThumbStyle }} 
          className="w-full"
        />
      </div>

     

      {/* Pricing Cards */}
      <div className="flex flex-wrap justify-center -mx-4">
        {/* Basic Plan */}
        <div className="p-4 md:w-1/3">
          <div className="h-full bg-blue-500 p-8 rounded">
            <Typography variant="h5" className="text-xl text-white font-semibold mb-3">Basic</Typography>
            <Typography variant="h4" className="text-4xl text-white font-bold mb-3">Free<span className="text-lg">/mo.*</span></Typography>
            <Typography className="text-sm text-white mb-8">5 Team Members</Typography>
            <Typography className="text-xs  mb-8">* Billed yearly, prepaid at $0/yr.</Typography>
            <Button variant="contained" color="secondary" className="mt-8">Learn More</Button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="p-4 md:w-1/3">
          <div className="h-full bg-purple-500 p-8 rounded">
            <Typography variant="h5" className="text-5xl text-white font-semibold mb-8">Premium</Typography>
            <Typography variant="h4" className="text-4xl text-white font-bold mb-3">$23.33<span className="text-lg">/mo.*</span></Typography>
            <Typography className="text-sm mb-3 text-white ">20 Team Members</Typography>
            <Typography className="text-xs">* Billed yearly, prepaid at $280/yr.</Typography>
            <Button variant="contained" color="secondary" className="mt-8">Learn More</Button>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className="p-4 md:w-1/3">
          <div className="h-full bg-pink-500 p-8 rounded">
            <Typography variant="h5" className="text-2xl text-white font-semibold mb-3">Enterprise</Typography>
            <Typography variant="h4" className="text-4xl text-white font-bold mb-4">${enterprisePrice.toFixed(2)}<span className="text-lg">/mo.*</span></Typography>
            <Typography className="text-sm mb-3 text-white">Unlimited Members</Typography>
            <Typography className="text-xs">* Billed yearly, prepaid at ${(enterprisePrice * 12).toFixed(2)}/yr.</Typography>
            <Button variant="contained" color="secondary" className="mt-8">Learn More</Button>
          </div>
        </div>
      </div>

      <Typography variant="h2" className="text-5xl font-bold text-center my-10">
        Streamline Your Team's Workflow
      </Typography>
      <Typography className="text-lg text-center mb-18">
        Elevate your project management with a tool designed for clarity, efficiency, and collaboration.
      </Typography>
      <div className="text-center">
        <Button variant="contained" color="primary" className="text-lg mt-8">Start Your Free Trial</Button>
      </div>
    </div>
  );
};

export default Subscription;
