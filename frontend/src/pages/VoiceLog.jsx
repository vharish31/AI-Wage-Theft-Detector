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
import LocationDetector from '../components/LocationDetector';
import LocationSelector from '../components/LocationSelector';
import LocationReview from '../components/LocationReview';
import HoursSelector from '../components/HoursSelector';
import { extractSpeechData, validateWorkDataAPI, normalizeJobAPI, validateLocationAPI } from '../services/api';
import { normalizeJobType } from '../utils/jobAliases';
import { resolveLocationState } from '../utils/locationHelper';
import { Sparkles, ArrowRight, CheckCircle2, RefreshCw, ShieldCheck, MapPin, Clock } from 'lucide-react';

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

  // Location Validation Layer state: 'check' | 'detector' | 'selector' | 'review' | 'confirmed'
  const [locationStep, setLocationStep] = useState('check');

  // Work Hours Resolution state: 'check' | 'selector' | 'confirmed'
  const [hoursStep, setHoursStep] = useState('check');

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
    setLocationStep('check');
    setHoursStep('check');
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

      const normalizedJob = normalizeJobType(data.job_type);
      const loc = data.location && String(data.location).trim() && String(data.location).toLowerCase() !== 'unknown'
        ? String(data.location).trim()
        : '';
      const hrs = data.hours_worked && Number(data.hours_worked) > 0 ? Number(data.hours_worked) : null;

      const structuredData = {
        ...data,
        job_type: normalizedJob,
        location: loc,
        hours_worked: hrs
      };

      setExtractedData(structuredData);
      setWorkData(structuredData);
      setJobValidationStep('review');

      // Check Location
      if (!loc) {
        setLocationStep('detector');
      } else {
        setLocationStep('review');
      }

      // Check Hours
      if (!hrs) {
        setHoursStep('selector');
      } else {
        setHoursStep('confirmed');
      }

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
    setLocationStep('check');
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

  // Location Layer Handlers
  const handleLocationDetectedGPS = (gpsLocation) => {
    const updated = {
      ...extractedData,
      location: gpsLocation.city,
      state: gpsLocation.state
    };
    setExtractedData(updated);
    setWorkData(updated);
    setLocationStep('review');
  };

  const handleLocationSelectedManual = (manualLoc) => {
    const updated = {
      ...extractedData,
      location: manualLoc.city,
      state: manualLoc.state
    };
    setExtractedData(updated);
    setWorkData(updated);
    setLocationStep('review');
  };

  const handleConfirmLocationReview = (locConfirmed) => {
    const updated = {
      ...extractedData,
      location: locConfirmed.city,
      state: locConfirmed.state
    };
    setExtractedData(updated);
    setWorkData(updated);
    setLocationStep('confirmed');
  };

  const handleHoursSelected = (confirmedHours) => {
    const updated = {
      ...extractedData,
      hours_worked: confirmedHours
    };
    setExtractedData(updated);
    setWorkData(updated);
    setHoursStep('confirmed');
    runValidationCheck(updated);
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
    if (extractedData && extractedData.location) {
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
    setLocationStep('check');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Workflow Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          LOCATION RESOLUTION & JOB TYPE VALIDATION SYSTEM
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Record & Validate Work Details
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Speak your shift details naturally. Our multi-layer validation engine resolves missing location data via GPS or manual selection, standardizes job titles, and previews statutory daily wages before analysis.
        </p>
      </div>

      {/* 1. Voice Recorder */}
      {!rawTranscript && (
        <VoiceRecorder
          onTranscriptComplete={handleRawTranscriptCaptured}
          isExtracting={isExtracting}
        />
      )}

      {/* 2. Transcript Review Screen */}
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
          title="AI Extraction, Location Resolution & Job Normalization"
          steps={extractionSteps}
          activeStepIndex={activeStepIndex}
          isProcessing={isExtracting}
        />
      )}

      {/* 3. Validation & Resolution Layers */}
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

          {/* Validation Layer Warning if Location Missing */}
          {(!extractedData.location || locationStep === 'detector') && (
            <div className="bg-amber-950/80 border border-amber-500/50 rounded-xl p-4 flex items-center justify-between text-amber-200">
              <div className="flex items-center gap-2 text-sm font-bold">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>⚠ Location required for accurate wage calculation.</span>
              </div>
              {locationStep !== 'detector' && (
                <button
                  type="button"
                  onClick={() => setLocationStep('detector')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold"
                >
                  Resolve Location
                </button>
              )}
            </div>
          )}

          {/* Validation Layer Warning if Hours Missing */}
          {(!extractedData.hours_worked || hoursStep === 'selector') && (
            <div className="bg-amber-950/80 border border-amber-500/50 rounded-xl p-4 flex items-center justify-between text-amber-200">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>⚠ Work shift duration required for accurate wage calculation.</span>
              </div>
              {hoursStep !== 'selector' && (
                <button
                  type="button"
                  onClick={() => setHoursStep('selector')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold"
                >
                  Specify Hours
                </button>
              )}
            </div>
          )}

          {/* Hours Duration Resolution Selector */}
          {(!extractedData.hours_worked || hoursStep === 'selector') && (
            <HoursSelector
              initialHours={extractedData.hours_worked}
              onHoursSelected={handleHoursSelected}
            />
          )}

          {/* Layer 2: GPS Location Detector */}
          {locationStep === 'detector' && (
            <LocationDetector
              onLocationDetected={handleLocationDetectedGPS}
              onSelectManually={() => setLocationStep('selector')}
            />
          )}

          {/* Layer 3: Manual Location Selector */}
          {locationStep === 'selector' && (
            <LocationSelector
              initialCity={extractedData.location}
              initialState={extractedData.state}
              onLocationSelected={handleLocationSelectedManual}
              onCancel={() => setLocationStep(extractedData.location ? 'review' : 'detector')}
            />
          )}

          {/* Layer 4: Location Confirmation Screen */}
          {locationStep === 'review' && extractedData.location && (
            <LocationReview
              locationData={extractedData}
              onConfirmLocation={handleConfirmLocationReview}
              onChangeLocation={() => setLocationStep('selector')}
            />
          )}

          {/* Job Type Validation Flow (shown once location is resolved / reviewed / confirmed) */}
          {(locationStep === 'confirmed' || (extractedData.location && locationStep !== 'detector' && locationStep !== 'selector')) && (
            <>
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
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setJobValidationStep('selector')}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs"
                      >
                        Modify Job Role
                      </button>

                      <button
                        type="button"
                        onClick={() => setLocationStep('selector')}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 font-bold text-xs"
                      >
                        Modify Location
                      </button>
                    </div>

                    <button
                      onClick={handleProceed}
                      disabled={!extractedData.location || !extractedData.hours_worked || (validationResult?.error && showValidationWarning)}
                      className={`w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-base shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 ${
                        !extractedData.location || !extractedData.hours_worked || (validationResult?.error && showValidationWarning)
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
            </>
          )}

        </div>
      )}

    </div>
  );
}


