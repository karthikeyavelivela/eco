from fastapi import APIRouter, Query
from typing import List, Optional
from app.models.schemas import PredictionModel
from app.database.mongodb import predictions_collection

router = APIRouter()

# Lazy-loaded predictor to avoid startup errors when model not trained yet
_predictor = None

INDIA_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir",
    "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Uttarakhand", "Uttar Pradesh", "West Bengal",
]

INDIA_FESTIVALS = [
    "None", "Diwali", "Holi", "Navratri", "Dussehra", "Christmas", "New Year Eve",
    "Onam", "Ganesh Chaturthi", "Baisakhi", "Makar Sankranti", "Republic Day",
    "Independence Day", "Eid ul-Fitr", "Chhath Puja", "Janmashtami",
    "Raksha Bandhan", "Ugadi", "Vasant Panchami",
]

def get_predictor():
    global _predictor
    if _predictor is None:
        from app.ml.predict import IndiaPredictor
        _predictor = IndiaPredictor()
    return _predictor


@router.post("", response_model=dict)
async def make_prediction(
    state: str = Query(..., description="Indian state name"),
    month: int = Query(..., ge=1, le=12, description="Month (1-12)"),
    festival: Optional[str] = Query("None", description="Ongoing festival"),
    season: Optional[str] = Query("Winter", description="Season: Winter/Spring/Summer/Monsoon/Autumn"),
):
    """
    Predict tourist arrivals for an Indian state.
    Uses trained ML model or rule-based fallback.
    """
    predictor = get_predictor()
    result = predictor.predict(
        state=state,
        month=month,
        festival=festival or "None",
        season=season or "Winter",
    )

    # Save prediction to DB
    try:
        await predictions_collection.insert_one(result.copy())
    except Exception:
        pass

    return result


@router.get("/latest", response_model=List[PredictionModel])
async def get_latest_predictions():
    """Fetch the 20 most recent predictions."""
    preds = []
    try:
        async for doc in predictions_collection.find().sort("_id", -1).limit(20):
            doc.pop("_id", None)
            # Map fields for compatibility
            pred = {
                "date": doc.get("date", "2025-01-01"),
                "state": doc.get("state", "Rajasthan"),
                "predicted_tourists": doc.get("predicted_tourists", 0),
                "demand_level": doc.get("demand_level", "Medium"),
                "month": doc.get("month"),
                "festival": doc.get("festival"),
            }
            preds.append(PredictionModel(**pred))
    except Exception:
        pass
    return preds


@router.get("/states")
async def get_available_states():
    """Return list of Indian states supported for prediction."""
    return {"states": INDIA_STATES, "festivals": INDIA_FESTIVALS}
