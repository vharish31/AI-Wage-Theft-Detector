import React from 'react';
import { Check, X, Star } from 'lucide-react';

export default function MethodComparisonTable() {
  const tableRows = [
    { feature: 'Accuracy Level', payslip: '⭐⭐⭐⭐⭐', voice: '⭐⭐⭐⭐', manual: '⭐⭐⭐' },
    { feature: 'Verification Speed', payslip: '⭐⭐⭐⭐⭐', voice: '⭐⭐⭐⭐', manual: '⭐⭐⭐' },
    { feature: 'Automatic Extraction', payslip: true, voice: true, manual: false },
    { feature: 'Supports PDF Documents', payslip: true, voice: false, manual: false },
    { feature: 'Supports Photo Receipts (JPG/PNG)', payslip: true, voice: false, manual: false },
    { feature: 'Supports Local Spoken Languages', payslip: false, voice: true, manual: false },
    { feature: 'Editable Fields Before Audit', payslip: true, voice: true, manual: true },
    { feature: 'Best Suited For', payslip: 'Organized Employees', voice: 'Daily Wage Workers', manual: 'General Users' }
  ];

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Verification Method Comparison Table</h3>
          <p className="text-xs text-slate-400">Compare accuracy, speed, and capabilities across all verification pathways</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4 font-bold">Feature Capability</th>
              <th className="py-3 px-4 font-bold text-amber-400">📄 Upload Payslip</th>
              <th className="py-3 px-4 font-bold text-cyan-400">🎤 Voice Verification</th>
              <th className="py-3 px-4 font-bold text-slate-300">⌨ Manual Entry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {tableRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white">{row.feature}</td>
                
                <td className="py-3.5 px-4 font-bold">
                  {typeof row.payslip === 'boolean' ? (
                    row.payslip ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />
                  ) : (
                    <span className={row.feature === 'Best Suited For' ? 'text-amber-300 font-extrabold' : ''}>{row.payslip}</span>
                  )}
                </td>

                <td className="py-3.5 px-4 font-bold">
                  {typeof row.voice === 'boolean' ? (
                    row.voice ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />
                  ) : (
                    <span className={row.feature === 'Best Suited For' ? 'text-cyan-300 font-extrabold' : ''}>{row.voice}</span>
                  )}
                </td>

                <td className="py-3.5 px-4 font-bold">
                  {typeof row.manual === 'boolean' ? (
                    row.manual ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-600" />
                  ) : (
                    <span className={row.feature === 'Best Suited For' ? 'text-slate-300 font-extrabold' : ''}>{row.manual}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
