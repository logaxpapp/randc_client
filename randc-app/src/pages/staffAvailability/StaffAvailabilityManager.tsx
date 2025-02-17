import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  useListAvailabilitiesQuery,
  useCreateAvailabilityMutation,
  useUpdateAvailabilityMutation,
  useDeleteAvailabilityMutation,
  useAssignStaffToAvailabilityMutation,
  useUnassignStaffFromAvailabilityMutation,
} from '../../features/staffAvailability/staffScheduleApi';
import { useListStaffQuery } from '../../features/staff/staffApi';

// Minimal types for form
type AvailabilityType = 'ONE_TIME' | 'RECURRING';
type PriorityType = 'LOW' | 'MEDIUM' | 'HIGH';

interface IBreak {
  start: string;
  end: string;
}

function parseTime(timeStr: string) {
  // "HH:MM" => [HH, MM]
  const [hh, mm] = timeStr.split(':').map(Number);
  return [hh, mm] as [number, number];
}

function isTimeBeforeOrEqual(a: string, b: string) {
  const [aH, aM] = parseTime(a);
  const [bH, bM] = parseTime(b);
  return aH < bH || (aH === bH && aM <= bM);
}

function isTimeBefore(a: string, b: string) {
  // same as above but strictly < instead of <=
  const [aH, aM] = parseTime(a);
  const [bH, bM] = parseTime(b);
  if (aH < bH) return true;
  if (aH > bH) return false;
  // aH == bH
  return aM < bM;
}

const StaffAvailabilityManager: React.FC = () => {
  // Tabs: 'CREATE' or 'LIST'
  const [activeTab, setActiveTab] = useState<'CREATE'|'LIST'>('CREATE');

  // ─────────────────────────────────────────────────────
  // 1) Fetch data
  // ─────────────────────────────────────────────────────
  const {
    data: availList = [],
    isLoading: isAvailLoading,
    refetch: refetchAvail,
  } = useListAvailabilitiesQuery();

  const { data: staffList = [], isLoading: isStaffLoading } = useListStaffQuery();

  // ─────────────────────────────────────────────────────
  // 2) Mutations
  // ─────────────────────────────────────────────────────
  const [createAvailability, { isLoading: creating }] = useCreateAvailabilityMutation();
  const [updateAvailability] = useUpdateAvailabilityMutation();
  const [deleteAvailability] = useDeleteAvailabilityMutation();
  const [assignStaffToAvailability] = useAssignStaffToAvailabilityMutation();
  const [unassignStaffFromAvailability] = useUnassignStaffFromAvailabilityMutation();

  // ─────────────────────────────────────────────────────
  // 3) Create Form State
  // ─────────────────────────────────────────────────────
  const [type, setType] = useState<AvailabilityType>('ONE_TIME');
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // Monday
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [staffId, setStaffId] = useState<string>(''); // optional staff

  // Additional fields
  const [label, setLabel] = useState<string>('');
  const [priority, setPriority] = useState<PriorityType>('MEDIUM');
  const [breaks, setBreaks] = useState<IBreak[]>([]);

  // ─────────────────────────────────────────────────────
  // 4) Handlers - CREATE
  // ─────────────────────────────────────────────────────
  async function handleCreate() {
    // Basic Validation
    if (type === 'ONE_TIME') {
      if (!startDateTime || !endDateTime) {
        alert('Please pick start & end date/time for ONE_TIME availability.');
        return;
      }
      if (endDateTime <= startDateTime) {
        alert('End DateTime cannot be before (or equal) Start DateTime.');
        return;
      }
      // Validate breaks:
      for (const b of breaks) {
        if (!b.start || !b.end) continue; // skip empty
        // Convert the entire dateTime to strings if you want a more accurate comparison.
        // For simplicity, let's just skip or do a naive approach
      }
    } else {
      // RECURRING
      if (!isTimeBefore(startTime, endTime)) {
        alert('For RECURRING, endTime must be after startTime.');
        return;
      }
      // Validate breaks: each break must be within startTime & endTime
      for (const b of breaks) {
        if (!isTimeBefore(startTime, b.start) || !isTimeBefore(b.end, endTime)) {
          alert(`Break [${b.start}-${b.end}] must lie within [${startTime}-${endTime}].`);
          return;
        }
        if (!isTimeBefore(b.start, b.end)) {
          alert(`Break start must be before break end: ${b.start} >= ${b.end}`);
          return;
        }
      }
    }

    // Build body
    const body: any = {
      type,
      label,
      priority,
      breaks,
    };

    if (staffId) {
      body.staff = staffId; // If user selected a staff
    }

    if (type === 'ONE_TIME') {
      body.startDateTime = startDateTime?.toISOString();
      body.endDateTime = endDateTime?.toISOString();
    } else {
      body.dayOfWeek = dayOfWeek;
      body.startTime = startTime;
      body.endTime = endTime;
    }

    try {
      await createAvailability(body).unwrap();

      // reset form
      setType('ONE_TIME');
      setStartDateTime(null);
      setEndDateTime(null);
      setDayOfWeek(1);
      setStartTime('09:00');
      setEndTime('17:00');
      setStaffId('');
      setLabel('');
      setPriority('MEDIUM');
      setBreaks([]);

      // refetch
      refetchAvail();
      alert('Availability created successfully.');
    } catch (err) {
      console.error('Failed to create availability:', err);
      alert('Error creating availability. Check console for details.');
    }
  }

  // Break array handlers
  function handleAddBreak() {
    setBreaks([...breaks, { start: '', end: '' }]);
  }
  function handleBreakChange(index: number, field: 'start' | 'end', value: string) {
    const newBreaks = [...breaks];
    newBreaks[index][field] = value;
    setBreaks(newBreaks);
  }
  function handleRemoveBreak(index: number) {
    const newBreaks = [...breaks];
    newBreaks.splice(index, 1);
    setBreaks(newBreaks);
  }

  // ─────────────────────────────────────────────────────
  // 5) Staff (Un)Assignment on existing blocks
  // ─────────────────────────────────────────────────────
  async function handleSelectStaff(availId: string, newStaffId: string) {
    try {
      if (!newStaffId) {
        // Unassign
        await unassignStaffFromAvailability({ availabilityId: availId }).unwrap();
      } else {
        // Assign
        await assignStaffToAvailability({ availabilityId: availId, newStaffId }).unwrap();
      }
      refetchAvail();
    } catch (err) {
      console.error('Failed to assign/unassign staff:', err);
      alert('Error. Check console.');
    }
  }

  // ─────────────────────────────────────────────────────
  // 6) Toggle isActive
  // ─────────────────────────────────────────────────────
  async function handleToggleActive(availId: string, currentActive: boolean) {
    try {
      await updateAvailability({
        availabilityId: availId,
        body: { isActive: !currentActive },
      }).unwrap();
      refetchAvail();
    } catch (err) {
      console.error('Failed to toggle isActive:', err);
    }
  }

  // ─────────────────────────────────────────────────────
  // 7) DELETE
  // ─────────────────────────────────────────────────────
  async function handleDelete(availId: string) {
    if (!window.confirm('Are you sure you want to delete this availability?')) return;
  
    try {
      const response = await deleteAvailability({ availabilityId: availId }).unwrap();
      alert(response.message || 'Availability deleted successfully.');
      refetchAvail();
    } catch (err: any) {
      console.error('Failed to delete availability:', err);
      const errorMessage = err?.data?.message || 'Failed to delete. Try again.';
      alert(errorMessage);
    }
  }

  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────
  return (
    <section className="p-4 max-w-5xl mx-auto ">
      <h1 className="text-2xl font-bold mb-6">Staff Availability Manager</h1>

      {/* TAB BAR */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('CREATE')}
          className={`px-4 py-2 rounded-t ${
            activeTab === 'CREATE'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Create
        </button>
        <button
          onClick={() => setActiveTab('LIST')}
          className={`px-4 py-2 rounded-t ${
            activeTab === 'LIST'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          List
        </button>
      </div>

      {/* TABS CONTENT */}
      {activeTab === 'CREATE' && (
        <div className="border p-4 rounded-b bg-gray-50">
          {/* CREATE AVAILABILITY FORM */}
          <h2 className="font-semibold mb-3 text-lg">Create New Availability</h2>

          {/* Staff (optional) */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              (Optional) Assign to Staff:
            </label>
            {isStaffLoading ? (
              <p className="text-sm text-gray-500">Loading staff list...</p>
            ) : (
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="border px-2 py-1 rounded w-full max-w-sm"
              >
                <option value="">-- No staff --</option>
                {staffList.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.firstName} {st.lastName} (ID: {st._id.slice(-4)})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Type radio */}
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={type === 'ONE_TIME'}
                onChange={() => setType('ONE_TIME')}
              />
              <span>ONE_TIME</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={type === 'RECURRING'}
                onChange={() => setType('RECURRING')}
              />
              <span>RECURRING</span>
            </label>
          </div>

          {/* ONE_TIME vs RECURRING UI */}
          {type === 'ONE_TIME' ? (
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start DateTime
                </label>
                <DatePicker
                  selected={startDateTime}
                  onChange={setStartDateTime}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm"
                  className="border px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End DateTime
                </label>
                <DatePicker
                  selected={endDateTime}
                  onChange={setEndDateTime}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm"
                  className="border px-2 py-1 rounded w-full"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day of Week
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(Number(e.target.value))}
                  className="border px-2 py-1 rounded w-full"
                >
                  <option value={0}>Sunday</option>
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
              </div>
            </div>
          )}

          {/* Priority */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityType)}
              className="border px-2 py-1 rounded w-full max-w-sm"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          {/* Label */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="(optional) e.g. 'Morning Shift'"
              className="border px-2 py-1 rounded w-full max-w-sm"
            />
          </div>

          {/* Breaks */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breaks (optional)
            </label>

            {/* Show list of breaks + Add button */}
            {breaks.map((bk, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <input
                  type="time"
                  value={bk.start}
                  onChange={(e) => handleBreakChange(idx, 'start', e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <span className="text-sm">to</span>
                <input
                  type="time"
                  value={bk.end}
                  onChange={(e) => handleBreakChange(idx, 'end', e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <button
                  onClick={() => handleRemoveBreak(idx)}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={handleAddBreak}
              className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              + Add Break
            </button>
          </div>

          <button
            onClick={handleCreate}
            disabled={creating}
            className="bg-blue-600 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700 transition"
          >
            {creating ? 'Saving...' : 'Create Availability'}
          </button>
        </div>
      )}

      {activeTab === 'LIST' && (
        <div className="border p-4 rounded-b bg-white">
          {/* LIST OF AVAILABILITIES */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">All Availabilities</h2>
            <button
              onClick={() => refetchAvail()}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Reload
            </button>
          </div>

          {isAvailLoading ? (
            <p className="text-gray-500">Loading availabilities...</p>
          ) : (
            <div className="overflow-x-auto">
               
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 border">Type</th>
                    <th className="px-3 py-2 border">Staff</th>
                    <th className="px-3 py-2 border">Details</th>
                    <th className="px-3 py-2 border">Active?</th>
                    <th className="px-3 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {availList.map((av) => (
                    <tr key={av._id} className="hover:bg-gray-50">
                      {/* Type */}
                      <td className="border px-3 py-2">{av.type}</td>

                      {/* Staff assignment */}
                      <td className="border px-3 py-2">
                        {av.staff ? (
                          <span className="text-gray-700">
                            Assigned to:{' '}
                            {typeof av.staff === 'string'
                              ? av.staff
                              : av.staff._id}
                          </span>
                        ) : (
                          <span className="italic text-gray-400">No Staff</span>
                        )}
                        {/* Quick staff re-assign/unassign */}
                        {!isStaffLoading && (
                          <select
                            className="ml-2 border text-xs"
                            value={
                              av.staff
                                ? (typeof av.staff === 'string'
                                  ? av.staff
                                  : av.staff._id)
                                : ''
                            }
                            onChange={(e) =>
                              handleSelectStaff(av._id, e.target.value)
                            }
                          >
                            <option value="">(Unassign)</option>
                            {staffList.map((st) => (
                              <option key={st._id} value={st._id}>
                                {st.firstName} {st.lastName}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      {/* Details (type + priority + label + breaks) */}
                      <td className="border px-3 py-2">
                        <div>
                          {av.type === 'ONE_TIME' ? (
                            <div>
                            <strong>Time:</strong>{' '}
                            {new Date(av.startDateTime || '').toLocaleString()} →{' '}
                            {new Date(av.endDateTime || '').toLocaleString()}
                          </div>
                          ) : (
                            <div>
                              <strong>Day:</strong> {av.dayOfWeek},{' '}
                              {av.startTime} → {av.endTime}
                            </div>
                          )}
                        </div>

                        {/* Priority */}
                        <div className="mt-1">
                          <strong>Priority:</strong>{' '}
                          <span
                            className={`ml-1 px-2 py-1 text-xs font-medium rounded 
                              ${av.priority === 'HIGH'
                                ? 'bg-red-100 text-red-800'
                                : av.priority === 'LOW'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'}`}
                          >
                            {av.priority}
                          </span>
                        </div>

                        {/* Label */}
                        {av.label && (
                          <div className="mt-1">
                            <strong>Label:</strong> {av.label}
                          </div>
                        )}

                        {/* Breaks */}
                        {av.breaks && av.breaks.length > 0 && (
                          <div className="mt-1">
                            <strong>Breaks:</strong>
                            {av.breaks.map((b, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-gray-600"
                              >
                                {b.start} - {b.end}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Active toggler */}
                      <td className="border px-3 py-2 text-center">
                        {av.isActive ? 'Yes' : 'No'}
                      </td>

                      {/* Actions */}
                      <td className="border px-3 py-2 space-x-2">
                        <button
                          onClick={() =>
                            handleToggleActive(av._id, av.isActive)
                          }
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => handleDelete(av._id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default StaffAvailabilityManager;
