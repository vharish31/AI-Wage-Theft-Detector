import React, { useState } from 'react';
import { Edit3, CheckCircle2, RefreshCw } from 'lucide-react';

export default function TranscriptReview({ transcript, onConfirm, onReRecord }) {
  const [editedTranscript, setEditedTranscript] = useState(transcript || '');

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-700 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Edit3 className="w-4 h-4" /> Review Speech Recognition Transcript
        </h3>
        <button
          onClick={onReRecord}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-record
        </button>
      </div>

      <textarea
        value={editedTranscript}
        onChange={(e) => setEditedTranscript(e.target.value)}
        rows={3}
        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
      />

      <button
        onClick={() => onConfirm(editedTranscript)}
        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
      >
        <CheckCircle2 className="w-4 h-4" /> Confirm & Process Transcript
      </button>
    </div>
  );
}
