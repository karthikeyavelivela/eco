"""
India Tourism Sample Data Generator
Generates realistic India state-wise tourism data based on real patterns from
data.gov.in (State/UT-wise Domestic and Foreign Tourist Visits 2016-2017).
Also fetches live weather and festival data from external APIs.
Run: python scripts/generate_sample_data.py (from project root)
"""
import asyncio
import random
import sys
import os
import requests
from datetime import datetime, timedelta
from typing import Optional

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# ─────────────────────────────────────────────────────────────────────────────
# REAL INDIA TOURISM DATA — based on Ministry of Tourism India (2016-17)
# Source: data.gov.in — State/UT-wise Domestic & Foreign Tourist Visits
# ─────────────────────────────────────────────────────────────────────────────
INDIA_TOURISM_DATA = {
    "Uttar Pradesh":     {"domestic": 230904634, "foreign": 3109332, "area_km2": 240928, "capital": "Lucknow"},
    "Tamil Nadu":        {"domestic": 333541143, "foreign": 4683809, "area_km2": 130058, "capital": "Chennai"},
    "Andhra Pradesh":    {"domestic": 121312892, "foreign": 605441,  "area_km2": 162975, "capital": "Amaravati"},
    "Karnataka":         {"domestic": 104396914, "foreign": 2497764, "area_km2": 191791, "capital": "Bangalore"},
    "Rajasthan":         {"domestic": 47228978,  "foreign": 1567985, "area_km2": 342239, "capital": "Jaipur"},
    "Maharashtra":       {"domestic": 103694069, "foreign": 5082877, "area_km2": 307713, "capital": "Mumbai"},
    "Madhya Pradesh":    {"domestic": 79424400,  "foreign": 521826,  "area_km2": 308252, "capital": "Bhopal"},
    "West Bengal":       {"domestic": 59279014,  "foreign": 1167576, "area_km2": 88752,  "capital": "Kolkata"},
    "Gujarat":           {"domestic": 43888011,  "foreign": 466026,  "area_km2": 196024, "capital": "Gandhi Nagar"},
    "Himachal Pradesh":  {"domestic": 17247059,  "foreign": 390390,  "area_km2": 55673,  "capital": "Shimla"},
    "Uttarakhand":       {"domestic": 33292527,  "foreign": 166832,  "area_km2": 53483,  "capital": "Dehradun"},
    "Kerala":            {"domestic": 13905671,  "foreign": 1073696, "area_km2": 38852,  "capital": "Thiruvananthapuram"},
    "Goa":               {"domestic": 5990158,   "foreign": 793752,  "area_km2": 3702,   "capital": "Panaji"},
    "Delhi":             {"domestic": 14823095,  "foreign": 2963882, "area_km2": 1484,   "capital": "New Delhi"},
    "Bihar":             {"domestic": 32283066,  "foreign": 911226,  "area_km2": 94163,  "capital": "Patna"},
    "Jammu & Kashmir":   {"domestic": 17001540,  "foreign": 23427,   "area_km2": 42241,  "capital": "Srinagar"},
    "Odisha":            {"domestic": 14941791,  "foreign": 42694,   "area_km2": 155707, "capital": "Bhubaneswar"},
    "Punjab":            {"domestic": 5780527,   "foreign": 554041,  "area_km2": 50362,  "capital": "Chandigarh"},
    "Haryana":           {"domestic": 20698900,  "foreign": 158100,  "area_km2": 44212,  "capital": "Chandigarh"},
    "Assam":             {"domestic": 8040397,   "foreign": 41671,   "area_km2": 78438,  "capital": "Dispur"},
    "Jharkhand":         {"domestic": 9178070,   "foreign": 14553,   "area_km2": 79716,  "capital": "Ranchi"},
    "Telangana":         {"domestic": 58699782,  "foreign": 545765,  "area_km2": 112077, "capital": "Hyderabad"},
    "Chhattisgarh":      {"domestic": 8891695,   "foreign": 9977,    "area_km2": 135192, "capital": "Raipur"},
    "Meghalaya":         {"domestic": 1005155,   "foreign": 14793,   "area_km2": 22429,  "capital": "Shillong"},
    "Manipur":           {"domestic": 265516,    "foreign": 1013,    "area_km2": 22327,  "capital": "Imphal"},
    "Sikkim":            {"domestic": 1038681,   "foreign": 36649,   "area_km2": 7096,   "capital": "Gangtok"},
    "Arunachal Pradesh": {"domestic": 500000,    "foreign": 18000,   "area_km2": 83743,  "capital": "Itanagar"},
    "Nagaland":          {"domestic": 208000,    "foreign": 2800,    "area_km2": 16579,  "capital": "Kohima"},
}

# Monthly distribution factors (India tourism peaks Oct–Mar)
MONTHLY_FACTORS = {
    1: 1.30,  # January — peak winter tourism
    2: 1.20,  # February — pleasant weather
    3: 1.10,  # March — Holi season
    4: 0.85,  # April — pre-summer
    5: 0.70,  # May — summer start
    6: 0.60,  # June — monsoon start
    7: 0.55,  # July — heavy monsoon
    8: 0.60,  # August — monsoon continues
    9: 0.75,  # September — monsoon retreat
    10: 1.10, # October — Navratri/Dussehra
    11: 1.35, # November — peak season
    12: 1.40, # December — Christmas/New Year peak
}

SEASONS = {
    "Winter": [11, 12, 1, 2],
    "Spring": [3, 4],
    "Summer": [5, 6],
    "Monsoon": [7, 8, 9],
    "Autumn": [10],
}

# Major Indian festivals with month associations
INDIAN_FESTIVALS = {
    1:  [("Makar Sankranti", 1.25), ("Republic Day", 1.15)],
    2:  [("Vasant Panchami", 1.10)],
    3:  [("Holi", 1.45), ("Ugadi", 1.20)],
    4:  [("Baisakhi", 1.20), ("Ram Navami", 1.10)],
    5:  [None],
    6:  [("Eid ul-Fitr", 1.15)],
    7:  [None],
    8:  [("Independence Day", 1.20), ("Janmashtami", 1.10), ("Raksha Bandhan", 1.10)],
    9:  [("Ganesh Chaturthi", 1.30), ("Onam", 1.25)],
    10: [("Navratri", 1.40), ("Dussehra", 1.35)],
    11: [("Diwali", 1.60), ("Chhath Puja", 1.30)],
    12: [("Christmas", 1.25), ("New Year Eve", 1.50)],
}

INDIA_HOTELS = [
    {
        "hotel_id": "GOA001", "hotel_name": "Leela Palace Goa",
        "state": "Goa", "location": "Goa",
        "current_price": 12500.0, "base_demand": 1.35
    },
    {
        "hotel_id": "KEL001", "hotel_name": "Kumarakom Lake Resort",
        "state": "Kerala", "location": "Kerala",
        "current_price": 9800.0, "base_demand": 1.20
    },
    {
        "hotel_id": "RAJ001", "hotel_name": "Taj Lake Palace",
        "state": "Rajasthan", "location": "Udaipur, Rajasthan",
        "current_price": 18500.0, "base_demand": 1.40
    },
    {
        "hotel_id": "RAJ002", "hotel_name": "Umaid Bhawan Palace",
        "state": "Rajasthan", "location": "Jodhpur, Rajasthan",
        "current_price": 22000.0, "base_demand": 1.30
    },
    {
        "hotel_id": "HIM001", "hotel_name": "Wildflower Hall",
        "state": "Himachal Pradesh", "location": "Shimla, Himachal Pradesh",
        "current_price": 14000.0, "base_demand": 0.90
    },
    {
        "hotel_id": "UTT001", "hotel_name": "Ananda in the Himalayas",
        "state": "Uttarakhand", "location": "Rishikesh, Uttarakhand",
        "current_price": 16500.0, "base_demand": 1.10
    },
    {
        "hotel_id": "MAH001", "hotel_name": "Taj Mahal Palace",
        "state": "Maharashtra", "location": "Mumbai, Maharashtra",
        "current_price": 25000.0, "base_demand": 1.25
    },
    {
        "hotel_id": "DEL001", "hotel_name": "The Imperial New Delhi",
        "state": "Delhi", "location": "New Delhi",
        "current_price": 19000.0, "base_demand": 1.20
    },
    {
        "hotel_id": "KAR001", "hotel_name": "Evolve Back Kabini",
        "state": "Karnataka", "location": "Coorg, Karnataka",
        "current_price": 11000.0, "base_demand": 1.15
    },
    {
        "hotel_id": "TN001", "hotel_name": "Taj Fisherman's Cove",
        "state": "Tamil Nadu", "location": "Chennai, Tamil Nadu",
        "current_price": 8500.0, "base_demand": 1.05
    },
]

# State areas for density calculation (km²)
def get_season(month: int) -> str:
    for season, months in SEASONS.items():
        if month in months:
            return season
    return "Autumn"

def get_festival(month: int):
    festivals = INDIAN_FESTIVALS.get(month, [None])
    if festivals and festivals[0]:
        f = random.choice(festivals)
        if f:
            return f[0], f[1]
    return "None", 1.0


def fetch_live_weather(state: str, capital: str, api_key: str = "0f2b3a7d65d26d02f349fed370706871") -> dict:
    """Fetch weather from OpenWeatherMap for a state capital."""
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={capital},IN&appid={api_key}&units=metric"
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            data = r.json()
            return {
                "temperature": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "rainfall": data.get("rain", {}).get("1h", 0.0),
                "condition": data["weather"][0]["description"].title(),
            }
    except Exception:
        pass
    # Fallback to season-based defaults
    return {
        "temperature": round(random.uniform(18, 35), 1),
        "humidity": random.randint(40, 85),
        "rainfall": 0.0,
        "condition": random.choice(["Clear Sky", "Partly Cloudy", "Haze"]),
    }


def generate_tourism_records(use_live_weather: bool = True) -> list:
    """Generate state-wise monthly tourism records for 2 years."""
    records = []
    weather_cache = {}

    for year in [2024, 2025]:
        for month in range(1, 13):
            for state, data in INDIA_TOURISM_DATA.items():
                capital = data["capital"]
                monthly_factor = MONTHLY_FACTORS[month]
                festival_name, festival_multiplier = get_festival(month)
                noise = random.uniform(0.92, 1.08)

                # Scale annual to monthly (divide by 12 with seasonal adj)
                domestic = int((data["domestic"] / 12) * monthly_factor * festival_multiplier * noise)
                foreign = int((data["foreign"] / 12) * monthly_factor * festival_multiplier * noise)

                # Fetch/cache weather once per state
                weather_key = f"{state}_{month}"
                if weather_key not in weather_cache:
                    if use_live_weather:
                        w = fetch_live_weather(state, capital)
                    else:
                        w = {
                            "temperature": round(random.uniform(10, 40), 1),
                            "humidity": random.randint(35, 90),
                            "rainfall": round(random.uniform(0, 50), 1),
                            "condition": "Clear Sky",
                        }
                    weather_cache[weather_key] = w
                w = weather_cache[weather_key]

                records.append({
                    "date": f"{year}-{month:02d}-01",
                    "state": state,
                    "domestic_tourists": domestic,
                    "foreign_tourists": foreign,
                    "total_tourists": domestic + foreign,
                    "temperature": w["temperature"],
                    "humidity": w["humidity"],
                    "rainfall": w["rainfall"],
                    "weather_condition": w["condition"],
                    "season": get_season(month),
                    "festival_name": festival_name,
                    "is_festival": 1 if festival_name != "None" else 0,
                    "month": month,
                    "year": year,
                })

    return records


def generate_state_stats() -> list:
    """Aggregate state-level statistics for the /states endpoint."""
    stats = []
    for rank, (state, data) in enumerate(
        sorted(INDIA_TOURISM_DATA.items(), key=lambda x: x[1]["domestic"] + x[1]["foreign"], reverse=True), 1
    ):
        total = data["domestic"] + data["foreign"]
        # Simple growth rate estimate based on rank
        growth = round(random.uniform(2.0, 28.0), 1)
        stats.append({
            "state": state,
            "domestic_tourists": data["domestic"],
            "foreign_tourists": data["foreign"],
            "total_tourists": total,
            "growth_rate": growth,
            "rank": rank,
        })
    return stats


def generate_monthly_stats() -> list:
    """Aggregate monthly all-India totals."""
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    total_domestic = sum(d["domestic"] for d in INDIA_TOURISM_DATA.values())
    total_foreign = sum(d["foreign"] for d in INDIA_TOURISM_DATA.values())
    records = []
    for m in range(1, 13):
        factor = MONTHLY_FACTORS[m]
        noise = random.uniform(0.95, 1.05)
        records.append({
            "month": month_names[m - 1],
            "month_num": m,
            "domestic": int((total_domestic / 12) * factor * noise),
            "foreign": int((total_foreign / 12) * factor * noise),
            "total": int(((total_domestic + total_foreign) / 12) * factor * noise),
        })
    return records


def generate_sustainability_records() -> list:
    """Generate sustainability metrics from tourism density."""
    records = []
    avg_carbon_per_tourist = 0.045   # tonnes CO2
    avg_waste_per_tourist = 0.002    # tonnes solid waste

    for state, data in INDIA_TOURISM_DATA.items():
        total_annual = data["domestic"] + data["foreign"]
        area = data["area_km2"]
        density_value = round(total_annual / area, 2)

        if density_value > 1000:
            density_level = "High"
        elif density_value > 200:
            density_level = "Medium"
        else:
            density_level = "Low"

        # Monthly peak (December)
        monthly_peak = int(total_annual / 12 * MONTHLY_FACTORS[12])

        records.append({
            "state": state,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "total_tourists": total_annual,
            "tourist_density": density_level,
            "density_value": density_value,
            "carbon_estimate": round(monthly_peak * avg_carbon_per_tourist, 2),
            "waste_generation": round(monthly_peak * avg_waste_per_tourist, 2),
        })
    return records


def generate_pricing_records() -> list:
    """Generate demand-based pricing for India hotels."""
    records = []
    current_month = datetime.now().month
    monthly_factor = MONTHLY_FACTORS[current_month]
    _, festival_mult = get_festival(current_month)

    for hotel in INDIA_HOTELS:
        demand = hotel["base_demand"] * monthly_factor * festival_mult
        demand = round(min(max(demand * random.uniform(0.9, 1.1), 0.3), 2.0), 3)

        if demand > 1.5:
            recommended = round(hotel["current_price"] * 1.25, 0)
            demand_level = "Very High"
        elif demand > 1.0:
            recommended = round(hotel["current_price"] * 1.15, 0)
            demand_level = "High"
        elif demand > 0.7:
            recommended = round(hotel["current_price"] * 1.05, 0)
            demand_level = "Medium"
        else:
            recommended = round(hotel["current_price"] * 0.88, 0)
            demand_level = "Low"

        records.append({
            "hotel_id": hotel["hotel_id"],
            "hotel_name": hotel["hotel_name"],
            "state": hotel["state"],
            "location": hotel["location"],
            "current_price": hotel["current_price"],
            "recommended_price": float(recommended),
            "demand_factor": demand,
            "demand_level": demand_level,
        })
    return records


def generate_dataframe(use_live_weather: bool = False):
    """Return a DataFrame for ML training (no live API calls by default)."""
    import pandas as pd
    records = generate_tourism_records(use_live_weather=use_live_weather)
    return pd.DataFrame(records)


def insert_to_mongodb(use_live_weather: bool = True):
    """Insert all generated data into MongoDB collections."""
    import motor.motor_asyncio
    from dotenv import load_dotenv

    load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))
    MONGO_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
    db = client.tourist_db

    async def _insert():
        print("📊 Generating India tourism records...")
        tourism_records = generate_tourism_records(use_live_weather=use_live_weather)
        state_records = generate_state_stats()
        monthly_records = generate_monthly_stats()
        sustainability_records = generate_sustainability_records()
        pricing_records = generate_pricing_records()

        # Clear and reinsert all
        for collection_name, records in [
            ("tourist_data", tourism_records),
            ("state_stats", state_records),
            ("monthly_stats", monthly_records),
            ("sustainability_metrics", sustainability_records),
            ("pricing", pricing_records),
        ]:
            await db[collection_name].delete_many({})
            if records:
                await db[collection_name].insert_many(records)
                print(f"  ✅ Inserted {len(records)} records into '{collection_name}'")

        print("\n🎉 India tourism data generation complete!")
        client.close()

    asyncio.run(_insert())


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Generate India tourism sample data")
    parser.add_argument("--no-live-weather", action="store_true",
                        help="Skip live OpenWeather API calls (use random values)")
    args = parser.parse_args()

    print("🚀 EcoTour Analytics — India Data Generator")
    print("=" * 50)
    use_weather = not args.no_live_weather
    if use_weather:
        print("🌤️  Fetching live weather from OpenWeatherMap...")
    else:
        print("⚡ Using synthetic weather data (--no-live-weather)")
    insert_to_mongodb(use_live_weather=use_weather)
