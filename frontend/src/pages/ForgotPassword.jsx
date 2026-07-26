import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Reset Password</h1>
        <p className="text-slate-400 text-xs">Enter your registered email to receive a password reset link</p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Reset Link Sent</h3>
          <p className="text-xs text-slate-300">
            Password reset instructions have been sent to <span className="text-cyan-400 font-bold">{email}</span>.
          </p>
          <Link
            to="/login"
            className="block py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700"
          >
            Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Registered Email</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@wagedetector.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-950/50 cursor-pointer"
          >
            Send Reset Instructions
          </button>
        </form>
      )}
    </div>
  );
}
