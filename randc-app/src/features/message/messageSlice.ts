// src/features/message/messageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/** Reaction structure for a message */
interface Reaction {
  user: string;  // userId
  emoji: string; // e.g. '👍'
}

/** The shape of each message record */
export interface MessageData {
  _id: string;
  chat: string;          // chatId
  sender: string;        // userId
  content: string;
  attachments?: string[];
  createdAt?: string;
  editedAt?: string;
  deletedAt?: string;
  readBy?: string[];     // userIds who have read
  reactions?: Reaction[];
}

/** The Redux state for all messages + typing info */
interface MessageState {
  /** Each chatId maps to an array of messages */
  messagesByChat: {
    [chatId: string]: MessageData[];
  };
  /** Who is typing in each chat */
  typingByChat: {
    [chatId: string]: string[]; // array of userIds currently typing
  };
}

const initialState: MessageState = {
  messagesByChat: {},
  typingByChat: {},
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    /** Replace the entire message array for a specific chat */
    setMessagesForChat: (
      state,
      action: PayloadAction<{ chatId: string; messages: MessageData[] }>
    ) => {
      const { chatId, messages } = action.payload;
      state.messagesByChat[chatId] = messages;
    },

    /** Add a single new message to the correct chat array */
    addMessage: (state, action: PayloadAction<MessageData>) => {
      const msg = action.payload;
      const chatId = msg.chat;

      if (!state.messagesByChat[chatId]) {
        state.messagesByChat[chatId] = [];
      }
      state.messagesByChat[chatId].push(msg);
    },

    /** Replace an existing message with an updated version */
    editMessage: (state, action: PayloadAction<MessageData>) => {
      const updatedMsg = action.payload;
      const chatId = updatedMsg.chat;
      const arr = state.messagesByChat[chatId];

      if (arr) {
        const index = arr.findIndex((m) => m._id === updatedMsg._id);
        if (index !== -1) {
          arr[index] = updatedMsg;
        }
      }
    },

    /** Remove a message by ID from the correct chat array */
    deleteMessage: (
      state,
      action: PayloadAction<{ messageId: string; chatId: string }>
    ) => {
      const { messageId, chatId } = action.payload;
      const arr = state.messagesByChat[chatId];
      if (arr) {
        const idx = arr.findIndex((m) => m._id === messageId);
        if (idx !== -1) {
          arr.splice(idx, 1);
        }
      }
    },

    /** Mark message as read by a specific user */
    messageRead: (
      state,
      action: PayloadAction<{ chatId: string; messageId: string; userId: string }>
    ) => {
      const { chatId, messageId, userId } = action.payload;
      const arr = state.messagesByChat[chatId];
      if (arr) {
        const msg = arr.find((m) => m._id === messageId);
        if (msg) {
          if (!msg.readBy) {
            msg.readBy = [];
          }
          if (!msg.readBy.includes(userId)) {
            msg.readBy.push(userId);
          }
        }
      }
    },

    /** Add or update a reaction on a message */
    addReaction: (
      state,
      action: PayloadAction<{
        chatId: string;
        messageId: string;
        userId: string;
        emoji: string;
      }>
    ) => {
      const { chatId, messageId, userId, emoji } = action.payload;
      const arr = state.messagesByChat[chatId];
      if (arr) {
        const msg = arr.find((m) => m._id === messageId);
        if (msg) {
          if (!msg.reactions) {
            msg.reactions = [];
          }
          const existing = msg.reactions.find((r) => r.user === userId);
          if (existing) {
            existing.emoji = emoji;
          } else {
            msg.reactions.push({ user: userId, emoji });
          }
        }
      }
    },

    /** Set a user as typing in a specific chat */
    setTyping: (
      state,
      action: PayloadAction<{ chatId: string; userId: string }>
    ) => {
      const { chatId, userId } = action.payload;
      if (!state.typingByChat[chatId]) {
        state.typingByChat[chatId] = [];
      }
      if (!state.typingByChat[chatId].includes(userId)) {
        state.typingByChat[chatId].push(userId);
      }
    },

    /** Remove a user from the typing list for that chat */
    clearTyping: (
      state,
      action: PayloadAction<{ chatId: string; userId: string }>
    ) => {
      const { chatId, userId } = action.payload;
      const arr = state.typingByChat[chatId];
      if (arr) {
        const index = arr.indexOf(userId);
        if (index !== -1) {
          arr.splice(index, 1);
        }
      }
    },
  },
});

export const {
  setMessagesForChat,
  addMessage,
  editMessage,
  deleteMessage,
  messageRead,
  addReaction,
  setTyping,
  clearTyping,
} = messageSlice.actions;

export default messageSlice.reducer;
