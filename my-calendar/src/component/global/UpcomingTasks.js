import React, { useState } from 'react';
import { FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Mock tasks data
const tasksData = [
  { id: 1, text: 'Finish project report by Tuesday', priority: 'High', isCompleted: false },
  { id: 2, text: 'Meeting with the marketing team on Wednesday', priority: 'Medium', isCompleted: false },
  { id: 3, text: 'Client presentation on Friday', priority: 'High', isCompleted: false },
  { id: 4, text: 'Finalize presentation for the tech conference on Saturday', priority: 'High', isCompleted: false },
  { id: 5, text: 'Check in with the team about the health expo preparations on Sunday', priority: 'Low', isCompleted: false },
  { id: 6, text: 'Prepare promotional materials for the renewable energy fair on Monday', priority: 'Medium', isCompleted: false },
  // ...additional tasks
];

const UpcomingTasks = () => {
  const [tasks, setTasks] = useState(tasksData);
  const [newTaskText, setNewTaskText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [priority, setPriority] = useState('Medium');

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) {
      toast.error('Task cannot be empty!');
      return;
    }
    const newTask = {
      id: tasks.length + 1,
      text: newTaskText,
      priority,
      isCompleted: false
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setShowModal(false);
    toast.success('Task added successfully!');
  };

  return (
    <section className="mt-8 p-6">
      <h2 className="text-3xl font-bold font-serif text-gray-800 mb-4">Upcoming Tasks</h2>
      <p class="text-white text-lg bg-gradient-to-b from-purple-900 to-purple-300 mb-6 font-serif border px-4 py-2 w-full sm:w-1/2 md:w-1/3">
  Playground, Manage upcoming tasks and deadlines.
</p>

      {tasks.length > 0 ? (
        <ul className="divide-y divide-gray-200 mb-8">
          {tasks.map((task) => (
            <li key={task.id} className="py-3 flex justify-between items-center">
              <span className={`flex-1 ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {task.text} <span className={`text-${getPriorityColor(task.priority)}-500 font-bold`}>{task.priority}</span>
              </span>
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                className={`p-2 rounded-full text-white ${task.isCompleted ? 'bg-red-400 hover:bg-red-500' : 'bg-purple-700 hover:bg-pink-500'}`}
                title={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {task.isCompleted ? <FaTimes /> : <FaCheck />}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500">No upcoming tasks</div>
      )}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full flex items-center"
        >
          <FaPlus className="mr-2" /> Add Task
        </button>
      </div>

      {/* Task Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Task</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter new task"
                />
              </div>
              <div className="mt-2 px-7 py-3">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-purple-800 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Add Task
                </button>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UpcomingTasks;

// Function to return color based on priority
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High': return 'red';
    case 'Medium': return 'yellow';
    case 'Low': return 'blue';
    default: return 'gray';
  }
};
