/**
 * Client-side calculation engine for Gig Worker per-order payment support.
 */

export const calculateGigAudit = (taskDetails) => {
  const completedTasks = Math.max(0, Number(taskDetails.completedTasks) || 0);
  const ratePerTask = Math.max(0, Number(taskDetails.ratePerTask) || 0);
  const actualPayment = Math.max(0, Number(taskDetails.actualPayment) || 0);
  const workingHours = Math.max(0.1, Number(taskDetails.workingHours) || 8);

  const baseEarnings = Math.round(completedTasks * ratePerTask * 100) / 100;

  // Bonuses
  const peakHourBonus = Math.max(0, Number(taskDetails.peakHourBonus) || 0);
  const rainBonus = Math.max(0, Number(taskDetails.rainBonus) || 0);
  const festivalBonus = Math.max(0, Number(taskDetails.festivalBonus) || 0);
  const referralBonus = Math.max(0, Number(taskDetails.referralBonus) || 0);
  const nightIncentive = Math.max(0, Number(taskDetails.nightIncentive) || 0);
  const otherBonuses = Math.max(0, Number(taskDetails.otherBonuses) || 0);
  const tips = Math.max(0, Number(taskDetails.tips) || 0);

  const totalBonuses = Math.round((peakHourBonus + rainBonus + festivalBonus + referralBonus + nightIncentive + otherBonuses) * 100) / 100;
  const totalTips = Math.round(tips * 100) / 100;

  const grossEarnings = Math.round((baseEarnings + totalBonuses + totalTips) * 100) / 100;

  // Deductions
  const fuelCost = Math.max(0, Number(taskDetails.fuelCost) || 0);
  const platformCommission = Math.max(0, Number(taskDetails.platformCommission) || 0);
  const latePenalty = Math.max(0, Number(taskDetails.latePenalty) || 0);
  const cancellationFee = Math.max(0, Number(taskDetails.cancellationFee) || 0);
  const insuranceDeduction = Math.max(0, Number(taskDetails.insuranceDeduction) || 0);
  const equipmentRent = Math.max(0, Number(taskDetails.equipmentRent) || 0);
  const otherDeductions = Math.max(0, Number(taskDetails.otherDeductions) || 0);

  const totalDeductions = Math.round((fuelCost + platformCommission + latePenalty + cancellationFee + insuranceDeduction + equipmentRent + otherDeductions) * 100) / 100;

  const netExpectedPayment = Math.max(0, Math.round((grossEarnings - totalDeductions) * 100) / 100);

  const difference = Math.max(0, Math.round((netExpectedPayment - actualPayment) * 100) / 100);
  const wageTheftPercentage = netExpectedPayment > 0 ? Math.round((difference / netExpectedPayment) * 1000) / 10 : 0;
  const riskScore = wageTheftPercentage;

  let riskLevel = 'No Issue';
  if (difference > 0) {
    if (wageTheftPercentage > 50) riskLevel = 'Critical';
    else if (wageTheftPercentage > 25) riskLevel = 'High';
    else if (wageTheftPercentage > 10) riskLevel = 'Medium';
    else riskLevel = 'Low';
  }

  const effectiveHourlyExpected = Math.round((netExpectedPayment / workingHours) * 100) / 100;
  const effectiveHourlyReceived = Math.round((actualPayment / workingHours) * 100) / 100;

  const platformName = taskDetails.platform === 'Other' && taskDetails.customPlatform
    ? taskDetails.customPlatform
    : (taskDetails.platform || 'Gig Platform');

  return {
    is_gig: true,
    worker_name: taskDetails.workerName || 'Gig Worker',
    platform: platformName,
    task_type: taskDetails.taskType || 'Delivery',
    completed_tasks: completedTasks,
    rate_per_task: ratePerTask,
    base_earnings: baseEarnings,
    total_bonuses: totalBonuses,
    total_tips: totalTips,
    gross_earnings: grossEarnings,
    total_deductions: totalDeductions,
    net_expected_payment: netExpectedPayment,
    actual_payment: actualPayment,
    expected_wage: netExpectedPayment,
    received_amount: actualPayment,
    difference,
    wage_theft_percentage: wageTheftPercentage,
    risk_score: riskScore,
    risk_level: riskLevel,
    is_underpaid: difference > 0,
    working_hours: workingHours,
    effective_hourly_expected: effectiveHourlyExpected,
    effective_hourly_received: effectiveHourlyReceived,
    legal_ref: 'Code on Social Security, 2020 (Gig Workers Welfare Rules)'
  };
};

export const validateGigTaskInputs = (taskDetails) => {
  const errors = [];
  const warnings = [];

  const tasks = Number(taskDetails.completedTasks);
  const rate = Number(taskDetails.ratePerTask);
  const actual = Number(taskDetails.actualPayment);

  if (isNaN(tasks) || tasks <= 0) {
    errors.push('Completed tasks count must be greater than zero.');
  }

  if (isNaN(rate) || rate <= 0) {
    errors.push('Rate per task must be greater than zero.');
  }

  if (!isNaN(actual) && actual < 0) {
    errors.push('Actual payment received cannot be a negative amount.');
  }

  const calc = calculateGigAudit(taskDetails);
  if (calc.totalDeductions > calc.gross_earnings) {
    warnings.push('Total deductions exceed total gross earnings. Net payout cannot be negative.');
  }

  if (calc.total_bonuses > calc.base_earnings && calc.base_earnings > 0) {
    warnings.push('Bonus amount exceeds 100% of base task earnings. Please confirm incentive rules.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
