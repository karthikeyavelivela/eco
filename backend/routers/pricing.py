from fastapi import APIRouter
from typing import List
from models import PricingModel
from database import pricing_collection
import random

router = APIRouter()

@router.get("/suggestions", response_model=List[PricingModel])
async def get_pricing_suggestions():
    # In a real app, this would use ML or data analytics.
    # For now, we simulate data or fetch from db.
    suggestions = []
    async for doc in pricing_collection.find().limit(10):
        doc.pop("_id", None)
        suggestions.append(PricingModel(**doc))
        
    if not suggestions:
        # Dummy suggestions
        suggestions = [
            PricingModel(hotel_id="H001", recommended_price=250.0, demand_factor=1.2),
            PricingModel(hotel_id="H002", recommended_price=120.0, demand_factor=0.8),
            PricingModel(hotel_id="H003", recommended_price=300.0, demand_factor=1.5),
        ]
    return suggestions
