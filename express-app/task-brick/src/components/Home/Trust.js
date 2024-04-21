import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import FlutterwaveIcon from '../../assets/images/FlutterwaveIcon.svg';
import RelumeIcon from '../../assets/images/RelumeIcon.svg';
import PiggyvestIcon from '../../assets/images/Piggyvest.svg';
import GooglePayIcon from '../../assets/images/GooglePay.svg';

//import TaskSchedule from '../../assets/images/TaskSchedule.png';

const Trust = () => {
  const companies = [
    { name: 'Flutterwave', icon: FlutterwaveIcon },
    { name: 'Relume', icon: RelumeIcon },
    { name: 'Piggyvest', icon: PiggyvestIcon },
    { name: 'Google Pay', icon: GooglePayIcon },
  ];

  // Inline SVG for the wave pattern
  const wavePatternSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fill="#e3f2fd" fill-opacity="1" d="M0,64L60,58.7C120,53,240,43,360,80C480,117,600,203,720,208C840,213,960,139,1080,117.3C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1200,320,1080,320,960,320C840,320,720,320,600,320C480,320,360,320,240,320C120,320,60,320,0,320Z"></path>
    </svg>
  `;

  return (
    <Box sx={{ position: 'relative', py: 5, overflow: 'hidden', marginBottom: 15, }}>
      <Box
        component="div"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0,
          transform: 'rotate(10deg)', // Flip the wave
          transformOrigin: '50% 50%',

          '& svg': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'rotate(180deg)',
          },
        }}
      >
        <Box
          component="div"
          dangerouslySetInnerHTML={{ __html: wavePatternSVG }}
          sx={{ position: 'relative', display: 'block', width: 'calc(100% + 1.2px)', height: '430px' }}
        />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 8, fontSize: '1.5rem' }}>
          We are Trusted by the world's best companies
        </Typography> 
        <Grid container justifyContent="center" alignItems="center" spacing={16}>
          {companies.map((company, index) => (
            <Grid item key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2 }}>
              <Box
                component="img"
                src={company.icon}
                alt={company.name}
                sx={{ width: 'auto', height: 70, mb: 1 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.275rem' }}>
                {company.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Trust;
