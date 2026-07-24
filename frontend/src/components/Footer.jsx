import React from 'react';
import { ShieldCheck, PhoneCall, Heart, Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-slate-800/80 mt-20 pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <span className="font-bold text-lg text-white">AI Wage Theft Detector</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Empowering informal, construction, and gig workers with voice-driven AI audit logs, statutory wage verification, and formal legal complaint generation.
            </p>
            <p className="text-xs font-semibold text-cyan-400">
              Tagline: Every Hour Counted. Every Rupee Protected.
            </p>
          </div>

          {/* Emergency Labor Helplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-400" /> Labor Helplines (India)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="block font-semibold text-slate-300">Shram Suvidha Helpline:</span>
                <a href="tel:18001801610" className="text-cyan-400 hover:underline">1800-180-1610 (Toll Free)</a>
              </li>
              <li>
                <span className="block font-semibold text-slate-300">National Legal Aid (NALSA):</span>
                <a href="tel:15100" className="text-cyan-400 hover:underline">15100</a>
              </li>
              <li>
                <span className="block font-semibold text-slate-300">Gig Workers Welfare Helpline:</span>
                <span className="text-slate-400">1800-200-1099</span>
              </li>
            </ul>
          </div>

          {/* Legal Frameworks */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-cyan-400" /> Statutory Acts
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Minimum Wages Act, 1948</li>
              <li>• Payment of Wages Act, 1936</li>
              <li>• Building & Construction Workers Act</li>
              <li>• Code on Social Security (Gig Workers)</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI Wage Theft Detector. Dedicated to Social Impact & Worker Protection.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Gig & Informal Laborers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
