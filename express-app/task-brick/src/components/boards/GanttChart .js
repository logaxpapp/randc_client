import React, { useState } from 'react';
import { ViewMode, Gantt } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { ganttData } from '../../data/dummy'; // Adjust the path as necessary
import { Button, ButtonGroup, Box } from '@mui/material';
import { TaskModal } from '../modal/TaskModal';

const GanttChart = () => {
  const [tasks, setTasks] = useState(ganttData);
  const [viewMode, setViewMode] = useState(ViewMode.Day);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 const [currentTask, setCurrentTask] = useState(null);

  const convertDateStringToDate = (tasks) => tasks.map((task) => ({
    ...task,
    start: task.start instanceof Date ? task.start : new Date(task.start),
    end: task.end instanceof Date ? task.end : new Date(task.end),
  }));

  const handleTaskUpdate = (task, start, end) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === task.id) {
        // Check and convert start and end dates, provide fallbacks if undefined
        const newStart = start ? (start instanceof Date ? start : new Date(start)) : t.start;
        const newEnd = end ? (end instanceof Date ? end : new Date(end)) : t.end;
        return { ...t, start: newStart, end: newEnd };
      }
      return t;
    });
    setTasks(convertDateStringToDate(updatedTasks)); 
  };
  
  

  const handleProgressChange = (task, progress) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === task.id) {
        return { ...t, progress: progress };
      }
      return t;
    });
    setTasks(updatedTasks);
  };

  const handleTaskSelect = (taskId) => {
    console.log("Selected task ID:", taskId);
    // Example: Update state only if selected task changes
    if (selectedTaskId !== taskId) {
      setSelectedTaskId(taskId);
      // Perform any additional actions needed when a task is selected
    }
  };
  
  const handleTaskResize = (taskId, newStart, newEnd) => {
    setTasks(tasks => tasks.map(task => {
      if (task.id === taskId) {
        // Convert to Date objects to ensure consistency
        const start = newStart instanceof Date ? newStart : new Date(newStart);
        const end = newEnd instanceof Date ? newEnd : new Date(newEnd);
        // Update only if dates have changed to prevent unnecessary re-renders
        if (task.start.getTime() !== start.getTime() || task.end.getTime() !== end.getTime()) {
          return { ...task, start, end };
        }
      }
      return task;
    }));
  };
  

  const openNewTaskModal = () => {
    setCurrentTask(null); // No current task for a new task
    setIsModalOpen(true);
  };
  
  const openEditTaskModal = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setCurrentTask(task);
    setIsModalOpen(true);
  };
  
  const saveTask = (taskData) => {
    if (currentTask) {
      // Update existing task
      handleTaskUpdate(taskData);
    } else {
      // Create new task
      const newTask = { ...taskData, id: `Task ${tasks.length + 1}` }; // Generate a simple ID; adjust as needed
      setTasks([...tasks, newTask]);
    }
  };

 
  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: '100%', p: 2 }}>
      <h1 className="text-2xl font-bold mb-4">Gantt Chart</h1>

      {/* Add Task button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          {Object.values(ViewMode).map((mode) => (
            <Button
              key={mode}
              onClick={() => setViewMode(mode)}
              color={viewMode === mode ? 'primary' : 'secondary'}
            >
              {mode}
            </Button>
          ))}
        </ButtonGroup>
        <Button
          variant="contained"
          color="primary"
          onClick={openNewTaskModal}
        >
          Add Task
        </Button>
      </Box>

      <Box sx={{ overflow: 'auto', maxWidth: '100%', minHeight: '500px' }}>
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          onDateChange={handleTaskUpdate}
          onProgressChange={handleProgressChange}
          onTaskDelete={(taskId) => setTasks(tasks.filter((task) => task.id !== taskId))}
          onTaskSelect={(taskId) => openEditTaskModal(taskId)} // This needs to be implemented
          onTaskResize={handleTaskResize}
        />
      </Box>

      {/* Task Modal */}
      <TaskModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        task={currentTask}
        onSave={saveTask}
        allTasks={ganttData} // Pass ganttData as allTasks
        />

    </Box>
  );
};

export default GanttChart;