import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { detectWageTheft, validateWorkDataAPI } from '../services/api';
import ProcessFlowStepper from '../components/ProcessFlowStepper';
import ValidationBanner from '../components/ValidationBanner';
import { IndianRupee, ShieldAlert, ArrowRight, Briefcase, Clock, MapPin, Sparkles } from 'lucide-react';

export default function Verification({ workData, setAuditResult }) {
  const navigate = useNavigate();

  const [jobType, setJobType] = useState(workData?.job_type || 'Construction Worker');
  const [hoursWorked, setHoursWorked] = useState(workData?.hours_worked || 8);
  const [location, setLocation] = useState(workData?.location || 'Chennai');
  const [receivedAmount, setReceivedAmount] = useState(600);
  const [workerName, setWorkerName] = useState('Worker');
  const [isChecking, setIsChecking] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const [validationResult, setValidationResult] = useState(null);
  const [showValidationWarning, setShowValidationWarning] = useState(false);

  const verificationSteps = [
    { title: 'Gazette Rate Lookup', desc: 'Fetching state minimum wage rules' },
    { title: 'Underpayment Audit', desc: 'Cross-auditing received payout' },
    { title: 'Risk Score Engine', desc: 'Computing severity risk score' }
  ];

  // Run Validation Layer 3 checks when inputs change
  useEffect(() => {
    const checkValidation = async () => {
      try {
        const valRes = await validateWorkDataAPI({
          job_type: jobType,
          hours_worked: Number(hoursWorked),
          location: location,
          received_amount: Number(receivedAmount)
        });

        setValidationResult(valRes);

        if (valRes.warning || valRes.error || (valRes.warnings && valRes.warnings.length > 0)) {
          setShowValidationWarning(true);
        } else {
          setShowValidationWarning(false);
        }
      } catch (err) {
        console.error('Validation error on verification:', err);
      }
    };

    checkValidation();
  }, [jobType, hoursWorked, location, receivedAmount]);

  const handleCheckWageTheft = async (e) => {
    e.preventDefault();

    // Block submission if there is a hard validation error and user hasn't cleared it
    if (validationResult?.error && showValidationWarning) {
      return;
    }

    if (!receivedAmount || Number(receivedAmount) < 0) return;

    setIsChecking(true);
    setActiveStepIndex(0);

    // Step 1: Gazette Rate Lookup
    await new Promise(r => setTimeout(r, 400));
    setActiveStepIndex(1);

    try {
      // Step 2: Underpayment Audit API
      const result = await detectWageTheft({
        job_type: jobType,
        location: location,
        received_amount: parseFloat(receivedAmount),
        hours_worked: parseFloat(hoursWorked)
      });
      
      // Step 3: Risk Score Engine
      await new Promise(r => setTimeout(r, 500));
      setActiveStepIndex(2);
      
      await new Promise(r => setTimeout(r, 400));
      result.worker_name = workerName;

      setAuditResult(result);
      navigate('/report');
    } catch (err) {
      console.error('Error running wage detection:', err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      
      {/* Page Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          STEP 3 & 4: PAYMENT VERIFICATION ENGINE
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Verify Wage & Amount Received
        </h1>
        <p className="text-slate-400 text-sm">
          Enter the actual amount paid by your employer. We will cross-examine it against statutory minimum wage datasets.
        </p>
      </div>

      <form onSubmit={handleCheckWageTheft} className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700 space-y-6">
        
        {/* Worker Name Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Worker Full Name (Optional)
          </label>
          <input
            type="text"
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
            placeholder="e.g. Ramesh Kumar"
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-sm"
          />
        </div>

        {/* Extracted Work Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" /> Job Role
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Construction Worker">Construction Worker</option>
              <option value="Mason">Mason</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Painter">Painter</option>
              <option value="Electrician">Electrician</option>
              <option value="Plumber">Plumber</option>
              <option value="Driver">Driver</option>
              <option value="Delivery Partner">Delivery Partner</option>
              <option value="Farm Worker">Farm Worker</option>
              <option value="Domestic Worker">Domestic Worker</option>
              <option value="Welder">Welder</option>
              <option value="Security Guard">Security Guard</option>
              <option value="Sanitation Worker">Sanitation Worker</option>
              <option value="Factory Worker">Factory Worker</option>
              <option value="Freelancer">Freelancer / Independent Contractor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Hours Worked
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="24"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Location / City
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Chennai">Chennai (Tamil Nadu)</option>
              <option value="Mumbai">Mumbai (Maharashtra)</option>
              <option value="Bengaluru">Bengaluru (Karnataka)</option>
              <option value="Delhi">Delhi (NCT)</option>
              <option value="Kolkata">Kolkata (West Bengal)</option>
              <option value="Hyderabad">Hyderabad (Telangana)</option>
            </select>
          </div>

        </div>

        {/* Validation Layer 3 Warning Banner */}
        {showValidationWarning && validationResult && (
          <ValidationBanner
            warning={validationResult.warning}
            error={validationResult.error}
            hoursWorked={hoursWorked}
            onContinueAnyway={() => setShowValidationWarning(false)}
            onEditEntry={() => {
              // User can focus on inputs
            }}
          />
        )}

        {/* Main Payment Input */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-cyan-500/30 space-y-3">
          <label className="block text-sm font-extrabold text-white flex items-center justify-between">
            <span>Amount Received (₹)</span>
            <span className="text-xs text-cyan-400 font-semibold">Required</span>
          </label>

          <div className="relative flex items-center">
            <div className="absolute left-4 text-cyan-400 font-bold text-xl flex items-center">
              <IndianRupee className="w-6 h-6" />
            </div>
            <input
              type="number"
              min="0"
              required
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value)}
              placeholder="e.g. 600"
              className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
          <p className="text-xs text-slate-400">
            Enter the exact cash amount or UPI payment received for this shift.
          </p>
        </div>

        {/* Live Horizontal Process Stepper */}
        {isChecking && (
          <ProcessFlowStepper
            title="Wage Theft Audit Process Flow"
            steps={verificationSteps}
            activeStepIndex={activeStepIndex}
            isProcessing={isChecking}
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isChecking || !receivedAmount || (validationResult?.error && showValidationWarning)}
          className={`w-full py-4 px-6 rounded-xl font-extrabold text-lg shadow-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.01] active:scale-95 ${
            validationResult?.error && showValidationWarning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-rose-500 via-red-600 to-amber-600 hover:from-rose-400 hover:to-red-500 text-white shadow-rose-500/20'
          }`}
        >
          {isChecking ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              Auditing Wage Theft Engine...
            </>
          ) : (
            <>
              <ShieldAlert className="w-6 h-6" />
              Check Wage Theft
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

      </form>
    </div>
  );
}
