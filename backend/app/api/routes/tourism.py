from fastapi import APIRouter
from typing import List
from app.models.schemas import TouristDataModel, TourismStateModel, MonthlyTourismModel
from app.database.mongodb import tourist_collection, state_stats_collection, monthly_stats_collection

router = APIRouter()

# ─── India state-wise tourism fallback data ──────────────────────────────────
FALLBACK_HISTORY = [
    {"date": "2025-01-01", "state": "Rajasthan", "domestic_tourists": 4306843, "foreign_tourists": 143065, "total_tourists": 4449908, "temperature": 18.5, "humidity": 55, "rainfall": 0.0, "weather_condition": "Clear Sky", "season": "Winter", "festival_name": "Makar Sankranti", "is_festival": 1, "month": 1, "year": 2025},
    {"date": "2025-01-01", "state": "Goa", "domestic_tourists": 686452, "foreign_tourists": 91025, "total_tourists": 777477, "temperature": 27.2, "humidity": 68, "rainfall": 0.0, "weather_condition": "Partly Cloudy", "season": "Winter", "festival_name": "Makar Sankranti", "is_festival": 1, "month": 1, "year": 2025},
    {"date": "2025-01-01", "state": "Kerala", "domestic_tourists": 1590648, "foreign_tourists": 123024, "total_tourists": 1713672, "temperature": 29.1, "humidity": 72, "rainfall": 2.5, "weather_condition": "Haze", "season": "Winter", "festival_name": "None", "is_festival": 0, "month": 1, "year": 2025},
    {"date": "2025-11-01", "state": "Rajasthan", "domestic_tourists": 5574000, "foreign_tourists": 185000, "total_tourists": 5759000, "temperature": 22.0, "humidity": 42, "rainfall": 0.0, "weather_condition": "Clear Sky", "season": "Winter", "festival_name": "Diwali", "is_festival": 1, "month": 11, "year": 2025},
    {"date": "2025-11-01", "state": "Goa", "domestic_tourists": 895000, "foreign_tourists": 118000, "total_tourists": 1013000, "temperature": 28.5, "humidity": 62, "rainfall": 0.0, "weather_condition": "Clear Sky", "season": "Winter", "festival_name": "Diwali", "is_festival": 1, "month": 11, "year": 2025},
    {"date": "2025-11-01", "state": "Kerala", "domestic_tourists": 1740000, "foreign_tourists": 134000, "total_tourists": 1874000, "temperature": 28.0, "humidity": 70, "rainfall": 1.0, "weather_condition": "Partly Cloudy", "season": "Winter", "festival_name": "Diwali", "is_festival": 1, "month": 11, "year": 2025},
]

FALLBACK_STATES = [
    {"state": "Tamil Nadu", "domestic_tourists": 333541143, "foreign_tourists": 4683809, "total_tourists": 338224952, "growth_rate": 8.2, "rank": 1},
    {"state": "Uttar Pradesh", "domestic_tourists": 230904634, "foreign_tourists": 3109332, "total_tourists": 234013966, "growth_rate": 5.4, "rank": 2},
    {"state": "Telangana", "domestic_tourists": 58699782, "foreign_tourists": 545765, "total_tourists": 59245547, "growth_rate": 12.1, "rank": 3},
    {"state": "Karnataka", "domestic_tourists": 104396914, "foreign_tourists": 2497764, "total_tourists": 106894678, "growth_rate": 9.7, "rank": 4},
    {"state": "Andhra Pradesh", "domestic_tourists": 121312892, "foreign_tourists": 605441, "total_tourists": 121918333, "growth_rate": 7.3, "rank": 5},
    {"state": "Maharashtra", "domestic_tourists": 103694069, "foreign_tourists": 5082877, "total_tourists": 108776946, "growth_rate": 6.8, "rank": 6},
    {"state": "Rajasthan", "domestic_tourists": 47228978, "foreign_tourists": 1567985, "total_tourists": 48796963, "growth_rate": 14.2, "rank": 9},
    {"state": "Goa", "domestic_tourists": 5990158, "foreign_tourists": 793752, "total_tourists": 6783910, "growth_rate": 18.5, "rank": 19},
    {"state": "Kerala", "domestic_tourists": 13905671, "foreign_tourists": 1073696, "total_tourists": 14979367, "growth_rate": 11.3, "rank": 12},
    {"state": "Himachal Pradesh", "domestic_tourists": 17247059, "foreign_tourists": 390390, "total_tourists": 17637449, "growth_rate": 16.7, "rank": 13},
    {"state": "Uttarakhand", "domestic_tourists": 33292527, "foreign_tourists": 166832, "total_tourists": 33459359, "growth_rate": 10.9, "rank": 14},
    {"state": "Delhi", "domestic_tourists": 14823095, "foreign_tourists": 2963882, "total_tourists": 17786977, "growth_rate": 7.5, "rank": 20},
]

FALLBACK_MONTHLY = [
    {"month": "Jan", "month_num": 1, "domestic": 89400000, "foreign": 1260000, "total": 90660000},
    {"month": "Feb", "month_num": 2, "domestic": 82300000, "foreign": 1160000, "total": 83460000},
    {"month": "Mar", "month_num": 3, "domestic": 75500000, "foreign": 1060000, "total": 76560000},
    {"month": "Apr", "month_num": 4, "domestic": 58300000, "foreign": 820000, "total": 59120000},
    {"month": "May", "month_num": 5, "domestic": 48000000, "foreign": 680000, "total": 48680000},
    {"month": "Jun", "month_num": 6, "domestic": 41200000, "foreign": 580000, "total": 41780000},
    {"month": "Jul", "month_num": 7, "domestic": 37700000, "foreign": 530000, "total": 38230000},
    {"month": "Aug", "month_num": 8, "domestic": 41200000, "foreign": 580000, "total": 41780000},
    {"month": "Sep", "month_num": 9, "domestic": 51400000, "foreign": 720000, "total": 52120000},
    {"month": "Oct", "month_num": 10, "domestic": 75500000, "foreign": 1060000, "total": 76560000},
    {"month": "Nov", "month_num": 11, "domestic": 92600000, "foreign": 1300000, "total": 93900000},
    {"month": "Dec", "month_num": 12, "domestic": 96000000, "foreign": 1350000, "total": 97350000},
]


@router.get("/history", response_model=List[TouristDataModel])
async def get_tourist_history():
    """State-wise monthly tourism records for India."""
    records = []
    try:
        async for doc in tourist_collection.find().limit(200):
            doc.pop("_id", None)
            records.append(TouristDataModel(**doc))
    except Exception:
        pass
    if not records:
        records = [TouristDataModel(**r) for r in FALLBACK_HISTORY]
    return records


@router.get("/states", response_model=List[TourismStateModel])
async def get_state_stats():
    """Aggregate state-level tourism ranking for India."""
    records = []
    try:
        async for doc in state_stats_collection.find().sort("rank", 1).limit(30):
            doc.pop("_id", None)
            records.append(TourismStateModel(**doc))
    except Exception:
        pass
    if not records:
        records = [TourismStateModel(**r) for r in FALLBACK_STATES]
    return records


@router.get("/monthly", response_model=List[MonthlyTourismModel])
async def get_monthly_stats():
    """All-India monthly aggregated tourist counts."""
    records = []
    try:
        async for doc in monthly_stats_collection.find().sort("month_num", 1):
            doc.pop("_id", None)
            records.append(MonthlyTourismModel(**doc))
    except Exception:
        pass
    if not records:
        records = [MonthlyTourismModel(**r) for r in FALLBACK_MONTHLY]
    return records


@router.post("/data", response_model=dict)
async def add_tourist_data(data: TouristDataModel):
    new_data = data.dict()
    result = await tourist_collection.insert_one(new_data)
    return {"message": "Data added successfully", "id": str(result.inserted_id)}
