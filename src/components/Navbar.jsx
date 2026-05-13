import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Cpu, 
  LogIn,
  ChevronRight,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Blog', href: '/blog' },
    { label: 'Repositories', href: '/repositories' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      scrolled 
        ? 'py-4 bg-white/70 backdrop-blur-2xl border-b border-slate-100 shadow-xl shadow-slate-900/5' 
        : 'py-8 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-[14px] flex items-center justify-center shadow-2xl shadow-slate-900/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Cpu size={26} className="group-hover:text-brand-accent transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter leading-none text-slate-900">GRABBER</span>
            <span className="text-[9px] font-black text-brand-accent tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">Operator Terminal</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1.5 p-1.5 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-6 py-2.5 rounded-[12px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                isActive(link.href)
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Link
            to="/auth/login"
            className="hidden sm:flex items-center gap-3 px-8 py-3.5 bg-white border-2 border-slate-900 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-sm hover:bg-slate-900 hover:text-white transition-all duration-300 active:scale-95"
          >
            <Terminal size={16} />
            Terminal Login
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3.5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all active:scale-90"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 mt-4 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-8 space-y-3 animate-in fade-in slide-in-from-top-6 duration-500">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                isActive(link.href)
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {link.label}
              <ChevronRight size={18} />
            </Link>
          ))}
          <div className="pt-6 border-t border-slate-50 mt-4">
            <Link
              to="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-3 w-full px-8 py-6 bg-brand-accent text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl shadow-brand-accent/30 transition-all active:scale-95"
            >
              <ShieldCheck size={20} />
              Authorize Access
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
