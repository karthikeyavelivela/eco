from pydantic import BaseModel
from typing import Optional, List

class TouristDataModel(BaseModel):
    """India state-wise tourism data model"""
    date: str
    state: str
    domestic_tourists: int
    foreign_tourists: int
    total_tourists: Optional[int] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    weather_condition: Optional[str] = None
    season: Optional[str] = None
    festival_name: Optional[str] = None
    is_festival: Optional[int] = 0
    month: Optional[int] = None
    year: Optional[int] = None

class PredictionModel(BaseModel):
    """ML prediction output model"""
    date: str
    state: str
    predicted_tourists: int
    demand_level: str  # Low / Medium / High / Very High
    month: Optional[int] = None
    festival: Optional[str] = None

class PricingModel(BaseModel):
    """Hotel pricing model"""
    hotel_id: str
    hotel_name: Optional[str] = None
    location: Optional[str] = None
    state: Optional[str] = None
    current_price: Optional[float] = None
    recommended_price: float
    demand_factor: float
    demand_level: Optional[str] = None

class SustainabilityModel(BaseModel):
    """Sustainability metrics per state"""
    state: str
    date: str
    total_tourists: int
    tourist_density: str  # Low / Medium / High
    density_value: Optional[float] = None  # tourists/km²
    carbon_estimate: float   # tonnes CO2
    waste_generation: float  # tonnes

class DashboardSummaryModel(BaseModel):
    """Dashboard summary with India-specific metrics"""
    total_tourists_this_month: int
    total_domestic: int
    total_foreign: int
    avg_occupancy_rate: float
    sustainability_score: float
    top_state: str
    peak_month: str
    active_destinations: int
    ml_accuracy: float

class WeatherData(BaseModel):
    state: str
    temperature: float
    humidity: float
    rainfall: float
    condition: str

class TourismStateModel(BaseModel):
    state: str
    domestic_tourists: int
    foreign_tourists: int
    total_tourists: int
    growth_rate: Optional[float] = None
    rank: Optional[int] = None

class MonthlyTourismModel(BaseModel):
    month: str
    month_num: int
    domestic: int
    foreign: int
    total: int
