// src/components/Settings/ApplyToAllCard.tsx
import React from 'react';
import { FaSync, FaSave } from 'react-icons/fa';

interface ApplyToAllCardProps {
  openTime: {
    hour12: number;
    minute: number;
    amPm: 'AM' | 'PM';
  };
  closeTime: {
    hour12: number;
    minute: number;
    amPm: 'AM' | 'PM';
  };
  onApplyToAllChange: (
    field: 'openTime' | 'closeTime',
    value: number | 'AM' | 'PM',
    subField?: 'hour12' | 'minute'
  ) => void;
  onApply: () => void;
  isApplying: boolean;
}

const ApplyToAllCard: React.FC<ApplyToAllCardProps> = ({
  openTime,
  closeTime,
  onApplyToAllChange,
  onApply,
  isApplying,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md shadow-sm mb-6 bg-gray-50">
      {/* Apply to All Label */}
      <div className="w-full sm:w-1/4 mb-2 sm:mb-0">
        <span className="font-medium text-gray-700">Apply to All Days</span>
      </div>

      {/* Open and Close Time Selects */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-3/4">
        {/* Open Time */}
        <div className="flex items-center mr-4 mb-4 sm:mb-0">
          <label className="text-gray-600 mr-2">Open:</label>
          <div className="flex items-center space-x-1">
            {/* Hour */}
            <select
              value={openTime.hour12}
              onChange={(e) =>
                onApplyToAllChange('openTime', Number(e.target.value), 'hour12')
              }
              className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-indigo-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            :
            {/* Minute */}
            <select
              value={openTime.minute}
              onChange={(e) =>
                onApplyToAllChange('openTime', Number(e.target.value), 'minute')
              }
              className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-indigo-500"
            >
              {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            {/* AM/PM */}
            <select
              value={openTime.amPm}
              onChange={(e) =>
                onApplyToAllChange(
                  'openTime',
                  e.target.value as 'AM' | 'PM'
                )
              }
              className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {/* Close Time */}
        <div className="flex items-center mb-4 sm:mb-0">
          <label className="text-gray-600 mr-2">Close:</label>
          <div className="flex items-center space-x-1">
            {/* Hour */}
            <select
              value={closeTime.hour12}
              onChange={(e) =>
                onApplyToAllChange('closeTime', Number(e.target.value), 'hour12')
              }
              className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-indigo-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            :
            {/* Minute */}
            <select
              value={closeTime.minute}
              onChange={(e) =>
                onApplyToAllChange('closeTime', Number(e.target.value), 'minute')
              }
              className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-indigo-500"
            >
              {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            {/* AM/PM */}
            <select
              value={closeTime.amPm}
              onChange={(e) =>
                onApplyToAllChange(
                  'closeTime',
                  e.target.value as 'AM' | 'PM'
                )
              }
              className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {/* Apply Button */}
        <div className="w-full sm:w-auto ml-2">
          <button
            type="button"
            onClick={onApply}
            disabled={isApplying}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isApplying ? (
              <FaSync className="animate-spin mr-1" />
            ) : (
              <FaSave className="" />
            )}
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyToAllCard;
