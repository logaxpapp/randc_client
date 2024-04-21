import React, { useState } from 'react';
import { FaArrowCircleRight } from 'react-icons/fa';

// Sample images, replace with your actual imports
import bugQueuesImage from '../../assets/images/templates1.png';
import productBriefImage from '../../assets/images/templates2.png';
import simpleSprintsImage from '../../assets/images/templates3.png';
import roadmapTimelineImage from '../../assets/images/templates4.png';
import productBriefImage2 from '../../assets/images/templates5.png';
import simpleSprintsImage2 from '../../assets/images/template2.png';

const mockData = [
  {
    title: 'Bug Queues',
    image: bugQueuesImage,
    rating: 5.0,
    reviewCount: '22k',
    address: '1234 Main St',
  },
  {
    title: 'Product Brief',
    image: productBriefImage,
    rating: 5.0,
    reviewCount: '46k',
    address: '1234 Main St',
  },
  {
    title: 'Simple Sprints',
    image: simpleSprintsImage,
    rating: 5.0,
    reviewCount: '35k',
    address: '1234 Main St',
  },
  {
    title: 'Roadmap Timeline',
    image: roadmapTimelineImage,
    rating: 5.0,
    reviewCount: '67k',
    address: '1234 Main St',
  },
  {
    title: 'Product Brief',
    image: productBriefImage2,
    rating: 5.0,
    reviewCount: '28k',
    address: '1234 Main St',
  },
  {
    title: 'Simple Sprints',
    image: simpleSprintsImage2,
    rating: 5.0,
    reviewCount: '44k',
    address: '1234 Main St',
  },
];

const Recommended = () => {
  // Initial state to manage the visible slice of the mockData array
  const [startIndex, setStartIndex] = useState(0); // New state variable for slice start index
  const visibleItemCount = 5; // Number of items you want to display at a time

  const handleIconClick = () => {
    // Calculate the next start index, wrapping around if necessary
    const nextIndex = (startIndex + 2) % mockData.length;
    setStartIndex(nextIndex);
  };

  // Calculate the visible items based on the current startIndex
  const visibleItems = [];
  for (let i = 0; i < visibleItemCount; i++) {
    const itemIndex = (startIndex + i) % mockData.length;
    visibleItems.push(mockData[itemIndex]);
  }
  return (
   <div class="grid  items-center justify-center overflow-x-auto mx-auto p-5 mb-20">
     
      <div className="flex space-x-4">
        {visibleItems.map((item, index) => (
          <div className="w-64 h-64 relative overflow-hidden shadow-lg" key={index}>
            <img src={item.image} alt={item.title} className="w-full h-auto" />
            <div className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-bl-lg">
              <p className="font-bold text-center">{item.rating}.0</p>
              <p className="text-sm"><span className="text-xs">{item.reviewCount} Usage</span></p>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 text-center">
              <p className="font-bold">{item.title}</p>
              <p className="text-xs">{item.address}</p>
            </div>
          </div>
        ))}
        <div className="flex justify-center items-center"  onClick={handleIconClick}>
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="31" fill="white" stroke="black" strokeWidth="2" />
        <foreignObject x="12" y="12" width="40" height="40">
          <FaArrowCircleRight className="text-black" size={40} />
        </foreignObject>
      </svg>
      </div>
      </div>
    </div>
  );
};

export default Recommended;