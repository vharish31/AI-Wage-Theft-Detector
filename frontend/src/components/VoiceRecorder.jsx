import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Edit3, CheckCircle2 } from 'lucide-react';

export default function VoiceRecorder({ onTranscriptComplete, isExtracting }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Browser Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English preset, also captures common Hinglish/Tamil terms

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access was denied. Please allow microphone permissions or type your work log manually below.');
        } else {
          setErrorMsg(`Voice error: ${event.error}. You can use manual text input below.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setErrorMsg('Web Speech API is not supported in this browser. Please use Google Chrome, Edge, or type manually.');
      setIsManualInput(true);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error('Start error:', err);
      }
    }
  };

  const handleSampleClick = (sampleText) => {
    setTranscript(sampleText);
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscriptComplete(transcript);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/60 relative overflow-hidden">
      
      {/* Background glow circle */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Speak Your Work Details
          </h2>
        </div>
        
        <button
          onClick={() => setIsManualInput(!isManualInput)}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          {isManualInput ? 'Switch to Mic' : 'Type Manually'}
        </button>
      </div>

      {!isManualInput ? (
        <div className="flex flex-col items-center justify-center py-6">
          
          {/* Audio Visualizer Waves */}
          <div className="relative mb-8 flex items-center justify-center">
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-75">
                <div className="w-1.5 bg-cyan-400 rounded-full animate-wave-1" />
                <div className="w-1.5 bg-blue-400 rounded-full animate-wave-2" />
                <div className="w-1.5 bg-cyan-300 rounded-full animate-wave-3" />
                <div className="w-1.5 bg-sky-400 rounded-full animate-wave-4" />
                <div className="w-1.5 bg-blue-500 rounded-full animate-wave-5" />
              </div>
            )}

            <button
              onClick={toggleListening}
              disabled={isExtracting}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-500 to-red-600 shadow-rose-500/40 ring-8 ring-rose-500/20 animate-pulse'
                  : 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-500/30 hover:scale-105 ring-4 ring-cyan-500/10'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </button>
          </div>

          <p className="text-sm font-semibold text-slate-300 mb-2">
            {isListening ? 'Listening... Speak clearly now' : 'Click microphone button to record voice log'}
          </p>
          <p className="text-xs text-slate-400 text-center max-w-md">
            Say something like: <span className="text-cyan-300 italic">"Today I worked 8 hours as a construction worker in Chennai."</span>
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Type or Edit Work Log
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={4}
            placeholder="Type your work details here (e.g. Today I worked 8 hours as a delivery partner in Bengaluru)"
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-base"
          />
        </div>
      )}

      {/* Real-time Live Transcript Box */}
      {transcript && !isManualInput && (
        <div className="mb-6 bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" /> Live Transcript
            </span>
            <button 
              onClick={() => setTranscript('')} 
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Clear
            </button>
          </div>
          <p className="text-slate-100 text-base font-medium leading-relaxed">
            "{transcript}"
          </p>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Preset Sample Prompts */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-slate-400 block mb-2">
          Or click a sample voice prompt:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            'Today I worked 8 hours as a construction worker in Chennai',
            'I worked 10 hours as a delivery partner in Bengaluru',
            'Worked 8 hours as a painter in Mumbai',
            'Worked 9 hours as an electrician in Delhi'
          ].map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSampleClick(sample)}
              className="text-xs bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700 hover:border-cyan-500/40 px-3 py-1.5 rounded-lg transition-all text-left"
            >
              "{sample}"
            </button>
          ))}
        </div>
      </div>

      {/* Submit / Extract CTA Button */}
      <button
        onClick={handleSubmit}
        disabled={!transcript.trim() || isExtracting}
        className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
          transcript.trim() && !isExtracting
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25 active:scale-[0.99]'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
        }`}
      >
        {isExtracting ? (
          <>
            <Sparkles className="w-5 h-5 animate-spin text-cyan-300" />
            Analyzing Work Details with Gemini AI...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-cyan-300" />
            Extract Work Info with AI
          </>
        )}
      </button>

    </div>
  );
}
