// src/pages/user/components/UserToast.tsx
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UserToast: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg">User toast message!</div>;
};

export default UserToast;
