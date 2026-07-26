import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, LogIn, Sparkles, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e, customEmail = null, customPassword = null) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(loginEmail, loginPassword, rememberMe);
      if (res.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/verify-method', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoUserLogin = () => {
    setEmail('user@wagedetector.com');
    setPassword('User@123');
    handleLogin(null, 'user@wagedetector.com', 'User@123');
  };

  const handleDemoAdminLogin = () => {
    setEmail('admin@wagedetector.com');
    setPassword('Admin@123');
    handleLogin(null, 'admin@wagedetector.com', 'Admin@123');
  };

  const handleDemoShwethaLogin = () => {
    setEmail('shwetha@wagedetector.com');
    setPassword('User@123');
    handleLogin(null, 'shwetha@wagedetector.com', 'User@123');
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-xl shadow-cyan-950/80 mb-2">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          AI Wage Theft Detector
        </h1>
      </div>

      {/* Main Login Form Card */}
      <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <LogIn className="w-5 h-5 text-cyan-400" />
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400">Sign in to access your worker dashboard or admin panel</p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@wagedetector.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300">
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
              />
              <span>Remember Me</span>
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* DEMO CREDENTIALS SECTION */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 text-center">
            ⚡ Quick Demo Accounts
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* User Login Card (Harish) */}
            <button
              type="button"
              onClick={handleDemoUserLogin}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">Harish (User)</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">user@wagedetector.com</p>
              <p className="text-[10px] text-cyan-400 font-mono font-bold mt-1">Click to Login →</p>
            </button>

            {/* User Login Card (Shwetha) */}
            <button
              type="button"
              onClick={handleDemoShwethaLogin}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-xs font-bold text-white group-hover:text-purple-300 truncate">Shwetha (User)</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">shwetha@wagedetector.com</p>
              <p className="text-[10px] text-purple-400 font-mono font-bold mt-1">Click to Login →</p>
            </button>

            {/* Admin Login Card */}
            <button
              type="button"
              onClick={handleDemoAdminLogin}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-white group-hover:text-amber-300 truncate">Admin Role</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">admin@wagedetector.com</p>
              <p className="text-[10px] text-amber-400 font-mono font-bold mt-1">Click to Login →</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
