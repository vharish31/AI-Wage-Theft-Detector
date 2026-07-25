import React from 'react';
import { Sparkles, IndianRupee, ArrowRight, Check } from 'lucide-react';

/**
 * AmountSuggestionCard Component
 * Displays AI suggestion card (e.g. "Did you mean ₹600?") when a typo is detected.
 */
export default function AmountSuggestionCard({ originalAmount, suggestedAmount, onAcceptSuggestion }) {
  if (!suggestedAmount || suggestedAmount === originalAmount) {
    return null;
  }

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-slate-950 border border-cyan-500/40 shadow-xl space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
          AI Smart Typo Suggestion
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
        <div>
          <p className="text-sm font-medium text-slate-200">
            Entered <span className="font-mono text-rose-400 line-through font-bold">₹{originalAmount}</span>. Did you mean <span className="font-extrabold text-cyan-300 text-base">₹{suggestedAmount}</span>?
          </p>
          <span className="text-xs text-slate-400 block pt-0.5">
            Corrects extra/missing zero or repeated digit typing mistakes.
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAcceptSuggestion(suggestedAmount)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Check className="w-4 h-4 text-slate-950" />
          Use ₹{suggestedAmount}
        </button>
      </div>
    </div>
  );
}
