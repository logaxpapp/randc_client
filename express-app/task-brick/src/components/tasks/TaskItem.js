import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedIssueId } from '../../features/tasks/taskSlice';



const TaskItem = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  const toggleSummary = () => {
    setIsExpanded(!isExpanded);
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'InProgress':
        return 'bg-blue-400 text-white';
      case 'Completed':
        return 'bg-green-400 text-white';
      case 'Pending':
        return 'bg-yellow-400 text-black';
      case 'Cancelled':
        return 'bg-red-400 text-white';
      case 'OnHold':
        return 'bg-orange-400 text-white';
      case 'Reviewed':
        return 'bg-purple-400 text-white';
      case 'ToDo':
        return 'bg-indigo-400 text-white';
      // ... add more cases for other statuses
      default:
        return 'bg-gray-400 text-white';
    }
  };
  

  // Component to render the assignee initials with random background color
const AssigneeInitials = ({ assignee }) => {
    // If assignee is not provided or does not have firstName or lastName, return a placeholder
    if (!assignee || !assignee.firstName || !assignee.lastName) {
      return (
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-300">
          <span className="text-white text-sm">?</span>
        </div>
      );
    }
};

  // Function to truncate the summary
  const truncateSummary = (summary, wordLimit) => {
    const words = summary.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return summary;
  };

  return (
    <div
      className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => {
        dispatch(setSelectedIssueId(task._id));
        toggleSummary();
      }}
    >
      <div className="flex items-center space-x-3">
        <AssigneeInitials assignee={task.assigneeId} />
        <div className="flex-grow">
          <h5 className="text-lg font-semibold text-blue-700">{task.title}</h5>
          <hr className="my-2" />
          <p className="text-gray-600">{isExpanded ? task.summary : truncateSummary(task.summary, 10)}</p>
        </div>
      </div>
      <div className="flex mt-4">
        <span className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;
