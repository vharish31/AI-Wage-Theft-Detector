import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mic, AlertTriangle, FileText, ArrowRight, Scale, CheckCircle, Sparkles } from 'lucide-react';

export default function Home({ onStartDetection }) {
  const navigate = useNavigate();

  const handleStart = () => {
    if (onStartDetection) {
      onStartDetection();
    }
    navigate('/voice-log');
  };

  return (
    <div className="space-y-16 py-6 sm:py-10">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl glass-card border border-slate-800 p-8 sm:p-12 lg:p-16">
        
        {/* Background Glowing Ambient Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-bold tracking-wide">
            <Sparkles className="w-4 h-4" />
            AI-POWERED WORKER FAIR WAGE PROTECTION
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            AI Wage Theft Detector
          </h1>

          {/* Subtitle / Tagline */}
          <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-200 to-emerald-300 bg-clip-text text-transparent">
            Every Hour Counted. Every Rupee Protected.
          </p>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
            Millions of gig workers, construction laborers, delivery partners, and informal workers are underpaid every day. Speak your work details, automatically audit minimum wage laws, detect underpayment, and generate legal complaint reports instantly.
          </p>

          {/* CTA Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-lg shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <Mic className="w-6 h-6 animate-pulse" />
              Start Detection
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      {/* WORKFLOW HOW IT WORKS */}
      <section className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How AI Wage Theft Detector Works
          </h2>
          <p className="text-slate-400 text-sm">
            4 simple steps to protect your hard-earned income
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mb-4 text-lg">
              1
            </div>
            <h3 className="font-bold text-white text-base mb-2">Speak Work Details</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use voice recording in your browser to state your job role, hours worked, and location.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center mb-4 text-lg">
              2
            </div>
            <h3 className="font-bold text-white text-base mb-2">AI Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini AI extracts job type, hours, and location into structured digital cards.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mb-4 text-lg">
              3
            </div>
            <h3 className="font-bold text-white text-base mb-2">Wage Rate Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare wages against benchmark minimum wage datasets to compute theft risk score.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mb-4 text-lg">
              4
            </div>
            <h3 className="font-bold text-white text-base mb-2">Generate Legal Complaint</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get an instant AI-generated legal complaint letter & downloadable PDF audit report.
            </p>
          </div>

        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-sm border border-cyan-500/30 transition-all"
          >
            Launch Voice Logger Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}

