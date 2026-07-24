/**
 * Voice Recognition Error Prevention System - Validation Utility (Frontend)
 */

export const checkHistoricalAnomaly = (currentHours, pastRecords = []) => {
  if (!pastRecords || pastRecords.length === 0) return null;

  try {
    const sum = pastRecords.reduce((acc, val) => acc + Number(val), 0);
    const avgHours = sum / pastRecords.length;

    const numHours = Number(currentHours);
    if (Math.abs(numHours - avgHours) > 5.0 || (avgHours > 0 && numHours > 2.5 * avgHours)) {
      return 'This entry differs significantly from previous records.';
    }
  } catch (err) {
    console.error('Historical calculation error:', err);
  }

  return null;
};

export const validateWorkData = ({
  job_type,
  hours_worked,
  location,
  received_amount,
  past_records = []
}) => {
  const warnings = [];
  const errors = [];

  // Rule 4: Job type empty check
  if (!job_type || !String(job_type).trim()) {
    warnings.push('Job type cannot be empty');
  }

  // Rule 5: Location empty check
  if (!location || !String(location).trim()) {
    warnings.push('Location cannot be empty');
  }

  // Rule 1 & Rule 2: Hours worked check
  if (hours_worked !== undefined && hours_worked !== null && hours_worked !== '') {
    const hrs = Number(hours_worked);
    if (isNaN(hrs)) {
      errors.push('Invalid work duration format');
    } else if (hrs > 24) {
      errors.push('Invalid work duration');
    } else if (hrs > 16) {
      warnings.push('Unusual work duration detected');
    }

    // Historical Anomaly Check
    const histWarn = checkHistoricalAnomaly(hrs, past_records);
    if (histWarn) {
      warnings.push(histWarn);
    }
  }

  // Rule 3: Received amount check
  if (received_amount !== undefined && received_amount !== null && String(received_amount).trim() !== '') {
    const amt = Number(received_amount);
    if (isNaN(amt)) {
      errors.push('Invalid received amount format');
    } else if (amt < 0) {
      errors.push('Received amount cannot be negative');
    }
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
    warning: warnings.length > 0 ? warnings[0] : null,
    error: errors.length > 0 ? errors[0] : null
  };
};
