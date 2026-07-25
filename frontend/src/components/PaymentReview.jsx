import React, { useState, useEffect } from 'react';
import { IndianRupee, Check, Edit3, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { validatePaymentAPI } from '../services/api';
import PaymentWarning from './PaymentWarning';
import AmountSuggestionCard from './AmountSuggestionCard';
import PaymentConfirmationModal from './PaymentConfirmationModal';

/**
 * PaymentReview Master Component
 * Validates worker payment entry, detects typos and anomalies, renders inline editing,
 * suggestion cards, warning level banners, and validation metadata.
 */
export default function PaymentReview({
  enteredAmount,
  expectedWage = 850.0,
  jobType = 'Worker',
  hoursWorked = 8.0,
  onConfirmPayment,
  onChangeAmount
}) {
  const [amountVal, setAmountVal] = useState(enteredAmount || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditedByUser, setIsEditedByUser] = useState(false);
  const [validationData, setValidationData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate amount whenever amountVal, expectedWage, or jobType changes
  useEffect(() => {
    const runValidation = async () => {
      if (amountVal === '' || amountVal === null || amountVal === undefined) {
        setValidationData(null);
        return;
      }

      setLoading(true);
      try {
        const res = await validatePaymentAPI({
          received_amount: amountVal,
          expected_wage: expectedWage,
          job_type: jobType,
          hours_worked: hoursWorked
        });
        setValidationData(res);
      } catch (err) {
        console.error('Error running payment validation:', err);
      } finally {
        setLoading(false);
      }
    };

    runValidation();
  }, [amountVal, expectedWage, jobType, hoursWorked]);

  const handleAcceptSuggestion = (suggested) => {
    setAmountVal(suggested);
    setIsEditedByUser(true);
    setIsEditing(false);
    if (onChangeAmount) onChangeAmount(suggested);
  };

  const handleManualInputChange = (e) => {
    const val = e.target.value;
    setAmountVal(val);
    setIsEditedByUser(true);
    if (onChangeAmount) onChangeAmount(val);
  };

  const handleConfirmClick = () => {
    if (!validationData || !validationData.valid) {
      alert(validationData?.message || "Please enter a valid payment amount greater than ₹0.");
      return;
    }

    // If High Warning level / anomaly exists, prompt confirmation modal
    if (validationData.warning_level === 'HIGH' && !isModalOpen) {
      setIsModalOpen(true);
      return;
    }

    executeConfirmation(validationData.original_amount);
  };

  const handleContinueAnyway = () => {
    setIsModalOpen(false);
    executeConfirmation(validationData?.original_amount || parseFloat(amountVal));
  };

  const executeConfirmation = (finalAmt) => {
    onConfirmPayment({
      original_amount: parseFloat(enteredAmount) || finalAmt,
      final_amount: finalAmt,
      edited_by_user: isEditedByUser || finalAmt !== parseFloat(enteredAmount),
      validation_status: validationData?.validation_status || "VALID",
      confidence: validationData?.confidence || 0.95,
      source: isEditedByUser ? "USER_CORRECTED" : "MANUAL_CONFIRMATION"
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700 space-y-6 animate-fade-in shadow-2xl">
      
      {/* 1. Colored Warning Level Banner */}
      {validationData && (
        <PaymentWarning
          warningLevel={validationData.warning_level}
          message={validationData.message}
        />
      )}

      {/* 2. Header & Amount Displays */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Smart Payment Validation
            </span>
            {validationData && (
              <span className="text-xs font-semibold text-slate-400">
                Confidence: {Math.round((validationData.confidence || 0.95) * 100)}%
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Received Payment Review
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-xs font-bold uppercase tracking-wider block text-slate-400">Statutory Benchmark</span>
            <span className="text-lg font-black text-cyan-300 flex items-center justify-end gap-0.5">
              <IndianRupee className="w-4 h-4 text-cyan-400" />{expectedWage.toFixed(2)}
            </span>
          </div>

          <div className="px-5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-right">
            <span className="text-xs font-bold uppercase tracking-wider block text-emerald-400">Entered Payout</span>
            <span className="text-2xl font-black text-white flex items-center justify-end gap-0.5">
              <IndianRupee className="w-5 h-5 text-emerald-400" />{parseFloat(amountVal || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. AI Suggestion Card */}
      {validationData?.has_typo && validationData?.suggested_amount && (
        <AmountSuggestionCard
          originalAmount={validationData.original_amount}
          suggestedAmount={validationData.suggested_amount}
          onAcceptSuggestion={handleAcceptSuggestion}
        />
      )}

      {/* 4. Inline Edit Control */}
      {isEditing ? (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
          <label className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 block">
            ✏ Inline Amount Edit (Enter Exact Payout)
          </label>
          <div className="relative max-w-xs">
            <IndianRupee className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
            <input
              type="number"
              min="1"
              step="1"
              value={amountVal}
              onChange={handleManualInputChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-black text-lg focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />

          </div>
        </div>
      ) : null}

      {/* 5. Action Buttons (Confirm, Edit, Continue) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all active:scale-95 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-cyan-400" />
            ✏ Edit Amount
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
          >
            Done Editing
          </button>
        )}

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {validationData?.warning_level === 'HIGH' && (
            <button
              type="button"
              onClick={handleContinueAnyway}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-all cursor-pointer"
            >
              Continue Anyway
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirmClick}
            disabled={!validationData?.valid}
            className={`flex-1 sm:flex-initial px-7 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
              !validationData?.valid
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
            }`}
          >
            <Check className="w-4 h-4 text-slate-950" />
            ✓ Confirm Amount
          </button>
        </div>
      </div>

      {/* 6. Modal Popup for High Anomaly Confirmation */}
      <PaymentConfirmationModal
        isOpen={isModalOpen}
        enteredAmount={validationData?.original_amount || amountVal}
        expectedWage={expectedWage}
        suggestedAmount={validationData?.suggested_amount}
        warningMessage={validationData?.message}
        onEditAmount={() => {
          setIsModalOpen(false);
          setIsEditing(true);
        }}
        onContinueAnyway={handleContinueAnyway}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}
