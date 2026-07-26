import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mic, 
  FileText, 
  IndianRupee, 
  ShieldAlert, 
  Clock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Gift, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  Download, 
  Building2, 
  MapPin, 
  Briefcase 
} from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();

  // Sample recent shift logs for comprehensive dashboard coverage
  const recentShifts = [
    {
      id: 'shift-101',
      date: 'Today, 26 Jul 2026',
      job_type: 'Construction Worker',
      location: 'Chennai, TN',
      hours_worked: 8.0,
      base_wage: 600.0,
      bonuses: 250.0,
      expected_minimum: 855.0,
      shortfall: 255.0,
      risk_level: 'High Risk',
      status: 'Underpaid'
    },
    {
      id: 'shift-102',
      date: 'Yesterday, 25 Jul 2026',
      job_type: 'Painter',
      location: 'Chennai, TN',
      hours_worked: 8.0,
      base_wage: 700.0,
      bonuses: 200.0,
      expected_minimum: 900.0,
      shortfall: 200.0,
      risk_level: 'Medium Risk',
      status: 'Underpaid'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 sm:py-8 animate-fadeIn">
      
      {/* 1. WELCOME HERO BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-cyan-950/50 border border-slate-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden section-glow">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-extrabold tracking-wide uppercase">
            <User className="w-3.5 h-3.5" /> WORKER PROTECTION PORTAL
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{user?.name || 'Worker'}</span>!
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Monitor shift logs, audit statutory minimum wage entitlements, review employer bonus compliance, and generate formal legal complaints under Minimum Wages Act, 1948.
          </p>
        </div>


      </div>

      {/* 2. THE 5 CORE METRIC & STAT CARDS (EXPANDED FULL-PAGE GRID COVERAGE) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Overview & Wage Audit Summary</span>
          </h2>
          <span className="text-xs text-slate-400 font-semibold">Updated for Current Wage Cycle</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Today's Work Logs */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 shadow-xl space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Today's Work Logs</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white flex items-center gap-2">
                <span>2 Shifts</span>
              </div>
              <p className="text-xs font-semibold text-cyan-400 mt-1">8.0 hrs recorded today</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Status: <strong className="text-emerald-400">Verified</strong></span>
              <Link to="/voice-log" className="text-cyan-400 font-bold hover:underline">Add Shift →</Link>
            </div>
          </div>

          {/* Card 2: Bonuses & Allowances */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 shadow-xl space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">Bonuses & Allowances</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gift className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-300 flex items-center gap-1 font-mono">
                <IndianRupee className="w-5 h-5" />
                <span>450.00</span>
              </div>
              <p className="text-xs font-semibold text-amber-400/90 mt-1">Attendance & Travel Allowances</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Included Extra</span>
              <span className="text-amber-300 font-bold">+₹250 Travel</span>
            </div>
          </div>

          {/* Card 3: Base Wage Shortfall */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-rose-500/40 bg-rose-950/10 hover:border-rose-500/70 transition-all duration-300 shadow-xl space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">Base Wage Shortfall</span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-rose-400 flex items-center gap-1 font-mono">
                <IndianRupee className="w-5 h-5" />
                <span>455.00</span>
              </div>
              <p className="text-xs font-semibold text-rose-300/90 mt-1">Statutory Underpayment Identified</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Action: <strong className="text-rose-400">File Complaint</strong></span>
              <Link to="/report" className="text-rose-400 font-bold hover:underline">View Report →</Link>
            </div>
          </div>

          {/* Card 4: Total Compensation */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 shadow-xl space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">Total Compensation</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-300 flex items-center gap-1 font-mono">
                <IndianRupee className="w-5 h-5" />
                <span>1,650.00</span>
              </div>
              <p className="text-xs font-semibold text-emerald-400/90 mt-1">Base Wage + Allowances Payout</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Package Total</span>
              <span className="text-emerald-400 font-bold">100% Calculated</span>
            </div>
          </div>

          {/* Card 5: Complaints Generated */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 shadow-xl space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400">Complaints Generated</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white flex items-center gap-2">
                <span>2 Letters</span>
              </div>
              <p className="text-xs font-semibold text-blue-300 mt-1">Ready for Regional Labor Inspector</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Legal Basis</span>
              <span className="text-cyan-400 font-bold">Act of 1948</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. VERIFICATION HISTORY LINK & WORKER PROTECTION SECTION (FULL WIDTH) */}
      <div className="space-y-6">
        
        {/* Full-Width: History Gateway & Statutory Compliance */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl section-glow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                Wage Verification & Audit Records
              </h3>
              <p className="text-xs text-slate-400">All detailed audit logs are organized in your dedicated History tab.</p>
            </div>

            <Link
              to="/history"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <span>Open Verification History</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Centralized Audit Archive</h4>
                <p className="text-xs text-slate-400">View, search, filter, and download legal PDF reports for every verification in the History tab.</p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300 border-t border-slate-800/80">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Payslip Extractions</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multilingual Voice Logs</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Gig Platform Audits</span>
            </div>
          </div>
        </div>

        {/* Legal Rights Notice */}
        <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-2 flex items-start gap-3 section-glow">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold text-amber-300 block">Statutory Protection under Section 12, Minimum Wages Act 1948</span>
            <p className="text-slate-400 leading-relaxed">
              Employer allowances, transport bonuses, and voluntary tips are extra incentives. Under Indian labor statutory regulations, contractor deductions cannot legally reduce your base wage below the government minimum rate.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
