import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state for teams
const initialState = {
    projects: [],
    users: [],
    teams: [],      // Array to store all teams
  status: 'idle', // Status for loading states: idle, loading, succeeded, failed
  error: null,    // Error message if any
     // Array to store all teams
};

// Async thunk function to fetch all teams from the backend
export const fetchTeams = createAsyncThunk(
    'teams/fetchTeams', 
    async (tenantId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/tenants/${tenantId}/teams`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk function to create a new team
export const createTeam = createAsyncThunk('teams/createTeam', async ({ tenantId, teamData }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/api/tenants/${tenantId}/teams`, teamData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk function to update an existing team
export const updateTeam = createAsyncThunk('teams/updateTeam', async ({ tenantId, teamId, teamData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/tenants/${tenantId}/teams/${teamId}`, teamData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk function to delete a team
export const deleteTeam = createAsyncThunk('teams/deleteTeam', async ({ tenantId, teamId }, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/tenants/${tenantId}/teams/${teamId}`);
    return teamId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Create a team slice
const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch teams reducers
    builder.addCase(fetchTeams.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchTeams.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.teams = action.payload;
    });
    builder.addCase(fetchTeams.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });

    // Create team reducers
    builder.addCase(createTeam.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(createTeam.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.teams.push(action.payload);
    });
    builder.addCase(createTeam.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });

    // Update team reducers
    builder.addCase(updateTeam.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(updateTeam.fulfilled, (state, action) => {
      state.status = 'succeeded';
      const updatedTeamIndex = state.teams.findIndex(team => team._id === action.payload._id);
      if (updatedTeamIndex !== -1) {
        state.teams[updatedTeamIndex] = action.payload;
      }
    });
    builder.addCase(updateTeam.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });

    // Delete team reducers
    builder.addCase(deleteTeam.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(deleteTeam.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.teams = state.teams.filter(team => team._id !== action.payload);
    });
    builder.addCase(deleteTeam.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

// Export actions and reducer
export default teamSlice.reducer;
