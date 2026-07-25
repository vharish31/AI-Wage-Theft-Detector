import React from 'react';
import { Briefcase, Clock, MapPin, IndianRupee, Trash2, Edit3, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import ModernNumberInput from './ModernNumberInput';

/**
 * JobCard Component
 * Displays and allows editing for an individual job card in a multi-job workday.
 */
export default function JobCard({
  jobIndex,
  job,
  onUpdateJob,
  onDeleteJob,
  isEditing = false,
  onToggleEdit,
  auditResult = null
}) {
  const jobTypes = [
    "Construction Worker", "Mason", "Carpenter", "Painter", "Electrician",
    "Plumber", "Driver", "Delivery Partner", "Farm Worker", "Domestic Worker",
    "Welder", "Security Guard", "Sanitation Worker", "Factory Worker", "Freelancer"
  ];

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-700/80 bg-slate-900/90 shadow-xl space-y-4 relative overflow-hidden transition-all duration-300 hover:border-cyan-500/40">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-black flex items-center justify-center border border-cyan-500/30">
            #{jobIndex + 1}
          </span>
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            {job.job_type || 'Job Card'}
          </h3>
        </div>

        {/* Audit Status Badge (if available) */}
        {auditResult ? (
          <div className="flex items-center gap-2">
            {auditResult.is_underpaid ? (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Underpaid (₹{auditResult.difference})
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Fair Wage
              </span>
            )}
          </div>
        ) : null}

        {/* Actions (Edit / Delete) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleEdit}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-all cursor-pointer"
            title="Edit Job Details"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          {onDeleteJob && (
            <button
              type="button"
              onClick={() => onDeleteJob(job.job_id)}
              className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 transition-all cursor-pointer border border-rose-500/30"
              title="Delete Job Card"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editable Fields Mode */}
      {isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Job Category / Title
            </label>
            <select
              value={job.job_type}
              onChange={(e) => onUpdateJob(job.job_id, 'job_type', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-semibold focus:border-cyan-500 focus:outline-none"
            >
              {jobTypes.map((jt) => (
                <option key={jt} value={jt}>{jt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Work Duration (Hours)
            </label>
            <ModernNumberInput
              value={job.hours_worked}
              onChange={(val) => onUpdateJob(job.job_id, 'hours_worked', val)}
              min={1}
              max={24}
              step={0.5}
              suffix="hrs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Employer / Contractor Name
            </label>
            <input
              type="text"
              value={job.employer_name || ''}
              onChange={(e) => onUpdateJob(job.job_id, 'employer_name', e.target.value)}
              placeholder="e.g. Contractor John"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-medium focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Payment Received (₹)
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="number"
                min="0"
                value={job.received_amount || ''}
                onChange={(e) => onUpdateJob(job.job_id, 'received_amount', parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-extrabold text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Readonly Summary Display */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 font-semibold block uppercase">Duration</span>
            <span className="text-sm font-black text-cyan-300 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> {job.hours_worked} Hours
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 font-semibold block uppercase">Location</span>
            <span className="text-sm font-bold text-slate-200 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {job.location || 'Chennai'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 font-semibold block uppercase">Employer</span>
            <span className="text-sm font-semibold text-slate-300 flex items-center gap-1 mt-0.5 truncate">
              <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" /> {job.employer_name || 'Employer'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
            <span className="text-emerald-400 font-bold block uppercase">Payment Received</span>
            <span className="text-sm font-black text-white flex items-center gap-0.5 mt-0.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> {job.received_amount ? job.received_amount.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
