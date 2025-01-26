// src/pages/services/ServiceViewModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import { ServicePayload } from '../../features/service/serviceApi';

interface ServiceViewModalProps {
  isOpen: boolean;
  service: ServicePayload | null;
  onClose: () => void;
}

const ServiceViewModal: React.FC<ServiceViewModalProps> = ({
  isOpen,
  service,
  onClose,
}) => {
  if (!isOpen || !service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Container */}
          <motion.div
            className="bg-white w-full max-w-xl rounded-lg shadow-xl relative overflow-y-auto max-h-full p-6"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <FaTimes />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {service.name}
            </h2>

            {/* Images */}
            {service.images && service.images.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {service.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Service image ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            ) : (
              <div className="mb-4 text-gray-500 text-sm">No images available</div>
            )}

            {/* Category & Subcategories */}
            <div className="mb-3 text-sm text-gray-700">
              <strong>Category:</strong>{' '}
              {(service as any).category?.name || '—'}
            </div>
            {service.subcategories && service.subcategories.length > 0 && (
              <div className="mb-3 text-sm text-gray-700">
                <strong>Subcategories:</strong>{' '}
                {service.subcategories.join(', ')}
              </div>
            )}

            {/* Price & Duration */}
            <div className="flex items-center justify-between text-sm text-gray-800 mb-3">
              <span>
                <strong>Price:</strong> ${service.price}
              </span>
              <span>
                <strong>Duration:</strong> {service.duration} min
              </span>
            </div>

            {/* Description */}
            {service.description && (
              <div className="text-sm text-gray-700">
                <strong>Description:</strong>
                <p className="mt-1 whitespace-pre-line">{service.description}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-right">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceViewModal;
