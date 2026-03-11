from fastapi import APIRouter
from typing import List
from models import SustainabilityModel
from database import sustainability_collection

router = APIRouter()

@router.get("", response_model=List[SustainabilityModel])
async def get_sustainability_metrics():
    metrics = []
    async for doc in sustainability_collection.find().limit(10):
        doc.pop("_id", None)
        metrics.append(SustainabilityModel(**doc))
        
    if not metrics:
        metrics = [
            SustainabilityModel(date="2024-05-15", location="Paris", tourist_density="High", carbon_estimate=450.5, waste_generation=120.3),
            SustainabilityModel(date="2024-05-15", location="Tokyo", tourist_density="Medium", carbon_estimate=320.1, waste_generation=95.0),
        ]
    return metrics
