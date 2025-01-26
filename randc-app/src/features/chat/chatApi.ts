// src/features/chat/chatApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../api/baseQuery';

export interface ParticipantPayload {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
}

export interface ChatPayload {
  _id: string;
  participants: ParticipantPayload[]; // now we expect an array of objects if it's populated
  isGroup: boolean;
  name?: string;
  createdAt: string;
  lastMessage?: string; // you can track if you store it
}

export interface MessagePayload {
  _id: string;
  chat: string;
  sender: string;
  content: string;
  createdAt: string;
  editedAt?: string;
  deletedAt?: string;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Chat', 'Message'],
  endpoints: (builder) => ({
    // list all chats for the current user
    listChats: builder.query<ChatPayload[], void>({
      query: () => '/chats',
      transformResponse: (resp: { success: boolean; data: ChatPayload[] }) => resp.data,
    }),

    // get chat by ID
    getChatById: builder.query<ChatPayload, string>({
      query: (chatId) => `/chats/${chatId}`,
      transformResponse: (resp: { success: boolean; data: ChatPayload }) => resp.data,
    }),

    // create chat
    createChat: builder.mutation<
      ChatPayload,
      { participants: string[]; isGroup?: boolean; name?: string }
    >({
      query: (body) => ({
        url: `/chats`,
        method: 'POST',
        body,
      }),
      transformResponse: (resp: { success: boolean; data: ChatPayload }) => resp.data,
    }),

    // list older messages
    listMessages: builder.query<
      MessagePayload[],
      { chatId: string; skip?: number; limit?: number }
    >({
      query: ({ chatId, skip = 0, limit = 50 }) =>
        `/chats/${chatId}/messages?skip=${skip}&limit=${limit}`,
      transformResponse: (resp: { success: boolean; data: MessagePayload[] }) => resp.data,
    }),

    // create message (HTTP)
    createMessage: builder.mutation<
      MessagePayload,
      { chatId: string; content: string }
    >({
      query: ({ chatId, content }) => ({
        url: `/chats/${chatId}/messages`,
        method: 'POST',
        body: { content },
      }),
      transformResponse: (resp: { success: boolean; data: MessagePayload }) => resp.data,
    }),
  }),
});

export const {
  useListChatsQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useListMessagesQuery,
  useCreateMessageMutation,
} = chatApi;
