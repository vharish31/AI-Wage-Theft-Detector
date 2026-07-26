import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RiskMeter from '../components/RiskMeter';
import WageTheftAnalysis from '../components/WageTheftAnalysis';
import CombinedReport from '../components/CombinedReport';
import GigWorkerDashboard from '../components/GigWorkerDashboard';
import CompensationBreakdownCard from '../components/CompensationBreakdownCard';
import CompensationSummary from '../components/CompensationSummary';
import { generateComplaintLetter, generateGigComplaintAPI, downloadPDFReport } from '../services/api';

import { 
  AlertTriangle, 
  IndianRupee, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  Scale, 
  ShieldAlert,
  CheckCircle2,
  Building2,
  BookOpen,
  ShoppingBag
} from 'lucide-react';

export default function Report({ auditResult }) {
  const [complaintData, setComplaintData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [copied, setCopied] = useState(false);

  // Default fallback mock audit result if navigated directly
  const data = auditResult || {
    job_type: 'Construction Worker',
    location: 'Chennai',
    state: 'Tamil Nadu',
    expected_wage: 850,
    received_amount: 600,
    difference: 250,
    risk_score: 29.4,
    risk_level: 'High',
    is_underpaid: true,
    hourly_rate_expected: 106.25,
    hourly_rate_received: 75.00,
    worker_name: 'Worker',
    legal_ref: 'Tamil Nadu Minimum Wages Act - Building & Construction'
  };

  useEffect(() => {
    setComplaintData(null);
  }, [data]);

  const handleGenerateComplaint = async () => {
    setIsGenerating(true);
    try {
      if (data.is_gig) {
        const response = await generateGigComplaintAPI({
          worker_name: data.worker_name || 'Gig Worker',
          platform: data.platform || 'Swiggy',
          task_type: data.task_type || 'Delivery',
          completed_tasks: data.completed_tasks || 25,
          rate_per_task: data.rate_per_task || 35,
          expected_net: data.net_expected_payment || data.expected_wage || 875,
          actual_received: data.actual_payment || data.received_amount || 720,
          location: data.location || 'Chennai'
        });
        setComplaintData(response);
      } else {
        const response = await generateComplaintLetter({
          job_type: data.job_type,
          location: data.location,
          expected: data.expected_wage,
          received: data.received_amount,
          hours_worked: 8,
          worker_name: data.worker_name || 'Worker',
          employer_name: 'Employer / Site Supervisor'
        });
        setComplaintData(response);
      }
    } catch (err) {
      console.error('Error generating complaint letter:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyComplaint = () => {
    if (complaintData?.complaint) {
      navigator.clipboard.writeText(complaintData.complaint);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      await downloadPDFReport({
        job_type: data.is_gig ? `${data.platform} ${data.task_type}` : data.job_type,
        location: data.location || 'Chennai',
        expected: data.net_expected_payment || data.expected_wage,
        received: data.actual_payment || data.received_amount,
        hours_worked: data.working_hours || 8,
        worker_name: data.worker_name || 'Worker'
      });
    } catch (err) {
      console.error('Error downloading PDF:', err);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/verification" className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Verification
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Scale className="w-8 h-8 text-cyan-400" />
            {data.is_multi_job
              ? 'Multi-Job Daily Wage Theft Audit'
              : data.is_gig
              ? `${data.platform} Gig Payment Audit`
              : 'Wage Theft Audit Report'}
          </h1>
          <p className="text-slate-400 text-sm">
            {data.is_multi_job
              ? `Combined multi-job evaluation report for ${data.worker_name || 'Worker'}`
              : data.is_gig
              ? `Per-task payment audit report for ${data.platform} (${data.completed_tasks} ${data.task_type}s)`
              : `Official statutory evaluation report for ${data.job_type} in ${data.location}`}
          </p>
        </div>

        {/* Action Buttons Header */}
        {!data.is_multi_job && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPDF}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {isDownloadingPDF ? 'Exporting PDF...' : 'Download PDF Report'}
            </button>
          </div>
        )}
      </div>

      {/* RENDER REPORT BRANCHES */}
      {data.is_multi_job ? (
        <CombinedReport multiJobResult={data} />
      ) : data.is_gig ? (
        <>
          {/* GIG WORKER DASHBOARD */}
          <GigWorkerDashboard gigResult={data} />

          {/* AI GIG COMPLAINT GENERATOR */}
          {data.is_underpaid ? (
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Gig Worker Formal Complaint Letter
                    </h2>
                    <p className="text-xs text-slate-400">
                      Grievance letter formatted for state Gig Worker Welfare Board & Labor Commissioner
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyComplaint}
                    disabled={!complaintData?.complaint}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      copied
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-cyan-400" /> Copy Letter
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isGenerating ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
                  <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
                  <p className="text-sm font-semibold">Drafting formal legal gig complaint using AI...</p>
                </div>
              ) : complaintData?.complaint ? (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto selection:bg-cyan-500 selection:text-slate-950">
                    {complaintData.complaint}
                  </div>

                  {complaintData.recommended_actions && (
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                        <BookOpen className="w-4 h-4" /> Recommended Actions for Gig Worker
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {complaintData.recommended_actions.map((act, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 space-y-4">
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    Click below to generate a legal complaint letter tailored for gig platform workers under Code on Social Security regulations.
                  </p>
                  <button
                    onClick={handleGenerateComplaint}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 inline-flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 text-slate-950" />
                    Generate Gig Worker Legal Complaint Letter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950 shadow-2xl relative overflow-hidden space-y-6">
              <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Full Gig Payment Verified
                  </h2>
                  <p className="text-slate-300 text-sm">
                    Received amount (₹{data.actual_payment || data.received_amount}) meets net expected payout for {data.platform} ({data.completed_tasks} {data.task_type}s). No legal action needed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* HOURLY WORKER REPORT */
        <>
          {/* WARNING BANNER */}
          {data.is_underpaid ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-red-900/40 to-slate-900 border border-rose-500/50 flex items-start gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7 text-rose-400 animate-bounce-subtle" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-extrabold text-rose-400">
                    ⚠ Potential Wage Theft Detected
                  </span>
                  <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {data.risk_level} Risk
                  </span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">
                  You were paid <span className="font-bold text-white">₹{data.received_amount}</span>, which is <span className="font-extrabold text-rose-400">₹{data.difference} less</span> than the statutory daily minimum wage standard of <span className="font-bold text-white">₹{data.expected_wage}</span> under the <span className="text-cyan-300 italic">{data.legal_ref}</span>.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-emerald-400 mb-1">
                  Fair Wage Compliance Verified
                </h3>
                <p className="text-slate-200 text-sm">
                  Your received payment of ₹{data.received_amount} meets or exceeds statutory benchmark rates (₹{data.expected_wage}). No wage theft detected.
                </p>
              </div>
            </div>
          )}

          {/* WAGE THEFT ANALYSIS CARD MODULE */}
          <WageTheftAnalysis 
            analysisData={{
              expectedPay: data.expected_wage,
              actualPay: data.received_amount,
              wageTheftAmount: data.difference,
              wageTheftPercentage: data.expected_wage > 0 ? parseFloat(((data.difference / data.expected_wage) * 100).toFixed(2)) : 0,
              riskLevel: data.risk_level === 'Critical' ? 'High Risk' : (data.risk_level === 'High' ? 'High Risk' : (data.risk_level === 'Medium' ? 'Medium Risk' : (data.risk_level === 'Low' ? 'Low Risk' : 'No Issue'))),
              confidenceScore: 94,
              confidenceLevel: 'High Confidence',
              status: data.is_underpaid ? 'Possible Wage Theft' : 'No Wage Theft',
              calculationMethod: `${data.job_type} Standard Benchmark (${data.legal_ref || 'Minimum Wages Act'})`
            }} 
          />

          {/* ITEMIZED COMPENSATION BREAKDOWN & STATUTORY VALIDATION */}
          <CompensationBreakdownCard
            breakdown={data.compensation || {
              baseWage: data.received_amount || 600,
              totalBonuses: 0,
              totalAllowances: 0,
              totalTips: 0,
              totalCommissions: 0,
              totalDeductions: 0,
              totalCompensation: data.received_amount || 600
            }}
            minimumWage={data.expected_wage}
          />

          <CompensationSummary
            baseWage={data.compensation?.baseWage || data.received_amount || 600}
            minimumWage={data.expected_wage}
            totalCompensation={data.compensation?.totalCompensation || data.received_amount || 600}
          />

          {/* METRICS & RISK METER GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  Statutory Expected Wage
                </span>
                <div className="text-3xl font-extrabold text-white flex items-center gap-1">
                  <IndianRupee className="w-6 h-6 text-cyan-400" />
                  {data.expected_wage.toFixed(2)}
                </div>
                <span className="text-xs text-slate-500 block pt-1">
                  Based on official state wage board
                </span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  Actual Amount Received
                </span>
                <div className="text-3xl font-extrabold text-cyan-300 flex items-center gap-1">
                  <IndianRupee className="w-6 h-6 text-cyan-400" />
                  {data.received_amount.toFixed(2)}
                </div>
                <span className="text-xs text-slate-500 block pt-1">
                  Reported worker payout
                </span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-rose-500/30 space-y-1 bg-rose-950/20 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    Unpaid Shortfall / Wages Withheld
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Shortfall per shift
                  </span>
                </div>
                <div className="text-4xl font-black text-rose-400 flex items-center gap-1">
                  <IndianRupee className="w-7 h-7" />
                  {data.difference.toFixed(2)}
                </div>
                <p className="text-xs text-slate-300 pt-1">
                  Worker loss equal to <span className="font-bold text-rose-300">{((data.difference / data.expected_wage) * 100).toFixed(1)}%</span> of total entitled daily wages.
                </p>
              </div>
            </div>

            <div>
              <RiskMeter
                riskScore={data.risk_score}
                riskLevel={data.risk_level}
              />
            </div>
          </div>

          {/* AI COMPLAINT LETTER GENERATOR */}
          {data.received_amount < data.expected_wage ? (
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      AI-Generated Formal Legal Complaint
                    </h2>
                    <p className="text-xs text-slate-400">
                      Statutory complaint formatted for the Labor Commissioner under the Minimum Wages Act
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyComplaint}
                    disabled={!complaintData?.complaint}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      copied
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-cyan-400" /> Copy Letter
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isGenerating ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
                  <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
                  <p className="text-sm font-semibold font-sans">Drafting formal legal grievance letter using Gemini AI...</p>
                </div>
              ) : complaintData?.complaint ? (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto selection:bg-cyan-500 selection:text-slate-950">
                    {complaintData.complaint}
                  </div>

                  {complaintData.recommended_actions && (
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                        <BookOpen className="w-4 h-4" /> Next Steps for Worker
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {complaintData.recommended_actions.map((act, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 space-y-4">
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    Click below to generate an official statutory complaint letter formatted for the Labor Commissioner under the Minimum Wages Act.
                  </p>
                  <button
                    onClick={handleGenerateComplaint}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 inline-flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 text-slate-950" />
                    Generate Legal Complaint Letter with AI
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950 shadow-2xl relative overflow-hidden space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                      No Legal Action Needed
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
