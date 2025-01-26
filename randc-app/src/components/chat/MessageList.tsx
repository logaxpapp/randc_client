// src/components/chat/MessageList.tsx
import React from 'react';
import dayjs from 'dayjs';
import { MessageData } from '../../features/message/messageSlice';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: MessageData[];
  currentUserId: string;
}

function formatDateLabel(dateStr: string): string {
  const d = dayjs(dateStr);
  if (d.isSame(dayjs(), 'day')) return 'Today';
  if (d.isSame(dayjs().subtract(1, 'day'), 'day')) return 'Yesterday';
  return d.format('DD/MM/YYYY');
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  // Sort ascending by time
  const sorted = [...messages].sort((a, b) =>
    dayjs(a.createdAt).diff(dayjs(b.createdAt))
  );
  // Group by date
  const grouped: { [date: string]: MessageData[] } = {};
  for (const msg of sorted) {
    const dayKey = dayjs(msg.createdAt).format('YYYY-MM-DD');
    if (!grouped[dayKey]) grouped[dayKey] = [];
    grouped[dayKey].push(msg);
  }

  return (
    <div className="p-4 space-y-2">
      {Object.keys(grouped).map((dateKey) => (
        <div key={dateKey}>
          {/* Centered date label */}
          <div className="flex justify-center my-2">
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {grouped[dateKey].map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isCurrentUser={msg.sender === currentUserId}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
