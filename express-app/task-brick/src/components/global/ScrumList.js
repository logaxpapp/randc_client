import React, { useState, useMemo } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { ScrumData } from '../data/dummy';

const ScrumList = () => {
  const [tasks, setTasks] = useState(ScrumData); // Initial tasks loaded from ScrumData
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    Summary: '',
    Status: 'Open',
    Title: '',
    Type: '',
    Priority: '',
    Estimate: 0,
    Assignee: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter tasks based on search term
  const filteredData = useMemo(() => (
    searchTerm
      ? tasks.filter(item =>
          item.Summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.Assignee.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : tasks
  ), [tasks, searchTerm]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleAddTask = () => {
    const newTaskWithId = { ...newTask, Id: `Task ${tasks.length + 1}` };
    setTasks([...tasks, newTaskWithId]);
    handleCloseDialog();
    setNewTask({ Summary: '', Status: 'Open', Title: '', Type: '', Priority: '', Estimate: 0, Assignee: '' }); // Reset form
  };

  const handleRemoveTask = (id) => {
    setTasks(tasks.filter(task => task.Id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mt-5 mb-20 mx-2 md:mx-10">
      <div className="flex justify-between mb-4">
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Add Task
        </Button>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-gray-300 p-2 rounded"
        />
        </div>
  
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estimate
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((task) => (
              <tr key={task.Id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.Title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.Status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.Type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.Priority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.Estimate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.Assignee}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleRemoveTask(task.Id)} className="text-red-600 hover:text-red-900">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add a New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            name="Title"
            value={newTask.Title}
            onChange={handleChange}
            className="mb-4"
          />
          <TextField
            margin="dense"
            id="type"
            label="Type"
            type="text"
            fullWidth
            variant="outlined"
            name="Type"
            value={newTask.Type}
            onChange={handleChange}
            className="mb-4"
          />
          <TextField
            margin="dense"
            id="priority"
            label="Priority"
            type="text"
            fullWidth
            variant="outlined"
            name="Priority"
            value={newTask.Priority}
            onChange={handleChange}
            className="mb-4"
          />
          <TextField
            margin="dense"
            id="estimate"
            label="Estimate"
            type="number"
            fullWidth
            variant="outlined"
            name="Estimate"
            value={newTask.Estimate}
            onChange={handleChange}
            className="mb-4"
          />
          <TextField
            margin="dense"
            id="assignee"
            label="Assignee"
            type="text"
            fullWidth
            variant="outlined"
            name="Assignee"
            value={newTask.Assignee}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddTask}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  
};

export default ScrumList;
