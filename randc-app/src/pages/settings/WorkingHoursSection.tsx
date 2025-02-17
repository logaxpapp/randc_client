import React, { useState, useEffect } from 'react';
import { FaSync, FaSave, FaClock } from 'react-icons/fa';
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
  openTime: string;  // e.g. "09:30" in 24-hour format
  closeTime: string; // e.g. "17:45"
  breaks: IBreak[];
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

const WorkingHoursSection: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  // 1) Load the tenant data
  const {
    data: tenantData,
    isLoading: tenantLoading,
    isError,
  } = useGetTenantByIdQuery(tenantId || '', { skip: !tenantId });

  // 2) The updateTenant mutation
  const [updateTenant, { isLoading: updatingTenant }] = useUpdateTenantMutation();

  // 3) Local state for the entire array of workDays
  const [workDays, setWorkDays] = useState<IWorkDay[]>([]);

  // 4) "Apply to all" local state
  // We'll store 24-hour "HH:MM" format strings for open/close times
  const [applyOpenTime, setApplyOpenTime] = useState('09:00');
  const [applyCloseTime, setApplyCloseTime] = useState('17:00');

  // 5) Populate local state from tenantData
  useEffect(() => {
    if (tenantData?.settings?.workDays) {
      // We expect an array of up to 7 items (index = dayOfWeek).
      // But if some days are missing, we can fill them in.
      const existingWorkDays = tenantData.settings.workDays;

      // We'll ensure dayOfWeek 0..6 all exist
      const newWorkDays: IWorkDay[] = [];
      for (let d = 0; d < 7; d++) {
        const found = existingWorkDays.find((wd) => wd.dayOfWeek === d);
        if (found) {
          newWorkDays.push({
            dayOfWeek: d,
            openTime: found.openTime,
            closeTime: found.closeTime,
            breaks: found.breaks || [],
          });
        } else {
          // If not found, create a default
          newWorkDays.push({
            dayOfWeek: d,
            openTime: '09:00',
            closeTime: '17:00',
            breaks: [],
          });
        }
      }
      setWorkDays(newWorkDays);
    } else {
      // No workDays found, initialize all 7 days with defaults
      const defaults: IWorkDay[] = [];
      for (let d = 0; d < 7; d++) {
        defaults.push({
          dayOfWeek: d,
          openTime: '09:00',
          closeTime: '17:00',
          breaks: [],
        });
      }
      setWorkDays(defaults);
    }
  }, [tenantData]);

  // 6) Handler: apply open/close times to all days
  const handleApplyToAll = () => {
    const updated = workDays.map((wd) => ({
      ...wd,
      openTime: applyOpenTime,
      closeTime: applyCloseTime,
    }));
    setWorkDays(updated);
    alert('Applied the same open/close times to all days.');
  };

  // 7) Handler: user changes a single day’s openTime/closeTime
  const handleTimeChange = (
    dayIndex: number,
    field: 'openTime' | 'closeTime',
    value: string
  ) => {
    setWorkDays((prev) => {
      const newDays = [...prev];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        [field]: value,
      };
      return newDays;
    });
  };

  // 8) Save to server
  const handleSave = async () => {
    if (!tenantId || !tenantData) return;
    try {
      // Build the final settings object
      // We'll keep the rest of tenantData.settings as is
      const updatedSettings = {
        ...tenantData.settings,
        workDays, // our new array
      };

      await updateTenant({
        tenantId,
        data: {
          settings: updatedSettings,
        },
      }).unwrap();

      alert('Working hours updated successfully!');
    } catch (err: any) {
      console.error('Failed to update:', err);
      alert(err?.data?.message || 'Failed to update working hours.');
    }
  };

  // 9) If loading or error
  if (tenantLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading working hours...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading working hours.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* Vital message at the top */}
      <div className="mb-6">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md shadow">
          <p className="text-center text-blue-700 font-medium">
            Please confirm your daily open/close times. Use 24-hour format or pick from the time picker.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <FaClock className="text-indigo-600 mr-3" size={24} />
          <h2 className="text-2xl font-semibold text-gray-800">Working Hours</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Set your open and close times for each day of the week. Or apply the same schedule to all days below.
        </p>

        {/* Apply to All Section */}
        <div className="border p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Apply to All</h3>
          <div className="flex flex-row items-center space-x-4">
            {/* Open Time */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">Open Time</label>
              <input
                type="time"
                className="border border-gray-300 rounded p-2"
                value={applyOpenTime}
                onChange={(e) => setApplyOpenTime(e.target.value)}
              />
            </div>
            {/* Close Time */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">Close Time</label>
              <input
                type="time"
                className="border border-gray-300 rounded p-2"
                value={applyCloseTime}
                onChange={(e) => setApplyCloseTime(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleApplyToAll}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Work Days List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workDays.map((wd, index) => (
            <div
              key={wd.dayOfWeek}
              className="border p-4 rounded-md shadow-sm flex flex-col space-y-3"
            >
              <h4 className="text-lg font-semibold text-gray-700">
                {daysOfWeek[wd.dayOfWeek]}
              </h4>
              {/* Open Time */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">Open Time</label>
                <input
                  type="time"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={wd.openTime}
                  onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                />
              </div>
              {/* Close Time */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">Close Time</label>
                <input
                  type="time"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={wd.closeTime}
                  onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                />
              </div>
              {/* Breaks would go here if you want */}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={updatingTenant}
            className="flex items-center bg-indigo-600 text-white px-6 py-2 rounded-md shadow hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {updatingTenant && <FaSync className="animate-spin mr-3" />}
            <FaSave className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursSection;
