import React, { useState, useEffect } from 'react';
import { Briefcase, Clock, MapPin, CheckCircle, Edit3, Save, X, Sparkles } from 'lucide-react';

export default function StructuredDataReview({ data, onConfirm, onEdit }) {
  const [jobType, setJobType] = useState(data?.job_type || 'Construction Worker');
  const [hoursWorked, setHoursWorked] = useState(data?.hours_worked || 8);
  const [location, setLocation] = useState(data?.location || 'Chennai');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (data) {
      setJobType(data.job_type || 'Construction Worker');
      setHoursWorked(data.hours_worked ?? 8);
      setLocation(data.location || 'Chennai');
    }
  }, [data]);

  const handleSaveInlineEdit = () => {
    setIsEditing(false);
    if (onEdit) {
      onEdit({
        ...data,
        job_type: jobType,
        hours_worked: Number(hoursWorked),
        location: location
      });
    }
  };

  const handleConfirm = () => {
    const updatedData = {
      ...data,
      job_type: jobType,
      hours_worked: Number(hoursWorked),
      location: location
    };
    if (onConfirm) {
      onConfirm(updatedData);
    }
  };

  const jobRoles = [
    'Construction Worker',
    'Delivery Partner',
    'Painter',
    'Electrician',
    'Security Guard',
    'Domestic Worker',
    'Carpenter',
    'Sanitation Worker',
    'Mason',
    'Factory Worker',
    'Freelancer',
    'Plumber'
  ];

  const locations = [
    'Chennai',
    'Mumbai',
    'Bengaluru',
    'Delhi',
    'Kolkata',
    'Hyderabad',
    'Pune'
  ];

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 relative overflow-hidden shadow-2xl animate-fade-in space-y-6">
      
      {/* Header & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              Validation Layer 2
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Detected Information
            </h3>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          AI Gemini Extraction Output
        </span>
      </div>

      {!isEditing ? (
        /* Static Summary Display */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Job Type</span>
            </div>
            <p className="text-lg font-black text-white truncate">
              {jobType}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Hours Worked</span>
            </div>
            <p className="text-lg font-black text-white">
              {hoursWorked} <span className="text-sm font-semibold text-slate-400">hrs</span>
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Location</span>
            </div>
            <p className="text-lg font-black text-white truncate">
              {location}
            </p>
          </div>

        </div>
      ) : (
        /* Inline Editing Form */
        <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Inline Detailed Editor
            </span>
            <span className="text-xs text-slate-400">Modify extracted parameters below</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Job Type Edit */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-cyan-500"
              >
                {jobRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Hours Worked Edit */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hours Worked
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Location Edit */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-cyan-500"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              onClick={handleSaveInlineEdit}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <Save className="w-3.5 h-3.5" /> Save Values
            </button>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={handleConfirm}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
        >
          <CheckCircle className="w-5 h-5" />
          Confirm Details
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Edit3 className="w-4 h-4" />
          {isEditing ? 'Close Editor' : 'Edit Details'}
        </button>
      </div>

    </div>
  );
}
