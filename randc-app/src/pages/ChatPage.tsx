// src/pages/ChatPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars } from 'react-icons/fa';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatContainer from '../components/chat/ChatContainer';

const ChatPage: React.FC = () => {
  // Keep track of which chat is selected
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Sidebar toggle for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    // On mobile, close the sidebar after selecting
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Sticky Banner at the top (your "vital message") */}
      

      {/* Main Chat Layout */}
      <div className="flex flex-1 overflow-hidden bg-gray-100 relative">
        {/* Mobile top bar with hamburger */}
        <div className="md:hidden flex items-center justify-between bg-white p-2 border-b">
          <h1 className="text-lg font-bold">Chat</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* Sidebar (hidden on mobile, visible on md+) */}
        <div className="hidden md:flex md:flex-col w-72 bg-white border-r">
          <ChatSidebar
            onSelectChat={handleSelectChat}
            activeChatId={activeChatId ?? undefined}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="absolute inset-0 z-30 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Panel */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="absolute top-0 bottom-0 left-0 w-64 bg-white border-r z-40 flex flex-col md:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween' }}
            >
              <ChatSidebar
                onSelectChat={handleSelectChat}
                activeChatId={activeChatId ?? undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main chat container */}
        <div className="flex-1 flex flex-col">
          <ChatContainer activeChatId={activeChatId} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
