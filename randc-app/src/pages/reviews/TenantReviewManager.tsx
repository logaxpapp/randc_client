import React, { useState } from 'react';
import {
  FaSpinner,
  FaCheck,
  FaTimes,
  FaClipboardList,
  FaSearch,
  FaEye,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../app/hooks';
import {
  useListReviewsByTenantQuery,
  useApproveReviewMutation,
  useReplyToReviewMutation,
} from '../../features/review/reviewApi';
import { Review } from '../../types/Review';

const TenantReviewManager: React.FC = () => {
  // 1) Tenant ID from user
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  // 2) Local states for filters/pagination
  const [searchText, setSearchText] = useState('');
  const [minRating, setMinRating] = useState(1);
  const [maxRating, setMaxRating] = useState(5);
  const [showUnpublished, setShowUnpublished] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  // 3) Detailed modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [ownerReplyDraft, setOwnerReplyDraft] = useState(''); // local state for editing reply

  // 4) RTK Query calls
  const {
    data, // => { reviews, totalCount }
    isLoading,
    isError,
    refetch,
  } = useListReviewsByTenantQuery(
    {
      tenantId: tenantId || '',
      page,
      limit,
      search: searchText,
      minRating,
      maxRating,
      showUnpublished,
    },
    { skip: !tenantId }
  );

  // Data from query
  const reviews = data?.reviews || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Mutations
  const [approveReview, { isLoading: isApproving }] = useApproveReviewMutation();
  const [replyToReview, { isLoading: isReplying }] = useReplyToReviewMutation();

  // Error message for either operation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ---------------------------
  //   AUTH & LOADING CHECKS
  // ---------------------------
  if (!tenantId) {
    return (
      <div className="p-4 text-red-500">
        <p>You do not belong to a tenant account.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <FaSpinner className="animate-spin text-3xl text-blue-600 mr-3" />
        <span>Loading your reviews...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        <p>Failed to load reviews. Please try again.</p>
        <button onClick={() => refetch()} className="underline text-blue-600">
          Reload
        </button>
      </div>
    );
  }

  // ---------------------------
  //  Approve a hidden review
  // ---------------------------
  const handlePublishReview = async (reviewId: string) => {
    setErrorMsg(null);
    try {
      await approveReview({ reviewId }).unwrap();
      refetch();
    } catch (err: any) {
      console.error('Failed to approve review:', err);
      setErrorMsg('Failed to publish review. Please try again.');
    }
  };

  // ---------------------------
  //   VIEW DETAILS MODAL
  // ---------------------------
  const handleOpenDetailModal = (rev: Review) => {
    setSelectedReview(rev);
    // Pre-fill the reply text area with existing reply
    setOwnerReplyDraft(rev.ownerReply || '');
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedReview(null);
    setOwnerReplyDraft('');
    setDetailModalOpen(false);
  };

  // ---------------------------
  //   SUBMIT REPLY (IN MODAL)
  // ---------------------------
  const handleSaveReply = async () => {
    try {
      if (!selectedReview) return;
      await replyToReview({
        reviewId: selectedReview._id,
        reply: ownerReplyDraft,
      }).unwrap();

      // After saving, refetch the list to update the table
      refetch();
      handleCloseDetailModal();
    } catch (err: any) {
      console.error('Failed to save reply:', err);
      setErrorMsg('Failed to save reply. Please try again.');
    }
  };

  // ---------------------------
  //   RENDER
  // ---------------------------
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Tenant Reviews</h1>

      {errorMsg && (
        <motion.div
          className="bg-red-100 border border-red-200 text-red-700 p-2 rounded mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {errorMsg}
        </motion.div>
      )}

      {/* FILTERS & SEARCH */}
      <div className="flex flex-wrap gap-4 items-center mb-4 bg-gray-50 p-4 rounded shadow">
        {/* Search box */}
        <div className="flex items-center bg-white border rounded px-2">
          <FaSearch className="mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search comments/email..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
            className="focus:outline-none"
          />
        </div>

        {/* Rating range */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">Min Rating: {minRating}</label>
          <input
            type="range"
            min={1}
            max={5}
            value={minRating}
            onChange={(e) => {
              setMinRating(Number(e.target.value));
              setPage(1);
            }}
          />
          <label className="text-sm text-gray-700">Max Rating: {maxRating}</label>
          <input
            type="range"
            min={1}
            max={5}
            value={maxRating}
            onChange={(e) => {
              setMaxRating(Number(e.target.value));
              setPage(1);
            }}
          />
        </div>

        {/* Show Unpublished? */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showUnpublished"
            checked={showUnpublished}
            onChange={(e) => {
              setShowUnpublished(e.target.checked);
              setPage(1);
            }}
          />
          <label htmlFor="showUnpublished" className="text-sm text-gray-700">
            Show Unpublished
          </label>
        </div>
      </div>

      {/* If no reviews => placeholder */}
      {reviews.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded p-10 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaClipboardList className="text-gray-300 text-7xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No matching reviews
          </h2>
          <p className="text-gray-500">Try adjusting your filters or search terms.</p>
        </motion.div>
      ) : (
        // Show reviews table
        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <table className="min-w-full border-collapse bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 border-b">Rating</th>
                <th className="py-2 px-3 border-b">Comment</th>
                <th className="py-2 px-3 border-b">Email/User</th>
                <th className="py-2 px-3 border-b">Published?</th>
                <th className="py-2 px-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review: Review) => (
                <tr
                  key={review._id}
                  className={!review.isPublished ? 'bg-red-50' : ''}
                >
                  <td className="py-2 px-3 border-b text-center">{review.rating}</td>
                  <td className="py-2 px-3 border-b">
                    {review.comment || 'No comment'}
                  </td>
                  <td className="py-2 px-3 border-b">
                    {review.nonUserEmail || 'Anonymous'}
                  </td>
                  <td className="py-2 px-3 border-b text-center">
                    {review.isPublished ? (
                      <span className="inline-flex items-center text-green-600">
                        <FaCheck className="mr-1" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-gray-600">
                        <FaTimes className="mr-1" /> Hidden
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 border-b text-center space-x-2">
                    {!review.isPublished && (
                      <button
                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-70"
                        onClick={() => handlePublishReview(review._id)}
                        disabled={isApproving}
                      >
                        Publish
                      </button>
                    )}
                    {/* View Details Button */}
                    <button
                      className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      onClick={() => handleOpenDetailModal(review)}
                    >
                      <FaEye className="mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* PAGINATION Controls */}
      {totalCount > limit && (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailModalOpen && selectedReview && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <motion.div
            className="bg-white p-6 rounded shadow max-w-2xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Review Details</h2>

            {/* Display a grid of info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Rating
                </label>
                <p className="mt-1 text-gray-800">{selectedReview.rating}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Published?
                </label>
                <p className="mt-1 text-gray-800">
                  {selectedReview.isPublished ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600">
                  Email/User
                </label>
                <p className="mt-1 text-gray-800">
                  {selectedReview.nonUserEmail || 'Anonymous'}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600">
                  Comment
                </label>
                <p className="mt-1 text-gray-800 whitespace-pre-line">
                  {selectedReview.comment || 'No comment'}
                </p>
              </div>

              {/* Booking notes example (if you have booking populated with 'notes') */}
              {selectedReview.booking && (selectedReview.booking as any).notes && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Booking Notes
                  </label>
                  <p className="mt-1 text-gray-800 whitespace-pre-line">
                    {(selectedReview.booking as any).notes}
                  </p>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600">
                  Owner Reply
                </label>
                <textarea
                  className="border w-full p-2 rounded mt-1 focus:outline-none focus:border-blue-400"
                  rows={4}
                  value={ownerReplyDraft}
                  onChange={(e) => setOwnerReplyDraft(e.target.value)}
                />
              </div>
            </div>

            {/* Modal buttons */}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={handleCloseDetailModal}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
                onClick={handleSaveReply}
                disabled={isReplying}
              >
                {isReplying && <FaSpinner className="animate-spin mr-1" />}
                Save Reply
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TenantReviewManager;
