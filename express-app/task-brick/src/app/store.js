// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectSlice from '../features/project/projectSlice'; // Ensure this path is correct
import userSlice from '../features/user/userSlice';
import profilePictureReducer from '../features/user/profilePictureSlice'; 
import teamSlice from '../features/team/teamSlice'; 
import taskSlice from '../features/tasks/taskSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectSlice,
    users: userSlice,
    profilePicture: profilePictureReducer,
    teams: teamSlice,
    tasks: taskSlice,
  },
});