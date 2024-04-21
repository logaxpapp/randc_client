import React, { useState } from 'react';

const CreateTeamModal = ({ open, onClose }) => {
  const [teamName, setTeamName] = useState('');
  const [emails, setEmails] = useState('');
  const [joinWithoutApproval, setJoinWithoutApproval] = useState(false);
  const [role, setRole] = useState('');

  const handleSubmit = () => {
    // Implement submit logic here
    console.log({ teamName, emails, joinWithoutApproval, role });
    onClose(); // Close modal after submit
  };

  if (!open) return null;

  return (
    <div className="fixed inset-20 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border max-w-xl h-96  w-full shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="text-lg font-semibold mb-4">Create a Team</div>
        <input
         className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 mb-4 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <input
           className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 mb-4 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          placeholder="Invite Members (comma-separated emails)"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
        />
        <div className="flex items-center mb-4">
          <input
            id="joinWithoutApproval"
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={joinWithoutApproval}
            onChange={(e) => setJoinWithoutApproval(e.target.checked)}
          />
          <label htmlFor="joinWithoutApproval" className="ml-2 text-sm font-medium text-gray-900">Join without Approval</label>
        </div>
        <div className=" w-full mb-4">
          <select
             className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 mb-4 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Admin">Admin</option>
            <option value="Developer">Developer</option>
            <option value="User">User</option>
            {/* Add other roles as needed */}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSubmit}
          >
            Create
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
