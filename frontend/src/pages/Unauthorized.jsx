import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-2xl shadow-rose-950/50">
        <Lock className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-rose-400 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800">
          403 Access Forbidden
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Unauthorized Access
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          You do not have administrative permissions to view the Admin Dashboard. Only authorized system administrators can access this area.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/dashboard"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-950/50 inline-flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to User Dashboard
        </Link>
        <Link
          to="/login"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 inline-flex items-center justify-center gap-2"
        >
          Switch Account
        </Link>
      </div>
    </div>
  );
}
