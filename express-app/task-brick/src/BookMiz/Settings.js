import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faKey, faBell, faEnvelopeOpenText, 
  faUser, faLock, faCogs, faPhone, faMapMarkerAlt, faEllipsisV,
  faBars, faEnvelope,  faSpinner, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// Mock data to simulate user settings
const mockUserData = {
  email: 'logaxpapp@gmail.com',
  fullName: 'LogaXP',
  phoneNumber: '+1234567890',
  address: '123 Main Street',
  twoFactorAuthentication: false,
};

const teamMembers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' },
  // Add more members as needed
];



const Settings = () => {
  // State for user settings
  const [userData, setUserData] = useState(mockUserData);
  const [activeSection, setActiveSection] = useState('Profile');

  // Handlers for form submission or input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const [isEditPRModalOpen, setIsEditPRModalOpen] = useState(false);

const handleEditPRComments = () => {
  setIsEditPRModalOpen(true);
};

  
const [isSubmitting, setIsSubmitting] = useState(false);

// ...

const handleFormSubmit = async (event) => {
  event.preventDefault();
  setIsSubmitting(true);
  // Simulate API call
  setTimeout(() => {
    console.log('Form submitted:', userData);
    setIsSubmitting(false);
  }, 2000);
};

const [newMemberEmail, setNewMemberEmail] = useState('');

// Handler for inviting a new team member
const handleInviteMember = () => {
  // Placeholder functionality to 'invite' a member
  console.log('Invite sent to:', newMemberEmail);
  // Reset the input field
  setNewMemberEmail('');
  // In a real app, you would likely send a request to your backend here
};

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
};

 // Add the screen size checker within the component as well
 const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

 useEffect(() => {
   const checkScreenSize = () => {
     setIsSmallScreen(window.innerWidth < 768);
   };

   window.addEventListener('resize', checkScreenSize);

   // Clean up listener on component unmount
   return () => window.removeEventListener('resize', checkScreenSize);
 }, []);


  const handleToggleChange = () => {
    setUserData({ ...userData, twoFactorAuthentication: !userData.twoFactorAuthentication });
  };

  // Function to set the active section
  const handleSetActiveSection = (section) => {
    setActiveSection(section);
  };

  return (
  
<div className="flex flex-col lg:flex-row ...">
  <div className=" justify-between gap-4 ">

  </div>

  {isSmallScreen && (
    <div className="text-3xl cursor-pointer lg:hidden" onClick={toggleSidebar}>
      {/* Replace with a burger icon */}
      <FontAwesomeIcon icon={faBars} />
    </div>
  )}

<aside className={`fixed inset-y-0 left-0 text-xs transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-gray-100 z-30 transition duration-300 ease-in-out lg:relative lg:translate-x-0`}>
  <div className="sticky top-0 p-4">
          <ul className="flex flex-col gap-8 min-h-screen mt-20">
            <li
              className={`mb-2 cursor-pointer ${activeSection === 'Profile' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleSetActiveSection('Profile')}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
            </li>
            <li
              className={`mb-2 cursor-pointer ${activeSection === 'Security' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleSetActiveSection('Security')}
            >
              <FontAwesomeIcon icon={faLock} className="mr-2" /> Security
            </li>
            <li
              className={`mb-2 cursor-pointer ${activeSection === 'Notifications' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleSetActiveSection('Notifications')}
            >
              <FontAwesomeIcon icon={faBell} className="mr-2" /> Notifications
            </li>
            <li
              className={`mb-2 cursor-pointer ${activeSection === 'Messages' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleSetActiveSection('PR')}
            >
              <FontAwesomeIcon icon={faEnvelopeOpenText} className="mr-2" /> PR
            </li>
            <li
              className={`mb-2 cursor-pointer ${activeSection === 'Team' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleSetActiveSection('Team')}
            >
              <FontAwesomeIcon icon={faUserCircle} className="mr-2" /> Team
             
            </li>
            <li
              className={`mb-2 cursor-pointer ${activeSection === 'API Keys' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleSetActiveSection('Access')}
            >
              <FontAwesomeIcon icon={faKey} className="mr-2" /> Access
             
            </li>
            <li
              className={`mb-2 cursor-pointer ${activeSection === 'Settings' ? 'text-blue-500' : 'text-gray-600'}`}
              onClick={() => handleSetActiveSection('Delete Account')}
            >
              <FontAwesomeIcon icon={faCogs} className="mr-2" /> Delete Account
            
            </li>
          </ul>
        </div>
  </aside>

  <main className="w-full p-5 text-xs">
  {activeSection === 'Profile' && (
  <div className="bg-white shadow-md rounded-lg p-5 transition-all duration-500">
    <form onSubmit={handleFormSubmit}>
      {/* Email Input */}
      <div className="mb-4">
        <label htmlFor="email" className="mb-2 font-bold text-md text-gray-900 flex items-center">
          Contact Email
          <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-gray-400 text-lg" />
          {/* Tooltip */}
          <span className="tooltip rounded shadow-lg p-2 bg-gray-100 text-red-500 -mt-8 absolute invisible">
            Important for account recovery.
          </span>
        </label>
        <div className="flex items-center border rounded-full">
          <span className="pl-2">
            <FontAwesomeIcon icon={faEnvelope} />
          </span>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="py-3 px-3 text-xs text-grey-darkest flex-grow border-none"
            placeholder="user@example.com"
          />
        </div>
      </div>

      {/* Full Name Input */}
      <div className="mb-4">
        <label htmlFor="fullName" className="mb-2 font-bold text-md text-gray-900">Full Name</label>
        <div className="flex items-center border rounded-full">
          <span className="pl-2">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={userData.fullName}
            onChange={handleInputChange}
            className="py-3 px-3 text-xs text-grey-darkest flex-grow border-none"
            placeholder="Full Name"
          />
        </div>
      </div>

      {/* Phone Number */}
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="mb-2 font-bold text-md text-gray-900">Phone Number</label>
        <div className="flex items-center border rounded-lg">
          <span className="pl-2">
            <FontAwesomeIcon icon={faPhone} />
          </span>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleInputChange}
            className="py-3 px-3 text-xs text-grey-darkest flex-grow border-none"
            placeholder="Phone Number"
          />
        </div>
      </div>

      {/* Address */}
      <div className="mb-4">
        <label htmlFor="address" className="mb-2 font-bold text-md text-gray-900">Address</label>
        <div className="flex items-center border rounded-lg">
          <span className="pl-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
          </span>
          <input
              type="text"
              id="address"
              name="address"
              value={userData.address}
              onChange={handleInputChange}
              className="py-3 px-3 text-xs text-grey-darkest flex-grow border-none"
              placeholder="Address"
            />

        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="mb-4 flex items-center">
        <label htmlFor="twoFactor" className="mr-2  text-lg text-gray-900">Two-Factor Authentication</label>
        <input
          type="checkbox"
          id="twoFactor"
          name="twoFactor"
          checked={userData.twoFactorAuthentication}
          onChange={handleToggleChange}
          className="w-6 h-6"
        />
      </div>

      {/* Save Changes Button */}
      <button
        type="submit"
        className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
        ) : (
          'Save Changes'
        )}
      </button>
    </form>
  </div>
)}


        {activeSection === 'Security' && (
          <div className="bg-white shadow-md rounded-lg p-5">
           <h2 className="text-xl font-semibold mb-2">Security</h2>
            <hr />

            <div className="mt-4">
              <h3 className="font-semibold mb-1">Password</h3>
              <button className="text-blue-500 hover:text-blue-700 font-semibold">Update Password</button>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-1">Two-Factor Authentication</h3>
              <p className="text-gray-600 text-sm mb-2">BookMiz uses time-based one-time passcodes (TOTP) </p>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Disabled</span>
                <label htmlFor="toggleTFA" className="switch">
                  <input type="checkbox" id="toggleTFA" />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'Notifications' && (
          <div className="bg-white shadow-md rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-2">Notifications</h2>
            <hr />
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Default Service Notifications</h3>
              <p className="text-gray-600 text-sm mb-2">Set default notifications for services. This setting can be overridden per service.</p>
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <select className="border rounded-lg py-3 px-3 text-xs text-grey-darkest w-full">
                    <option className='text-xs'>Only failure notifications</option>
                    {/* Add more options here */}
                  </select>
                </div>
                <button className="text-blue-500 hover:text-blue-700 font-semibold ml-4">Edit</button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-1">Preview Environment Notifications</h3>
              <p className="text-gray-600 text-sm mb-2">Configure notifications for preview environments and service previews.</p>
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <select className="border rounded-lg py-3 px-3 text-xs text-grey-darkest w-full">
                    <option>Enabled</option>
                    {/* Add more options here */}
                  </select>
                </div>
                <button className="text-blue-500 hover:text-blue-700 font-semibold ml-4">Edit</button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-1">Notification Destination</h3>
              <p className="text-gray-600 text-sm mb-2">Set where notifications will be delivered.</p>
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <select className="border rounded-lg py-3 px-3 text-xs text-grey-darkest w-full">
                    <option>Email</option>
                    {/* Add more options here */}
                  </select>
                </div>
                <button className="text-blue-500 hover:text-blue-700 font-semibold ml-4">Edit</button>
              </div>
            </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-1">Slack Integration</h3>
          <button className="text-blue-500 hover:text-blue-700 font-semibold">Connect Slack</button>
          <p className="text-gray-600 text-sm mt-2">Connect to enable Slack as a notification destination. See the docs for more details.</p>
        </div>
      </div>
        )}

{activeSection === 'PR' && (
  <div className="bg-white shadow-md rounded-lg p-5 transition-all duration-300">
    <h2 className="text-xl font-semibold mb-4">Pull Requests</h2>
    <div className="border-b pb-4">
      <h3 className="font-semibold text-lg mb-2">PR Notifications</h3>
      <p className="text-gray-600 text-sm mb-3">Control how you receive notifications for pull request updates.</p>
      
      {/* Toggle switch for enabling/disabling PR notifications */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-800">Email Notifications</span>
        <label htmlFor="emailNotifications" className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" id="emailNotifications" className="sr-only" />
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
          </div>
        </label>
      </div>
      
      {/* Other settings */}
      {/* ... */}
    </div>
    
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-2">Comment Automation</h3>
      <div className="flex items-center justify-between">
        <span className="text-gray-800">Auto-comment on PR Status</span>
        {/* Modal activation button */}
        <button
          onClick={handleEditPRComments}
          className="text-white bg-blue-500 hover:bg-blue-700 font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Edit
        </button>
      </div>
    </div>

    {/* Modal for editing PR comment settings */}
    {/* ... */}
  </div>
)}


{activeSection === 'Team' && (
  <div className="bg-white shadow-md rounded-lg p-5">
    <h2 className="text-xl font-semibold mb-2">Team</h2>
    <hr />
    <div className="mt-4">
      <h3 className="font-semibold mb-1">Invite a team member</h3>
      <div className="flex items-center space-x-2">
        <input
          type="email"
          placeholder="Enter email address"
          className="border rounded-lg py-2 px-3 flex-grow"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleInviteMember}
        >
          Invite
        </button>
      </div>
    </div>
    
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Current Team Members</h3>
      <ul>
        {teamMembers.map((member) => (
          <li key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
            <div>
              <FontAwesomeIcon icon={faUserCircle} className="text-gray-400" />
              <span className="font-medium ml-2">{member.name}</span> - <span className="text-gray-500">{member.role}</span>
            </div>
            <div>
              <span className="text-gray-400">{member.email}</span>
              {/* Icon button for additional actions like edit or remove */}
              <FontAwesomeIcon icon={faEllipsisV} className="ml-2 text-gray-600 hover:text-gray-800 cursor-pointer" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}

        {activeSection === 'Access' && (
          <div className="bg-white shadow-md rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-2">Access</h2>
            <hr />
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Access Control</h3>
              <p className="text-gray-600 text-sm mb-4">Make new features Available</p>
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">Scalable disk-backed services</h3>
              <p className="text-gray-600 text-sm mb-3">Scale your services that have an attached persistent disk, enabling zero-downtime deploys. Each instance uses an independent disk. <a href="#" className="text-blue-500 hover:text-blue-700">See details.</a></p>
              <label htmlFor="toggleEarlyAccess" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" id="toggleEarlyAccess" className="sr-only" />
                  <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                  Scalable disk-backed services
                </div>
              </label>
            </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-1">API Keys</h3>
              <button className="text-blue-500 hover:text-blue-700 font-semibold">Generate</button>
            </div>
            </div>
        )}
        {activeSection === 'Delete Account' && (
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
          <div className="border-t border-b py-4 mb-4">
            <p className="text-gray-700 text-sm">
              Deleting your account is irreversible. All your data will be permanently removed. 
              This action cannot be undone. Please confirm your intention to delete your account.
            </p>
          </div>
          <div className="flex justify-between items-center">
            <button className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:shadow-outline">
              Delete BookMiz Account
            </button>
            <button className="text-gray-600 bg-transparent hover:bg-gray-100 hover:text-gray-700 rounded transition duration-300 ease-in-out py-2 px-4">
              Cancel
            </button>
          </div>
        </div>
      )}
        </main>
      </div>

  );
};

export default Settings;
