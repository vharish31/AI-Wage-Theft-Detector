import React, { useState } from 'react';
import { processPayslipOCRAPI } from '../services/api';
import { FileText, Upload, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw, Eye, FileSpreadsheet, Building2, User, MapPin, Briefcase, IndianRupee } from 'lucide-react';

export default function PayslipUploader({ onAuditSuccess, isAuditing }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
    if (selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
    triggerOCR(selectedFile);
  };

  const triggerOCR = async (selectedFile, sampleId = null) => {
    setIsProcessingOCR(true);
    setOcrResult(null);
    try {
      let payload;
      if (selectedFile) {
        payload = new FormData();
        payload.append('file', selectedFile);
      } else {
        payload = { sample_id: sampleId };
      }
      const data = await processPayslipOCRAPI(payload);
      setOcrResult(data);
    } catch (err) {
      console.error('OCR processing failed:', err);
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const handleSampleClick = (sampleId) => {
    setFile(null);
    setPreviewUrl(null);
    triggerOCR(null, sampleId);
  };

  const handleFieldChange = (field, val) => {
    if (!ocrResult) return;
    setOcrResult(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleProceedToAudit = () => {
    if (!ocrResult || !onAuditSuccess) return;
    onAuditSuccess(ocrResult);
  };

  return (
    <div className="space-y-6">
      
      {/* Payslip Header Card */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-xl shadow-amber-950/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">AI Payslip OCR Document Verification</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase">
                  Highest Accuracy
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Upload your salary slip or payment receipt (PDF, PNG, JPG). AI OCR extracts gross salary, deductions & statutory rules automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
              : 'border-slate-700 bg-slate-950/60 hover:border-amber-500/60 hover:bg-slate-900/80'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          <div className="flex flex-col items-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm font-extrabold text-white">
                Drag & Drop Payslip Document or <span className="text-amber-400 underline">Browse File</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF Salary Slips, JPG, PNG Photos & Mobile Receipts (Max 10MB)
              </p>
            </div>

            {file && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Selected File: {file.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Or try instant sample payslips for quick testing:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSampleClick('factory_sample')}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all hover:border-amber-500/40 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Factory Payslip (Chennai)</span>
                  <span className="text-[10px] text-slate-400">Unlawful Uniform Deduction Included</span>
                </div>
              </div>
              <span className="text-xs font-extrabold text-amber-400">Load & Audit →</span>
            </button>

            <button
              type="button"
              onClick={() => handleSampleClick('construction_sample')}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all hover:border-amber-500/40 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Mason Overtime Slip (Bengaluru)</span>
                  <span className="text-[10px] text-slate-400">Contractor Retention Fee Violation</span>
                </div>
              </div>
              <span className="text-xs font-extrabold text-cyan-400">Load & Audit →</span>
            </button>
          </div>
        </div>
      </div>

      {/* OCR Processing Spinner */}
      {isProcessingOCR && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-amber-500/30 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-white">AI Visual OCR Scanner Analyzing Document...</h3>
          <p className="text-xs text-slate-400">Extracting wage line items, statutory PF/ESI deductions, and employer benchmark rates...</p>
        </div>
      )}

      {/* Extracted Payslip AI Review Card */}
      {ocrResult && !isProcessingOCR && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700 space-y-6 shadow-2xl animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Extracted Payslip Fields (AI Confidence: {(ocrResult.ocr_confidence * 100).toFixed(1)}%)</h3>
                <p className="text-xs text-slate-400">Verify extracted numbers below before launching statutory minimum wage audit</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOcrResult(null)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Extracted Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Employee / Worker Name
              </label>
              <input
                type="text"
                value={ocrResult.worker_name}
                onChange={(e) => handleFieldChange('worker_name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-400" /> Employer / Establishment
              </label>
              <input
                type="text"
                value={ocrResult.employer_name}
                onChange={(e) => handleFieldChange('employer_name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" /> Job Role / Category
              </label>
              <input
                type="text"
                value={ocrResult.job_type}
                onChange={(e) => handleFieldChange('job_type', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Location / City
              </label>
              <input
                type="text"
                value={ocrResult.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Net Salary Paid (₹)
              </label>
              <input
                type="number"
                value={ocrResult.net_salary}
                onChange={(e) => handleFieldChange('net_salary', Number(e.target.value))}
                className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl p-2.5 text-emerald-400 font-extrabold text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Unexplained / Illegal Deductions (₹)
              </label>
              <input
                type="number"
                value={ocrResult.illegal_deductions}
                onChange={(e) => handleFieldChange('illegal_deductions', Number(e.target.value))}
                className="w-full bg-slate-950 border border-rose-500/50 rounded-xl p-2.5 text-rose-300 font-bold"
              />
            </div>
          </div>

          {/* Raw Text Preview */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Extracted OCR Document Text Transcript</span>
            <p className="text-[11px] text-slate-300 font-mono whitespace-pre-line leading-relaxed">
              {ocrResult.extracted_raw_text}
            </p>
          </div>

          {/* Audit CTA Button */}
          <button
            type="button"
            onClick={handleProceedToAudit}
            disabled={isAuditing}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <span>Run Statutory Wage Theft Audit on Payslip</span>
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>
      )}

    </div>
  );
}
