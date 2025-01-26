// src/pages/admin/AdminUserListPage.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaThList, FaTh,  } from 'react-icons/fa';
import ActionDropdown from '../../components/ui/ActionDropdown';
import {
  useListUsersQuery,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useUpdateUserMutation,
} from '../../features/user/userApi';
import UserModal from './UserModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { User } from '../../types/user';

type ViewMode = 'list' | 'card';

const AdminUserListPage: React.FC = () => {
  // 1. Query for all users
  const { data: users, isLoading, isError, refetch } = useListUsersQuery();

  // 2. Mutations
  const [deleteUser] = useDeleteUserMutation();
  const [activateUser] = useActivateUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // 3. Local UI State
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    userId: string;
  }>({ isOpen: false, userId: '' });

  // 4. Derived list of users based on searchTerm
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      const fullName = `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase();
      const email = u.email.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase())
      );
    });
  }, [users, searchTerm]);

  // 5. Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenModal = (user?: User) => {
    if (user) setSelectedUser(user);
    else setSelectedUser(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  // 5.1 Activate/Deactivate
  const handleToggleActive = async (user: User) => {
    if (!user._id) return;
    try {
      if (user.isActive) {
        await deactivateUser(user._id).unwrap();
      } else {
        await activateUser(user._id).unwrap();
      }
      refetch();
    } catch (err) {
      console.error('Failed to toggle user active:', err);
    }
  };

  // 5.2 Delete
  const handleDeleteUser = (userId: string) => {
    setConfirmDialog({ isOpen: true, userId });
  };

  const confirmDeleteUser = async () => {
    try {
      await deleteUser(confirmDialog.userId).unwrap();
      refetch();
      setConfirmDialog({ isOpen: false, userId: '' });
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const cancelDeleteUser = () => {
    setConfirmDialog({ isOpen: false, userId: '' });
  };

  // 5.3 Save user from modal
  const handleSaveUser = async (userData: Partial<User>) => {
    if (!selectedUser?._id) return;
    try {
      await updateUser({ userId: selectedUser._id, data: userData }).unwrap();
      refetch();
      setModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  // 6. Render states
  if (isLoading) {
    return (
      <div className="p-4 text-gray-600 animate-pulse">
        Loading users...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Failed to load users.{' '}
        <button onClick={() => refetch()} className="underline">
          Retry
        </button>
      </div>
    );
  }

  // 7. Layout
  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Manage Users</h1>
        <div className="flex items-center space-x-2">
          {/* Search Bar */}
          <div className="relative text-gray-600">
            <input
              type="search"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={handleSearch}
              className="bg-white h-10 px-4 pr-8 rounded text-sm border border-gray-300 focus:outline-none focus:ring-1"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* View Toggle */}
          <button
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'} transition`}
            onClick={() => setViewMode('list')}
            aria-label="View as list"
          >
            <FaThList />
          </button>
          <button
            className={`p-2 rounded ${viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-200'} transition`}
            onClick={() => setViewMode('card')}
            aria-label="View as card"
          >
            <FaTh />
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredUsers.length === 0 ? (
        <div className="p-4 text-gray-500">No users found.</div>
      ) : viewMode === 'list' ? (
        <ListView
          users={filteredUsers}
          onEdit={handleOpenModal}
          onDelete={handleDeleteUser}
          onToggleActive={handleToggleActive}
        />
      ) : (
        <CardView
          users={filteredUsers}
          onEdit={handleOpenModal}
          onDelete={handleDeleteUser}
          onToggleActive={handleToggleActive}
        />
      )}

      {/* Modal for editing user */}
      <AnimatePresence>
        {modalOpen && (
          <UserModal
            user={selectedUser}
            onClose={handleCloseModal}
            onSave={handleSaveUser}
          />
        )}
      </AnimatePresence>

      {/* Confirm Delete Dialog */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            title="Delete User"
            message="Are you sure you want to delete this user?"
            onConfirm={confirmDeleteUser}
            onCancel={cancelDeleteUser}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUserListPage;

/** ============== HELPER COMPONENTS: ListView & CardView ============= */
interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onToggleActive: (user: User) => void;
}

// A table-based list with action dropdown
const ListView: React.FC<UserListProps> = ({ users, onEdit, onDelete, onToggleActive }) => {
    return (
      <motion.table
        className="w-full bg-white rounded shadow-sm overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Roles</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {users.map((user) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="p-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.roles.join(', ')}</td>
                <td className="p-2 text-center">
                  {user.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-gray-400 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="p-2 text-right">
                  <ActionDropdown
                    onEdit={() => onEdit(user)}
                    onToggleActive={() => onToggleActive(user)}
                    onDelete={() => onDelete(user._id)}
                    isActive={user.isActive}
                  />
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </motion.table>
    );
  };
  

// A card-based grid layout with action dropdown
const CardView: React.FC<UserListProps> = ({ users, onEdit, onDelete, onToggleActive }) => {
    return (
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence>
          {users.map((user) => (
            <motion.div
              key={user._id}
              className="bg-white rounded shadow-sm p-4 relative hover:shadow-lg transition-shadow"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-bold text-lg">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="mt-2">
                <strong>Roles:</strong> {user.roles.join(', ')}
              </p>
              <p className="mt-1">
                <strong>Status:</strong>{' '}
                {user.isActive ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-gray-400 font-semibold">Inactive</span>
                )}
              </p>
  
              {/* Action Dropdown */}
              <div className="absolute top-4 right-4">
                <ActionDropdown
                  onEdit={() => onEdit(user)}
                  onToggleActive={() => onToggleActive(user)}
                  onDelete={() => onDelete(user._id)}
                  isActive={user.isActive}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };
  