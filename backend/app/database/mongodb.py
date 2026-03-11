import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.tourist_db

# Core collections
tourist_collection = database.get_collection("tourist_data")
hotel_collection = database.get_collection("hotel_data")
predictions_collection = database.get_collection("predictions")
pricing_collection = database.get_collection("pricing")
sustainability_collection = database.get_collection("sustainability_metrics")

# India-specific collections
weather_collection = database.get_collection("weather_cache")
festivals_collection = database.get_collection("festivals")
state_stats_collection = database.get_collection("state_stats")
monthly_stats_collection = database.get_collection("monthly_stats")
