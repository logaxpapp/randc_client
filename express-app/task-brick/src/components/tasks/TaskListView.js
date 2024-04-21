import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTasks } from '../../features/tasks/taskSlice';
import UpdateTaskModal from './UpdateTaskForm';
import CustomCircularProgress from '../global/CustomCircularProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Make sure you've installed FontAwesome
import { faSort } from '@fortawesome/free-solid-svg-icons';

const TaskListView = ({ onExport }) => {
  const dispatch = useDispatch();
  const { tasks, status } = useSelector((state) => state.tasks);
  const [filter, setFilter] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [sortBy, setSortBy] = useState('title'); // 'title', 'status', 'priority'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const openModal = (taskId) => {
    setCurrentTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleDetailViewClick = () => {
    navigate("/dashboard/issueboard");
  };

  const handleSortChange = (sortKey) => {
    setSortBy(sortKey);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const sortedAndFilteredTasks = tasks
    .filter(task =>
      task.title.toLowerCase().includes(filter.toLowerCase()) ||
      task.status.toLowerCase().includes(filter.toLowerCase()) ||
      task.priority.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        return b[sortBy].localeCompare(a[sortBy]);
      }
    });

  if (status === 'loading') return <CustomCircularProgress />;
  if (status === 'failed') return <div>Failed to load tasks.</div>;

  return (
    <div className=" mx-auto p-4">
      <div className="mb-4 bg-gray-50 flex justify-between items-center">
        <div className="flex gap-2 h-24 items-center">
          <input
            type="text"
            placeholder="Search tasks..."
            className="input input-bordered w-full max-w-xs"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button 
            className="btn btn-outline btn-primary border " 
            onClick={() => handleDetailViewClick()}>
            DETAIL VIEW
          </button>
          <button className="btn btn-outline btn-secondary border" onClick={onExport}>
            Export issues
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div onClick={() => handleSortChange('title')} className="cursor-pointer">
            <FontAwesomeIcon icon={faSort} /> Name
          </div>
          <div onClick={() => handleSortChange('status')} className="cursor-pointer">
            <FontAwesomeIcon icon={faSort} /> Status
          </div>
          <div onClick={() => handleSortChange('priority')} className="cursor-pointer">
            <FontAwesomeIcon icon={faSort} /> Priority
          </div>
        </div>
      </div>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
              <th scope="col" className="py-3 px-6">
                Task Name
              </th>
              <th scope="col" className="py-3 px-6">
                Status
              </th>
              <th scope="col" className="py-3 px-6">
                Priority
              </th>
              <th scope="col" className="py-3 px-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredTasks.map((task) => (
              <tr key={task._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                 <td className="py-4 px-6">{task.title}</td>
                <td className="py-4 px-6">{task.status}</td>
                <td className="py-4 px-6">{task.priority}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => openModal(task._id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <UpdateTaskModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          taskId={currentTaskId}
        />
      )}
    </div>
  );
};

export default TaskListView;
