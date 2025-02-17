// src/pages/StaffScheduleManager.tsx

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  useListAvailabilitiesQuery,
  useListAbsencesQuery,
  useCreateAbsenceMutation,
} from '../../features/staffAvailability/staffScheduleApi';
import { useListStaffQuery } from '../../features/staff/staffApi';

const StaffScheduleManager: React.FC = () => {
  // 1) Filter states
  const [filterType, setFilterType] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | undefined>(
    undefined
  );
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  // 2) Query Availabilities
  const {
    data: availabilities = [],
    isLoading: isLoadingAvail,
    refetch: refetchAvail,
  } = useListAvailabilitiesQuery({
    type: filterType || undefined,
    isActive: filterActive,
    fromDate: fromDate ? fromDate.toISOString() : undefined,
    toDate: toDate ? toDate.toISOString() : undefined,
  });

  // 3) Query Staff
  const { data: staffList = [], isLoading: isStaffLoading } = useListStaffQuery();

  // 4) Query Absences
  const {
    data: absences = [],
    isLoading: isLoadingAbs,
    refetch: refetchAbs,
  } = useListAbsencesQuery({
    fromDate: fromDate ? fromDate.toISOString() : undefined,
    toDate: toDate ? toDate.toISOString() : undefined,
    // approved: ...
  });

  // 5) Local form state to create an absence/time off
  const [timeOffStart, setTimeOffStart] = useState<Date | null>(null);
  const [timeOffEnd, setTimeOffEnd] = useState<Date | null>(null);
  const [timeOffReason, setTimeOffReason] = useState('');

  // NEW: Which staff do we create an absence for?
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');

  const [createAbsence, { isLoading: creatingAbs }] = useCreateAbsenceMutation();

  async function handleCreateAbsence() {
    if (!selectedStaffId) {
      alert('Please pick a Staff member first!');
      return;
    }
    if (!timeOffStart || !timeOffEnd) {
      alert('Pick start & end date/time for the absence.');
      return;
    }
    try {
      await createAbsence({
        staffId: selectedStaffId,
        startDateTime: timeOffStart.toISOString(),
        endDateTime: timeOffEnd.toISOString(),
        reason: timeOffReason,
      }).unwrap();
      

      // Clear form
      setTimeOffStart(null);
      setTimeOffEnd(null);
      setTimeOffReason('');
      setSelectedStaffId('');

      // Refresh the Absences list
      refetchAbs();
    } catch (err) {
      console.error('Failed to create absence:', err);
    }
  }

  return (
    <section className="p-4  mx-auto">
      <h1 className="text-xl font-bold mb-4">Staff Schedule Manager</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="">(Any)</option>
            <option value="ONE_TIME">ONE_TIME</option>
            <option value="RECURRING">RECURRING</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Active?</label>
          <select
            value={typeof filterActive === 'boolean' ? filterActive.toString() : ''}
            onChange={(e) => {
              if (e.target.value === '') setFilterActive(undefined);
              else setFilterActive(e.target.value === 'true');
            }}
            className="border rounded px-3 py-1"
          >
            <option value="">(Any)</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={setFromDate}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            className="border px-2 py-1 rounded w-full"
            isClearable
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To Date</label>
          <DatePicker
            selected={toDate}
            onChange={setToDate}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            className="border px-2 py-1 rounded w-full"
            isClearable
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              refetchAvail();
              refetchAbs();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-md">
        {/* Availabilities List */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Staff Availabilities</h2>
          {isLoadingAvail ? (
            <p>Loading Availabilities...</p>
          ) : (
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Times</th>
                  <th className="p-2 border">Active</th>
                  <th className="p-2 border">Staff</th>
                </tr>
              </thead>
              <tbody>
                {availabilities.map((av) => (
                  <tr key={av._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{av.type}</td>
                    <td className="p-2 border">
                      {av.type === 'ONE_TIME'
                        ? `${av.startDateTime} - ${av.endDateTime}`
                        : `Day ${av.dayOfWeek} ${av.startTime} - ${av.endTime}`}
                    </td>
                    <td className="p-2 border">{av.isActive ? 'Yes' : 'No'}</td>
                    {/* Example: if your staff object is `av.staff` */}
                    <td className="p-2 border">
                      {typeof av.staff === 'string'
                        ? av.staff
                        : av.staff?._id || '(none)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Absences List */}
        <div className="border rounded p-4 ">
          <h2 className="text-lg font-semibold mb-2">Staff Absences / Time Off</h2>
          {isLoadingAbs ? (
            <p>Loading Absences...</p>
          ) : (
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Staff</th>
                  <th className="p-2 border">Date Range</th>
                  <th className="p-2 border">Reason</th>
                  <th className="p-2 border">Approved</th>
                </tr>
              </thead>
              <tbody>
                {absences.map((ab) => (
                  <tr key={ab._id} className="hover:bg-gray-50">
                    <td className="p-2 border">
                      {/* For a single staff field: */}
                      {typeof ab.staff === 'string'
                        ? ab.staff
                        : ab.staff?._id || '(none)'}
                    </td>
                    <td className="p-2 border">
                      {ab.startDateTime} - {ab.endDateTime}
                    </td>
                    <td className="p-2 border">{ab.reason || ''}</td>
                    <td className="p-2 border">{ab.approved ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create New Absence */}
      <div className="border rounded p-4 mt-6 bg-white ">
        <h2 className="text-lg font-semibold mb-2">Mark an Absence / Time Off</h2>

        {/* NEW: Pick a staff member */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Staff Member
          </label>
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="">-- Select Staff --</option>
            {isStaffLoading && <option>Loading staff...</option>}
            {staffList.map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.employeeId || staff._id}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start
            </label>
            <DatePicker
              selected={timeOffStart}
              onChange={setTimeOffStart}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              className="border px-2 py-1 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End
            </label>
            <DatePicker
              selected={timeOffEnd}
              onChange={setTimeOffEnd}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              className="border px-2 py-1 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <input
              type="text"
              value={timeOffReason}
              onChange={(e) => setTimeOffReason(e.target.value)}
              placeholder="e.g. Sick day, Vacation"
              className="border px-2 py-1 rounded w-full"
            />
          </div>
        </div>

        <button
          onClick={handleCreateAbsence}
          disabled={creatingAbs}
          className="bg-red-600 text-white px-4 py-2 mt-2 rounded hover:bg-red-700 transition"
        >
          {creatingAbs ? 'Saving...' : 'Add Absence'}
        </button>
      </div>
    </section>
  );
};

export default StaffScheduleManager;
