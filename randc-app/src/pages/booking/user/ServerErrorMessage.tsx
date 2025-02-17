import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

interface ServerErrorMessageProps {
  error: unknown;
}

/** Return a React element (JSX) or null. */
export const ServerErrorMessage: React.FC<ServerErrorMessageProps> = ({ error }) => {
  if (!error) {
    return null; 
  }

  if (typeof error === 'object' && error !== null) {
    const anyErr = error as any;
    if (anyErr.data && typeof anyErr.data.message === 'string') {
      return (
        <div className="text-red-600 mt-1 flex items-center gap-2">
          <FaExclamationCircle />
          <span>{anyErr.data.message}</span>
        </div>
      );
    }
  }

  // Fallback
  return (
    <div className="text-red-600 mt-1 flex items-center gap-2">
      <FaExclamationCircle />
      <span>Error fetching slots!</span>
    </div>
  );
};
