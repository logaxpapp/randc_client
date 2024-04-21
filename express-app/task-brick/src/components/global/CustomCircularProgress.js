import React from 'react';
import { CircularProgress } from '@mui/material';

const CustomCircularProgress = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '40vh',
      minWidth: '50vh',
      backgroundColor: '#F8FAFC', // Soft blue with moderate transparency
      color: 'white', // Text color for contrast
      borderRadius: '10px', // Optional: adds rounded corners
      padding: '20px', // Optional: adds some space inside the div
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: adds a subtle shadow effect
      backdropFilter: 'blur(5px)', // Optional: adds a blur effect to the background elements seen through the semi-transparent area
    }}>
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        <CircularProgress
          size={120}
          thickness={5}
          variant="indeterminate"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        <CircularProgress
          size={120}
          thickness={5}
          variant="indeterminate"
          style={{ position: 'absolute', top: 0, left: 0, animationDelay: '1s' }}
        />
        <CircularProgress
          size={120}
          thickness={5}
          variant="indeterminate"
          style={{ position: 'absolute', top: 0, left: 0, animationDelay: '2s' }}
        />
        <CircularProgress
          size={120}
          thickness={5}
          variant="indeterminate"
          style={{ position: 'absolute', top: 0, left: 0, animationDelay: '3s' }}
        />
        <h3 style={{ position: 'absolute', color: 'black', font: 'bold',  top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Loading...</h3>
      </div>
    </div>
  );
};

export default CustomCircularProgress;
