from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, Optional
import re

from app.models.gig_worker import (
    GigPlatformDetectRequest, GigPlatformDetectResponse,
    GigTaskDetails, GigWorkerAuditResponse,
    GigComplaintRequest
)
from app.utils.gig_payment_calculator import (
    calculate_expected_payment,
    calculate_bonus,
    calculate_deductions,
    calculate_net_payment,
    detect_underpayment,
    generate_summary
)

router = APIRouter(prefix="/api/gig", tags=["Gig Worker Per-Order Engine"])

GIG_PLATFORMS_MAP = {
    "swiggy": "Swiggy",
    "zomato": "Zomato",
    "blinkit": "Blinkit",
    "zepto": "Zepto",
    "uber": "Uber",
    "ola": "Ola",
    "rapido": "Rapido",
    "amazon flex": "Amazon Flex",
    "amazon": "Amazon Flex",
    "dunzo": "Dunzo",
    "porter": "Porter",
    "shadowfax": "Shadowfax",
    "ekart": "Ekart"
}

GIG_KEYWORDS = [
    "delivery", "deliveries", "order", "orders", "ride", "rides", "trip", "trips",
    "parcel", "parcels", "pickup", "drop", "swiggy", "zomato", "blinkit", "zepto",
    "uber", "ola", "rapido", "amazon flex", "dunzo", "porter", "shadowfax", "ekart", "per order", "per delivery", "per ride"
]

@router.post("/detect-platform", response_model=GigPlatformDetectResponse, status_code=status.HTTP_200_OK)
async def detect_gig_platform(payload: GigPlatformDetectRequest):
    """
    POST /api/gig/detect-platform
    Analyzes speech transcript to detect gig platform, task type, task count, and per-task rates.
    """
    text = (payload.transcript or "").lower()
    
    is_gig = any(kw in text for kw in GIG_KEYWORDS)
    detected_platform = "Generic Gig Worker"
    
    for kw, name in GIG_PLATFORMS_MAP.items():
        if kw in text:
            detected_platform = name
            is_gig = True
            break
            
    # Detect Task Type
    task_type = "Delivery"
    if "ride" in text or "trip" in text or "uber" in text or "ola" in text or "rapido" in text:
        task_type = "Ride"
    elif "parcel" in text or "package" in text or "amazon" in text:
        task_type = "Parcel"
    elif "pickup" in text:
        task_type = "Pickup"
    elif "drop" in text:
        task_type = "Drop"
    elif "order" in text or "blinkit" in text or "zepto" in text:
        task_type = "Order"

    # Extract task count: "25 deliveries", "18 trips", "30 orders", "12 parcels"
    task_count = None
    count_match = re.search(r'(\d+)\s*(?:deliveries|delivery|trips|trip|rides|ride|orders|order|parcels|parcel|pickups|drops)', text)
    if count_match:
        task_count = float(count_match.group(1))

    # Extract rate: "35 per delivery", "120 per ride", "60 per parcel", "rs 35", "rupees 35"
    rate_val = None
    rate_match = re.search(r'(?:rs\.?|rupees|₹)?\s*(\d+(?:\.\d+)?)\s*(?:per|\/)\s*(?:delivery|ride|order|parcel|trip|task)', text)
    if not rate_match:
        rate_match = re.search(r'at\s*(?:rs\.?|rupees|₹)?\s*(\d+(?:\.\d+)?)', text)
    if rate_match:
        rate_val = float(rate_match.group(1))

    # Extract actual payment if mentioned: "received 720", "paid 720", "got 720"
    actual_val = None
    actual_match = re.search(r'(?:received|paid|got|total paid|net pay)\s*(?:of|is|was)?\s*(?:rs\.?|rupees|₹)?\s*(\d+(?:\.\d+)?)', text)
    if actual_match:
        actual_val = float(actual_match.group(1))

    return GigPlatformDetectResponse(
        is_gig=is_gig,
        platform=detected_platform,
        task_type=task_type,
        completed_tasks=task_count,
        rate_per_task=rate_val,
        actual_payment=actual_val,
        confidence=0.95 if is_gig else 0.50,
        raw_transcript=payload.transcript
    )

@router.post("/audit", response_model=GigWorkerAuditResponse, status_code=status.HTTP_200_OK)
async def audit_gig_worker_payment(payload: GigTaskDetails):
    """
    POST /api/gig/audit
    Calculates expected earnings, itemized bonuses, itemized deductions, net payout, underpayment shortfall, and risk score.
    """
    try:
        platform_name = payload.custom_platform.strip() if payload.platform == "Other" and payload.custom_platform else payload.platform
        
        base_earnings = calculate_expected_payment(payload.completed_tasks, payload.rate_per_task)
        
        bonuses_dict = {
            "Peak Hour Bonus": payload.peak_hour_bonus or 0.0,
            "Rain Bonus": payload.rain_bonus or 0.0,
            "Festival Bonus": payload.festival_bonus or 0.0,
            "Referral Bonus": payload.referral_bonus or 0.0,
            "Night Incentive": payload.night_incentive or 0.0,
            "Other Bonuses": payload.other_bonuses or 0.0
        }
        total_bonuses = calculate_bonus(bonuses_dict)
        total_tips = round(max(0.0, float(payload.tips or 0.0)), 2)
        
        gross_earnings = round(base_earnings + total_bonuses + total_tips, 2)
        
        deductions_dict = {
            "Fuel Cost": payload.fuel_cost or 0.0,
            "Platform Commission": payload.platform_commission or 0.0,
            "Late Delivery Penalty": payload.late_penalty or 0.0,
            "Cancellation Fee": payload.cancellation_fee or 0.0,
            "Insurance Deduction": payload.insurance_deduction or 0.0,
            "Equipment Rent": payload.equipment_rent or 0.0,
            "Other Deductions": payload.other_deductions or 0.0
        }
        total_deductions = calculate_deductions(deductions_dict)
        
        net_expected = calculate_net_payment(gross_earnings, total_deductions)
        actual_received = round(max(0.0, float(payload.actual_payment)), 2)
        
        underpayment_info = detect_underpayment(net_expected, actual_received)
        
        hrs = payload.working_hours if payload.working_hours and payload.working_hours > 0 else 8.0
        effective_hourly_exp = round(net_expected / hrs, 2)
        effective_hourly_rec = round(actual_received / hrs, 2)
        
        summary_payload = {
            "platform": platform_name,
            "completed_tasks": payload.completed_tasks,
            "task_type": payload.task_type,
            "net_expected_payment": net_expected,
            "actual_payment": actual_received,
            "difference": underpayment_info["difference"],
            "risk_level": underpayment_info["risk_level"]
        }
        summary_text = generate_summary(summary_payload)

        return GigWorkerAuditResponse(
            worker_name=payload.worker_name or "Gig Worker",
            platform=platform_name,
            task_type=payload.task_type,
            completed_tasks=payload.completed_tasks,
            rate_per_task=payload.rate_per_task,
            base_earnings=base_earnings,
            total_bonuses=total_bonuses,
            total_tips=total_tips,
            gross_earnings=gross_earnings,
            total_deductions=total_deductions,
            net_expected_payment=net_expected,
            actual_payment=actual_received,
            difference=underpayment_info["difference"],
            wage_theft_percentage=underpayment_info["wage_theft_percentage"],
            risk_score=underpayment_info["risk_score"],
            risk_level=underpayment_info["risk_level"],
            is_underpaid=underpayment_info["is_underpaid"],
            working_hours=hrs,
            effective_hourly_expected=effective_hourly_exp,
            effective_hourly_received=effective_hourly_rec,
            bonuses_breakdown={k: v for k, v in bonuses_dict.items() if v > 0},
            deductions_breakdown={k: v for k, v in deductions_dict.items() if v > 0},
            summary_text=summary_text,
            legal_ref="Code on Social Security, 2020 (Gig Workers Welfare) & Contract Labour (Regulation & Abolition) Act"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing gig worker payment audit: {str(e)}"
        )

@router.post("/complaint", status_code=status.HTTP_200_OK)
async def generate_gig_complaint(payload: GigComplaintRequest):
    """
    POST /api/gig/complaint
    Generates a formal legal complaint letter specifically formatted for gig workers.
    """
    worker = payload.worker_name or "Gig Worker"
    employer = payload.employer_name or f"{payload.platform} Platform / Dispatch Manager"
    diff = max(0.0, payload.expected_net - payload.actual_received)
    pct = round((diff / payload.expected_net * 100), 1) if payload.expected_net > 0 else 0.0
    
    complaint_text = f"""TO:
The Regional Labor Commissioner / Gig Worker Welfare Board
Department of Labor, {payload.location or 'Chennai'}

FROM:
Complainant: {worker}
Employment Type: Gig Platform Delivery / Logistics Partner ({payload.platform})
Location: {payload.location or 'Chennai'}

SUBJECT: FORMAL COMPLAINT REGARDING UNLAWFUL PER-ORDER DEDUCTIONS AND WAGE UNDERPAYMENT

Respected Sir/Madam,

I am writing to formally log a legal complaint regarding arbitrary payment withholding and statutory non-compliance by {employer} for per-task services rendered on the {payload.platform} platform.

SUMMARY OF WORK AND PAYMENT DISCREPANCY:
1. Gig Platform: {payload.platform}
2. Completed Tasks / Orders: {payload.completed_tasks} ({payload.task_type})
3. Agreed Rate per Task: ₹{payload.rate_per_task:.2f}
4. Total Net Expected Earnings (after incentives/statutory adjustments): ₹{payload.expected_net:.2f}
5. Actual Amount Disbursed to Worker Account: ₹{payload.actual_received:.2f}
6. Total Unlawful Deduction / Shortfall: ₹{diff:.2f} (Underpayment severity: {pct}%)

STATUTORY & LEGAL GROUNDS:
This failure to disburse agreed contract payouts constitutes a direct breach of contract under the Indian Contract Act, 1872, and violates social security protections under Section 114 of the Code on Social Security, 2020 (Gig and Platform Workers).

RELIEF DEMANDED:
1. Immediate disbursement of the withheld balance of ₹{diff:.2f}.
2. Refund of unauthorized penalties or arbitrary platform deductions.
3. Official verification of platform payout algorithms to safeguard gig workers from systemic wage theft.

Sincerely,
{worker}
Date: Today's Date
Location: {payload.location or 'Chennai'}
"""

    return {
        "complaint": complaint_text,
        "summary": f"Gig wage theft logged for {payload.platform} ({payload.completed_tasks} {payload.task_type}s). Paid ₹{payload.actual_received:.2f} vs expected ₹{payload.expected_net:.2f} (Shortfall: ₹{diff:.2f}).",
        "recommended_actions": [
            "Submit this formal grievance to your state Gig Workers Welfare Board.",
            "File a complaint through the CPGRAMS public grievance portal.",
            "Retain digital order logs, platform screenshot histories, and bank statements as evidence."
        ],
        "legal_section": "Code on Social Security, 2020 (Gig Workers Protections) & Contract Law"
    }
