import React, {useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import CustomCircularProgress from '../global/CustomCircularProgress';
import { fetchTasks, setSelectedIssueId } from '../../features/tasks/taskSlice';
import { useFilters } from '../../context/useFilters';

// Utility function to generate a random color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
  
    const initials = `${assignee.firstName[0]}${assignee.lastName[0]}`;
    const bgColor = getRandomColor();
  
    return (
      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <span className="text-white text-sm">{initials}</span>
      </div>
    );
  };
  

const IssueList = () => {
  const { filters } = useFilters(); // Assuming setFilters is provided to reset the filters

  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const tenantId = useSelector((state) => state.auth.user?.tenantId);

  const filteredTasks = tasks.filter(task => {
    return (!filters.type || task.type === filters.type) &&
           (!filters.status || task.status === filters.status) &&
           (!filters.assignee || task.assigneeId === filters.assignee); // Assuming assigneeId is directly comparable
  });

  useEffect(() => {
    if (!tenantId) {
      toast.error('Tenant ID not found. Please log in again.');
      return;
    }

    dispatch(fetchTasks({ tenantId }));
  }, [dispatch, tenantId]);

  useEffect(() => {
    if (tasks.length > 0) {
      dispatch(setSelectedIssueId(tasks[0]._id));
    }
  }, [dispatch, tasks]);

  
  function truncateText(text, wordLimit) {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    } else {
      return text;
    }
  }
  

  const { clearFilters } = useFilters();
 

  if (status === 'loading') {
    return <CustomCircularProgress />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="overflow-auto min-h-screen bg-custom-gray p-4">
      <div className=" mx-auto">
        <div className="flex justify-end">
          <button
           onClick={clearFilters}
            className="mb-4 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-4 rounded inline-flex items-center"
            title="Clear Filters"
          >
            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
            Clear Filters
          </button>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
          {filteredTasks.map((task) => (
            <div key={task._id} className="bg-gray-50 p-4 px-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => dispatch(setSelectedIssueId(task._id))}>
              <div className="flex items-center space-x-3">
                <AssigneeInitials assignee={task.assigneeId} />
                <div className="flex-grow">
                  <h5 className="text-md font-semibold text-gray-700 text-xs sm:text-md">{task.title}</h5>
                  <hr className="my-2" />
                  <p className="text-gray-600 text-sm"> {truncateText(task.summary, 6)}</p>
                </div>
              </div>
              <div className="hidden md:flex mt-4">
                <span className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default IssueList;
