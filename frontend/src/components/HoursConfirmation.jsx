import React, { useState } from 'react';
import { Check, Edit3, Mic, Plus, Minus, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import ConfidenceBanner from './ConfidenceBanner';
import HoursSuggestionCard from './HoursSuggestionCard';

/**
 * HoursConfirmation Component
 * Renders AI estimated working hours, statement reasoning, confidence indicator,
 * quick shift suggestions, manual 0.5-hour increment controls, and validation alerts.
 */
export default function HoursConfirmation({
  estimatedHours = 8.0,
  confidence = 0.90,
  reasoning = '',
  statementText = '',
  validation = null,
  onConfirm,
  onRecordAgain
}) {
  const [currentHours, setCurrentHours] = useState(estimatedHours);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditedByUser, setIsEditedByUser] = useState(false);

  const handleIncrement = () => {
    setCurrentHours((prev) => {
      const nextVal = Math.min(24, Math.round((prev + 0.5) * 2) / 2);
      setIsEditedByUser(true);
      return nextVal;
    });
  };

  const handleDecrement = () => {
    setCurrentHours((prev) => {
      const nextVal = Math.max(0.5, Math.round((prev - 0.5) * 2) / 2);
      setIsEditedByUser(true);
      return nextVal;
    });
  };

  const handleSelectQuickShift = (hoursVal) => {
    if (hoursVal === null) {
      setIsEditing(true);
    } else {
      setCurrentHours(hoursVal);
      setIsEditedByUser(true);
    }
  };

  const handleConfirmAction = () => {
    // Validation check before confirming
    if (currentHours < 1.0) {
      alert("Working hours cannot be less than 1 hour.");
      return;
    }
    if (currentHours > 24.0) {
      alert("Working hours cannot exceed 24 hours in a single day.");
      return;
    }

    onConfirm({
      original_text: statementText || reasoning,
      estimated_hours: estimatedHours,
      final_hours: currentHours,
      confidence: confidence,
      edited_by_user: isEditedByUser || currentHours !== estimatedHours,
      source: isEditedByUser ? "USER_EDITED" : "VOICE_ESTIMATION"
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700 space-y-6 animate-fade-in shadow-2xl">
      
      {/* 1. Low Confidence Warning Banner */}
      <ConfidenceBanner confidence={confidence} />

      {/* 2. Validation Warning Banner (<1h, >16h, >24h) */}
      {currentHours < 1.0 && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-3 text-rose-300 text-xs font-bold">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>Working hours cannot be less than 1.</span>
        </div>
      )}

      {currentHours > 16.0 && currentHours <= 24.0 && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-3 text-amber-300 text-xs font-bold">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Unusual work duration detected (&gt;16 hours). Please confirm shift length.</span>
        </div>
      )}

      {currentHours > 24.0 && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500 flex items-center gap-3 text-rose-200 text-xs font-bold">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>Working hours cannot exceed 24 hours in a single day.</span>
        </div>
      )}

      {/* 3. Header & Main Display Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Smart Hours Estimation
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Confidence: {Math.round(confidence * 100)}%
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Estimated Working Hours
          </h2>
        </div>

        {/* Big Display Badge */}
        <div className="px-5 py-2.5 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 text-center shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider block text-cyan-400/80">AI Estimated</span>
          <span className="text-3xl font-black text-white tracking-tight">{currentHours} <span className="text-sm font-bold text-cyan-400">Hours</span></span>
        </div>
      </div>

      {/* 4. Reason Statement Card */}
      {(statementText || reasoning) && (
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" /> Reason / Statement Interpretation
          </span>
          <p className="text-sm text-slate-200 italic font-mono leading-relaxed">
            "{statementText || reasoning}"
          </p>
          {reasoning && statementText && (
            <p className="text-xs text-slate-400 pt-0.5">
              {reasoning}
            </p>
          )}
        </div>
      )}

      {/* 5. Quick Selection Buttons */}
      <HoursSuggestionCard
        currentHours={currentHours}
        onSelectHours={handleSelectQuickShift}
      />

      {/* 6. Manual Incremental Adjustment Control (0.5h Steps) */}
      {(isEditing || isEditedByUser) && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">
              Manual Hour Adjustment (0.5h Increments)
            </span>
            <span className="text-xs font-bold text-slate-400">
              Range: 1.0 - 16.0 hrs
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={currentHours <= 0.5}
              className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-400 flex items-center justify-center text-xl font-bold border border-slate-700 transition-all active:scale-95 cursor-pointer"
            >
              <Minus className="w-6 h-6" />
            </button>

            <div className="text-center min-w-[120px]">
              <span className="text-4xl font-black text-white">{currentHours}</span>
              <span className="text-sm font-bold text-slate-400 block">Hours</span>
            </div>

            <button
              type="button"
              onClick={handleIncrement}
              disabled={currentHours >= 24.0}
              className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-400 flex items-center justify-center text-xl font-bold border border-slate-700 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* 7. Action Buttons (Confirm, Edit, Record Again) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onRecordAgain}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all active:scale-95 cursor-pointer"
        >
          <Mic className="w-4 h-4 text-cyan-400" />
          🎤 Record Again
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all active:scale-95 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-cyan-400" />
              ✏ Edit Hours
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirmAction}
            className="flex-1 sm:flex-initial px-7 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4 text-slate-950" />
            ✓ Confirm
          </button>
        </div>
      </div>

    </div>
  );
}
