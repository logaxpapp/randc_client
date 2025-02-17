// PaymentSuccess.tsx
import React, { useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaPrint, FaFilePdf } from 'react-icons/fa';
import { useGetStripeSessionQuery } from '../../features/subscription/subscriptionApi';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  const { data, isLoading, isError } = useGetStripeSessionQuery(sessionId as string, {
    skip: !sessionId,
  });

  const [showRawJson, setShowRawJson] = useState(false);

  // 1) A ref to the DOM section we want to print
  const printRef = useRef<HTMLDivElement>(null);

  // 2) useReactToPrint returns a function:
  const triggerPrint = useReactToPrint({
    content: (): HTMLDivElement | null => printRef.current,   // Type assertion
    documentTitle: 'Payment-Receipt',
  } as any);
  

  // 3) Our handler calls that function in an arrow function
  const handlePrint = () => {
    if (triggerPrint) {
      triggerPrint();
    }
  };

  // 4) Generate PDF with jsPDF
  const handleDownloadPDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Payment Receipt', 20, 30);
    doc.setFontSize(14);
    doc.text(`Session ID: ${data.session.id}`, 20, 50);
    doc.text(`Payment Status: ${data.session.payment_status}`, 20, 70);
    doc.text(`Customer Email: ${data.session.customer_email}`, 20, 90);
    doc.text(`Subscription ID: ${data.session.subscription}`, 20, 110);
    doc.text(`Amount Total: $${(data.session.amount_total / 100).toFixed(2)}`, 20, 130);
    doc.save('Payment-Receipt.pdf');
  };

  // 5) Navigate to dashboard
  const handleGoToDashboard = () => navigate('/subscriptions');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8
                   transition duration-300 ease-in-out transform hover:scale-105"
      >
        {/* Success header */}
        <div className="mb-6 text-green-500 flex items-center justify-center">
          <FaCheckCircle size={48} />
          <h1 className="text-3xl font-bold text-gray-800 ml-4">Payment Successful!</h1>
        </div>

        {/* Loading / error states */}
        {isLoading && (
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
            <FaSpinner className="animate-spin" size={20} />
            <span>Verifying...</span>
          </div>
        )}
        {isError && (
          <p className="text-red-500 mb-4">
            Payment verification failed. Please contact support.
          </p>
        )}

        {/* Payment info */}
        {data && (
          <div className="text-left text-sm mb-6 space-y-2 bg-gray-50 p-4 rounded-md">
          <p style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
        <strong>Session ID:</strong> {data.session.id}
        </p>

            <p><strong>Payment Status:</strong> {data.session.payment_status}</p>
            <p><strong>Subscription:</strong> {data.session.subscription || 'N/A'}</p>
            <p><strong>Customer Email:</strong> {data.session.customer_email || 'N/A'}</p>
            <p>
              <strong>Amount Total:</strong>
              {' '}
              {data.session.amount_total
                ? `$${(data.session.amount_total / 100).toFixed(2)}`
                : 'N/A'}
            </p>
            {/* Optional toggle to show raw JSON */}
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="underline text-blue-500 mt-2"
            >
              {showRawJson ? 'Hide JSON' : 'Show Raw JSON'}
            </button>
            {showRawJson && (
              <pre className="mt-2 whitespace-pre-wrap break-words bg-white border rounded p-2 max-h-64 overflow-auto">
                {JSON.stringify(data.session, null, 2)}
              </pre>
            )}
          </div>
        )}

        <p className="text-gray-700 mb-6">
          Thank you for your purchase! Your subscription is now active.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
          {/* The hidden section to print */}
          <div ref={printRef} style={{ display: 'none' }}>
            <div className="text-center p-4">
              <h1 className="text-2xl font-bold mb-4">Payment Receipt</h1>
              <p><strong>Session ID:</strong> {data?.session?.id}</p>
              <p><strong>Payment Status:</strong> {data?.session?.payment_status}</p>
              <p><strong>Subscription:</strong> {data?.session?.subscription}</p>
              <p><strong>Customer Email:</strong> {data?.session?.customer_email}</p>
              <p>
                <strong>Amount Total:</strong>
                {' '}
                {data?.session?.amount_total
                  ? `$${(data?.session?.amount_total / 100).toFixed(2)}`
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            <FaPrint />
            Print
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            <FaFilePdf />
            Download PDF
          </button>

          {/* Dashboard */}
          <button
            type="button"
            onClick={handleGoToDashboard}
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
