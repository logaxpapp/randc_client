import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear(); // dynamically sets the current year

  return (
    <footer className="bg-white text-gray-700 body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
      <p className="text-sm sm:ml-6 sm:mt-0 mt-4 border py-2 px-2 rounded-2xl bg-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" height="32px" width="32px" role="img" alt="Chat icon" class="tawk-min-chat-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M400 26.2c-193.3 0-350 156.7-350 350 0 136.2 77.9 254.3 191.5 312.1 15.4 8.1 31.4 15.1 48.1 20.8l-16.5 63.5c-2 7.8 5.4 14.7 13 12.1l229.8-77.6c14.6-5.3 28.8-11.6 42.4-18.7C672 630.6 750 512.5 750 376.2c0-193.3-156.7-350-350-350zm211.1 510.7c-10.8 26.5-41.9 77.2-121.5 77.2-79.9 0-110.9-51-121.6-77.4-2.8-6.8 5-13.4 13.8-11.8 76.2 13.7 147.7 13 215.3.3 8.9-1.8 16.8 4.8 14 11.7z"></path></svg>
        </p>
        <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
          <span className="ml-3 text-xl">LogaEvents</span>
        </a>

        
        <p className="text-sm text-gray-500 sm:ml-6 sm:mt-0 mt-4">© {year} LogaEvents —
          <a href="https://twitter.com/knyttneve" rel="noopener noreferrer" className="text-gray-600 ml-1" target="_blank">@logaevents</a>
        </p>
       
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <a className="mr-5 hover:text-gray-900">About</a>
          <a className="mr-5 hover:text-gray-900">Blog</a>
          <a className="mr-5 hover:text-gray-900">Jobs</a>
          <a className="mr-5 hover:text-gray-900">Press</a>
          <a className="mr-5 hover:text-gray-900">Accessibility</a>
          <a className="mr-5 hover:text-gray-900">Partners</a>
        </span>
      </div>
      <div className="bg-gray-100">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 text-sm text-center sm:text-left">Made with <FaHeart className="text-red-500 mx-1" /> by LogaEvents Team
          </p>
          <div className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
            <a className="text-blue-500">
              <FaFacebookF />
            </a>
            <a className="ml-3 text-pink-500">
              <FaInstagram />
            </a>
            <a className="ml-3 text-blue-500">
              <FaTwitter />
            </a>
            <a className="ml-3 text-black font-bold">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
