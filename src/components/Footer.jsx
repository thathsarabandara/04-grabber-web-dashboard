import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaInternetExplorer } from 'react-icons/fa6';
import { Terminal, ChevronRight, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CgWebsite } from 'react-icons/cg';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50/50 border-t border-slate-100 transition-all duration-500 pt-24 pb-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-[0.1] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* About */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-4 group">
              <img src="/logo.png" alt="Grabber Logo" className="w-12 h-12 object-contain" />
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter leading-none text-slate-900">GRABBER</span>
                <span className="text-[9px] font-black text-brand-accent tracking-[0.3em] uppercase">Operator Terminal</span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
              The definitive ecosystem for industrial kinematic manipulation. Engineered for reliability, performance, and precision at scale.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaGithub, href: 'https://github.com/thathsarabandara/01-grabber-architecture', label: 'GitHub' },
                { icon: CgWebsite, href: 'https://thathsarabandara.vercel.app/', label: 'Portfolio' },
                { icon: FaLinkedin, href: 'www.linkedin.com/in/thathsara-bandara-b403582a7', label: 'LinkedIn' },
                { icon: FaEnvelope, href:' [thathsaraarumapperuma@gmail.com]', label: 'Email' }
              ].map((social) => (
                <a 
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-white hover:bg-brand-accent hover:border-brand-accent rounded-xl transition-all duration-300 shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-10 flex items-center gap-3">
               <div className="w-6 h-[1px] bg-brand-accent"></div>
               Core Modules
            </h4>
            <ul className="space-y-5">
              {[
                { label: 'Control Panel', href: '/dashboard/control' },
                { label: 'Live Telemetry', href: '/dashboard/telemetry' },
                { label: 'Path Planning', href: '/dashboard/path-draw' },
                { label: 'Task Engine', href: '/dashboard/tasks' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm font-black text-slate-500 hover:text-brand-accent flex items-center gap-3 group transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-brand-accent group-hover:scale-125 transition-all"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-10 flex items-center gap-3">
               <div className="w-6 h-[1px] bg-brand-secondary"></div>
               Resources
            </h4>
            <ul className="space-y-5">
              {[
                { label: 'Hardware Specs', href: '/features' },
                { label: 'API Protocols', href: '/blog' },
                { label: 'Open Source', href: '/repositories' },
                { label: 'Gallery Archive', href: '/gallery' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm font-black text-slate-500 hover:text-brand-secondary flex items-center gap-3 group transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-brand-secondary group-hover:scale-125 transition-all"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-10 flex items-center gap-3">
               <div className="w-6 h-[1px] bg-emerald-500"></div>
               System Status
            </h4>
            <div className="p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Main Core</span>
                <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Operational
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed relative z-10">
                Subscribe to receive critical security updates and firmware patch notes.
              </p>
              <div className="relative z-10">
                <input 
                  type="email" 
                  placeholder="operator@email.io" 
                  className="w-full pl-5 pr-14 py-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all"
                />
                <button className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-brand-accent transition-all shadow-lg">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
            &copy; {currentYear} GRABBER SYSTEMS. CODENAME: AETHER-PROJECT. v2.4.1
          </p>
          <div className="flex gap-10">
            <a href="#" className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-brand-accent transition-colors">Privacy Protocol</a>
            <a href="#" className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-brand-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
