import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import '@fullcalendar/common/main.css'; 
import './calendar.css';

const Calendar = () => {
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const updateDimensions = () => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth < 768) {
      setCalendarView('listWeek'); // Change to a more mobile-friendly view on smaller screens
    } else {
      setCalendarView('dayGridMonth'); // Default view for larger screens
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  const events = [
    { title: 'Loga Team Standup', date: '2024-04-25', color: '#7986cb' }, // Light Blue
    { title: 'Product Demo', date: '2024-04-07', color: '#33b679' }, // Green
    { title: 'Meeting with Client', date: '2024-04-01', color: '#f6c026' }, // Yellow
    { title: 'Team Standup', date: '2024-04-20', color: '#8e24aa' }, // Purple
    { title: 'Meeting with Client', date: '2024-04-23', color: '#f6c026' }, // Same Yellow
    { title: 'Product Demo', date: '2024-04-22', color: '#33b679' }, // Green
    { title: 'Team Standup', date: '2024-04-25', color: '#7986cb' }, // Light Blue
    { title: 'Product Demo', date: '2024-04-27', color: '#33b679' }, // Green
    { title: 'Meeting with Client', date: '2024-04-28', color: '#f6c026' }, // Yellow
  ];

  // Handle click on calendar events
  const handleEventClick = (clickInfo) => {
    alert(`Event: ${clickInfo.event.title}`);
  };
  
 

  return (
    <div className="p-4 bg-white mx-auto mt-5">
       <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={calendarView}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        }}
        events={events}
        eventClick={handleEventClick}
        moreLinkContent={({ num }) => `+${num} more`} // Customize more link text
        nowIndicator // Display an indicator for the current time
        expandRows // Make the row heights expand to fill the available height
        navLinks // Can click day/week names to navigate views
        selectable // Allow users to highlight multiple days or timeslots
        selectMirror // Display a preview of the area being selected
        dayMaxEvents // Limit the number of events displayed per day
        eventContent={renderEventContent} // Custom render function for events
        select={handleDateSelect} // Handle date selections
        windowResize={updateDimensions} 
      
      />
    </div>
  );
};

// Custom render for events
const renderEventContent = (eventInfo) => (
  <div>
    <strong>{eventInfo.timeText}</strong>
    <span className="ml-3 event-title">{eventInfo.event.title}</span>
  </div>
);

// Handle date selections
const handleDateSelect = (selectInfo) => {
  let title = prompt('Please enter a new title for your event');
  const calendarApi = selectInfo.view.calendar;

  calendarApi.unselect(); // Clear date selection

  if (title) {
    calendarApi.addEvent({
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay
    });
  }
};

export default Calendar;
