import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { eventsData } from './data';

const PopularEvents = () => {
    const [currentFilter, setCurrentFilter] = useState('All');

    const filterEvents = (filter) => {
        setCurrentFilter(filter);
    };

    const filteredEvents = eventsData.filter(event => {
        if (currentFilter === 'Today') {
            // Assuming you have a way to check if an event is 'Today'
            return event.isToday;
        } else if (currentFilter === 'Tomorrow') {
            return event.isTomorrow;
        } else if (currentFilter === 'This Week') {
            return event.isThisWeek;
        } else if (currentFilter === 'Free') {
            return event.price === 'Free';
        }
        return true;
    });

    return (
        <div className="container mx-auto my-8">
            <h2 className="text-2xl font-bold text-left mb-12">Scheduled Events in Nashville</h2>
            
            <div className="mb-8 text-gray-700">
                {['All', 'Today', 'Tomorrow', 'This Week', 'Free'].map(filter => (
                    <span key={filter}
                        onClick={() => filterEvents(filter)}
                        className={`mr-2 py-2 px-4 text-xs inline-block rounded-full uppercase font-semibold tracking-wide cursor-pointer ${currentFilter === filter ? 'bg-purple-800 text-white' : 'border text-purple-800'}`}
                    >
                        {filter}
                    </span>
                ))}
            </div>

            <div className="grid md:grid-cols-5 gap-4">
                {filteredEvents.map(event => (
                    <Link to={`/events/${event.id}`} key={event.id} className="group">
                        <div className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
                            <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
                            <div className="p-5">
                                <div className="flex justify-between items-baseline mb-4">
                                    <span className="bg-purple-200 text-purple-800 text-xs px-3 py-1 rounded-full font-semibold tracking-wide">
                                        {event.category}
                                    </span>
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold tracking-wide">
                                        {event.date}
                                    </span>
                                </div>
                                <h4 className="font-bold text-sm leading-tight truncate">{event.title}</h4>
                                <div className="mt-2">
                                    <span className="text-gray-900 text-xs">{event.venue}</span>
                                    <span className="text-gray-600 text-sm mx-2">•</span>
                                    <span className="text-gray-600 text-sm">{event.price}</span>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-teal-600 text-xs font-semibold">
                                        {event.interested} interested
                                    </span>
                                    <FaHeart className="text-red-500 ml-2 group-hover:scale-110 transition-transform duration-300 ease-in-out" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="text-center mt-8">
                <button className="bg-purple-600 text-white hover:bg-purple-700 rounded-lg px-5 py-2.5 transition-colors duration-300">
                    See More
                </button>
            </div>
        </div>
    );
};

export default PopularEvents;
