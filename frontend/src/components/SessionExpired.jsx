import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

export default function SessionExpired() {
  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-fadeIn">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-2xl shadow-amber-950/50">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800">
          Session Expired
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Please Log In Again
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Your security session has expired or the token is no longer valid. Please sign in with your credentials to resume.
        </p>
      </div>

      <div className="pt-2">
        <Link
          to="/login"
          replace
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-950/50 inline-flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" /> Go to Login Screen
        </Link>
      </div>
    </div>
  );
}
