import React from 'react';
import { IndianRupee, Gift, MapPin, Sparkles, AlertTriangle, CheckCircle2, DollarSign, PieChart } from 'lucide-react';

export default function CompensationBreakdownCard({ breakdown, minimumWage }) {
  if (!breakdown) return null;

  const base = breakdown.baseWage || 0;
  const minWage = Number(minimumWage) || 0;
  const isCompliant = base >= minWage;
  const shortfall = Math.max(0, minWage - base);

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Itemized Compensation Breakdown</h3>
            <p className="text-xs text-slate-400">Statutory minimum wage evaluation under Code on Wages, 2019</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
          isCompliant
            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
            : 'bg-rose-950 text-rose-300 border-rose-700'
        }`}>
          {isCompliant ? '🟢 Statutory Base Met' : '🔴 Base Wage Underpaid'}
        </span>
      </div>

      {/* Itemized Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
        
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Base Wage</span>
          <p className="font-mono font-black text-cyan-400 text-sm">₹{base.toFixed(2)}</p>
          <span className="text-[9px] text-slate-500">Statutory Core</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Bonuses</span>
          <p className="font-mono font-bold text-amber-400 text-sm">+₹{(breakdown.totalBonuses || 0).toFixed(2)}</p>
          <span className="text-[9px] text-slate-500">Attendance/Festival</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Allowances</span>
          <p className="font-mono font-bold text-blue-400 text-sm">+₹{(breakdown.totalAllowances || 0).toFixed(2)}</p>
          <span className="text-[9px] text-slate-500">Travel/Food/Shift</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Tips & Commissions</span>
          <p className="font-mono font-bold text-emerald-400 text-sm">+₹{((breakdown.totalTips || 0) + (breakdown.totalCommissions || 0)).toFixed(2)}</p>
          <span className="text-[9px] text-slate-500">Grants/Direct</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Deductions</span>
          <p className="font-mono font-bold text-rose-400 text-sm">-₹{(breakdown.totalDeductions || 0).toFixed(2)}</p>
          <span className="text-[9px] text-slate-500">PF/Advance/Fine</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/40 bg-cyan-950/20 space-y-1">
          <span className="text-[10px] uppercase font-bold text-cyan-300 block">Total Compensation</span>
          <p className="font-mono font-black text-white text-base">₹{(breakdown.totalCompensation || 0).toFixed(2)}</p>
          <span className="text-[9px] text-cyan-400/80">Full Package</span>
        </div>

      </div>

      {/* Statutory Legal Warning Box */}
      {!isCompliant && (
        <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-xs space-y-1 text-rose-200">
          <div className="flex items-center gap-1.5 font-extrabold text-rose-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Statutory Non-Substitution Rule Warning (Code on Wages, 2019)</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-200">
            Base Wage (₹{base.toFixed(2)}) is <strong className="text-rose-400 font-mono">₹{shortfall.toFixed(2)} below</strong> statutory minimum wage (₹{minWage.toFixed(2)}). Under Indian labor law, bonuses (₹{breakdown.totalBonuses}) and allowances (₹{breakdown.totalAllowances}) <strong className="text-white">cannot replace or compensate</strong> for a shortfall in the statutory minimum base wage.
          </p>
        </div>
      )}

    </div>
  );
}
