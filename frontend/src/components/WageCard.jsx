import React from 'react';
import { Briefcase, Clock, MapPin, IndianRupee, ShieldCheck } from 'lucide-react';

export default function WageCard({ jobType, hoursWorked, location, benchmarkWage }) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-cyan-500/20 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase">
            Extracted Work Record
          </h3>
        </div>
        <span className="bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-cyan-500/20">
          AI Verified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Job Type Card */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Job Role</span>
            <span className="text-base font-bold text-white">{jobType || 'Construction Worker'}</span>
          </div>
        </div>

        {/* Hours Worked Card */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Hours Worked</span>
            <span className="text-base font-bold text-white">{hoursWorked || 8} Hours</span>
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Location</span>
            <span className="text-base font-bold text-white">{location || 'Chennai'}</span>
          </div>
        </div>
      </div>

      {benchmarkWage && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Statutory Benchmark Minimum Wage:</span>
          <span className="text-cyan-300 font-bold flex items-center gap-0.5">
            <IndianRupee className="w-3.5 h-3.5" />
            {benchmarkWage} / day
          </span>
        </div>
      )}
    </div>
  );
}
