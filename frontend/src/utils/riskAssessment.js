/**
 * Risk Assessment Engine
 * 
 * Rules:
 * 0 - 5%   => No Issue
 * 5 - 15%  => Low Risk
 * 15 - 25% => Medium Risk
 * Above 25% => High Risk
 */
export function assessWageTheftRisk(expectedPay, actualPay) {
  const expected = Math.max(0, parseFloat(expectedPay) || 0);
  const actual = Math.max(0, parseFloat(actualPay) || 0);
  
  const wageTheftAmount = Math.max(0, parseFloat((expected - actual).toFixed(2)));
  const status = wageTheftAmount > 0 ? "Possible Wage Theft" : "No Wage Theft";
  
  let percentage = 0.0;
  if (expected > 0) {
    percentage = parseFloat(((wageTheftAmount / expected) * 100).toFixed(2));
  }

  let riskLevel = "No Issue";
  if (percentage > 25.0) {
    riskLevel = "High Risk";
  } else if (percentage >= 15.0) {
    riskLevel = "Medium Risk";
  } else if (percentage >= 5.0) {
    riskLevel = "Low Risk";
  } else {
    riskLevel = "No Issue";
  }

  return {
    riskLevel,
    percentage,
    wageTheftAmount,
    status,
    expectedPay: expected,
    actualPay: actual
  };
}

export default assessWageTheftRisk;
