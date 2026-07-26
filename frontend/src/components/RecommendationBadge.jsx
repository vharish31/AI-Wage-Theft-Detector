import React from 'react';
import { Star, Flame, Settings } from 'lucide-react';

export default function RecommendationBadge({ type }) {
  if (type === 'recommended') {
    return (
      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ⭐ Recommended
      </span>
    );
  } else if (type === 'popular') {
    return (
      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
        <Flame className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
        🔥 Popular
      </span>
    );
  } else {
    return (
      <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1">
        <Settings className="w-3.5 h-3.5 text-slate-400" />
        ⚙ Alternative
      </span>
    );
  }
}
