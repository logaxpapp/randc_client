import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { fetchEventLogs, addEventLog } from '../../features/eventlog/eventLogSlice';
import { fetchUsers } from '../../features/user/userSlice';
import Select from 'react-select';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root'); // Avoid screen reader issues

const CalendarComponent = () => {
  const dispatch = useDispatch();
  const { eventLogs } = useSelector((state) => state.eventLogs);
  const users = useSelector((state) => state.users.list);
  const userId = useSelector((state) => state.auth.user.id);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date().toISOString().slice(0, 16),
    end: new Date().toISOString().slice(0, 16),
    description: '',
    location: '',
    participants: [], // User IDs
    participantEmails: [], // Emails for non-users
    eventType: 'EventScheduled', // Default event type
    entityId: '', // Assuming you have a logic to set this
  });
  

  useEffect(() => {
    dispatch(fetchEventLogs());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
  
    // Convert string dates to Date objects for comparison
    const startDate = new Date(newEvent.start);
    const endDate = new Date(newEvent.end);
  
    // Validate dates: start date should be before end date
    if (startDate >= endDate) {
      alert("The start date must be before the end date.");
      return; // Stop the function execution
    }
  
    // Validate if start and end dates are valid dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("Invalid start or end date.");
      return; // Stop the function execution
    }
    const payload = {
      ...newEvent,
      start: startDate,
      end: endDate,
      userId: userId,
      participants: newEvent.participants.concat(newEvent.participantEmails.map(email => ({ email }))), // Combine users and emails
    };
  
    await dispatch(addEventLog({ newEventLog: payload }));
    setModalIsOpen(false); // Close the modal after submission
  };
  
    // Handlers for changes in form inputs
    const handleTitleChange = (e) => {
      setNewEvent({ ...newEvent, title: e.target.value });
    };
  
    const handleStartDateChange = (e) => {
      setNewEvent({ ...newEvent, start: e.target.value });
    };
  
    const handleEndDateChange = (e) => {
      setNewEvent({ ...newEvent, end: e.target.value });
    };
  
    const handleDescriptionChange = (e) => {
      setNewEvent({ ...newEvent, description: e.target.value });
    };
  
    const handleLocationChange = (e) => {
      setNewEvent({ ...newEvent, location: e.target.value });
    };

    const handleEventTypeChange = (e) => {
      setNewEvent(prevState => ({ ...prevState, eventType: e.target.value }));
    };
    

  // Add handlers for participant selection and email input
  const handleParticipantEmailChange = (e) => {
    // Update your newEvent state to include the email
  };

  const handleAddParticipant = (selectedOptions) => {
    // Convert selected options back to your required format
    const participants = selectedOptions.map(option => option.value);
    setNewEvent({ ...newEvent, participants });
  };
  
  // Mapping users to options for react-select
  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName} - ${user.email}`
  }));
  
  // Custom styles for react-select
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '0.375rem', // Tailwind's rounded-md
      padding: '0.5rem',
      borderColor: '#E5E7EB', // Tailwind's gray-300
      ':hover': {
        borderColor: '#6B7280', // Tailwind's gray-400
      },
      ':focus': {
        borderColor: '#3B82F6', // Tailwind's blue-500
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3B82F6' : '#FFFFFF',
      color: state.isSelected ? '#FFFFFF' : '#000000',
      ':hover': {
        backgroundColor: '#EFF6FF', // Tailwind's blue-50
        color: '#000000',
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#EFF6FF', // Tailwind's blue-50
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#1F2937', // Tailwind's gray-800
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      ':hover': {
        backgroundColor: '#3B82F6', // Tailwind's blue-500
        color: '#FFFFFF',
      }
    }),
  };
  
  const handleActionBegin = (args) => {
    if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
      let eventData = args.data;
  
      // For eventCreate, eventData will be empty, so set up a new event structure
      if (args.requestType === 'eventCreate') {
        eventData = { /* structure for a new event */ };
      }
  
      // Populate the form state with eventData or with a new event structure
      setNewEvent({
        title: eventData.Subject || '',
        start: eventData.StartTime || new Date().toISOString().slice(0, 16),
        end: eventData.EndTime || new Date().toISOString().slice(0, 16),
        description: eventData.Description || '',
        location: eventData.Location || '',
        // Populate other fields as needed
      });
  
      // Open the modal
      setModalIsOpen(true);
    }
  };

  const handleEventRendered = (args) => {
    args.element.setAttribute('title', `${args.data.Description} @ ${args.data.Location}`);
    // Additional customizations as needed
  };
  

  return (
    <div className="">
     <div className="flex justify-end p-1">
        <button
          onClick={() => setModalIsOpen(true)}
          className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out"
          title="Add Event"
        >
          <FontAwesomeIcon icon={faPlusCircle} size="2x" />
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Create Event"
        className="absolute top-20 left-1/4 right-1/4 bottom-40 max-w-lg mx-auto bg-custom-white-2 shadow-md rounded-lg p-12 outline-none overflow-y-auto"
      >
  <h2 className="text-xl text-center font-semibold mb-6">Create Event</h2>
  <form onSubmit={handleEventSubmit} className="grid grid-cols-2 gap-4 text-xs ">
    <div className="col-span-2">
      <select
        className="w-full border-2 border-gray-300 p-3 text-xs rounded-lg focus:outline-none focus:border-blue-500"
        onChange={handleEventTypeChange}
        value={newEvent.eventType}
      >
        <option value="">Select Event Type</option>
        <option value="TaskCreated">Task Created</option>
        <option value="TaskUpdated">Task Updated</option>
        <option value="TaskCompleted">Task Completed</option>
        <option value="EventScheduled">Event Scheduled</option>
      </select>
    </div>
    <div className="col-span-2">
      <input
        className="w-full border-2 border-gray-300 p-3 text-xs rounded-lg focus:outline-none focus:border-blue-500"
        type="text"
        placeholder="Event Title"
        onChange={handleTitleChange}
        value={newEvent.title}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date and Time</label>
      <input
        className="w-full border-2 border-gray-300 text-xs  p-3 rounded-lg focus:outline-none focus:border-blue-500"
        type="datetime-local"
        onChange={handleStartDateChange}
        value={newEvent.start}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">End Date and Time</label>
      <input
        className="w-full border-2 border-gray-300 p-3 text-xs  rounded-lg focus:outline-none focus:border-blue-500"
        type="datetime-local"
        onChange={handleEndDateChange}
        value={newEvent.end}
      />
    </div>
    <div className="col-span-2">
      <textarea
        className="w-full border-2 border-gray-300 p-3 text-xs  rounded-lg focus:outline-none focus:border-blue-500"
        placeholder="Description"
        onChange={handleDescriptionChange}
        value={newEvent.description}
      ></textarea>
    </div>
    <div className="col-span-2">
      <input
        className="w-full border-2 border-gray-300 p-3 text-xs  rounded-lg focus:outline-none focus:border-blue-500"
        type="text"
        placeholder="Location"
        onChange={handleLocationChange}
        value={newEvent.location}
      />
    </div>
    <div className="col-span-2">
  <Select
    isMulti
    name="participants"
    options={userOptions}
    className="basic-multi-select"
    classNamePrefix="select"
    onChange={handleAddParticipant}
    styles={customSelectStyles}
    placeholder="Select participants..."
  />
</div>
    <div className="col-span-2">
      <input
        type="email"
        placeholder="Participant Email"
        onChange={handleParticipantEmailChange}
        className="w-full border-2 border-gray-300 p-3 text-xs  rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
    <div className="col-span-2 flex justify-center mt-4">
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-16 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Event
      </button>
    </div>
  </form>
</Modal>

<ScheduleComponent
  height="650px"
  eventSettings={{
    dataSource: eventLogs.map(log => ({
      Id: log._id,
      Subject: `${log.title} - ${log.eventType}`,
      StartTime: new Date(log.start),
      EndTime: new Date(log.end),
      Location: log.location,
      Description: log.description,
      IsAllDay: log.allDay,
      // Additional fields as necessary
    }))
  }}
  actionBegin={handleActionBegin}
  eventRendered={handleEventRendered}
>
  <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
</ScheduleComponent>


    </div>
  );
};

export default CalendarComponent;
