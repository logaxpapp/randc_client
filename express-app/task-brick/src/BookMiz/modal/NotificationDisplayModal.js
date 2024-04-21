import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faTrashAlt, faShare } from '@fortawesome/free-solid-svg-icons';

const NotificationDisplayModal = ({ isOpen, onClose, notifications, handleAction, handleMarkAsRead, handleShare, handleDelete }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-gray-900 bg-opacity-50 absolute inset-0"></div>
        <div className="w-full max-w-xl p-6 backdrop-blur-sm h-96 bg-white/50 rounded-lg overflow-hidden shadow-xl">
          <div className="px-6 py-4 flex justify-between items-center bg-gray-800 text-white rounded-lg shadow-xl max-w-xl w-full relative">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <button onClick={onClose} className="absolute top-2 right-2 text-2xl">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="px-6 py-4 bg-white">
            {notifications.map(notification => (
              <div key={notification.id} className="mb-4 bg-white rounded-lg p-4 shadow-md flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium">{notification.title}</h4>
                  <p className="text-gray-600">{notification.message}</p>
                </div>
                <div className="flex space-x-4">
                  <label className="cursor-pointer" title="Mark as Read">
                    <input
                      type="checkbox"
                      onChange={() => handleMarkAsRead(notification.id)}
                      className="form-checkbox opacity-0 absolute"
                    />
                    <FontAwesomeIcon icon={faCheck} className="text-blue-500 cursor-pointer" />
                  </label>
                  <FontAwesomeIcon
                    icon={faShare}
                    className="text-blue-500 cursor-pointer"
                    title="Share"
                    onClick={() => handleShare(notification.id)}
                  />
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="text-red-500 cursor-pointer"
                    title="Delete"
                    onClick={() => handleDelete(notification.id)}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-blue-500 cursor-pointer"
                    title="Action"
                    onClick={() => handleAction(notification.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default NotificationDisplayModal;
