import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function VerificationCard({
  id,
  title,
  icon: Icon,
  badgeType,
  badgeReason,
  features,
  buttonText,
  isSelected,
  onCardClick,
  onButtonClick
}) {
  // Determine color themes for the 3 distinct verification methods
  const isPayslip = id === 'payslip';
  const isVoice = id === 'voice';

  let borderStyle = 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90';
  let iconStyle = 'bg-slate-800 text-slate-400 border-slate-700';
  let buttonStyle = 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-semibold';

  if (isSelected || isPayslip) {
    if (isPayslip) {
      borderStyle = 'bg-slate-900 border-amber-500 shadow-2xl shadow-amber-950/40 ring-2 ring-amber-500/50 scale-[1.01]';
      iconStyle = 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-inner';
      buttonStyle = 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/30 scale-[1.01]';
    } else if (isVoice) {
      borderStyle = isSelected
        ? 'bg-slate-900 border-cyan-500 shadow-2xl shadow-cyan-950/40 ring-2 ring-cyan-500/50 scale-[1.01]'
        : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900';
      iconStyle = isSelected
        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
        : 'bg-slate-800 text-cyan-400 border-slate-700';
      buttonStyle = isSelected
        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold shadow-lg shadow-cyan-500/30'
        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-semibold';
    }
  }

  return (
    <div
      onClick={onCardClick}
      className={`relative rounded-3xl p-6 sm:p-7 border backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 ${borderStyle}`}
    >
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${iconStyle}`}>
              {Icon && <Icon className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">{title}</h3>
            </div>
          </div>
        </div>

        {/* Features List */}
        <ul className="space-y-2.5 pt-2 text-xs">
          {features && features.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-slate-300 font-medium leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onButtonClick) {
            onButtonClick();
          }
        }}
        className={`w-full py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${buttonStyle}`}
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

    </div>
  );
}
