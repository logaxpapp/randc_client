import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchComments } from '../../features/comment/commentSlice';
import UpdateTaskForm from './UpdateTaskForm';
import {
  faLink,
  faEdit,
  faPlusSquare,
  faEllipsisV,

} from '@fortawesome/free-solid-svg-icons';
import ListComments from '../comment/ListComments';
import CreateComment from '../comment/CreateComment';
import DefaultImage from '../../assets/images/taskbrick.png'; 

const IssueDetails = () => {
  const { tasks, selectedIssueId } = useSelector((state) => state.tasks);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const comments = useSelector((state) => state.comments.comments);
  const selectedIssue = tasks.find(task => task._id === selectedIssueId);
  const dispatch = useDispatch();

  // Fetch comments for the selected task
  useEffect(() => {
    if (selectedIssueId) {
      dispatch(fetchComments({ taskId: selectedIssueId }));
    }
  }, [dispatch, selectedIssueId]);

  if (!selectedIssue) {
    return <div className="text-center my-4">Select an issue to see the details.</div>;
  }

  const handleOpenUpdateModal = () => setUpdateModalOpen(true);
  const handleCloseUpdateModal = () => setUpdateModalOpen(false);
  const handleEditComment = (comment) => {
    // Logic to edit the comment
    console.log('Editing comment:', comment);
  };
  
  const handleDeleteComment = (commentId) => {
    // Logic to delete the comment
    console.log('Deleting comment with ID:', commentId);
  };
  
  const handleReactToComment = (comment, reactionType) => {
    // Logic to add a reaction to the comment
    console.log(`Reacting to comment ${comment._id} with ${reactionType}`);
  };
  const projectName = selectedIssue?.projectId?.name || 'N/A';
  return (
    <div className="bg-gray-50 border-r border-l sm:p-6 lg:p-8 mx-auto my-6 text-gray-700 max-w-4xl">
    <div className="space-y-6">
      {/* Project Name */}
      <div className="max-w-2xl mx-auto text-start">
      <h1 className="text-xs sm:text-lg font-bold text-gray-500">
          Project name: {projectName}
        </h1>
        <hr className="border-b-2 text-gray-500" />
      </div>
      
      {/* Issue Summary & Actions */}
      <div className="flex justify-between items-center max-w-2xl mx-auto text-start">
        <h1 className="text-xs sm:text-lg font-bold text-gray-500">
          {selectedIssue.summary}
        </h1>
        <div className="flex items-center">
          <FontAwesomeIcon 
            icon={faEdit} 
            className="text-blue-500 cursor-pointer hover:text-blue-700" 
            onClick={handleOpenUpdateModal} 
          />
          <FontAwesomeIcon 
            icon={faEllipsisV} 
            className="ml-4 text-gray-500 cursor-pointer hover:text-gray-700" 
          />
        </div>
      </div>
    </div>

      <div className="space-y-4">
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

        <section className="comments-section mt-8">
        <h2 className="font-semibold text-lg text-gray-800">Comments</h2>
        <hr className="my-4" />

        <ListComments comments={comments} />
        <CreateComment taskId={selectedIssueId} />
      </section>
      </div>

      {isUpdateModalOpen && (
        <UpdateTaskForm open={isUpdateModalOpen} onClose={handleCloseUpdateModal} taskId={selectedIssueId} />
      )}
    </div>
  );
};

export default IssueDetails;
