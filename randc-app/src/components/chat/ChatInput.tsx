// src/components/chat/ChatInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { getSocket } from '../../services/socketService';
import { FaPaperclip, FaSmile } from 'react-icons/fa';

interface ChatInputProps {
  chatId: string;
  senderId: string;
  roles: string[];
}

const ChatInput: React.FC<ChatInputProps> = ({ chatId, senderId, roles }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socket = getSocket();

  // Typing indicator
  useEffect(() => {
    if (!text.trim()) return;

    socket.emit('typing', { chatId, senderId });
    const typingTimeout = setTimeout(() => {
      socket.emit('stopTyping', { chatId, senderId });
    }, 2000);

    return () => clearTimeout(typingTimeout);
  }, [text, chatId, senderId, socket]);

  const handleSend = () => {
    if (!text.trim() && !file) return;

    socket.emit(
      'sendMessage',
      {
        chatId,
        senderId,
        content: text,
        attachments: file ? [file.name] : [],
        roles,
      },
      (response: any) => {
        if (response?.success) {
          console.log('Message saved on server:', response.data);
        } else {
          console.error('sendMessage error:', response?.error);
        }
      }
    );

    setText('');
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <button
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"
        type="button"
      >
        <FaSmile size={18} />
      </button>

      <label className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full cursor-pointer">
        <FaPaperclip size={18} />
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/*,video/*,application/pdf"
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

      <input
        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={handleSend}
        disabled={!text.trim() && !file}
        className={`px-4 py-2 font-medium text-white rounded-full 
          ${text.trim() || file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
        `}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
