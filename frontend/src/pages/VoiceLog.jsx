import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceRecorder from '../components/VoiceRecorder';
import ProcessFlowStepper from '../components/ProcessFlowStepper';
import TranscriptReview from '../components/TranscriptReview';
import StructuredDataReview from '../components/StructuredDataReview';
import ValidationBanner from '../components/ValidationBanner';
import WageCard from '../components/WageCard';
import { extractSpeechData, validateWorkDataAPI } from '../services/api';
import { Sparkles, ArrowRight, CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';

export default function VoiceLog({ workData, setWorkData }) {
  const [rawTranscript, setRawTranscript] = useState(null);
  const [confirmedTranscript, setConfirmedTranscript] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [extractedData, setExtractedData] = useState(workData || null);
  const [validationResult, setValidationResult] = useState(null);
  const [showValidationWarning, setShowValidationWarning] = useState(false);

  const navigate = useNavigate();

  const extractionSteps = [
    { title: 'Voice Input Analysis', desc: 'Analyzing audio transcript' },
    { title: 'Gemini AI Parsing', desc: 'Extracting job, hours & location' },
    { title: 'Structuring Record', desc: 'Formatting verification metrics' }
  ];

  // Sample past work records for historical anomaly detection testing
  const pastWorkRecords = [8, 9, 8, 7.5, 8];

  // Validation Layer 1: Voice recording produces raw transcript for review
  const handleRawTranscriptCaptured = (transcriptText) => {
    setRawTranscript(transcriptText);
    setConfirmedTranscript(null);
    setExtractedData(null);
    setValidationResult(null);
    setShowValidationWarning(false);
  };

  // Validation Layer 1 Confirmation: User confirms/edits transcript text
  const handleConfirmTranscript = async (finalTranscript) => {
    setConfirmedTranscript(finalTranscript);
    setIsExtracting(true);
    setActiveStepIndex(0);

    // Step 1: Voice Analysis
    await new Promise((r) => setTimeout(r, 400));
    setActiveStepIndex(1);

    try {
      // Step 2: Gemini AI Extraction
      const data = await extractSpeechData(finalTranscript);

      // Step 3: Structuring Record
      await new Promise((r) => setTimeout(r, 500));
      setActiveStepIndex(2);

      await new Promise((r) => setTimeout(r, 300));

      setExtractedData(data);
      setWorkData(data);

      // Run Validation Layer 3 check on extracted data
      await runValidationCheck(data);
    } catch (err) {
      console.error('Error extracting speech:', err);
    } fontally: {
      setIsExtracting(false);
    }
  };

  // Reset/Re-record Audio
  const handleReRecord = () => {
    setRawTranscript(null);
    setConfirmedTranscript(null);
    setExtractedData(null);
    setValidationResult(null);
    setShowValidationWarning(false);
  };

  // Validation Layer 3: Anomaly check
  const runValidationCheck = async (dataToValidate) => {
    try {
      const valRes = await validateWorkDataAPI({
        job_type: dataToValidate.job_type,
        hours_worked: dataToValidate.hours_worked,
        location: dataToValidate.location,
        past_records: pastWorkRecords
      });

      setValidationResult(valRes);

      if (valRes.warning || valRes.error || (valRes.warnings && valRes.warnings.length > 0)) {
        setShowValidationWarning(true);
      } else {
        setShowValidationWarning(false);
      }
    } catch (err) {
      console.error('Validation check error:', err);
    }
  };

  // Validation Layer 2 Confirmation & Inline Edits
  const handleStructuredDataConfirmed = (updatedData) => {
    setExtractedData(updatedData);
    setWorkData(updatedData);
    runValidationCheck(updatedData);
  };

  const handleStructuredDataEdited = (updatedData) => {
    setExtractedData(updatedData);
    setWorkData(updatedData);
    runValidationCheck(updatedData);
  };

  const handleProceed = () => {
    if (extractedData) {
      navigate('/verification');
    }
  };

  const handleResetAll = () => {
    setRawTranscript(null);
    setConfirmedTranscript(null);
    setExtractedData(null);
    setWorkData(null);
    setValidationResult(null);
    setShowValidationWarning(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Workflow Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          VOICE RECOGNITION ERROR PREVENTION SYSTEM
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Record & Validate Work Details
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Speak your shift details naturally. Our multi-layer validation engine verifies transcripts, extracts metrics with Gemini AI, and detects duration anomalies before wage analysis.
        </p>
      </div>

      {/* 1. Voice Recorder (Captured initial voice input) */}
      {!rawTranscript && (
        <VoiceRecorder
          onTranscriptComplete={handleRawTranscriptCaptured}
          isExtracting={isExtracting}
        />
      )}

      {/* 2. Validation Layer 1: Transcript Confirmation Screen */}
      {rawTranscript && !confirmedTranscript && !isExtracting && (
        <TranscriptReview
          transcript={rawTranscript}
          onConfirm={handleConfirmTranscript}
          onReRecord={handleReRecord}
        />
      )}

      {/* Live Process Stepper */}
      {isExtracting && (
        <ProcessFlowStepper
          title="AI Extraction & Validation Process Flow"
          steps={extractionSteps}
          activeStepIndex={activeStepIndex}
          isProcessing={isExtracting}
        />
      )}

      {/* 3. Validation Layer 2 & Layer 3 Results */}
      {extractedData && !isExtracting && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Verified Work Metrics
            </h2>
            <button
              onClick={handleResetAll}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Start New Log
            </button>
          </div>

          {/* Validation Layer 3: Warning / Anomaly Banner */}
          {showValidationWarning && validationResult && (
            <ValidationBanner
              warning={validationResult.warning}
              error={validationResult.error}
              hoursWorked={extractedData.hours_worked}
              onContinueAnyway={() => setShowValidationWarning(false)}
              onEditEntry={() => {
                // Focus user on editing structured data
              }}
            />
          )}

          {/* Validation Layer 2: Structured Data Confirmation Review Card */}
          <StructuredDataReview
            data={extractedData}
            onConfirm={handleStructuredDataConfirmed}
            onEdit={handleStructuredDataEdited}
          />

          {/* Standard Wage Card Display */}
          <WageCard
            jobType={extractedData.job_type}
            hoursWorked={extractedData.hours_worked}
            location={extractedData.location}
          />

          {/* Proceed CTA Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleProceed}
              disabled={validationResult?.error && showValidationWarning}
              className={`w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-base shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 ${
                validationResult?.error && showValidationWarning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/20'
              }`}
            >
              Proceed to Payment Verification
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
