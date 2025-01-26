import React, { useMemo, useState } from 'react';
import { FaSpinner, FaPrint, FaPenFancy } from 'react-icons/fa';
import SignatureCanvas from 'react-signature-canvas';
import { motion } from 'framer-motion';

// Bookings
import { useListBookingsQuery } from '../../features/booking/bookingApi';

// Receipts
import {
  useListTenantReceiptsQuery,
  useReGenerateReceiptMutation,
  useGenerateReceiptPDFMutation,
  useUpdateReceiptMutation,
  useCreateReceiptMutation,
} from '../../features/receipt/receiptApi';

const ReceiptManager: React.FC = () => {
  // 1) Bookings
  const {
    data: allBookings,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
    refetch: refetchBookings,
  } = useListBookingsQuery();

  // Filter only COMPLETED
  const completedBookings = useMemo(() => {
    if (!allBookings) return [];
    return allBookings.filter((bk) => bk.status === 'COMPLETED');
  }, [allBookings]);

  // 2) Receipts
  const {
    data: receiptData,
    isLoading: isReceiptsLoading,
    isError: isReceiptsError,
    refetch: refetchReceipts,
  } = useListTenantReceiptsQuery({ page: 1 });
  const receipts = receiptData?.receipts || [];

  // 3) Mutations
  const [reGenerateReceipt, { isLoading: isRegenLoading }] = useReGenerateReceiptMutation();
  const [generatePDF, { isLoading: isPDFLoading }] = useGenerateReceiptPDFMutation();
  const [updateReceipt, { isLoading: isUpdating }] = useUpdateReceiptMutation();
  const [createReceipt] = useCreateReceiptMutation();

  // 4) State for signature modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [sigPad, setSigPad] = useState<SignatureCanvas | null>(null);

  // 5) State for a custom price input
  const [priceInput, setPriceInput] = useState<number>(0);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  function openSignatureModal(receipt: any) {
    setSelectedReceipt(receipt);
    setModalOpen(true);
  }

  function closeSignatureModal() {
    setModalOpen(false);
    setSelectedReceipt(null);
    sigPad?.clear();
  }

  async function handleSaveSignature() {
    if (!sigPad || !selectedReceipt) return;
    const dataUrl = sigPad.getTrimmedCanvas().toDataURL('image/png');
    await updateReceipt({
      receiptId: selectedReceipt._id,
      updates: { tenantSignatureURL: dataUrl },
    }).unwrap();
    refetchReceipts(); // refresh receipt list
    closeSignatureModal();
  }

  // Helper to find matching receipt for a booking
  function findReceipt(bookingId: string) {
    return receipts.find((r) => r.booking === bookingId);
  }

  // Example: manually create a brand new receipt with custom price from the front end
  async function handleCreateReceipt(bookingId: string) {
    if (!priceInput) {
      alert('Enter a valid price!');
      return;
    }

    // No tenant field!
    await createReceipt({
      booking: bookingId,
      amount: priceInput,
      currency: 'USD',
      lineItems: [
        {
          description: 'Front end custom item',
          price: priceInput,
          quantity: 1,
        },
      ],
    }).unwrap();
    setPriceInput(0);
    setSelectedBookingId(null);
    refetchReceipts();
  }

  // 6) Render
  if (isBookingsLoading || isReceiptsLoading) {
    return (
      <div className="p-4 flex items-center space-x-2">
        <FaSpinner className="animate-spin text-2xl" />
        <span>Loading data...</span>
      </div>
    );
  }

  if (isBookingsError || isReceiptsError) {
    return (
      <div className="p-4 text-red-500">
        Failed to load data.
        <button
          onClick={() => {
            refetchBookings();
            refetchReceipts();
          }}
          className="underline ml-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Completed Bookings & Receipts</h1>

      {/* Simple example to show how you'd set a price and create a brand new receipt */}
      <div className="mb-4 p-2 border rounded bg-gray-50">
        <h2 className="font-semibold">Create Receipt with Custom Price</h2>
        <label className="block mb-2">
          Select Booking:
          <select
            className="ml-2 border"
            value={selectedBookingId || ''}
            onChange={(e) => setSelectedBookingId(e.target.value)}
          >
            <option value="">-- choose a booking --</option>
            {completedBookings.map((bk) => (
              <option key={bk._id} value={bk._id}>
                {bk._id} - {bk.shortCode}
              </option>
            ))}
          </select>
        </label>

        <label>
          Price:
          <input
            type="number"
            value={priceInput}
            onChange={(e) => setPriceInput(Number(e.target.value))}
            className="ml-2 border px-2 py-1"
          />
        </label>

        <button
          className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            if (selectedBookingId) {
              handleCreateReceipt(selectedBookingId);
            }
          }}
        >
          Create
        </button>
      </div>

      {completedBookings.length === 0 ? (
        <div className="text-gray-500">No completed bookings found.</div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded shadow">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 border-b">Booking ID</th>
                <th className="py-2 px-3 border-b">Short Code</th>
                <th className="py-2 px-3 border-b">Price</th>
                <th className="py-2 px-3 border-b">Receipt ID</th>
                <th className="py-2 px-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {completedBookings.map((bk) => {
                const rcp = findReceipt(bk._id);

                return (
                  <tr key={bk._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{bk._id}</td>
                    <td className="py-2 px-3">{bk.shortCode || 'N/A'}</td>
                    <td className="py-2 px-3">{bk.price || 0}</td>
                    <td className="py-2 px-3">{rcp ? rcp._id : 'No Receipt'}</td>
                    <td className="py-2 px-3 space-x-2">
                      {!rcp ? (
                        // If no receipt => create or re-generate
                        <button
                          className="px-2 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
                          onClick={() => reGenerateReceipt(bk._id)}
                          disabled={isRegenLoading}
                        >
                          {isRegenLoading ? 'Generating...' : 'Create/Regenerate'}
                        </button>
                      ) : (
                        // If receipt exists => sign, PDF, etc.
                        <>
                          <button
                            className="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            onClick={() => openSignatureModal(rcp)}
                          >
                            Sign
                          </button>
                          <button
                            className="px-2 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
                            onClick={async () => {
                              const res = await generatePDF(rcp._id).unwrap();
                              // e.g. res.pdfUrl -> "/uploads/receipts/receipt_XXXX.pdf"
                              window.open(`http://localhost:4000${res.pdfUrl}`, '_blank');
                            }}
                            disabled={isPDFLoading}
                          >
                            <FaPrint className="mr-1 inline-block" />
                            {isPDFLoading ? 'PDF...' : 'Generate PDF'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Signature Modal */}
      {modalOpen && selectedReceipt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <motion.div
            className="bg-white rounded p-6 w-full max-w-2xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              Sign Receipt {selectedReceipt._id}
            </h2>

            <SignatureCanvas
              penColor="blue"
              canvasProps={{ width: 500, height: 200, className: 'border rounded' }}
              ref={(ref) => setSigPad(ref)}
            />

            <div className="mt-4 flex space-x-2 justify-end">
              <button
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => sigPad?.clear()}
              >
                Clear
              </button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSaveSignature}
                disabled={isUpdating}
              >
                <FaPenFancy className="inline mr-1" />
                {isUpdating ? 'Saving...' : 'Save Signature'}
              </button>
              <button
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
                onClick={() => {
                  closeSignatureModal();
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReceiptManager;
