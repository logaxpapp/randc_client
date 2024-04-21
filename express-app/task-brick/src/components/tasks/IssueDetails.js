import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UpdateTaskForm from './UpdateTaskForm';
import {
  faLink,
  faPaperclip,
  faCommentDots,
  faEdit,
  faPlusSquare,
  faEllipsisV,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import DefaultImage from '../../assets/images/taskbrick.png'; 

const IssueDetails = () => {
  const { tasks, selectedIssueId } = useSelector((state) => state.tasks);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const selectedIssue = tasks.find(task => task._id === selectedIssueId);

  if (!selectedIssue) {
    return <div className="text-center my-4">Select an issue to see the details.</div>;
  }

  const handleOpenUpdateModal = () => setUpdateModalOpen(true);
  const handleCloseUpdateModal = () => setUpdateModalOpen(false);

  return (
    <div className="bg-gray-50 h-auto p-4 border-r border-l  space-y-6 sm:p-6 lg:p-8 max-w-4xl mx-auto my-6">
      <header className="flex justify-between items-center">
        <h1 className="text-xs sm:text-lg font-bold max-w-2xl text-start mx-auto text-gray-800">{selectedIssue.summary}</h1>
        <div>
          <FontAwesomeIcon icon={faEdit} className="text-blue-500 cursor-pointer hover:text-blue-700" onClick={handleOpenUpdateModal} />
          <FontAwesomeIcon icon={faEllipsisV} className="ml-4 text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
      </header>

      <div className="space-y-4">
        {/* <section>
          <h2 className="font-semibold text-gray-800">Summary</h2>
          <p>{selectedIssue.summary}</p>
        </section> */}

        <hr   className="my-4" />

        <section>
          <h2 className="font-semibold  text-sm sm:text-lg mb-2 text-gray-800">Attachments</h2>
          <div className="flex flex-wrap gap-2 items-center">
            {selectedIssue.imageUrls && selectedIssue.imageUrls.length > 0 ? (
              selectedIssue.imageUrls.map((url, index) => (
                <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="hover:shadow-lg transition">
                  <img src={url} alt={`Attachment ${index + 1}`} className="h-20 w-20 object-cover rounded-lg" />
                </a>
              ))
            ) : (
              <img src={DefaultImage} alt="Default placeholder" className="h-40 w-40 object-cover rounded-lg shadow" />
            )}
            <FontAwesomeIcon icon={faPlusSquare} className="text-green-500 cursor-pointer hover:text-green-700" />
          </div>
        </section>
        <hr   className="my-4" />

        <section>
          <h2 className="font-semibold text-sm sm:text-lg mb-4 text-gray-800">Description</h2>
          <p className='max-w-3xl text-start text-xs sm:text-sm'>{selectedIssue.description}</p>
        </section>
        <hr className="my-4" />

        <section>
          <h2 className="font-semibold  text-sm sm:text-lg text-gray-800">Comments</h2>
          {/* Mock comment */}
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCommentDots} className="text-gray-500" />
            <p className="ml-2">No comments yet.</p>
          </div>
          <div className="flex mt-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="border border-gray-300 rounded p-2 flex-grow mr-2"
            />
            <FontAwesomeIcon icon={faPlus} className="text-gray-500 cursor-pointer hover:text-gray-700" />
          </div>
        </section>
      </div>

      {isUpdateModalOpen && (
        <UpdateTaskForm open={isUpdateModalOpen} onClose={handleCloseUpdateModal} taskId={selectedIssueId} />
      )}
    </div>
  );
};

export default IssueDetails;
