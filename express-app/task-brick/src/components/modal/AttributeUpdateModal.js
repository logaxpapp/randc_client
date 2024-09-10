import React, { useState, useEffect } from 'react';
import { useDispatch,  useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { patchTask, assignUserToTask, unassignUserFromTask } from '../../features/tasks/taskSlice';

// Define options for enums based on your schema
const typeOptions = ['Task', 'Bug', 'Epic', 'Story'];
const priorityOptions = ['High', 'Medium', 'Low', 'None', 'Critical', 'Blocker', 'Major', 'Minor', 'Trivial', 'Urgent'];
const statusOptions = ['ToDo', 'InProgress', 'Done', 'Reviewed', 'Cancelled', 'OnHold', 'Resolved', 'Closed', 'Reopened'];
const tagOptions = ['Bug', 'Feature', 'Improvement', 'Documentation'];

const AttributeUpdateModal = ({ open, onClose, attribute, selectedIssue, tasks, teams }) => {
  const dispatch = useDispatch();
  const [dueDate, setDueDate] = useState(new Date());
  const [selectedTags, setSelectedTags] = useState([]);
  const [attributeValue, setAttributeValue] = useState('');
  const users = useSelector(state => state.users.list);
  console.log(teams);

  useEffect(() => {
    // Initialize modal state based on the selected attribute and issue
    if (attribute === 'dueDate' && selectedIssue.dueDate) {
      setDueDate(new Date(selectedIssue.dueDate));
    } else if (attribute === 'tags') {
      setSelectedTags(selectedIssue.tags || []);
    } else {
      setAttributeValue(selectedIssue[attribute] || '');
    }
  }, [attribute, selectedIssue]);

  const handleCheckboxChange = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updateData = {};

    switch (attribute) {
      case 'dueDate':
        updateData = { [attribute]: dueDate.toISOString() };
        break;
      case 'tags':
        updateData = { [attribute]: selectedTags };
        break;
      default:
        updateData = { [attribute]: attributeValue };
    }

    dispatch(patchTask({ taskId: selectedIssue._id, updateData }));
    if (attribute === 'assigneeId' && attributeValue) {
        // Assuming attributeValue holds the selected user's ID
        dispatch(assignUserToTask({ taskId: selectedIssue._id, userId: attributeValue }));
      } else if (attribute === 'assigneeId' && !attributeValue) {
        dispatch(unassignUserFromTask({ taskId: selectedIssue._id }));
      } else {
        dispatch(patchTask({ taskId: selectedIssue._id, updateData }));
      }
      onClose(); // Close the modal after submission
    };
  

  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'hidden'} bg-black bg-opacity-50 flex items-center justify-center p-4`}>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Update {attribute}</h2>
        <form onSubmit={handleSubmit}>
          {/* Handle enums (type, priority, status) */}
          {['type', 'priority', 'status'].includes(attribute) && (
            <select
              value={attributeValue}
              onChange={(e) => setAttributeValue(e.target.value)}
              className="form-select w-full mb-4"
            >
              {attribute === 'type' && typeOptions.map(option => <option key={option} value={option}>{option}</option>)}
              {attribute === 'priority' && priorityOptions.map(option => <option key={option} value={option}>{option}</option>)}
              {attribute === 'status' && statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          )}

          {/* Handle tags */}
          {attribute === 'tags' && (
            <>
              {tagOptions.map(tag => (
                <label key={tag} className="inline-flex items-center mr-2">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleCheckboxChange(tag)}
                  /> {tag}
                </label>
              ))}
            </>
          )}

          {/* Handle dueDate */}
          {attribute === 'dueDate' && (
            <DatePicker selected={dueDate} onChange={(date) => setDueDate(date)} className="form-input w-full mb-4" />
          )}

          {/* Handle assignee */}
           {/* Conditional rendering for assignee dropdown */}
        {attribute === 'assigneeId' && (
           <select
           value={attributeValue}
           onChange={(e) => setAttributeValue(e.target.value)}
           className="form-select w-full mb-4 text-gray-700 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
         >
           <option value="" disabled>Select an Assignee</option>
           {users.map((user) => (
             <option key={user._id} value={user._id}>
               {user.firstName} {user.lastName}
             </option>
           ))}
         </select>
         
        )}
        {/* Handle reportedBy */}
        {attribute ==='reportedBy' && (
          <select
            value={attributeValue}
            onChange={(e) => setAttributeValue(e.target.value)}
            className="form-select w-full mb-4 text-gray-700 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500
            "
          >
            <option value="" disabled>Select a Reporter</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        )}
          {/* Handle parentTasks */}
          {attribute === 'parentId' && (
            <select
              value={attributeValue}
              onChange={(e) => setAttributeValue(e.target.value)}
              className="form-select w-full mb-4 text-gray-700 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500
              "
            >
              <option value="" disabled>Select a Parent Task</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id} className='text-gray-700 text-xs'>
                  {task.title}
                </option>
              ))}

            </select>
          )}
   {/* Handle Team */}
    {attribute === 'teamId' && (
      <select
        value={attributeValue}
        onChange={(e) => setAttributeValue(e.target.value)}
        className="form-select w-full mb-4 text-gray-700 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500
        "
      >
        <option value="" disabled>Select a Team</option>
        {teams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
        </select>
      )}
          {/* Handle all other attributes */}
          {['title', 'description', 'storyPoints', 'timeEstimate', 'timeSpent'].includes(attribute) && (
            <input
              type="text"
              value={attributeValue}
              onChange={(e) => setAttributeValue(e.target.value)}
              className="form-input w-full mb-4"
            />
          )}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Update</button>
          <button type="button" onClick={onClose} className="ml-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AttributeUpdateModal;
