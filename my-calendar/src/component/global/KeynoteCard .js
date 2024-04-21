import React from 'react';
import { FaArrowLeft, FaMicrophone, FaPlayCircle } from 'react-icons/fa';

const KeynoteCard = () => {
  return (
    <div className="relative bg-gradient-to-t from-purple-300 to-white p-6 rounded-lg shadow-lg max-w-7xl mx-auto mt-12">
      {/* Overlaying Card */}
      
  <div class="absolute top-0 -left-4 w-12 h-full bg-gradient-to-b from-purple-900 to-purple-300 opacity-75 rounded-l-lg"></div>
  <div class="absolute top-0 -right-4 w-12 h-full bg-gradient-to-b from-purple-900 to-purple-300 opacity-75 rounded-r-lg"></div>

  <div className="absolute h-s top-1 -mt-12 right-0 bg-gradient-to-r from-blue-300 to-gray-100 text-purple-900 p-6 rounded-lg shadow-lg max-w-sm opacity">
    <h2 class="text-4xl font-bold text-purple-900 mb-4">LogaEvents</h2>
    <p class="text-md text-gray-600">Innovating for a Sustainable Future</p>
    <p class="text-xs text-gray-500 mt-2">April 04–06, 2023 • Los Angeles, CA</p>
    
    <p class="mt-6 text-gray-600 max-w-60">
      Join industry leaders in discussing the latest in tech advancements, health innovations, and renewable energy solutions. This is where cutting-edge science meets practical applications.
    </p>
    <div class="flex justify-between items-center mt-6">
        <p class="text-gray-600 max-w-60">
            This event will bring about 1000+ attendees to the next generation of web developers.
        </p>
    </div>

    <div class="flex justify-between items-center mt-6">
      <a href="#!" class="text-indigo-600 hover:text-indigo-800 flex items-center">
        <FaPlayCircle class="inline-block mr-2"/>
        <span>Watch Intro</span>
      </a>
      <button class="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300">
        Reserve Spot
      </button>
    </div>
  </div>



      {/* Main Card */}
      <div className="  from-white to-blue-100 bg-gradient-to-r p-6 rounded-lg shadow-lg border-4 border-transparent">
        <h2 className="text-3xl font-bold mb-4 font-serif">The Future of IT, Health, and Sustainability</h2>
        <p className="text-gray-600 max-w-4xl">
        Discover the crossroads where innovation meets necessity at InnoTech Summit. This conference is dedicated to the forward-thinkers and game-changers in IT, healthcare, and sustainable energy. Prepare to dive into deep tech explorations, breakthroughs in medical science, and the driving forces reshaping our energy landscape. 

        </p>
        <div className="flex items-center space-x-4 mt-10 mb-8">
          <FaArrowLeft className="text-blue-600 font-serif"/>
          <span className="text-lg font-bold text-white cursor-pointer border px-4 py-1 bg-purple-900 rounded-full">Event Details</span>
        </div>
       
        <div className="grid grid-cols-3 mt-4 max-w-4xl">
          <div className="text-center text-xs">
            <span className="font-bold">5</span>
            <p className="text-sm text-gray-600">Speakers</p>
          </div>
          <div className="text-center text-xs">
            <span className="font-bold">23,000</span>
            <p className=" text-gray-600">People Attending</p>
          </div>
          <div className="text-center text-xs">
            <span className="font-bold">LogaXp Hub</span>
            <p className=" text-gray-600">Venue</p>
          </div>
          
        </div>
        <section class="mt-8">
        <h3 class="text-xl font-bold text-gray-800">Featured Speakers</h3>
        <div class="mt-4 text-gray-600 text-sm space-y-2">
            <p className='max-w-4xl'><strong className='font-bold text-red-600 mr-4'>Dr. Jason Bajo:</strong> A leading voice in data-driven societal change, Dr. Rutherford's insights on behavioral analysis have influenced policy at the global level.</p>
            <p className='max-w-4xl'><strong  className='font-bold text-red-600 mr-4'>Prof. Jordan Cane:</strong> Renowned for pioneering work in renewable energy systems, Prof. Cane’s talks illuminate the path to sustainable technology advancements.</p>
            <p className='max-w-4xl'><strong  className='font-bold text-red-600 mr-4'>Samantha Lee:</strong> With her groundbreaking approaches to AI in medicine, Samantha's research has been pivotal in the development of intelligent diagnostic tools.</p>
        </div>
        </section>

      </div>
    </div>
  );
};

export default KeynoteCard;
