// src/components/reviews/ReviewsSection.tsx

import React, { useState } from 'react';
import { FaStar, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Review } from '../../data/mockData';

interface ReviewsSectionProps {
  reviews: Review[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  if (reviews.length === 0) {
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

        {/* Main content */}
        <div className="relative z-10 p-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4 text-lg text-gray-800">Reviews</h3>
            <p className="text-gray-600">No reviews yet.</p>
          </div>
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
  }

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

      {/* Main content */}
      <div className="relative z-10 p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4 text-lg text-gray-800">Reviews</h3>
          <div className="space-y-4">
            {currentReviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-none">
                <div className="flex items-center space-x-2 text-yellow-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                  <span className="text-sm text-gray-700">{review.title}</span>
                  <span className="text-xs text-gray-500">by {review.author}</span>
                  <span className="text-xs text-gray-500 ml-auto">{review.date}</span>
                </div>
                <p className="text-sm text-gray-800 mt-2">{review.comment}</p>
                {review.reply && (
                  <div className="mt-2 ml-4 p-3 bg-gray-50 border-l-2 border-gray-300 text-sm text-gray-700">
                    <strong>Reply:</strong> {review.reply}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                <FaAngleLeft />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                <FaAngleRight />
              </button>
            </div>
          )}
        </div>
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

export default ReviewsSection;
