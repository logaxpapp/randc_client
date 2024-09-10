import React from 'react';
import {  FaSearch, FaUserCircle, FaBell, FaEllipsisV, FaPlusSquare } from 'react-icons/fa';


const KanbanHeader = ({ setSearchTerm,projectName, tenantName  }) => {

  
    
    const newLocal = "flex items-center space-x-4";
  return (
    <div className="justify-end mb-2 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className={newLocal}>
          <h2 className="text-sm text-gray-600">Projects</h2>
          <span className="text-sm text-gray-400">/</span>
          <h1 className="text-sm font-bold  text-gray-500">{projectName || 'TaskBrick'}</h1>
        </div>
      
        <div className="flex items-center ">
          <button className=" text-blue-500 font-bold py-2 px-4 rounded-full flex items-center space-x-2 ml-20">
            <FaPlusSquare className="text-sm h-12 rounded-full" title="Add column" />
           
          </button>
          <div className="flex items-center space-x-3">
          <FaUserCircle className="text-md text-gray-600 cursor-pointer" title="Profile" />
          <FaBell className="text- text-gray-600 cursor-pointer" title="Notifications" />
          <FaEllipsisV className="text-md text-gray-600 cursor-pointer" title="More options" />
        </div>
          
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold text-gray-800">{tenantName || 'LogaXP'}</h2>
        <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"/>
            <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-3 py-1 border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setSearchTerm(e.target.value)} // This calls the setSearchTerm passed from the parent
            />
            </div>
      </div>
    </div>
  );
};

export default KanbanHeader;
