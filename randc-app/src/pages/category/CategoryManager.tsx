// src/pages/category/CategoryManager.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import {
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
} from 'react-icons/fa';

import {
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../features/category/categoryApi';
import { Category } from '../../types/Category';

const CategoryManager: React.FC = () => {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useListCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  // Local UI States
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Confirmation dialog
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    categoryId?: string;
  }>({ isOpen: false });

  // Searching
  const [searchTerm, setSearchTerm] = useState('');

  // The form includes: name, description, parentCategory, slug, tags
  const formik = useFormik<{
    name: string;
    description: string;
    parentCategory: string;
    slug: string;
    tags: string;
  }>({
    enableReinitialize: true,
    initialValues: {
      name: editingCategory?.name || '',
      description: editingCategory?.description || '',
      parentCategory: editingCategory?.parentCategory || '',
      slug: editingCategory?.slug || '',
      tags: editingCategory?.tags ? editingCategory.tags.join(', ') : '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Category name is required'),
      description: Yup.string().max(200, 'Description too long'),
      slug: Yup.string().max(100, 'Slug too long'),
      tags: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        // Convert tags
        let finalTags: string[] = [];
        if (values.tags.trim()) {
          finalTags = values.tags.split(',').map((t) => t.trim());
        }

        // If no parent chosen => empty string => top-level
        const parentCat = values.parentCategory || undefined;

        // Build payload
        const payload: Partial<Category> = {
          name: values.name.trim(),
          description: values.description.trim(),
          slug: values.slug.trim() || undefined,
          tags: finalTags.length > 0 ? finalTags : undefined,
          parentCategory: parentCat,
        };

        if (editingCategory) {
          // Update existing
          await updateCategory({
            categoryId: editingCategory._id,
            data: payload,
          }).unwrap();
        } else {
          // Create new
          await createCategory(payload).unwrap();
        }

        refetch();
        formik.resetForm();
        setShowModal(false);
        setEditingCategory(null);
      } catch (err) {
        console.error('Failed to save category:', err);
      }
    },
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    formik.resetForm();
  };

  // Searching logic
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    if (!searchTerm.trim()) return categories;
    const lower = searchTerm.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(lower));
  }, [categories, searchTerm]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <FaSpinner className="animate-spin text-indigo-500 mr-2" />
        <span>Loading categories...</span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-6 text-red-500">
        <p>Failed to load categories.</p>
        <button onClick={() => refetch()} className="underline text-blue-600 mt-2">
          Retry
        </button>
      </div>
    );
  }

  // Handlers
  const handleCreateClick = () => {
    setEditingCategory(null);
    formik.resetForm();
    setShowModal(true);
  };

  const handleEditClick = (cat: Category) => {
    setEditingCategory(cat);
    formik.setValues({
      name: cat.name || '',
      description: cat.description || '',
      parentCategory: cat.parentCategory || '',
      slug: cat.slug || '',
      tags: cat.tags ? cat.tags.join(', ') : '',
    });
    setShowModal(true);
  };

  const handleDeleteClick = (cat: Category) => {
    setDeleteConfirm({ isOpen: true, categoryId: cat._id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.categoryId) return;
    try {
      await deleteCategory(deleteConfirm.categoryId).unwrap();
      refetch();
      setDeleteConfirm({ isOpen: false });
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  
  if (!categories) {
    return <div>No categories loaded</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={handleCreateClick}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus />
          <span>New Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search category by name..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      {filteredCategories.length === 0 ? (
        <div className="bg-gray-50 p-4 text-gray-600 border rounded">
          No categories found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="text-gray-700">
                <th className="py-3 px-4 text-left font-medium border-b w-1/4">Name</th>
                <th className="py-3 px-4 text-left font-medium border-b w-1/4">Parent</th>
                <th className="py-3 px-4 text-left font-medium border-b w-1/4">Tags</th>
                <th className="py-3 px-4 text-left font-medium border-b w-1/4">Description</th>
                <th className="py-3 px-4 text-right font-medium border-b w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => {
                const categoriesData = categories || [];
                const parentName = categoriesData.find((c) => c._id === cat.parentCategory)?.name;
                return (
                  <tr key={cat._id} className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">{cat.name}</td>
                    <td className="py-2 px-4 border-b">{parentName || '—'}</td>
                    <td className="py-2 px-4 border-b">
                      {cat.tags && cat.tags.length > 0 ? cat.tags.join(', ') : '—'}
                    </td>
                    <td className="py-2 px-4 border-b">{cat.description || '—'}</td>
                    <td className="py-2 px-4 border-b text-right">
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="mr-2 px-2 py-1 text-blue-600 hover:text-blue-800"
                        title="Edit Category"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cat)}
                        className="px-2 py-1 text-red-600 hover:text-red-800"
                        title="Delete Category"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white w-full max-w-md mx-auto rounded shadow-lg relative p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                aria-label="Close Modal"
              >
                <FaTimes />
              </button>

              <h2 className="text-xl font-bold mb-4">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={clsx(
                      'w-full border rounded p-2',
                      formik.touched.name && formik.errors.name
                        ? 'border-red-500'
                        : 'border-gray-300'
                    )}
                    {...formik.getFieldProps('name')}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm">{formik.errors.name}</p>
                  )}
                </div>

                {/* Parent Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Category
                  </label>
                  <select
                    id="parentCategory"
                    className="w-full border rounded p-2 border-gray-300"
                    {...formik.getFieldProps('parentCategory')}
                  >
                    <option value="">— No parent / top-level —</option>
                    {categories
                      .filter((c) => !editingCategory || c._id !== editingCategory._id)
                      .map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div> 

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (optional)
                  </label>
                  <input
                    id="slug"
                    type="text"
                    className={clsx(
                      'w-full border rounded p-2',
                      formik.touched.slug && formik.errors.slug
                        ? 'border-red-500'
                        : 'border-gray-300'
                    )}
                    {...formik.getFieldProps('slug')}
                  />
                  {formik.touched.slug && formik.errors.slug && (
                    <p className="text-red-500 text-sm">{formik.errors.slug}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    id="tags"
                    type="text"
                    className="w-full border rounded p-2 border-gray-300"
                    placeholder="e.g. hair, beauty"
                    {...formik.getFieldProps('tags')}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className={clsx(
                      'w-full border rounded p-2',
                      formik.touched.description && formik.errors.description
                        ? 'border-red-500'
                        : 'border-gray-300'
                    )}
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.description}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {(isCreating || isUpdating) && (
                      <FaSpinner className="animate-spin" />
                    )}
                    <span>{editingCategory ? 'Save' : 'Create'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white w-full max-w-sm mx-auto rounded shadow-lg relative p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setDeleteConfirm({ isOpen: false })}
                aria-label="Close Confirmation"
              >
                <FaTimes />
              </button>
              <h3 className="text-lg font-bold mb-3">Confirm Deletion</h3>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this category?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                  onClick={() => setDeleteConfirm({ isOpen: false })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting && <FaSpinner className="animate-spin" />}
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManager;
