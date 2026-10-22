import React, { createContext, useContext, useState } from 'react';

export interface TimezoneInfo {
  id: string;
  label: string;
  shortName: string;
  cities: string;
  offsetMinutes: number; // offset relative to UTC in minutes
}

export const TIMEZONES: TimezoneInfo[] = [
  {
    id: 'PST',
    label: 'Pacific Time (PT)',
    shortName: 'PST',
    cities: 'San Francisco, Los Angeles, Seattle',
    offsetMinutes: -480 // UTC-8
  },
  {
    id: 'MST',
    label: 'Mountain Time (MT)',
    shortName: 'MST',
    cities: 'Denver, Phoenix, Salt Lake City',
    offsetMinutes: -420 // UTC-7
  },
  {
    id: 'CST_US',
    label: 'Central Time (CT)',
    shortName: 'CST',
    cities: 'Chicago, Dallas, Austin',
    offsetMinutes: -360 // UTC-6
  },
  {
    id: 'EST',
    label: 'Eastern Time (ET)',
    shortName: 'EST',
    cities: 'New York, Boston, Miami, Toronto',
    offsetMinutes: -300 // UTC-5
  },
  {
    id: 'UTC',
    label: 'Coordinated Universal Time (UTC)',
    shortName: 'UTC',
    cities: 'Greenwich, Reykjavik, Monrovia',
    offsetMinutes: 0
  },
  {
    id: 'GMT',
    label: 'London / Dublin (GMT/BST)',
    shortName: 'GMT',
    cities: 'London, Dublin, Lisbon',
    offsetMinutes: 0
  },
  {
    id: 'CET',
    label: 'Central European Time (CET)',
    shortName: 'CET',
    cities: 'Berlin, Paris, Amsterdam, Zurich',
    offsetMinutes: 60 // UTC+1
  },
  {
    id: 'IST',
    label: 'India Standard Time (IST)',
    shortName: 'IST',
    cities: 'Bengaluru, Mumbai, New Delhi',
    offsetMinutes: 330 // UTC+5:30
  },
  {
    id: 'SGT',
    label: 'Singapore / China (SGT/CST)',
    shortName: 'SGT',
    cities: 'Singapore, Hong Kong, Beijing',
    offsetMinutes: 480 // UTC+8
  },
  {
    id: 'JST',
    label: 'Japan Standard Time (JST)',
    shortName: 'JST',
    cities: 'Tokyo, Osaka, Seoul',
    offsetMinutes: 540 // UTC+9
  },
  {
    id: 'AEST',
    label: 'Australian Eastern Time (AEST)',
    shortName: 'AEST',
    cities: 'Sydney, Melbourne, Brisbane',
    offsetMinutes: 600 // UTC+10
  }
];

export const PST_TIMEZONE = TIMEZONES[0];

/**
 * Utility: Convert minutes from midnight (in PST, UTC-8) to target timezone.
 */
export function convertPstMinutesToTarget(pstTotalMinutes: number, targetTz: TimezoneInfo): {
  hours12: number;
  minutes: number;
  period: 'AM' | 'PM';
  formattedTime: string;
  dayOffset: number; // -1, 0, +1
} {
  const pstOffset = -480;
  const deltaMinutes = targetTz.offsetMinutes - pstOffset;
  const totalTargetMinutes = pstTotalMinutes + deltaMinutes;

  let dayOffset = 0;
  let normalizedMinutes = totalTargetMinutes;

  if (normalizedMinutes >= 1440) {
    dayOffset = Math.floor(normalizedMinutes / 1440);
    normalizedMinutes = normalizedMinutes % 1440;
  } else if (normalizedMinutes < 0) {
    dayOffset = Math.floor(normalizedMinutes / 1440);
    normalizedMinutes = ((normalizedMinutes % 1440) + 1440) % 1440;
  }

  const hours24 = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  const period: 'AM' | 'PM' = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  const minStr = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;
  const formattedTime = `${hours12}${minStr} ${period}`;

  return {
    hours12,
    minutes,
    period,
    formattedTime,
    dayOffset
  };
}

/**
 * Parses a single time fragment like "9", "9:30", "9 am", "10:00 AM", "2:00 PM"
 * in PST and converts it to the target timezone.
 */
function parsePstFragment(fragment: string, defaultPeriod?: 'AM' | 'PM'): { totalMinutes: number; originalPeriod: 'AM' | 'PM' } | null {
  const clean = fragment.trim().toLowerCase();
  const isPm = clean.includes('pm');
  const isAm = clean.includes('am');
  const period: 'AM' | 'PM' = isPm ? 'PM' : isAm ? 'AM' : (defaultPeriod || 'AM');

  const numbersOnly = clean.replace(/am|pm/g, '').trim();
  const parts = numbersOnly.split(':');
  let hour = parseInt(parts[0], 10);
  let min = parts.length > 1 ? parseInt(parts[1], 10) : 0;

  if (isNaN(hour)) return null;
  if (isNaN(min)) min = 0;

  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  return {
    totalMinutes: hour * 60 + min,
    originalPeriod: period
  };
}

/**
 * Universal time converter for any time string in the UI.
 * Examples:
 * "9-9:30 am PST" -> "12-12:30 pm EST" or "10:30-11:00 pm IST"
 * "9:00 AM – 11:00 AM PST" -> "12:00 PM – 2:00 PM EST"
 * "8 am" -> "11 am"
 * "10:00 AM – 11:00 AM" -> "1:00 PM – 2:00 PM EST"
 */
export function convertPstStringToTarget(timeStr: string, targetTz: TimezoneInfo): string {
  if (!timeStr) return '';
  if (targetTz.id === 'PST') return timeStr;

  // Handle range like "9-9:30 am PST" or "9:30-10 am PST" or "10-11 am PST"
  const shortRangeMatch = timeStr.match(/^(\d+(?::\d+)?)\s*-\s*(\d+(?::\d+)?)\s*(am|pm)(?:\s*pst)?$/i);
  if (shortRangeMatch) {
    const endPeriod = shortRangeMatch[3].toUpperCase() as 'AM' | 'PM';
    const startParsed = parsePstFragment(shortRangeMatch[1], endPeriod);
    const endParsed = parsePstFragment(shortRangeMatch[2], endPeriod);

    if (startParsed && endParsed) {
      const startConv = convertPstMinutesToTarget(startParsed.totalMinutes, targetTz);
      const endConv = convertPstMinutesToTarget(endParsed.totalMinutes, targetTz);

      const startMin = startConv.minutes === 0 ? '' : `:${startConv.minutes.toString().padStart(2, '0')}`;
      const endMin = endConv.minutes === 0 ? '' : `:${endConv.minutes.toString().padStart(2, '0')}`;

      const dayNote = endConv.dayOffset > 0 ? ` (+${endConv.dayOffset}d)` : endConv.dayOffset < 0 ? ` (${endConv.dayOffset}d)` : '';
      return `${startConv.hours12}${startMin} – ${endConv.hours12}${endMin} ${endConv.period} ${targetTz.shortName}${dayNote}`;
    }
  }

  // Handle standard range like "9:00 AM – 10:00 AM PST" or "9:00 AM - 10:00 AM" or "10:00 AM – 11:00 AM"
  const standardRangeMatch = timeStr.match(/^(\d+(?::\d+)?\s*(?:am|pm)?)\s*[–-]\s*(\d+(?::\d+)?\s*(?:am|pm)?)(?:\s*pst)?/i);
  if (standardRangeMatch) {
    const startRaw = standardRangeMatch[1].trim();
    const endRaw = standardRangeMatch[2].trim();

    // Determine end period
    const endIsPm = endRaw.toLowerCase().includes('pm');
    const endIsAm = endRaw.toLowerCase().includes('am');
    const endPeriod: 'AM' | 'PM' = endIsPm ? 'PM' : endIsAm ? 'AM' : 'AM';

    const startIsPm = startRaw.toLowerCase().includes('pm');
    const startIsAm = startRaw.toLowerCase().includes('am');
    const startPeriod: 'AM' | 'PM' = startIsPm ? 'PM' : startIsAm ? 'AM' : endPeriod;

    const startParsed = parsePstFragment(startRaw, startPeriod);
    const endParsed = parsePstFragment(endRaw, endPeriod);

    if (startParsed && endParsed) {
      const startConv = convertPstMinutesToTarget(startParsed.totalMinutes, targetTz);
      const endConv = convertPstMinutesToTarget(endParsed.totalMinutes, targetTz);

      const startMinStr = startConv.minutes.toString().padStart(2, '0');
      const endMinStr = endConv.minutes.toString().padStart(2, '0');

      const dayNote = endConv.dayOffset > 0 ? ` (+${endConv.dayOffset}d)` : '';
      return `${startConv.hours12}:${startMinStr} ${startConv.period} – ${endConv.hours12}:${endMinStr} ${endConv.period} ${targetTz.shortName}${dayNote}`;
    }
  }

  // Handle single hour label like "8 am" or "9 am" or "10 am"
  const singleAmPmMatch = timeStr.match(/^(\d+)\s*(am|pm)$/i);
  if (singleAmPmMatch) {
    const hour = parseInt(singleAmPmMatch[1], 10);
    const period = singleAmPmMatch[2].toUpperCase() as 'AM' | 'PM';
    const parsed = parsePstFragment(`${hour} ${period}`, period);
    if (parsed) {
      const conv = convertPstMinutesToTarget(parsed.totalMinutes, targetTz);
      const minStr = conv.minutes === 0 ? '' : `:${conv.minutes.toString().padStart(2, '0')}`;
      return `${conv.hours12}${minStr} ${conv.period.toLowerCase()}`;
    }
  }

  // Handle single formatted time like "9:00 AM" or "2:00 PM"
  const singleFormattedMatch = timeStr.match(/^(\d+):(\d+)\s*(am|pm)$/i);
  if (singleFormattedMatch) {
    const parsed = parsePstFragment(timeStr);
    if (parsed) {
      const conv = convertPstMinutesToTarget(parsed.totalMinutes, targetTz);
      const minStr = conv.minutes.toString().padStart(2, '0');
      return `${conv.hours12}:${minStr} ${conv.period}`;
    }
  }

  return timeStr;
}

interface TimezoneContextType {
  currentTimezone: TimezoneInfo;
  setTimezoneById: (id: string) => void;
  availableTimezones: TimezoneInfo[];
  convertTime: (pstTimeStr: string) => string;
  convertHourLabel: (pstHour: number) => { label: string; period: 'AM' | 'PM'; full: string };
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

export const TimezoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTimezone, setCurrentTimezone] = useState<TimezoneInfo>(() => {
    const saved = localStorage.getItem('chakravyuh_timezone');
    if (saved) {
      const found = TIMEZONES.find(t => t.id === saved);
      if (found) return found;
    }
    return PST_TIMEZONE;
  });

  const setTimezoneById = (id: string) => {
    const found = TIMEZONES.find(t => t.id === id);
    if (found) {
      setCurrentTimezone(found);
      localStorage.setItem('chakravyuh_timezone', id);
    }
  };

  const convertTime = (pstTimeStr: string) => {
    return convertPstStringToTarget(pstTimeStr, currentTimezone);
  };

  const convertHourLabel = (pstHour: number) => {
    // pstHour: 8 for 8 am, 14 for 2 pm
    const conv = convertPstMinutesToTarget(pstHour * 60, currentTimezone);
    const minStr = conv.minutes === 0 ? '' : `:${conv.minutes.toString().padStart(2, '0')}`;
    return {
      label: `${conv.hours12}${minStr}`,
      period: conv.period,
      full: `${conv.hours12}${minStr} ${conv.period.toLowerCase()}`
    };
  };

  return (
    <TimezoneContext.Provider
      value={{
        currentTimezone,
        setTimezoneById,
        availableTimezones: TIMEZONES,
        convertTime,
        convertHourLabel
      }}
    >
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezone = () => {
  const context = useContext(TimezoneContext);
  if (!context) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }
  return context;
};
