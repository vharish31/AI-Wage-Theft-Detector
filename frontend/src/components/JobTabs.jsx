import React from 'react';
import { Briefcase, Layers } from 'lucide-react';

/**
 * JobTabs Component
 * Tabbed navigation bar switching between individual Job Cards and Combined View.
 */
export default function JobTabs({ jobs = [], activeTab = 'all', onSelectTab }) {
  if (!jobs || jobs.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
      <button
        type="button"
        onClick={() => onSelectTab('all')}
        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
          activeTab === 'all'
            ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        All Jobs ({jobs.length})
      </button>

      {jobs.map((job, idx) => {
        const tabKey = job.job_id || `job-${idx+1}`;
        const isActive = activeTab === tabKey;

        return (
          <button
            key={tabKey}
            type="button"
            onClick={() => onSelectTab(tabKey)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              isActive
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            Job #{idx + 1}: {job.job_type}
          </button>
        );
      })}
    </div>
  );
}
