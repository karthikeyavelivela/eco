from fastapi import APIRouter, HTTPException
from typing import List
from models import PredictionModel
from database import predictions_collection
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "ml"))
from predict import PredictionEngine

router = APIRouter()
engine = PredictionEngine()

@router.post("", response_model=PredictionModel)
async def make_prediction(date: str, location: str, weather_temp: float = 20.0, season: str = "Spring", event: str = "None"):
    try:
        res = engine.predict(date, location, weather_temp, season, event)
        # Save to DB
        await predictions_collection.insert_one(res.copy())
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/latest", response_model=List[PredictionModel])
async def get_latest_predictions():
    preds = []
    async for doc in predictions_collection.find().sort("_id", -1).limit(10):
        doc.pop("_id", None)
        preds.append(PredictionModel(**doc))
    return preds
