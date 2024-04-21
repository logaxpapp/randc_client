import React, { useState, useMemo } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  TablePagination
} from '@mui/material';
import { ScrumData } from '../../data/dummy';


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
  

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ... existing code for filtering, adding, and removing tasks

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the number of empty rows to maintain table height
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, tasks.length - page * rowsPerPage);


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

        const handleStatusChange = (taskId, newStatus) => {
          setTasks(tasks.map(task => (task.Id === taskId ? { ...task, Status: newStatus } : task)));
        };

        const handlePriorityChange = (taskId, newPriority) => {
          setTasks(tasks.map(task => (task.Id === taskId ? { ...task, Priority: newPriority } : task)));
        };
     const handleAssigneeChange = (taskId, newAssignee) => {
        setTasks(tasks.map(task => (task.Id === taskId ? { ...task, Assignee: newAssignee } : task)));
      };
        const handleDueDateChange = (taskId, newDueDate) => {
          setTasks(tasks.map(task => (task.Id === taskId? {...task, DueDate: newDueDate } : task)));
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

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-start">
          {/* Table headers */}
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-start">
            {/* Slice the tasks array to only show the tasks for the current page */}
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
              <tr key={task.Id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.Title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Select
                    labelId="status-select-label"
                    id="status-select"
                    value={task.Status}
                    onChange={(e) => handleStatusChange(task.Id, e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    size="small"
                  >
                    <MenuItem value="Backlog">Backlog</MenuItem>
                    <MenuItem value="ToDo">To Do</MenuItem>
                    <MenuItem value="InProgress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                  </Select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.Type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Select
                    labelId="priority-select-label"
                    id={`priority-select-${task.Id}`}
                    value={task.Priority}
                    onChange={(e) => handlePriorityChange(task.Id, e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{ minWidth: 120 }} // Adjust the size according to your design
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.Estimate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Select
                    labelId="assignee-select-label"
                    id={`assignee-select-${task.Id}`}
                    value={task.Assignee}
                    onChange={(e) => handleAssigneeChange(task.Id, e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{ minWidth: 120 }} // Adjust the size according to your design
                  >
                    <MenuItem value="John Doe">John Doe</MenuItem>
                    <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                    <MenuItem value="Bob Johnson">Bob Johnson</MenuItem>
                  </Select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium ">
                  <button onClick={() => handleRemoveTask(task.Id)} className="text-red-600 hover:text-red-900">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {/* Empty rows for maintaining table height */}
            {emptyRows > 0 && (
              <tr style={{ height: 53 * emptyRows }}>
                <td colSpan={6}></td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {/* Dialog for adding a new task */}
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
