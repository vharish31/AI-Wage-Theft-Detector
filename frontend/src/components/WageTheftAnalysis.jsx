import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  IndianRupee, 
  Sparkles, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle2, 
  Info,
  Clock,
  PackageCheck
} from 'lucide-react';

export default function WageTheftAnalysis({ analysisData }) {
  // Sample fallback data matching prompt specifications if prop not provided
  const data = analysisData || {
    expectedPay: 1075,
    actualPay: 850,
    wageTheftAmount: 225,
    wageTheftPercentage: 20.93,
    riskLevel: 'Medium Risk',
    confidenceScore: 94,
    confidenceLevel: 'High Confidence',
    status: 'Possible Wage Theft',
    calculationMethod: 'Delivery Orders (25) × Rate (₹35) + Incentives (₹200)'
  };

  const isTheft = data.wageTheftAmount > 0;

  const getRiskBadgeStyle = (riskLevel) => {
    switch ((riskLevel || '').toLowerCase()) {
      case 'high risk':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'medium risk':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'low risk':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-6 relative overflow-hidden shadow-2xl">
      
      {/* Top Header & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
            isTheft ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            {isTheft ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              AI Wage Theft Analysis
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Audited via Engine Standard v2.0 • {data.calculationMethod || 'Standard Analysis'}
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border ${
          isTheft 
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-500/10' 
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        }`}>
          {data.status || (isTheft ? 'Possible Wage Theft' : 'No Wage Theft')}
        </div>
      </div>

      {/* Grid Display: Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Expected Pay */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
            Expected Pay
          </span>
          <div className="text-2xl font-black text-white flex items-center gap-0.5">
            <IndianRupee className="w-5 h-5 text-cyan-400" />
            {data.expectedPay?.toLocaleString('en-IN') || 0}
          </div>
          <span className="text-[11px] text-slate-500 block">Calculated benchmark</span>
        </div>

        {/* Actual Pay */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
            Actual Pay
          </span>
          <div className="text-2xl font-black text-cyan-300 flex items-center gap-0.5">
            <IndianRupee className="w-5 h-5 text-cyan-400" />
            {data.actualPay?.toLocaleString('en-IN') || 0}
          </div>
          <span className="text-[11px] text-slate-500 block">Received payout</span>
        </div>

        {/* Wage Theft Amount */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-rose-500/30 space-y-1">
          <span className="text-xs font-semibold text-rose-400 block uppercase tracking-wider">
            Wage Theft
          </span>
          <div className="text-2xl font-black text-rose-400 flex items-center gap-0.5">
            <IndianRupee className="w-5 h-5" />
            {data.wageTheftAmount?.toLocaleString('en-IN') || 0}
          </div>
          <span className="text-[11px] text-rose-300/80 block">Uncollected shortfall</span>
        </div>

        {/* Wage Theft % */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-amber-500/30 space-y-1">
          <span className="text-xs font-semibold text-amber-400 block uppercase tracking-wider">
            Wage Theft %
          </span>
          <div className="text-2xl font-black text-amber-300 flex items-center gap-0.5">
            <TrendingDown className="w-5 h-5" />
            {data.wageTheftPercentage || 0}%
          </div>
          <span className="text-[11px] text-amber-400/80 block">Percentage withheld</span>
        </div>

      </div>

      {/* Risk Level & Confidence Score Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
        
        {/* Risk Level */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Risk Level:
          </span>
          <span className={`px-3 py-1 rounded-lg text-xs font-extrabold border ${getRiskBadgeStyle(data.riskLevel)}`}>
            {data.riskLevel || 'No Issue'}
          </span>
        </div>

        {/* Confidence Score */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" /> AI Confidence:
          </span>
          <span className="text-xs font-black text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
            {data.confidenceScore || 94}% ({data.confidenceLevel || 'High Confidence'})
          </span>
        </div>

      </div>

      {/* Breakdown Note */}
      {data.voiceMismatch && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Voice Mismatch Detected:</span> Worker completed {data.voiceMismatch.hoursWorked} hours but was credited for only {data.voiceMismatch.hoursPaid} hours. Unpaid shift loss: ₹{data.voiceMismatch.missingPay}.
          </div>
        </div>
      )}

    </div>
  );
}
