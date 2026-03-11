'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Users, Star, Filter, AlertTriangle, Navigation } from 'lucide-react';
import Map from '@/components/Map';

const INDIA_DESTINATIONS = [
  { id: 1,  name: 'Goa',                  lat: 15.30, lng: 74.12, tourists: 895000,   trend: '+18.5%', rating: 4.8, density: 'High',   type: 'Beach',     state: 'Goa',               alert: 'Overcrowding Risk' },
  { id: 2,  name: 'Kerala (Backwaters)',   lat: 9.94,  lng: 76.27, tourists: 1740000,  trend: '+11.3%', rating: 4.9, density: 'Medium', type: 'Nature',    state: 'Kerala',            alert: null },
  { id: 3,  name: 'Rajasthan (Jaipur)',    lat: 26.92, lng: 75.78, tourists: 5673400,  trend: '+14.2%', rating: 4.7, density: 'Medium', type: 'Heritage',  state: 'Rajasthan',         alert: null },
  { id: 4,  name: 'Shimla',               lat: 31.10, lng: 77.17, tourists: 2004000,  trend: '+16.7%', rating: 4.6, density: 'Medium', type: 'Hill',      state: 'Himachal Pradesh',  alert: null },
  { id: 5,  name: 'Rishikesh',            lat: 30.09, lng: 78.27, tourists: 3879700,  trend: '+10.9%', rating: 4.7, density: 'Medium', type: 'Spiritual', state: 'Uttarakhand',       alert: null },
  { id: 6,  name: 'Varanasi',             lat: 25.32, lng: 83.01, tourists: 6500000,  trend: '+9.2%',  rating: 4.5, density: 'High',   type: 'Spiritual', state: 'Uttar Pradesh',     alert: null },
  { id: 7,  name: 'Munnar',               lat: 10.09, lng: 77.06, tourists: 850000,   trend: '+13.5%', rating: 4.8, density: 'Low',    type: 'Hill',      state: 'Kerala',            alert: null },
  { id: 8,  name: 'Rann of Kutch',        lat: 23.73, lng: 70.20, tourists: 720000,   trend: '+22.1%', rating: 4.6, density: 'Low',    type: 'Desert',    state: 'Gujarat',           alert: null },
  { id: 9,  name: 'Coorg',                lat: 12.42, lng: 75.74, tourists: 680000,   trend: '+17.8%', rating: 4.7, density: 'Low',    type: 'Nature',    state: 'Karnataka',         alert: null },
  { id: 10, name: 'Taj Mahal (Agra)',     lat: 27.17, lng: 78.04, tourists: 7000000,  trend: '+6.4%',  rating: 5.0, density: 'High',   type: 'Heritage',  state: 'Uttar Pradesh',     alert: null },
  { id: 11, name: 'Hampi',                lat: 15.34, lng: 76.46, tourists: 320000,   trend: '+27.3%', rating: 4.9, density: 'Low',    type: 'Heritage',  state: 'Karnataka',         alert: null },
  { id: 12, name: 'Andaman Islands',      lat: 11.74, lng: 92.66, tourists: 495000,   trend: '+19.0%', rating: 4.8, density: 'Low',    type: 'Beach',     state: 'Andaman & Nicobar', alert: null },
  { id: 13, name: 'Darjeeling',           lat: 27.03, lng: 88.26, tourists: 890000,   trend: '+8.5%',  rating: 4.6, density: 'Medium', type: 'Hill',      state: 'West Bengal',       alert: null },
  { id: 14, name: 'New Delhi',            lat: 28.61, lng: 77.20, tourists: 2067000,  trend: '+7.5%',  rating: 4.4, density: 'High',   type: 'City',      state: 'Delhi',             alert: 'Near Capacity' },
  { id: 15, name: 'Udaipur',              lat: 24.59, lng: 73.71, tourists: 1200000,  trend: '+21.0%', rating: 4.9, density: 'Medium', type: 'Heritage',  state: 'Rajasthan',         alert: null },
];

const densityBadge: Record<string, string> = {
  High:   'bg-red-900/40 text-red-400 border border-red-900/50',
  Medium: 'bg-yellow-900/40 text-yellow-400 border border-yellow-900/50',
  Low:    'bg-green-900/40 text-green-400 border border-green-900/50',
};

const filters = ['All', 'Beach', 'Heritage', 'Hill', 'Nature', 'Spiritual', 'City', 'Desert'];

type Destination = typeof INDIA_DESTINATIONS[0];

export default function Destinations() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState<Destination | null>(null);

  const filtered = activeFilter === 'All' ? INDIA_DESTINATIONS : INDIA_DESTINATIONS.filter(d => d.type === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="font-manrope text-4xl font-extrabold text-white tracking-tight">🇮🇳 India Tourism Hotspots</h1>
        <p className="text-gray-500 mt-1">Monitor tourist density, trends, and analytics for India's top 28 destinations.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-gray-500" />
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeFilter === f ? 'bg-[#7A1C1C] text-white shadow-md' : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Map — centered on India */}
      <div className="glass-card rounded-2xl overflow-hidden h-[480px]">
        <Map destinations={filtered} selected={selected} onSelect={setSelected} centerLat={22} centerLng={80} zoom={5} />
      </div>

      {/* Selected detail */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-2xl border border-[#7A1C1C]/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-manrope text-2xl font-bold text-white">{selected.name}</h2>
              <p className="text-gray-500">{selected.state} · {selected.type} Destination</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-600 hover:text-gray-400 text-sm px-3 py-1 rounded-lg bg-white/5">✕ Dismiss</button>
          </div>
          {selected.alert && (
            <div className="flex items-center gap-2 mb-4 text-yellow-400 text-sm bg-yellow-900/10 border border-yellow-900/20 px-4 py-2 rounded-xl">
              <AlertTriangle className="w-4 h-4" /> {selected.alert}
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Monthly Visitors', value: selected.tourists.toLocaleString() },
              { label: 'Growth Trend', value: selected.trend },
              { label: 'Tourist Density', value: selected.density },
              { label: 'Rating', value: `★ ${selected.rating}` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-4 rounded-xl bg-white/3 border border-white/5">
                <div className="text-white font-bold text-xl font-manrope">{value}</div>
                <div className="text-gray-600 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Destination Cards Grid */}
      <div>
        <h2 className="font-manrope text-2xl font-bold text-white mb-6">
          {activeFilter === 'All' ? 'All destinations' : `${activeFilter} destinations`}
          <span className="text-gray-600 text-lg font-normal ml-3">({filtered.length})</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filtered.map((dest, i) => (
            <motion.div key={dest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }} whileHover={{ y: -5 }} onClick={() => setSelected(dest)}
              className={`glass-card p-5 rounded-2xl cursor-pointer transition-all ${selected?.id === dest.id ? 'border border-[#7A1C1C]/60 shadow-lg shadow-red-900/20' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#1B263B]/60 flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-[#93c5fd]" />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${densityBadge[dest.density]}`}>{dest.density}</span>
              </div>
              <h3 className="font-manrope font-bold text-white text-sm mb-0.5 leading-tight">{dest.name}</h3>
              <p className="text-gray-600 text-xs mb-3">{dest.state} · {dest.type}</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs"><span className="text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" />Monthly</span><span className="text-white font-semibold">{dest.tourists >= 1e6 ? `${(dest.tourists/1e6).toFixed(1)}M` : `${(dest.tourists/1000).toFixed(0)}K`}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" />Trend</span><span className="text-green-400 font-bold">{dest.trend}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500 flex items-center gap-1"><Star className="w-3 h-3" />Rating</span><span className="text-yellow-400 font-bold">★ {dest.rating}</span></div>
              </div>
              {dest.alert && <div className="mt-2 text-xs text-yellow-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{dest.alert}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
