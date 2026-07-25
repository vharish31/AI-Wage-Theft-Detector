import React from 'react';
import { AlertTriangle, IndianRupee, Edit3, ArrowRight, X } from 'lucide-react';

/**
 * PaymentConfirmationModal Component
 * Popup modal shown when high anomaly or typo is detected before proceeding.
 */
export default function PaymentConfirmationModal({
  isOpen,
  enteredAmount,
  expectedWage,
  suggestedAmount,
  warningMessage,
  onEditAmount,
  onContinueAnyway,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card max-w-md w-full rounded-2xl p-6 sm:p-8 border border-amber-500/50 bg-slate-900/95 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Top Close Icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Payment Verification Required
            </span>
            <h3 className="text-xl font-black text-white tracking-tight mt-0.5">
              Please Verify Payment Amount
            </h3>
          </div>
        </div>

        {/* Content Details */}
        <div className="space-y-3 py-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold uppercase">You Entered:</span>
              <span className="font-extrabold text-white text-base flex items-center gap-0.5">
                <IndianRupee className="w-4 h-4 text-amber-400" />{enteredAmount}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold uppercase">Statutory Expected Wage:</span>
              <span className="font-bold text-slate-200 flex items-center gap-0.5">
                <IndianRupee className="w-3.5 h-3.5 text-cyan-400" />{expectedWage}
              </span>
            </div>
            {suggestedAmount && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span className="text-cyan-400 font-bold uppercase">AI Suggested Amount:</span>
                <span className="font-extrabold text-cyan-300 flex items-center gap-0.5 text-sm">
                  <IndianRupee className="w-4 h-4" />{suggestedAmount}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
            {warningMessage || 'The payment amount differs significantly from standard statutory benchmark rates.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onEditAmount}
            className="w-full sm:flex-1 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all active:scale-95 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-cyan-400" />
            ✏ Edit Amount
          </button>

          <button
            type="button"
            onClick={onContinueAnyway}
            className="w-full sm:flex-1 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
          >
            Continue Anyway
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

      </div>
    </div>
  );
}
