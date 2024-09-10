import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTag, faCalendarAlt, faTools, faPlus, faFileSignature, faCogs, faTimes, faUserFriends, faDiamond } from '@fortawesome/free-solid-svg-icons';
import 'react-datepicker/dist/react-datepicker.css';
import { useFilters } from '../../context/useFilters';
import { fetchTeams } from '../../features/team/teamSlice';
import AttributeUpdateModal from '../modal/AttributeUpdateModal';

const IssueAttributes = () => {
  const { filters } = useFilters();
  const { tasks, selectedIssueId } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.teams);

  useEffect(() => {
    if (teams.length === 0) {
      dispatch(fetchTeams());
    }
  }, [dispatch, teams.length]);
  console.log(teams);

  const selectedIssue = tasks.find(task => task._id === selectedIssueId);
  
  // New state for managing modal visibility and the current attribute to update
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAttribute, setCurrentAttribute] = useState('');

  if (!selectedIssue) {
    return <div>Select an issue to see its attributes.</div>;
  }

  // Function to open the modal and set the current attribute
  const handleOpenModal = (attribute) => {
    setCurrentAttribute(attribute);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const dueDateStatusColor = (dateString) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
    const differenceInDays = (dueDate - today) / oneDay;
  
    if (differenceInDays < 0) {
      return 'text-red-700 font-bold'; // Past due date
    } else if (differenceInDays < 7) {
      return 'text-red-400 font-semibold'; // Due within a week
    } else {
      return 'text-blue-600'; // Due date is not within a week
    }
  };


// show only first 6 characters of a string
// Modified to handle null or undefined inputs
function truncateString(str, num) {
  if (!str) return ''; // Return empty string if str is falsy (null, undefined, etc.)
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const assignee = `${selectedIssue.assigneeId?.firstName} ${selectedIssue.assigneeId?.lastName}`;
  const reporter =  `${selectedIssue.reporterId?.firstName} ${selectedIssue.reporterId?.lastName}`;
 
  const teamName = selectedIssue.teamId ? selectedIssue.teamId?.name : null;

  const parentName = selectedIssue.parentId? selectedIssue.parentId?.title : null;

  const reporterEmail =` ${selectedIssue.reporterId?.email}`
  
  return (
    <div className="p-4 bg-gray-50 shadow-sm rounded-lg min-h-screen text-black">
{/* Header Section with Title */}
<div className="mb-4 p-3 bg-gradient-to-r from-gray-400 to-slate-300 rounded-sm shadow">
  <div className="flex items-center space-x-2">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h1m0 0h-1m0 0V9h1m10 3v9m-1.5-2.5a1.5 1.5 0 00-3 0v3m3 0a1.5 1.5 0 01-3 0m3 0v-3m0 0V9a2 2 0 00-2-2h-6a2 2 0 00-2 2v3m8 0H7" />
    </svg>
    <h3 className="text-xl font-bold text-white">
      <span>Issue Title:</span> {capitalizeFirstLetter(selectedIssue.title)}
    </h3>
  </div>
</div>
<hr className="my-4" />

  
      <div className="grid gap-4">
        {/* Row for Type, Status, Priority with Descriptive Labels */}
        <div className="flex flex-wrap justify-between gap-4">
  {/* Type Card */}
  <div className="flex-1 bg-blue-100 rounded-lg overflow-hidden shadow">
    <div className="flex items-center justify-between p-4 text-blue-800">
      <div className="flex items-center gap-1">
        <FontAwesomeIcon icon={faFileSignature} className="text-lg" />
        <span className="text-xs  md:text-sm font-semibold">Type:</span>
      </div>
      <button onClick={() => handleOpenModal('type')} className="text-sm px-3 py-1 rounded-full bg-blue-200 hover:bg-blue-300 transition-colors">
        {selectedIssue.type}
      </button>
    </div>
  </div>

  {/* Status Card */}
  <div className="flex-1 bg-green-100 rounded-lg overflow-hidden shadow">
    <div className="flex items-center justify-between p-4 text-green-800">
      <div className="flex items-center gap-1">
        <FontAwesomeIcon icon={faCogs} className="text-xs md:text-lg" />
        <span className="text-xs  md:text-sm font-semibold">Status:</span>
      </div>
      <button onClick={() => handleOpenModal('status')} className="text-xs px-3 py-1 rounded-full bg-green-200 hover:bg-green-300 transition-colors">
        {selectedIssue.status}
      </button>
    </div>
  </div>

  {/* Priority Card */}
  <div className="flex-1 bg-yellow-100 rounded-lg overflow-hidden shadow">
    <div className="flex items-center justify-between p-4 text-yellow-800">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faTools} className="text-xs md:text-lg"/>
        <span className="text-xs md:text-sm font-semibold">Priority:</span>
      </div>
      <button onClick={() => handleOpenModal('priority')} className="text-xs px-3 py-1 rounded-full bg-yellow-200 hover:bg-yellow-300 transition-colors">
        {selectedIssue.priority}
      </button>
    </div>
  </div>
</div>

        <hr className="my-4" />

        {/* Assigned Details Section */}
        {/* Assignee Name */}
<div className="mt-4">
  <div className="flex justify-between items-center py-2">
    <span className="hidden md:block font-medium text-sm text-gray-600">Name:</span>
    <button 
      onClick={() => handleOpenModal('assigneeId')} 
      className="bg-green-100 text-sm px-3 py-1 rounded-full text-green-800 hover:bg-red-200 transition duration-150 ease-in-out shadow-xl"
    >
      {selectedIssue.assigneeId ? `${selectedIssue.assigneeId.firstName} ${selectedIssue.assigneeId.lastName}` : 'Assign to me'}
    </button>
  </div>
</div>

  {/* Assignee Email */}
  <div className="mt-2">
            <div className="flex justify-between items-center py-2">
              <span className="md:block text-xs sm:text-sm hidden font-medium text-gray-600">Email:</span>
              <span className="text-xs sm:text-sm text-blue-500 hover:text-blue-600 transition duration-150 ease-in-out">
                {reporterEmail}
              </span>
            </div>
          </div>
        <hr className="my-4" />

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className='text-xs sm:text-sm'>Start date:</span>
            <span className='text-xs sm:text-sm'>{formatDate(selectedIssue.createdAt)}</span>
          </div>
          
          <div className="flex justify-between">
          <span className='text-xs sm:text-sm'>Due date:</span>
          <button 
            onClick={() => handleOpenModal('dueDate')} 
            className={`text-xs sm:text-sm hover:underline ${dueDateStatusColor(selectedIssue.dueDate)}`}
          >
            {formatDate(selectedIssue.dueDate)}
          </button>
        </div>

        </div>
        <hr className="my-4" />
  
        {/* Creator */}
        <div className="flex justify-between items-center">
          <span className='text-xs sm:text-sm'>Created by:</span>
          <button onClick={() => handleOpenModal('reportedBy')} className="text-xs sm:text-sm bg-green-100 px-3 py-1 rounded-full text-green-800">
            {reporter ? `${reporter}` : 'Unknown'}
          </button>
        </div>
  
        {/* Tags */}
        <div>
          <span>Tags</span>
          <hr className="my-4" />
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            {selectedIssue.tags.map((tag, index) => (
              <button key={index} onClick={() => handleOpenModal('tags', tag)} className="bg-gray-200 border border-gray-300 px-4 py-1 rounded-full flex items-center">
                {tag}
                <FontAwesomeIcon icon={faTimes} className="ml-2 text-red-600" />
              </button>
            ))}
            <FontAwesomeIcon icon={faPlus} onClick={() => handleOpenModal('tags')} className="text-green-600 cursor-pointer" />
          </div>
        </div>
        <hr className="my-4" />
  
        {/* Parent Id and Team */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold">Parent Task:</span>
          <button
            onClick={() => handleOpenModal('parentId')}
            className={`flex items-center px-3 py-1 rounded-full text-xs sm:text-sm ${selectedIssue.parentId ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            title={parentName} // Tooltip to show full name on hover
          >
            <FontAwesomeIcon icon={faDiamond} className="mr-2 text-yellow-400" /> 
            {selectedIssue.parentId ? truncateString(parentName, 8) : 'None'}
          </button>
        </div>

          <div className="flex justify-between items-center">
          <span className='text-xs sm:text-sm'>Team Name:</span>
          <button onClick={() => handleOpenModal('teamId')} className="text-xs sm:text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full text-red-800">
          <FontAwesomeIcon icon={faUserFriends} className="mr-2 text-yellow-400"  title={teamName} /> 
            {teamName ? truncateString(teamName, 8) : 'None'}
          </button>
        </div>
        </div>
        <hr className="my-4" />
  
        {/* Created and Updated Dates */}
        <div className="flex flex-col gap-2">
          <span className='text-xs sm:text-sm'>Created: {formatDate(selectedIssue.createdAt)}</span>
          <span className='text-xs sm:text-sm'>Updated: {formatDate(selectedIssue.updatedAt)}</span>
        </div>
      </div>
  
      {/* Update Modal */}
      <AttributeUpdateModal
        open={isModalOpen}
        onClose={handleCloseModal}
        attribute={currentAttribute}
        selectedIssue={selectedIssue}
        tasks={tasks}
        teams={teams}
      />
    </div>
  );
};

export default IssueAttributes;
