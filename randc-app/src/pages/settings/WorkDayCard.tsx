// src/components/Settings/WorkDayCard.tsx
import React from 'react';

type AmPm = 'AM' | 'PM';

interface IWorkDay {
  dayOfWeek: number;
  openTime: string;  // in 24-hour format, e.g. "09:30"
  closeTime: string; // in 24-hour format, e.g. "17:45"
  breaks: IBreak[];
}

interface IBreak {
  start: string;
  end: string;
}

interface WorkDayCardProps {
  dayName: string;
  workDay: IWorkDay;
  onTimeChange: (
    dayIndex: number,
    field: 'openTime' | 'closeTime',
    hour12: number,
    minute: number,
    amPm: AmPm
  ) => void;
  dayIndex: number;
}

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

const WorkDayCard: React.FC<WorkDayCardProps> = ({ dayName, workDay, onTimeChange, dayIndex }) => {
  const { hour12: oh, minute: om, amPm: oAmPm } = parse24To12(workDay.openTime);
  const { hour12: ch, minute: cm, amPm: cAmPm } = parse24To12(workDay.closeTime);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md shadow-sm mb-4 bg-white">
      {/* Day Name */}
      <div className="w-full sm:w-1/4 mb-2 sm:mb-0">
        <span className="font-medium text-gray-700">{dayName}</span>
      </div>

      {/* Open and Close Time */}
      <div className="flex items-center w-full sm:w-3/4">
        {/* Open Time */}
        <div className="flex items-center mr-4">
          <label className="text-gray-600 mr-2">Open:</label>
          <div className="flex items-center space-x-1">
            {/* Hour */}
            <select
              value={oh}
              onChange={(e) =>
                onTimeChange(
                  dayIndex,
                  'openTime',
                  Number(e.target.value),
                  om,
                  oAmPm
                )
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
              value={om}
              onChange={(e) =>
                onTimeChange(
                  dayIndex,
                  'openTime',
                  oh,
                  Number(e.target.value),
                  oAmPm
                )
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
              value={oAmPm}
              onChange={(e) => {
                const newValue = e.target.value === 'PM' ? 'PM' : 'AM';
                onTimeChange(dayIndex, 'openTime', oh, om, newValue);
              }}
              className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {/* Close Time */}
        <div className="flex items-center">
          <label className="text-gray-600 mr-2">Close:</label>
          <div className="flex items-center space-x-1">
            {/* Hour */}
            <select
              value={ch}
              onChange={(e) =>
                onTimeChange(
                  dayIndex,
                  'closeTime',
                  Number(e.target.value),
                  cm,
                  cAmPm
                )
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
              value={cm}
              onChange={(e) =>
                onTimeChange(
                  dayIndex,
                  'closeTime',
                  ch,
                  Number(e.target.value),
                  cAmPm
                )
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
              value={cAmPm}
              onChange={(e) => {
                const newValue = e.target.value === 'PM' ? 'PM' : 'AM';
                onTimeChange(dayIndex, 'closeTime', ch, cm, newValue);
              }}
              className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDayCard;
