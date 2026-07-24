import { assessWageTheftRisk } from '../utils/riskAssessment';

/**
 * Calculates Expected Pay for Delivery Partners
 * Formula: (Orders Completed * Rate Per Order) + Incentives
 */
export function calculateDeliveryExpectedPay({ ordersCompleted = 0, ratePerOrder = 0, incentives = 0 }) {
  const orders = parseFloat(ordersCompleted) || 0;
  const rate = parseFloat(ratePerOrder) || 0;
  const inc = parseFloat(incentives) || 0;
  return parseFloat(((orders * rate) + inc).toFixed(2));
}

/**
 * Calculates Expected Pay for Standard Workers
 * Formula: Base Pay + Incentives + Overtime Pay - Valid Deductions
 */
export function calculateStandardExpectedPay({ basePay = 0, incentives = 0, overtimePay = 0, deductions = 0 }) {
  const base = parseFloat(basePay) || 0;
  const inc = parseFloat(incentives) || 0;
  const ot = parseFloat(overtimePay) || 0;
  const ded = parseFloat(deductions) || 0;
  return Math.max(0, parseFloat((base + inc + ot - ded).toFixed(2)));
}

/**
 * Voice Complaint NLP Extractor
 * Parses text such as "I worked 8 hours but got paid for only 6." or "Worked 10 hours paid 7"
 */
export function parseVoiceHoursMismatch(transcript = '', hourlyRate = 100) {
  if (!transcript || typeof transcript !== 'string') {
    return null;
  }

  const text = transcript.toLowerCase();
  
  // Regex pattern for worked vs paid hours
  const workedMatch = text.match(/(?:worked|shift|duty)\s*(?:for)?\s*(\d+(?:\.\d+)?)\s*(?:hours|hrs|hr)/);
  const paidMatch = text.match(/(?:got paid|paid|received|recieved)\s*(?:for)?\s*(?:only)?\s*(\d+(?:\.\d+)?)\s*(?:hours|hrs|hr)/);

  if (workedMatch && paidMatch) {
    const hoursWorked = parseFloat(workedMatch[1]);
    const hoursPaid = parseFloat(paidMatch[1]);
    
    if (hoursWorked > hoursPaid) {
      const expectedPay = parseFloat((hoursWorked * hourlyRate).toFixed(2));
      const actualPay = parseFloat((hoursPaid * hourlyRate).toFixed(2));
      const missingHours = hoursWorked - hoursPaid;
      const missingPay = parseFloat((missingHours * hourlyRate).toFixed(2));

      return {
        hoursWorked,
        hoursPaid,
        missingHours,
        hourlyRate,
        expectedPay,
        actualPay,
        missingPay
      };
    }
  }

  return null;
}

/**
 * AI Confidence Score Engine
 * Generates confidence % (0 - 100%) and level (Low, Medium, High Confidence)
 */
export function calculateAIConfidence({
  ocrClarity = 0.95,
  voiceConfidence = 0.90,
  dataCompleteness = 1.0,
  missingFieldsCount = 0
}) {
  let score = 90; // base score

  // Factor 1: OCR / Voice confidence input
  const sourceQuality = (ocrClarity + voiceConfidence) / 2;
  score = score * sourceQuality;

  // Factor 2: Data completeness penalty
  if (missingFieldsCount > 0) {
    score -= (missingFieldsCount * 8);
  }

  score = Math.min(99, Math.max(45, Math.round(score)));

  let confidenceLevel = "High Confidence";
  if (score < 70) {
    confidenceLevel = "Low Confidence";
  } else if (score < 85) {
    confidenceLevel = "Medium Confidence";
  } else {
    confidenceLevel = "High Confidence";
  }

  return {
    score,
    confidenceLevel,
    formattedText: `${score}% ${confidenceLevel}`
  };
}

/**
 * Main Comprehensive Wage Theft Analysis Calculator
 */
export function analyzeWageTheft({
  jobType = 'Delivery Partner',
  ordersCompleted,
  ratePerOrder,
  incentives = 0,
  basePay,
  overtimePay = 0,
  deductions = 0,
  actualPay = 0,
  voiceTranscript = '',
  ocrClarity = 0.95,
  voiceConfidence = 0.90
}) {
  let expectedPay = 0;
  let calculationMethod = 'Standard Shift';

  // 1. Delivery Partner Calculation
  if (jobType === 'Delivery Partner' || (ordersCompleted !== undefined && ratePerOrder !== undefined)) {
    expectedPay = calculateDeliveryExpectedPay({
      ordersCompleted: ordersCompleted || 25,
      ratePerOrder: ratePerOrder || 35,
      incentives: incentives || 200
    });
    calculationMethod = 'Delivery Orders × Rate + Incentives';
  } else {
    expectedPay = calculateStandardExpectedPay({
      basePay: basePay || 850,
      incentives: incentives || 0,
      overtimePay: overtimePay || 0,
      deductions: deductions || 0
    });
    calculationMethod = 'Base Pay + Incentives + OT - Deductions';
  }

  // 2. Voice NLP Hours Mismatch Check
  const voiceMismatch = parseVoiceHoursMismatch(voiceTranscript, 100);
  if (voiceMismatch && voiceMismatch.expectedPay > expectedPay) {
    expectedPay = voiceMismatch.expectedPay;
    calculationMethod = `Voice Hour Mismatch (${voiceMismatch.hoursWorked}h worked vs ${voiceMismatch.hoursPaid}h paid)`;
  }

  // 3. Risk Assessment Engine
  const riskResult = assessWageTheftRisk(expectedPay, actualPay);

  // 4. AI Confidence Score
  const missingCount = actualPay <= 0 ? 1 : 0;
  const confidence = calculateAIConfidence({
    ocrClarity,
    voiceConfidence,
    dataCompleteness: missingCount === 0 ? 1.0 : 0.8,
    missingFieldsCount: missingCount
  });

  return {
    jobType,
    calculationMethod,
    expectedPay: riskResult.expectedPay,
    actualPay: riskResult.actualPay,
    wageTheftAmount: riskResult.wageTheftAmount,
    wageTheftPercentage: riskResult.percentage,
    riskLevel: riskResult.riskLevel,
    confidenceScore: confidence.score,
    confidenceLevel: confidence.confidenceLevel,
    confidenceFormatted: confidence.formattedText,
    status: riskResult.status,
    voiceMismatch
  };
}

export default analyzeWageTheft;
