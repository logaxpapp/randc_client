import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface CardViewProps {
  galleries: any[];
  onEdit: (gallery: any) => void;
  onDelete: (id: string) => void;
}

const CardView: React.FC<CardViewProps> = ({ galleries, onEdit, onDelete }) => {
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    images: string[];
    photoIndex: number;
  }>({
    isOpen: false,
    images: [],
    photoIndex: 0,
  });

  const openLightbox = (images: string[], index: number) => {
    setLightbox({
      isOpen: true,
      images,
      photoIndex: index,
    });
  };

  const closeLightbox = () => {
    setLightbox({
      isOpen: false,
      images: [],
      photoIndex: 0,
    });
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {galleries.map((gal) => (
          <motion.div
            key={gal._id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative h-48 overflow-hidden">
              {gal.images?.length ? (
                <>
                  <img
                    src={gal.images[0]}
                    alt={`${gal.name || 'Gallery'} image`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openLightbox(gal.images, 0)}
                    loading="lazy"
                  />
                  {gal.images.length > 1 && (
                    <div
                      className="absolute top-0 left-0 w-full h-full bg-black/40 text-white flex items-center justify-center text-sm cursor-pointer"
                      onClick={() => openLightbox(gal.images, 0)}
                    >
                      +{gal.images.length - 1} more
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Images
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col">
              <h2 className="text-lg font-semibold line-clamp-1">
                {gal.name || '(No name)'}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-2 my-2">
                {gal.description || '--'}
              </p>
              {gal.service && (
                <p className="text-xs text-gray-500">
                  <strong>{gal.service.name}</strong> — {gal.service.description}
                </p>
              )}

              <div className="mt-auto flex justify-end space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => onEdit(gal)}
                  className="text-indigo-600 hover:text-indigo-800 inline-flex items-center space-x-1"
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => gal._id && onDelete(gal._id)}
                  className="text-red-600 hover:text-red-800 inline-flex items-center space-x-1"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {!galleries.length && (
          <motion.div
            className="col-span-full text-center py-4 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No galleries found.
          </motion.div>
        )}
      </AnimatePresence>

      {lightbox.isOpen && (
        <Lightbox
          open={lightbox.isOpen}
          close={closeLightbox}
          slides={lightbox.images.map((img) => ({ src: img }))}
          index={lightbox.photoIndex}
        />
      )}
    </motion.div>
  );
};

export default CardView;
