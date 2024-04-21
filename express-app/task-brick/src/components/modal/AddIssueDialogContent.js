import React, { useState } from 'react'
import { Button,  DialogContent, TextField,  MenuItem } from '@mui/material';
import { kanbanData as initialKanbanData } from '../../data/dummy';

function AddIssueDialogContent() {

    const [kanbanData, setKanbanData] = useState(initialKanbanData);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [newIssue, setNewIssue] = useState({ Summary: '', Status: 'Open' });
   

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIssue({ ...newIssue, [name]: value });
  };

  const addNewIssue = () => {
    const issueToAdd = {
      ...newIssue,
      Id: `Task ${kanbanData.length + 1}`,
      Title: `Task - ${kanbanData.length + 29001}`,
    };
    setKanbanData([...kanbanData, issueToAdd]);
    setDialogVisible(false);
    setNewIssue({ Summary: '', Status: 'Open' }); // Reset new issue state after adding
  };
  return (
    <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextField
      autoFocus
      margin="dense"
      name="Title"
      label="Issue Title"
      type="text"
      fullWidth
      className="col-span-2"
      variant="outlined"
      value={newIssue.Title}
      onChange={handleInputChange}
    />
      <TextField
        autoFocus
        margin="dense"
        name="Summary"
        className="col-span-1"
        label="Issue Summary"
        type="text"
        fullWidth
        variant="outlined"
        value={newIssue.Summary}
        onChange={handleInputChange}
      />
      <TextField
        select
        margin="dense"
        name="Status"
        label="Status"
        fullWidth
        variant="outlined"
        value={newIssue.Status}
        onChange={handleInputChange}
      >
        <MenuItem value="Open">Open</MenuItem>
        <MenuItem value="InProgress">In Progress</MenuItem>
        <MenuItem value="Testing">Testing</MenuItem>
        <MenuItem value="Done">Done</MenuItem>
      </TextField>
      <TextField
      select
      margin="dense"
      name="Type"
      label="Type"
      fullWidth
      variant="outlined"
      value={newIssue.Type}
      onChange={handleInputChange}
    >
      <MenuItem value="Bug">Bug</MenuItem>
      <MenuItem value="Story">Story</MenuItem>
      <MenuItem value="Epic">Epic</MenuItem>
      <MenuItem value="Improvement">Improvement</MenuItem>
      <MenuItem value="Task">Task</MenuItem>
      <MenuItem value="User Story">User Story</MenuItem>
      <MenuItem value="Feature">Feature</MenuItem>
      <MenuItem value="Release">Release</MenuItem>
      <MenuItem value="Defect">Defect</MenuItem>
      <MenuItem value="Test Case">Test Case</MenuItem>
      <MenuItem value="Requirement">Requirement</MenuItem>
      <MenuItem value="Other">Other</MenuItem>
      </TextField>
      <TextField
      select
      margin="dense"
      name="Priority"
      label="Priority"
      fullWidth
      variant="outlined"
      value={newIssue.Priority}
      onChange={handleInputChange}
    >
      <MenuItem value="Low">Low</MenuItem>
      <MenuItem value="Medium">Medium</MenuItem>
      <MenuItem value="High">High</MenuItem>
      <MenuItem value="Critical">Critical</MenuItem>
      </TextField>
      <TextField
      select
      margin="dense"

      name="Tags"
      label="Tags"
      fullWidth
      variant="outlined"
      value={newIssue.Tags}
      onChange={handleInputChange}
    >
      <MenuItem value="Bug">Bug</MenuItem>
      <MenuItem value="Story">Story</MenuItem>
      <MenuItem value="Epic">Epic</MenuItem>
      <MenuItem value="Improvement">Improvement</MenuItem>
      <MenuItem value="Task">Task</MenuItem>
      </TextField>
      <TextField
      select
      margin="dense"
      name="Estimate"
      label="Estimate"
      fullWidth
      variant="outlined"
      value={newIssue.Estimate}
      onChange={handleInputChange}
    >
      <MenuItem value="Low">Low</MenuItem>
      <MenuItem value="Medium">Medium</MenuItem>
      <MenuItem value="High">High</MenuItem>
      </TextField>
      <TextField
      select
      margin="dense"
      name="Assignee"
      label="Assignee"
      fullWidth
      variant="outlined"
      value={newIssue.Assignee}
      onChange={handleInputChange}
    >
      <MenuItem value="Nancy Davloio">Nancy Davloio</MenuItem>
      <MenuItem value="Andrew Fuller">Andrew Fuller</MenuItem>
      <MenuItem value="Janet Leverling">Janet Leverling</MenuItem>
      </TextField>
      <TextField
      select
      margin="dense"
      name="RankId"
      label="RankId"
      fullWidth
      variant="outlined"
      value={newIssue.RankId}
      onChange={handleInputChange}
    >
      <MenuItem value="1">1</MenuItem>
      <MenuItem value="2">2</MenuItem>
      <MenuItem value="3">3</MenuItem>
      <MenuItem value="4">4</MenuItem>
      <MenuItem value="5">5</MenuItem>
      </TextField>
      <Button
        onClick={addNewIssue}
        color="primary"
        className="col-span-2"
        variant="contained"
        fullWidth
      >
        Submit
      </Button>
    </DialogContent>
  );
}

export default AddIssueDialogContent