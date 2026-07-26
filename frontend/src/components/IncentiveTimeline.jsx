import React from 'react';
import { Gift, MapPin, DollarSign, Briefcase } from 'lucide-react';

export default function IncentiveTimeline({ breakdown }) {
  if (!breakdown) return null;

  const base = breakdown.baseWage || 0;
  const bonuses = breakdown.bonusesList || [];
  const allowances = breakdown.allowancesList || [];
  const tips = breakdown.totalTips || 0;

  return (
    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
        <Gift className="w-4 h-4 text-amber-400" />
        Earnings & Incentive Accrual Timeline
      </h4>

      <div className="relative border-l-2 border-slate-800 ml-3 space-y-4 pl-4 text-xs">
        
        {/* Base Wage Milestone */}
        <div className="relative">
          <div className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-extrabold text-white">Base Daily Shift Wage</p>
              <p className="text-[10px] text-slate-400">Statutory minimum wage benchmark layer</p>
            </div>
            <span className="font-mono font-black text-cyan-400">₹{base.toFixed(2)}</span>
          </div>
        </div>

        {/* Bonuses Milestone */}
        {bonuses.map((b, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-900" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-amber-300">{b.bonus_type}</p>
                <p className="text-[10px] text-slate-400">{b.description || 'Employer incentive bonus'}</p>
              </div>
              <span className="font-mono font-bold text-amber-400">+₹{b.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}

        {/* Allowances Milestone */}
        {allowances.map((a, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-blue-400 border-2 border-slate-900" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-blue-300">{a.allowance_type}</p>
                <p className="text-[10px] text-slate-400">{a.description || 'Special workplace allowance'}</p>
              </div>
              <span className="font-mono font-bold text-blue-400">+₹{a.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}

        {/* Tips Milestone */}
        {tips > 0 && (
          <div className="relative">
            <div className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-300">Tips & Direct Grants</p>
                <p className="text-[10px] text-slate-400">Direct customer earnings</p>
              </div>
              <span className="font-mono font-bold text-emerald-400">+₹{tips.toFixed(2)}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
