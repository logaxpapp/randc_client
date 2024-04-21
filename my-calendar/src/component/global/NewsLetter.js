import React, { useState } from 'react';
import { FaRegNewspaper, FaBell, FaRegLifeRing } from 'react-icons/fa';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle the email subscription logic
    console.log(email);
    // Reset the input after submitting
    setEmail('');
  };

  return (
    <div className="bg-gray-800 mt-40 text-white bg-gradient-to-br h-80 from-slate-800 to-orange-300 p-8 rounded-lg  mx-auto flex justify-between items-center">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">Subscribe to our newsletter.</h2>
        <p className="mb-4">
          Get the latest news and updates right in your inbox.
        </p>
        <form onSubmit={handleSubscribe} className="flex w-1/2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 mr-2 rounded focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300"
          >
            Subscribe
          </button>
        </form>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center mb-2">
          <FaRegNewspaper className="mr-2" />
          Weekly articles
        </div>
        <div className="flex items-center mb-2">
          <FaBell className="mr-2" />
          Latest alerts
        </div>
        <div className="flex items-center">
          <FaRegLifeRing className="mr-2" />
          24/7 support
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
