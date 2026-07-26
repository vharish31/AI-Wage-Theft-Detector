from fastapi import APIRouter, HTTPException
from app.models.compensation import (
    CompensationAuditRequest, 
    CompensationAuditResponse,
    CompensationBreakdown
)
from app.utils.compensation_calculator import (
    calculate_total_compensation,
    validate_minimum_wage,
    generate_compensation_summary,
    classify_payment
)

router = APIRouter(prefix="/api/compensation", tags=["Compensation Verification System"])

@router.post("/audit", response_model=CompensationAuditResponse)
async def audit_compensation(req: CompensationAuditRequest):
    """
    POST /api/compensation/audit
    Separates total payment into Base Wage, Bonuses, Allowances, Tips, Commissions, and Deductions.
    Evaluates statutory minimum wage compliance EXCLUSIVELY on Base Wage as per Code on Wages, 2019.
    """
    bonuses_dict = [b.dict() for b in (req.bonuses or [])]
    allowances_dict = [a.dict() for a in (req.allowances or [])]

    breakdown_dict, total_comp = calculate_total_compensation(
        base_wage=req.base_wage,
        bonuses=bonuses_dict,
        allowances=allowances_dict,
        tips=req.tips or 0.0,
        commissions=req.commissions or 0.0,
        deductions=req.deductions or 0.0
    )

    is_compliant, shortfall, legal_reasoning = validate_minimum_wage(
        base_wage=req.base_wage,
        minimum_wage=req.minimum_wage,
        total_compensation=total_comp
    )

    breakdown_obj = CompensationBreakdown(**breakdown_dict)
    summary_text = generate_compensation_summary(breakdown_dict, req.minimum_wage)

    return CompensationAuditResponse(
        breakdown=breakdown_obj,
        minimum_wage=req.minimum_wage,
        is_base_wage_compliant=is_compliant,
        base_wage_shortfall=shortfall,
        wage_theft_detected=not is_compliant,
        compliance_summary=summary_text,
        legal_reasoning=legal_reasoning
    )

@router.post("/classify")
async def classify_payment_type(payload: dict):
    """
    POST /api/compensation/classify
    Classifies payment description into payment category.
    """
    description = payload.get("description", "")
    category = classify_payment(description)
    return {"description": description, "category": category}
