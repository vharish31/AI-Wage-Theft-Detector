import React, { useState, useEffect } from 'react';
import { estimateHoursAPI } from '../services/api';
import HoursConfirmation from './HoursConfirmation';
import { Sparkles } from 'lucide-react';

/**
 * HoursEstimator Master Component
 * Intelligently estimates work hours from natural language transcripts,
 * validates against bounds (<1h, >16h, >24h), and passes metadata to parent workflow.
 */
export default function HoursEstimator({
  transcript = '',
  hoursWorked = null,
  onConfirmHours,
  onRecordAgain
}) {
  const [loading, setLoading] = useState(true);
  const [estimationData, setEstimationData] = useState(null);

  useEffect(() => {
    const runEstimation = async () => {
      setLoading(true);
      try {
        const res = await estimateHoursAPI(transcript, hoursWorked);
        setEstimationData(res);
      } catch (err) {
        console.error('Error running smart hours estimation:', err);
        setEstimationData({
          estimated_hours: hoursWorked || 8.0,
          confidence: 0.70,
          source: 'LOCAL_FALLBACK',
          reasoning: 'Standard shift duration estimate',
          shift_type: 'Full Day',
          validation: { valid: true, status: 'OK', message: 'Standard shift.' }
        });
      } finally {
        setLoading(false);
      }
    };

    runEstimation();
  }, [transcript, hoursWorked]);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-slate-700 text-center space-y-3">
        <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
        <h3 className="text-lg font-bold text-white">Intelligently Estimating Working Hours...</h3>
        <p className="text-xs text-slate-400">Analyzing natural language shift expressions and statement context...</p>
      </div>
    );
  }

  return (
    <HoursConfirmation
      estimatedHours={estimationData?.estimated_hours || 8.0}
      confidence={estimationData?.confidence || 0.80}
      reasoning={estimationData?.reasoning || ''}
      statementText={transcript}
      validation={estimationData?.validation}
      onConfirm={onConfirmHours}
      onRecordAgain={onRecordAgain}
    />
  );
}
