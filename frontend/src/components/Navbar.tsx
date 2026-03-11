'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, LayoutDashboard, TrendingUp, Leaf, DollarSign, Info, Menu, X } from 'lucide-react';

const links = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Destinations', href: '/destinations', icon: Map },
  { name: 'Analytics', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Predictions', href: '/predictions', icon: TrendingUp },
  { name: 'Sustainability', href: '/sustainability', icon: Leaf },
  { name: 'Pricing', href: '/pricing', icon: DollarSign },
  { name: 'About', href: '/about', icon: Info },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`glass-nav sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-2xl' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[#7A1C1C] via-[#c0392b] to-[#1B4332] rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-manrope font-bold text-xl tracking-tight text-white">
                EcoTour <span className="text-[#c0392b]">Analytics</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="group flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    {link.name}
                  </Link>
                );
              })}
              <Link href="/dashboard" className="ml-4 px-4 py-2 bg-[#7A1C1C] hover:bg-[#8b2020] text-white text-sm font-semibold rounded-lg transition-colors shadow-md shadow-red-900/30">
                Open Dashboard
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed top-16 left-0 right-0 z-40 glass-nav border-t border-white/5"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
