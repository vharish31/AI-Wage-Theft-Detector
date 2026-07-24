import React from 'react';
import { CheckCircle2, Loader2, Sparkles, Activity, ShieldCheck, MapPin } from 'lucide-react';

export default function ProcessFlowStepper({ title, steps = [], activeStepIndex = 0, isProcessing }) {
  if (!isProcessing && activeStepIndex === undefined) return null;

  // Calculate percentage progress for tracking line connector
  const totalSteps = steps.length || 3;
  const progressPercent = Math.min(100, Math.max(0, (activeStepIndex / (totalSteps - 1)) * 100));

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-7 border border-cyan-500/40 space-y-6 animate-fade-in shadow-2xl relative overflow-hidden my-6 bg-slate-950/80">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tracking Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10">
            <Activity className="w-5 h-5 animate-pulse text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block">
              LIVE TRACKING LINK SYSTEM
            </span>
            <h4 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              {title || 'AI Engine Execution Tracking'}
            </h4>
          </div>
        </div>
      </div>


      {/* Tracking Timeline Container */}
      <div className="relative px-2 sm:px-6 pt-2 pb-2">
        
        {/* Continuous Horizontal Tracking Progress Line */}
        <div className="hidden sm:block absolute top-9 left-12 right-12 h-1.5 bg-slate-800/90 rounded-full overflow-hidden z-0">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 rounded-full transition-all duration-700 ease-out shadow-lg shadow-cyan-500/50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Tracking Milestone Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
          {steps.map((step, index) => {
            const isDone = index < activeStepIndex;
            const isActive = index === activeStepIndex;
            const isPending = index > activeStepIndex;

            return (
              <div key={index} className="flex flex-col items-center text-center space-y-3 group">
                
                {/* Milestone Node Badge Pin */}
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 ${
                    isDone
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20'
                      : isActive
                      ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/40 ring-8 ring-cyan-500/20 animate-pulse scale-110'
                      : 'bg-slate-900 text-slate-500 border border-slate-700 shadow-inner'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-slate-950 stroke-[2.5]" />
                  ) : isActive ? (
                    <Loader2 className="w-6 h-6 animate-spin text-slate-950 stroke-[2.5]" />
                  ) : (
                    <span className="text-sm font-black">{index + 1}</span>
                  )}
                </div>

                {/* Step Tracking Card */}
                <div 
                  className={`w-full p-4 rounded-xl border transition-all duration-500 flex flex-col justify-between text-left relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-b from-cyan-950/90 via-slate-900 to-slate-950 border-cyan-400 shadow-2xl shadow-cyan-500/20 ring-2 ring-cyan-500/30 transform scale-[1.02]'
                      : isDone
                      ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-200 shadow-md'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
                  }`}
                >
                  {/* Status Tag Pill */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Phase {index + 1}
                    </span>
                    <span 
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {isDone ? 'Completed' : isActive ? 'Processing...' : 'Pending'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h5 
                      className={`text-sm font-extrabold tracking-tight truncate ${
                        isActive ? 'text-cyan-300' : isDone ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </h5>
                    <p className="text-xs text-slate-400 leading-snug">
                      {step.desc}
                    </p>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Footer Tracking Link Info Bar */}
      <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Statutory Gazette Minimum Wage Benchmark Engine</span>
        </div>
        <span className="font-mono text-[11px] text-cyan-400/80">
          TRACKING ID: WT-{Date.now().toString().slice(-6)}
        </span>
      </div>

    </div>
  );
}
