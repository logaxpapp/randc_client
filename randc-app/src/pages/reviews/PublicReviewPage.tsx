// src/pages/reviews/PublicReviewPage.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A public page for leaving a single review, accessed via
 *   /reviews/public?bookingId=...&token=...
 */
const PublicReviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const bookingId = query.get('bookingId');
  const token = query.get('token');

  // Local state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If query params are missing, show an error
  if (!bookingId || !token) {
    return (
      <div className="p-4 text-red-500">
        Missing required parameters (<code>bookingId</code> or <code>token</code>) in the URL.
      </div>
    );
  }

  // Submit review
  async function handleSubmit() {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      setLoading(true);

      // Build request body
      const body: any = {
        bookingId,
        token,
        rating,
        comment,
      };
      // Optionally pass "nonUserEmail"
      if (userEmail) {
        body.nonUserEmail = userEmail;
      }

      const res = await fetch('http://localhost:4000/api/public-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        // Server responded with 4xx or 5xx
        throw new Error(data.message || 'Failed to submit review');
      }
      if (!data.success) {
        throw new Error(data.message || 'Review submission was not successful');
      }

      setSuccessMsg('Thank you for your review!');
      // optionally navigate('/thank-you');
    } catch (error: any) {
      setErrorMsg(error.message || 'Error submitting review.');
    } finally {
      setLoading(false);
    }
  }

  // Star rating helpers
  const handleStarMouseEnter = (starIndex: number) => {
    setHoverRating(starIndex);
  };
  const handleStarMouseLeave = () => {
    setHoverRating(0);
  };
  const handleStarClick = (starIndex: number) => {
    setRating(starIndex);
  };

  // Shake animation for errors
  const errorAnimation = {
    initial: { x: 0 },
    animate: { x: [0, -5, 5, -5, 5, 0] },
    transition: { duration: 0.4 },
  };

  return (
    <motion.div
      className="max-w-xl mx-auto p-6 bg-white rounded-md shadow-md mt-8 mb-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Share Your Feedback</h1>
      <p className="text-gray-600 mb-6 text-center">
        We appreciate your time! Please rate our service and leave a comment.
      </p>

      {/* Success or Error */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            className="mb-4 p-3 bg-green-100 text-green-700 border border-green-200 rounded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            className="mb-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded"
            initial="initial"
            animate="animate"
            exit={{ opacity: 0 }}
            variants={errorAnimation}
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* If we've successfully submitted, hide the form */}
      {!successMsg && (
        <>
          {/* Name & Email */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 font-medium">Your Name (optional)</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:border-blue-400"
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 font-medium">Email (optional)</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:border-blue-400"
              placeholder="e.g. john@example.com"
            />
          </div>

          {/* Star Rating */}
          <div className="mb-6 flex items-center justify-center">
            {[1, 2, 3, 4, 5].map((starIndex) => {
              const isFilled = (hoverRating || rating) >= starIndex;
              return (
                <motion.button
                  key={starIndex}
                  onMouseEnter={() => handleStarMouseEnter(starIndex)}
                  onMouseLeave={handleStarMouseLeave}
                  onClick={() => handleStarClick(starIndex)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="focus:outline-none"
                  aria-label={`Rate ${starIndex} star${starIndex > 1 ? 's' : ''}`}
                >
                  {isFilled ? (
                    <FaStar className="text-yellow-400 w-10 h-10 mx-1" />
                  ) : (
                    <FaRegStar className="text-yellow-400 w-10 h-10 mx-1" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Comment box */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 font-medium">Comments</label>
            <textarea
              className="border p-2 rounded w-full focus:outline-none focus:border-blue-400"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share details about your experience..."
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              Submit Review
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default PublicReviewPage;
