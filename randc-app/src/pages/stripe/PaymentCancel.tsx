// src/pages/stripe/PaymentCancel.tsx
import React from 'react';

const PaymentCancel: React.FC = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow text-center">
      <h1 className="text-2xl font-bold text-red-500">Payment Canceled</h1>
      <p className="text-gray-600 mt-4">
        You have canceled the payment process. If this was a mistake, you can try again
        or contact support.
      </p>
      <a
        href="/subscriptions"
        className="inline-block mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Back to Dashboard
      </a>
    </div>
  );
};

export default PaymentCancel;
