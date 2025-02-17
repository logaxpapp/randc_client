import React, { useState, useMemo } from 'react';
import moment from 'moment';
import {
  Calendar,
  momentLocalizer,
  SlotInfo,
  ToolbarProps,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaSync } from 'react-icons/fa';

import EventModal from '../../components/EventModal';
import { useAppSelector } from '../../app/hooks';
import { useListBookingsQuery } from '../../features/booking/bookingApi';
import {
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
} from '../../features/tenant/tenantApi';
import {
  useListEventsByTenantQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  EventPayload,
} from '../../features/event/eventApi';
import type { Booking } from '../../types/Booking';
import Toast from '../../components/ui/Toast';

function parseUtcToLocal(dateStr: string) {
  return moment.utc(dateStr).local().toDate();
}

const localizer = momentLocalizer(moment);

function getDayOfWeek(date: Date) {
  return date.getDay();
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

const TenantCalendarPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  const {
    data: tenantData,
    error: tenantError,
    isLoading: tenantLoading,
  } = useGetTenantByIdQuery(tenantId || '', { skip: !tenantId });
  const [updateTenant] = useUpdateTenantMutation();

  const {
    data: bookingsData,
    error: bookingsError,
    isLoading: bookingsLoading,
  } = useListBookingsQuery();

  const {
    data: customEventsData,
    error: customEventsError,
    isLoading: customEventsLoading,
  } = useListEventsByTenantQuery(tenantId || '', { skip: !tenantId });

  const [createEvent] = useCreateEventMutation();
  const [modifyEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventPayload | null>(null);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const bookingEvents = useMemo(() => {
    if (!bookingsData) return [];
    return bookingsData
      .map((b: Booking) => {
        const s = b.timeSlot?.startTime;
        const e = b.timeSlot?.endTime;
        if (!s || !e) return null;

        return {
          id: b._id,
          title: `Booking ${b.shortCode || ''}`,
          start: parseUtcToLocal(s),
          end: parseUtcToLocal(e),
          status: b.status,
          category: 'BOOKING' as const,
          notes: b.notes || '',
          color: getRandomColor(), // Add random color
        };
      })
      .filter(Boolean);
  }, [bookingsData]);

  const breakEvents = useMemo(() => {
    if (!tenantData?.settings?.workDays) return [];
    const results: any[] = [];

    tenantData.settings.workDays.forEach((wd: any) => {
      const dayMoment = moment().startOf('week').add(wd.dayOfWeek, 'days');
      wd.breaks.forEach((br: any) => {
        const [startH, startM] = br.start.split(':').map(Number);
        const [endH, endM] = br.end.split(':').map(Number);

        const breakStart = dayMoment.clone().hour(startH).minute(startM);
        const breakEnd = dayMoment.clone().hour(endH).minute(endM);

        results.push({
          id: `break-${wd.dayOfWeek}-${br.start}`,
          title: 'Break',
          start: breakStart.toDate(),
          end: breakEnd.toDate(),
          category: 'BREAK' as const,
          notes: '',
          color: getRandomColor(), // Add random color
        });
      });
    });
    return results;
  }, [tenantData]);

  const customEvents = useMemo(() => {
    if (!customEventsData) return [];
    return customEventsData.map((ev) => ({
      id: ev._id,
      title: ev.title || (ev.type === 'BREAK' ? 'Break' : 'Custom Event'),
      start: parseUtcToLocal(ev.startTime),
      end: parseUtcToLocal(ev.endTime),
      status: ev.status,
      notes: ev.notes || '',
      category:
        ev.type === 'BREAK' ? 'BREAK' : ev.type === 'BOOKING' ? 'BOOKING' : 'CUSTOM',
      color: getRandomColor(), // Add random color
    }));
  }, [customEventsData]);

  const allEvents = useMemo(() => {
    return [...bookingEvents, ...breakEvents, ...customEvents];
  }, [bookingEvents, breakEvents, customEvents]);

  function eventPropGetter(event: any) {
    switch (event.category) {
      case 'BREAK':
        return {
          style: {
            backgroundColor: event.color, // Use random color
            color: '#6b7280',
          },
        };
      case 'BOOKING':
        if (event.status === 'CANCELLED') {
          return { style: { backgroundColor: '#fca5a5', color: '#fff' } };
        }
        return { style: { backgroundColor: event.color, color: '#1e3a8a' } }; // Use random color
      case 'CUSTOM':
      default:
        return { style: { backgroundColor: event.color, color: '#111827' } }; // Use random color
    }
  }

  function CustomToolbar(toolbar: ToolbarProps) {
    const { label, onNavigate, onView } = toolbar;

    const goToBack = () => onNavigate('PREV');
    const goToNext = () => onNavigate('NEXT');
    const goToToday = () => onNavigate('TODAY');

    return (
      <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-100 rounded mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <button
            onClick={goToBack}
            className="px-3 py-1 mr-2 bg-white rounded hover:bg-gray-200"
          >
            &lt;
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 bg-white rounded hover:bg-gray-200"
          >
            Today
          </button>
          <button
            onClick={goToNext}
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

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (!tenantId) return;
    const startTime = (slotInfo.start as Date).toISOString();
    const endTime = (slotInfo.end as Date).toISOString();
    const newEvent: EventPayload = {
      tenant: tenantId,
      type: 'OTHER',
      title: '',
      startTime,
      endTime,
      status: 'PENDING',
      notes: '',
    };
    setSelectedEvent(newEvent);
    setModalOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent({
      _id: event.id,
      tenant: tenantId!,
      type:
        event.category === 'BREAK'
          ? 'BREAK'
          : event.category === 'BOOKING'
          ? 'BOOKING'
          : 'OTHER',
      title: event.title || '',
      startTime: event.start.toISOString(),
      endTime: event.end.toISOString(),
      status: event.status || 'PENDING',
      notes: event.notes || '',
    });
    setModalOpen(true);
  };

  const handleSaveEvent = async (payload: EventPayload) => {
    try {
      if (payload.type === 'BREAK') {
        await handleSaveBreak(payload);
        showToast('Break saved successfully.');
      } else if (payload.type === 'BOOKING') {
        showToast("Can't edit booking times from here.");
      } else {
        await handleSaveCustom(payload);
        showToast('Event saved successfully.');
      }
    } catch (err) {
      console.error('Error saving event:', err);
      showToast('Failed to save event.');
    }
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId).unwrap();
      showToast('Event deleted successfully.');
    } catch (err) {
      console.error('Failed to delete event:', err);
      showToast('Failed to delete event.');
    }
    setModalOpen(false);
    setSelectedEvent(null);
  };

  async function handleSaveBreak(payload: EventPayload) {
    if (!tenantData) return;

    const start = moment.utc(payload.startTime).local().toDate();
    const end = moment.utc(payload.endTime).local().toDate();
    const dayOfWeek = getDayOfWeek(start);

    const startH = String(start.getHours()).padStart(2, '0');
    const startM = String(start.getMinutes()).padStart(2, '0');
    const endH = String(end.getHours()).padStart(2, '0');
    const endM = String(end.getMinutes()).padStart(2, '0');

    const newBreak = { start: `${startH}:${startM}`, end: `${endH}:${endM}` };
    const updatedWorkDays = [...tenantData.settings.workDays];
    const dayIndex = updatedWorkDays.findIndex((wd: any) => wd.dayOfWeek === dayOfWeek);

    if (dayIndex < 0) {
      updatedWorkDays.push({
        dayOfWeek,
        openTime: '08:00',
        closeTime: '17:00',
        breaks: [newBreak],
      });
    } else {
      updatedWorkDays[dayIndex].breaks.push(newBreak);
    }

    await updateTenant({
      tenantId: tenantId!,
      data: {
        settings: {
          ...tenantData.settings,
          workDays: updatedWorkDays,
        },
      },
    }).unwrap();
  }

  async function handleSaveCustom(payload: EventPayload) {
    if (payload._id) {
      await modifyEvent({ eventId: payload._id, data: payload }).unwrap();
    } else {
      await createEvent(payload).unwrap();
    }
  }

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 3000);
  };

  if (!tenantId) {
    return (
      <div className="p-4 bg-red-100 text-red-500 rounded">
        <p>No tenant assigned to your account.</p>
      </div>
    );
  }
  if (tenantLoading || bookingsLoading || customEventsLoading) {
    return (
      <div className="p-4 flex items-center space-x-2 text-gray-500">
        <FaSync className="animate-spin" />
        <span>Loading calendar data...</span>
      </div>
    );
  }
  if (tenantError || bookingsError || customEventsError) {
    return (
      <div className="p-4 bg-red-100 text-red-600 rounded">
        <p>Error loading data.</p>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />
      <div className="sticky top-0 z-10 bg-yellow-200 text-yellow-800 p-1 font-semibold shadow-md">
        <strong>Vital Message:</strong> Manage Bookings, Breaks, and Events Efficiently!
      </div>

      <div className="relative z-10 p-4 min-h-screen mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-700">
            Manage Bookings, Breaks, and Events
          </h1>
          <p className="text-gray-500 mt-2">
            Bookings come from timeSlots. Events have start/end.
          </p>
        </header>

        <main className="bg-white rounded-lg shadow p-6">
          <Calendar
            localizer={localizer}
            events={allEvents}
            defaultView="week"
            views={['day', 'week', 'month']}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 700 }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventPropGetter}
            min={new Date(2023, 0, 1, 7, 0)}
            max={new Date(2023, 0, 1, 20, 0)}
            components={{ toolbar: CustomToolbar, event: CustomEvent, header: CustomHeader }}
            defaultDate={new Date()}
          />
        </main>

        {modalOpen && selectedEvent && (
          <EventModal
            eventData={selectedEvent}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
          />
        )}

        <Toast
          show={toastShow}
          message={toastMessage}
          onClose={() => setToastShow(false)}
        />
      </div>

      <div className="absolute bottom-0 w-full leading-none z-0">
       
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,75,1152,69.3C1248,64,1344,96,1392,112L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default TenantCalendarPage;
