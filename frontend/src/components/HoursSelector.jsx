import React, { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import ModernNumberInput from './ModernNumberInput';

export default function HoursSelector({ initialHours, onHoursSelected }) {
  const [hours, setHours] = useState(initialHours && initialHours > 0 ? initialHours : 8);

  const quickPresets = [4, 6, 8, 10, 12];

  const handleSubmit = (e) => {
    e.preventDefault();
    const numHours = parseFloat(hours);
    if (!isNaN(numHours) && numHours > 0 && numHours <= 24) {
      if (onHoursSelected) {
        onHoursSelected(numHours);
      }
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/40 relative overflow-hidden shadow-2xl animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-700/60">
        <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
          <Clock className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
            Work Duration Resolution
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Specify Worked Hours
          </h3>
        </div>
      </div>

      {/* Warning Alert */}
      <div className="bg-amber-950/80 border border-amber-500/50 rounded-xl p-4 flex items-start gap-3 text-amber-200 text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-300">Shift Duration Not Detected</p>
          <p>We could not find shift hours in your voice input. Please select or enter your shift duration to compute accurate wages.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Quick Select Shift Duration
          </label>
          <div className="grid grid-cols-5 gap-2">
            {quickPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setHours(preset)}
                className={`py-3 px-2 rounded-xl text-center font-extrabold text-sm border transition-all ${
                  parseFloat(hours) === preset
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.03]'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {preset}h
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Custom Worked Hours (1 - 24 hrs)
          </label>
          <ModernNumberInput
            value={hours}
            onChange={setHours}
            min={0.5}
            max={24}
            step={0.5}
            suffix="hrs"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto py-4 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
          >
            <CheckCircle className="w-5 h-5" />
            Confirm Shift Duration
          </button>
        </div>

      </form>

    </div>
  );
}
