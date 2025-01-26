// src/components/customer/BulkUploadModal.tsx
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-md p-6 rounded shadow-lg relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Icon */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-xl font-bold mb-4">Bulk Import Customers</h2>

            <p className="mb-4 text-gray-600">
              Upload a CSV or Excel (.xlsx) file with columns:
              <br />
              <span className="font-medium">firstName, lastName, email, phone</span>
            </p>

            {error && <div className="mb-2 text-red-600">{error}</div>}

            {/* File Picker */}
            <div className="mb-4">
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleSelectFile}
                className="block w-full"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: <span className="font-semibold">{selectedFile.name}</span>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpload} disabled={!selectedFile}>
                Upload
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkUploadModal;
