import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

# We'll use a local instance or a dummy URI if not provided, just for testing.
MONGO_DETAILS = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.tourist_db

tourist_collection = database.get_collection("tourist_data")
hotel_collection = database.get_collection("hotel_data")
predictions_collection = database.get_collection("predictions")
pricing_collection = database.get_collection("pricing")
sustainability_collection = database.get_collection("sustainability_metrics")

async def init_db():
    # Insert some dummy data if empty
    pass
