'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, Brain, Database, Globe, Code2, TrendingUp, Shield, Users } from 'lucide-react';

const techStack = [
  { name: 'Next.js 14', desc: 'React-based frontend framework with server components', icon: Code2, color: '#E5E5E5' },
  { name: 'FastAPI', desc: 'High-performance Python backend API', icon: Leaf, color: '#27ae60' },
  { name: 'MongoDB Atlas', desc: 'Cloud-native distributed NoSQL database', icon: Database, color: '#4ade80' },
  { name: 'Scikit-Learn + XGBoost', desc: 'Ensemble ML model pipeline for forecasting', icon: Brain, color: '#c0392b' },
  { name: 'Recharts', desc: 'Composable charting library for analytics visualization', icon: TrendingUp, color: '#93c5fd' },
  { name: 'Leaflet Maps', desc: 'Interactive destination mapping and geospatial data', icon: Globe, color: '#fbbf24' },
];

const team = [
  { role: '2300030232', responsibility: 'Gummadi Devi Priya', icon: Code2 },
  { role: '2300030531', responsibility: 'Yashitha', icon: Database },
  { role: '2300031309', responsibility: 'N. Akhila', icon: Brain },
  { role: '2300033021', responsibility: 'K. C. Varshitha', icon: Globe },
];

const models = [
  { name: 'Linear Regression', purpose: 'Baseline visitor trend modeling', accuracy: '78%' },
  { name: 'Random Forest', purpose: 'Non-linear demand pattern recognition', accuracy: '88%' },
  { name: 'Gradient Boosting', purpose: 'Seasonal anomaly detection', accuracy: '91%' },
  { name: 'XGBoost', purpose: 'Ensemble champion model', accuracy: '94%' },
  { name: 'Support Vector Machine', purpose: 'Classification for density levels', accuracy: '85%' },
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#7A1C1C] via-[#c0392b] to-[#1B4332] rounded-3xl flex items-center justify-center shadow-2xl shadow-red-900/40">
            <Leaf className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="font-manrope text-5xl font-extrabold text-white tracking-tight mb-4">
          About EcoTour Analytics
        </h1>
        <p className="text-gray-400 text-xl leading-relaxed">
          A production-grade predictive analytics platform empowering tourism authorities to make data-driven decisions, 
          protect fragile destinations, and maximize sustainable growth.
        </p>
      </div>

      {/* Mission */}
      <div className="glass-card p-10 rounded-2xl text-center border border-[#1B4332]/30">
        <h2 className="font-manrope text-3xl font-bold text-white mb-4">Our Mission</h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
          Tourism is the world's largest industry — and one of its most fragile. Over-tourism destroys the very places 
          people love to visit. EcoTour Analytics harnesses artificial intelligence to forecast demand, 
          optimize pricing, and help destination managers protect their ecosystems while growing revenue sustainably.
        </p>
      </div>

      {/* ML Models */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#7A1C1C]/30 flex items-center justify-center">
            <Brain className="w-5 h-5 text-red-400" />
          </div>
          <h2 className="font-manrope text-3xl font-bold text-white">AI Models</h2>
        </div>
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full table-dark">
            <thead>
              <tr>
                <th>Model</th>
                <th>Purpose</th>
                <th>Accuracy Score</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m, i) => (
                <motion.tr
                  key={m.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <td className="font-semibold text-gray-200">{m.name}</td>
                  <td className="text-gray-500">{m.purpose}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex-grow bg-white/5 rounded-full h-2 max-w-[120px]">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#7A1C1C] to-[#27ae60]"
                          style={{ width: m.accuracy }}
                        />
                      </div>
                      <span className="text-white font-bold text-sm">{m.accuracy}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#1B263B]/60 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-[#93c5fd]" />
          </div>
          <h2 className="font-manrope text-3xl font-bold text-white">Technology Stack</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {techStack.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 rounded-2xl flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" style={{ color: tech.color }} />
                </div>
                <div>
                  <div className="text-white font-semibold">{tech.name}</div>
                  <div className="text-gray-500 text-sm mt-0.5">{tech.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Engineering Team */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#1B4332]/50 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <h2 className="font-manrope text-3xl font-bold text-white">Engineering Team</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={member.role}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-2xl text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#7A1C1C]/20 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-[#c0392b]" />
                </div>
                <h3 className="font-manrope font-bold text-white mb-2">{member.role}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{member.responsibility}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center glass-card p-12 rounded-2xl border border-[#7A1C1C]/20">
        <h3 className="font-manrope text-3xl font-bold text-white mb-4">Start Using the Platform</h3>
        <p className="text-gray-500 mb-8">Explore the dashboard, run ML predictions, or view sustainability metrics.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/dashboard" className="px-8 py-3 bg-[#7A1C1C] hover:bg-[#8b2020] text-white rounded-xl font-semibold transition-colors shadow-lg">
            Analytics Dashboard
          </Link>
          <Link href="/predictions" className="px-8 py-3 glass-card hover:bg-white/10 text-white rounded-xl font-semibold transition-all">
            Run ML Forecast
          </Link>
          <Link href="/sustainability" className="px-8 py-3 bg-[#1B4332] hover:bg-[#245c42] text-white rounded-xl font-semibold transition-colors">
            Sustainability Monitor
          </Link>
        </div>
      </div>
    </div>
  );
}
