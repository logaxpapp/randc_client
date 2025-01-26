// src/types/socketPayloads.ts

// Example type for a full message object
export interface MessageData {
    _id: string;
    chat: string;   // chatId
    sender: string; // userId
    content: string;
    attachments?: string[];
    createdAt?: string;
    editedAt?: string;
    deletedAt?: string;
    // etc...
  }
  
  // If your server emits "messageDeleted" with { messageId, chatId }
  export interface MessageDeletedPayload {
    messageId: string;
    chatId: string;
  }
  
  // If your server emits "messageRead" with { messageId, userId, chatId }
  export interface MessageReadPayload {
    messageId: string;
    userId: string;
    chatId: string;
  }
  
  // If your server emits "messageReaction" with { messageId, userId, emoji, chatId }
  export interface MessageReactionPayload {
    messageId: string;
    userId: string;
    emoji: string;
    chatId: string;
  }
  
  // If your server emits a "notification" object
  export interface NotificationPayload {
    _id: string;
    message: string;
    data?: any;
    read: boolean;
    createdAt: string;
    // or whatever fields your notification has
  }
  