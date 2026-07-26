import React from 'react';
import { DollarSign, Percent, MinusCircle } from 'lucide-react';

export default function TipsEntryForm({ tips, setTips, commissions, setCommissions, deductions, setDeductions }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
      
      <div>
        <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-1">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Tips Received (₹)
        </label>
        <input
          type="number"
          min="0"
          placeholder="0.00"
          value={tips}
          onChange={(e) => setTips(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-1">
          <Percent className="w-3.5 h-3.5 text-cyan-400" /> Sales Commission (₹)
        </label>
        <input
          type="number"
          min="0"
          placeholder="0.00"
          value={commissions}
          onChange={(e) => setCommissions(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-1">
          <MinusCircle className="w-3.5 h-3.5 text-rose-400" /> Deductions / Advances (₹)
        </label>
        <input
          type="number"
          min="0"
          placeholder="0.00"
          value={deductions}
          onChange={(e) => setDeductions(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
        />
      </div>

    </div>
  );
}
