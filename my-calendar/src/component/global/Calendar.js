import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FaEdit } from 'react-icons/fa'; // Icon for editing
import  { ReactComponent as GoogleCalendarIcon }  from '../assets/images/google.svg';
import MockEventsIcon from '../assets/images/logo.png';
import EventCreateForm from '../modal/EventCreateForm';
import EventDetailsModal from '../modal/EventDetailsModal';
import EventEditModal from '../modal/EventEditModal';
import '../Integrations/integration.css'

const CalendarView = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchGoogleCalendarEvents();
    }, []);

    const calendarRef = React.createRef();

    useEffect(() => {
      const adjustCalendarHeight = () => {
          const calendarEl = document.querySelector('.fc-daygrid-body'); // Adjust selector as needed
          if (calendarEl) {
              let maxHeight = 0;
              calendarEl.querySelectorAll('.fc-row').forEach(row => {
                  const rowHeight = row.offsetHeight;
                  if (rowHeight > maxHeight) maxHeight = rowHeight;
              });
              calendarEl.style.height = `${maxHeight}px`;
          }
      };
  
      window.addEventListener('resize', adjustCalendarHeight);
      adjustCalendarHeight(); // Initial adjust
  
      return () => {
          window.removeEventListener('resize', adjustCalendarHeight);
      };
  }, []);
  const fetchGoogleCalendarEvents = async () => {
      try {
          const { data } = await axios.get(`${API_URL}/calendars/list`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
          });
          console.log(data);
          const formattedEvents = data.map(event => ({
              id: event.id,
              title: event.summary,
              start: event.start.dateTime || event.start.date,
              end: event.end.dateTime || event.end.date,
              color: '#f8f9fb',  // Google Green
              textColor: 'white',
              location: event.location,
              description: event.description,
              htmlLink: event.htmlLink,
              attendees: event.attendees,
              hangoutLink: event.hangoutLink,
           
          }));
          setEvents(formattedEvents);
      } catch (error) {
          console.error('Error fetching events:', error);
      }
  };
   const handleEventClick = ({ event }) => {
        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };

    const handleEventEditClick = (event, jsEvent) => {
    jsEvent.stopPropagation(); // Prevent the default event behavior
    setSelectedEvent(event);
    setIsEditModalOpen(true);
    setIsEventModalOpen(false); // Optionally close the details modal if it's open
};
    const handleEventAdded = (newEvent) => {
      const formattedEvent = {
          ...newEvent,
          start: newEvent.start.dateTime,
          end: newEvent.end.dateTime,
          color: '#7986cb'  // Set the color or other properties as needed
      };
      setEvents([...events, formattedEvent]);
      setIsCreateModalOpen(false); // Close the create modal
  };
  
    const handleEventUpdated = (updatedEvent) => {
        const updatedEvents = events.map(event => event.id === updatedEvent.id ? updatedEvent : event);
        setEvents(updatedEvents);
        setIsEventModalOpen(false);
    };
    const handleDateClick = (arg) => {
      setSelectedDate(arg.dateStr);
      setIsCreateModalOpen(true);
  };

  const eventContent = (eventInfo) => {
    // Helper function to truncate the title if it's too long
    const truncateTitle = (title) => {
        if (title.length > 20) {
            return title.substring(0, 17) + '...';  // Truncate and add ellipsis
        }
        return title;
    };

    return (
        <div className="flex items-center text-gray-600 p-1 rounded" style={{ fontSize: '0.75rem' }}>
            <span className="flex-1 min-w-0">
                <span className="font-bold mr-1">{eventInfo.timeText}</span>  {/* Time text */}
                <GoogleCalendarIcon className=" mr-1 inline text-xxs  " />
                <span  className="truncate" title={eventInfo.event.title}>{truncateTitle(eventInfo.event.title)}</span> {/* Event title */}
            </span>
            {eventInfo.event.hangoutLink && (
                <a href={eventInfo.hangoutLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                    Join
                </a>
            )}
            <span
                onClick={(jsEvent) => {
                    jsEvent.stopPropagation(); // Prevent default event behavior
                    handleEventEditClick(eventInfo.event, jsEvent);
                }}
                className="p-1 ml-2 hover:bg-yellow-200  cursor-pointer text-custom-blue rounded-full"
                style={{ display: 'inline-flex', alignItems: 'center' }}
            >
                <FaEdit />
            </span>
        </div>
    );
};


return (
  <div className="p-4 bg-white mx-auto mt-5">
     <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventContent={eventContent}
                dateClick={handleDateClick}
                eventClick={({ event }) => setSelectedEvent(event) || setIsEventModalOpen(true)}
            />
      {isEventModalOpen && <EventDetailsModal event={selectedEvent} onClose={() => setIsEventModalOpen(false)} onUpdate={handleEventUpdated} />}
      {isEditModalOpen && <EventEditModal event={selectedEvent} onClose={() => setIsEditModalOpen(false)} />}
      {isCreateModalOpen && <EventCreateForm onEventAdded={handleEventAdded} date={selectedDate} onClose={() => setIsCreateModalOpen(false)} />}
  </div>
);
};

export default CalendarView;
