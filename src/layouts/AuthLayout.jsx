import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Cpu } from 'lucide-react';

export function AuthLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const containerRef = useRef(null);

  useEffect(() => {
    // Entrance animation for the form container
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, [location.pathname]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex w-full bg-white font-sans">
      {/* Left Panel - Image and Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-950 items-center justify-center">
        {/* Background Image */}
        <img 
          src="/robot_auth_bg.png" 
          alt="Industrial Robot Arm" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent"></div>
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Brand Content */}
        <div className="relative z-10 flex flex-col items-start justify-end h-full w-full p-16 pb-24">
          <div className="inline-flex items-center justify-center p-4 bg-brand-accent/20 backdrop-blur-xl border border-brand-accent/30 rounded-2xl shadow-2xl shadow-brand-accent/20 mb-8">
            <Cpu className="w-10 h-10 text-brand-accent" />
          </div>
          <h1 className="text-5xl xl:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Next-Gen <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-secondary">Robotic Control</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-lg leading-relaxed">
            The ultimate industrial dashboard for Grabber robotic systems. Monitor high-fidelity telemetry and orchestrate sub-millisecond control loops.
          </p>
          
          {/* Tech indicators */}
          <div className="flex gap-8 mt-12 pt-12 border-t border-white/10 w-full max-w-lg">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">System Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-bold text-white tracking-widest uppercase">Online</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Latency</p>
              <p className="text-sm font-bold text-white tracking-widest uppercase">&lt; 1ms</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Core Version</p>
              <p className="text-sm font-bold text-white tracking-widest uppercase">v2.4.1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-50">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 pattern-dots opacity-[0.3] pointer-events-none"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div ref={containerRef} className="relative w-full max-w-md z-10">
          {/* Mobile Only Header */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-brand-accent rounded-2xl shadow-2xl shadow-brand-accent/30 mb-5">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-secondary">
              Grabber
            </h2>
          </div>

          {/* Form Content */}
          <Outlet />

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Grabber Robotics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
