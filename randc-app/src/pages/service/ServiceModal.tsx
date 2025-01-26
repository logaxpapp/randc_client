// src/pages/services/ServiceModal.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaTimes, FaUpload, FaTrash } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import { uploadMultipleImages } from '../../util/cloudinary';
import Toast from '../../components/ui/Toast';
import { useListCategoriesQuery, CategoryPayload } from '../../features/category/categoryApi';

interface ServiceFormData {
  _id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  images: string[];
  
  // new fields
  category?: string;             // main category ID
  subcategories?: string[];      // array of subcategory IDs
}

interface ServiceModalProps {
  isOpen: boolean;
  initialData?: ServiceFormData;
  onClose: () => void;
  onSave: (data: ServiceFormData) => void | Promise<void>;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<ServiceFormData>({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    images: [],
    category: '',
    subcategories: [],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading } = useListCategoriesQuery();

  // Populate form when opening or initialData changes
  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    } else {
      setForm({
        name: '',
        description: '',
        price: 0,
        duration: 0,
        images: [],
        category: '',
        subcategories: [],
      });
    }
    setSelectedFiles([]);
    setIsUploading(false);
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    // Limit to 3 new images total (existing + new)
    const totalImagesCount = form.images.length + files.length;
    if (totalImagesCount > 3) {
      setToast({ show: true, message: 'You can upload a maximum of 3 images total.' });
      return;
    }
    setSelectedFiles(files);
  };

  const handleChange = (key: keyof ServiceFormData, value: any) => {
    setForm((prev) => {
      if (key === 'duration' || key === 'price') {
        value = Number(value);
        if (isNaN(value)) value = 0;
      }
      return { ...prev, [key]: value };
    });
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubcategoryToggle = (subcatId: string) => {
    setForm((prev) => {
      const existing = new Set(prev.subcategories);
      if (existing.has(subcatId)) {
        // Remove
        existing.delete(subcatId);
      } else {
        // Add
        existing.add(subcatId);
      }
      return { ...prev, subcategories: Array.from(existing) };
    });
  };

  // This function helps us find the selected main category object
  const selectedCategoryObj = categories?.find((cat) => cat._id === form.category);

  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      setError(null);

      // Basic validations
      if (!form.name.trim()) {
        setError('Service name is required.');
        setIsUploading(false);
        return;
      }
      if (!form.price || form.price <= 0) {
        setError('Price must be a positive number.');
        setIsUploading(false);
        return;
      }
      if (!form.duration || form.duration <= 0) {
        setError('Duration must be a positive number.');
        setIsUploading(false);
        return;
      }

      // Upload selected images
      let newUrls: string[] = [];
      if (selectedFiles.length > 0) {
        newUrls = await uploadMultipleImages(selectedFiles, { folder: 'services' });
      }

      const updatedForm = {
        ...form,
        images: [...form.images, ...newUrls],
      };

      await onSave(updatedForm);
      setToast({ show: true, message: 'Service saved successfully!' });
    } catch (err: any) {
      console.error('Image upload error:', err);
      setError(err.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative overflow-y-auto max-h-screen">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close Modal"
          >
            <FaTimes size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center">
            {form._id ? 'Edit Service' : 'Create Service'}
          </h2>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 bg-red-100 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Loading Categories */}
          {categoriesLoading && (
            <div className="text-sm text-gray-500 mb-2">Loading categories...</div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Service name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short description"
              />
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Main Category */}
            <div>
              <label className="block text-sm font-semibold mb-1">Main Category</label>
              <select
                value={form.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Category --</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategories (only show if the user selected a main category) */}
            {selectedCategoryObj && selectedCategoryObj.children && selectedCategoryObj.children.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-1">Subcategories</label>
                <div className="flex flex-wrap gap-2">
                  {selectedCategoryObj.children.map((child) => {
                    const isChecked = form.subcategories?.includes(child._id);
                    return (
                      <label
                        key={child._id}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSubcategoryToggle(child._id)}
                        />
                        <span>{child.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Existing Images */}
            {form.images.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Existing Images
                </label>
                <div className="flex flex-wrap gap-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt={`Service image ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-0 right-0 bg-white text-red-500 rounded-full p-1 hover:text-red-700 shadow"
                        aria-label="Remove Image"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Upload Images
              </label>
              <label className="flex items-center justify-center border border-dashed border-gray-300 rounded p-4 cursor-pointer hover:bg-gray-50">
                <FaUpload className="mr-2" />
                <span>Select Images (Max 3 total)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {selectedFiles.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Selected image ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSelectedFile(idx)}
                        className="absolute top-0 right-0 bg-white text-red-500 rounded-full p-1 hover:text-red-700 shadow"
                        aria-label="Remove Selected Image"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit} loading={isUploading}>
                {isUploading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </>
  );
};

export default ServiceModal;
