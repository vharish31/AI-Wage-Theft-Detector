import React from 'react';
import { Sun, Clock, Moon, Plus } from 'lucide-react';

/**
 * HoursSuggestionCard Component
 * Provides quick selection cards for common work shift durations.
 */
export default function HoursSuggestionCard({ currentHours, onSelectHours }) {
  const suggestions = [
    {
      id: 'half_day',
      title: 'Half Day',
      hours: 4.0,
      icon: Sun,
      iconColor: 'text-amber-400',
      bgColor: 'hover:border-amber-500/50 hover:bg-amber-950/20'
    },
    {
      id: 'full_day',
      title: 'Full Day',
      hours: 8.0,
      icon: Clock,
      iconColor: 'text-cyan-400',
      bgColor: 'hover:border-cyan-500/50 hover:bg-cyan-950/20'
    },
    {
      id: 'night_shift',
      title: 'Night Shift',
      hours: 10.0,
      icon: Moon,
      iconColor: 'text-indigo-400',
      bgColor: 'hover:border-indigo-500/50 hover:bg-indigo-950/20'
    },
    {
      id: 'custom',
      title: 'Custom',
      hours: null, // triggers manual input
      icon: Plus,
      iconColor: 'text-slate-300',
      bgColor: 'hover:border-slate-500/50 hover:bg-slate-800/40'
    }
  ];

  return (
    <div className="space-y-3">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
        Quick Selection Shifts
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {suggestions.map((item) => {
          const Icon = item.icon;
          const isSelected = item.hours !== null && Number(currentHours) === item.hours;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectHours(item.hours)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/10'
                  : `bg-slate-900/60 border-slate-800 ${item.bgColor}`
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className={`w-5 h-5 ${item.iconColor}`} />
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>

              <div>
                <div className="text-sm font-bold text-white leading-tight">
                  {item.title}
                </div>
                <div className="text-xs font-semibold text-slate-400 mt-0.5">
                  {item.hours !== null ? `${item.hours} Hours` : 'Manual Entry'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
