import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Cpu } from 'lucide-react';

export function AuthLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const containerRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    // Subtle background animation
    gsap.to(bgRef.current, {
      backgroundPosition: '100% 100%',
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Entrance animation
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.98, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, [location.pathname]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div 
      ref={bgRef}
      className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden pattern-dots"
      style={{ backgroundSize: '24px 24px' }}
    >
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-accent/20 via-transparent to-brand-secondary/20 opacity-60"></div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-accent/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-secondary/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none animate-float"></div>

      <div ref={containerRef} className="relative w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-brand-accent rounded-2xl shadow-2xl shadow-brand-accent/30 mb-5">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-secondary">
            Grabber
          </h1>
          <p className="text-slate-500  mt-2 font-medium">
            AI-Powered Industrial Robotics
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card-vibrant p-8 sm:p-10 !bg-white/80 shadow-2xl shadow-slate-200">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400  font-medium">
            &copy; {new Date().getFullYear()} Grabber Robotics. Built for Excellence.
          </p>
        </div>
      </div>
    </div>
  );
}
