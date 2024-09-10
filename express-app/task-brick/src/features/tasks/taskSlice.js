// Import createSlice and createAsyncThunk from Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define initial state for tasks
const initialState = {
  tasks: [],
  selectedIssueId: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk action for fetching tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user; // Assuming tenantId is stored in auth state
    try {
     
      const response = await axios.get(`/api/tenants/${tenantId}/tasks`);
      console.log('FetchTask Slice', response); // Log the response data for debugging purposes
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addNewTask = createAsyncThunk(
  'tasks/addNewTask',
  async (newTask, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user;
    try {
      const response = await axios.post(`/api/tenants/${tenantId}/tasks`, newTask);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk action for updating a task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user;
    try {
      const response = await axios.put(`/api/tenants/${tenantId}/tasks/${taskId}`, taskData);
      console.log('UpdateTask Slice', response); // Log the response data for debugging purposes
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk action for deleting a task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async ({ taskId }, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user;
    try {
      await axios.delete(`/api/tenants/${tenantId}/tasks/${taskId}`);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



// Async thunk action for partially updating a task
export const patchTask = createAsyncThunk(
  'tasks/patchTask',
  async ({ taskId, updateData }, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user;
    try {
      const response = await axios.patch(`/api/tenants/${tenantId}/tasks/${taskId}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Async thunk action for assigning a reporter to a task
export const assignReporterToTask = createAsyncThunk(
  'tasks/assignReporter',
  async ({ taskId, userId }, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user;
    try {
      const response = await axios.post(`/api/tenants/${tenantId}/tasks/${taskId}/assignReporter/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk action to unassign a reporter from a task
export const unassignReporterFromTask = createAsyncThunk(
  'tasks/unassignReporter',
  async (taskId, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user;
    try {
      const response = await axios.patch(`/api/tenants/${tenantId}/tasks/${taskId}/unassignReporter`);
      return { taskId, reporterId: null }; // Assuming the backend just confirms the action without returning the updated task
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk action for assigning a user to a task
export const assignUserToTask = createAsyncThunk(
  'tasks/assignUser',
  async ({ taskId, userId }, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user;
    try {
      const response = await axios.post(`/api/tenants/${tenantId}/tasks/${taskId}/assignUser/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk action for unassign a user from a task
export const unassignUserFromTask = createAsyncThunk(
  'tasks/unassignUser',
  async ({ taskId }, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user;
    try {
      const response = await axios.patch(`/api/tenants/${tenantId}/tasks/${taskId}/unassignUser`);
      return { taskId, assigneeId: null }; // Assuming the backend confirms the action without returning the updated task
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Define the task slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedIssueId: (state, action) => {
      state.selectedIssueId = action.payload;
    },
    // ... rest of your reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(assignReporterToTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload; // Update the task with the new reporterId
        }
      })
      .addCase(unassignReporterFromTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload.taskId);
        if (index !== -1) {
          state.tasks[index].reporterId = null; // Remove the reporterId from the task
        }
      })
      .addCase(patchTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          // Update the task with the new data
          state.tasks[index] = action.payload;
        }
      })
      .addCase(assignUserToTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload; // Update the task with the new assigneeId
        }
      })
      .addCase(unassignUserFromTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload.taskId);
        if (index !== -1) {
          state.tasks[index].assigneeId = null; // Remove the assigneeId from the task
        }
      });

      // Handle other actions
  },
});

export const { setSelectedIssueId } = taskSlice.actions;

// Export the reducer
export default taskSlice.reducer;
