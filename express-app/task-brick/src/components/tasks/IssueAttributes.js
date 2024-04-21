import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTag, faCalendarAlt, faTools, faPlus, faFileSignature, faCogs, faTimes, faUserFriends, faDiamond } from '@fortawesome/free-solid-svg-icons';


import 'react-datepicker/dist/react-datepicker.css';
import { useFilters } from '../../context/useFilters';
import AttributeUpdateModal from '../modal/AttributeUpdateModal';

const IssueAttributes = () => {
  const { filters } = useFilters();
  const { tasks, selectedIssueId } = useSelector((state) => state.tasks);
  console.log('Tasks', tasks);
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

  const assignee = `${selectedIssue.assigneeId.firstName} ${selectedIssue.assigneeId.lastName}`;
  const reporter =  `${selectedIssue.reporterId.firstName} ${selectedIssue.reporterId.lastName}`;
 
  const teamName = selectedIssue.teamId ? selectedIssue.teamId.name : null;

  const reporterEmail =` ${selectedIssue.reporterId.email}`
  return (
    <div className="p-4 bg-gray-50 shadow-lg rounded-lg min-h-screen">
      {/* Header Section with Title */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800">{selectedIssue.title}</h3>
      </div>
      <hr className="my-4" />
  
      <div className="flex flex-col gap-6">
        {/* Row for Type, Status, Priority with Descriptive Labels */}
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFileSignature} />
            <span className='text-xs text-gray-500'>Type:</span>
            <button onClick={() => handleOpenModal('type')} className="bg-blue-100 text-xs sm:text-sm px-3 py-1 rounded-full text-blue-800">
              {selectedIssue.type}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCogs} />
            <span className='text-xs text-gray-500'>Status:</span>
            <button onClick={() => handleOpenModal('status')} className="bg-green-100 text-xs sm:text-sm px-3 py-1 rounded-full text-green-800">
              {selectedIssue.status}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faTools} />
            <span className='text-xs text-gray-500'>Priority:</span>
            <button onClick={() => handleOpenModal('priority')} className="bg-yellow-100 text-xs sm:text-sm px-3 py-1 rounded-full text-yellow-800">
              {selectedIssue.priority}
            </button>
          </div>
        </div>
        <hr className="my-4" />

{/* Assigned Details Section */}
<div className="bg-white  p-4">
  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Assigned Details</h3>
  
  {/* Assignee Name */}
  <div className="mt-4">
    <div className="flex justify-between items-center py-2">
    <span className="md:block hidden font-medium text-xs sm:text-sm text-gray-600">Name:</span>

      <button onClick={() => handleOpenModal('assignee')} className="bg-red-100 text-xs sm:text-sm px-3 py-1 rounded-full text-red-800 hover:bg-red-200 transition duration-150 ease-in-out">
        {assignee ? `${assignee}` : 'Assign to me'}
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
</div>

<hr className="my-4" />

  
        {/* Dates */}
       
          <div className="flex justify-between">
            <span className='text-xs sm:text-sm'>Start date:</span>
            <span className='text-xs sm:text-sm'>{formatDate(selectedIssue.createdAt)}</span>
          </div>
          
     

        <div className="flex justify-between">
            <span className='text-xs sm:text-sm'>Due date:</span>
            <button onClick={() => handleOpenModal('dueDate')} className=" text-xs sm:text-sm text-blue-600 hover:underline">
              {formatDate(selectedIssue.dueDate)}
            </button>
          </div>
  
        {/* Creator */}
        <div className="flex justify-between items-center">
          <span className='text-xs sm:text-sm'>Created by:</span>
          <button onClick={() => handleOpenModal('reportedBy')} className="text-xs sm:text-sm bg-red-100 px-3 py-1 rounded-full text-red-800">
            {reporter ? `${reporter}` : 'Unknown'}
          </button>
        </div>
  
        {/* Tags */}
        <div className="flex flex-col gap-2">
          <span>Tags</span>
          <hr   className="my-4" />
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
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex items-center justify-between">
            <span>Parent Id:</span>
            <span className={`px-3 py-1 rounded-full text-sm ${selectedIssue.parentId ? 'text-xs sm:text-sm bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {selectedIssue.parentId ? selectedIssue.parentId : 'None'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Team:</span>
            <span className={`px-3 py-1 rounded-full text-sm ${teamName ? 'bg-green-100 text-green-800 text-xs sm:text-sm' : 'bg-red-100 text-red-800'}`}>
              {teamName ? teamName : 'None'}
            </span>
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
      />
    </div>
  );
  
  
};

export default IssueAttributes;
