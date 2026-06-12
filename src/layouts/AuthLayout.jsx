import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function AuthLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const containerRef = useRef(null);

  useEffect(() => {
    // Entrance animation for the form container
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, [location.pathname]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-20 w-full max-w-6xl mx-auto">
        <div ref={containerRef} className="flex flex-col lg:flex-row w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          
          {/* Left Panel - Image and Branding */}
          <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-950 items-center justify-center p-12">
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
            <div className="relative z-10 flex flex-col items-start justify-center h-full w-full">
              <img src="/logo.png" alt="Grabber Logo" className="w-16 h-16 object-contain mb-8" />
              <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
                Next-Gen <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-secondary">Robotic Control</span>
              </h1>
              <p className="text-lg text-slate-400 font-medium max-w-md leading-relaxed">
                The ultimate industrial dashboard for Grabber robotic systems. Monitor high-fidelity telemetry and orchestrate sub-millisecond control loops.
              </p>
              
              {/* Tech indicators */}
              <div className="flex gap-6 mt-10 pt-10 border-t border-white/10 w-full">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-white tracking-widest uppercase">Online</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Latency</p>
                  <p className="text-xs font-bold text-white tracking-widest uppercase">&lt; 1ms</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative bg-white">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 pattern-dots opacity-[0.2] pointer-events-none"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative w-full max-w-sm z-10">
              {/* Mobile Only Header */}
              <div className="lg:hidden text-center mb-10">
                <img src="/logo.png" alt="Grabber Logo" className="w-12 h-12 object-contain mx-auto mb-4" />
                <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-secondary">
                  Grabber
                </h2>
              </div>

              {/* Form Content */}
              <Outlet />
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
