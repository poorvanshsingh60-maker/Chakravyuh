import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Search, Clock } from 'lucide-react';
import { useTimezone, TimezoneInfo } from '../../context/TimezoneContext';

interface TimezoneSelectorProps {
  className?: string;
  variant?: 'default' | 'compact' | 'subtle';
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({ 
  className = '',
  variant = 'default' 
}) => {
  const { currentTimezone, setTimezoneById, availableTimezones } = useTimezone();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filtered = availableTimezones.filter(tz => 
    tz.label.toLowerCase().includes(search.toLowerCase()) ||
    tz.shortName.toLowerCase().includes(search.toLowerCase()) ||
    tz.cities.toLowerCase().includes(search.toLowerCase()) ||
    tz.id.toLowerCase().includes(search.toLowerCase())
  );

  // Format current live time in specified timezone
  const getLiveTimeInTz = (tz: TimezoneInfo) => {
    try {
      const now = new Date();
      // Calculate target time using offset
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const targetTime = new Date(utc + (tz.offsetMinutes * 60000));
      return targetTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  const quickPicks = ['PST', 'EST', 'IST', 'GMT', 'UTC'];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
          variant === 'subtle'
            ? 'border-transparent text-[#475467] hover:bg-[#f2f4f7]'
            : 'border-[#d0d5dd] bg-white text-[#344054] hover:bg-[#f9fafb] hover:border-[#1668e8]/50 shadow-2xs'
        }`}
        title={`Current timezone: ${currentTimezone.label} (${currentTimezone.shortName})`}
      >
        <Globe className="w-3.5 h-3.5 text-[#1668e8]" />
        <span className="font-semibold text-[#101828]">
          {variant === 'compact' ? currentTimezone.shortName : currentTimezone.label}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#667085] ml-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-80 max-w-[90vw] rounded-xl bg-white border border-[#eaecf0] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden text-xs">
          
          {/* Header & Search */}
          <div className="p-3 border-b border-[#eaecf0] bg-[#fafafa] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#101828] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#1668e8]" />
                Select Working Timezone
              </span>
              <span className="text-[10px] font-mono text-[#667085] bg-white px-1.5 py-0.5 rounded border border-[#eaecf0]">
                {currentTimezone.shortName}
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#98a2b3] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Search city, country, or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-[#d0d5dd] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:border-[#1668e8] focus:ring-1 focus:ring-[#1668e8]"
              />
            </div>

            {/* Quick Pick Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] text-[#667085] font-semibold">Quick:</span>
              {quickPicks.map((pickId) => {
                const tz = availableTimezones.find(t => t.id === pickId);
                if (!tz) return null;
                const isSelected = currentTimezone.id === tz.id;
                return (
                  <button
                    key={pickId}
                    type="button"
                    onClick={() => {
                      setTimezoneById(tz.id);
                      setIsOpen(false);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#1668e8] text-white shadow-2xs'
                        : 'bg-white border border-[#d0d5dd] text-[#344054] hover:bg-[#f2f4f7]'
                    }`}
                  >
                    {tz.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timezone List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-[#f2f4f7] p-1">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-[#667085] text-xs">
                No matching timezones found.
              </div>
            ) : (
              filtered.map((tz) => {
                const isSelected = currentTimezone.id === tz.id;
                const liveTime = getLiveTimeInTz(tz);
                const offsetLabel = tz.offsetMinutes >= 0 
                  ? `UTC+${Math.floor(tz.offsetMinutes / 60)}:${(tz.offsetMinutes % 60).toString().padStart(2, '0')}`
                  : `UTC-${Math.floor(Math.abs(tz.offsetMinutes) / 60)}:${(Math.abs(tz.offsetMinutes) % 60).toString().padStart(2, '0')}`;

                return (
                  <button
                    key={tz.id}
                    type="button"
                    onClick={() => {
                      setTimezoneById(tz.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#f0f7ff] text-[#1668e8] font-semibold'
                        : 'hover:bg-[#f9fafb] text-[#344054]'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#101828]">{tz.label}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#f2f4f7] text-[#475467] border border-[#eaecf0]">
                          {tz.shortName}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#667085] truncate max-w-[200px]">
                        {tz.cities}
                      </p>
                    </div>

                    <div className="text-right space-y-0.5 shrink-0 pl-2">
                      <div className="flex items-center gap-1 justify-end font-mono text-[11px] text-[#101828]">
                        <Clock className="w-3 h-3 text-[#98a2b3]" />
                        <span>{liveTime}</span>
                      </div>
                      <span className="text-[10px] text-[#98a2b3] font-mono block">
                        {offsetLabel}
                      </span>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[#1668e8] ml-2 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="p-2.5 bg-[#fafafa] border-t border-[#eaecf0] text-[10px] text-[#667085] flex items-center justify-between">
            <span>Dynamically converts all calendar blocks & slots</span>
            <span className="font-semibold text-[#1668e8]">Active</span>
          </div>

        </div>
      )}

    </div>
  );
};
