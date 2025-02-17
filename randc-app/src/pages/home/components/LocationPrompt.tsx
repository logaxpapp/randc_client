// src/components/LocationPrompt.tsx
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaRegTimesCircle } from 'react-icons/fa';

const STORAGE_KEY = 'locationPromptDismissed'; // or 'locationPromptResponse'

function LocationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check localStorage if the user previously dismissed or accepted
    const alreadyDismissed = localStorage.getItem(STORAGE_KEY);
    if (!alreadyDismissed) {
      setShowPrompt(true);
    }
  }, []);

  // Called when user accepts location
  async function handleEnableLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
        // You could store in localStorage or call an API here
        localStorage.setItem(STORAGE_KEY, 'accepted'); 
        setShowPrompt(false);
        alert('Location enabled successfully!');
      },
      (error) => {
        console.error(error);
        alert('Unable to retrieve location. Check browser settings.');
      }
    );
  }

  // Called when user dismisses location
  function handleNotNow() {
    localStorage.setItem(STORAGE_KEY, 'dismissed');
    setShowPrompt(false);
  }

  if (!showPrompt) {
    return null; // No prompt to display
  }

  return (
    <div className="fixed   w-full bg shadow-lg p-16 flex flex-col sm:flex-row items-center justify-between z-50 text-white ">
      <div className="flex items-center space-x-3">
        <FaMapMarkerAlt className="text-red-500 w-6 h-6" />
        <div>
          <h3 className="text-lg font-bold text-white">Enable Location Services</h3>
          <p className="text-sm text-gray-50">
            Allow us to tailor local content and offers based on your location.
          </p>
        </div>
      </div>
      <div className="mt-3 sm:mt-0 flex space-x-3">
        <button
          onClick={handleEnableLocation}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center space-x-2"
        >
          <span>Enable</span>
        </button>
        <button
          onClick={handleNotNow}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-300 rounded flex items-center space-x-2"
        >
          <FaRegTimesCircle />
          <span>Not Now</span>
        </button>
      </div>
    </div>
  );
}

export default LocationPrompt;
