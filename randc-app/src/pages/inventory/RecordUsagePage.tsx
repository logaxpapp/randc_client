// RecordUsagePage.tsx
import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useRecordUsageMutation } from '../../features/inventory/inventoryApi';
import { useListTenantUsersQuery } from '../../features/auth/authApi';
import Toast from '../../components/ui/Toast'; // <-- import your Toast component here

interface RecordUsagePageProps {
  supplyId: string;
}

/**
 * RecordUsagePage:
 * Allows the user to pick a quantity, reason, and "Given To" user,
 * then calls POST /supplies/:supplyId/usage to record usage logs.
 */
const RecordUsagePage: React.FC<RecordUsagePageProps> = ({ supplyId }) => {
  const [quantityUsed, setQuantityUsed] = useState(0);
  const [reason, setReason] = useState('');
  const [givenToUserId, setGivenToUserId] = useState('');

  // RTK Query usage
  const [recordUsage, { isLoading, error }] = useRecordUsageMutation();

  // We'll store a local success message in state so we can show a success Toast
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // We'll store an "error message" in local state so we can close the toast
  const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);

  // If you have a query that fetches tenant users
  const { data: tenantUsers, isLoading: loadingUsers } = useListTenantUsersQuery();

  /**
   * The main submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);     // Clear prior success
    setErrorToastMsg(null);  // Clear prior error

    if (!givenToUserId) {
      alert('You must select a user in "Given To"');
      return;
    }

    try {
      await recordUsage({
        supplyId,
        quantityUsed,
        reason,
        userId: givenToUserId,
      }).unwrap();

      // If no error => usage is recorded
      setQuantityUsed(0);
      setReason('');
      setGivenToUserId('');
      setSuccessMsg('Usage recorded successfully!');
    } catch (err) {
      console.error('Failed to record usage:', err);
      // The RTK Query 'error' is also stored in `error`.
      // We'll handle the displayed message in the useEffect below.
    }
  };

  /**
   * A helper to parse the 'error' union from RTK Query
   */
  function getErrorMessage(err: unknown): string | null {
    if (!err) return null;

    // 1) Is it a fetchBaseQuery error?
    if (typeof err === 'object' && err != null && 'status' in err) {
      const httpErr = err as FetchBaseQueryError;
      // e.g. { data: { message: 'Some error' }, status: 400 }
      if ('data' in httpErr && typeof httpErr.data === 'object' && httpErr.data !== null) {
        const data = httpErr.data as { message?: string };
        return data.message ?? 'Error recording usage';
      }
      // For "FETCH_ERROR", "CUSTOM_ERROR", etc. with an 'error' string
      if ('error' in httpErr && httpErr.error) {
        return httpErr.error;
      }
      return 'Error recording usage';
    }

    // 2) Is it a SerializedError?
    if (typeof err === 'object' && err != null && 'message' in err) {
      const serErr = err as SerializedError;
      return serErr.message ?? 'Error recording usage';
    }

    // 3) Fallback
    return 'Error recording usage';
  }

  /**
   * Whenever RTK Query's 'error' changes, parse it into a string for the toast.
   */
  useEffect(() => {
    const msg = getErrorMessage(error);
    if (msg) {
      setErrorToastMsg(msg);
    }
  }, [error]);

  return (
    <div className="p-4 space-y-4 max-w-md">
      <h2 className="text-lg font-bold">Record Usage</h2>

      {/* Success Toast */}
      <Toast
        show={!!successMsg}
        message={successMsg || ''}
        onClose={() => setSuccessMsg(null)}
      />

      {/* Error Toast */}
      <Toast
        show={!!errorToastMsg}
        message={errorToastMsg || ''}
        onClose={() => setErrorToastMsg(null)}
      />

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Quantity */}
        <div>
          <label className="block mb-1 font-medium">Quantity Used</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-32"
            required
            min={1}
            value={quantityUsed}
            onChange={(e) => setQuantityUsed(Number(e.target.value))}
          />
        </div>

        {/* Reason (optional) */}
        <div>
          <label className="block mb-1 font-medium">Reason (optional)</label>
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* “Given To” => Required */}
        <div>
          <label className="block mb-1 font-medium">
            Given To <span className="text-red-500">*</span>
          </label>
          {loadingUsers ? (
            <p className="text-gray-500">Loading tenant users...</p>
          ) : (
            <select
              className="border rounded px-2 py-1 w-full"
              required
              value={givenToUserId}
              onChange={(e) => setGivenToUserId(e.target.value)}
            >
              <option value="">-- Select a User --</option>
              {tenantUsers?.map((u: any) => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName} ({u.email})
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center"
        >
          {isLoading && <FaSpinner className="animate-spin mr-2" />}
          Record Usage
        </button>
      </form>
    </div>
  );
};

export default RecordUsagePage;
