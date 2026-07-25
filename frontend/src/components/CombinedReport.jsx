import React, { useState } from 'react';
import { FileText, Download, ShieldAlert, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import JobSummary from './JobSummary';
import JobTabs from './JobTabs';
import JobCard from './JobCard';
import { generateMultiJobComplaintAPI } from '../services/api';

/**
 * CombinedReport Component
 * Renders combined daily report with total shortfall summary, individual job cards, and unified legal complaint letter.
 */
export default function CombinedReport({ multiJobResult }) {
  const [activeTab, setActiveTab] = useState('all');
  const [complaintLetter, setComplaintLetter] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!multiJobResult) return null;

  const { summary, jobs_results = [], worker_name = 'Worker' } = multiJobResult;

  const filteredJobs = activeTab === 'all'
    ? jobs_results
    : jobs_results.filter(j => (j.job_id || '') === activeTab);

  const handleGenerateCombinedComplaint = async () => {
    setIsGenerating(true);
    try {
      const res = await generateMultiJobComplaintAPI({
        worker_name,
        jobs: jobs_results.map(j => ({
          job_id: j.job_id,
          job_type: j.job_type,
          hours_worked: j.hours_worked,
          location: j.location,
          received_amount: j.received_amount,
          employer_name: j.employer_name
        }))
      });
      setComplaintLetter(res.complaint);
    } catch (err) {
      console.error('Error generating combined complaint:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Combined Summary Card */}
      <JobSummary summary={summary} />

      {/* 2. Job Tabs Navigation */}
      <JobTabs jobs={jobs_results} activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 3. Individual Job Results Breakdown Cards */}
      <div className="space-y-4">
        {filteredJobs.map((jobResult, idx) => (
          <JobCard
            key={jobResult.job_id || idx}
            jobIndex={idx}
            job={jobResult}
            auditResult={jobResult}
            isEditing={false}
          />
        ))}
      </div>

      {/* 4. Combined Legal Complaint Section */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/30 bg-slate-900/90 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Legal Dispute Evidence
            </span>
            <h3 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Unified Statutory Complaint Generator
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Generates one legally binding complaint summarizing all wage theft discrepancies across all jobs.
            </p>
          </div>

          {!complaintLetter && summary?.is_underpaid ? (
            <button
              type="button"
              onClick={handleGenerateCombinedComplaint}
              disabled={isGenerating}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Generating Legal Complaint...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Combined Legal Complaint
                </>
              )}
            </button>
          ) : null}
        </div>

        {/* Display Generated Complaint Letter */}
        {complaintLetter ? (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                  Official Complaint Letter (Minimum Wages Act, 1948)
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(complaintLetter)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Copy Text
                </button>
              </div>

              <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto p-3 bg-slate-900/60 rounded-xl border border-slate-850">
                {complaintLetter}
              </pre>
            </div>
          </div>
        ) : summary?.is_underpaid ? (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
            Click "Generate Combined Legal Complaint" above to construct your formal labor dispute grievance letter.
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center text-xs text-emerald-300 font-semibold">
            ✓ No Legal Complaint Required. All jobs received fair statutory minimum wages today!
          </div>
        )}
      </div>

    </div>
  );
}
