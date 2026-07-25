import React from 'react';
import { IndianRupee, Briefcase, Clock, ShieldAlert, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';

/**
 * JobSummary Component
 * Summary card for daily combined multi-job audit totals.
 */
export default function JobSummary({ summary }) {
  if (!summary) return null;

  const {
    total_jobs = 1,
    total_hours_worked = 8.0,
    total_expected_wage = 0.0,
    total_received_amount = 0.0,
    total_difference = 0.0,
    overall_risk_level = 'Low',
    highest_underpayment_job = null,
    is_underpaid = false
  } = summary;

  const riskBadgeStyles = {
    Critical: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
    High: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
    Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    Low: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    'No Issue': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  };

  const badgeClass = riskBadgeStyles[overall_risk_level] || riskBadgeStyles.Low;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-700 bg-slate-900/90 shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Combined Daily Workday Summary
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            {total_jobs} Jobs Performed Today ({total_hours_worked} Hours)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${badgeClass}`}>
            {is_underpaid ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            Severity: {overall_risk_level} Risk
          </span>
        </div>
      </div>

      {/* Financial Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Total Jobs */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider block text-slate-400">Total Jobs</span>
          <span className="text-2xl font-black text-white flex items-center gap-1.5 mt-1">
            <Briefcase className="w-5 h-5 text-cyan-400" /> {total_jobs} Shifts
          </span>
        </div>

        {/* Total Expected Wage */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider block text-slate-400">Statutory Entitlement</span>
          <span className="text-2xl font-black text-cyan-300 flex items-center gap-0.5 mt-1">
            <IndianRupee className="w-5 h-5 text-cyan-400" /> {total_expected_wage.toFixed(2)}
          </span>
        </div>

        {/* Total Received Amount */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider block text-slate-400">Total Received</span>
          <span className="text-2xl font-black text-emerald-300 flex items-center gap-0.5 mt-1">
            <IndianRupee className="w-5 h-5 text-emerald-400" /> {total_received_amount.toFixed(2)}
          </span>
        </div>

        {/* Total Difference / Shortfall */}
        <div className={`p-4 rounded-xl border ${is_underpaid ? 'bg-rose-950/40 border-rose-500/40' : 'bg-emerald-950/40 border-emerald-500/40'}`}>
          <span className={`text-xs font-bold uppercase tracking-wider block ${is_underpaid ? 'text-rose-300' : 'text-emerald-300'}`}>
            {is_underpaid ? 'Total Wage Theft' : 'Surplus Earnings'}
          </span>
          <span className={`text-2xl font-black flex items-center gap-0.5 mt-1 ${is_underpaid ? 'text-rose-400' : 'text-emerald-400'}`}>
            <IndianRupee className="w-5 h-5" /> {total_difference.toFixed(2)}
          </span>
        </div>

      </div>

      {highest_underpayment_job && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Highest Wage Theft Detected on: <strong className="text-white font-extrabold">{highest_underpayment_job}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
