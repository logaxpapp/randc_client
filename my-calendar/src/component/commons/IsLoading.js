import React from 'react';
import { ImSpinner2 } from 'react-icons/im'; // This is a spinning icon from react-icons
import 'animate.css'; // Optional: for more advanced animations

const IsLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <ImSpinner2 className="animate-spin text-4xl text-blue-600 animate__animated animate__bounce" /> 
      {/* Using animate.css for extra bounce effect */}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default IsLoading;
