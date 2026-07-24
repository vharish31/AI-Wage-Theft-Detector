import React from 'react';

export default function StatsCard({ icon: Icon, title, value, subtitle, color = 'cyan' }) {
  const getColorClasses = () => {
    switch (color) {
      case 'emerald':
        return {
          iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          valueText: 'text-emerald-400',
          glow: 'group-hover:border-emerald-500/40'
        };
      case 'blue':
        return {
          iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          valueText: 'text-blue-400',
          glow: 'group-hover:border-blue-500/40'
        };
      default:
        return {
          iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
          valueText: 'text-cyan-400',
          glow: 'group-hover:border-cyan-500/40'
        };
    }
  };

  const style = getColorClasses();

  return (
    <div className={`glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 group transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-400">{title}</span>
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${style.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className={`text-3xl font-extrabold tracking-tight mb-1 ${style.valueText}`}>
        {value}
      </div>
      {subtitle && (
        <p className="text-xs font-medium text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}
