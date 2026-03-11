import Link from 'next/link';
import { Leaf, Twitter, Linkedin, Github, Globe } from 'lucide-react';

const footerLinks = {
  Platform: [
    { name: 'Analytics Dashboard', href: '/dashboard' },
    { name: 'Predictions', href: '/predictions' },
    { name: 'Pricing Insights', href: '/pricing' },
    { name: 'Destinations', href: '/destinations' },
  ],
  Resources: [
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'Data Sources', href: '#' },
    { name: 'Research Papers', href: '#' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Contact', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-white/5 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-[#7A1C1C] via-[#c0392b] to-[#1B4332] rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-manrope font-bold text-xl text-white">
                EcoTour <span className="text-[#c0392b]">Analytics</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              AI-powered predictive analytics platform for sustainable tourism management. Protect destinations, optimize resources, and forecast demand with precision.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github, href: '#' },
                { icon: Globe, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4 font-manrope">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} EcoTour Analytics. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-600">
            <span>Built with Next.js 14 + FastAPI</span>
            <span>•</span>
            <span>Powered by ML Ensemble Models</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
