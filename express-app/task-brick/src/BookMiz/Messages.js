import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { MessageList, ReplyModal, DeleteConfirmationModal  } from './MessageList';

const initialMessages = [
  { id: 1, sender: 'Alice', content: 'Hey there, how’s your project going?', replies: ["we are on it!"] },
  { id: 2, sender: 'Bob', content: 'Did you see the latest episode?' },
  { id: 3, sender: 'Charlie', content: 'Can you send me the report by tomorrow?' },
  {id: 4, sender: 'Diana', content: 'Let’s arrange a meeting for next week.' },
  { id: 5, sender: 'Eve', content: 'Thank you for your help with the presentation!' },
];
 

  const Messages = () => {
    const [messages, setMessages] = useState(initialMessages); // assume initialMessages is the initial state
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
  
    const handleReply = (message) => {
      setSelectedMessage(message);
      setReplyModalOpen(true);
    };
  
    const handleDelete = (message) => {
      setSelectedMessage(message);
      setDeleteModalOpen(true);
    };
  
    const sendReply = (replyContent) => {
      // Logic to send reply (add reply to the message threads or similar)
    };
  
    const confirmDelete = (messageId) => {
      setMessages(messages.filter((message) => message.id !== messageId));
    };
  
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Messages</h2>
        {/* Search functionality  */}
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search messages"
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <button className="ml-2 bg-gray-200 p-2 rounded-md">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        <MessageList messages={messages} onReply={handleReply} onDelete={handleDelete} />
        <ReplyModal isOpen={replyModalOpen} onClose={() => setReplyModalOpen(false)} onSend={sendReply} initialMessage={selectedMessage} />
        <DeleteConfirmationModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} messageToDelete={selectedMessage} />
      </div>
    );
  };
  
  export default Messages;
  