import React, { useState } from 'react';
import ModernNumberInput from './ModernNumberInput';
import { TASK_TYPES } from '../utils/gigDetector';
import { calculateGigAudit, validateGigTaskInputs } from '../utils/gigCalculator';
import { Package, IndianRupee, Layers, Clock, Gift, ShieldAlert, ChevronDown, ChevronUp, AlertCircle, Info } from 'lucide-react';

export default function GigTaskForm({ taskDetails, setTaskDetails, onSubmit }) {
  const [showBonuses, setShowBonuses] = useState(false);
  const [showDeductions, setShowDeductions] = useState(false);

  const handleChange = (field, value) => {
    setTaskDetails((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const calculated = calculateGigAudit(taskDetails);
  const validation = validateGigTaskInputs(taskDetails);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" />
              Task & Payout Information
            </h3>
            <p className="text-xs text-slate-400">Enter completed task volume and per-task payment rates</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Base: ₹{calculated.base_earnings}
          </span>
        </div>

        {/* Task Type selector & Task Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Task Type
            </label>
            <select
              value={taskDetails.taskType}
              onChange={(e) => handleChange('taskType', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              {TASK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <ModernNumberInput
            label="Completed Tasks / Orders"
            value={taskDetails.completedTasks}
            onChange={(val) => handleChange('completedTasks', val)}
            placeholder="e.g. 25"
            min={1}
            step={1}
            unit="Tasks"
            required={true}
          />
        </div>

        {/* Rate per task & Actual payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ModernNumberInput
            label="Expected Rate Per Task"
            value={taskDetails.ratePerTask}
            onChange={(val) => handleChange('ratePerTask', val)}
            placeholder="e.g. 35"
            prefix="₹"
            min={1}
            step={1}
            required={true}
          />

          <ModernNumberInput
            label="Actual Payment Received"
            value={taskDetails.actualPayment}
            onChange={(val) => handleChange('actualPayment', val)}
            placeholder="e.g. 720"
            prefix="₹"
            min={0}
            step={1}
            required={true}
          />
        </div>

        {/* Optional Working Hours */}
        <div className="pt-1">
          <ModernNumberInput
            label="Shift Working Hours (Optional)"
            value={taskDetails.workingHours}
            onChange={(val) => handleChange('workingHours', val)}
            placeholder="e.g. 8"
            unit="Hours"
            min={1}
            max={24}
            step={0.5}
          />
        </div>

        {/* ACCORDION: Optional Incentives & Bonuses */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
          <button
            type="button"
            onClick={() => setShowBonuses(!showBonuses)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-800/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">
                Incentives, Bonuses & Tips (Optional)
              </span>
              {calculated.total_bonuses + calculated.total_tips > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  +₹{calculated.total_bonuses + calculated.total_tips}
                </span>
              )}
            </div>
            {showBonuses ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showBonuses && (
            <div className="p-4 space-y-3.5 border-t border-slate-800/80 bg-slate-950/60 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ModernNumberInput
                  label="Peak Hour Bonus"
                  value={taskDetails.peakHourBonus}
                  onChange={(val) => handleChange('peakHourBonus', val)}
                  prefix="₹"
                  placeholder="0"
                />
                <ModernNumberInput
                  label="Rain / Weather Surge"
                  value={taskDetails.rainBonus}
                  onChange={(val) => handleChange('rainBonus', val)}
                  prefix="₹"
                  placeholder="0"
                />
                <ModernNumberInput
                  label="Festival Bonus"
                  value={taskDetails.festivalBonus}
                  onChange={(val) => handleChange('festivalBonus', val)}
                  prefix="₹"
                  placeholder="0"
                />
                <ModernNumberInput
                  label="Night Incentive"
                  value={taskDetails.nightIncentive}
                  onChange={(val) => handleChange('nightIncentive', val)}
                  prefix="₹"
                  placeholder="0"
                />
                <ModernNumberInput
                  label="Customer Tips Received"
                  value={taskDetails.tips}
                  onChange={(val) => handleChange('tips', val)}
                  prefix="₹"
                  placeholder="0"
                />
                <ModernNumberInput
                  label="Referral / Other Bonus"
                  value={taskDetails.otherBonuses}
                  onChange={(val) => handleChange('otherBonuses', val)}
                  prefix="₹"
                  placeholder="0"
                />
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION: Optional Platform Deductions */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
          <button
            type="button"
            onClick={() => setShowDeductions(!showDeductions)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-800/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-semibold text-slate-200">
                Platform Deductions & Fuel Costs (Optional)
              </span>
              {calculated.total_deductions > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                  -₹{calculated.total_deductions}
                </span>
              )}
            </div>
            {showDeductions ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showDeductions && (
            <div className="p-4 space-y-3.5 border-t border-slate-800/80 bg-slate-950/60 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ModernNumberInput
                  label="Fuel Expenses Out-of-pocket"
                  value={taskDetails.fuelCost}
                  onChange={(val) => handleChange('fuelCost', val)}
                  prefix="₹"
                  placeholder="0"
                />
                <ModernNumberInput
                  label="Platform Commission / Cut"
                  value={taskDetails.platformCommission}
                  onChange={(val) => handleChange('platformCommission', val)}
                  prefix="₹"
                  placeholder="0"
                />
                <ModernNumberInput
                  label="Late Delivery Penalty"
                  value={taskDetails.latePenalty}
                  onChange={(val) => handleChange('latePenalty', val)}
                  prefix="₹"
                  placeholder="0"
                />
                <ModernNumberInput
                  label="Order Cancellation Fee"
                  value={taskDetails.cancellationFee}
                  onChange={(val) => handleChange('cancellationFee', val)}
                  prefix="₹"
                  placeholder="0"
                />
                <ModernNumberInput
                  label="Insurance Deduction"
                  value={taskDetails.insuranceDeduction}
                  onChange={(val) => handleChange('insuranceDeduction', val)}
                  prefix="₹"
                  placeholder="0"
                />
                <ModernNumberInput
                  label="Bag / Uniform / Equipment Rent"
                  value={taskDetails.equipmentRent}
                  onChange={(val) => handleChange('equipmentRent', val)}
                  prefix="₹"
                  placeholder="0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Validation Errors/Warnings Banner */}
        {validation.warnings.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 flex items-start gap-2.5 text-amber-300 text-xs">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              {validation.warnings.map((w, idx) => (
                <p key={idx}>{w}</p>
              ))}
            </div>
          </div>
        )}

        {/* Real-time Calculation Summary Bar */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-900/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Gross Expected</p>
            <p className="text-sm font-bold text-white">₹{calculated.gross_earnings}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Net Expected</p>
            <p className="text-sm font-bold text-cyan-400">₹{calculated.net_expected_payment}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Received</p>
            <p className="text-sm font-bold text-slate-300">₹{calculated.actual_payment}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Shortfall</p>
            <p className={`text-sm font-bold ${calculated.difference > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              ₹{calculated.difference}
            </p>
          </div>
        </div>

        {onSubmit && (
          <button
            type="button"
            onClick={() => onSubmit(calculated)}
            disabled={!validation.isValid}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-lg shadow-cyan-950/50 transition-all cursor-pointer disabled:opacity-50"
          >
            Audit Gig Worker Payment
          </button>
        )}
      </div>
    </div>
  );
}
