"""
ML Pipeline: Model Training for India Tourism Forecasting
Trains 5 ML models on India state-wise tourism data.
Run: python -m app.ml.train_models (from backend directory)
"""
import os
import sys
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

try:
    from xgboost import XGBRegressor
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False
    print("⚠️  XGBoost not installed — skipping.")

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")


def evaluate_model(name: str, model, X_test, y_test) -> dict:
    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = max(r2_score(y_test, preds), 0.0)
    print(f"  [{name:22s}] MAE={mae:>12,.0f} | RMSE={rmse:>12,.0f} | R²={r2:.4f}")
    return {"name": name, "model": model, "mae": mae, "rmse": rmse, "r2": r2, "preds": preds}


def train():
    """Full training pipeline on India tourism data."""
    # Import here to avoid circular imports when running standalone
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

    from app.ml.data_preprocessing import preprocess_data, scale_features, get_feature_columns
    from app.ml.feature_engineering import create_features, get_feature_names

    os.makedirs(MODEL_DIR, exist_ok=True)

    # ─── Load data ──────────────────────────────────────────────
    print("📥 Loading India tourism training data...")
    try:
        # Try to load from DB first
        import asyncio, motor.motor_asyncio
        from dotenv import load_dotenv
        load_dotenv()
        MONGO_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

        async def load_from_db():
            client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
            db = client.tourist_db
            records = []
            async for doc in db.tourist_data.find():
                doc.pop("_id", None)
                records.append(doc)
            client.close()
            return records

        records = asyncio.run(load_from_db())
        if records:
            import pandas as pd
            df = pd.DataFrame(records)
            print(f"  ✅ Loaded {len(df)} records from MongoDB")
        else:
            raise ValueError("MongoDB empty")
    except Exception as e:
        print(f"  ⚠️  Cannot load from MongoDB ({e}), using generator...")
        # Fall back to in-memory generation
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "scripts"))
        from generate_sample_data import generate_dataframe
        df = generate_dataframe(use_live_weather=False)
        print(f"  ✅ Generated {len(df)} records in-memory")

    # ─── Preprocess ─────────────────────────────────────────────
    print("🔧 Preprocessing data...")
    df, label_encoders = preprocess_data(df, fit=True)
    df = create_features(df)

    feature_names = get_feature_names()
    available_features = [f for f in feature_names if f in df.columns]
    target_col = "total_tourists"

    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found in DataFrame")

    X = df[available_features].fillna(0).values
    y = df[target_col].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    X_train_s, X_test_s, scaler = scale_features(X_train, X_test)

    # ─── Train models ───────────────────────────────────────────
    print("\n🤖 Training models on India tourism data...")
    print(f"   Features: {len(available_features)} | Train: {len(X_train)} | Test: {len(X_test)}")
    print("-" * 75)

    models_to_train = [
        ("Linear Regression", LinearRegression()),
        ("Random Forest", RandomForestRegressor(n_estimators=150, n_jobs=-1, random_state=42)),
        ("Gradient Boosting", GradientBoostingRegressor(n_estimators=150, learning_rate=0.08, random_state=42)),
        ("SVR", SVR(kernel="rbf", C=1e6, epsilon=5e4)),
    ]
    if HAS_XGBOOST:
        models_to_train.append(("XGBoost", XGBRegressor(
            n_estimators=200, learning_rate=0.07,
            max_depth=6, subsample=0.8, random_state=42, verbosity=0
        )))

    results = []
    for name, model in models_to_train:
        print(f"  Training {name}...")
        model.fit(X_train_s, y_train)
        results.append(evaluate_model(name, model, X_test_s, y_test))

    # ─── Select best ────────────────────────────────────────────
    best = max(results, key=lambda r: r["r2"])
    print(f"\n🏆 Best model: {best['name']}  |  R²={best['r2']:.4f}  |  MAE={best['mae']:,.0f}")

    # ─── Save artifacts ─────────────────────────────────────────
    joblib.dump(best["model"], os.path.join(MODEL_DIR, "tourism_model.pkl"))
    joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))
    joblib.dump(label_encoders, os.path.join(MODEL_DIR, "encoders.pkl"))
    joblib.dump(available_features, os.path.join(MODEL_DIR, "feature_names.pkl"))

    # Save results summary
    import json
    summary = {
        "best_model": best["name"],
        "r2": round(best["r2"], 4),
        "mae": round(best["mae"], 0),
        "rmse": round(best["rmse"], 0),
        "features": available_features,
    }
    with open(os.path.join(MODEL_DIR, "training_results.json"), "w") as f:
        json.dump(summary, f, indent=2)

    print(f"\n📦 Model artifacts saved to: {MODEL_DIR}")
    return summary


if __name__ == "__main__":
    train()
