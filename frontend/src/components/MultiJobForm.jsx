import React, { useState } from 'react';
import { Plus, ShieldAlert, ArrowRight, Layers, Sparkles } from 'lucide-react';
import JobCard from './JobCard';

/**
 * MultiJobForm Component
 * Manages array of job cards, allowing workers to dynamically add, edit, delete, and audit multi-job workdays.
 */
export default function MultiJobForm({
  jobs = [],
  onUpdateJobs,
  onSubmitAudit,
  isAuditing = false
}) {
  const [editingJobId, setEditingJobId] = useState(null);

  const handleAddJob = () => {
    const newId = `job-${Date.now()}`;
    const newJob = {
      job_id: newId,
      job_type: 'Painter',
      hours_worked: 3.0,
      location: jobs[0]?.location || 'Chennai',
      received_amount: 0.0,
      employer_name: `Employer / Contractor ${jobs.length + 1}`
    };
    onUpdateJobs([...jobs, newJob]);
    setEditingJobId(newId);
  };

  const handleUpdateJobField = (jobId, field, value) => {
    const updated = jobs.map(j => {
      if (j.job_id === jobId) {
        return { ...j, [field]: value };
      }
      return j;
    });
    onUpdateJobs(updated);
  };

  const handleDeleteJob = (jobId) => {
    if (jobs.length <= 1) {
      alert("You must have at least 1 job entry.");
      return;
    }
    const updated = jobs.filter(j => j.job_id !== jobId);
    onUpdateJobs(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Multi-Job Workday Mode
            </span>
            <span className="text-xs font-bold text-slate-400">
              {jobs.length} Job{jobs.length > 1 ? 's' : ''} Logged
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight mt-1">
            Log Every Shift Performed Today
          </h2>
        </div>

        <button
          type="button"
          onClick={handleAddJob}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          + Add Another Job
        </button>
      </div>

      {/* Array of Job Cards */}
      <div className="space-y-4">
        {jobs.map((job, idx) => (
          <JobCard
            key={job.job_id || idx}
            jobIndex={idx}
            job={job}
            onUpdateJob={handleUpdateJobField}
            onDeleteJob={jobs.length > 1 ? handleDeleteJob : null}
            isEditing={editingJobId === job.job_id}
            onToggleEdit={() => setEditingJobId(editingJobId === job.job_id ? null : job.job_id)}
          />
        ))}
      </div>

      {/* Bottom Action Section */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleAddJob}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          + Add Another Job Card
        </button>

        <button
          type="button"
          onClick={onSubmitAudit}
          disabled={isAuditing || jobs.length === 0}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-rose-500 via-red-600 to-amber-600 hover:from-rose-400 hover:to-red-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-rose-500/20 transition-all active:scale-95 cursor-pointer"
        >
          {isAuditing ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              Auditing Multi-Job Workday...
            </>
          ) : (
            <>
              <ShieldAlert className="w-5 h-5" />
              Audit All {jobs.length} Jobs
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
