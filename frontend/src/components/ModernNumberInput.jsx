import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function ModernNumberInput({
  value,
  onChange,
  min = 0.5,
  max = 24,
  step = 0.5,
  suffix = 'hrs',
  className = '',
  placeholder = ''
}) {
  const numericVal = parseFloat(value) || 0;

  const handleDecrement = (e) => {
    e.preventDefault();
    const nextVal = Math.max(min, numericVal - step);
    // Round to precision of step
    const precision = step.toString().split('.')[1]?.length || 0;
    onChange(Number(nextVal.toFixed(precision)));
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    const nextVal = Math.min(max, numericVal + step);
    const precision = step.toString().split('.')[1]?.length || 0;
    onChange(Number(nextVal.toFixed(precision)));
  };

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
  };

  return (
    <div className={`relative flex items-center bg-slate-950 border border-slate-700/80 rounded-xl p-1 shadow-inner focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/30 transition-all ${className}`}>
      <input
        type="number"
        step={step}
        min={min}
        max={max}
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent border-none py-2.5 px-3.5 text-white font-extrabold text-base focus:outline-none placeholder-slate-500"
      />

      {suffix && (
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pr-2 select-none">
          {suffix}
        </span>
      )}

      {/* Modern Increase & Decrease Control Buttons */}
      <div className="flex items-center gap-1 pl-1 pr-1 border-l border-slate-800">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={numericVal <= min}
          title="Decrease"
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 disabled:opacity-40 disabled:hover:bg-slate-900 disabled:hover:text-slate-300 transition-all border border-slate-800 hover:border-cyan-500/40 shrink-0"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={numericVal >= max}
          title="Increase"
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 disabled:opacity-40 disabled:hover:bg-slate-900 disabled:hover:text-slate-300 transition-all border border-slate-800 hover:border-cyan-500/40 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
