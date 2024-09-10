import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../component/assets/images/logo.png';

const Header = () => {
  const activeLinkStyle = ({ isActive }) => ({
    color: isActive ? '#4a5568' : '#ffffff',
    backgroundColor: isActive ? '#e2e8f0' : 'transparent',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none'
  });
  return (
    <header className="bg-slate-900 text-white font-serif font-bold shadow-md">
      <div className="container mx-auto flex justify-between items-center p-5">
        <NavLink to="/">
          <img src={logo} alt="LogaEvents Logo" className="h-12 border-2 border-purple-400  rounded-full" />
        </NavLink>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <NavLink to="/" style={activeLinkStyle} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" style={activeLinkStyle}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/registration" style={activeLinkStyle}>
                Signup
              </NavLink>
            </li>
            <li>
              <NavLink to="/our-team" style={activeLinkStyle}>
                OurTeam
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default Header;
