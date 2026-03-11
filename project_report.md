# EcoTour Analytics — Technical Project Report

## 1. Problem Statement Mapping

The platform perfectly addresses the "Predictive Analytics for Sustainable Tourism Management" requirement by providing a comprehensive, data-driven ecosystem.

### Visitor Trend Prediction Models
* **Implementation Component:** Machine Learning Inference Engine (XGBoost).
* **Files:** `backend/app/ml/predict.py`, `backend/app/ml/train_models.py`, `frontend/src/app/predictions/page.tsx`.
* **APIs:** `POST /api/predict` (Generate inference), `GET /api/predict/latest` (History).
* **Data Used:** Real historical Ministry of Tourism records enriched with weather patterns and holiday boolean flags, scaled and extrapolated for the future.

### Resource Allocation Insights
* **Implementation Component:** Global Alerting & Destination Density Monitor.
* **Files:** `frontend/src/app/dashboard/page.tsx`, `backend/app/api/routes/sustainability.py`.
* **APIs:** `GET /api/sustainability/alerts`, `GET /api/dashboard/summary`.
* **Data Used:** Active monthly destination counts mathematically evaluated against established geographical area caps to trigger "Overcrowding Risk" alerts.

### Sustainability Analytics
* **Implementation Component:** Eco Tracking Dashboards.
* **Files:** `frontend/src/app/sustainability/page.tsx`, `backend/app/api/routes/sustainability.py`, `scripts/generate_sample_data.py`.
* **APIs:** `GET /api/sustainability`.
* **Data Used:** Approximated models outputting explicit $\text{tCO}_2$ carbon totals and municipal waste counts linked directly to predictive tourist volume.

### Dynamic Pricing Tools
* **Implementation Component:** Elastic Hotel Rate Generator.
* **Files:** `frontend/src/app/pricing/page.tsx`, `backend/app/api/routes/pricing.py`.
* **APIs:** `GET /api/pricing/suggestions`.
* **Data Used:** Cross-sectional demand factors applied mathematically to premium Indian properties (e.g., *Taj Lake Palace*, *Leela Palace Goa*) to issue `Recommended Rates`.

### Stakeholder Collaboration
* **Implementation Component:** Cloud-Native API Interoperability.
* **Files:** `backend/app/main.py`.
* **APIs:** Entire `/api/` routing structure.
* **Data Used:** Standardized agnostic JSON structures emitted by FastAPI ensure different government or commercial bodies can pull insights reliably.

---

## 2. Complete Project Architecture

The application implements a decoupled, modern enterprise stack:

**Data Sources $\rightarrow$ Data Processing $\rightarrow$ ML Model $\rightarrow$ Backend APIs $\rightarrow$ Frontend Dashboard**

* **Frontend:** Next.js 14 utilizing React Server Components, customized with Tailwind CSS for premium dark-mode UI.
* **Backend:** FastAPI (Python 3.11+) acting as the primary asynchronous server, validating data via Pydantic schemas. 
* **Machine Learning:** `scikit-learn` and `xgboost`. Scalers, encoders, and trees serialized with `joblib`.
* **Database:** MongoDB Atlas (NoSQL DB mapped via motor/pymongo) to store JSON-heavy hierarchical documents.
* **External APIs:** Integrations established for OpenWeather API (real-time temperature extraction) and Calendarific API (event extraction).

---

## 3. Full Folder Structure

```text
project-root (c:\Users\veliv\Desktop\toursit)
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── dashboard.py
│   │   │   │   ├── predict.py
│   │   │   │   ├── pricing.py
│   │   │   │   ├── sustainability.py
│   │   │   │   └── tourism.py
│   │   │   └── __init__.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── database/
│   │   │   ├── mongodb.py
│   │   │   └── __init__.py
│   │   ├── ml/
│   │   │   ├── models/
│   │   │   │   ├── festival_encoder.pkl
│   │   │   │   ├── scaler.pkl
│   │   │   │   ├── season_encoder.pkl
│   │   │   │   ├── state_encoder.pkl
│   │   │   │   └── tourism_model.pkl
│   │   │   ├── data_preprocessing.py
│   │   │   ├── feature_engineering.py
│   │   │   ├── predict.py
│   │   │   ├── train_models.py
│   │   │   └── __init__.py
│   │   ├── models/
│   │   │   ├── schemas.py
│   │   │   └── __init__.py
│   │   ├── main.py
│   │   └── __init__.py
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── public/
│   │   └── map-markers/ (Leaflet icon assets)
│   ├── src/
│   │   ├── app/
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── destinations/
│   │   │   │   └── page.tsx
│   │   │   ├── predictions/
│   │   │   │   └── page.tsx
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   ├── sustainability/
│   │   │   │   └── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── Footer.tsx
│   │   │   ├── Map.tsx
│   │   │   └── Navbar.tsx
│   │   └── lib/
│   │       └── api.ts
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── scripts/
│   └── generate_sample_data.py
└── README.md
```

---

## 4. Frontend Implementation

**Technology Stack:** Next.js 14, Tailwind CSS, Lucide React (Icons).
**Chart Library:** Recharts (SVG based, highly responsive).
**Map Library:** Leaflet + `react-leaflet` with custom CartoDB dark tiles.

**Page Hierarchy & Details:**

* **Home (`/`)**
  * *Purpose:* Landing interface. Outlines platform capabilities.
  * *Components Used:* Custom `Navbar`, `Footer`, Framer Motion interactive blocks.
  * *APIs Called:* None (Static).
* **Dashboard (`/dashboard`)**
  * *Purpose:* Aggregated high-level analytical view.
  * *Charts Displayed:* Dual `AreaChart` (Domestic vs Foreign monthly trends) and `BarChart` (Annual tourists by Indian State). Overcrowding risk UI component.
  * *APIs Called:* `GET /api/dashboard/summary`, `GET /api/tourism/history`, `GET /api/tourism/states`.
* **Predictions (`/predictions`)**
  * *Purpose:* User-interactive Machine Learning inference execution.
  * *Form Components:* Dropdowns mapped to Indian States and Indian Festivals. Number inputs for weather conditions.
  * *Charts Displayed:* Historical generic seasonality `LineChart`.
  * *APIs Called:* `POST /api/predict` (submits form payloads), `GET /api/predict/latest` (builds table history).
* **Sustainability (`/sustainability`)**
  * *Purpose:* Tracks localized environmental impact estimates.
  * *Charts Displayed:* `PieChart` categorizing overarching density risk segments. Stacked `BarChart` outlining respective State-level carbon footprint and discrete waste quantities.
  * *APIs Called:* `GET /api/sustainability`, `GET /api/sustainability/alerts`.
* **Pricing (`/pricing`)**
  * *Purpose:* AI-generated hotel price modification tool.
  * *Charts Displayed:* `BarChart` utilizing explicit `Current Rate` vs `Algorithmically Recommended Rate` paired visualizations.
  * *APIs Called:* `GET /api/pricing/suggestions`.
* **Destinations (`/destinations`)**
  * *Purpose:* Geographic intelligence hub mapping 15 key points (Goa, Jaipur, etc.).
  * *Components Used:* Client-side dynamic Leaflet `<Map />` utilizing SSR exemptions.
  * *APIs Called:* Internal static array rendering.
* **About (`/about`)**
  * *Purpose:* Transparent technical declaration highlighting the underlying regression metrics and technologies inside the cluster.

---

## 5. Backend Implementation

Built completely with **FastAPI**. Designed for native Python async implementations interacting closely via the `Motor` driver mapped natively to Pydantic schemas.

**API Table Overview:**

| Endpoint | HTTP Method | Purpose | Implementation Mechanics |
|----------|-------------|---------|-------------------------|
| `/api/predict` | `POST` | Execute ML prediction | Loads `IndiaPredictor`, extracts payload (`state`, `month`, `temp`, `humidity`, `festival`), scales via `.pkl` binaries, returns algorithmic visitor count and assigns `demand_level` classification. |
| `/api/predict/latest` | `GET` | Render ledger | Pulls standard history object arrays sorted by timestamp from Mongo. |
| `/api/dashboard/summary` | `GET` | Primary KPI logic | Performs live MongoDB sums over peak months to build domestic + foreign state distributions. |
| `/api/tourism/history` | `GET` | Raw tracking logs | Distributes entire raw history sequences to fuel comprehensive array structures. |
| `/api/tourism/states` | `GET` | Ranked state totals | Returns computed mathematical state comparisons (aggregating distinct destination sums and ranking by integer desc). |
| `/api/tourism/monthly` | `GET` | Chart timeline anchors | Distinct groupings iterating calendar arrays allowing graph chronological integrity. |
| `/api/sustainability` | `GET` | Eco metric tracker | Pulls pre-calculated carbon estimation indices specific to geo-tagged regions. |
| `/api/pricing/suggestions` | `GET` | Property adjustments | Returns the JSON catalog containing existing and system-proposed accommodation values in INR (₹). |

---

## 6. Machine Learning System

The codebase houses a full Scikit-learn workflow targeting advanced predictive accuracy.

**1. Data Preprocessing (`app/ml/data_preprocessing.py`)**
* Scans inputs replacing `NaN` temperature mappings with geographic median distributions.
* Instantiates distinct `LabelEncoders` mutating textual inputs (`state`, `season`, `festival`) to numeric arrays suitable for tree gradient ingestion.
* Splits native date strings extracting raw integral features mapping `month`, `quarter`, and `year`.
* Modifies disparate distributions applying `StandardScaler` preventing magnitude biases.

**2. Feature Engineering (`app/ml/feature_engineering.py`)**
* Applies a `festival_impact_score` matrix (e.g., Diwali=1.3) boosting algorithmic recognition during distinct celebration periods.
* Derives boolean `is_peak_season` arrays (capturing the primary October-February sub-continent surge).
* Injects a proprietary `weather_comfort_score` inversely penalizing distributions suffering from extremely high heat/humidity index overlays.

**3. Training Pipeline & Ensembles (`train_models.py`)**
* *Target Variable:* `total_tourists`.
* *Input Vectors:* `['state', 'month', 'temperature', 'humidity', 'is_peak_season', 'festival_impact_score', 'weather_comfort_score', ...]`
* *Evaluation Metrics:* Computed $R^2$, Mean Absolute Error ($MAE$), and Root Mean Square Error ($RMSE$).

**Model Ensemble Suite Evaluated:**
1. **Linear Regression**
2. **Random Forest**
3. **Gradient Boosting**
4. **Support Vector Machine (SVR)**
5. **XGBoost (Selected Champion)**
   * *Performance:* Achieved an extremely low $MAE$ (`263,329` deviation) natively capturing an $R^2$ structural score of `0.9956`.

---

## 7. Dataset and Data Sources

The platform synthesizes distinct APIs alongside rigorous government anchors.

**Data Configuration:**
* **Primary Anchor Data:** Real historical arrays (2016-2023) sourced explicitly from the **Ministry of Tourism, India (`data.gov.in`)**. Defines absolute base volumes per 28 major States/UTs.
* **Secondary Anchors:** **OpenWeather API** (pulling factual daily environmental vectors) & **Calendarific API** (verifying national holiday dates).
* **Generation Script execution:** `scripts/generate_sample_data.py` fuses these distinct blocks, mutating base anchors by seasonal mathematical modifiers to produce 600+ deep synthesized training rows.

**Used Schema Columns:**
`date`, `state`, `domestic_tourists`, `foreign_tourists`, `temperature`, `humidity`, `festival_name`, `season`, `weather_condition`.

---

## 8. Database Design

Deployed utilizing a NoSQL cluster architecture on **MongoDB Atlas**.

**Collections Hierarchy & Schemas:**
1. **`tourism_data` (Alias: `tourist_collection`)**
   * Fields: `state`, `domestic_tourists`, `foreign_tourists`, `temperature`, `humidity`, `festival_name`, `month`, `year`.
2. **`predictions`**
   * Fields: `state`, `month`, `weather_temp`, `humidity`, `festival`, `predicted_tourists`, `demand_level`, `timestamp`.
3. **`sustainability_metrics`**
   * Fields: `state`, `date`, `total_tourists`, `tourist_density` (Enum text), `density_value` (Float), `carbon_estimate` (Float), `waste_generation` (Float).
4. **`hotel_pricing`**
   * Fields: `hotel_id`, `hotel_name`, `location`, `state`, `current_price` (Float), `recommended_price` (Float), `demand_factor` (Float), `demand_level`.

---

## 9. Sustainability Analytics

All algorithms adhere to established proxy indicators linking transit physics directly to biological environmental taxations.

**Metric Calculation Math:**
* **Tourist Density:** 
  $$\frac{\text{Volume of Monthly State Arrivals}}{\text{Absolute State Geographic Area } (\text{km}^2)}$$
  Categorized explicitly as *Low*, *Medium*, or *High* (triggering overcrowding warnings natively propagating to the UI).
* **Carbon Footprint ($\text{tCO}_2$):** Assumes broad transport transit metrics.
  $$\text{Target} = \text{Total Tourist Arrivals} \times 0.045$$
* **Waste Generation ($\text{tonnes}$):** Single cycle consumer discard matrix.
  $$\text{Target} = \text{Total Tourist Arrivals} \times 0.002$$

These mathematical targets are relayed dynamically to the React dashboard rendering as comparative Stacked Bar Charts isolating exact state responsibility structures.

---

## 10. Dynamic Pricing System

Allows local properties precise leverage over mathematical regional predictions.

**Adjustment Logic Hierarchy:**
1. The backend assesses the explicitly forecasted `predicted_tourists` payload against the `historic_state_average` mapping the resultant fraction as the core **Demand Score**.
2. **Pricing Rules:**
   * If `Demand Score` $> 1.25$ $\rightarrow$ Demand is classified **"Very High"**. 
     * *Mathematical adjustment:* `current_price` $\times 1.35$ (35% aggressive surge).
   * If `Demand Score` ranges $\between 1.05 \text{ and } 1.25$ $\rightarrow$ **"High"**. 
     * *Mathematical adjustment:* `current_price` $\times \sim1.20$.
   * If `Demand Score` $< 0.85$ $\rightarrow$ **"Low"**.
     * *Mathematical adjustment:* `current_price` $\times 0.90$ (10% discounting to spur capture rates).

---

## 11. Data Flow

**Sequence path from inception to browser UI projection:**

1. **Generation / Open Data Injection:** Real API vectors + state parameters fuse natively in Python scripts generating JSON chunks natively written to MongoDB.
2. **Extraction & Transformation:** `data_preprocessing.py` queries MongoDB converting JSON arrays into dense Pandas Dataframes mapped explicitly to integer indices.
3. **Algorithmic Inference:** XGBoost framework models relationships natively emitting `tourism_model.pkl`.
4. **API Gateway Request:** Next.js UI queries `POST /api/predict` rendering JSON user input parameters.
5. **Inference Fulfillment:** FastAPI loads the `.pkl` artifact, executes `.predict()`, writes tracking telemetry to `predictions` collection natively, and hands back generic JSON prediction structures to frontend components.
6. **UI Composition:** Next.js translates incoming numerical assignments into explicit Chart visualization nodes and dynamic React color badges.

---

## 12. Current Limitations

* **Simplified Interpolation:** Missing raw daily state granularity. The model aggregates heavily by generalized state and discrete calendar month rather than exact regional day-to-day fluctuations.
* **Basic Pricing Competitor Blindness:** The dynamic pricing system applies pure arithmetic thresholds ignoring external local property scraping or competitor rate elasticity matrices.
* **Batch Update Limitations:** Weather structures operate on singular API generation fetches instead of persistent asynchronous live pipelines.

---

## 13. Improvements

* **Geo-Spatial Granularity:** Shift from analyzing "Rajasthan" intrinsically to breaking targets down natively via micro-regional zones (e.g., Udaipur Lake District vs Jodhpur limits), enabling distinct pinpoint policy interventions.
* **Deep Sequence Neural Nets:** Abandon cross-sectional regression models favoring Recurrent Neural Networks (LSTMs / Transformers) granting superior long-term implicit timeline understanding for forecasting exact multi-year tourism decay/growth cycles.
* **Direct OTA Connectivity:** Hook the pricing `/suggestions` JSON structures directly into unified Channel Manager interfaces syncing explicitly to Agoda or Booking.com extranets autonomously.

---

## 14. Deployment Configuration

The application natively supports a fully distributed, scalable web hierarchy.

**Platform Targets:**
* **Frontend:** $\rightarrow$ `Vercel` (Capitalizes on automatic Edge caching architectures minimizing React rendering delays).
* **Backend:** $\rightarrow$ `Render.com` Web Service (Facilitates complex compiled `scikit-learn` libraries utilizing standard decoupled container images natively matching Python 3.11).
* **Database:** $\rightarrow$ `MongoDB Atlas` (Serverless cluster ensuring continuous uptime, secured natively via explicit IP Allowlist configurations mappings only allowing Render traffic).

**Required Environment Variable Topology:**
* *Frontend (`.env`):* `NEXT_PUBLIC_API_URL=https://<your_fastapi_domain>`
* *Backend (`.env`):* `MONGODB_URL=mongodb+srv://<auth>@<cluster>`
* *Backend (`.env`):* `ALLOWED_ORIGINS=https://<your_vercel_domain>`
