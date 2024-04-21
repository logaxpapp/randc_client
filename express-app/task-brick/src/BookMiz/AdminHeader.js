import React from 'react';
import UserIcon from './assets/users.svg';
import AdminIcon from './assets/notification-bing.svg';
import BillingPlanIcon from './assets/bill.svg';
import chris from './assets/chris.png';
import ProfileModal from './modal/ProfileModal'; // Import the ProfileModal component
import NotificationDisplayModal from './modal/NotificationDisplayModal';
import DefaultImage from './assets/chris.png';

import { ReactComponent as DropdownArrow } from './assets/dropdown-arrow.svg';

const notification = [
  {
    id: 1,
    title: "New Project Created",
    description: "occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: DefaultImage,
  },
  {
    id: 2,
    title: "New User Registered",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: DefaultImage,
  },
  {
    id: 3,
    title: "New Message Received",
    description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: DefaultImage,
  },
];

const AdminHeader = () => {
  const headerItems = [
    { icon: BillingPlanIcon, alt: "Billing Plans" },
    { icon: UserIcon, alt: "Users" },
    { icon: AdminIcon, alt: "Notifications" },
  ];

  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleAction = (notificationId) => {
    // Perform actions based on the notification ID
    console.log(`Action triggered for notification ID: ${notificationId}`);
    // Update the notification state or perform other actions
  };

  // Function to open the modal
  const openModal = () => {
    // Fetch or set notifications data
    setNotifications([...notification]);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="flex justify-between items-center py-2 px-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        {headerItems.map((item, index) => (
          <div key={index} className="p-2 bg-white rounded-lg border border-gray-300">
            {/* Add onClick event handler to the AdminIcon */}
            {item.alt === "Notifications" ? (
              <img src={item.icon} alt={item.alt} className="h-5 w-5 cursor-pointer" onClick={openModal} />
            ) : (
              <img src={item.icon} alt={item.alt} className="h-5 w-5" />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center p-2 px-8 bg-white rounded-lg border border-gray-300 space-x-2">
          <img className="h-8 w-8 rounded-full" src={chris} alt="Profile" />
          <span className="text-sm font-medium">Christopher</span>
          <button className="text-xs font-medium text-blue-500" onClick={openProfileModal}>
          <DropdownArrow className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
      {/* Render the ProfileModal component */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} user={{ name: "Christopher", email: "krissbajph@example.com" }} />
      <NotificationDisplayModal
        isOpen={isModalOpen}
        onClose={closeModal}
        notifications={notifications}
        handleAction={handleAction}
      />
    </header>
  );
};

export default AdminHeader;
