import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function LoadingScreen({ message = 'Verifying security session...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b1329] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 p-4">
      <div className="text-center space-y-4 animate-fadeIn">
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-950/90 mb-2">
          <ShieldCheck className="w-10 h-10 text-white animate-pulse" />
          <div className="absolute -inset-1 rounded-3xl bg-cyan-500/20 blur-md pointer-events-none" />
        </div>
        
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            AI Wage Theft Detector
          </h2>
          <p className="text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            {message}
          </p>
        </div>

        <div className="w-48 h-1.5 mx-auto bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </div>
  );
}
