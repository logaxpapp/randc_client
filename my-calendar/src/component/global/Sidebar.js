import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaCalendarAlt, FaVideo, FaUser, FaAddressCard, FaChevronDown, FaUserShield, FaChevronUp, FaBars, FaTimes, FaPlusCircle, FaUsersCog, FaBookmark, FaLayerGroup, FaPlusSquare, FaBusinessTime, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ handleLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [clientsOpen, setClientsOpen] = useState(false);

  const activeLinkStyle = {
    backgroundColor: "black",
    color: "#081c15",
    fontWeight: "bold",
  };

  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-200 h-auto transition-width duration-300`}>
      <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-xl p-2 m-2">
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`space-y-8 text-xs overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
        {/* Dashboard Section */}
        <Section title="Main Menus">
          <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
            <MenuItem icon={<FaCalendarAlt className="text-purple-900" />} text="Calendar" />
          </NavLink>
          <MenuItem icon={<FaLayerGroup className="text-blue-500" />} text="Manage Clients" onClick={() => setClientsOpen(!clientsOpen)} dropDownIcon={appointmentOpen ? <FaChevronUp /> : <FaChevronDown />} />
          {clientsOpen && (
            <>
              <NavLink to="/create-tenant" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                <SubMenuItem icon={<FaPlusSquare className="text-green-600" />} text="New Client" />
              </NavLink>
              <NavLink to="/dashboard/tenants" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                <SubMenuItem icon={<FaBusinessTime className="text-red-400" />} text="Clients" />
              </NavLink>
            </>
          )}
          <MenuItem icon={<FaAddressCard className="text-blue-500" />} text="Manage Appointment" onClick={() => setAppointmentOpen(!appointmentOpen)} dropDownIcon={appointmentOpen ? <FaChevronUp /> : <FaChevronDown />} />
          {appointmentOpen && (
            <>
              <NavLink to="/dashboard/create-appointment" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                <SubMenuItem icon={<FaPlusCircle className="text-blue-600" />} text="New Appointment" />
              </NavLink>
              <NavLink to="/dashboard/appointments" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                <SubMenuItem icon={<FaBookmark className="text-red-400" />} text="Appointments" />

              </NavLink>
              <NavLink to="/dashboard/events-list" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                <SubMenuItem icon={<FaPlusCircle className="text-blue-600" />} text="Google Events" />
              </NavLink>
              <NavLink to="/dashboard/add-event" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                <SubMenuItem icon={<FaBookmark className="text-red-400" />} text="Create Google Events" />
                
              </NavLink>
            </>
          )}
          <MenuItem icon={<FaUser className="text-red-500" />} text="Manage User" onClick={() => setUserOpen(!userOpen)} dropDownIcon={userOpen ? <FaChevronUp /> : <FaChevronDown />} />
          {userOpen && (
            <>
              <NavLink to="/dashboard/create-user" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                <SubMenuItem icon={<FaPlusCircle className="text-red-400" />} text="New User" />
              </NavLink>
              <NavLink to="/dashboard/users" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                <SubMenuItem icon={<FaUsersCog className="text-red-400" />} text="Users" />
              </NavLink>
            </>
          )}
            <MenuItem icon={<FaUserShield className="text-green-500" />} text="Manage Events" onClick={() => setEventsOpen(!eventsOpen)} dropDownIcon={eventsOpen ? <FaChevronUp /> : <FaChevronDown />} />
          {eventsOpen && (
            <>
              <NavLink to="/dashboard/create-events" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                <SubMenuItem icon={<FaPlusCircle className="text-red-400" />} text="New Events" />
              </NavLink>
              <NavLink to="/dashboard/events" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
                <SubMenuItem icon={<FaUsersCog className="text-red-400" />} text="Events" />
              </NavLink>
            </>
          )}
        </Section>

        {/* Calendar Section */}
        <Section title="Integrations">
          <NavLink to="/dashboard/google-calendar" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
            <MenuItem icon={<FaCalendarAlt className="text-red-400" />} text="Stack Overflow" />
          </NavLink>
          <NavLink to="/dashboard/apple-calendar" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
            <MenuItem icon={<FaCalendarAlt className="text-yellow-500" />} text="Loga Video" />
          </NavLink>
          <NavLink to="/dashboard/calendar-integration-page" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
            <MenuItem icon={<FaCalendarAlt className="text-blue-400" />} text="Services Integration" />
          </NavLink>
        </Section>
        

        Video Call Section
        <Section title="Video Call">
          <p className="text-sm text-gray-400 px-2 mt-2">Integrate Video Capabilities</p>
          <NavLink to="/dashboard/zoom" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
            <MenuItem icon={<FaVideo className="text-blue-500" />} text="MsEvents" />
          </NavLink>
          <NavLink to="/dashboard/ms-events" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
            <MenuItem icon={<FaVideo className="text-red-500" />} text="Google Meet" />
          </NavLink>
        </Section>
        <p className="text-sm text-gray-400 px-2 mt-2"></p>

        {/* Settings Section */}
        <Section title="Settings">
          <NavLink to="/settings" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>
            <MenuItem icon={<FaCog className="text-purple-600" />} text="Settings" />
          </NavLink>
          <div onClick={handleLogout} className="flex items-center p-2 hover:bg-gray-500 hover:text-white cursor-pointer transition-colors duration-150">
            <FaSignOutAlt className="mr-2 text-red-600" />
            <span className="font-medium">Logout</span>
          </div>
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-lg font-thin mb-2 px-2">{title}</h2>
    <div className="bg-gray-100 p-2">{children}</div>
  </div>
);

// Helper component for menu items
const MenuItem = ({ icon, text, onClick, dropDownIcon }) => (
  <div onClick={onClick} className="flex items-center p-2 hover:bg-gray-500 hover:text-white cursor-pointer transition-colors duration-150">
    <span className="mr-2">{icon}</span>
    <span className="flex-1 font-medium">{text}</span>
    {dropDownIcon && <span className="ml-auto">{dropDownIcon}</span>}
  </div>
);

// Helper component for submenu items
const SubMenuItem = ({ icon, text }) => (
  <div className="flex items-center p-2 text-sm hover:bg-gray-600 cursor-pointer transition-colors duration-150 ml-4">
    <span className="mr-2">{icon}</span>
    <span className="flex-1 font-medium text-xs">{text}</span>
  </div>
);

export default Sidebar;
