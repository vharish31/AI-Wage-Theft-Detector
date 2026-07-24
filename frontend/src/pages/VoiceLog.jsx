import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceRecorder from '../components/VoiceRecorder';
import WageCard from '../components/WageCard';
import ProcessFlowStepper from '../components/ProcessFlowStepper';
import { extractSpeechData } from '../services/api';
import { Sparkles, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

export default function VoiceLog({ workData, setWorkData }) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [extractedData, setExtractedData] = useState(workData || null);
  const navigate = useNavigate();

  const extractionSteps = [
    { title: 'Voice Input Analysis', desc: 'Analyzing audio transcript' },
    { title: 'Gemini AI Parsing', desc: 'Extracting job, hours & location' },
    { title: 'Structuring Record', desc: 'Formatting verification metrics' }
  ];

  const handleTranscriptComplete = async (transcriptText) => {
    setIsExtracting(true);
    setActiveStepIndex(0);
    setExtractedData(null);

    // Step 1: Voice Analysis
    await new Promise(r => setTimeout(r, 400));
    setActiveStepIndex(1);

    try {
      // Step 2: Gemini AI Call
      const data = await extractSpeechData(transcriptText);
      
      // Step 3: Structuring Record
      await new Promise(r => setTimeout(r, 500));
      setActiveStepIndex(2);
      
      await new Promise(r => setTimeout(r, 300));
      setExtractedData(data);
      setWorkData(data);
    } catch (err) {
      console.error('Error extracting speech:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleProceed = () => {
    if (extractedData) {
      navigate('/verification');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Workflow Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          STEP 1 & 2: VOICE RECORDING & AI EXTRACTION
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Record Your Work Details
        </h1>
        <p className="text-slate-400 text-sm">
          Speak naturally about your shift, job role, and location. Our AI engine will extract structured metrics automatically.
        </p>
      </div>

      {/* Voice Recorder Component */}
      <VoiceRecorder
        onTranscriptComplete={handleTranscriptComplete}
        isExtracting={isExtracting}
      />

      {/* Live Horizontal Process Stepper */}
      {isExtracting && (
        <ProcessFlowStepper
          title="AI Extraction Process Flow"
          steps={extractionSteps}
          activeStepIndex={activeStepIndex}
          isProcessing={isExtracting}
        />
      )}

      {/* Extracted Data Card Display */}
      {extractedData && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Structured AI Extraction Result
            </h2>
            <button
              onClick={() => { setExtractedData(null); setWorkData(null); }}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Record
            </button>
          </div>

          <WageCard
            jobType={extractedData.job_type}
            hoursWorked={extractedData.hours_worked}
            location={extractedData.location}
          />

          {/* Proceed CTA */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleProceed}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
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
