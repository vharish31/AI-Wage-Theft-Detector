import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

export default function RiskMeter({ riskScore = 0, riskLevel = 'Low' }) {
  // Normalize risk score between 0 and 100
  const score = Math.min(100, Math.max(0, parseFloat(riskScore) || 0));

  const getTheme = () => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-rose-500',
          text: 'text-rose-400',
          border: 'border-rose-500/40',
          badgeBg: 'bg-rose-500/10',
          gradient: 'from-rose-500 to-red-600',
          icon: AlertOctagon,
          desc: 'Critical Wage Theft (>50% underpayment). Urgent legal action recommended.'
        };
      case 'high':
        return {
          bg: 'bg-orange-500',
          text: 'text-orange-400',
          border: 'border-orange-500/40',
          badgeBg: 'bg-orange-500/10',
          gradient: 'from-orange-500 to-amber-600',
          icon: AlertTriangle,
          desc: 'High Underpayment Risk (25-50% withheld). Formal complaint advised.'
        };
      case 'medium':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-400',
          border: 'border-amber-500/40',
          badgeBg: 'bg-amber-500/10',
          gradient: 'from-amber-400 to-yellow-500',
          icon: Info,
          desc: 'Moderate Discrepancy (10-25% underpayment). Check wage agreement details.'
        };
      default:
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-400',
          border: 'border-emerald-500/40',
          badgeBg: 'bg-emerald-500/10',
          gradient: 'from-emerald-400 to-green-500',
          icon: ShieldCheck,
          desc: 'Low Risk (0-10%). Payment aligns closely with statutory rates.'
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <div className={`glass-card rounded-2xl p-6 border ${theme.border} relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-6 h-6 ${theme.text}`} />
          <h3 className="text-lg font-bold text-white">Wage Theft Risk Meter</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${theme.badgeBg} ${theme.text} border ${theme.border}`}>
          {riskLevel.toUpperCase()} RISK LEVEL
        </div>
      </div>

      {/* Numerical Risk Score Gauge Display */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className={`text-4xl font-extrabold tracking-tight ${theme.text}`}>
          {score.toFixed(1)}%
        </span>
        <span className="text-sm font-medium text-slate-400">
          underpayment risk score
        </span>
      </div>

      {/* Animated Visual Progress Gauge Bar */}
      <div className="relative w-full h-4 bg-slate-900 rounded-full overflow-hidden mb-4 border border-slate-800">
        {/* Background gradient track */}
        <div
          className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-1000 ease-out rounded-full shadow-lg`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Meter Scale Markers */}
      <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-4 px-1">
        <span className="text-emerald-400">0% Low</span>
        <span className="text-amber-400">10% Med</span>
        <span className="text-orange-400">25% High</span>
        <span className="text-rose-400">50%+ Critical</span>
      </div>

      {/* Description Box */}
      <div className={`p-3 rounded-xl ${theme.badgeBg} border ${theme.border} text-xs font-medium text-slate-200 flex items-start gap-2.5`}>
        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${theme.text}`} />
        <span>{theme.desc}</span>
      </div>
    </div>
  );
}
