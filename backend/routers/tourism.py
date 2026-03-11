from fastapi import APIRouter, HTTPException
from typing import List
from models import TouristDataModel
from database import tourist_collection

router = APIRouter()

@router.post("/data", response_model=dict)
async def add_tourist_data(data: TouristDataModel):
    new_data = data.dict()
    result = await tourist_collection.insert_one(new_data)
    return {"message": "Data added successfully", "id": str(result.inserted_id)}

@router.get("/history", response_model=List[TouristDataModel])
async def get_tourist_history():
    history = []
    async for doc in tourist_collection.find().limit(100):
        # Clean _id for Pydantic
        doc.pop("_id", None)
        history.append(TouristDataModel(**doc))
    return history
