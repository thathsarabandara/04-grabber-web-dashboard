import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Gamepad2, 
  Camera, 
  Activity, 
  Box, 
  Target, 
  PenTool, 
  Calendar, 
  Cpu,
  ChevronRight,
  Zap,
  ArrowDown
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function FeaturesPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const steps = containerRef.current?.querySelectorAll('.feature-step');
    
    steps.forEach((step, index) => {
      gsap.fromTo(
        step,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
          }
        }
      );
    });

    gsap.fromTo(
      '.step-line',
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'bottom 20%',
          scrub: 1,
        }
      }
    );
  }, []);

  const features = [
    {
      icon: Gamepad2,
      title: 'Kinematic Input',
      description: 'Precision 4-axis manipulation through ultra-low latency analog control loops. Supports industrial-grade HID controllers.',
      status: 'Active',
      phase: 'Interface'
    },
    {
      icon: Camera,
      title: 'Visual Core',
      description: 'Sub-100ms latency video streaming with automated forensic recording and MJPEG optimization for low bandwidth.',
      status: 'High Def',
      phase: 'Perception'
    },
    {
      icon: Activity,
      title: 'Neural HUD',
      description: 'Real-time sensor fusion and joint-torque visualization. Provides operators with critical system health telemetry.',
      status: 'Real-time',
      phase: 'Monitoring'
    },
    {
      icon: Box,
      title: 'Digital Twin',
      description: 'High-fidelity Three.js simulations for pre-execution path verification. Syncs perfectly with hardware state.',
      status: '3D Render',
      phase: 'Simulation'
    },
    {
      icon: Target,
      title: 'Object Logic',
      description: 'Neural-vision assisted pick-and-place with autonomous error correction and spatial coordinate mapping.',
      status: 'AI Assisted',
      phase: 'Intelligence'
    },
    {
      icon: PenTool,
      title: 'Vector Pathing',
      description: 'Interactive workspace mapping with automatic inverse-kinematics solving. Click-to-move path generation.',
      status: 'Precise',
      phase: 'Planning'
    },
    {
      icon: Calendar,
      title: 'Logic Sequencer',
      description: 'Enterprise task scheduling for complex multi-operation cycles. Drag-and-drop task queue management.',
      status: 'Reliable',
      phase: 'Automation'
    },
    {
      icon: Cpu,
      title: 'Unified Kernel',
      description: 'Seamless integration across the entire Grabber microservices ecosystem with high-availability clustering.',
      status: 'Stable',
      phase: 'Foundation'
    },
  ];

  return (
    <div ref={containerRef} className="pb-32 pattern-circuit">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-8 mb-32 pt-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 mb-4">
          <Zap size={14} className="text-brand-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">System Specification</span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter">Operational <span className="text-brand-accent underline decoration-slate-200 underline-offset-8">Capabilities</span></h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
          Explore the sophisticated layers of technology that enable precise robotic manipulation and autonomous decision making.
        </p>
        
        <div className="pt-8 flex justify-center">
          <div className="w-10 h-16 rounded-full border-2 border-slate-200 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-brand-accent rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="max-w-4xl mx-auto px-6 relative">
        <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2">
          <div className="step-line absolute top-0 left-0 w-full bg-brand-accent origin-top scale-y-0" />
        </div>

        <div className="space-y-24">
          {features.map((feature, idx) => (
            <div key={idx} className={`feature-step flex flex-col md:flex-row items-start md:items-center gap-12 relative ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              {/* Feature Content */}
              <div className="flex-1 w-full">
                <div className="glass-card group p-10 hover:border-brand-accent/30 transition-all duration-500 relative">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-xl font-black text-xs shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
                    {idx + 1}
                  </div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-4 bg-brand-accent/5 text-brand-accent rounded-2xl group-hover:bg-brand-accent group-hover:text-white transition-all duration-500">
                      <feature.icon size={24} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-1 bg-slate-50 rounded-full">
                      {feature.phase}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-brand-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed mb-8">
                    {feature.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent/60">
                      Status: {feature.status}
                    </span>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-accent transition-colors">
                      Tech Specs <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Center Dot */}
              <div className="absolute left-[39px] md:left-1/2 -translate-x-1/2 z-10 hidden md:block">
                <div className="w-16 h-16 rounded-full bg-white border-8 border-slate-50 shadow-2xl flex items-center justify-center group-hover:scale-125 transition-transform duration-500">
                   <div className="w-3 h-3 rounded-full bg-brand-accent" />
                </div>
              </div>

              {/* Spacer for MD screens */}
              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Note */}
      <div className="max-w-5xl mx-auto mt-40 px-6">
        <div className="glass-card-vibrant p-16 text-center">
          <h2 className="text-4xl font-black tracking-tight mb-8">Cross-Platform Synchronization</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-12 text-lg">
            Our control layer supports all modern standard input devices, including Xbox, PlayStation, and industrial-grade HID controllers via the Gamepad API.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {['LOW-LATENCY', 'AES-256', 'WSS-READY', 'ISO-9001'].map(tag => (
               <div key={tag} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 font-black italic tracking-tighter text-slate-400 hover:text-brand-accent hover:border-brand-accent/20 transition-all cursor-default">
                 {tag}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}


