import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaTimes } from 'react-icons/fa';
import { uploadMultipleImages } from '../util/cloudinary';
import { useListServicesQuery } from '../features/service/serviceApi';
import Select from '../components/Select';

interface GalleryFormData {
  _id?: string;
  service?: string; // The service ID
  name?: string;    // New field
  description?: string; // New field
  images: string[]; // List of existing or typed image URLs
}

interface GalleryModalProps {
  isOpen: boolean;
  initialData?: GalleryFormData;
  onClose: () => void;
  onSave: (data: GalleryFormData) => void;
  onDelete?: (id: string) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
  onDelete,
}) => {
  const [form, setForm] = useState<GalleryFormData>({ service: '', name: '', description: '', images: [] });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: services, isLoading: isServicesLoading, isError: isServicesError } = useListServicesQuery();

  // Re-populate state on open or when initialData changes
  useEffect(() => {
    if (initialData) {
      setForm({
        _id: initialData._id,
        service: initialData.service || '',
        name: initialData.name || '',
        description: initialData.description || '',
        images: initialData.images || [],
      });
    } else {
      setForm({ service: '', name: '', description: '', images: [] });
    }
    setSelectedFiles([]);
    setIsUploading(false);
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Convert images array to comma-separated string for text area
  const imagesString = form.images.join(', ');

  // Update images from typed text
  const handleChangeImages = (value: string) => {
    const splitted = value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, images: splitted }));
  };

  // When user picks one or more files
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedFiles(filesArray);
  };

  // On Save: 1) Upload any selected files, 2) combine with typed images, 3) call onSave
  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      setError(null);

      let newUploadedUrls: string[] = [];

      if (selectedFiles.length > 0) {
        newUploadedUrls = await uploadMultipleImages(selectedFiles);
      }

      const allImages = [...form.images, ...newUploadedUrls];
      const updatedForm = { ...form, images: allImages };

      await onSave(updatedForm);
    } catch (err: any) {
      console.error('Error uploading images:', err);
      setError(err.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    if (form._id && onDelete) {
      onDelete(form._id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {form._id ? 'Edit Gallery' : 'Create Gallery'}
        </h2>

        {/* Error message */}
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        {/* Service Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service
          </label>
          {isServicesLoading ? (
            <p className="text-sm text-gray-500">Loading services...</p>
          ) : isServicesError ? (
            <p className="text-sm text-red-500">Failed to load services.</p>
          ) : (
            <select
              value={form.service || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, service: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select a service</option>
              {services?.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          )}
        </div>


        {/* Name field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name (optional)
          </label>
          <input
            type="text"
            value={form.name || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter a friendly name"
          />
        </div>

        {/* Description field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            rows={2}
            className="w-full border rounded px-3 py-2"
            value={form.description || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Short description for this gallery"
          />
        </div>

        {/* Existing or typed-in images */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Existing Image URLs (comma-separated)
          </label>
          <textarea
            rows={2}
            className="w-full border rounded px-3 py-2"
            value={imagesString}
            onChange={(e) => handleChangeImages(e.target.value)}
            placeholder="e.g. https://example.com/img1.jpg, https://example.com/img2.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use commas to separate multiple URLs
          </p>
        </div>

        {/* File input for new uploads */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Files
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full"
          />
          {selectedFiles.length > 0 && (
            <p className="mt-1 text-sm text-gray-600">
              {selectedFiles.length} file(s) selected
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          {form._id && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
