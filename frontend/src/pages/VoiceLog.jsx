import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceRecorder from '../components/VoiceRecorder';
import ProcessFlowStepper from '../components/ProcessFlowStepper';
import TranscriptReview from '../components/TranscriptReview';
import StructuredDataReview from '../components/StructuredDataReview';
import ValidationBanner from '../components/ValidationBanner';
import WageCard from '../components/WageCard';
import JobTypeReview from '../components/JobTypeReview';
import JobTypeSelector from '../components/JobTypeSelector';
import JobCategoryPreview from '../components/JobCategoryPreview';
import { extractSpeechData, validateWorkDataAPI, normalizeJobAPI } from '../services/api';
import { normalizeJobType } from '../utils/jobAliases';
import { Sparkles, ArrowRight, CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';

export default function VoiceLog({ workData, setWorkData }) {
  const [rawTranscript, setRawTranscript] = useState(null);
  const [confirmedTranscript, setConfirmedTranscript] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [extractedData, setExtractedData] = useState(workData || null);
  const [validationResult, setValidationResult] = useState(null);
  const [showValidationWarning, setShowValidationWarning] = useState(false);

  // Job Type Validation Layer state: 'review' | 'selector' | 'preview' | 'complete'
  const [jobValidationStep, setJobValidationStep] = useState('review');

  const navigate = useNavigate();

  const extractionSteps = [
    { title: 'Voice Input Analysis', desc: 'Analyzing audio transcript' },
    { title: 'Gemini AI Parsing', desc: 'Extracting job, hours & location' },
    { title: 'Structuring Record', desc: 'Formatting verification metrics' }
  ];

  const pastWorkRecords = [8, 9, 8, 7.5, 8];

  const handleRawTranscriptCaptured = (transcriptText) => {
    setRawTranscript(transcriptText);
    setConfirmedTranscript(null);
    setExtractedData(null);
    setValidationResult(null);
    setShowValidationWarning(false);
    setJobValidationStep('review');
  };

  const handleConfirmTranscript = async (finalTranscript) => {
    setConfirmedTranscript(finalTranscript);
    setIsExtracting(true);
    setActiveStepIndex(0);

    await new Promise((r) => setTimeout(r, 400));
    setActiveStepIndex(1);

    try {
      const data = await extractSpeechData(finalTranscript);

      await new Promise((r) => setTimeout(r, 500));
      setActiveStepIndex(2);

      await new Promise((r) => setTimeout(r, 300));

      // Standardize extracted job title via Alias Dictionary
      const normalizedJob = normalizeJobType(data.job_type);
      const structuredData = {
        ...data,
        job_type: normalizedJob
      };

      setExtractedData(structuredData);
      setWorkData(structuredData);
      setJobValidationStep('review');

      await runValidationCheck(structuredData);
    } catch (err) {
      console.error('Error extracting speech:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleReRecord = () => {
    setRawTranscript(null);
    setConfirmedTranscript(null);
    setExtractedData(null);
    setValidationResult(null);
    setShowValidationWarning(false);
    setJobValidationStep('review');
  };

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

  // Job Type Validation Layer Handlers
  const handleConfirmJobTypeReview = (confirmedJob) => {
    const updated = { ...extractedData, job_type: normalizeJobType(confirmedJob) };
    setExtractedData(updated);
    setWorkData(updated);
    setJobValidationStep('preview');
  };

  const handleSelectJobTypeFromDropdown = (selectedJob) => {
    const normalized = normalizeJobType(selectedJob);
    const updated = { ...extractedData, job_type: normalized };
    setExtractedData(updated);
    setWorkData(updated);
    setJobValidationStep('preview');
  };

  const handleConfirmCategoryPreview = () => {
    setJobValidationStep('complete');
    runValidationCheck(extractedData);
  };

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
    setJobValidationStep('review');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Workflow Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          HUMAN-IN-THE-LOOP JOB TYPE VALIDATION & ERROR PREVENTION SYSTEM
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Record & Validate Work Details
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Speak your shift details naturally. Our multi-layer validation engine standardizes vernacular job aliases, verifies AI confidence, and previews statutory wage categories before analysis.
        </p>
      </div>

      {/* 1. Voice Recorder */}
      {!rawTranscript && (
        <VoiceRecorder
          onTranscriptComplete={handleRawTranscriptCaptured}
          isExtracting={isExtracting}
        />
      )}

      {/* 2. Validation Layer 1: Transcript Review Screen */}
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
          title="AI Extraction & Job Type Normalization Flow"
          steps={extractionSteps}
          activeStepIndex={activeStepIndex}
          isProcessing={isExtracting}
        />
      )}

      {/* 3. Job Type Validation & Standardization Layer */}
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

          {/* Validation Layer 1 & 4: Job Type Review Screen */}
          {jobValidationStep === 'review' && (
            <JobTypeReview
              data={extractedData}
              confidence={extractedData.confidence}
              onConfirm={handleConfirmJobTypeReview}
              onEdit={() => setJobValidationStep('selector')}
            />
          )}

          {/* Validation Layer 2: Manual Job Selector */}
          {jobValidationStep === 'selector' && (
            <JobTypeSelector
              selectedJobType={extractedData.job_type}
              onSelectJobType={handleSelectJobTypeFromDropdown}
              onCancel={() => setJobValidationStep('review')}
            />
          )}

          {/* Validation Layer 5: Wage Category Preview */}
          {jobValidationStep === 'preview' && (
            <JobCategoryPreview
              jobType={extractedData.job_type}
              location={extractedData.location}
              onContinue={handleConfirmCategoryPreview}
              onChangeJobType={() => setJobValidationStep('selector')}
            />
          )}

          {/* Final Step: Confirmed Metrics Review Card & Proceed */}
          {jobValidationStep === 'complete' && (
            <>
              {showValidationWarning && validationResult && (
                <ValidationBanner
                  warning={validationResult.warning}
                  error={validationResult.error}
                  hoursWorked={extractedData.hours_worked}
                  onContinueAnyway={() => setShowValidationWarning(false)}
                  onEditEntry={() => setJobValidationStep('selector')}
                />
              )}

              <StructuredDataReview
                data={extractedData}
                onConfirm={handleStructuredDataConfirmed}
                onEdit={handleStructuredDataEdited}
              />

              <WageCard
                jobType={extractedData.job_type}
                hoursWorked={extractedData.hours_worked}
                location={extractedData.location}
              />

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setJobValidationStep('selector')}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-sm flex items-center gap-2"
                >
                  Modify Job Type
                </button>

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
            </>
          )}

        </div>
      )}

    </div>
  );
}

