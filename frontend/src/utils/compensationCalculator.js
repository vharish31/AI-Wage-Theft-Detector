/**
 * Compensation Calculator Utility
 * Legal Framework: Code on Wages, 2019 & Code on Wages (Central) Rules, 2026
 */

export const BONUS_TYPES = [
  'Attendance Bonus',
  'Performance Bonus',
  'Festival Bonus',
  'Referral Bonus',
  'Project Completion Bonus',
  'Custom Bonus'
];

export const ALLOWANCE_TYPES = [
  'Travel Allowance',
  'Food Allowance',
  'Night Shift Allowance',
  'Risk Allowance',
  'Uniform Allowance',
  'Accommodation Allowance',
  'Custom Allowance'
];

export function calculateTotalCompensation({
  baseWage = 0,
  bonuses = [],
  allowances = [],
  tips = 0,
  commissions = 0,
  deductions = 0
}) {
  const base = Math.max(0, Number(baseWage) || 0);
  const totalBonuses = bonuses.reduce((sum, b) => sum + Math.max(0, Number(b.amount) || 0), 0);
  const totalAllowances = allowances.reduce((sum, a) => sum + Math.max(0, Number(a.amount) || 0), 0);
  const totalTips = Math.max(0, Number(tips) || 0);
  const totalCommissions = Math.max(0, Number(commissions) || 0);
  const totalDeductions = Math.max(0, Number(deductions) || 0);

  const totalCompensation = Math.round((base + totalBonuses + totalAllowances + totalTips + totalCommissions - totalDeductions) * 100) / 100;

  return {
    baseWage: base,
    totalBonuses: Math.round(totalBonuses * 100) / 100,
    totalAllowances: Math.round(totalAllowances * 100) / 100,
    totalTips: Math.round(totalTips * 100) / 100,
    totalCommissions: Math.round(totalCommissions * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    totalCompensation,
    bonusesList: bonuses,
    allowancesList: allowances
  };
}

export function validateBaseWageCompliance(baseWage, minimumWage, totalCompensation = 0) {
  const base = Number(baseWage) || 0;
  const minWage = Number(minimumWage) || 0;
  const shortfall = Math.max(0, minWage - base);
  const isCompliant = base >= minWage;

  let reasoning = '';
  if (isCompliant) {
    reasoning = `Statutory compliance satisfied: Base Wage (₹${base.toFixed(2)}) meets or exceeds Government Minimum Wage (₹${minWage.toFixed(2)}).`;
  } else {
    reasoning = `WAGE THEFT DETECTED: Base Wage (₹${base.toFixed(2)}) is ₹${shortfall.toFixed(2)} below statutory minimum wage (₹${minWage.toFixed(2)}). Under Section 6 & 12 of the Code on Wages, 2019, bonuses and allowances cannot substitute or replace the statutory minimum base wage.`;
  }

  return {
    isCompliant,
    shortfall: Math.round(shortfall * 100) / 100,
    reasoning
  };
}

export function formatCompensationCitation(breakdown, minimumWage) {
  const base = breakdown.baseWage || 0;
  const bonuses = breakdown.totalBonuses || 0;
  const allowances = breakdown.totalAllowances || 0;
  const tips = breakdown.totalTips || 0;
  const total = breakdown.totalCompensation || 0;
  const shortfall = Math.max(0, minimumWage - base);

  return `STATUTORY COMPENSATION AUDIT: Mandatory Minimum Wage: ₹${minimumWage.toFixed(2)} | Base Wage: ₹${base.toFixed(2)} | Bonuses: ₹${bonuses.toFixed(2)} | Allowances: ₹${allowances.toFixed(2)} | Tips: ₹${tips.toFixed(2)} | Total Compensation: ₹${total.toFixed(2)}. Shortfall in Base Wage: ₹${shortfall.toFixed(2)} (Code on Wages, 2019 prohibits substitution of minimum wage with bonuses/tips).`;
}
