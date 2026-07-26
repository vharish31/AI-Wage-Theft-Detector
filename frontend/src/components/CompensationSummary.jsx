import React from 'react';
import { IndianRupee, ShieldCheck, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { validateBaseWageCompliance } from '../utils/compensationCalculator';

export default function CompensationSummary({ baseWage, minimumWage, totalCompensation }) {
  const base = Number(baseWage) || 0;
  const minWage = Number(minimumWage) || 0;
  const total = Number(totalCompensation) || base;

  const { isCompliant, shortfall, reasoning } = validateBaseWageCompliance(base, minWage, total);

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Statutory Minimum Wage Validation (Code on Wages, 2019)
        </h3>

        <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
          isCompliant
            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
            : 'bg-rose-950 text-rose-300 border-rose-700'
        }`}>
          {isCompliant ? '🟢 Statutory Wage Met' : '🔴 Wage Theft Flagged'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Govt Minimum Wage</span>
          <p className="text-lg font-black text-cyan-400 font-mono">₹{minWage.toFixed(2)}</p>
          <span className="text-[9px] text-slate-500">Statutory Benchmark</span>
        </div>

        <div className={`p-3.5 rounded-2xl border space-y-1 ${
          isCompliant ? 'bg-slate-950 border-slate-800' : 'bg-rose-950/20 border-rose-500/40'
        }`}>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Base Wage Evaluated</span>
          <p className={`text-lg font-black font-mono ${isCompliant ? 'text-white' : 'text-rose-400'}`}>
            ₹{base.toFixed(2)}
          </p>
          <span className="text-[9px] text-slate-400">
            {isCompliant ? 'Satisfies minimum wage' : `Shortfall: -₹${shortfall.toFixed(2)}`}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 bg-emerald-950/10 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Total Compensation</span>
          <p className="text-lg font-black text-emerald-300 font-mono">₹{total.toFixed(2)}</p>
          <span className="text-[9px] text-emerald-400/80">Base + Incentives</span>
        </div>

      </div>

      <div className={`p-3.5 rounded-2xl text-xs space-y-1 ${
        isCompliant
          ? 'bg-slate-950 border border-slate-800 text-slate-300'
          : 'bg-rose-950/40 border border-rose-500/40 text-rose-200'
      }`}>
        <p className="leading-relaxed text-[11px] font-medium flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
          <span>{reasoning}</span>
        </p>
      </div>
    </div>
  );
}
