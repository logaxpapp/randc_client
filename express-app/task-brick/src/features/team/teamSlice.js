import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state for teams
const initialState = {
  projects: [],
  users: [],
  teams: [],
  teamMembers: {},
  teamDetails: null, // Initialize as null or an appropriate structure
  status: 'idle',
  error: null,
};


// Async thunk function to fetch all teams from the backend
export const fetchTeams = createAsyncThunk(
    'teams/fetchTeams', 
    async (teamId, { getState, rejectWithValue }) => {
      const { tenantId } = getState().auth.user; 
  try {
    const response = await axios.get(`/api/tenants/${tenantId}/teams`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
// Async thunk function to fetch a single team's details
export const fetchTeam = createAsyncThunk(
  'teams/fetchTeam',
  async (teamId, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth; // Assuming tenantId is stored in auth slice
    try {
      const response = await axios.get(`/api/tenants/${tenantId}/teams/${teamId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Async thunk function to fetch team members
export const fetchTeamMembers = createAsyncThunk(
  'teams/fetchTeamMembers',
  async (teamId, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user;
    try {
      const response = await axios.get(`/api/tenants/${tenantId}/teams/${teamId}/users`);
      // Assuming the API returns an array of team members
      return { teamId, members: response.data };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);


// Async thunk function to edit a team member
export const editMember = createAsyncThunk(
  'teams/editMember',
  async ({ teamId, memberId, memberData }, {getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user;
    try {
      const response = await axios.put(`/api/tenants/${tenantId}/teams/${teamId}/members/${memberId}`, memberData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating a team member
export const updateMember = createAsyncThunk(
  'teams/updateMember',
  async ({ teamId, memberId, memberData }, { getState, rejectWithValue }) => {
    try {
      const { tenantId } = getState().auth.user;
      const response = await axios.put(`/api/tenants/${tenantId}/teams/${teamId}/members/${memberId}`, memberData);
      return response.data; // Assuming this returns the updated member data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Async thunk function to delete a team member
export const deleteMember = createAsyncThunk(
  'teams/deleteMember',
  async ({ teamId, memberId }, { getState, rejectWithValue }) => {
    try {
      const { tenantId } = getState().auth.user;
      await axios.delete(`/api/tenants/${tenantId}/teams/${teamId}/users/${memberId}`);
      return { teamId, memberId }; // Return both IDs to identify the deleted member in the reducer
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk function to create a new team
export const createTeam = createAsyncThunk('teams/createTeam', 
async ({ teamData }, {  getState, rejectWithValue }) => {
  const { tenantId } = getState().auth.user; 
  try {
    const response = await axios.post(`/api/tenants/${tenantId}/teams`, teamData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk function to update an existing team
export const updateTeam = createAsyncThunk('teams/updateTeam',
async ({ tenantId, teamId, teamData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/tenants/${tenantId}/teams/${teamId}`, teamData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteTeam = createAsyncThunk('teams/deleteTeam', 
async ({ tenantId, teamId }, { rejectWithValue }) => {
  try {
    // Ensure the URL template strings are correct
    await axios.delete(`/api/tenants/${tenantId}/teams/${teamId}`);
    return teamId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


// Async thunk function to add team members
export const addTeamMembers = createAsyncThunk(
  'teams/addTeamMembers',
  async ({ teamId, members }, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user;

    // Constructing the payload in the expected format
    const payload = {
      members: members 
    };

    try {
      // Make sure to send 'payload' which is structured as the backend expects
      const response = await axios.post(`/api/tenants/${tenantId}/teams/${teamId}/users`, payload);
      return response.data; // Assuming the backend sends back the updated team details or some success response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



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
      const index = state.teams.findIndex(team => team._id === action.meta.arg.teamId);
      if (index !== -1) {
        state.teams[index] = { ...state.teams[index], ...action.payload };
      }
      state.status = 'idle'; // Transitioning the status to 'idle' after successful update
    });
    builder.addCase(updateTeam.rejected, (state, action) => {
      state.status = 'failed'; // Transitioning the status to 'failed' after an update fails
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
    })
    .addCase(fetchTeam.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchTeam.fulfilled, (state, action) => {
      state.status = 'succeeded';
      // Assuming you have a place to store the fetched team details
      state.teamDetails = action.payload;
    })
    .addCase(fetchTeam.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    })
    .addCase(editMember.fulfilled, (state, action) => {
      // Logic to update the member in state.teams or state.teamDetails.members
      const { memberData } = action.payload;
      const team = state.teams.find(team => team._id === memberData.teamId);
      const memberIndex = team.members.findIndex(member => member._id === memberData._id);
      if (memberIndex !== -1) {
        team.members[memberIndex] = memberData;
      }
    })
    .addCase(deleteMember.fulfilled, (state, action) => {
      const { teamId, memberId } = action.payload;
      const teamIndex = state.teams.findIndex(team => team._id === teamId);
      if (teamIndex !== -1) {
        // Remove the member from the team's member array
        state.teams[teamIndex].members = state.teams[teamIndex].members.filter(member => member._id !== memberId);
      }
    })    
    .addCase(updateMember.fulfilled, (state, action) => {
      const { teamId, memberId } = action.meta.arg;
      const teamIndex = state.teams.findIndex(team => team._id === teamId);
      if (teamIndex !== -1) {
        const memberIndex = state.teams[teamIndex].members.findIndex(member => member._id === memberId);
        if (memberIndex !== -1) {
          // Update the member with new data from action.payload
          state.teams[teamIndex].members[memberIndex] = { ...state.teams[teamIndex].members[memberIndex], ...action.payload };
        }
      }
    })
    .addCase(fetchTeamMembers.fulfilled, (state, action) => {
      const { teamId, members } = action.payload;
      state.teamMembers[teamId] = members; // Store members indexed by teamId
    })
    // Optionally handle pending and rejected states for fetchTeamMembers
    .addCase(fetchTeamMembers.pending, (state) => {
      // e.g., set a loading state specific to teamMembers
    })
    .addCase(fetchTeamMembers.rejected, (state, action) => {
      // Handle an error state
      state.error = action.payload;
    });
  },
});

// Export actions and reducer
export default teamSlice.reducer;
