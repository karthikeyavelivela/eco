"""
ML Pipeline: Data Preprocessing for India Tourism
Handles India-specific state-wise data with domestic/foreign tourist counts,
festival flags, weather features, and seasonal information.
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer

# ─────────────────────────────────────────────────────────────────────────────
# Column definitions
# ─────────────────────────────────────────────────────────────────────────────
CATEGORICAL_COLS = ["state", "season", "festival_name", "weather_condition"]
NUMERIC_COLS = ["domestic_tourists", "foreign_tourists", "temperature", "humidity",
                "rainfall", "month", "year", "is_festival"]
TARGET_COL = "total_tourists"

def preprocess_data(df: pd.DataFrame, label_encoders: dict = None, fit: bool = True):
    """
    Full preprocessing pipeline for India tourism data.
    Args:
        df: Raw DataFrame with India tourism columns
        label_encoders: Existing encoders (pass during inference)
        fit: If True, fit new encoders. If False, use provided encoders.
    Returns:
        processed_df, label_encoders, scaler (or None during inference)
    """
    df = df.copy()

    # ─── Derived columns ──────────────────────────────────────
    if "total_tourists" not in df.columns or df["total_tourists"].isna().all():
        df["total_tourists"] = df["domestic_tourists"].fillna(0) + df["foreign_tourists"].fillna(0)

    if "month" not in df.columns and "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df["month"] = df["date"].dt.month
        df["year"] = df["date"].dt.year
        df["day_of_week"] = df["date"].dt.dayofweek
        df["quarter"] = df["date"].dt.quarter

    # ─── Handle missing values ─────────────────────────────────
    for col in ["temperature", "humidity", "rainfall"]:
        if col in df.columns:
            df[col] = df[col].fillna(df[col].median() if not df[col].isna().all() else 25.0)

    for col in ["festival_name", "weather_condition"]:
        if col in df.columns:
            df[col] = df[col].fillna("None")

    for col in ["season"]:
        if col in df.columns:
            df[col] = df[col].fillna("Winter")

    df["is_festival"] = df["is_festival"].fillna(0).astype(int)

    # ─── Encode categoricals ──────────────────────────────────
    if label_encoders is None:
        label_encoders = {}

    for col in CATEGORICAL_COLS:
        if col not in df.columns:
            continue
        if fit:
            le = LabelEncoder()
            df[f"{col}_enc"] = le.fit_transform(df[col].astype(str))
            label_encoders[col] = le
        else:
            le = label_encoders.get(col)
            if le:
                # Handle unseen labels gracefully
                known = set(le.classes_)
                df[col] = df[col].apply(lambda x: x if str(x) in known else le.classes_[0])
                df[f"{col}_enc"] = le.transform(df[col].astype(str))
            else:
                df[f"{col}_enc"] = 0

    return df, label_encoders


def get_feature_columns() -> list:
    """Return the feature column list used during training."""
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
        # Engineered features (added by feature_engineering.py)
        "is_peak_season",
        "festival_impact",
        "weather_comfort_score",
        "state_popularity_rank",
        "domestic_ratio",
    ]


def scale_features(X_train: np.ndarray, X_test: np.ndarray = None):
    """StandardScale features. Returns scaled arrays + fitted scaler."""
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    if X_test is not None:
        X_test_scaled = scaler.transform(X_test)
        return X_train_scaled, X_test_scaled, scaler
    return X_train_scaled, scaler
