import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

/**
 * PaymentWarning Component
 * Renders color-coded warning banners based on warning level:
 * - NORMAL (Green): Payment appears valid.
 * - MEDIUM (Yellow): Please verify payment amount.
 * - HIGH / REJECT (Red): Possible typing mistake or rejection detected.
 */
export default function PaymentWarning({ warningLevel = 'NORMAL', message = '' }) {
  if (warningLevel === 'NORMAL' && !message) {
    return null;
  }

  const levelConfigs = {
    NORMAL: {
      bgColor: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200',
      iconColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: 'Payment Appears Valid',
      icon: CheckCircle2
    },
    MEDIUM: {
      bgColor: 'bg-amber-950/40 border-amber-500/40 text-amber-200',
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: 'Verification Suggested',
      icon: AlertTriangle
    },
    HIGH: {
      bgColor: 'bg-rose-950/50 border-rose-500/50 text-rose-200',
      iconColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      title: 'Possible Typing Error Detected',
      icon: ShieldAlert
    },
    REJECT: {
      bgColor: 'bg-red-950/70 border-red-500 text-red-100',
      iconColor: 'text-red-400',
      badgeBg: 'bg-red-500/30 text-red-200 border-red-500/50',
      title: 'Invalid Payment Amount',
      icon: AlertCircle
    }
  };

  const config = levelConfigs[warningLevel] || levelConfigs.NORMAL;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-lg transition-all ${config.bgColor} mb-4`}>
      <div className={`w-8 h-8 rounded-lg bg-slate-900/60 flex items-center justify-center shrink-0 mt-0.5 ${config.iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badgeBg}`}>
            {config.title}
          </span>
        </div>
        <p className="text-xs font-medium leading-relaxed pt-0.5">
          {message || 'Payment value within statutory expectations.'}
        </p>
      </div>
    </div>
  );
}
