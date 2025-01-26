// src/components/chat/MessageBubble.tsx
import React from 'react';
import { MessageData } from '../../features/message/messageSlice';

interface MessageBubbleProps {
  message: MessageData;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  // Reverse flex direction if it's the current user's message
  const wrapperClass = isCurrentUser ? 'flex-row-reverse' : 'flex-row';

  // Example: a bold purple gradient for the current user
  const bubbleClass = isCurrentUser
    ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white'
    : 'bg-gray-200 text-gray-900';

  // Avatars (replace with real user images)
  const avatarSrc = isCurrentUser
    ? 'https://randomuser.me/api/portraits/men/12.jpg'
    : 'https://randomuser.me/api/portraits/women/65.jpg';

  const timeString = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className={`flex items-end my-1 ${wrapperClass}`}>
      {/* Avatar */}
      <img
        src={avatarSrc}
        alt="Avatar"
        className="w-8 h-8 rounded-full mx-2"
      />

      {/* Bubble */}
      <div
        className={`max-w-sm px-4 py-2 rounded-xl shadow relative ${bubbleClass}`}
        style={{ borderTopRightRadius: isCurrentUser ? '0.5rem' : '1rem',
                 borderTopLeftRadius: isCurrentUser ? '1rem' : '0.5rem' }}
      >
        <div className="text-sm leading-snug">{message.content}</div>
        <div className="text-xs opacity-70 mt-1">
          {timeString}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
