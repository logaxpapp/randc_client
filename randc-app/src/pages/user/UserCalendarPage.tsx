import React, { useMemo, useState } from 'react';
import moment from 'moment';
import {
  Calendar,
  momentLocalizer,
  SlotInfo,
  ToolbarProps,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaSync } from 'react-icons/fa';

import { useAppSelector } from '../../app/hooks';
import { useGetMyBookingsQuery } from '../../features/booking/bookingApi';
import type { Booking } from '../../types/Booking';
import BookingWizardModal from './BookingWizardModal';

function parseUtcToLocal(dateStr: string) {
  return moment.utc(dateStr).local().toDate();
}

const localizer = momentLocalizer(moment);

function CustomToolbar(toolbar: ToolbarProps) {
  const { label, onNavigate, onView } = toolbar;
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-100 rounded mb-4">
      <div className="flex items-center mb-2 md:mb-0">
        <button
          onClick={() => onNavigate('PREV')}
          className="px-3 py-1 mr-2 bg-white rounded hover:bg-gray-200"
        >
          &lt;
        </button>
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-1 bg-white rounded hover:bg-gray-200"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate('NEXT')}
          className="px-3 py-1 ml-2 bg-white rounded hover:bg-gray-200"
        >
          &gt;
        </button>
      </div>
      <div className="font-semibold text-lg">{label}</div>
      <div className="flex items-center mt-2 md:mt-0">
        <button
          onClick={() => onView('day')}
          className="px-3 py-1 bg-white hover:bg-gray-200 transition rounded mr-1"
        >
          Day
        </button>
        <button
          onClick={() => onView('week')}
          className="px-3 py-1 bg-white hover:bg-gray-200 transition rounded mr-1"
        >
          Week
        </button>
        <button
          onClick={() => onView('month')}
          className="px-3 py-1 bg-white hover:bg-gray-200 transition rounded"
        >
          Month
        </button>
      </div>
    </div>
  );
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const CustomEvent = ({ event }: { event: any }) => {
  return (
    <div
      style={{
        backgroundColor: event.color,
        color: '#fff',
        padding: '2px',
        borderRadius: '4px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        transition: 'transform 0.2s ease-in-out',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {event.title}
    </div>
  );
};

const CustomHeader = ({ label }: { label: string }) => {
  return (
    <div
      style={{
        background: 'linear-gradient(45deg, #6EE7B7, #3B82F6)',
        color: '#fff',
        padding: '8px',
        borderRadius: '4px',
        textAlign: 'center',
        fontWeight: 'bold',
      }}
    >
      {label}
    </div>
  );
};

const UserCalendarPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user?._id) {
    return (
      <div className="p-4 text-center text-red-500">
        You must be logged in to view your calendar.
      </div>
    );
  }

  const {
    data: myBookings = [],
    isLoading,
    isError,
    refetch,
  } = useGetMyBookingsQuery();

  const myEvents = useMemo(() => {
    return myBookings.map((b: Booking) => {
      const s = b.timeSlot?.startTime;
      const e = b.timeSlot?.endTime;
      return {
        id: b._id,
        title: b.shortCode
          ? `${b.shortCode}`
          : `Booking (${b._id.slice(-4)})`,
        start: s ? parseUtcToLocal(s) : new Date(),
        end: e ? parseUtcToLocal(e) : new Date(),
        status: b.status,
        originalBooking: b,
        color: getRandomColor(),
      };
    });
  }, [myBookings]);

  function eventPropGetter(event: any) {
    if (event.status === 'CANCELLED') {
      return { style: { backgroundColor: '#fca5a5', color: '#fff' } };
    }
    return { style: { backgroundColor: event.color, color: '#111827' } };
  }

  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    console.log('Clicked empty slot:', slotInfo);
    setEditingBooking(null);
    setWizardOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    console.log('Clicked booking event:', event);
    if (event.originalBooking) {
      setEditingBooking(event.originalBooking);
    } else {
      const found = myBookings.find((b) => b._id === event.id);
      setEditingBooking(found || null);
    }
    setWizardOpen(true);
  };

  function closeWizard() {
    setWizardOpen(false);
    setEditingBooking(null);
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />
      <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-2 font-semibold">
        Manage Your Bookings
      </div>
      <div className="relative z-10 px-4 py-6 md:px-8 min-h-screen">
        <header className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            My Calendar
          </h1>
          <p className="text-gray-500 text-sm">
            View, create, or update your bookings using the calendar.
          </p>
        </header>
        {isLoading && (
          <div className="p-4 flex items-center space-x-2 text-gray-500">
            <FaSync className="animate-spin" />
            <span>Loading bookings...</span>
          </div>
        )}
        {isError && (
          <div className="p-4 text-red-500">
            Failed to load your bookings.{' '}
            <button
              onClick={() => refetch()}
              className="underline text-blue-600"
            >
              Retry
            </button>
          </div>
        )}
        {!isLoading && !isError && (
          <div className="bg-white rounded shadow p-4">
            <Calendar
              localizer={localizer}
              events={myEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 700 }}
              defaultView="week"
              views={['day', 'week', 'month']}
              selectable={true}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventPropGetter}
              components={{
                toolbar: CustomToolbar,
                event: CustomEvent,
                header: CustomHeader,
              }}
              min={new Date(2023, 0, 1, 7, 0)}
              max={new Date(2023, 0, 1, 20, 0)}
            />
          </div>
        )}
      </div>
      {wizardOpen && (
        <BookingWizardModal
          isOpen={wizardOpen}
          onClose={closeWizard}
          bookingToEdit={editingBooking}
        />
      )}
    </section>
  );
};

export default UserCalendarPage;