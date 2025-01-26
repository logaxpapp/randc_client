// src/features/presence/presenceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PresenceState {
  [userId: string]: string; // "online" or "offline" or other statuses
}

const initialState: PresenceState = {};

export const presenceSlice = createSlice({
  name: 'presence',
  initialState,
  reducers: {
    setUserPresence: (
      state,
      action: PayloadAction<{ userId: string; status: string }>
    ) => {
      const { userId, status } = action.payload;
      state[userId] = status;
    },
  },
});

export const { setUserPresence } = presenceSlice.actions;
export default presenceSlice.reducer;
