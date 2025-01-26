// src/components/Settings/WorkingHoursSection.tsx
import React, { useState, useEffect } from 'react';
import { FaSync, FaSave, FaClock } from 'react-icons/fa';
import { useAppSelector } from '../../app/hooks';
import {
  useUpdateTenantMutation,
  useGetTenantByIdQuery,
} from '../../features/tenant/tenantApi';
import WorkDayCard from './WorkDayCard';
import ApplyToAllCard from './ApplyToAllCard';

// Define a type for AM/PM
type AmPm = 'AM' | 'PM';

interface IBreak {
  start: string;
  end: string;
}

interface IWorkDay {
  dayOfWeek: number;
  openTime: string;  // in 24-hour format, e.g. "09:30"
  closeTime: string; // in 24-hour format, e.g. "17:45"
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

// Helpers to convert 24-hour <-> 12-hour times
const parse24To12 = (time24: string): { hour12: number; minute: number; amPm: AmPm } => {
  if (!time24) {
    return { hour12: 12, minute: 0, amPm: 'AM' };
  }

  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const amPm: AmPm = hour >= 12 ? 'PM' : 'AM';

  if (hour === 0) {
    hour = 12; // 00:xx is 12 AM
  } else if (hour > 12) {
    hour -= 12; // e.g. 13 => 1 PM
  }

  return { hour12: hour, minute, amPm };
};

const parse12To24 = (hour12: number, minute: number, amPm: AmPm): string => {
  let hour24 = hour12;

  if (amPm === 'AM' && hour24 === 12) {
    hour24 = 0; // 12 AM = 00:xx
  } else if (amPm === 'PM' && hour24 !== 12) {
    hour24 += 12; // e.g. 1 PM => 13
  }

  const hh = hour24.toString().padStart(2, '0');
  const mm = minute.toString().padStart(2, '0');
  return `${hh}:${mm}`;
};

const WorkingHoursSection: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const tenantId = user?.tenant;

  // Fetch Tenant
  const {
    data: tenantData,
    isLoading: tenantLoading,
  } = useGetTenantByIdQuery(tenantId || '', { skip: !tenantId });

  // Update Tenant Mutation
  const [updateTenant, { isLoading: updatingTenant }] = useUpdateTenantMutation();

  // Local state for work days
  const [workDays, setWorkDays] = useState<IWorkDay[]>([]);

  // State for Apply to All
  const [applyToAll, setApplyToAll] = useState<{
    openTime: { hour12: number; minute: number; amPm: AmPm };
    closeTime: { hour12: number; minute: number; amPm: AmPm };
  }>({
    openTime: { hour12: 9, minute: 0, amPm: 'AM' },
    closeTime: { hour12: 5, minute: 0, amPm: 'PM' },
  });
  const [isApplying, setIsApplying] = useState(false);

  // Populate local state when we get tenantData
  useEffect(() => {
    if (tenantData?.settings?.workDays) {
      setWorkDays(tenantData.settings.workDays);
    } else {
      // Initialize with default values if not present
      setWorkDays(daysOfWeek.map((_, index) => ({
        dayOfWeek: index,
        openTime: '09:00',
        closeTime: '17:00',
        breaks: [],
      })));
    }
  }, [tenantData]);

  // Handle user changes to hour/minute/amPm for individual days
  const handleTimeChange = (
    dayIndex: number,
    field: 'openTime' | 'closeTime',
    hour12: number,
    minute: number,
    amPm: AmPm
  ) => {
    setWorkDays(prevWorkDays => {
      const updatedWorkDays = [...prevWorkDays];
      updatedWorkDays[dayIndex] = {
        ...updatedWorkDays[dayIndex],
        [field]: parse12To24(hour12, minute, amPm),
      };
      return updatedWorkDays;
    });
  };

  // Handle changes in the Apply to All section
  const handleApplyToAllChange = (
    field: 'openTime' | 'closeTime',
    value: number | 'AM' | 'PM',
    subField?: 'hour12' | 'minute'
  ) => {
    setApplyToAll(prev => {
      const updated = { ...prev };
      if (field === 'openTime' || field === 'closeTime') {
        if (typeof value === 'number' && subField) {
          updated[field][subField] = value;
        } else if (typeof value === 'string') {
          updated[field].amPm = value;
        }
      }
      return updated;
    });
  };

  // Handle Apply to All action
  const handleApplyToAll = () => {
    setIsApplying(true);
    const { openTime, closeTime } = applyToAll;

    const newOpenTime = parse12To24(openTime.hour12, openTime.minute, openTime.amPm);
    const newCloseTime = parse12To24(closeTime.hour12, closeTime.minute, closeTime.amPm);

    const updatedWorkDays = workDays.map(day => ({
      ...day,
      openTime: newOpenTime,
      closeTime: newCloseTime,
    }));

    setWorkDays(updatedWorkDays);
    setIsApplying(false);
    alert('Working hours have been applied to all days.');
  };

  // Save updated times
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

      alert('Working hours updated successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || 'Failed to update working hours.');
    }
  };

  // If still loading tenant data
  if (tenantLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading working hours...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* Vital message */}
      <div className="mb-6">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md shadow">
          <p className="text-center text-blue-700 font-medium">
            Please ensure you properly set AM/PM for each day's times!
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="flex items-center mb-6">
          <FaClock className="text-indigo-600 mr-3" size={24} />
          <h2 className="text-2xl font-semibold text-gray-800">Working Hours</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Set your open and close times (with AM/PM) for each day of the week. You can also apply the same times to all days to save time.
        </p>

        {/* Apply to All Section */}
        <ApplyToAllCard
          openTime={applyToAll.openTime}
          closeTime={applyToAll.closeTime}
          onApplyToAllChange={handleApplyToAllChange}
          onApply={handleApplyToAll}
          isApplying={isApplying}
        />

        {/* Work Days List */}
        <div>
          {daysOfWeek.map((dayName, index) => (
            <WorkDayCard
              key={dayName}
              dayName={dayName}
              workDay={workDays[index] || {
                dayOfWeek: index,
                openTime: '09:00',
                closeTime: '17:00',
                breaks: [],
              }}
              onTimeChange={handleTimeChange}
              dayIndex={index}
            />
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
