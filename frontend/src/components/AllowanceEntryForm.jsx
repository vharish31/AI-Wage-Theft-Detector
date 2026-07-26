import React, { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { ALLOWANCE_TYPES } from '../utils/compensationCalculator';

export default function AllowanceEntryForm({ allowances, setAllowances }) {
  const [allowanceType, setAllowanceType] = useState('Travel Allowance');
  const [amount, setAmount] = useState('');

  const handleAddAllowance = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const newAllowance = {
      id: `allowance-${Date.now()}`,
      allowance_type: allowanceType,
      amount: parseFloat(amount),
      description: allowanceType
    };

    setAllowances([...allowances, newAllowance]);
    setAmount('');
  };

  const handleRemoveAllowance = (id) => {
    setAllowances(allowances.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          Allowances (Travel, Food, Night Shift, Hazard)
        </label>
        <span className="text-[10px] text-blue-400 font-bold">
          {allowances.length} Added
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          value={allowanceType}
          onChange={(e) => setAllowanceType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-cyan-500"
        >
          {ALLOWANCE_TYPES.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          placeholder="Allowance Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
        />

        <button
          type="button"
          onClick={handleAddAllowance}
          className="px-3 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-extrabold text-xs border border-blue-500/40 flex items-center justify-center gap-1 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Allowance
        </button>
      </div>

      {/* Added List */}
      {allowances.length > 0 && (
        <div className="space-y-1.5 pt-2">
          {allowances.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="font-semibold text-slate-200">{a.allowance_type}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-blue-400">+₹{a.amount.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAllowance(a.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
