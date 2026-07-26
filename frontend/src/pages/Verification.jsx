import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { detectWageTheft, validateWorkDataAPI, auditMultiJobsAPI, auditGigWorkerAPI } from '../services/api';
import ProcessFlowStepper from '../components/ProcessFlowStepper';
import ValidationBanner from '../components/ValidationBanner';
import ModernNumberInput from '../components/ModernNumberInput';
import MultiJobForm from '../components/MultiJobForm';
import GigPlatformSelector from '../components/GigPlatformSelector';
import GigTaskForm from '../components/GigTaskForm';
import PayslipUploader from '../components/PayslipUploader';

import { useAuth } from '../context/AuthContext';
import { resolveLocationState } from '../utils/locationHelper';
import BonusEntryForm from '../components/BonusEntryForm';
import AllowanceEntryForm from '../components/AllowanceEntryForm';
import TipsEntryForm from '../components/TipsEntryForm';
import { calculateTotalCompensation } from '../utils/compensationCalculator';
import { saveVerificationToHistory } from '../utils/historyStorage';
import { IndianRupee, ShieldAlert, ArrowRight, ArrowLeft, Briefcase, Clock, MapPin, Sparkles, Layers, Plus, ShoppingBag, Gift, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export default function Verification({ workData, setAuditResult }) {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { user } = useAuth();

  // Mode Selection: 'payslip' | 'hourly' | 'gig' | 'multi'
  const queryParams = new URLSearchParams(routeLocation.search);
  const modeParam = queryParams.get('mode');

  const initialMode = modeParam === 'payslip'
    ? 'payslip'
    : (workData?.is_gig || workData?.employment_type === 'gig'
        ? 'gig'
        : (workData?.is_multi_job ? 'multi' : 'hourly'));

  const [activeWorkflowMode, setActiveWorkflowMode] = useState(initialMode);

  useEffect(() => {
    if (modeParam === 'payslip') {
      setActiveWorkflowMode('payslip');
    } else if (modeParam === 'manual') {
      setActiveWorkflowMode('hourly');
    }
  }, [modeParam]);

  // Hourly state
  const [jobType, setJobType] = useState(workData?.job_type || 'Painter');
  const [hoursWorked, setHoursWorked] = useState(workData?.hours_worked ?? 8);
  const [location, setLocation] = useState(workData?.location || 'Chennai');
  const [receivedAmount, setReceivedAmount] = useState(workData?.received_amount || '');
  const [workerName, setWorkerName] = useState(workData?.worker_name || '');
  
  // Incentives state
  const [showIncentivesForm, setShowIncentivesForm] = useState(false);
  const [bonuses, setBonuses] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const [tips, setTips] = useState('');
  const [commissions, setCommissions] = useState('');
  const [deductions, setDeductions] = useState('');

  const [isChecking, setIsChecking] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Multi-job state
  const [multiJobs, setMultiJobs] = useState(
    workData?.multi_jobs && workData.multi_jobs.length > 0
      ? workData.multi_jobs
      : [{ job_id: 'job-1', job_type: workData?.job_type || 'Painter', hours_worked: workData?.hours_worked || 8, location: workData?.location || 'Chennai', received_amount: 0, employer_name: 'Employer 1' }]
  );

  // Gig Worker state
  const [gigPlatform, setGigPlatform] = useState(workData?.gig_platform || 'Swiggy');
  const [customPlatform, setCustomPlatform] = useState('');
  const [gigTaskDetails, setGigTaskDetails] = useState({
    platform: workData?.gig_platform || 'Swiggy',
    customPlatform: '',
    taskType: workData?.gig_task_type || 'Delivery',
    completedTasks: workData?.gig_completed_tasks || 25,
    ratePerTask: workData?.gig_rate_per_task || 35,
    actualPayment: workData?.gig_actual_payment || '',
    workingHours: workData?.hours_worked || 8,
    workerName: workData?.worker_name || 'Gig Worker',
    tips: 0,
    peakHourBonus: 0,
    rainBonus: 0,
    festivalBonus: 0,
    referralBonus: 0,
    nightIncentive: 0,
    otherBonuses: 0,
    fuelCost: 0,
    platformCommission: 0,
    latePenalty: 0,
    cancellationFee: 0,
    insuranceDeduction: 0,
    equipmentRent: 0,
    otherDeductions: 0
  });

  const [validationResult, setValidationResult] = useState(null);
  const [showValidationWarning, setShowValidationWarning] = useState(false);

  // Sync workData into state
  useEffect(() => {
    if (workData) {
      if (workData.job_type) setJobType(workData.job_type);
      if (workData.hours_worked) setHoursWorked(workData.hours_worked);
      if (workData.location) setLocation(workData.location);
      if (workData.worker_name) setWorkerName(workData.worker_name);
      if (workData.is_gig || workData.employment_type === 'gig') setActiveWorkflowMode('gig');
      else if (workData.is_multi_job) setActiveWorkflowMode('multi');
      
      if (workData.gig_platform) {
        setGigPlatform(workData.gig_platform);
        setGigTaskDetails(prev => ({
          ...prev,
          platform: workData.gig_platform,
          taskType: workData.gig_task_type || 'Delivery',
          completedTasks: workData.gig_completed_tasks || 25,
          ratePerTask: workData.gig_rate_per_task || 35,
          actualPayment: workData.gig_actual_payment || ''
        }));
      }
    }
  }, [workData]);

  const handlePayslipAudit = async (ocrData) => {
    setIsChecking(true);
    try {
      const result = await detectWageTheft({
        job_type: ocrData.job_type || 'Worker',
        location: ocrData.location || 'Chennai',
        received_amount: ocrData.net_salary || ocrData.received_amount || 0,
        hours_worked: ocrData.hours_worked || 8
      });
      result.worker_name = ocrData.worker_name || 'Worker';
      result.employer_name = ocrData.employer_name || 'Employer';
      result.is_payslip_verified = true;
      result.illegal_deductions = ocrData.illegal_deductions || 0;
      result.compensation = calculateTotalCompensation({
        baseWage: ocrData.net_salary || 0,
        bonuses: [],
        allowances: ocrData.allowances ? [{ id: '1', title: 'Allowances', amount: ocrData.allowances }] : [],
        tips: 0,
        commissions: 0,
        deductions: ocrData.illegal_deductions || 0
      });

      setAuditResult(result);
      saveVerificationToHistory(result, 'Upload Payslip (AI OCR)', user);
      navigate('/report');
    } catch (err) {
      console.error('Error running payslip audit:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleGigAuditSubmit = async () => {
    setIsChecking(true);
    try {
      const payload = {
        worker_name: workerName || user?.name || 'Gig Worker',
        platform: gigPlatform,
        custom_platform: customPlatform,
        task_type: gigTaskDetails.taskType,
        completed_tasks: Number(gigTaskDetails.completedTasks),
        rate_per_task: Number(gigTaskDetails.ratePerTask),
        actual_payment: Number(gigTaskDetails.actualPayment),
        working_hours: Number(gigTaskDetails.workingHours),
        tips: Number(gigTaskDetails.tips),
        peak_hour_bonus: Number(gigTaskDetails.peakHourBonus),
        rain_bonus: Number(gigTaskDetails.rainBonus),
        festival_bonus: Number(gigTaskDetails.festivalBonus),
        referral_bonus: Number(gigTaskDetails.referralBonus),
        night_incentive: Number(gigTaskDetails.nightIncentive),
        other_bonuses: Number(gigTaskDetails.otherBonuses),
        fuel_cost: Number(gigTaskDetails.fuelCost),
        platform_commission: Number(gigTaskDetails.platformCommission),
        late_penalty: Number(gigTaskDetails.latePenalty),
        cancellation_fee: Number(gigTaskDetails.cancellationFee),
        insurance_deduction: Number(gigTaskDetails.insuranceDeduction),
        equipment_rent: Number(gigTaskDetails.equipmentRent),
        other_deductions: Number(gigTaskDetails.otherDeductions)
      };

      const auditRes = await auditGigWorkerAPI(payload);
      const fullGigResult = {
        ...auditRes,
        is_gig: true,
        worker_name: workerName || user?.name || 'Gig Worker'
      };
      setAuditResult(fullGigResult);
      saveVerificationToHistory(fullGigResult, 'Gig Platform Audit', user);
      navigate('/report');
    } catch (err) {
      console.error('Error running gig audit:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleMultiJobAudit = async () => {
    setIsChecking(true);
    try {
      const multiResult = await auditMultiJobsAPI({
        worker_name: workerName || user?.name || 'Worker',
        jobs: multiJobs
      });
      const fullMultiResult = {
        ...multiResult,
        is_multi_job: true
      };
      setAuditResult(fullMultiResult);
      saveVerificationToHistory(fullMultiResult, 'Multi-Job Daily Audit', user);
      navigate('/report');
    } catch (err) {
      console.error('Error running multi-job audit:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const defaultCities = [
    'Chennai', 'Mumbai', 'Bengaluru', 'Mangalore', 'Delhi', 'Kolkata', 'Hyderabad',
    'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Kochi', 'Thiruvananthapuram', 'Visakhapatnam', 'Pune', 'Ahmedabad'
  ];

  const locationList = defaultCities.includes(location)
    ? defaultCities
    : [location, ...defaultCities.filter(c => c !== location)];

  const verificationSteps = [
    { title: 'Gazette Rate Lookup', desc: 'Fetching statutory rules' },
    { title: 'Underpayment Audit', desc: 'Cross-auditing payout' },
    { title: 'Risk Score Engine', desc: 'Computing severity risk score' }
  ];

  useEffect(() => {
    if (activeWorkflowMode !== 'hourly') return;
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
  }, [jobType, hoursWorked, location, receivedAmount, activeWorkflowMode]);

  const handleCheckWageTheft = async (e) => {
    e.preventDefault();

    if (validationResult?.error && showValidationWarning) {
      return;
    }

    if (!receivedAmount || Number(receivedAmount) < 0) return;

    setIsChecking(true);
    setActiveStepIndex(0);

    await new Promise(r => setTimeout(r, 400));
    setActiveStepIndex(1);

    try {
      const result = await detectWageTheft({
        job_type: jobType,
        location: location,
        received_amount: parseFloat(receivedAmount),
        hours_worked: parseFloat(hoursWorked)
      });
      
      await new Promise(r => setTimeout(r, 500));
      setActiveStepIndex(2);
      
      await new Promise(r => setTimeout(r, 400));
      result.worker_name = workerName;
      result.compensation = calculateTotalCompensation({
        baseWage: receivedAmount,
        bonuses,
        allowances,
        tips,
        commissions,
        deductions
      });

      setAuditResult(result);
      saveVerificationToHistory(result, 'Manual Entry Audit', user);
      navigate('/report');
    } catch (err) {
      console.error('Error running wage detection:', err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 animate-fadeIn">
      
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div>
          <Link 
            to="/verify-method" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-xs font-extrabold text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" /> Change Verification Method
          </Link>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold w-fit">
          PAYMENT VERIFICATION ENGINE & AUDIT GATEWAY
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Verify Payment & Statutory Underpayment Audit
        </h1>
        <p className="text-slate-400 text-sm">
          {activeWorkflowMode === 'payslip'
            ? 'Upload your official monthly salary slip or payment document for instant AI OCR audit.'
            : 'Cross-examine payment received against statutory minimum wage datasets, gig per-order models, or multi-job shifts.'}
        </p>
      </div>

      {/* WORKFLOW MODE SELECTOR TAB BAR (Manual Mode Only) */}
      {activeWorkflowMode !== 'payslip' && (
        /* Manual Method Selected: Show manual options EXCEPT Upload Payslip option */
        <div className="grid grid-cols-1 sm:grid-cols-3 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 gap-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => setActiveWorkflowMode('hourly')}
            className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeWorkflowMode === 'hourly'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Manual Entry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveWorkflowMode('gig')}
            className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeWorkflowMode === 'gig'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Gig Per-Order</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveWorkflowMode('multi')}
            className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeWorkflowMode === 'multi'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Multi-Job</span>
          </button>
        </div>
      )}

      {/* Render PAYSLIP OCR MODE */}
      {activeWorkflowMode === 'payslip' ? (
        <PayslipUploader onAuditSuccess={handlePayslipAudit} isAuditing={isChecking} />
      ) : activeWorkflowMode === 'gig' ? (
        /* Render GIG WORKER MODE */
        <div className="space-y-6">
          <GigPlatformSelector
            selectedPlatform={gigPlatform}
            setSelectedPlatform={(plat) => {
              setGigPlatform(plat);
              setGigTaskDetails(prev => ({ ...prev, platform: plat }));
            }}
            customPlatform={customPlatform}
            setCustomPlatform={(cp) => {
              setCustomPlatform(cp);
              setGigTaskDetails(prev => ({ ...prev, customPlatform: cp }));
            }}
          />

          <GigTaskForm
            taskDetails={gigTaskDetails}
            setTaskDetails={setGigTaskDetails}
            onSubmit={handleGigAuditSubmit}
          />
        </div>
      ) : activeWorkflowMode === 'multi' ? (
        /* Render MULTI-JOB MODE */
        <MultiJobForm
          jobs={multiJobs}
          onUpdateJobs={setMultiJobs}
          onSubmitAudit={handleMultiJobAudit}
          isAuditing={isChecking}
        />
      ) : (
        /* Render HOURLY WORKER MANUAL ENTRY MODE */
        <form onSubmit={handleCheckWageTheft} className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700 space-y-6">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Worker Full Name (Optional)
            </label>
            <input
              type="text"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-sm font-medium"
            />
          </div>

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
              <ModernNumberInput
                value={hoursWorked}
                onChange={setHoursWorked}
                min={1}
                max={24}
                step={0.5}
                suffix="hrs"
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
                {locationList.map((locName) => (
                  <option key={locName} value={locName}>
                    {locName} ({resolveLocationState(locName)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showValidationWarning && validationResult && (
            <ValidationBanner
              warning={validationResult.warning}
              error={validationResult.error}
              hoursWorked={hoursWorked}
              onContinueAnyway={() => setShowValidationWarning(false)}
              onEditEntry={() => {}}
            />
          )}

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
                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <p className="text-xs text-slate-400">
              Enter the exact base cash amount or UPI payment received for this shift.
            </p>
          </div>

          {/* EMPLOYER INCENTIVES, BONUSES & ALLOWANCES EXPANDABLE SECTION */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <button
              type="button"
              onClick={() => setShowIncentivesForm(!showIncentivesForm)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-200 hover:text-cyan-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Add Employer Bonuses, Allowances & Tips (Optional)</span>
                {(bonuses.length > 0 || allowances.length > 0 || tips > 0 || commissions > 0) && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/40">
                    +₹{calculateTotalCompensation({ baseWage: receivedAmount, bonuses, allowances, tips, commissions, deductions }).totalCompensation - (Number(receivedAmount) || 0)} Extra
                  </span>
                )}
              </div>
              {showIncentivesForm ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showIncentivesForm && (
              <div className="space-y-4 pt-2 animate-fadeIn">
                <BonusEntryForm bonuses={bonuses} setBonuses={setBonuses} />
                <AllowanceEntryForm allowances={allowances} setAllowances={setAllowances} />
                <TipsEntryForm
                  tips={tips}
                  setTips={setTips}
                  commissions={commissions}
                  setCommissions={setCommissions}
                  deductions={deductions}
                  setDeductions={setDeductions}
                />
              </div>
            )}
          </div>

          {isChecking && (
            <ProcessFlowStepper
              title="Wage Theft Audit Process Flow"
              steps={verificationSteps}
              activeStepIndex={activeStepIndex}
              isProcessing={isChecking}
            />
          )}

          <button
            type="submit"
            disabled={isChecking || !receivedAmount || (validationResult?.error && showValidationWarning)}
            className={`w-full py-4 px-6 rounded-xl font-extrabold text-lg shadow-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.01] active:scale-95 ${
              validationResult?.error && showValidationWarning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-rose-500 via-red-600 to-amber-600 hover:from-rose-400 hover:to-red-500 text-white shadow-rose-500/20 cursor-pointer'
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
      )}
    </div>
  );
}
