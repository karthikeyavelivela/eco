from fastapi import APIRouter
from models import DashboardSummaryModel

router = APIRouter()

@router.get("/summary", response_model=DashboardSummaryModel)
async def get_dashboard_summary():
    # Return aggregated dummy data for dashboard
    return DashboardSummaryModel(
        total_tourists_this_month=154200,
        avg_occupancy_rate=82.5,
        sustainability_score=76.4
    )
