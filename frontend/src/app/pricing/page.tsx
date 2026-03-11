'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IndianRupee, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, MapPin, Percent } from 'lucide-react';
import { fetchPricingSuggestions, type PricingItem } from '@/lib/api';

const tooltipStyle = { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#E5E5E5' };

export default function Pricing() {
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricingSuggestions()
      .then(setPricing)
      .finally(() => setLoading(false));
  }, []);

  const chartData = pricing.map(p => ({
    name: p.hotel_name?.substring(0, 15) + (p.hotel_name && p.hotel_name.length > 15 ? '...' : ''),
    current: p.current_price,
    recommended: p.recommended_price,
  }));

  const fmt = (val?: number) => val !== undefined ? `₹${val.toLocaleString()}` : '-';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="font-manrope text-4xl font-extrabold text-white tracking-tight">Dynamic Pricing Engine</h1>
        <p className="text-gray-500 mt-1">AI-driven hotel rate adjustments based on real-time Indian tourist demand.</p>
      </div>

      {loading ? (
        <div className="h-40 glass-card rounded-2xl animate-pulse" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl">
              <div className="w-10 h-10 bg-[#1B4332]/50 text-[#27ae60] rounded-xl flex items-center justify-center mb-4"><TrendingUp className="w-5 h-5" /></div>
              <p className="text-gray-400 text-sm mb-1">Average Surcharge Opportunity</p>
              <h2 className="text-3xl font-extrabold text-white font-manrope">+18.5%</h2>
              <p className="text-gray-500 text-xs mt-2">Peak season demand</p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="w-10 h-10 bg-[#7A1C1C]/50 text-[#e74c3c] rounded-xl flex items-center justify-center mb-4"><Percent className="w-5 h-5" /></div>
              <p className="text-gray-400 text-sm mb-1">High Demand Properties</p>
              <h2 className="text-3xl font-extrabold text-white font-manrope">{pricing.filter(p => p.demand_factor > 1.2).length} <span className="text-lg text-gray-500">of {pricing.length}</span></h2>
              <p className="text-gray-500 text-xs mt-2">Currently tracked</p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="w-10 h-10 bg-blue-900/30 text-blue-400 rounded-xl flex items-center justify-center mb-4"><MapPin className="w-5 h-5" /></div>
              <p className="text-gray-400 text-sm mb-1">Top Market</p>
              <h2 className="text-3xl font-extrabold text-white font-manrope">Rajasthan</h2>
              <p className="text-gray-500 text-xs mt-2">Highest rate multiplier</p>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <h2 className="font-manrope text-xl font-bold text-white mb-6">Rate Comparison (Current vs AI Recommended)</h2>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#555" tick={{fill: '#777', fontSize: 10}} angle={-45} textAnchor="end" />
                  <YAxis stroke="#555" tick={{fill: '#777', fontSize: 11}} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Price']} />
                  <Legend wrapperStyle={{ color: '#888', fontSize: 12, paddingTop: '10px' }} />
                  <Bar dataKey="current" fill="#4b5563" name="Current Rate" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="recommended" fill="#7A1C1C" name="AI Recommended" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5">
              <h2 className="font-manrope font-bold text-white text-lg">Hotel Pricing Recommendations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Property</th>
                    <th className="px-6 py-4 font-semibold">State</th>
                    <th className="px-6 py-4 font-semibold">Demand Level</th>
                    <th className="px-6 py-4 font-semibold">Current Rate</th>
                    <th className="px-6 py-4 font-semibold">Rec. Rate</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pricing.map((p, i) => {
                    const priceUp = p.recommended_price > (p.current_price || 0);
                    const diff = p.current_price ? ((p.recommended_price - p.current_price) / p.current_price * 100).toFixed(1) : 0;
                    
                    return (
                      <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="text-white font-bold font-manrope">{p.hotel_name || p.hotel_id}</div>
                          <div className="text-gray-500 text-xs mt-1">{p.location}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-md">{p.state}</span>
                        </td>
                        <td className="px-6 py-4">
                          {p.demand_level === 'Very High' ? <span className="bg-red-900/30 text-red-400 text-xs px-2.5 py-1 rounded-full border border-red-900/50">Very High</span> :
                           p.demand_level === 'High' ? <span className="bg-orange-900/30 text-orange-400 text-xs px-2.5 py-1 rounded-full border border-orange-900/50">High</span> :
                           <span className="bg-green-900/30 text-green-400 text-xs px-2.5 py-1 rounded-full border border-green-900/50">{p.demand_level}</span>}
                        </td>
                        <td className="px-6 py-4 text-gray-400">{fmt(p.current_price)}</td>
                        <td className="px-6 py-4 text-white font-manrope font-bold">{fmt(p.recommended_price)}</td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-1.5 text-xs font-bold ${priceUp ? 'text-green-400' : 'text-red-400'}`}>
                            {priceUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {priceUp ? `+${diff}%` : `${diff}%`}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
