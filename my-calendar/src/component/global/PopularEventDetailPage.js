import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTicketAlt } from 'react-icons/fa';
import { eventsData } from './data';

const PopularEventDetailPage = () => {
  let { eventId } = useParams();
  const navigate = useNavigate();
  const event = eventsData.find(event => event.id === parseInt(eventId));

  if (!event) {
    return (
      <div className="container mx-auto my-8 p-8 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-3xl font-bold text-gray-800">Event not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
          <FaArrowLeft className="mr-2" /> Go back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 p-8 bg-white shadow-lg rounded-lg">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-gray-600 bg-transparent hover:bg-gray-100">
        <FaArrowLeft className="mr-2" /> Go back
      </button>
      <div className="rounded-lg overflow-hidden">
        <img src={event.imageUrl} alt={event.title} className="w-full h-96 object-cover"/>
        <div className="p-6">
          <h3 className="text-3xl font-bold text-purple-800">{event.title}</h3>
          <p className="text-gray-600">{`Date: ${event.date}`}</p>
          <p className="text-gray-600">{`Venue: ${event.venue}`}</p>
          <p className="text-gray-600">{`Category: ${event.category}`}</p>
          <p className="text-gray-600">{`Price: ${event.price}`}</p>
          <p className="mt-4">{event.description}</p>
          <div className="mt-4 flex flex-wrap items-center">
            {event.attendees > 0 && (
              <span className="inline-block bg-teal-100 text-teal-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                {`${event.attendees} attendees`}
              </span>
            )}
            {event.restricted && (
              <span className="inline-block bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                Restricted Access{event.restricted && `: ${event.restrictedReason}`}
              </span>
            )}
          </div>
          <div className="mt-4">
            <button className="inline-flex items-center bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg shadow-lg transition-colors duration-300">
              <FaTicketAlt className="mr-2" /> Book Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularEventDetailPage;
