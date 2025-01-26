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

// Booking hooks (no direct title/startTime in model)
import {
  useListBookingsQuery,
} from '../../features/booking/bookingApi';

// Tenant & breaks
import {
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
} from '../../features/tenant/tenantApi';

// Event hooks (title/startTime/endTime exist here)
import {
  useListEventsByTenantQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  EventPayload,
} from '../../features/event/eventApi';

import type { Booking } from '../../types/Booking'; // booking lacks direct "title" or "start"
import Toast from '../../components/ui/Toast';

/** 
 * Key helper: parse a UTC date string into a local Date 
 * so it displays properly in local time
 */
function parseUtcToLocal(dateStr: string) {
  return moment.utc(dateStr).local().toDate();
}

const localizer = momentLocalizer(moment);

// Helper to get day-of-week (0=Sunday,...6=Saturday)
function getDayOfWeek(date: Date) {
  return date.getDay();
}

const TenantCalendarPage: React.FC = () => {
  // Access tenant from Redux
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  // 1) Fetch tenant
  const {
    data: tenantData,
    error: tenantError,
    isLoading: tenantLoading,
  } = useGetTenantByIdQuery(tenantId || '', { skip: !tenantId });
  const [updateTenant] = useUpdateTenantMutation();

  // 2) Fetch bookings (do not have direct "title"/"start"/"end")
  const {
    data: bookingsData,
    error: bookingsError,
    isLoading: bookingsLoading,
  } = useListBookingsQuery();

  // 3) Fetch custom events (which do have "title","startTime","endTime")
  const {
    data: customEventsData,
    error: customEventsError,
    isLoading: customEventsLoading,
  } = useListEventsByTenantQuery(tenantId || '', { skip: !tenantId });

  const [createEvent] = useCreateEventMutation();
  const [modifyEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  // 4) State for modal and toast
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventPayload | null>(null);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 5) Convert Bookings => Calendar events
  const bookingEvents = useMemo(() => {
    if (!bookingsData) return [];
    return bookingsData.map((b: Booking) => {
      const s = b.timeSlot?.startTime;
      const e = b.timeSlot?.endTime;
      if (!s || !e) return null; // no timeslot => skip

      return {
        id: b._id,
        title: `Booking ${b.shortCode || ''}`,
        start: parseUtcToLocal(s),
        end: parseUtcToLocal(e),
        status: b.status,
        category: 'BOOKING' as const,
        notes: b.notes || '',
      };
    }).filter(Boolean);
  }, [bookingsData]);

  // 6) Convert tenant "breaks" => events
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
        });
      });
    });
    return results;
  }, [tenantData]);

  // 7) Convert custom events => events
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
        ev.type === 'BREAK'
          ? 'BREAK'
          : ev.type === 'BOOKING'
          ? 'BOOKING'
          : 'CUSTOM',
    }));
  }, [customEventsData]);

  // 8) Combine
  const allEvents = useMemo(() => {
    return [...bookingEvents, ...breakEvents, ...customEvents];
  }, [bookingEvents, breakEvents, customEvents]);

  // 9) Event styling
  function eventPropGetter(event: any) {
    switch (event.category) {
      case 'BREAK':
        return {
          style: {
            backgroundColor: '#ecf0f1', // soft yellow
            color: '#6b7280',
          },
        };
      case 'BOOKING':
        if (event.status === 'CANCELLED') {
          return { style: { backgroundColor: '#fca5a5', color: '#fff' } };
        }
        // normal booking => lightblue
        return { style: { backgroundColor: '#ecf0f1 ', color: '#1e3a8a' } };
      case 'CUSTOM':
      default:
        return { style: { backgroundColor: '#cbd5e1', color: '#111827' } };
    }
  }

  // 10) Custom toolbar
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

  // 11) handle empty slot => create new "OTHER" event
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

  // 12) handle existing event => open modal
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

  // 13) handle saving an event
  const handleSaveEvent = async (payload: EventPayload) => {
    try {
      if (payload.type === 'BREAK') {
        await handleSaveBreak(payload);
        showToast('Break saved successfully.');
      } else if (payload.type === 'BOOKING') {
        // Bookings come from timeSlot => can't update start/end from here
        showToast("Can't edit booking times from here.");
      } else {
        // 'OTHER' => custom
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

  // saveBreak => push into tenant settings
  async function handleSaveBreak(payload: EventPayload) {
    if (!tenantData) return;

    const start = moment.utc(payload.startTime).local().toDate();
    const end = moment.utc(payload.endTime).local().toDate();
    const dayOfWeek = getDayOfWeek(start);

    const startH = String(start.getHours()).padStart(2, '0');
    const startM = String(start.getMinutes()).padStart(2, '0');
    const endH   = String(end.getHours()).padStart(2, '0');
    const endM   = String(end.getMinutes()).padStart(2, '0');

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

  // saveCustom => normal events in /events
  async function handleSaveCustom(payload: EventPayload) {
    if (payload._id) {
      await modifyEvent({ eventId: payload._id, data: payload }).unwrap();
    } else {
      await createEvent(payload).unwrap();
    }
  }

  // Toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 3000);
  };

  // 15) Check loading / errors
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

  // 16) Render
  return (
    <div className="p-4 bg-gray-50 min-h-screen mx-auto">
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
          // show only 7:00 AM - 8:00 PM
          min={new Date(2023, 0, 1, 7, 0)}
          max={new Date(2023, 0, 1, 20, 0)}
          components={{ toolbar: CustomToolbar }}
          // Start on current date, so user sees "today"
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
  );
};

export default TenantCalendarPage;
