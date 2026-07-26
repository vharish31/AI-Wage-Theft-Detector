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
  return (
    <div
      onClick={onCardClick}
      className={`relative rounded-3xl p-6 sm:p-7 border backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 ${
        isSelected
          ? 'bg-slate-900 border-amber-500 shadow-2xl shadow-amber-950/40 ring-2 ring-amber-500/50 scale-[1.02]'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
      }`}
    >
      
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner transition-colors ${
              isSelected
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {Icon && <Icon className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{title}</h3>
            </div>
          </div>
        </div>

        {/* Features List */}
        <ul className="space-y-2.5 pt-2 text-xs">
          {features && features.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2 text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button: Amber gradient when selected (1st method style), dark slate when unselected (3rd method style) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onButtonClick) {
            onButtonClick();
          }
        }}
        className={`w-full py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
          isSelected
            ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black shadow-amber-500/30 scale-[1.01]'
            : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 font-semibold'
        }`}
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

    </div>
  );
}
