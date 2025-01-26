// src/components/Settings/BreaksSection.tsx
import React, { useState, useEffect } from 'react';
import { FaSync, FaSave, FaCoffee, FaPlus, FaTrash } from 'react-icons/fa';
import { useAppSelector } from '../../app/hooks';
import {
  useUpdateTenantMutation,
  useGetTenantByIdQuery,
} from '../../features/tenant/tenantApi';

interface IBreak {
  start: string;
  end: string;
}

interface IWorkDay {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  breaks: IBreak[];
}

interface ITenantSettings {
  workDays: IWorkDay[];
}

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// For storing new break inputs per day (so each day can have its own "start"/"end")
type NewBreakInputs = {
  [dayOfWeek: number]: { start: string; end: string };
};

const BreaksSection: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  const { data: tenantData, isLoading: tenantLoading } = useGetTenantByIdQuery(tenantId!, {
    skip: !tenantId,
  });
  const [updateTenant, { isLoading: updatingTenant }] = useUpdateTenantMutation();

  // The local workDays state we'll manipulate
  const [workDays, setWorkDays] = useState<IWorkDay[]>([]);

  // For each dayOfWeek, store the "new break" input fields in a local object
  const [newBreaks, setNewBreaks] = useState<NewBreakInputs>({});

  // Utility to generate 7 default days
  function generateDefaultWorkDays(): IWorkDay[] {
    return Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      openTime: '',
      closeTime: '',
      breaks: [],
    }));
  }

  useEffect(() => {
    if (tenantData && tenantData.settings) {
      // If we have no existing workDays, create them
      const days = tenantData.settings.workDays.length
        ? tenantData.settings.workDays
        : generateDefaultWorkDays();

      setWorkDays(days);

      // Also initialize newBreaks for each day so we have blank inputs
      const initialNewBreaks: NewBreakInputs = {};
      days.forEach((wd) => {
        initialNewBreaks[wd.dayOfWeek] = { start: '', end: '' };
      });
      setNewBreaks(initialNewBreaks);
    }
  }, [tenantData]);

  const handleNewBreakChange = (
    dayOfWeek: number,
    field: 'start' | 'end',
    value: string
  ) => {
    setNewBreaks((prev) => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        [field]: value,
      },
    }));
  };

  // Add a break to the selected day
  const handleAddBreak = (dayOfWeek: number) => {
    const { start, end } = newBreaks[dayOfWeek];
    if (!start || !end) return;

    const updatedWorkDays = workDays.map((wd) => {
      if (wd.dayOfWeek === dayOfWeek) {
        return {
          ...wd,
          breaks: [...wd.breaks, { start, end }],
        };
      }
      return wd;
    });

    setWorkDays(updatedWorkDays);

    // Reset newBreak input fields for that day
    setNewBreaks((prev) => ({
      ...prev,
      [dayOfWeek]: { start: '', end: '' },
    }));
  };

  // Remove a break from the list
  const handleRemoveBreak = (dayOfWeek: number, index: number) => {
    const updatedWorkDays = workDays.map((wd) => {
      if (wd.dayOfWeek === dayOfWeek) {
        const updatedBreaks = [...wd.breaks];
        updatedBreaks.splice(index, 1);
        return { ...wd, breaks: updatedBreaks };
      }
      return wd;
    });
    setWorkDays(updatedWorkDays);
  };

  // Save the entire workDays array to the backend
  const handleSave = async () => {
    if (!tenantData) return;

    try {
      await updateTenant({
        tenantId: tenantId!,
        data: {
          settings: {
            ...tenantData.settings,
            workDays,
          },
        },
      }).unwrap();
      alert('Breaks updated successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || 'Failed to update breaks.');
    }
  };

  // If still loading
  if (tenantLoading) {
    return <p className="text-gray-500">Loading breaks...</p>;
  }

  return (
    <div className="relative w-full">
      {/* Vital message banner pinned to the top */}
      <div className="sticky top-0 z-50 bg-blue-50 border border-blue-100 px-4 py-2 mb-4 rounded-md shadow-sm">
        <p className="text-center text-blue-700 font-semibold">
          This is a vital message: Please ensure you correctly set your daily breaks!
        </p>
      </div>

      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
          <FaCoffee className="mr-2" />
          Breaks Management
        </h2>

        <p className="text-gray-600 mb-6">
          Enter break times for each day, then click <strong>"Add Break"</strong>.
          When finished, click <strong>"Save Breaks"</strong>.
        </p>

        {/* Responsive grid: 1 col on small screens, 2 on md, 3 on xl */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workDays.map((wd) => (
            <div
              key={wd.dayOfWeek}
              className="p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm"
            >
              <h3 className="text-lg font-medium mb-3 text-gray-800">
                {daysOfWeek[wd.dayOfWeek]}
              </h3>

              {/* Existing breaks */}
              {wd.breaks.map((brk, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between mb-2 p-2 bg-white rounded-md shadow-sm"
                >
                  <span className="text-sm text-gray-700">
                    {brk.start} - {brk.end}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBreak(wd.dayOfWeek, idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              {/* Add new break form inline */}
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="time"
                  value={newBreaks[wd.dayOfWeek]?.start || ''}
                  onChange={(e) =>
                    handleNewBreakChange(wd.dayOfWeek, 'start', e.target.value)
                  }
                  className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Start"
                />
                <input
                  type="time"
                  value={newBreaks[wd.dayOfWeek]?.end || ''}
                  onChange={(e) =>
                    handleNewBreakChange(wd.dayOfWeek, 'end', e.target.value)
                  }
                  className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="End"
                />
                <button
                  type="button"
                  onClick={() => handleAddBreak(wd.dayOfWeek)}
                  className="flex items-center bg-green-600 text-white px-3 py-1 
                             rounded-md text-sm hover:bg-green-700 transition-colors
                             disabled:opacity-50"
                  disabled={
                    !newBreaks[wd.dayOfWeek]?.start ||
                    !newBreaks[wd.dayOfWeek]?.end
                  }
                >
                  <FaPlus className="mr-1" />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-right mt-8">
          <button
            type="button"
            onClick={handleSave}
            disabled={updatingTenant}
            className="inline-flex items-center bg-green-600 text-white px-6 py-2
                       rounded-md hover:bg-green-700 transition-colors duration-200
                       disabled:opacity-50"
          >
            {updatingTenant && <FaSync className="animate-spin mr-2" />}
            <FaSave className="mr-2" />
            Save Breaks
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreaksSection;
