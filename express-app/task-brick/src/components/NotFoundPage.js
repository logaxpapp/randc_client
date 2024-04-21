import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-green-100">
      <h1 className="text-8xl font-bold text-gray-800">404</h1>
      <p className="text-gray-600 text-2xl md:text-3xl font-light mb-8">
        Sorry, this page isn't available.
      </p>
      <a 
        href="/"
        className="px-6 py-2 text-sm font-semibold rounded-md text-white bg-blue-500 hover:bg-blue-600"
      >
        Go back home
      </a>
    </div>
  );
};

export default NotFoundPage;
