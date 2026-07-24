import React from 'react';
import { AlertTriangle, AlertOctagon, ArrowRight, Edit3, CheckCircle2 } from 'lucide-react';

export default function ValidationBanner({
  warning,
  error,
  hoursWorked,
  onContinueAnyway,
  onEditEntry
}) {
  if (!warning && !error) return null;

  const isError = Boolean(error);
  const title = isError ? 'Invalid Input Error' : (warning || 'Unusual work duration detected');
  const displayHours = hoursWorked ? Number(hoursWorked) : null;

  return (
    <div
      className={`rounded-2xl p-6 border shadow-2xl animate-fade-in relative overflow-hidden transition-all ${
        isError
          ? 'bg-gradient-to-r from-rose-950/90 via-red-900/40 to-slate-900 border-rose-500/60 text-rose-100 shadow-rose-500/10'
          : 'bg-gradient-to-r from-amber-950/90 via-amber-900/40 to-slate-900 border-amber-500/60 text-amber-100 shadow-amber-500/10'
      }`}
    >
      <div className="flex items-start gap-4">
        
        {/* Icon */}
        <div
          className={`p-3 rounded-xl shrink-0 mt-0.5 ${
            isError
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          }`}
        >
          {isError ? (
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          ) : (
            <AlertTriangle className="w-6 h-6 animate-bounce" />
          )}
        </div>

        {/* Content */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isError
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              {isError ? 'Validation Error' : 'Anomaly Warning'}
            </span>
            <span className="text-xs text-slate-400">Validation Layer 3</span>
          </div>

          <h4 className="text-lg font-bold text-white leading-tight">
            ⚠ {title}
          </h4>

          {displayHours && (
            <p className="text-sm font-semibold text-slate-300">
              You entered <span className="text-white font-extrabold underline">{displayHours} hours</span>.
            </p>
          )}

          <p className="text-xs text-slate-300">
            Please verify before continuing to wage detection to ensure calculations are accurate.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {!isError && onContinueAnyway && (
              <button
                onClick={onContinueAnyway}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Continue Anyway
              </button>
            )}

            {onEditEntry && (
              <button
                onClick={onEditEntry}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <Edit3 className="w-4 h-4 text-cyan-400" />
                Edit Entry
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
