import React, { useState, useRef, useEffect } from 'react';

export default function ModernCalendarFilter({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef(null);

  // Calendar navigation state (Year & Month)
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Mode: 'from' | 'to'
  const [activeSelectionMode, setActiveSelectionMode] = useState('from');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (activeSelectionMode === 'from') {
      setFromDate(dateStr);
      if (toDate && dateStr > toDate) {
        setToDate('');
      }
      setActiveSelectionMode('to');
    } else {
      if (fromDate && dateStr < fromDate) {
        setFromDate(dateStr);
        setToDate('');
        setActiveSelectionMode('to');
      } else {
        setToDate(dateStr);
        setActiveSelectionMode('from');
      }
    }
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setActiveSelectionMode('from');
  };

  // Format trigger button text
  const getTriggerLabel = () => {
    if (fromDate && toDate) {
      return `${fromDate} to ${toDate}`;
    }
    if (fromDate) {
      return `From: ${fromDate}`;
    }
    if (toDate) {
      return `To: ${toDate}`;
    }
    return 'Select Date Range';
  };

  return (
    <div className={`relative ${className}`} ref={calendarRef}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3.5 py-2.5 rounded-2xl bg-slate-950 border transition-all duration-200 flex items-center gap-2 text-xs font-bold cursor-pointer ${
          isOpen || fromDate || toDate
            ? 'border-cyan-500 shadow-lg shadow-cyan-500/10 text-cyan-300 ring-2 ring-cyan-500/20'
            : 'border-slate-800/90 hover:border-slate-700 text-slate-200 hover:text-white'
        }`}
      >
        <span>{getTriggerLabel()}</span>
      </button>

      {/* FLOATING CALENDAR POPOVER */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto left-0 sm:left-auto top-full mt-2 z-50 p-4 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl shadow-slate-950/90 animate-fadeIn space-y-4 w-[320px]">
          
          {/* FROM DATE & TO DATE INPUTS ROW */}
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => setActiveSelectionMode('from')}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                activeSelectionMode === 'from'
                  ? 'bg-slate-950 border-cyan-500 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">From Date</span>
              <input
                type="date"
                value={fromDate || ''}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-transparent text-xs font-extrabold text-white focus:outline-none cursor-pointer"
              />
            </div>

            <div
              onClick={() => setActiveSelectionMode('to')}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                activeSelectionMode === 'to'
                  ? 'bg-slate-950 border-cyan-500 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">To Date</span>
              <input
                type="date"
                value={toDate || ''}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-transparent text-xs font-extrabold text-white focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Month / Year Navigator */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-cyan-500/50 cursor-pointer"
            >
              &lt;
            </button>

            <span className="text-xs font-extrabold text-white">
              {monthNames[currentMonth]} {currentYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-cyan-500/50 cursor-pointer"
            >
              &gt;
            </button>
          </div>

          {/* Day Names Header */}
          <div className="grid grid-cols-7 text-center">
            {dayNames.map((d) => (
              <span key={d} className="text-[10px] font-black text-slate-500 uppercase">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty Offset Slots */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              
              const isFrom = fromDate === dateStr;
              const isTo = toDate === dateStr;
              const isInRange = fromDate && toDate && dateStr >= fromDate && dateStr <= toDate;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  className={`h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                    isFrom || isTo
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                      : isInRange
                      ? 'bg-cyan-500/30 text-cyan-200 font-extrabold border border-cyan-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer Controls: Apply & Reset */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 text-rose-400 border border-slate-800 hover:border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
            >
              Apply Range
            </button>
          </div>

        </div>
      )}
    </div>
  );
}


