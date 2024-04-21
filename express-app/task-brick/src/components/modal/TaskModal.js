import React, { useState } from 'react';
import { Modal, Box, TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  export const TaskModal = ({ open, handleClose, task, onSave, allTasks = [] }) => {
      const [taskData, setTaskData] = useState(task || { name: '', start: '', end: '', progress: 0, dependencies: [] });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prev => ({ ...prev, [name]: value }));
      };
  
      const handleDependenciesChange = (event) => {
        const {
          target: { value },
        } = event;
        setTaskData(prev => ({
          ...prev,
          dependencies: typeof value === 'string' ? value.split(',') : value,
        }));
      };
    
      const handleSave = () => {
          // Convert start and end dates to Date objects if they're not already
          const startDate = new Date(taskData.start);
          const endDate = new Date(taskData.end);
        
          // Ensure these are valid Date objects before saving
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            onSave({ ...taskData, start: startDate, end: endDate, dependencies: taskData.dependencies });
            handleClose();
          } else {
            console.error('Invalid date');
            // Handle error appropriately
          }
        };
        
      return (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <TextField
              margin="dense"
              id="name"
              name="name"
              label="Task Name"
              type="text"
              fullWidth
              variant="standard"
              value={taskData.name}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="start"
              name="start"
              label="Start Date"
              type="date"
              fullWidth
              variant="standard"
              value={taskData.start}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="end"
              name="end"
              label="End Date"
              type="date"
              fullWidth
              variant="standard"
              value={taskData.end}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="progress"
              name="progress"
              label="Progress"
              type="number"
              fullWidth
              variant="standard"
              value={taskData.progress}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense">
            <InputLabel id="dependencies-label">Dependencies</InputLabel>
            <Select
                labelId="dependencies-label"
                id="dependencies"
                multiple
                name="dependencies"
                value={taskData.dependencies}
                onChange={handleDependenciesChange}
                renderValue={(selected) => selected.join(', ')}
            >
                {allTasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                    {task.name}
                </MenuItem>
                ))}
            </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={handleSave}>Save</Button>
            </Box>
          </Box>
        </Modal>
      );
  };
  