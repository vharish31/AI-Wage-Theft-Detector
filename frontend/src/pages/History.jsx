import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getVerificationHistory, 
  deleteHistoryItem, 
  clearVerificationHistory 
} from '../utils/historyStorage';
import { generatePDFReport } from '../utils/generatePDFReport';
import ModernDropdown from '../components/ModernDropdown';
import ModernCalendarFilter from '../components/ModernCalendarFilter';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Trash2, 
  FileText, 
  Download, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  IndianRupee, 
  Sparkles, 
  AlertTriangle,
  RefreshCw,
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react';

export default function History({ setAuditResult }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [historyList, setHistoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Calendar Date Range Filter State
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const list = getVerificationHistory(user);
    setHistoryList(list);
  }, [user]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this verification record?')) {
      const updated = deleteHistoryItem(id, user);
      setHistoryList(updated);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all your verification history records?')) {
      const cleared = clearVerificationHistory(user);
      setHistoryList(cleared);
    }
  };

  const handleViewReport = (item) => {
    if (setAuditResult && item.fullResult) {
      setAuditResult(item.fullResult);
      navigate('/report');
    }
  };

  const handleDownloadPDF = (item, e) => {
    e.stopPropagation();
    if (item.fullResult) {
      generatePDFReport(item.fullResult);
    }
  };

  const methodOptions = [
    { value: 'ALL', label: 'All Verification Methods' },
    { value: 'PAYSLIP', label: 'Upload Payslip (AI OCR)' },
    { value: 'VOICE', label: 'Voice Verification' },
    { value: 'MANUAL', label: 'Manual Entry' },
    { value: 'GIG', label: 'Gig Platform Audit' },
    { value: 'MULTI', label: 'Multi-Job Daily Audit' }
  ];

  const riskOptions = [
    { value: 'ALL', label: 'All Audit Statuses' },
    { value: 'UNDERPAID', label: 'Underpaid Claims Only' },
    { value: 'COMPLIANT', label: 'Compliant Audits Only' },
    { value: 'HIGH', label: 'High / Critical Risk Only' }
  ];

  // Filtered List calculation
  const filteredHistory = historyList.filter(item => {
    // 1. Text Search
    const matchesSearch = 
      (item.job_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.verification_method || '').toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Method Filter
    const matchesMethod = methodFilter === 'ALL' || (
      methodFilter === 'PAYSLIP' && (item.verification_method || '').toLowerCase().includes('payslip')
    ) || (
      methodFilter === 'VOICE' && (item.verification_method || '').toLowerCase().includes('voice')
    ) || (
      methodFilter === 'MANUAL' && (item.verification_method || '').toLowerCase().includes('manual')
    ) || (
      methodFilter === 'GIG' && (item.verification_method || '').toLowerCase().includes('gig')
    ) || (
      methodFilter === 'MULTI' && (item.verification_method || '').toLowerCase().includes('multi')
    );

    // 3. Risk Filter
    const matchesRisk = riskFilter === 'ALL' || (
      riskFilter === 'UNDERPAID' && item.is_underpaid
    ) || (
      riskFilter === 'COMPLIANT' && !item.is_underpaid
    ) || (
      riskFilter === 'HIGH' && ((item.risk_level || '').includes('High') || (item.risk_level || '').includes('Critical'))
    );

    // 4. Date Range Filter (From Date & To Date)
    let matchesDate = true;
    if (item.timestamp) {
      const itemTimestamp = new Date(item.timestamp).getTime();
      if (fromDate) {
        const fromTimestamp = new Date(fromDate + 'T00:00:00').getTime();
        if (itemTimestamp < fromTimestamp) matchesDate = false;
      }
      if (toDate) {
        const toTimestamp = new Date(toDate + 'T23:59:59').getTime();
        if (itemTimestamp > toTimestamp) matchesDate = false;
      }
    }

    return matchesSearch && matchesMethod && matchesRisk && matchesDate;
  });

  // Calculate Metrics
  const totalAudits = historyList.length;
  const totalShortfall = historyList.reduce((acc, curr) => acc + (curr.difference || 0), 0);
  const underpaidCount = historyList.filter(i => i.is_underpaid).length;
  const compliantCount = historyList.filter(i => !i.is_underpaid).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 sm:py-8 animate-fadeIn">
      
      {/* 1. TOP HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-cyan-950/50 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-extrabold tracking-wide uppercase">
            <HistoryIcon className="w-3.5 h-3.5" /> VERIFICATION & AUDIT LOGS
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Wage Verification History
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            All your past wage theft audits, statutory minimum wage checks, payslip extractions, and gig payment logs are stored here for record keeping.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          {historyList.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Clear History</span>
            </button>
          )}

          <Link
            to="/verify-method"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>New Verification</span>
          </Link>
        </div>
      </div>

      {/* 2. SUMMARY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-xl space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Verifications</span>
          <div className="text-2xl font-black text-white flex items-center justify-between">
            <span>{totalAudits} Audits</span>
            <HistoryIcon className="w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-[11px] text-slate-400">Stored in your local session log</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-rose-500/40 bg-rose-950/10 shadow-xl space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">Total Shortfalls Identified</span>
          <div className="text-2xl font-black text-rose-400 flex items-center justify-between font-mono">
            <span className="flex items-center gap-0.5">
              <IndianRupee className="w-5 h-5" />
              {totalShortfall.toFixed(2)}
            </span>
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
          <p className="text-[11px] text-rose-300/80">Cumulative underpayment identified</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">Underpaid Claims</span>
          <div className="text-2xl font-black text-amber-300 flex items-center justify-between">
            <span>{underpaidCount} Cases</span>
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-[11px] text-amber-400/80">Eligible for Labor Inspector complaint</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">Compliant Audits</span>
          <div className="text-2xl font-black text-emerald-400 flex items-center justify-between">
            <span>{compliantCount} Audits</span>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-[11px] text-emerald-400/80">Fair wage statutory compliance</p>
        </div>

      </div>

      {/* 3. MODERN SEARCH & FILTERS BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job role, city, or method..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Modern Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            
            {/* 1. Modern Custom Calendar From & To Date Range Filter */}
            <ModernCalendarFilter
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
            />

            {/* 2. Modern Custom Method Dropdown */}
            <ModernDropdown
              options={methodOptions}
              value={methodFilter}
              onChange={setMethodFilter}
              className="w-full sm:w-56"
            />

            {/* 3. Modern Custom Risk Dropdown */}
            <ModernDropdown
              options={riskOptions}
              value={riskFilter}
              onChange={setRiskFilter}
              className="w-full sm:w-52"
            />

          </div>

        </div>
      </div>

      {/* 4. HISTORY RECORDS LIST */}
      {filteredHistory.length === 0 ? (
        <div className="py-16 text-center space-y-4 glass-card rounded-3xl border border-slate-800">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <HistoryIcon className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Verification Records Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {historyList.length === 0 
                ? 'You have not performed any wage verifications yet. Click below to start your first wage audit.' 
                : 'No historical verification logs match your current search and filter criteria.'}
            </p>
          </div>
          <Link
            to="/verify-method"
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Wage Verification</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2">
            <span>Showing {filteredHistory.length} Verification Records</span>
          </div>

          <div className="space-y-3">
            {filteredHistory.map((item) => {
              const isUnderpaid = item.is_underpaid;
              return (
                <div
                  key={item.id}
                  onClick={() => handleViewReport(item)}
                  className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-5 group ${
                    isUnderpaid
                      ? 'bg-slate-900/90 border-slate-800 hover:border-rose-500/50 hover:bg-slate-900'
                      : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900'
                  }`}
                >
                  {/* Left Column: Details */}
                  <div className="space-y-3 flex-1">
                    
                    {/* Top Row: Method Badge & Date */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-black uppercase tracking-wider">
                        {item.verification_method}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        isUnderpaid
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {isUnderpaid ? `⚠ ${item.risk_level || 'Underpaid'}` : '✓ Fair Wage Compliant'}
                      </span>

                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {item.date}
                      </span>
                    </div>

                    {/* Middle Row: Job Role & Location */}
                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                        <span>{item.job_type}</span>
                        {item.fullResult?.is_gig && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                            Gig Platform
                          </span>
                        )}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {item.location}
                        </span>
                        <span>Shift: {item.hours_worked} Hours</span>
                        <span className="text-slate-500">Ref: {item.legal_ref}</span>
                      </div>
                    </div>

                  </div>

                  {/* Middle Column: Wage Breakdown Numbers */}
                  <div className="flex items-center gap-6 justify-between lg:justify-end border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                    
                    <div className="text-left lg:text-right space-y-0.5">
                      <div className="text-xs text-slate-400">
                        Received: <strong className="text-white font-mono">₹{item.received_amount?.toFixed(2)}</strong>
                      </div>
                      <div className="text-xs text-slate-400">
                        Expected: <strong className="text-cyan-300 font-mono">₹{item.expected_wage?.toFixed(2)}</strong>
                      </div>
                    </div>

                    <div className="text-right pl-4 border-l border-slate-800">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                        {isUnderpaid ? 'Shortfall' : 'Status'}
                      </span>
                      <div className={`text-xl font-black font-mono ${isUnderpaid ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isUnderpaid ? `-₹${item.difference?.toFixed(2)}` : 'Compliant'}
                      </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="flex items-center gap-2 pl-2">
                      <button
                        type="button"
                        onClick={(e) => handleDownloadPDF(item, e)}
                        title="Download Professional PDF Report"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(item.id, e)}
                        title="Delete record"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

