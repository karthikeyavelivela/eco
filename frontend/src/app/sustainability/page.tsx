'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Leaf, Wind, Trash2, MapPin, AlertCircle, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { fetchSustainabilityMetrics, fetchDensityAlerts, type SustainabilityMetric, type DensityAlert } from '@/lib/api';

const COLORS = ['#27ae60', '#f39c12', '#c0392b', '#1B4332', '#93c5fd', '#555'];
const tooltipStyle = { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#E5E5E5' };

export default function Sustainability() {
  const [metrics, setMetrics] = useState<SustainabilityMetric[]>([]);
  const [alerts, setAlerts] = useState<DensityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchSustainabilityMetrics(),
      fetchDensityAlerts(),
    ]).then(([metricsRes, alertsRes]) => {
      if (metricsRes.status === 'fulfilled') setMetrics(metricsRes.value);
      if (alertsRes.status === 'fulfilled') setAlerts(alertsRes.value.alerts);
    }).finally(() => setLoading(false));
  }, []);

  const totalCarbon = metrics.reduce((acc, m) => acc + m.carbon_estimate, 0);
  const totalWaste = metrics.reduce((acc, m) => acc + m.waste_generation, 0);
  const avgDensity = metrics.length ? metrics.reduce((acc, m) => acc + (m.density_value || 0), 0) / metrics.length : 0;

  const densityCount = metrics.reduce((acc, m) => {
    acc[m.tourist_density] = (acc[m.tourist_density] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const pieData = Object.entries(densityCount).map(([name, value]) => ({ name, value }));
  const barData = metrics.slice(0, 8).map(m => ({
    name: m.state.split(' ')[0], 
    carbon: Math.round(m.carbon_estimate),
    waste: Math.round(m.waste_generation)
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-manrope text-4xl font-extrabold text-white">🌿 Sustainability & Impact</h1>
          <p className="text-gray-500 mt-1">Monitor environmental impact across top Indian states</p>
        </div>
        <div className="flex items-center gap-2 text-green-400 bg-green-900/20 px-4 py-2 rounded-full text-sm font-semibold border border-green-900/40">
          <Leaf className="w-4 h-4" /> Eco Score: 72/100
        </div>
      </div>

      {loading ? (
        <div className="h-32 glass-card rounded-2xl animate-pulse" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border-t-2 border-[#27ae60]">
              <div className="flex items-center gap-3 mb-2 justify-between">
                <div className="flex items-center gap-2"><Wind className="w-5 h-5 text-[#27ae60]" /><span className="text-gray-400 text-sm font-semibold">Total Carbon (Peak Mo)</span></div>
                <span className="badge-red text-xs py-1 px-2.5 rounded-full flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> +12%</span>
              </div>
              <div className="text-3xl font-extrabold text-white font-manrope">{totalCarbon.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm font-normal text-gray-500">tCO₂</span></div>
              <p className="text-xs text-gray-600 mt-2">Estimated carbon footprint across states</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border-t-2 border-[#f39c12]">
              <div className="flex items-center gap-3 mb-2 justify-between">
                <div className="flex items-center gap-2"><Trash2 className="w-5 h-5 text-[#f39c12]" /><span className="text-gray-400 text-sm font-semibold">Solid Waste (Peak Mo)</span></div>
                <span className="badge-red text-xs py-1 px-2.5 rounded-full flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> +8%</span>
              </div>
              <div className="text-3xl font-extrabold text-white font-manrope">{totalWaste.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm font-normal text-gray-500">tonnes</span></div>
              <p className="text-xs text-gray-600 mt-2">Estimated municipal solid waste</p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border-t-2 border-[#3498db]">
              <div className="flex items-center gap-3 mb-2 justify-between">
                <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-[#3498db]" /><span className="text-gray-400 text-sm font-semibold">Avg State Density</span></div>
                <span className="badge-green text-xs py-1 px-2.5 rounded-full flex items-center gap-1"><ArrowDownRight className="w-3 h-3"/> -2%</span>
              </div>
              <div className="text-3xl font-extrabold text-white font-manrope">{avgDensity.toFixed(1)} <span className="text-sm font-normal text-gray-500">tourists/km²</span></div>
              <p className="text-xs text-gray-600 mt-2">Average density across tracked states</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-2xl">
              <h2 className="font-manrope text-xl font-bold text-white mb-6">Carbon & Waste by State</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#555" tick={{fill: '#777', fontSize: 11}} />
                    <YAxis stroke="#555" tick={{fill: '#777', fontSize: 11}} tickFormatter={v => `${v/1000}k`} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ color: '#888', fontSize: 12 }} />
                    <Bar dataKey="carbon" fill="#27ae60" name="Carbon (tCO₂)" radius={[4,4,0,0]} />
                    <Bar dataKey="waste" fill="#f39c12" name="Waste (t)" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <h2 className="font-manrope text-xl font-bold text-white mb-6">Tourist Density Distribution</h2>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} states`, 'Count']} />
                    <Legend wrapperStyle={{ color: '#888', fontSize: 12 }} verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Environmental Compliance Ledger */}
          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="p-6 border-b border-white/5">
              <h2 className="font-manrope text-xl font-bold text-white">Impact Ledger</h2>
              <p className="text-gray-500 text-sm mt-1">Detailed state-level metrics</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/3 border-b border-white/5 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">State</th>
                    <th className="px-6 py-4 font-semibold">Total Tourists</th>
                    <th className="px-6 py-4 font-semibold">Density (km²)</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {metrics.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{row.state}</td>
                      <td className="px-6 py-4 text-gray-400 font-manrope">{row.total_tourists.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-400 font-manrope">{row.density_value?.toFixed(1) || '?'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                          ${row.tourist_density === 'High' ? 'bg-red-900/30 text-red-400 border border-red-500/20' : 
                            row.tourist_density === 'Medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/20' : 
                            'bg-green-900/30 text-green-400 border border-green-500/20'}`}>
                          {row.tourist_density}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
