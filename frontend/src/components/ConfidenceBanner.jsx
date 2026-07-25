import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * ConfidenceBanner Component
 * Displays a warning banner if AI confidence is below 80% (0.80).
 */
export default function ConfidenceBanner({ confidence = 1.0 }) {
  // Show banner ONLY if confidence < 80% (0.80)
  if (confidence >= 0.80) {
    return null;
  }

  const confidencePct = Math.round(confidence * 100);

  return (
    <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 text-amber-200 shadow-lg shadow-amber-500/10 mb-4 animate-fade-in">
      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-300 text-sm">
            Low Estimation Confidence ({confidencePct}%)
          </span>
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed">
          ⚠️ We could not confidently estimate your working hours. Please review before continuing.
        </p>
      </div>
    </div>
  );
}
