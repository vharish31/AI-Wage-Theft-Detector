import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mic, FileText, IndianRupee, ShieldAlert, Clock, User, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-extrabold">
            <User className="w-3.5 h-3.5" /> WORKER DASHBOARD
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome Back, <span className="text-cyan-400">{user?.name || 'Worker'}</span>!
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Track daily work shifts, record voice logs, audit minimum wage entitlements, and generate legal complaint letters against wage theft.
          </p>
        </div>

        {/* Start Voice Recording CTA */}
        <Link
          to="/voice-log"
          className="px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-950/80 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shrink-0"
        >
          <Mic className="w-5 h-5 text-white animate-pulse" />
          <span>Record New Work Log</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* OVERVIEW STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Today's Work Logs</span>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> 2 Shifts
          </div>
          <p className="text-[10px] text-slate-500">8.0 hrs recorded today</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">Pending Verification</span>
          <div className="text-2xl font-black text-amber-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> 1 Report
          </div>
          <p className="text-[10px] text-slate-500">Awaiting payout entry</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 bg-rose-950/10 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block">Total Wage Shortfall</span>
          <div className="text-2xl font-black text-rose-400 flex items-center gap-1 font-mono">
            <IndianRupee className="w-5 h-5" /> 455.00
          </div>
          <p className="text-[10px] text-slate-400">Unpaid wages detected</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">Complaints Generated</span>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" /> 2 Letters
          </div>
          <p className="text-[10px] text-slate-500">Ready for Labor Board</p>
        </div>

      </div>

      {/* QUICK WORKFLOW NAVIGATION */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Link
          to="/voice-log"
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">Voice Recording</h3>
              <p className="text-[11px] text-slate-400">Speak work shift details</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400" />
        </Link>

        <Link
          to="/verification"
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">Payment Verification</h3>
              <p className="text-[11px] text-slate-400">Hourly & Gig per-order mode</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400" />
        </Link>

        <Link
          to="/profile"
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">My Profile Settings</h3>
              <p className="text-[11px] text-slate-400">Update state, phone & name</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400" />
        </Link>

      </div>

    </div>
  );
}
