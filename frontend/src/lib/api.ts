const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export interface DashboardSummary {
  total_tourists_this_month: number;
  total_domestic: number;
  total_foreign: number;
  avg_occupancy_rate: number;
  sustainability_score: number;
  top_state: string;
  peak_month: string;
  active_destinations: number;
  ml_accuracy: number;
}

export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch('/api/dashboard/summary');
}

// ─────────────────────────────────────────────────────────────────────────────
// Tourism
// ─────────────────────────────────────────────────────────────────────────────
export interface TouristData {
  date: string;
  state: string;
  domestic_tourists: number;
  foreign_tourists: number;
  total_tourists?: number;
  temperature?: number;
  humidity?: number;
  weather_condition?: string;
  season?: string;
  festival_name?: string;
  is_festival?: number;
  month?: number;
  year?: number;
}

export interface TourismState {
  state: string;
  domestic_tourists: number;
  foreign_tourists: number;
  total_tourists: number;
  growth_rate?: number;
  rank?: number;
}

export interface MonthlyTourism {
  month: string;
  month_num: number;
  domestic: number;
  foreign: number;
  total: number;
}

export function fetchTourismHistory(): Promise<TouristData[]> {
  return apiFetch('/api/tourism/history');
}

export function fetchTourismStates(): Promise<TourismState[]> {
  return apiFetch('/api/tourism/states');
}

export function fetchMonthlyTourism(): Promise<MonthlyTourism[]> {
  return apiFetch('/api/tourism/monthly');
}

// ─────────────────────────────────────────────────────────────────────────────
// Predictions
// ─────────────────────────────────────────────────────────────────────────────
export interface Prediction {
  date: string;
  state: string;
  predicted_tourists: number;
  demand_level: string;
  month?: number;
  festival?: string;
}

export interface PredictionInput {
  state: string;
  month: number;
  festival: string;
  season: string;
}

export function fetchPredictions(): Promise<Prediction[]> {
  return apiFetch('/api/predict/latest');
}

export function makePrediction(input: PredictionInput): Promise<Prediction> {
  const params = new URLSearchParams({
    state: input.state,
    month: input.month.toString(),
    festival: input.festival,
    season: input.season,
  });
  return apiFetch(`/api/predict?${params.toString()}`, { method: 'POST' });
}

export async function fetchPredictionConfig(): Promise<{ states: string[]; festivals: string[] }> {
  try {
    return await apiFetch('/api/predict/states');
  } catch {
    return { states: INDIA_STATES, festivals: INDIA_FESTIVALS };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing
// ─────────────────────────────────────────────────────────────────────────────
export interface PricingItem {
  hotel_id: string;
  hotel_name?: string;
  location?: string;
  state?: string;
  current_price?: number;
  recommended_price: number;
  demand_factor: number;
  demand_level?: string;
}

export function fetchPricingSuggestions(): Promise<PricingItem[]> {
  return apiFetch('/api/pricing/suggestions');
}

// ─────────────────────────────────────────────────────────────────────────────
// Sustainability
// ─────────────────────────────────────────────────────────────────────────────
export interface SustainabilityMetric {
  state: string;
  date: string;
  total_tourists: number;
  tourist_density: string;
  density_value?: number;
  carbon_estimate: number;
  waste_generation: number;
}

export interface DensityAlert {
  state: string;
  density: string;
  monthly_visitors: number;
  capacity: number;
  alert: string;
}

export function fetchSustainabilityMetrics(): Promise<SustainabilityMetric[]> {
  return apiFetch('/api/sustainability');
}

export async function fetchDensityAlerts(): Promise<{ alerts: DensityAlert[] }> {
  try {
    return await apiFetch('/api/sustainability/alerts');
  } catch {
    return { alerts: [] };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Static reference data (fallbacks for dropdowns)
// ─────────────────────────────────────────────────────────────────────────────
export const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Uttarakhand", "Uttar Pradesh", "West Bengal",
];

export const INDIA_FESTIVALS = [
  "None", "Diwali", "Holi", "Navratri", "Dussehra", "Christmas", "New Year Eve",
  "Onam", "Ganesh Chaturthi", "Baisakhi", "Makar Sankranti", "Republic Day",
  "Independence Day", "Eid ul-Fitr", "Chhath Puja", "Janmashtami",
  "Raksha Bandhan", "Ugadi", "Vasant Panchami",
];

export const INDIA_SEASONS = ["Winter", "Spring", "Summer", "Monsoon", "Autumn"];
