// src/pages/admin/AdminUserListPage.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaThList, FaTh } from 'react-icons/fa';
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

  // Activate/Deactivate
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

  // Delete
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

  // Save user from modal
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

  // Render states
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

  // Main Layout
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* --- Top Wave Divider (Rotated) --- */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-white to-blue-50 z-0" />

      {/* Main Container */}
      <div className="relative z-10 p-4 max-w-7xl mx-auto">
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
              className={`p-2 rounded ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              } transition`}
              onClick={() => setViewMode('list')}
              aria-label="View as list"
            >
              <FaThList />
            </button>
            <button
              className={`p-2 rounded ${
                viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              } transition`}
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
              <td className="p-2">{user.firstName} {user.lastName}</td>
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
