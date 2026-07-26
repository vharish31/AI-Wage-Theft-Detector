import React, { useState } from 'react';
import { Gift, Plus, Trash2, Sparkles } from 'lucide-react';
import { BONUS_TYPES } from '../utils/compensationCalculator';

export default function BonusEntryForm({ bonuses, setBonuses }) {
  const [bonusType, setBonusType] = useState('Attendance Bonus');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleAddBonus = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const newBonus = {
      id: `bonus-${Date.now()}`,
      bonus_type: bonusType,
      amount: parseFloat(amount),
      description: description || bonusType
    };

    setBonuses([...bonuses, newBonus]);
    setAmount('');
    setDescription('');
  };

  const handleRemoveBonus = (id) => {
    setBonuses(bonuses.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Gift className="w-3.5 h-3.5 text-amber-400" />
          Employer Bonuses & Performance Incentives
        </label>
        <span className="text-[10px] text-amber-400 font-bold">
          {bonuses.length} Added
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          value={bonusType}
          onChange={(e) => setBonusType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-cyan-500"
        >
          {BONUS_TYPES.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          placeholder="Bonus Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
        />

        <button
          type="button"
          onClick={handleAddBonus}
          className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs border border-amber-500/40 flex items-center justify-center gap-1 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Bonus
        </button>
      </div>

      {/* Added List */}
      {bonuses.length > 0 && (
        <div className="space-y-1.5 pt-2">
          {bonuses.map((b) => (
            <div key={b.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="font-semibold text-slate-200">{b.bonus_type}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-amber-400">+₹{b.amount.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBonus(b.id)}
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
