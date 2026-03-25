'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Brain, MapPin, Thermometer, Droplets, Calendar, Star, TrendingUp, Zap } from 'lucide-react';
import { makePrediction, fetchPredictions, INDIA_STATES, INDIA_FESTIVALS, INDIA_SEASONS, type Prediction } from '@/lib/api';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const DEMAND_COLORS: Record<string, string> = {
  'Very High': '#c0392b',
  'High': '#e67e22',
  'Medium': '#f39c12',
  'Low': '#27ae60',
};

const DEMAND_BADGES: Record<string, string> = {
  'Very High': 'bg-red-900/40 text-red-400 border border-red-800/40',
  'High': 'bg-orange-900/40 text-orange-400 border border-orange-800/40',
  'Medium': 'bg-yellow-900/40 text-yellow-400 border border-yellow-800/40',
  'Low': 'bg-green-900/40 text-green-400 border border-green-800/40',
};

const tooltipStyle = { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#E5E5E5' };

const SEASONAL_FORECAST = MONTH_NAMES.map((m, i) => {
  const factors = [1.30,1.20,1.10,0.85,0.70,0.60,0.55,0.60,0.75,1.10,1.35,1.40];
  return { month: m, forecast: Math.round(93900000 * factors[i] / 1e6 * 10) / 10 };
});

export default function Predictions() {
  const [form, setForm] = useState({
    state: 'Rajasthan',
    month: new Date().getMonth() + 1,
    festival: 'Diwali',
    season: 'Winter',
  });
  const [result, setResult] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchPredictions().then(setHistory).catch(() => {}).finally(() => setFetching(false));
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await makePrediction(form);
      setResult(res);
      setHistory(prev => [res, ...prev.slice(0, 14)]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) => n >= 1e6 ? `${(n/1e6).toFixed(2)}M` : n >= 1e3 ? `${(n/1e3).toFixed(1)}K` : n.toString();

  const historyChart = history.slice(0, 10).reverse().map((p, i) => ({
    name: `${p.state?.slice(0,3) ?? '?'} M${p.month ?? i+1}`,
    tourists: Math.round((p.predicted_tourists || 0) / 1000),
    demand: p.demand_level,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="font-manrope text-4xl font-extrabold text-white">ML Prediction Engine</h1>
        <p className="text-gray-500 mt-1">Forecast tourist arrivals for any Indian state using trained ML models</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 glass-card p-8 rounded-2xl">
          <h2 className="font-manrope text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#c0392b]" /> Run India Forecast
          </h2>
          <div className="space-y-5">
            <div>
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Indian State</label>
              <select
                value={form.state}
                onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                className="dark-input w-full rounded-xl px-4 py-3 text-white bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#7A1C1C]/60"
              >
                {INDIA_STATES.map(s => <option key={s} value={s} className="bg-[#1A1A1A]">{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Month</label>
                <select
                  value={form.month}
                  onChange={e => setForm(f => ({ ...f, month: parseInt(e.target.value) }))}
                  className="dark-input w-full rounded-xl px-4 py-3 text-white bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#7A1C1C]/60"
                >
                  {MONTH_NAMES.map((m, i) => <option key={i+1} value={i+1} className="bg-[#1A1A1A]">{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Season</label>
                <select
                  value={form.season}
                  onChange={e => setForm(f => ({ ...f, season: e.target.value }))}
                  className="dark-input w-full rounded-xl px-4 py-3 text-white bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#7A1C1C]/60"
                >
                  {INDIA_SEASONS.map(s => <option key={s} value={s} className="bg-[#1A1A1A]">{s}</option>)}
                </select>
              </div>
            </div>



            <div>
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Festival / Event</label>
              <select
                value={form.festival}
                onChange={e => setForm(f => ({ ...f, festival: e.target.value }))}
                className="dark-input w-full rounded-xl px-4 py-3 text-white bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#7A1C1C]/60"
              >
                {INDIA_FESTIVALS.map(f => <option key={f} value={f} className="bg-[#1A1A1A]">{f}</option>)}
              </select>
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="w-full py-3.5 bg-[#7A1C1C] hover:bg-[#8b2020] text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <><span className="animate-spin">⟳</span> Predicting...</> : <><Zap className="w-4 h-4" /> Run ML Prediction</>}
            </button>
          </div>

          {/* Result Card */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 rounded-xl bg-white/3 border border-[#7A1C1C]/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Prediction Result</span>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${DEMAND_BADGES[result.demand_level]}`}>{result.demand_level} Demand</span>
              </div>
              <div className="text-white text-3xl font-extrabold font-manrope">{fmt(result.predicted_tourists)}</div>
              <div className="text-gray-500 text-sm mt-1">Predicted tourists · {result.state} · {MONTH_NAMES[(result.month ?? 1) - 1]}</div>
              {result.festival && result.festival !== 'None' && (
                <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1"><Star className="w-3 h-3" /> {result.festival} impact applied</div>
              )}
            </motion.div>
          )}
        </div>

        {/* Seasonal Forecast Chart */}
        <div className="lg:col-span-3 glass-card p-8 rounded-2xl">
          <h2 className="font-manrope text-xl font-bold text-white mb-2">India Seasonal Forecast</h2>
          <p className="text-gray-600 text-xs mb-6">All-India monthly tourism forecast (Millions) based on seasonal patterns</p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SEASONAL_FORECAST}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#555" tick={{ fill: '#777', fontSize: 11 }} />
                <YAxis stroke="#555" tick={{ fill: '#777', fontSize: 11 }} tickFormatter={v => `${v}M`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}M tourists`, 'Forecast']} />
                <Line type="monotone" dataKey="forecast" stroke="#c0392b" strokeWidth={2.5} dot={{ fill: '#c0392b', r: 4 }} name="Monthly Forecast" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* History chart */}
          {historyChart.length > 0 && (
            <div className="mt-6">
              <h3 className="font-manrope text-sm font-bold text-gray-400 mb-4">Recent Predictions ({historyChart.length})</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#555" tick={{ fill: '#777', fontSize: 10 }} />
                    <YAxis stroke="#555" tick={{ fill: '#777', fontSize: 10 }} tickFormatter={v => `${v}K`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${(v/1000).toFixed(1)}M`, 'Predicted']} />
                    <Bar dataKey="tourists" radius={[4, 4, 0, 0]} name="Predicted (K)">
                      {historyChart.map((entry, i) => (
                        <Cell key={i} fill={DEMAND_COLORS[entry.demand] || '#7A1C1C'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prediction history table */}
      {history.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-8 py-5 border-b border-white/5">
            <h2 className="font-manrope font-bold text-white">Prediction Ledger</h2>
            <p className="text-gray-600 text-xs">All ML predictions run this session</p>
          </div>
          <table className="w-full">
            <thead><tr className="text-left text-xs text-gray-600 uppercase tracking-wider border-b border-white/5">
              <th className="px-6 py-3">State</th>
              <th className="px-6 py-3">Month</th>
              <th className="px-6 py-3">Festival</th>
              <th className="px-6 py-3">Predicted Tourists</th>
              <th className="px-6 py-3">Demand Level</th>
            </tr></thead>
            <tbody>
              {history.slice(0, 10).map((p, i) => (
                <tr key={i} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4 text-white text-sm font-medium">{p.state}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{MONTH_NAMES[(p.month ?? 1) - 1]}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{p.festival || 'None'}</td>
                  <td className="px-6 py-4 text-white text-sm font-bold font-manrope">{fmt(p.predicted_tourists)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${DEMAND_BADGES[p.demand_level]}`}>{p.demand_level}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
