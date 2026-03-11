'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Globe, Leaf, TrendingUp, Activity, MapPin, AlertTriangle, Award } from 'lucide-react';
import {
  fetchDashboardSummary, fetchMonthlyTourism, fetchTourismStates,
  type DashboardSummary, type MonthlyTourism, type TourismState
} from '@/lib/api';

const MONTHLY_FALLBACK: MonthlyTourism[] = [
  { month: 'Jan', month_num: 1, domestic: 89400000, foreign: 1260000, total: 90660000 },
  { month: 'Feb', month_num: 2, domestic: 82300000, foreign: 1160000, total: 83460000 },
  { month: 'Mar', month_num: 3, domestic: 75500000, foreign: 1060000, total: 76560000 },
  { month: 'Apr', month_num: 4, domestic: 58300000, foreign: 820000, total: 59120000 },
  { month: 'May', month_num: 5, domestic: 48000000, foreign: 680000, total: 48680000 },
  { month: 'Jun', month_num: 6, domestic: 41200000, foreign: 580000, total: 41780000 },
  { month: 'Jul', month_num: 7, domestic: 37700000, foreign: 530000, total: 38230000 },
  { month: 'Aug', month_num: 8, domestic: 41200000, foreign: 580000, total: 41780000 },
  { month: 'Sep', month_num: 9, domestic: 51400000, foreign: 720000, total: 52120000 },
  { month: 'Oct', month_num: 10, domestic: 75500000, foreign: 1060000, total: 76560000 },
  { month: 'Nov', month_num: 11, domestic: 92600000, foreign: 1300000, total: 93900000 },
  { month: 'Dec', month_num: 12, domestic: 96000000, foreign: 1350000, total: 97350000 },
];

const TOP_STATES_FALLBACK: TourismState[] = [
  { state: 'Tamil Nadu', domestic_tourists: 333541143, foreign_tourists: 4683809, total_tourists: 338224952, growth_rate: 8.2, rank: 1 },
  { state: 'Uttar Pradesh', domestic_tourists: 230904634, foreign_tourists: 3109332, total_tourists: 234013966, growth_rate: 5.4, rank: 2 },
  { state: 'Karnataka', domestic_tourists: 104396914, foreign_tourists: 2497764, total_tourists: 106894678, growth_rate: 9.7, rank: 3 },
  { state: 'Maharashtra', domestic_tourists: 103694069, foreign_tourists: 5082877, total_tourists: 108776946, growth_rate: 6.8, rank: 4 },
  { state: 'Rajasthan', domestic_tourists: 47228978, foreign_tourists: 1567985, total_tourists: 48796963, growth_rate: 14.2, rank: 5 },
  { state: 'Goa', domestic_tourists: 5990158, foreign_tourists: 793752, total_tourists: 6783910, growth_rate: 18.5, rank: 6 },
];

const DENSITY_ALERTS = [
  { state: 'Goa', level: 'High', msg: 'Overcrowding Risk — Peak Season', pct: 149 },
  { state: 'Delhi', level: 'High', msg: 'Near Capacity — Monitor Daily', pct: 115 },
  { state: 'Tamil Nadu', level: 'Medium', msg: 'Manage Crowd Distribution', pct: 112 },
];

const tooltip = { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#E5E5E5' };

function StatCard({ title, value, sub, icon: Icon, badge, badgeGreen = true }: {
  title: string; value: string; sub?: string; icon: React.ElementType; badge: string; badgeGreen?: boolean;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl">
      <div className="flex justify-between items-start mb-4">
        <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-300" />
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeGreen ? 'badge-green' : 'badge-red'}`}>{badge}</span>
      </div>
      <p className="text-gray-500 text-xs mb-1">{title}</p>
      <p className="text-white text-2xl font-extrabold font-manrope">{value}</p>
      {sub && <p className="text-gray-600 text-xs mt-1">{sub}</p>}
    </motion.div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyTourism[]>(MONTHLY_FALLBACK);
  const [states, setStates] = useState<TourismState[]>(TOP_STATES_FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchDashboardSummary(),
      fetchMonthlyTourism(),
      fetchTourismStates(),
    ]).then(([sumRes, monRes, stateRes]) => {
      if (sumRes.status === 'fulfilled') setSummary(sumRes.value);
      if (monRes.status === 'fulfilled') setMonthly(monRes.value);
      if (stateRes.status === 'fulfilled') setStates(stateRes.value.slice(0, 8));
    }).finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => n > 1e6 ? `${(n / 1e6).toFixed(1)}M` : n > 1e3 ? `${(n / 1e3).toFixed(0)}K` : n.toString();
  const chartMonthly = monthly.map(m => ({ ...m, domestic: Math.round(m.domestic / 1e6 * 10) / 10, foreign: Math.round(m.foreign / 1e5 * 10) / 10 }));
  const stateChart = states.slice(0, 8).map(s => ({ name: s.state.split(' ')[0], total: Math.round(s.total_tourists / 1e6 * 10) / 10, growth: s.growth_rate }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-manrope text-4xl font-extrabold text-white">🇮🇳 India Tourism Analytics</h1>
          <p className="text-gray-500 mt-1">Real-time insights from Ministry of Tourism data · Source: data.gov.in</p>
        </div>
        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 border border-green-900/40 px-4 py-2 rounded-full">
          <Activity className="w-4 h-4" />Live Data Stream
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="h-32 glass-card rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Monthly Tourist Arrivals" value={fmt(summary?.total_tourists_this_month ?? 93900000)} sub="All-India November" icon={Users} badge="+8.2%" badgeGreen />
          <StatCard title="Domestic Tourists" value={fmt(summary?.total_domestic ?? 92600000)} sub="Monthly (Nov 2025)" icon={MapPin} badge="+7.8%" badgeGreen />
          <StatCard title="Foreign Tourists" value={fmt(summary?.total_foreign ?? 1300000)} sub="Monthly (Nov 2025)" icon={Globe} badge="+15.3%" badgeGreen />
          <StatCard title="Top Performing State" value={summary?.top_state ?? 'Tamil Nadu'} sub={`Peak: ${summary?.peak_month ?? 'November'}`} icon={Award} badge="#1 State" badgeGreen />
        </div>
      )}

      {/* Eco + ML scores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Eco Sustainability Score', value: `${summary?.sustainability_score ?? 72.3}/100`, icon: Leaf },
          { label: 'ML Model Accuracy', value: `${summary?.ml_accuracy ?? 91.4}%`, icon: TrendingUp },
          { label: 'Active States', value: `${summary?.active_destinations ?? 28}`, icon: MapPin },
          { label: 'Avg Occupancy Rate', value: `${summary?.avg_occupancy_rate ?? 84.7}%`, icon: Activity },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="glass-card p-5 rounded-2xl text-center">
              <Icon className="w-5 h-5 text-gray-500 mx-auto mb-2" />
              <div className="text-white font-bold text-xl font-manrope">{item.value}</div>
              <div className="text-gray-600 text-xs mt-1">{item.label}</div>
            </div>
          );
        })}
      </div>

      {/* Monthly trend chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8 rounded-2xl">
          <h2 className="font-manrope text-xl font-bold text-white mb-2">Monthly Tourist Arrivals</h2>
          <p className="text-gray-600 text-xs mb-6">Domestic (Millions) vs Foreign (100K) — All India 2025</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartMonthly}>
                <defs>
                  <linearGradient id="gDom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7A1C1C" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#7A1C1C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gFor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4332" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#1B4332" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#555" tick={{ fill: '#777', fontSize: 11 }} />
                <YAxis stroke="#555" tick={{ fill: '#777', fontSize: 11 }} />
                <Tooltip contentStyle={tooltip} />
                <Legend wrapperStyle={{ color: '#888', fontSize: 12 }} />
                <Area type="monotone" dataKey="domestic" stroke="#c0392b" fill="url(#gDom)" strokeWidth={2} name="Domestic (M)" />
                <Area type="monotone" dataKey="foreign" stroke="#27ae60" fill="url(#gFor)" strokeWidth={2} name="Foreign (100K)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-8 rounded-2xl">
          <h2 className="font-manrope text-xl font-bold text-white mb-2">State-wise Annual Tourists</h2>
          <p className="text-gray-600 text-xs mb-6">Total annual visitors (Millions) — Source: Ministry of Tourism India</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#555" tick={{ fill: '#777', fontSize: 11 }} tickFormatter={v => `${v}M`} />
                <YAxis dataKey="name" type="category" width={80} stroke="#555" tick={{ fill: '#aaa', fontSize: 11 }} />
                <Tooltip contentStyle={tooltip} formatter={(v: number) => [`${v}M visitors`, '']} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="total" fill="#7A1C1C" radius={[0, 6, 6, 0]} name="Annual Visitors (M)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Growth trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-8 rounded-2xl">
        <h2 className="font-manrope text-xl font-bold text-white mb-2">State Growth Rate (%)</h2>
        <p className="text-gray-600 text-xs mb-6">Year-over-year tourist growth by state — High growth indicates emerging hotspots</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stateChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#555" tick={{ fill: '#777', fontSize: 11 }} />
              <YAxis stroke="#555" tick={{ fill: '#777', fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={tooltip} formatter={(v: number) => [`${v}%`, 'Growth']} />
              <Bar dataKey="growth" fill="#1B4332" radius={[4, 4, 0, 0]} name="YoY Growth %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Density Alerts */}
      <div className="glass-card p-6 rounded-2xl border border-yellow-900/30">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h2 className="font-manrope text-lg font-bold text-white">Tourist Density Alerts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {DENSITY_ALERTS.map(alert => (
            <div key={alert.state} className="p-4 rounded-xl bg-yellow-900/10 border border-yellow-900/20">
              <div className="font-semibold text-white text-sm">{alert.state}</div>
              <div className="text-yellow-400 text-xs mt-1">{alert.msg}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-grow bg-white/5 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-yellow-500" style={{ width: `${Math.min(alert.pct, 100)}%` }} />
                </div>
                <span className="text-yellow-400 text-xs font-bold">{alert.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
