import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaSave } from 'react-icons/fa';
import Logo from '../../assets/images/logo.png';

const products = [
  { name: 'LogSys', url: '#' },
  { name: 'TimeSync', url: '#' },
  { name: 'TaskBrick', url: '#' },
  { name: 'BeautyHub', url: '#' },
  { name: 'BookMiz', url: '#' },
  { name: 'DocSend', url: '/' },
];

const companyLinks = [
  { name: 'Our Services', url: '/services' },
  { name: 'Career', url: '/career' },
  { name: 'Terms & Conditions', url: '#' },
  { name: 'Privacy Policy', url: '#' },
  { name: 'Contact Us', url: '#' },
];

const socialLinks = [
  { Icon: FaLinkedin, url: '/', ariaLabel: 'LinkedIn' },
  { Icon: FaTwitter, url: 'https://twitter.com/LogaXp', ariaLabel: 'Twitter' },
  { Icon: FaInstagram, url: '/', ariaLabel: 'Instagram' },
  { Icon: FaFacebook, url: 'https://www.facebook.com/profile.php?id=100092408692096', ariaLabel: 'Facebook' },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-50 text-gray-700 body-font">
      <div className="container mx-auto py-10 px-5 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Logo and Description */}
        <div className="md:col-span-4 flex flex-col justify-between">
          <div className="mb-4">
            <Link to="/" className="flex items-center mb-4">
              <img src={Logo} alt="LogaXP Logo" className="w-16 h-16 border border-green-400 rounded-full bg-white " />
              <span className="text-2xl font-bold text-gray-900 ml-2">
                Task<span className='text-green-500'>Brick</span>
              </span>
                  </Link>
                  <p className="text-gray-600 text-lg max-w-60">
                    Empowering businesses with innovative solutions.
                  </p>
                </div>

          <div className="mt-4 flex space-x-6">
            {/* Social Links */}
            {socialLinks.map(({ Icon, url, ariaLabel }, index) => (
              <a key={index} href={url} className="text-gray-500 hover:text-green-600" aria-label={ariaLabel}>
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Product Links */}
        <div className="md:col-span-3">
          <h2 className="title-font font-semibold text-gray-900 text-lg mb-3">Products</h2>
          <nav className="list-none">
            {products.map((product, index) => (
              <li key={index} className="mb-2">
                <Link 
                  to={product.url} 
                  className="text-gray-600 hover:text-green-600 hover:bg-white hover:font-bold font-medium transition-all duration-300"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </nav>
        </div>

        {/* Company Links */}
        <div className="md:col-span-3">
          <h2 className="title-font font-semibold text-gray-900 text-lg mb-3">Company</h2>
          <nav className="list-none">
            {companyLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link 
                  to={link.url} 
                  className="text-gray-600 hover:text-green-500 hover:bg-white hover:font-bold transition-colors duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <a 
                href="https://blob.logxp.com/appointments" 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-600 hover:text-green-500 hover:bg-white hover:font-bold transition-colors duration-300"
              >
                Blog
              </a>
            </li>
          </nav>
        </div>

        {/* Newsletter Signup */}
        <div className="md:col-span-2 order-2 md:order-4 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-blue-500 mb-4">Newsletter Signup</h2>
          <p className="text-gray-600 mb-4 text-sm">Get the latest updates and offers right to your inbox.</p>
          <form className="relative border border-gray-300 rounded overflow-hidden focus-within:border-green-500" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email"
              className="px-4 py-2 w-full text-xs md:text-sm text-gray-700 bg-gray-50 focus:outline-none"
              onChange={handleEmailChange}
              value={email}
            />
            <button 
              type="submit"
              className="absolute right-0 top-0 px-4 py-2 bg-blue-600 text-white hover:bg-blue-900 transition-colors duration-300 focus:outline-none"
            >
              <FaSave className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">No spam, unsubscribe anytime.</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-100">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col md:flex-row items-center justify-between h-20">
          <p className="text-gray-500 text-sm text-center md:text-left">© 2023 LogaXP —
            <a href="https://twitter.com/LogaXp" className="text-gray-600 hover:text-green-600 ml-1" target="_blank" rel="noopener noreferrer">@LogaXp</a>
          </p>
          <div className="md:flex md:items-center md:justify-start text-sm">
            <Link to="/terms-conditions" className="text-gray-600 hover:text-green-600 mr-5 hover:underline">Terms of Use</Link>
            <Link to="/privacy-policy" className="text-gray-600 hover:text-green-600 hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
