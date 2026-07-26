from typing import List, Dict, Any, Tuple

PAYMENT_CATEGORIES = {
    "base_wage": ["base", "salary", "daily wage", "basic", "stipend"],
    "bonus": ["attendance", "performance", "festival", "diwali", "pongal", "referral", "project", "bonus"],
    "allowance": ["travel", "food", "conveyance", "night shift", "risk", "hazard", "uniform", "accommodation", "allowance"],
    "tips": ["tip", "tips", "gratuity"],
    "commission": ["commission", "sales commission", "incentive"],
    "deduction": ["pf", "esi", "tax", "advance", "fine", "penalty", "deduction"]
}

def classify_payment(payment_type: str) -> str:
    """
    Classifies payment description string into standard payment category.
    Returns category key: 'base_wage' | 'bonus' | 'allowance' | 'tips' | 'commission' | 'deduction'
    """
    text = (payment_type or "").lower()
    for cat, keywords in PAYMENT_CATEGORIES.items():
        if any(kw in text for kw in keywords):
            return cat
    return "bonus" if "incentive" in text else "base_wage"

def calculate_total_compensation(
    base_wage: float,
    bonuses: List[Dict[str, Any]] = None,
    allowances: List[Dict[str, Any]] = None,
    tips: float = 0.0,
    commissions: float = 0.0,
    deductions: float = 0.0
) -> Tuple[Dict[str, Any], float]:
    """
    Calculates itemized total compensation:
    Total Compensation = Base Wage + Bonuses + Allowances + Tips + Commissions - Deductions
    """
    base = max(0.0, float(base_wage or 0.0))
    total_bonuses = sum(max(0.0, float(b.get("amount", 0.0))) for b in (bonuses or []))
    total_allowances = sum(max(0.0, float(a.get("amount", 0.0))) for a in (allowances or []))
    total_tips = max(0.0, float(tips or 0.0))
    total_commissions = max(0.0, float(commissions or 0.0))
    total_deductions = max(0.0, float(deductions or 0.0))

    total_comp = round(base + total_bonuses + total_allowances + total_tips + total_commissions - total_deductions, 2)

    breakdown = {
        "base_wage": base,
        "total_bonuses": round(total_bonuses, 2),
        "total_allowances": round(total_allowances, 2),
        "total_tips": round(total_tips, 2),
        "total_commissions": round(total_commissions, 2),
        "total_deductions": round(total_deductions, 2),
        "total_compensation": total_comp,
        "bonuses_list": bonuses or [],
        "allowances_list": allowances or []
    }

    return breakdown, total_comp

def validate_minimum_wage(base_wage: float, minimum_wage: float, total_compensation: float = 0.0) -> Tuple[bool, float, str]:
    """
    CRITICAL STATUTORY MANDATE (Code on Wages, 2019):
    Minimum Wage compliance is evaluated EXCLUSIVELY on Base Wage.
    Bonuses, allowances, and tips CANNOT legally compensate for base wage underpayment.

    Returns (is_compliant, shortfall, legal_reasoning)
    """
    base = float(base_wage or 0.0)
    min_wage = float(minimum_wage or 0.0)
    shortfall = round(max(0.0, min_wage - base), 2)

    if base >= min_wage:
        is_compliant = True
        reasoning = (
            f"Statutory compliance satisfied: Base Wage (₹{base:.2f}) meets or exceeds "
            f"Government Minimum Wage (₹{min_wage:.2f})."
        )
    else:
        is_compliant = False
        if total_compensation > min_wage:
            reasoning = (
                f"WAGE THEFT DETECTED: Base Wage (₹{base:.2f}) is ₹{shortfall:.2f} below statutory minimum wage (₹{min_wage:.2f}). "
                f"Under Section 6 & 12 of the Code on Wages, 2019, employer bonuses and allowances cannot substitute or replace "
                f"the mandatory minimum base wage."
            )
        else:
            reasoning = (
                f"WAGE THEFT DETECTED: Base Wage (₹{base:.2f}) is ₹{shortfall:.2f} below statutory minimum wage (₹{min_wage:.2f})."
            )

    return is_compliant, shortfall, reasoning

def generate_compensation_summary(breakdown: Dict[str, Any], minimum_wage: float) -> str:
    """Generates concise plain text compensation breakdown summary."""
    base = breakdown.get("base_wage", 0.0)
    bonuses = breakdown.get("total_bonuses", 0.0)
    allowances = breakdown.get("total_allowances", 0.0)
    tips = breakdown.get("total_tips", 0.0)
    total = breakdown.get("total_compensation", 0.0)
    is_compliant = base >= minimum_wage

    status_str = "Statutory Wage Met" if is_compliant else f"Base Wage Underpaid by ₹{minimum_wage - base:.2f}"

    return (
        f"Base Wage: ₹{base:.2f} | Bonuses: ₹{bonuses:.2f} | Allowances: ₹{allowances:.2f} | "
        f"Tips: ₹{tips:.2f} | Total Compensation: ₹{total:.2f} | Compliance: {status_str}"
    )

def format_compensation_evidence(breakdown: Dict[str, Any], minimum_wage: float) -> str:
    """Generates statutory evidence citation for legal complaint letters."""
    base = breakdown.get("base_wage", 0.0)
    bonuses = breakdown.get("total_bonuses", 0.0)
    allowances = breakdown.get("total_allowances", 0.0)
    tips = breakdown.get("total_tips", 0.0)
    total = breakdown.get("total_compensation", 0.0)
    shortfall = max(0.0, minimum_wage - base)

    return (
        f"STATUTORY COMPENSATION AUDIT:\n"
        f"1. Mandatory Statutory Minimum Wage: ₹{minimum_wage:.2f}\n"
        f"2. Base Wage Received: ₹{base:.2f}\n"
        f"3. Bonuses Received: ₹{bonuses:.2f}\n"
        f"4. Allowances Received: ₹{allowances:.2f}\n"
        f"5. Tips / Commissions: ₹{tips:.2f}\n"
        f"6. Total Package Compensation: ₹{total:.2f}\n"
        f"LEGAL VIOLATION: Base Wage shortfall is ₹{shortfall:.2f}. Under Code on Wages, 2019, "
        f"bonuses, allowances, and tips are additional compensation and cannot legally satisfy minimum wage requirements."
    )
