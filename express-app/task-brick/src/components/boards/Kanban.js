import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, patchTask } from '../../features/tasks/taskSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import { FaArrowUp, FaMedal, FaBalanceScale, FaBan, 
  FaExclamationTriangle,FaExclamationCircle, FaClock, 
  FaThumbsDown, FaBolt,  FaSkullCrossbones  } from 'react-icons/fa';
import KanbanHeader from './KanbanHeader';
import TimeLogComponent from './TimeLogComponent';



const Kanban = () => {

// ['High', 'Medium', 'Low', 'None', 'Critical', 'Blocker', 'Major', 'Minor', 'Trivial', 'Urgent']
const priorityIcons = {
  High: <FaArrowUp className="text-red-500" title="High" />,
  Medium: <FaMedal className="text-yellow-500" title="Medium" />,
  Low: <FaBalanceScale className="text-blue-500" title="Low"/>,
  None: <FaBan className="text-gray-500" title="None" />,
  Critical: <FaExclamationTriangle className="text-black" title="Critical" />,
  Blocker: <FaSkullCrossbones className="text-red-700" title="Blocker" />,
  Major: <FaExclamationCircle className="text-purple-600" title="Major" />,
  Minor: <FaThumbsDown className="text-yellow-500" title="Minor" />,
  Trivial: <FaClock className="text-green-500" title="Trivial" />,
  Urgent: <FaBolt className="text-red-800" title="Urgent" />,
  // Add more mappings for other priorities
};
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const [openTimeLogTaskId, setOpenTimeLogTaskId] = useState(null);
  const tenantId = useSelector(state => state.auth.user.tenantId);
  const userId = useSelector(state => state.auth.user._id);
  console.log(tenantId);
 

  const projectName = tasks.length > 0 ? tasks[0].projectId.name : 'Our Project';
  const tenantName = tasks.length > 0 ? tasks[0].tenantId.name : 'TaskBrick';

 
  const [collapsedColumns, setCollapsedColumns] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredTasks(tasks);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(lowercasedSearchTerm) ||
          task.summary.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredTasks(filtered);
    }
  }, [searchTerm, tasks]);

   // Toggle modal visibility for time logging
   const handleOpenTimeLog = (taskId) => {
    setOpenTimeLogTaskId(taskId);
  };

  // Function to handle the end of a drag event
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const task = tasks.find((task) => task._id === draggableId);
    if (task) {
      dispatch(
        patchTask({
          taskId: task._id,
          updateData: { status: destination.droppableId },
        })
      );
    }
  };

  const toggleColumn = (column) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };


  const taskCountByStatus = (status) => {
    return filteredTasks.filter((task) => task.status === status).length;
  };
  return (
    <div className="bg-white justify-end">
      <KanbanHeader setSearchTerm={setSearchTerm} projectName={projectName} tenantName={tenantName} />
   
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-2 overflow-auto">
          {['ToDo', 'InProgress', 'Reviewed', 'Done', 'OnHold'].map(
            (column) => (
              <Droppable key={column} droppableId={column}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="w-80 bg-gray-100 p-2 rounded-md shadow space-y-2"
                  >
                    <div className="flex justify-between items-center p-2 bg-white rounded-md">
                      <h3 className="text-lg font-bold">
                        {column} ({taskCountByStatus(column)})
                      </h3>
                      <button onClick={() => toggleColumn(column)}>
                        {collapsedColumns[column] ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                    <hr className="my-2 border-2 border-t  border-white" />

                    {!collapsedColumns[column] && (
                    <div className="space-y-4 overflow-auto min-h-screen mb-4">
                      {filteredTasks
                        .filter((task) => task.status === column)
                        .map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white p-4 rounded-md shadow cursor-pointer hover:shadow-lg transition duration-300 ease-in-out"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <AssigneeInitials assignee={task.assigneeId} />
                                    <h4 className="font-bold text-sm">{task.title}</h4>
                                  </div>
                                  <div className="flex items-center">
                                    {priorityIcons[task.priority] || priorityIcons['None']} {/* Default to 'None' if no match */}
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm truncate">{task.summary}</p>
                                <hr className="my-2 border-t border-gray-200" />
                                <button 
                                className="text-sm text-black hover:bg-gray-200 font-bold  px-2 rounded"
                                onClick={() => handleOpenTimeLog(task._id)}>
                                <FaClock className="mr-2" size={20} />
                              </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            )
          )}
        </div>
      </DragDropContext>
      {openTimeLogTaskId && (
    <TimeLogComponent 
      taskId={openTimeLogTaskId} 
      tenantId={tenantId} 
      userId={userId}
      onClose={() => setOpenTimeLogTaskId(null)}
    />
)}
    </div>
  );
};

export default Kanban;


const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const AssigneeInitials = ({ assignee }) => {
  const bgColor = getRandomColor();

  if (!assignee || !assignee.firstName || !assignee.lastName) {
    return (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-300"
        title="Unknown User"
      >
        <span className="text-white text-sm">?</span>
      </div>
    );
  }

  const initials = `${assignee.firstName[0]}${assignee.lastName[0]}`;
  const fullName = `${assignee.firstName} ${assignee.lastName}`;

  return (
    <div 
      className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold"
      style={{ backgroundColor: bgColor, color: 'white' }}
      title={fullName} // This will show the full name on hover
    >
      {initials}
    </div>
  );
};

