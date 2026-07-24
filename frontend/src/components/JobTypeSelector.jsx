import React, { useState } from 'react';
import { Search, Briefcase, Check, X } from 'lucide-react';
import { CANONICAL_JOB_LIST, normalizeJobType } from '../utils/jobAliases';

export default function JobTypeSelector({ selectedJobType, onSelectJobType, onCancel }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = CANONICAL_JOB_LIST.filter(job =>
    job.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (job) => {
    const normalized = normalizeJobType(job);
    onSelectJobType(normalized);
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/40 relative overflow-hidden shadow-2xl animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              Validation Layer 2
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Manual Job Selection
            </h3>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search job type (e.g. Mason, Electrician, Swiggy rider...)"
          className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm font-semibold focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      {/* Options Grid / List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isSelected = selectedJobType === job;
            return (
              <button
                key={job}
                type="button"
                onClick={() => handleSelect(job)}
                className={`p-3 rounded-xl text-left border flex items-center justify-between text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <span>{job}</span>
                {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
              </button>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-6 text-slate-400 text-sm">
            No matching job type found. Search automatically matches vernacular aliases.
          </div>
        )}
      </div>

      {/* Helper Footer */}
      <p className="text-xs text-slate-400">
        Tip: Selecting a job title standardizes alias titles (e.g., "kothanar" → Mason) for statutory wage rate matching.
      </p>

    </div>
  );
}
