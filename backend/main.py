from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import tourism, predict, pricing, sustainability, dashboard
import uvicorn
import os

app = FastAPI(title="Predictive Analytics Platform for Sustainable Tourism Management")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev purposes, allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tourism.router, prefix="/api/tourism", tags=["Tourism"])
app.include_router(predict.router, prefix="/api/predict", tags=["Predictions"])
app.include_router(pricing.router, prefix="/api/pricing", tags=["Pricing"])
app.include_router(sustainability.router, prefix="/api/sustainability", tags=["Sustainability"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sustainable Tourism API"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
