// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectSlice from '../features/project/projectSlice'; // Ensure this path is correct
import userSlice from '../features/user/userSlice';
import profilePictureReducer from '../features/user/profilePictureSlice'; 
import teamSlice from '../features/team/teamSlice'; 
import taskSlice from '../features/tasks/taskSlice';
import sprintSlice from '../features/sprint/sprintSlice';
import sprintTaskSlice from '../features/sprint/sprintTaskSlice'; 
import commentSlice from '../features/comment/commentSlice';
import eventLogSlice from '../features/eventlog/eventLogSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectSlice,
    users: userSlice,
    profilePicture: profilePictureReducer,
    teams: teamSlice,
    tasks: taskSlice,
    sprints: sprintSlice,
    sprintTasks: sprintTaskSlice,
    comments: commentSlice,
    eventLogs: eventLogSlice,
  },
});