import React, { useState, useEffect } from 'react';
import { useWindowScroll } from 'react-use';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import IconButton from '@mui/material/IconButton';
import Zoom from '@mui/material/Zoom';

const ScrollToTop = () => {
  const { y: pageYOffset } = useWindowScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pageYOffset > 400) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [pageYOffset]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) {
    return false;
  }

  return (
    <Zoom in={visible}>
      <IconButton
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000,
        }}
        color="primary"
        aria-label="scroll back to top"
      >
        <ArrowUpwardIcon />
      </IconButton>
    </Zoom>
  );
};

export default ScrollToTop;
