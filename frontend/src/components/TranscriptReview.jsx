import React, { useState, useEffect } from 'react';
import { CheckCircle, Edit, RefreshCw, Volume2, Sparkles, Check, X } from 'lucide-react';

export default function TranscriptReview({ transcript, onConfirm, onReRecord }) {
  const [editedTranscript, setEditedTranscript] = useState(transcript || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditedTranscript(transcript || '');
  }, [transcript]);

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(editedTranscript);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/40 relative overflow-hidden shadow-2xl animate-fade-in space-y-6">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Volume2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              Validation Layer 1
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Transcript Detected
            </h3>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          Step 1 of 3: Transcript Review
        </span>
      </div>

      {/* Transcript Text Box or Inline Editor */}
      {!isEditing ? (
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-5 relative group">
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
            Speech-to-Text Conversion Output:
          </p>
          <blockquote className="text-lg sm:text-xl font-medium text-slate-100 italic leading-relaxed">
            "{editedTranscript}"
          </blockquote>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Edit Detected Transcript Text:
          </label>
          <textarea
            value={editedTranscript}
            onChange={(e) => setEditedTranscript(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl p-4 text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Edit work description transcript..."
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setEditedTranscript(transcript); setIsEditing(false); }}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <Check className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Required Validation Layer Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={handleConfirm}
          disabled={!editedTranscript.trim()}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
        >
          <CheckCircle className="w-5 h-5" />
          Confirm Transcript
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? 'Close Editor' : 'Edit Transcript'}
        </button>

        <button
          onClick={onReRecord}
          className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Re-record Audio
        </button>
      </div>
    </div>
  );
}
