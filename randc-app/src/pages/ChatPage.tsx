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
    <section className="relative w-full h-screen text-gray-800 overflow-hidden">
      {/* --- Top Wave Divider --- */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Sticky Banner at the top (vital message) */}
        <div className="sticky top-0 z-50 bg-yellow-200 text-yellow-800 p-3 font-semibold shadow-md">
        <strong>Vital Message:</strong> Chat with Confidence!!
      </div>

        {/* Main Chat Layout */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile top bar with hamburger (only on small screens) */}
          <div className="md:hidden flex items-center justify-between bg-white p-2 border-b w-full">
            <h1 className="text-lg font-bold">Chat</h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-800"
              aria-label="Open Sidebar"
            >
              <FaBars size={20} />
            </button>
          </div>

          {/* Desktop Sidebar (visible on md+) */}
          <div className="hidden md:flex md:flex-col w-72 bg-white border-r">
            <ChatSidebar onSelectChat={handleSelectChat} activeChatId={activeChatId ?? undefined} />
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

      {/* --- Bottom Wave Divider --- */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default ChatPage;
