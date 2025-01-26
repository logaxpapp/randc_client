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
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold mb-4 text-lg text-gray-800">Reviews</h3>
        <p className="text-gray-600">No reviews yet.</p>
      </div>
    );
  }

  return (
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
  );
};

export default ReviewsSection;
