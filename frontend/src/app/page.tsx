'use client';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Globe, Leaf, TrendingUp, Shield, BarChart3, Users, Building2, Zap, MapPin, ChevronDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const step = (end - start) / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
const forecastData = [
  { month: 'Jan', visitors: 42000, forecast: 45000 },
  { month: 'Feb', visitors: 38000, forecast: 40000 },
  { month: 'Mar', visitors: 55000, forecast: 58000 },
  { month: 'Apr', visitors: 62000, forecast: 65000 },
  { month: 'May', visitors: 79000, forecast: 82000 },
  { month: 'Jun', visitors: 88000, forecast: 90000 },
  { month: 'Jul', visitors: 95000, forecast: 98000 },
  { month: 'Aug', visitors: 102000, forecast: 105000 },
];

const seasonData = [
  { season: 'Winter', avg: 38000 },
  { season: 'Spring', avg: 62000 },
  { season: 'Summer', avg: 95000 },
  { season: 'Autumn', avg: 54000 },
];

const destinations = [
  { name: 'Bali, Indonesia', trend: '+22%', density: 'High', status: 'Peak Season' },
  { name: 'Paris, France', trend: '+14%', density: 'Medium', status: 'Growing' },
  { name: 'Santorini, Greece', trend: '+31%', density: 'High', status: 'Surge Alert' },
  { name: 'Machu Picchu, Peru', trend: '+8%', density: 'Low', status: 'Optimal' },
  { name: 'Tokyo, Japan', trend: '+19%', density: 'Medium', status: 'Growing' },
  { name: 'Maldives', trend: '+27%', density: 'High', status: 'Peak Season' },
];

const features = [
  {
    icon: TrendingUp,
    title: 'Visitor Forecasting',
    description: 'ML ensemble models predict tourist influx 90 days ahead with 94% accuracy.',
    color: '#7A1C1C',
    bg: 'rgba(122, 28, 28, 0.15)',
  },
  {
    icon: Building2,
    title: 'Dynamic Pricing',
    description: 'Demand-reactive hotel pricing recommendations that maximize yield while staying competitive.',
    color: '#1B4332',
    bg: 'rgba(27, 67, 50, 0.15)',
  },
  {
    icon: Leaf,
    title: 'Sustainability Analytics',
    description: 'Real-time carbon footprint, waste generation, and eco-capacity monitoring.',
    color: '#27ae60',
    bg: 'rgba(39, 174, 96, 0.12)',
  },
  {
    icon: BarChart3,
    title: 'Resource Planning',
    description: 'Optimal staffing, infrastructure, and logistics forecasting for destination managers.',
    color: '#1B263B',
    bg: 'rgba(27, 38, 59, 0.3)',
  },
  {
    icon: Shield,
    title: 'Crowd Management',
    description: 'Detect density hotspots and deploy alerts before over-tourism thresholds are breached.',
    color: '#7A1C1C',
    bg: 'rgba(122, 28, 28, 0.15)',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Monitor 500+ tourist destinations worldwide with unified analytics.',
    color: '#4a90d9',
    bg: 'rgba(74, 144, 217, 0.12)',
  },
];

const insights = [
  { label: 'Predicted Tourist Growth', value: 245000, suffix: '+', prefix: '', sub: 'Visitors forecasted this month' },
  { label: 'Peak Season', value: 94, suffix: '%', prefix: '', sub: 'Model accuracy score' },
  { label: 'Destinations Monitored', value: 128, suffix: '', prefix: '', sub: 'Active destinations tracked' },
  { label: 'CO₂ Reduction Target', value: 32, suffix: '%', prefix: '', sub: 'Sustainability goal 2025' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-4 py-20">
        {/* Animated blobs */}
        <div className="blob w-[600px] h-[600px] bg-[#7A1C1C] top-[-100px] left-[-200px]" style={{ animationDelay: '0s' }} />
        <div className="blob w-[500px] h-[500px] bg-[#1B4332] bottom-[-100px] right-[-150px]" style={{ animationDelay: '3s' }} />
        <div className="blob w-[400px] h-[400px] bg-[#1B263B] top-[50%] left-[50%]" style={{ opacity: 0.1, animationDelay: '5s' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI Models Active · Real-Time Data
          </motion.div>

          <h1 className="font-manrope text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-none">
            <span className="text-white">Predictive Analytics</span>
            <br />
            <span className="text-gradient">for Sustainable Tourism</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Empower tourism authorities with AI-driven forecasts, dynamic pricing,
            and sustainability intelligence — protecting destinations for generations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center px-8 py-4 bg-[#7A1C1C] hover:bg-[#8b2020] text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-red-900/30 hover:shadow-red-900/50"
            >
              Explore Tourism Analytics
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/predictions"
              className="inline-flex items-center justify-center px-8 py-4 glass-card text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Run ML Forecast
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 flex flex-col items-center gap-1"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </section>

      {/* ── INSIGHTS / COUNTERS ──────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Section>
            <div className="text-center mb-14">
              <h2 className="font-manrope text-4xl font-bold text-white mb-4">Tourism Insights at a Glance</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Live metrics from our global tourism analytics pipeline.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {insights.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 rounded-2xl text-center"
                >
                  <div className="text-4xl font-extrabold text-white mb-2 font-manrope">
                    <AnimatedCounter value={item.value} suffix={item.suffix} prefix={item.prefix} />
                  </div>
                  <div className="text-[#c0392b] font-semibold text-sm mb-1">{item.label}</div>
                  <div className="text-gray-600 text-xs">{item.sub}</div>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── PLATFORM FEATURES ────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Section>
            <div className="text-center mb-16">
              <span className="text-[#c0392b] font-semibold text-sm uppercase tracking-widest">Platform Capabilities</span>
              <h2 className="font-manrope text-4xl md:text-5xl font-bold text-white mt-3 mb-5">
                Everything You Need to Manage Tourism
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                From AI forecasting to sustainability monitoring — one unified platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="glass-card p-8 rounded-2xl cursor-default group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: feature.bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: feature.color === '#1B263B' ? '#93c5fd' : feature.color === '#1B4332' ? '#4ade80' : feature.color }} />
                    </div>
                    <h3 className="font-manrope text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </Section>
        </div>
      </section>

      {/* ── DESTINATION SHOWCASE ─────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Section>
            <div className="text-center mb-16">
              <span className="text-[#27ae60] font-semibold text-sm uppercase tracking-widest">Live Monitoring</span>
              <h2 className="font-manrope text-4xl md:text-5xl font-bold text-white mt-3 mb-5">
                Top Destinations Worldwide
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Real-time tourist density, trend data, and season alerts from our monitored destinations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {destinations.map((dest, i) => (
                <motion.div
                  key={dest.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B263B]/60 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#93c5fd]" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{dest.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">Density: {dest.density}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-sm">{dest.trend}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                      dest.status === 'Surge Alert' ? 'bg-red-900/40 text-red-400' :
                      dest.status === 'Peak Season' ? 'bg-yellow-900/40 text-yellow-400' :
                      dest.status === 'Growing' ? 'bg-blue-900/40 text-blue-400' :
                      'bg-green-900/40 text-green-400'
                    }`}>{dest.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/destinations" className="inline-flex items-center gap-2 text-[#c0392b] hover:text-[#e74c3c] font-semibold transition-colors">
                View All Destinations <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Section>
        </div>
      </section>

      {/* ── DATA VISUALIZATION PREVIEW ───────────────────────────────── */}
      <section className="bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Section>
            <div className="text-center mb-16">
              <span className="text-[#93c5fd] font-semibold text-sm uppercase tracking-widest">Analytics Preview</span>
              <h2 className="font-manrope text-4xl md:text-5xl font-bold text-white mt-3 mb-5">
                Intelligent Data Visualization
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Interactive charts powered by real ML predictions and tourism data pipelines.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Forecast Chart */}
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-white font-bold text-lg mb-6 font-manrope">Tourist Forecast — 2024</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData}>
                      <defs>
                        <linearGradient id="gradVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7A1C1C" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#7A1C1C" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1B4332" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#1B4332" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="#555" tick={{ fill: '#777', fontSize: 12 }} />
                      <YAxis stroke="#555" tick={{ fill: '#777', fontSize: 12 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#E5E5E5' }}
                        formatter={(val: number) => [val.toLocaleString(), '']}
                      />
                      <Area type="monotone" dataKey="visitors" stroke="#c0392b" fill="url(#gradVisitors)" strokeWidth={2} name="Actual" />
                      <Area type="monotone" dataKey="forecast" stroke="#27ae60" fill="url(#gradForecast)" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Seasonal Bar Chart */}
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-white font-bold text-lg mb-6 font-manrope">Seasonal Tourist Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={seasonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="season" stroke="#555" tick={{ fill: '#777', fontSize: 12 }} />
                      <YAxis stroke="#555" tick={{ fill: '#777', fontSize: 12 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#E5E5E5' }}
                        formatter={(val: number) => [val.toLocaleString(), 'Visitors']}
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      />
                      <Bar dataKey="avg" radius={[8, 8, 0, 0]} name="Avg Visitors"
                        fill="url(#barGrad)"
                      />
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1B4332" />
                          <stop offset="100%" stopColor="#27ae60" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* ── CALL TO ACTION ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7A1C1C]/30 via-[#0D0D0D] to-[#1B4332]/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center relative z-10">
          <Section>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="font-manrope text-4xl md:text-6xl font-extrabold text-white mb-6">
                Ready to Revolutionize <br className="hidden md:block" />
                <span className="text-gradient">Tourism Intelligence?</span>
              </h2>
              <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
                Join tourism authorities worldwide using EcoTour Analytics to protect destinations, grow sustainably, and forecast with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard" className="group inline-flex items-center justify-center px-10 py-4 bg-[#7A1C1C] hover:bg-[#8b2020] text-white rounded-xl font-bold text-lg transition-all shadow-2xl shadow-red-900/40">
                  Start Exploring Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/about" className="inline-flex items-center justify-center px-10 py-4 glass-card text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                  Learn More
                </Link>
              </div>
            </motion.div>
          </Section>
        </div>
        <div className="blob w-[600px] h-[600px] bg-[#7A1C1C] bottom-[-300px] left-[-200px] opacity-10" />
        <div className="blob w-[500px] h-[500px] bg-[#1B4332] top-[-200px] right-[-100px] opacity-10" />
      </section>
    </div>
  );
}
