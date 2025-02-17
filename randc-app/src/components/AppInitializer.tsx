// src/components/AppInitializer.tsx
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { initSocket, getSocket, disconnectSocket } from '../services/socketService';


import {
  addMessage,
  editMessage,
  deleteMessage,
  MessageData,
  messageRead,
  addReaction,
  setTyping,
  clearTyping,
} from '../features/message/messageSlice';
import { addNotification } from '../features/notification/notificationSlice';

import { setUserPresence } from '../features/presence/presenceSlice';

// Type definitions for socket event payloads
interface MessageDeletedPayload {
  messageId: string;
  chatId: string;
}
interface UpdatedMessagePayload extends MessageData {}
interface NotificationPayload {
  _id: string;
  message: string;
  createdAt: string;
  data?: any;
  read: boolean;
}

// Example extra event types:
interface MessageReadPayload {
  messageId: string;
  userId: string;
  chatId: string;
}
interface MessageReactionPayload {
  messageId: string;
  userId: string;
  emoji: string;
  chatId: string;
}
interface TypingPayload {
  userId: string;
  chatId: string;
}
interface PresencePayload {
  userId: string;
  status: string;
}


export default function AppInitializer() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  

  // 2) Setup Socket.IO if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      initSocket(user.token); // create or reuse socket connection
      const socket = getSocket();

      // (Optional) Subscribe to a tenant room if needed
      if (user.tenant) {
        socket.emit('subscribeToTenant', user.tenant);
      }

      // ---------------- BASIC MESSAGE EVENTS ----------------
      socket.on('newMessage', (msg: MessageData) => {
        console.log('[AppInitializer] Received newMessage:', msg);
        dispatch(addMessage(msg));
      });

      socket.on('messageEdited', (updatedMsg: UpdatedMessagePayload) => {
        console.log('[AppInitializer] Received messageEdited:', updatedMsg);
        dispatch(editMessage(updatedMsg));
      });

      socket.on('messageDeleted', ({ messageId, chatId }: MessageDeletedPayload) => {
        console.log('[AppInitializer] Received messageDeleted:', messageId, chatId);
        dispatch(deleteMessage({ messageId, chatId }));
      });

      socket.on('notification', (notif: NotificationPayload) => {
        console.log('[AppInitializer] Received notification:', notif);
        dispatch(addNotification(notif));
      });

      // ---------------- OPTIONAL ADVANCED EVENTS ----------------
      socket.on('messageRead', (payload: MessageReadPayload) => {
        console.log('[AppInitializer] Received messageRead:', payload);
        dispatch(messageRead({
          chatId: payload.chatId,
          messageId: payload.messageId,
          userId: payload.userId,
        }));
      });

      socket.on('messageReaction', (payload: MessageReactionPayload) => {
        console.log('[AppInitializer] Received messageReaction:', payload);
        dispatch(addReaction({
          chatId: payload.chatId,
          messageId: payload.messageId,
          userId: payload.userId,
          emoji: payload.emoji,
        }));
      });

      socket.on('userTyping', (payload: TypingPayload) => {
        console.log('[AppInitializer] userTyping:', payload);
        dispatch(setTyping({
          chatId: payload.chatId,
          userId: payload.userId,
        }));
      });

      socket.on('userStopTyping', (payload: TypingPayload) => {
        console.log('[AppInitializer] userStopTyping:', payload);
        dispatch(clearTyping({
          chatId: payload.chatId,
          userId: payload.userId,
        }));
      });

      socket.on('userLeftChat', (payload: { userId: string; chatId: string }) => {
        console.log('[AppInitializer] userLeftChat:', payload);
        // e.g. dispatch(userLeftChat(payload));
      });

      socket.on('presenceUpdate', (payload: PresencePayload) => {
        console.log('[AppInitializer] presenceUpdate:', payload);
        // e.g. dispatch(updatePresence(payload));
      });

      // presence listener
      socket.on('presenceUpdate', (payload: PresencePayload) => {
        console.log('[Presence] presenceUpdate:', payload);
        dispatch(setUserPresence(payload));
      });

      // CLEANUP on unmount or user logout
      return () => {
        socket.off('newMessage');
        socket.off('messageEdited');
        socket.off('messageDeleted');
        socket.off('notification');

        socket.off('messageRead');
        socket.off('messageReaction');
        socket.off('userTyping');
        socket.off('userStopTyping');
        socket.off('userLeftChat');
        socket.off('presenceUpdate');
      };

      
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, user, dispatch]);

  return null; // Renders nothing
}
