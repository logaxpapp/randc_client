import React from 'react';
import { Link } from 'react-router-dom';
import PopularEvents from './PopularEvents';
import UpcomingTasks from './UpcomingTasks';
import PartyImage from '../../component/assets/images/party.png';
import Calendar from '../../component/assets/images/calendar.png';
import KeynoteCard from './KeynoteCard ';
import NewsLetter from './NewsLetter';
import DestinationCarousel from './DestinationCarousel';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
     {/* Header & Hero Section */}
     <header className="relative">
        <img src={PartyImage} alt="Party Background" className="absolute inset-0 object-cover w-full h-full" />
        <div className="relative bg-black bg-opacity-50">
          <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col items-center justify-between lg:flex-row">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-white">LogaEvents</h1>
                <p className="mt-2 text-lg text-gray-300">Organize your life & events, one day at a time.</p>
                <Link to="/registration" className="mt-6 inline-block bg-purple-800 hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300">
                  Get Started
                </Link>
              </div>
              <img src={Calendar} alt="Calendar" className="w-2/5 h-96 mt-12 lg:mt-0" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
      </header>


     {/* Main Content Body */}
<main className=" mx-auto px-6 py-8">
  <section className="bg-white rounded-lg p-6">

    <div className="mt-6">
     <PopularEvents />
    </div>
  </section>
  
  <section className="mt-8 bg-white  p-6">
    <div className="mt-6">
      <KeynoteCard />
    </div>
  </section>
  
  <section className="mt-8 bg-white shadow rounded-lg p-6">
    <div className="mt-6">
      <UpcomingTasks />
    
    </div>
  </section>
  <DestinationCarousel />
  <section className="mt-8 bg-white  rounded-lg ">
    <div className="mt-6">
      <NewsLetter />
    </div>
  </section>
</main>

    </div>
  );
};

export default HomePage;
