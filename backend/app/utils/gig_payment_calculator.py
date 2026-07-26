from typing import Dict, Any

def calculate_expected_payment(completed_tasks: float, rate_per_task: float) -> float:
    """Calculates base earnings: completed_tasks * rate_per_task."""
    tasks = max(0.0, float(completed_tasks))
    rate = max(0.0, float(rate_per_task))
    return round(tasks * rate, 2)

def calculate_bonus(bonuses: Dict[str, float]) -> float:
    """Sum up all valid positive bonus and tip amounts."""
    total = 0.0
    for key, val in bonuses.items():
        if val and isinstance(val, (int, float)) and val > 0:
            total += float(val)
    return round(total, 2)

def calculate_deductions(deductions: Dict[str, float]) -> float:
    """Sum up all valid positive deduction amounts."""
    total = 0.0
    for key, val in deductions.items():
        if val and isinstance(val, (int, float)) and val > 0:
            total += float(val)
    return round(total, 2)

def calculate_net_payment(gross_expected: float, total_deductions: float) -> float:
    """Net Expected Payment = Gross Expected Earnings - Total Deductions."""
    gross = max(0.0, float(gross_expected))
    deds = max(0.0, float(total_deductions))
    return round(max(0.0, gross - deds), 2)

def detect_underpayment(net_expected: float, actual_payment: float) -> Dict[str, Any]:
    """
    Compares Net Expected Payment vs Actual Payment received.
    Returns shortfall difference, percentage wage theft, risk score, and risk level.
    Risk Levels:
    - No Issue: <= 0%
    - Low: > 0% and <= 10%
    - Medium: > 10% and <= 25%
    - High: > 25% and <= 50%
    - Critical: > 50%
    """
    net = max(0.0, float(net_expected))
    received = max(0.0, float(actual_payment))
    difference = max(0.0, round(net - received, 2))
    
    if net > 0:
        wage_theft_pct = round((difference / net) * 100.0, 1)
    else:
        wage_theft_pct = 0.0

    risk_score = wage_theft_pct

    if difference <= 0:
        risk_level = "No Issue"
    elif wage_theft_pct > 50:
        risk_level = "Critical"
    elif wage_theft_pct > 25:
        risk_level = "High"
    elif wage_theft_pct > 10:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "difference": difference,
        "wage_theft_percentage": wage_theft_pct,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "is_underpaid": difference > 0
    }

def generate_summary(gig_data: Dict[str, Any]) -> str:
    """Generates human-readable summary text for gig payment audit."""
    platform = gig_data.get("platform", "Gig Platform")
    tasks = gig_data.get("completed_tasks", 0)
    task_type = gig_data.get("task_type", "Task")
    expected = gig_data.get("net_expected_payment", 0.0)
    received = gig_data.get("actual_payment", 0.0)
    diff = gig_data.get("difference", 0.0)
    risk = gig_data.get("risk_level", "Low")

    if diff <= 0:
        return f"Payment Verified: Paid ₹{received:.2f} for {tasks} {task_type}s on {platform}, meeting net expected payout of ₹{expected:.2f}."
    else:
        return f"Underpayment Alert [{risk} Risk]: Paid ₹{received:.2f} instead of net expected ₹{expected:.2f} for {tasks} {task_type}s on {platform}. Shortfall: ₹{diff:.2f}."
