import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, Mic, Keyboard, Sparkles, CheckCircle2, Info, ArrowRight, Star } from 'lucide-react';
import VerificationCard from '../components/VerificationCard';
import { useVerificationRouter } from '../components/VerificationRouter';

export default function VerificationMethod() {
  const navigate = useNavigate();
  const { selectAndRoute } = useVerificationRouter();

  const [selectedMethod, setSelectedMethod] = useState('payslip');
  const [hasPreviousPayslip, setHasPreviousPayslip] = useState(false);

  useEffect(() => {
    // Read saved preference from localStorage
    const saved = localStorage.getItem('last_verification_method');
    if (saved && ['payslip', 'voice', 'manual'].includes(saved)) {
      setSelectedMethod(saved);
    }
    // Simulate checking previous payslip record
    const prev = localStorage.getItem('has_previous_payslip');
    if (prev === 'true') {
      setHasPreviousPayslip(true);
    }
  }, []);

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    selectAndRoute(method);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6 sm:py-8">
      
      {/* Onboarding Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          PRIMARY WAGE VERIFICATION GATEWAY
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Select Your Wage Verification Method
        </h1>

        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          Choose how you would like to submit your shift and wage details for statutory minimum wage theft analysis. Uploading an official payslip provides the fastest, highest-accuracy audit.
        </p>
      </div>

      {/* Smart Experience Banner if previous payslip exists */}
      {hasPreviousPayslip && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-extrabold text-amber-200 block">Previous Employer Payslip Information Found</span>
              <span className="text-slate-400 text-[11px]">You can reuse your saved employer rates or upload a new monthly salary slip.</span>
            </div>
          </div>
          <button
            onClick={() => handleSelectMethod('payslip')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shrink-0 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Upload New Slip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3 Verification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Upload Payslip (Recommended) */}
        <VerificationCard
          id="payslip"
          title="Upload Payslip"
          icon={FileText}
          badgeType="recommended"
          badgeReason="Highest accuracy using official payroll documents."
          features={[
            'Fastest Verification (Instant AI OCR)',
            'Highest Statutory Accuracy',
            'AI extracts salary, deductions & net pay automatically',
            'Supports PDF documents, JPG & PNG photos',
            'Best for workers with salary slips or receipts'
          ]}
          buttonText="Upload Payslip"
          isSelected={selectedMethod === 'payslip'}
          onCardClick={() => setSelectedMethod('payslip')}
          onButtonClick={() => selectAndRoute('payslip')}
        />

        {/* Card 2: Voice Verification (Popular) */}
        <VerificationCard
          id="voice"
          title="Voice Verification"
          icon={Mic}
          badgeType="popular"
          badgeReason="Designed for informal workers and daily wage labourers."
          features={[
            'Best for workers without a physical payslip',
            'Speak naturally in your preferred local language',
            'Supports multilingual input & regional terms',
            'AI extracts hours, job type, salary & overtime',
            'Interactive transcript confirmation before audit'
          ]}
          buttonText="Start Voice Verification"
          isSelected={selectedMethod === 'voice'}
          onCardClick={() => setSelectedMethod('voice')}
          onButtonClick={() => selectAndRoute('voice')}
        />

        {/* Card 3: Manual Entry (Alternative) */}
        <VerificationCard
          id="manual"
          title="Manual Entry"
          icon={Keyboard}
          badgeType="alternative"
          badgeReason="Use when you cannot upload documents or record audio."
          features={[
            'Enter shift hours & payment details manually',
            'Suitable when microphone/OCR is unavailable',
            'Edit every single field yourself',
            'Supports overtime, bonuses & statutory allowances',
            'Direct access to minimum wage benchmark engine'
          ]}
          buttonText="Manual Verification"
          isSelected={selectedMethod === 'manual'}
          onCardClick={() => setSelectedMethod('manual')}
          onButtonClick={() => selectAndRoute('manual')}
        />

      </div>

    </div>
  );
}
