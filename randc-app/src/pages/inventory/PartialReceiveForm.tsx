// src/pages/reorders/PartialReceiveForm.tsx
import React, { useState } from 'react';
import { useReceiveReorderItemsMutation } from '../../features/reorderRequests/reorderRequestApi';

interface PartialReceiveFormProps {
  reorder: {
    _id: string;
    quantityReceived?: number;
    quantityRequested: number;
  };
  onSuccess?: () => void; // callback if needed
}

const PartialReceiveForm: React.FC<PartialReceiveFormProps> = ({ reorder, onSuccess }) => {
  const [quantityReceived, setQuantityReceived] = useState<number>(
    reorder.quantityReceived || 0
  );
  const [discrepancyReason, setDiscrepancyReason] = useState('');
  const [finalize, setFinalize] = useState(false);

  const [receiveReorderItems, { isLoading }] = useReceiveReorderItemsMutation();

  const handleSubmit = async () => {
    if (quantityReceived < 0) {
      alert('Cannot receive negative amounts');
      return;
    }
    try {
      await receiveReorderItems({
        requestId: reorder._id,
        quantityReceived,
        discrepancyReason: discrepancyReason || undefined,
        finalize,
      }).unwrap();
      alert('Reorder items received/updated successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      alert('Error receiving reorder items');
      console.error(err);
    }
  };

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="font-semibold mb-2">Partial or Full Receipt</h3>
      <div className="mb-2">
        <label className="block text-sm font-medium">Quantity Received</label>
        <input
          type="number"
          className="border rounded px-2 py-1 w-full"
          value={quantityReceived}
          onChange={(e) => setQuantityReceived(Number(e.target.value))}
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Discrepancy Reason (if any)</label>
        <textarea
          className="border rounded px-2 py-1 w-full"
          value={discrepancyReason}
          onChange={(e) => setDiscrepancyReason(e.target.value)}
          placeholder="Damaged goods, short shipment, etc."
        />
      </div>

      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="finalize"
          className="mr-2"
          checked={finalize}
          onChange={(e) => setFinalize(e.target.checked)}
        />
        <label htmlFor="finalize" className="text-sm">
          No further shipments expected (Close this reorder)
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        {isLoading ? 'Submitting...' : 'Save'}
      </button>
    </div>
  );
};

export default PartialReceiveForm;
