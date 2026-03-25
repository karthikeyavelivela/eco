"""
ML Prediction Engine — India Tourism
Loads trained model or uses rule-based fallback if model not yet trained.
"""
import os
import random
import joblib

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "tourism_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
ENCODERS_PATH = os.path.join(MODEL_DIR, "encoders.pkl")
FEATURES_PATH = os.path.join(MODEL_DIR, "feature_names.pkl")

# ─── State base tourist volumes (monthly, from Ministry of Tourism) ──────────
STATE_BASE_MONTHLY = {
    "Tamil Nadu":        27800000,
    "Uttar Pradesh":     19200000,
    "Telangana":         4900000,
    "Karnataka":         8700000,
    "Andhra Pradesh":    10100000,
    "Maharashtra":       8650000,
    "Madhya Pradesh":    6620000,
    "West Bengal":       4940000,
    "Rajasthan":         3940000,
    "Gujarat":           3660000,
    "Bihar":             2690000,
    "Haryana":           1724000,
    "Uttarakhand":       2774000,
    "Himachal Pradesh":  1437000,
    "Odisha":            1245000,
    "Kerala":            1165000,
    "Assam":             670000,
    "Jharkhand":         765000,
    "Goa":               566000,
    "Delhi":             1485000,
    "Punjab":            448000,
    "Chhattisgarh":      740000,
    "Jammu & Kashmir":   1420000,
    "Telangana":         4900000,
    "Sikkim":            89000,
    "Meghalaya":         84000,
    "Arunachal Pradesh": 43000,
    "Nagaland":          18000,
    "Manipur":           22000,
}

MONTHLY_FACTORS = {
    1: 1.30, 2: 1.20, 3: 1.10, 4: 0.85, 5: 0.70, 6: 0.60,
    7: 0.55, 8: 0.60, 9: 0.75, 10: 1.10, 11: 1.35, 12: 1.40,
}

SEASON_MULT = {
    "Winter": 1.25, "Spring": 1.05, "Summer": 0.72, "Monsoon": 0.60, "Autumn": 1.10
}

FESTIVAL_MULT = {
    "None": 1.0, "Diwali": 1.60, "Christmas": 1.25, "New Year Eve": 1.50,
    "Holi": 1.45, "Navratri": 1.40, "Dussehra": 1.35, "Ganesh Chaturthi": 1.30,
    "Onam": 1.25, "Independence Day": 1.20, "Baisakhi": 1.20,
    "Makar Sankranti": 1.25, "Republic Day": 1.15, "Eid ul-Fitr": 1.15,
    "Chhath Puja": 1.30, "Janmashtami": 1.10, "Raksha Bandhan": 1.10,
    "Ugadi": 1.20, "Vasant Panchami": 1.10,
}


class IndiaPredictor:
    """
    India tourism demand predictor.
    Uses trained ML model if available, otherwise falls back to rule-based engine.
    """

    def __init__(self):
        self._model = None
        self._scaler = None
        self._encoders = None
        self._feature_names = None
        self._use_ml = self._load_model()

    def _load_model(self) -> bool:
        try:
            if os.path.exists(MODEL_PATH):
                self._model = joblib.load(MODEL_PATH)
                self._scaler = joblib.load(SCALER_PATH)
                self._encoders = joblib.load(ENCODERS_PATH)
                self._feature_names = joblib.load(FEATURES_PATH)
                print("✅ Loaded trained ML model for predictions")
                return True
        except Exception as e:
            print(f"⚠️  Could not load ML model: {e} — using rule-based fallback")
        return False

    def _ml_predict(self, state: str, month: int, festival: str, season: str) -> int:
        """Predict using the trained ML model."""
        import numpy as np
        import pandas as pd

        row = {
            "state": state,
            "season": season,
            "festival_name": festival,
            "month": month,
            "year": 2025,
            "is_festival": 1 if festival != "None" else 0,
            "temperature": 25.0,
            "humidity": 60.0,
            "rainfall": 0.0,
            "domestic_tourists": STATE_BASE_MONTHLY.get(state, 1000000),
            "foreign_tourists": int(STATE_BASE_MONTHLY.get(state, 1000000) * 0.05),
            "total_tourists": STATE_BASE_MONTHLY.get(state, 1000000),
        }

        df = pd.DataFrame([row])

        # Preprocessing
        from app.ml.data_preprocessing import preprocess_data
        from app.ml.feature_engineering import create_features

        df, _ = preprocess_data(df, label_encoders=self._encoders, fit=False)
        df = create_features(df)

        # Build feature vector
        X = []
        for fname in self._feature_names:
            X.append(float(df.get(fname, pd.Series([0])).iloc[0]))

        X_scaled = self._scaler.transform([X])
        prediction = self._model.predict(X_scaled)[0]
        return max(int(prediction), 1000)

    def _rule_predict(self, state: str, month: int, festival: str, season: str) -> int:
        """Fallback rule-based prediction engine."""
        base = STATE_BASE_MONTHLY.get(state, 1000000)
        month_f = MONTHLY_FACTORS.get(month, 1.0)
        season_f = SEASON_MULT.get(season, 1.0)
        festival_f = FESTIVAL_MULT.get(festival, 1.0)

        # Temperature comfort factor (optimal 15–28°C for India tourism)
        temp_f = 1.05

        noise = random.uniform(0.92, 1.08)
        predicted = int(base * month_f * season_f * festival_f * temp_f * noise)
        return max(predicted, 1000)

    def predict(self, state: str, month: int, festival: str = "None", season: str = "Winter") -> dict:
        """
        Generate a tourism prediction for an Indian state.
        Returns: { date, state, predicted_tourists, demand_level, month, festival }
        """
        from datetime import datetime
        month_names = ["", "January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"]

        if self._use_ml:
            predicted = self._ml_predict(state, month, festival, season)
        else:
            predicted = self._rule_predict(state, month, festival, season)

        # Determine demand level relative to state base
        base = STATE_BASE_MONTHLY.get(state, 1000000)
        ratio = predicted / max(base, 1)

        if ratio > 1.6:
            demand_level = "Very High"
        elif ratio > 1.15:
            demand_level = "High"
        elif ratio > 0.75:
            demand_level = "Medium"
        else:
            demand_level = "Low"

        return {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "state": state,
            "predicted_tourists": predicted,
            "demand_level": demand_level,
            "month": month,
            "festival": festival,
            "model_type": "ML" if self._use_ml else "Rule-Based",
        }
