from fastapi import APIRouter, HTTPException, status
from app.models.wage_theft_model import (
    WageTheftAnalysisRequest,
    WageTheftAnalysisResponse,
    WageTheftStatisticsResponse
)
from app.services.wage_theft_service import (
    process_wage_theft_analysis,
    get_analysis_by_id,
    get_overall_statistics
)

router = APIRouter(prefix="/api/wage-theft", tags=["AI Wage Theft Analysis Engine"])

@router.post("/analyze", response_model=WageTheftAnalysisResponse, status_code=status.HTTP_200_OK)
async def analyze_wage_theft_endpoint(payload: WageTheftAnalysisRequest):
    """
    POST /api/wage-theft/analyze
    Analyzes expected pay vs actual pay, calculates wage theft shortfall,
    wage theft %, risk level, and AI confidence score.
    """
    try:
        record = process_wage_theft_analysis(payload)
        return WageTheftAnalysisResponse(**record)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing wage theft analysis: {str(e)}"
        )

@router.get("/report/{record_id}", response_model=WageTheftAnalysisResponse, status_code=status.HTTP_200_OK)
async def get_wage_theft_report(record_id: str):
    """
    GET /api/wage-theft/report/{id}
    Retrieves stored WageTheftAnalysis record by ID.
    """
    record = get_analysis_by_id(record_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Wage Theft Report with ID '{record_id}' not found."
        )
    return WageTheftAnalysisResponse(**record)

@router.get("/statistics", response_model=WageTheftStatisticsResponse, status_code=status.HTTP_200_OK)
async def get_wage_theft_statistics():
    """
    GET /api/wage-theft/statistics
    Returns aggregated dashboard statistics, risk counts, and trend charts.
    """
    try:
        stats = get_overall_statistics()
        return WageTheftStatisticsResponse(**stats)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching wage theft statistics: {str(e)}"
        )
