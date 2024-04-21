import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import Logo from '../../assets/images/logo.png';

const products = [
  { text: 'Loga Systems', href: '#' },
  { text: 'Time & Attendance', href: '#' },
  { text: 'Task Manager', href: '#' },
  { text: 'LogaXP HR', href: '#' },
  { text: 'Appraisal Hub', href: '#' },
  { text: 'Appointments Booking', href: '/' },
  { text: 'LogaXP Leaves', href: '#' },
  { text: 'Reimbux', href: '#' },
  { text: 'OnOffBoard', href: '#' },
  { text: 'Smart Hire', href: '#' },
  { text: 'Automations', href: '#' },
];

const site = [
  { text: 'About Us', url: '/about_us' },
  { text: 'Career', url: '/career' },
  { text: 'Management', url: '/management' },
  { text: 'Contact', url: '/contact' },
];

const businessTypes = [
  'Blog', 'Food & Beverages', 'Bars & Breweries', 'Fast Casual', 'Quick Services',
  'Barbershop', 'Full Services', 'Hair Salon', 'Tattoo & Piercing', 'Health & Fitness',
  'Professional Services', 'Large Businesses', 'Home & Repairs',
];

const socialLinks = [
    { Icon: FaLinkedin, href: '/', label: 'LinkedIn' },
    { Icon: FaTwitter, href: 'https://twitter.com/LogaXp', label: 'Twitter' },
    { Icon: FaInstagram, href: '/', label: 'Instagram' },
    { Icon: FaFacebook, href: 'https://www.facebook.com/profile.php?id=100092408692096', label: 'Facebook' },
  ];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email subscription
  };

  return (
    <footer className="bg-white dark:bg-gray-800 dark:text-white p-8 border-t">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-300">
        {/* Company Info */}
        <div className="col-span-1 text-gray-900 dark:text-gray-50 text-start">
        <img src={Logo} alt="LogaXP Logo" className="w-16 h-16 border-2 rounded-full border-green-500 mb-20" />

          <h1 className="text-2xl text-green-500 font-semibold">Loga<span className="text-blue-500">XP</span></h1>
          <p className="mt-2">Stay updated with the latest news, tips, and exciting updates. Let's connect and share the journey together!</p>
          <p className="mt-4">1105 Berry Street, Old Hickory, Tennessee 37138</p>
          {/* Social Links */}
          <div className="flex mt-4">
            <a href="/" target="_blank" rel="noreferrer" className="text-xl mr-8 hover:text-green-500">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com/LogaXp" target="_blank" rel="noreferrer" className="text-xl mr-8 hover:text-green-500">
              <FaTwitter />
            </a>
            <a href="/" target="_blank" rel="noreferrer" className="text-xl mr-8 hover:text-green-500">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100092408692096" target="_blank" rel="noreferrer" className="text-xl hover:text-green-500">
              <FaFacebook />
            </a>
          </div>
        </div>
        {/* Products */}
        <div className="col-span-1 text-gray-900 dark:text-gray-50 text-start ml-40">
          <h1 className="text-xl text-green-500 font-semibold mb-2">Products</h1>
          {products.map(({ text, href }) => (
            <a key={text} className="block text-gray-900 dark:text-gray-50 hover:text-white transition duration-300 mt-1" href={href} target="_blank" rel="noreferrer">{text}</a>
          ))}
        </div>
        {/* Business Types */}
        <div className="col-span-1 text-start ml-40">
          <h1 className="text-xl text-green-500 font-semibold mb-2">Business Types</h1>
          {businessTypes.map((text) => (
            <span key={text} className="block text-gray-900 dark:text-gray-50 mt-1">{text}</span>
          ))}
        </div>
        {/* Site Links */}
        <div className="col-span-1 text-start ml-40">
          <h1 className="text-xl text-green-500 font-semibold mb-2">Company</h1>
          {site.map(({ text, url }) => (
            <Link key={text} className="block text-gray-900 dark:text-gray-50 hover:text-white transition duration-300 mt-1" to={url}>{text}</Link>
          ))}
          <a className="block text-gray-400 hover:text-white transition duration-300 mt-1" href="https://blob.logxp.com/appointments" target="_blank" rel="noreferrer">Blog</a>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="mt-8 text-sm flex justify-between items-center">
        <span>© 2023 LogaXP. All Rights Reserved.</span>
        <div>
          <Link to="/terms-conditions" className="hover:underline">Terms of Use</Link>
          <span className="mx-2">|</span>
          <Link to="/privacy-policy" className="hover:underline">Privacy & Security</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
