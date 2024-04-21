import React from 'react';
import { FaVideo, FaGoogle } from 'react-icons/fa';

const VideoConferencing = () => {
  return (
    <div className="flex flex-col items-center">
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 flex items-center">
        <FaVideo className="mr-2" />
        Start Zoom Meeting
      </button>
      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center">
        <FaGoogle className="mr-2" />
        Start Google Meet
      </button>
    </div>
  );
};

export default VideoConferencing;
