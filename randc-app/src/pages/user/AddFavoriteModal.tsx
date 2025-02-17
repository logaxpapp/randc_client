// Within UserMarketplace.tsx (or a separate file)...

import React, { useState } from 'react';
import Modal from './Modal'; // or your own modal
import Button from '../../components/ui/Button'; 
import { useCreateFavoriteMutation } from '../../features/favorite/favoriteApi';

interface AddFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any; // or your actual Service type
}

const AddFavoriteModal: React.FC<AddFavoriteModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const [note, setNote] = useState('');
  const [createFavorite, { isLoading }] = useCreateFavoriteMutation();

  if (!isOpen) return null;
  if (!service) return null; // If no service, nothing to show

  async function handleSubmit() {
    try {
      await createFavorite({
        serviceId: service._id,
        note: note.trim() ? note.trim() : undefined,
      }).unwrap();
      setNote('');
      onClose();
    } catch (err) {
      console.error('Failed to create favorite:', err);
      // optionally show a toast
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Favorites">
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          You are about to favorite: <strong>{service.name}</strong>
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Optional Note
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Add Favorite'}
        </Button>
      </div>
    </Modal>
  );
};

export default AddFavoriteModal;
