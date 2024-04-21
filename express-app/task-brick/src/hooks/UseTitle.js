import { useEffect } from 'react';

const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    
    // Cleanup function to reset the title back to the previous state
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default useTitle;
