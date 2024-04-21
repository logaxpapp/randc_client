import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear(); // dynamically sets the current year

  return (
    <footer className="bg-white text-gray-700 body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
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
