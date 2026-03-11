from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

class TouristDataModel(BaseModel):
    date: str
    location: str
    tourist_count: int
    weather: Optional[float] = None
    event: Optional[str] = "None"
    season: Optional[str] = "Spring"

class PredictionModel(BaseModel):
    date: str
    location: str
    predicted_visitors: int
    demand_level: str

class PricingModel(BaseModel):
    hotel_id: str
    recommended_price: float
    demand_factor: float

class SustainabilityModel(BaseModel):
    date: str
    location: str
    tourist_density: str
    carbon_estimate: float
    waste_generation: float
    
class DashboardSummaryModel(BaseModel):
    total_tourists_this_month: int
    avg_occupancy_rate: float
    sustainability_score: float
