from fastapi import APIRouter
from typing import List
from app.models.schemas import PricingModel
from app.database.mongodb import pricing_collection

router = APIRouter()

# India luxury hotels with demand-based pricing (peak November season)
FALLBACK_PRICING = [
    PricingModel(hotel_id="GOA001", hotel_name="Leela Palace Goa",         state="Goa",               location="Goa",                    current_price=12500.0, recommended_price=16875.0, demand_factor=1.35, demand_level="High"),
    PricingModel(hotel_id="KEL001", hotel_name="Kumarakom Lake Resort",     state="Kerala",            location="Kumarakom, Kerala",       current_price=9800.0,  recommended_price=11270.0, demand_factor=1.15, demand_level="High"),
    PricingModel(hotel_id="RAJ001", hotel_name="Taj Lake Palace",           state="Rajasthan",         location="Udaipur, Rajasthan",      current_price=18500.0, recommended_price=25900.0, demand_factor=1.40, demand_level="Very High"),
    PricingModel(hotel_id="RAJ002", hotel_name="Umaid Bhawan Palace",       state="Rajasthan",         location="Jodhpur, Rajasthan",      current_price=22000.0, recommended_price=28600.0, demand_factor=1.30, demand_level="High"),
    PricingModel(hotel_id="HIM001", hotel_name="Wildflower Hall",           state="Himachal Pradesh",  location="Shimla, Himachal Pradesh", current_price=14000.0, recommended_price=12600.0, demand_factor=0.90, demand_level="Medium"),
    PricingModel(hotel_id="UTT001", hotel_name="Ananda in the Himalayas",   state="Uttarakhand",       location="Rishikesh, Uttarakhand",  current_price=16500.0, recommended_price=18150.0, demand_factor=1.10, demand_level="High"),
    PricingModel(hotel_id="MAH001", hotel_name="Taj Mahal Palace",          state="Maharashtra",       location="Mumbai, Maharashtra",     current_price=25000.0, recommended_price=31250.0, demand_factor=1.25, demand_level="High"),
    PricingModel(hotel_id="DEL001", hotel_name="The Imperial New Delhi",    state="Delhi",             location="New Delhi",               current_price=19000.0, recommended_price=22800.0, demand_factor=1.20, demand_level="High"),
    PricingModel(hotel_id="KAR001", hotel_name="Evolve Back Kabini",        state="Karnataka",         location="Coorg, Karnataka",        current_price=11000.0, recommended_price=12650.0, demand_factor=1.15, demand_level="High"),
    PricingModel(hotel_id="TN001",  hotel_name="Taj Fisherman's Cove",      state="Tamil Nadu",        location="Chennai, Tamil Nadu",     current_price=8500.0,  recommended_price=8925.0,  demand_factor=1.05, demand_level="Medium"),
]


@router.get("/suggestions", response_model=List[PricingModel])
async def get_pricing_suggestions():
    """India hotel pricing recommendations based on demand."""
    suggestions = []
    try:
        async for doc in pricing_collection.find().limit(20):
            doc.pop("_id", None)
            suggestions.append(PricingModel(**doc))
    except Exception:
        pass

    if not suggestions:
        suggestions = FALLBACK_PRICING
    return suggestions
