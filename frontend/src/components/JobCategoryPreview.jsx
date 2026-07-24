import React from 'react';
import { IndianRupee, Shield, ArrowRight, RotateCcw, Award, MapPin } from 'lucide-react';
import { getJobCategoryInfo } from '../utils/jobAliases';

export default function JobCategoryPreview({ jobType, location = 'Chennai', onContinue, onChangeJobType }) {
  const categoryInfo = getJobCategoryInfo(jobType, location);

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-emerald-500/40 relative overflow-hidden shadow-2xl animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              Validation Layer 5
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Wage Category Preview
            </h3>
          </div>
        </div>

        <span className="text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full">
          Statutory Gazette Benchmark
        </span>
      </div>

      {/* Preview Card Details */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-5 space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Standardized Job Type
            </span>
            <p className="text-lg font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              {categoryInfo.jobType}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Location & Jurisdiction
            </span>
            <p className="text-lg font-black text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              {categoryInfo.location} ({categoryInfo.state})
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">
            Statutory Wage Category
          </span>
          <p className="text-base font-extrabold text-cyan-300">
            {categoryInfo.wageCategory}
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              Expected Daily Wage Standard (8 hrs)
            </span>
            <span className="text-xs text-slate-400">
              {categoryInfo.legalActRef}
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400 flex items-center justify-end">
              <IndianRupee className="w-6 h-6" />
              {categoryInfo.expectedDailyWage}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              ₹{categoryInfo.expectedHourlyWage}/hr base
            </span>
          </div>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-95"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onChangeJobType}
          className="w-full sm:w-auto py-4 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Change Job Type
        </button>
      </div>

    </div>
  );
}
