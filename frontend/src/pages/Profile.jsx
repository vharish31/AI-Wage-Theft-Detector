import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Globe, Lock, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [state, setState] = useState(user?.state || 'Tamil Nadu');
  const [language, setLanguage] = useState('English');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await updateProfile({
        name,
        phone,
        state,
        language,
        ...(newPassword ? { password: newPassword } : {})
      });
      setSavedSuccess(true);
      setNewPassword('');
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6 animate-fadeIn">
      
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          <User className="w-3.5 h-3.5" /> PROFILE MANAGEMENT
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          User Account Settings
        </h1>
        <p className="text-slate-400 text-sm">
          Update your worker contact information, location state jurisdiction, and security credentials.
        </p>
      </div>

      <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl space-y-6">
        
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-cyan-950/60">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name || 'Worker'}</h2>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            <span className="inline-block text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 mt-1">
              Role: {user?.role || 'USER'}
            </span>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-cyan-400" /> Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> State Jurisdiction
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Kerala">Kerala</option>
                <option value="Telangana">Telangana</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" /> Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Kannada">Kannada (கன்னடம்)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> New Password (Optional)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep existing password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Changes...' : 'Save Profile Settings'}
          </button>
        </form>

      </div>
    </div>
  );
}
