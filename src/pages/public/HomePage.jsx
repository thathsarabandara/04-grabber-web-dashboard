import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Cpu, 
  Wifi, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  Activity,
  Layers,
  Box,
  Monitor,
  Globe,
  Lock,
  Cpu as CpuIcon
} from 'lucide-react';
import gsap from 'gsap';

export function HomePage() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const heroElements = heroRef.current?.querySelectorAll('[data-hero-animate]');
    if (heroElements) {
      gsap.fromTo(
        heroElements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power4.out' }
      );
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elements = entry.target.querySelectorAll('[data-animate]');
          gsap.fromTo(
            elements,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
          );
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (featuresRef.current) observer.observe(featuresRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-40 pb-40 overflow-hidden font-sans selection:bg-brand-accent/30 relative">
      {/* Global Background Patterns */}
      <div className="absolute inset-0 pattern-grid opacity-[0.25] pointer-events-none"></div>
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-20 sm:pt-0 flex flex-col items-center text-center px-6"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-brand-accent/10 via-brand-secondary/10 to-transparent blur-[120px] rounded-full -z-10" />
        <div className="absolute top-40 left-0 w-72 h-72 bg-blue-400/10 blur-[100px] rounded-full -z-10 animate-pulse" />
        <div className="absolute top-40 right-0 w-72 h-72 bg-purple-400/10 blur-[100px] rounded-full -z-10 animate-pulse delay-700" />
        
        {/* HUD Elements */}
        <div className="absolute top-10 left-10 hidden xl:flex flex-col gap-1 opacity-20 pointer-events-none">
          <div className="w-20 h-[1px] bg-slate-900"></div>
          <div className="w-10 h-[1px] bg-slate-900"></div>
          <p className="text-[8px] font-black uppercase tracking-[0.4em] mt-2">Core_v2.4.1</p>
        </div>
        <div className="absolute top-10 right-10 hidden xl:flex flex-col items-end gap-1 opacity-20 pointer-events-none">
          <div className="w-20 h-[1px] bg-slate-900"></div>
          <div className="w-10 h-[1px] bg-slate-900"></div>
          <p className="text-[8px] font-black uppercase tracking-[0.4em] mt-2">Lat: 0.02ms</p>
        </div>

        <div data-hero-animate className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-100 shadow-xl shadow-slate-100/50 mb-10 transition-all hover:scale-105 cursor-default relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-accent/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800">Protocol v2.4 Live</span>
          <ChevronRight size={14} className="text-slate-300" />
        </div>

        <h1 data-hero-animate className="text-6xl sm:text-8xl font-black tracking-tight max-w-5xl leading-[1.05] text-slate-900">
          Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-brand-secondary to-brand-accent bg-[length:200%_auto] animate-gradient">Kinematics</span> for the Next Era
        </h1>
        
        <p data-hero-animate className="mt-10 text-xl sm:text-2xl text-slate-500 max-w-3xl font-medium leading-relaxed">
          The ultimate industrial dashboard for Grabber robotic systems. 
          Monitor high-fidelity telemetry and orchestrate sub-millisecond control loops from a unified interface.
        </p>

        <div data-hero-animate className="flex flex-col sm:flex-row gap-6 mt-16">
          <Link
            to="/auth/login"
            className="group px-12 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-slate-900/30 hover:bg-slate-800 hover:translate-y-[-2px] active:translate-y-[1px] transition-all flex items-center gap-4"
          >
            Access Terminal
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/features"
            className="px-12 py-5 bg-white border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl shadow-sm hover:bg-slate-50 hover:translate-y-[-2px] active:translate-y-[1px] transition-all flex items-center gap-4"
          >
            Capabilities
          </Link>
        </div>

        {/* Hero Visual Placeholder */}
        <div data-hero-animate className="mt-28 w-full max-w-6xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent to-brand-secondary rounded-[3rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div className="glass-card aspect-video w-full rounded-[3rem] border-8 border-white overflow-hidden relative shadow-2xl bg-slate-950 flex items-center justify-center">
            
            <img src="/dashboard.png" alt="Kinematics Dashboard" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>

            <div className="absolute bottom-10 flex flex-col items-center gap-4 z-10 w-full px-10">
               <div className="text-center space-y-3 bg-slate-950/50 backdrop-blur-md px-8 py-5 rounded-3xl border border-white/10 shadow-2xl mx-auto">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Kinematic Engine Initializing</p>
                  <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto">
                     <div className="w-1/3 h-full bg-brand-accent animate-[loading_2s_infinite_ease-in-out]"></div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="absolute inset-0 pattern-grid opacity-[0.1] -z-10"></div>
        <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12">Integrated with Industry Standards</p>
        <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-10 opacity-40 hover:opacity-100 transition-all duration-700">
          <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-default">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black shadow-lg">G</div>
             <span className="font-black tracking-tighter text-xl">GRIP-TECH</span>
          </div>
          <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-default">
             <Wifi size={24} className="text-brand-accent" />
             <span className="font-black tracking-tighter text-xl">WAVE-SYNC</span>
          </div>
          <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-default">
             <CpuIcon size={24} className="text-brand-secondary" />
             <span className="font-black tracking-tighter text-xl">NEURO-LINK</span>
          </div>
          <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-default">
             <Globe size={24} className="text-brand-success" />
             <span className="font-black tracking-tighter text-xl">KINETIC-IO</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section ref={featuresRef} className="max-w-7xl mx-auto px-6 space-y-24 relative">
        <div className="text-center space-y-6">
           <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-accent/5 -translate-x-full group-hover:translate-x-0 transition-transform"></div>
              <span className="relative">Core Infrastructure</span>
           </div>
          <h2 data-animate className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900">Engineered for Reliability</h2>
          <p data-animate className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Every component of Grabber is built to handle mission-critical industrial workloads with zero compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              icon: Zap,
              title: 'Sub-ms Latency',
              description: 'Ultra-low latency control loops optimized for high-frequency industrial remote operation.',
              color: '#f59e0b',
              bg: 'bg-amber-50'
            },
            {
              icon: Cpu,
              title: 'Neural Vision',
              description: 'Advanced computer vision integration for autonomous object identification and classification.',
              color: '#3b82f6',
              bg: 'bg-blue-50'
            },
            {
              icon: ShieldCheck,
              title: 'Kernel Security',
              description: 'Enterprise-grade authentication with end-to-end encryption for all robotic control buffers.',
              color: '#10b981',
              bg: 'bg-emerald-50'
            },
            {
              icon: Wifi,
              title: 'Edge Sync',
              description: 'Real-time telemetry synchronization ensuring perfect alignment between hardware and interface.',
              color: '#8b5cf6',
              bg: 'bg-purple-50'
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              data-animate
              className="glass-card-vibrant group p-10 hover:translate-y-[-8px] transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200"
            >
              <div className={`p-4 rounded-2xl ${feature.bg} w-fit mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`} style={{ color: feature.color }}>
                <feature.icon size={32} />
              </div>
              <h3 className="font-black text-2xl mb-4 tracking-tight text-slate-900">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
              
              {/* Technical Decorative Lines */}
              <div className="absolute bottom-4 right-4 flex gap-1 opacity-10 group-hover:opacity-30 transition-opacity">
                <div className="w-1 h-4 bg-slate-900"></div>
                <div className="w-1 h-2 bg-slate-900 mt-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Showcase 1 */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
        <div data-animate className="space-y-10">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[20px] w-fit shadow-inner">
            <Activity size={32} />
          </div>
          <h2 className="text-5xl font-black tracking-tight leading-[1.1] text-slate-900">High-Fidelity <br /> Digital Twin Integration</h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Monitor every joint angle, torque value, and thermal signature through our advanced visualization engine. Prevent mechanical fatigue through predictive diagnostics.
          </p>
          <div className="space-y-6">
            {[
              { icon: Layers, text: 'Multi-layer diagnostic stacks' },
              { icon: Box, text: 'Real-time workspace mapping' },
              { icon: Lock, text: 'Secure command verification' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-2xl group transition-all hover:border-emerald-200 hover:bg-white shadow-sm">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                   <item.icon size={20} />
                </div>
                <span className="font-black text-sm text-slate-800 uppercase tracking-widest">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div data-animate className="glass-card-vibrant aspect-square rounded-[4rem] bg-slate-950 overflow-hidden relative flex items-center justify-center group shadow-2xl">
           {/* Digital Twin Placeholder */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent)] group-hover:scale-125 transition-transform duration-1000"></div>
           <div className="absolute inset-0 pattern-grid opacity-[0.05]"></div>
          <Activity size={160} className="text-emerald-500/20 animate-pulse z-10" />
          
          {/* HUD elements */}
          <div className="absolute top-10 left-10 p-4 border-l border-t border-white/20">
             <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Diagnostic_Overlay_ON</p>
          </div>

          <div className="absolute bottom-10 left-10 p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 z-20">
             <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Stream</span>
             </div>
             <p className="font-mono text-[10px] text-white/40">GRABBER_X1_THETA: 142.5°</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div data-animate className="relative rounded-[4rem] bg-slate-900 p-16 sm:p-32 overflow-hidden shadow-2xl shadow-slate-900/40">
          {/* Abstract background */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-accent/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-secondary/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 pattern-dots opacity-[0.1]"></div>
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.05] mb-10">
              Initialize Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-secondary">Robotic Fleet</span>
            </h2>
            <p className="text-slate-400 text-xl font-medium mb-14 leading-relaxed max-w-2xl">
              Join the future of industrial automation. Deploy, monitor, and scale your operations through a single unified protocol.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                to="/auth/login"
                className="px-14 py-6 bg-white text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-brand-accent/20 hover:scale-105 active:scale-95 transition-all"
              >
                Access Core
              </Link>
              <Link
                to="/contact"
                className="px-14 py-6 bg-slate-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-700 transition-all border border-slate-700"
              >
                Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
