"""
ML Pipeline: Feature Engineering for India Tourism
Creates domain-specific features based on Indian tourism patterns.
"""
import pandas as pd
import numpy as np

# Peak tourist months in India (Oct–Mar)
INDIA_PEAK_MONTHS = {10, 11, 12, 1, 2, 3}

# Festival impact scores by name
FESTIVAL_IMPACT = {
    "Diwali": 1.60,
    "Christmas": 1.25,
    "New Year Eve": 1.50,
    "Holi": 1.45,
    "Navratri": 1.40,
    "Dussehra": 1.35,
    "Ganesh Chaturthi": 1.30,
    "Onam": 1.25,
    "Independence Day": 1.20,
    "Baisakhi": 1.20,
    "Makar Sankranti": 1.25,
    "Republic Day": 1.15,
    "Eid ul-Fitr": 1.15,
    "Chhath Puja": 1.30,
    "Janmashtami": 1.10,
    "Raksha Bandhan": 1.10,
    "Ugadi": 1.20,
    "None": 1.0,
}

# State popularity rank (1 = most popular) based on Ministry of Tourism data
STATE_POPULARITY = {
    "Tamil Nadu": 1,
    "Uttar Pradesh": 2,
    "Telangana": 3,
    "Karnataka": 4,
    "Andhra Pradesh": 5,
    "Maharashtra": 6,
    "Madhya Pradesh": 7,
    "West Bengal": 8,
    "Rajasthan": 9,
    "Gujarat": 10,
    "Bihar": 11,
    "Haryana": 12,
    "Himachal Pradesh": 13,
    "Uttarakhand": 14,
    "Odisha": 15,
    "Assam": 16,
    "Jharkhand": 17,
    "Kerala": 18,
    "Goa": 19,
    "Delhi": 20,
    "Punjab": 21,
    "Chhattisgarh": 22,
    "Jammu & Kashmir": 23,
    "Sikkim": 24,
    "Meghalaya": 25,
    "Arunachal Pradesh": 26,
    "Nagaland": 27,
    "Manipur": 28,
}


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create India tourism-specific predictive features.
    Call AFTER preprocess_data().
    """
    df = df.copy()

    # 1. Peak season flag (Oct–Mar = India peak tourism months)
    if "month" in df.columns:
        df["is_peak_season"] = df["month"].apply(lambda m: 1 if m in INDIA_PEAK_MONTHS else 0)

    # 2. Festival impact score
    if "festival_name" in df.columns:
        df["festival_impact"] = df["festival_name"].map(FESTIVAL_IMPACT).fillna(1.0)
    else:
        df["festival_impact"] = 1.0

    # 3. Weather comfort score  
    # Optimal India tourist weather: temp 15–28°C, humidity 40–70%, minimal rain
    if "temperature" in df.columns and "humidity" in df.columns:
        temp_score = np.where(
            (df["temperature"] >= 15) & (df["temperature"] <= 28), 1.0,
            np.where(df["temperature"] < 15, 0.7, 0.6)
        )
        humid_score = np.where(
            (df["humidity"] >= 40) & (df["humidity"] <= 70), 1.0, 0.75
        )
        rain_penalty = np.where(df.get("rainfall", pd.Series(0)) > 20, 0.8, 1.0)
        df["weather_comfort_score"] = temp_score * humid_score * rain_penalty
    else:
        df["weather_comfort_score"] = 1.0

    # 4. State popularity rank (lower rank = more tourists)
    if "state" in df.columns:
        df["state_popularity_rank"] = df["state"].map(STATE_POPULARITY).fillna(20)
    else:
        df["state_popularity_rank"] = 10

    # 5. Domestic-to-total ratio (proxy for international appeal)
    if "domestic_tourists" in df.columns and "total_tourists" in df.columns:
        total_safe = df["total_tourists"].replace(0, 1)
        df["domestic_ratio"] = df["domestic_tourists"] / total_safe
    else:
        df["domestic_ratio"] = 0.9

    # 6. Log transform of tourists (for skewed distributions)
    for col in ["domestic_tourists", "foreign_tourists", "total_tourists"]:
        if col in df.columns:
            df[f"log_{col}"] = np.log1p(df[col])

    return df


def get_feature_names() -> list:
    """Feature names used in the final trained model."""
    return [
        "state_enc",
        "season_enc",
        "festival_name_enc",
        "month",
        "year",
        "is_festival",
        "temperature",
        "humidity",
        "rainfall",
        "is_peak_season",
        "festival_impact",
        "weather_comfort_score",
        "state_popularity_rank",
        "domestic_ratio",
    ]
