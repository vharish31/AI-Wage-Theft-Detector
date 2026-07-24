import React from 'react';
import { Briefcase, Clock, MapPin, CheckCircle, Edit3, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function JobTypeReview({ data, confidence, onConfirm, onEdit }) {
  const jobType = data?.job_type || 'Construction Worker';
  const hoursWorked = data?.hours_worked ?? 8;
  const location = data?.location || 'Chennai';

  // Check if confidence score is low (< 80% or < 0.8)
  const numericConfidence = typeof confidence === 'number' ? (confidence > 1 ? confidence / 100 : confidence) : null;
  const isLowConfidence = numericConfidence !== null && numericConfidence < 0.80;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 relative overflow-hidden shadow-2xl animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              Validation Layer 1: Review Card
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Detected Job Information
            </h3>
          </div>
        </div>

        {numericConfidence !== null && (
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
            isLowConfidence 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}>
            AI Confidence: {Math.round(numericConfidence * 100)}%
          </span>
        )}
      </div>

      {/* Validation Layer 4: Low Confidence Warning Banner */}
      {isLowConfidence && (
        <div className="bg-gradient-to-r from-amber-950/80 to-amber-900/60 border border-amber-500/50 rounded-xl p-4 flex items-start gap-3 text-amber-200 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-extrabold text-amber-300">
              ⚠ Low confidence job detection.
            </p>
            <p>
              Detected: <span className="font-bold underline">{jobType}</span>. Please verify or change the job role before continuing to wage calculation.
            </p>
          </div>
        </div>
      )}

      {/* Extracted Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>Job Type</span>
          </div>
          <p className="text-lg font-black text-white truncate">
            {jobType}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Hours</span>
          </div>
          <p className="text-lg font-black text-white">
            {hoursWorked} <span className="text-sm font-semibold text-slate-400">hrs</span>
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Location</span>
          </div>
          <p className="text-lg font-black text-white truncate">
            {location}
          </p>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onConfirm && onConfirm(jobType)}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
        >
          <CheckCircle className="w-5 h-5" />
          Confirm Job Type
        </button>

        <button
          type="button"
          onClick={() => onEdit && onEdit()}
          className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Edit3 className="w-4 h-4" />
          Edit Job Type
        </button>
      </div>

    </div>
  );
}
