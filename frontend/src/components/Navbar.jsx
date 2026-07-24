import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mic, FileCheck, AlertTriangle, Scale, Lock, CheckCircle2 } from 'lucide-react';

export default function Navbar({ hasStarted, workData, auditResult }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);

  const isStep1Unlocked = Boolean(hasStarted || workData);
  const isStep1Complete = Boolean(workData && workData.job_type && workData.hours_worked && workData.location);
  const isStep2Complete = Boolean(auditResult);

  const navItems = [
    { path: '/', label: 'Home', icon: Scale, unlocked: true },
    { path: '/voice-log', label: '1. Voice Log', icon: Mic, unlocked: isStep1Unlocked, requiredStep: 'Click Start Detection on Home tab first' },
    { path: '/verification', label: '2. Verify Payment', icon: FileCheck, unlocked: isStep1Complete, requiredStep: 'Complete Voice Log details first' },
    { path: '/report', label: '3. Theft Audit Report', icon: AlertTriangle, unlocked: isStep2Complete, requiredStep: 'Complete Payment Verification first' },
  ];

  const handleNavClick = (e, item) => {
    if (!item.unlocked) {
      e.preventDefault();
      setToastMessage(item.requiredStep);
      setTimeout(() => setToastMessage(null), 3000);
      if (!isStep1Unlocked) {
        navigate('/');
      } else if (!isStep1Complete) {
        navigate('/voice-log');
      } else if (!isStep2Complete) {
        navigate('/verification');
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  AI Wage Theft Detector
                </span>
                <span className="bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-cyan-500/20 hidden sm:inline-block">
                  AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden md:block">
                Every Hour Counted. Every Rupee Protected.
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2 relative">
            
            {/* Toast Warning Popup for Locked Steps */}
            {toastMessage && (
              <div className="absolute -bottom-10 right-0 bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-lg border border-amber-400 animate-bounce flex items-center gap-1.5 z-50">
                <Lock className="w-3.5 h-3.5" />
                <span>{toastMessage}</span>
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isUnlocked = item.unlocked;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                      : isUnlocked
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      : 'text-slate-500 cursor-not-allowed opacity-60 hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : isUnlocked ? 'text-slate-400' : 'text-slate-600'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                  {!isUnlocked && (
                    <Lock className="w-3 h-3 text-amber-400/80 hidden sm:inline" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
