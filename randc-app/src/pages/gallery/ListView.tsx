import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface ListViewProps {
  galleries: any[];
  onEdit: (gallery: any) => void;
  onDelete: (id: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ galleries, onEdit, onDelete }) => {
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

  const moveNext = () => {
    setLightbox((prev) => ({
      ...prev,
      photoIndex: (prev.photoIndex + 1) % prev.images.length,
    }));
  };

  const movePrev = () => {
    setLightbox((prev) => ({
      ...prev,
      photoIndex:
        (prev.photoIndex + prev.images.length - 1) % prev.images.length,
    }));
  };

  return (
    <div className="shadow rounded-lg overflow-hidden bg-white">
      <motion.table
        className="min-w-full table-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
              Name
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
              Description
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
              Service
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
              Images
            </th>
            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {galleries.map((gal) => (
              <motion.tr
                key={gal._id}
                className="border-b last:border-0 hover:bg-gray-50 transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <td className="py-3 px-4 text-sm text-gray-800">
                  {gal.name || '(No name)'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {gal.description || '--'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {gal.service ? (
                    <div>
                      <div className="font-bold text-gray-900">
                        {gal.service.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {gal.service.description}
                      </div>
                    </div>
                  ) : (
                    '--'
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {gal.images?.length ? (
                    <div className="flex space-x-2">
                      {gal.images.slice(0, 3).map((img: string, i: number) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Gallery ${gal._id} image ${i}`}
                          className="w-12 h-12 object-cover rounded border cursor-pointer transition hover:scale-105"
                          onClick={() => openLightbox(gal.images, i)}
                          loading="lazy"
                        />
                      ))}
                      {gal.images.length > 3 && (
                        <div
                          className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded border cursor-pointer hover:bg-gray-300"
                          onClick={() => openLightbox(gal.images, 3)}
                        >
                          +{gal.images.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    'No images'
                  )}
                </td>
                <td className="py-3 px-4 text-right text-sm">
                  <button
                    onClick={() => onEdit(gal)}
                    className="text-indigo-600 hover:text-indigo-800 mr-3 inline-flex items-center space-x-1"
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
                </td>
              </motion.tr>
            ))}
            {!galleries.length && (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500 text-sm"
                >
                  No galleries found.
                </td>
              </motion.tr>
            )}
          </AnimatePresence>
        </tbody>
      </motion.table>

      {/* Lightbox */}
      {lightbox.isOpen && (
        <Lightbox
          open={lightbox.isOpen}
          close={closeLightbox}
          slides={lightbox.images.map((img) => ({ src: img }))}
          index={lightbox.photoIndex}
          render={{
            buttonNext: () => (
              <button
                onClick={moveNext}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/70 text-white p-3 rounded-full shadow hover:bg-black/50"
                aria-label="Next"
              >
                &gt;
              </button>
            ),
            buttonPrev: () => (
              <button
                onClick={movePrev}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/70 text-white p-3 rounded-full shadow hover:bg-black/50"
                aria-label="Previous"
              >
                &lt;
              </button>
            ),
          }}
        />
      )}
    </div>
  );
};

export default ListView;
