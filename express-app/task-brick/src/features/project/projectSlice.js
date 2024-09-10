import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Async thunk for fetching project details
export const fetchProjectDetails = createAsyncThunk(
  'project/fetchDetails',
  async ({ tenantId, projectId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/tenants/${tenantId}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      console.log("FetchProjectDetails", response); // Log the response data for debugging purposes
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (userId, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user; // Assuming tenantId is stored in auth state
   
    try {
      const response = await axios.get(`/api/tenants/${tenantId}/projects`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);




export const createProject = createAsyncThunk(
  'project/createProject',
  async (projectData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const response = await axios.post(`/api/tenants/${user.tenantId}/projects`, projectData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProject = createAsyncThunk(
  'project/updateProject',
  async ({ tenantId, projectId, projectData }, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth; // Assume you have access token stored in auth slice
      const response = await axios.put(`/api/tenants/${tenantId}/projects/${projectId}`, projectData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("ProjectSlice",response); // Log the response data for debugging purposes
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: [],
    project: null,
    currentProjectId: null, 
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setCurrentProjectId(state, action) {
      state.currentProjectId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.project = action.payload;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.project = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProject.pending, (state) => {
        state.status = 'loading';
      }) 
      .addCase(createProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload; // Update the projects array
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});
export const { setCurrentProjectId } = projectSlice.actions;


export default projectSlice.reducer;
