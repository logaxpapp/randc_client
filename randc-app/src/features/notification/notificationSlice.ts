// src/features/notification/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationData {
  _id: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  items: NotificationData[];
}

const initialState: NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationData[]>) => {
      state.items = action.payload;
    },
    addNotification: (state, action: PayloadAction<NotificationData>) => {
      state.items.unshift(action.payload); // put newest at top
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notifId = action.payload;
      const notif = state.items.find((n) => n._id === notifId);
      if (notif) {
        notif.read = true;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notifId = action.payload;
      state.items = state.items.filter((n) => n._id !== notifId);
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markNotificationRead,
  removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
