// src/components/chat/ChatSidebar.tsx
import React, { useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useAppSelector } from '../../app/hooks';
import { useListStaffQuery } from '../../features/staff/staffApi';
import { useListCustomersQuery } from '../../features/customer/customerApi';
import {
  useCreateChatMutation,
  useListChatsQuery,
} from '../../features/chat/chatApi';
import ChatSidebarItem from './ChatSidebarItem';

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void;
  activeChatId?: string; // highlight that chat
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat, activeChatId }) => {
  const { user } = useAppSelector((state) => state.auth);

  // 1) Mutations
  const [createChat] = useCreateChatMutation();

  // 2) Fetch chats
  const {
    data: myChats,
    isLoading: loadingChats,
    error: chatsError,
  } = useListChatsQuery();

  // 3) Check roles for staff/customers
  const canViewStaffCustomers =
    user?.roles?.includes('CLEANER') || user?.roles?.includes('STAFF');

  // Fetch staff & customers if allowed
  const { data: staffData } = useListStaffQuery(undefined, { skip: !canViewStaffCustomers });
  const { data: customersData } = useListCustomersQuery(undefined, { skip: !canViewStaffCustomers });

  // 4) Merge staff + customers + optional cleaners
  const participants = useMemo(() => {
    if (!canViewStaffCustomers) return [];

    const staffList = staffData || [];
    const custList = customersData || [];

    // Map staff => guarantee _id, first/last name as strings:
    const mappedStaff = staffList.map((s) => ({
      _id: s._id ?? '',              // or s._id!
      firstName: s.firstName ?? '',
      lastName: s.lastName ?? '',
      role: s.role || 'STAFF',
    }));

    // Map customers
    const mappedCust = custList.map((c) => ({
      _id: c._id ?? '',
      firstName: c.firstName ?? '',
      lastName: c.lastName ?? '',
      role: 'CUSTOMER',
    }));

    // Map cleaners if user is STAFF
    const mappedCleaners = staffList
      .filter((s) => s.role === 'CLEANER')
      .map((c) => ({
        _id: c._id ?? '',
        firstName: c.firstName ?? '',
        lastName: c.lastName ?? '',
        role: 'CLEANER',
      }));

    return user?.roles?.includes('STAFF')
      ? [...mappedStaff, ...mappedCust, ...mappedCleaners]
      : [...mappedStaff, ...mappedCust];
  }, [canViewStaffCustomers, staffData, customersData, user?.roles]);

  // 5) Toggle: show existing vs. new
  const [showExisting, setShowExisting] = useState(true);

  // 6) Only show chats that have lastMessage
  const nonEmptyChats = (myChats || []).filter((c) => c.lastMessage);

  // Handler to create a new chat with single participant
  async function handleSelectParticipant(p: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
  }) {
    if (!user) return;
    try {
      const chat = await createChat({
        participants: [p._id],
        isGroup: false,
      }).unwrap();
      onSelectChat(chat._id);
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Chats</h2>
        {canViewStaffCustomers && (
          <button
            onClick={() => setShowExisting(!showExisting)}
            className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            {showExisting ? 'New Chat' : 'My Chats'}
          </button>
        )}
      </div>

      {/* Optional search bar */}
      <div className="p-2 border-b flex items-center space-x-2">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          className="flex-1 focus:outline-none text-sm"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {showExisting ? (
          <div>
            {loadingChats && (
              <div className="p-4 text-gray-500">Loading your chats...</div>
            )}
            {chatsError && <div className="p-4 text-red-500">Failed to load chats</div>}

            {nonEmptyChats.map((chat) => {
              let displayName = 'Untitled Chat';
              if (chat.isGroup && chat.name) {
                displayName = chat.name;
              } else if (!chat.isGroup && chat.participants.length === 2) {
                const other = chat.participants.find((p) => p._id !== user?._id);
                if (other) {
                  displayName = `${other.firstName} ${other.lastName}`;
                }
              }

              // chat._id is presumably always defined from the DB
              // but if TS says it's possibly undefined, you can do chat._id!
              const itemUser = {
                _id: chat._id!,         // or chat._id ?? ''
                firstName: displayName,
                lastName: '',
                role: chat.isGroup ? 'GROUP' : 'USER',
                lastMessage: chat.lastMessage,
              };

              const isActive = chat._id === activeChatId;

              return (
                <ChatSidebarItem
                  key={chat._id}
                  user={itemUser}
                  active={isActive}
                  onClick={() => onSelectChat(chat._id!)} // or chat._id || ''
                />
              );
            })}
            {nonEmptyChats.length === 0 && (
              <div className="p-4 text-gray-500">No chats with messages</div>
            )}
          </div>
        ) : (
          <div>
            {participants.map((p) => (
              <ChatSidebarItem
                key={p._id}
                user={p}
                onClick={() => handleSelectParticipant(p)}
              />
            ))}
            {participants.length === 0 && (
              <div className="p-4 text-gray-500">
                No staff/customers found or you don’t have the right role.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
