// src/components/chat/ChatSidebarItem.tsx
import React from 'react';

interface ChatSidebarItemProps {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    lastMessage?: string;
    timeLabel?: string;
    unreadCount?: number;
  };
  onClick?: () => void;
  active?: boolean; // highlight if true
}

const ChatSidebarItem: React.FC<ChatSidebarItemProps> = ({
  user,
  onClick,
  active,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 p-3 mx-2 mt-2 rounded-lg cursor-pointer
        hover:bg-gray-100 transition-colors
        ${active ? 'bg-gray-200' : ''}
      `}
    >
      <div className="relative flex-shrink-0">
        {/* Circle avatar placeholder */}
        <div className="w-10 h-10 rounded-full bg-gray-300" />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-800 text-sm">
            {user.firstName} {user.lastName}
          </span>
          {user.timeLabel && (
            <span className="text-xs text-gray-400 ml-2">
              {user.timeLabel}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 flex justify-between mt-0.5">
          <span className="truncate max-w-[150px]">
            {user.lastMessage || user.role}
          </span>
          {user.unreadCount && user.unreadCount > 0 && (
            <span className="text-white bg-blue-600 rounded-full px-2 py-0.5 text-xs ml-2">
              {user.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebarItem;
