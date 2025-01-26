// src/components/chat/ChatContainer.tsx
import React, { useEffect } from 'react';
import { useListMessagesQuery } from '../../features/chat/chatApi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setMessagesForChat } from '../../features/message/messageSlice';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { MessageData } from '../../features/message/messageSlice';
import { getSocket } from '../../services/socketService';
import ChatHeader from './ChatHeader';

interface ChatContainerProps {
  activeChatId: string | null;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ activeChatId }) => {
  // 1) Fetch older messages
  const { data: loadedMessages, isLoading, error } = useListMessagesQuery(
    { chatId: activeChatId || '', skip: 0, limit: 50 },
    { skip: !activeChatId } // skip if no chat selected
  );

  const dispatch = useAppDispatch();
  const messagesByChat = useAppSelector((state) => state.message.messagesByChat);
  const user = useAppSelector((state) => state.auth.user);

  // 2) Put them in Redux
  useEffect(() => {
    if (activeChatId && loadedMessages) {
      dispatch(
        setMessagesForChat({
          chatId: activeChatId,
          messages: loadedMessages,
        })
      );
    }
  }, [activeChatId, loadedMessages, dispatch]);

  // 3) Read them from Redux
  let messages: MessageData[] = [];
  if (activeChatId) {
    messages = messagesByChat[activeChatId] || [];
  }

  // Optionally, join the socket room for real-time updates
  useEffect(() => {
    if (activeChatId && user) {
      const socket = getSocket();
      socket.emit('joinChat', {
        chatId: activeChatId,
        userId: user._id,
        roles: user.roles,
      });
    }
  }, [activeChatId, user]);

  if (!activeChatId) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-500">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4 text-gray-600">Loading messages...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Failed to load messages</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <ChatHeader chatId={activeChatId} />

      {/* Message list */}
      <div className="flex-1 overflow-y-auto bg-white">
        <MessageList messages={messages} currentUserId={user?._id || ''} />
      </div>

      {/* Input for sending messages */}
      {user && (
        <div className="bg-white border-t">
          <ChatInput
            chatId={activeChatId}
            senderId={user._id}
            roles={user.roles}
          />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
