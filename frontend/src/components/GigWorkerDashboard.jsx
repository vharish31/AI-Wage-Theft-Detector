import React from 'react';
import RiskMeter from './RiskMeter';
import { Package, IndianRupee, AlertTriangle, ShieldCheck, CheckCircle2, TrendingUp, TrendingDown, Gift, MinusCircle, FileText, Scale } from 'lucide-react';

export default function GigWorkerDashboard({ gigResult }) {
  if (!gigResult) return null;

  const {
    platform = 'Swiggy',
    task_type = 'Delivery',
    completed_tasks = 25,
    rate_per_task = 35,
    base_earnings = 875,
    total_bonuses = 0,
    total_tips = 0,
    gross_earnings = 875,
    total_deductions = 0,
    net_expected_payment = 875,
    actual_payment = 720,
    difference = 155,
    wage_theft_percentage = 17.7,
    risk_score = 17.7,
    risk_level = 'Medium',
    is_underpaid = true,
    working_hours = 8,
    effective_hourly_expected = 109.38,
    effective_hourly_received = 90.0,
    legal_ref = 'Code on Social Security, 2020 (Gig Workers Welfare Provisions)'
  } = gigResult;

  const isCritical = risk_level === 'Critical' || risk_level === 'High';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Primary Audit Summary Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Background glow Accent */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none ${is_underpaid ? 'bg-rose-500' : 'bg-cyan-500'}`} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950/60 shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {platform}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {completed_tasks} {task_type}s @ ₹{rate_per_task}/task
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
                Gig Payment Audit Breakdown
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
              is_underpaid
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
            }`}>
              {is_underpaid ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              <span>{is_underpaid ? `Wage Shortfall: ₹${difference}` : 'Full Payment Verified'}</span>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Base Earnings</p>
            <p className="text-xl font-extrabold text-white flex items-center">
              <IndianRupee className="w-4 h-4 text-slate-400 mr-0.5" />
              {base_earnings}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">{completed_tasks} × ₹{rate_per_task}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <p className="text-[10px] uppercase font-bold text-emerald-400 mb-1">Incentives & Tips</p>
            <p className="text-xl font-extrabold text-emerald-400 flex items-center">
              <IndianRupee className="w-4 h-4 text-emerald-400 mr-0.5" />
              {total_bonuses + total_tips}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Bonuses + Customer Tips</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <p className="text-[10px] uppercase font-bold text-rose-400 mb-1">Deductions</p>
            <p className="text-xl font-extrabold text-rose-400 flex items-center">
              <IndianRupee className="w-4 h-4 text-rose-400 mr-0.5" />
              {total_deductions}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Fuel / Platform Cut</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-blue-950/60 border border-cyan-500/40">
            <p className="text-[10px] uppercase font-bold text-cyan-400 mb-1">Net Expected</p>
            <p className="text-xl font-extrabold text-cyan-300 flex items-center">
              <IndianRupee className="w-4 h-4 text-cyan-400 mr-0.5" />
              {net_expected_payment}
            </p>
            <p className="text-[10px] text-cyan-400/70 mt-1">Gross - Deductions</p>
          </div>
        </div>

        {/* Audit Comparison Row */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Net Expected</span>
                <span className="text-lg font-bold text-white">₹{net_expected_payment}</span>
              </div>
              <span className="text-xl font-bold text-slate-600">vs</span>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Actual Received</span>
                <span className="text-lg font-bold text-slate-200">₹{actual_payment}</span>
              </div>
            </div>

            {/* Difference callout */}
            <div className="w-full sm:w-auto text-right">
              <span className="text-xs text-slate-400 block">Payout Discrepancy</span>
              <span className={`text-2xl font-black ${is_underpaid ? 'text-rose-400' : 'text-emerald-400'}`}>
                {is_underpaid ? `-₹${difference}` : '₹0.00'}
              </span>
              <span className="text-[11px] text-slate-500 block">
                ({wage_theft_percentage}% underpaid)
              </span>
            </div>
          </div>

          {/* Risk Meter Component */}
          <div className="pt-2 border-t border-slate-800/80">
            <RiskMeter score={risk_score} level={risk_level} />
          </div>
        </div>

        {/* Effective Hourly Comparison */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-cyan-400" />
            Effective Hourly Rate ({working_hours} hrs shift):
          </span>
          <span className="font-mono text-slate-200">
            Expected: <strong className="text-cyan-400">₹{effective_hourly_expected}/hr</strong> | Received: <strong className="text-slate-300">₹{effective_hourly_received}/hr</strong>
          </span>
        </div>

      </div>

      {/* Statutory Regulation Card */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
        <Scale className="w-5 h-5 text-cyan-400 shrink-0" />
        <div>
          <span className="font-bold text-white block">Applicable Gig Worker Regulations</span>
          <span className="text-slate-400">{legal_ref}</span>
        </div>
      </div>
    </div>
  );
}
