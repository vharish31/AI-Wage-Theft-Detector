import React from 'react';
import { CheckCircle2, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function ProcessFlowStepper({ title, steps, activeStepIndex, isProcessing }) {
  if (!isProcessing && activeStepIndex === undefined) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 space-y-4 animate-fade-in shadow-2xl relative overflow-hidden my-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
          <h4 className="text-sm font-extrabold text-white tracking-wide uppercase">
            {title || 'AI Engine Live Processing Flow'}
          </h4>
        </div>
        <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          Live AI Execution
        </span>
      </div>

      {/* Horizontal Steps Stepper Line */}
      <div className="relative pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
          {steps.map((step, index) => {
            const isDone = index < activeStepIndex;
            const isActive = index === activeStepIndex;
            const isPending = index > activeStepIndex;

            return (
              <div 
                key={index} 
                className={`p-3.5 rounded-xl border transition-all duration-500 flex items-start gap-3 ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-500/20' 
                    : isDone 
                    ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                {/* Icon Badge */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                  isDone 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : isActive 
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 animate-pulse' 
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step Details */}
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-bold truncate ${
                      isActive ? 'text-cyan-300' : isDone ? 'text-white' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
