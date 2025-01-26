import React, { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { useAppSelector } from '../../app/hooks';

interface ChatHeaderProps {
  chatId: string;
  // Maybe the user ID we want to show presence for?
  otherUserId?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatId, otherUserId }) => {
  // 1) Get presence from Redux
  const presenceStore = useAppSelector((state) => state.presence);

  // If you specifically want the other user's status:
  const presenceStatus = otherUserId
    ? presenceStore[otherUserId] || 'offline'
    : 'offline';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOptionClick = (option: string) => {
    console.log(`Selected option: ${option}`);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm relative">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            Chat: {chatId.substring(0, 6)}...
          </span>
          {/* Display presence */}
          <span className="text-xs">
            {presenceStatus === 'online' ? (
              <span className="text-green-500">Online</span>
            ) : (
              <span className="text-gray-400">Offline</span>
            )}
          </span>
        </div>
      </div>

      {/* Dropdown Button */}
      <div className="relative">
        <button
          className="p-2 text-gray-500 hover:text-gray-700"
          onClick={toggleDropdown}
        >
          <FaEllipsisV />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
            <ul>
              <li
                onClick={() => handleOptionClick('Mute Notifications')}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Mute Notifications
              </li>
              <li
                onClick={() => handleOptionClick('View Info')}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                View Info
              </li>
              <li
                onClick={() => handleOptionClick('Leave Chat')}
                className="px-4 py-2 text-sm text-red-500 hover:bg-red-100 cursor-pointer"
              >
                Leave Chat
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
