// Header.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../../context/useFilters';


const Header = ({ onSearch, onFilterChange, onExport, onViewChange }) => {

  const filtersContext = useFilters();
  const { updateFilter } = useFilters(); 

  const handleFilterChange = (filterType, value) => {
    updateFilter(filterType, value); // Correctly call updateFilter with type and value
  };
  const { tasks } = useSelector((state) => state.tasks);

  const navigate = useNavigate(); // Get the navigate function from useNavigate hook

  // Extract unique types and statuses for the dropdowns
  const types = [...new Set(tasks.map(task => task.type))];
  const statuses = [...new Set(tasks.map(task => task.status))];
  
  // Map over assigneeId to get user details
  const assigneeOptions = tasks.map(task => {
    const assignee = task.assigneeId;
    return assignee ? { id: assignee._id, name: `${assignee.firstName} ${assignee.lastName}` } : null;
  }).filter(Boolean); // Filter out null entries
  

   const handleDetailViewClick = () => {
   
    navigate("/dashboard/issueboard"); // Programmatically navigate to the detail view
  };

  return (
    <div className="bg-gray-200 text-black mb-5 shadow p-4 flex items-center space-x-4">
      <div className="flex-grow">
        <input
          type="text"
          placeholder="Search issues"
          className="p-2 border rounded-xl text-xs w-full"
          onChange={onSearch}
        />
      </div>
      <select className="border rounded-xl p-2 text-sm" onChange={(e) => onFilterChange('type', e.target.value)}>
  <option className='text-xs'>Type</option>
  {types.map((type, index) => (
    <option key={index} value={type}>{type}</option> // Here index is used as key which is unique
  ))}
</select>

<select className="border rounded-xl text-xs p-2" onChange={(e) => onFilterChange('status', e.target.value)}>
  <option>Status</option>
  {statuses.map((status, index) => (
    <option key={index} value={status}>{status}</option> // Here index is used as key which is unique
  ))}
</select>
      <select
  className="border rounded-xl text-xs p-2"
  onChange={(e) => handleFilterChange('assignee', e.target.value)}
>
  <option value="">Assignee</option>
  {assigneeOptions.map((assignee) => (
    <option key={assignee.id} value={assignee.id}>
      {assignee.name}
    </option>
  ))}
</select>

      {/* Export and View buttons remain unchanged */}
      <Link to="/dashboard/task-list" className=" border text-black bg-white rounded-xl p-2 text-center text-xs block">
        LIST VIEW
      </Link>
      
      {/* Detail View - */}
      <button 
        className="border rounded-xl text-xs bg-white p-2" 
        onClick={handleDetailViewClick}>
        DETAIL VIEW
      </button>
      
      {/* Export issues button remains unchanged */}
      <button className="border rounded-xl p-2 text-xs bg-custom-green" onClick={onExport}>
        Export issues
      </button>
    </div>
  );
};

export default Header;
