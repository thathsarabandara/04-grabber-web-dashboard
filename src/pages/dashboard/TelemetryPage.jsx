import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { 
  Activity, 
  Radio, 
  Zap, 
  Thermometer, 
  Compass, 
  Cpu,
  Brain,
  Box,
  Eye,
  BarChart3,
  Waves
} from 'lucide-react';

export function TelemetryPage() {
  const contentRef = useRef(null);

  useEffect(() => {
    const cards = contentRef.current?.querySelectorAll('[data-card]');
    if (cards) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.08, 
          ease: 'power2.out'
        }
      );
    }
  }, []);

  const gauges = [
    { icon: Compass, label: 'J1 Orientation', value: 45, unit: '°', min: -180, max: 180, color: '#3b82f6' },
    { icon: Compass, label: 'J2 Elevation', value: 90, unit: '°', min: -180, max: 180, color: '#3b82f6' },
    { icon: Compass, label: 'J3 Flexion', value: 120, unit: '°', min: -180, max: 180, color: '#3b82f6' },
    { icon: Compass, label: 'J4 Rotation', value: 0, unit: '°', min: -180, max: 180, color: '#3b82f6' },
    { icon: Zap, label: 'Power Input', value: 12.4, unit: 'V', min: 10, max: 15, color: '#8b5cf6' },
    { icon: Thermometer, label: 'Core Thermal', value: 32, unit: '°C', min: 20, max: 60, color: '#f59e0b' },
  ];

  const GaugeComponent = ({ icon: Icon, label, value, unit, min, max, color }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return (
      <div data-card className="glass-card p-8 flex flex-col group hover:translate-y-[-4px] transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</h4>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{value}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase">{unit}</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
            <Icon size={24} />
          </div>
        </div>

        {/* Circular Gauge HUD Style */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={`${(percentage / 100) * 276.5} 276.5`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out opacity-90"
              style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
            />
            {/* Decorative inner markings */}
            <circle cx="50" cy="50" r="36" fill="none" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2 6" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-slate-900 mb-2"></div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Telemetry</span>
          </div>
        </div>

        {/* Range Bar */}
        <div className="space-y-3 mt-auto">
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>{min}{unit}</span>
            <span>{max}{unit}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%`, backgroundColor: color }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={contentRef} className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Waves size={12} /> Data Stream Synchronized
           </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">System Telemetry</h1>
          <p className="text-lg text-slate-500 mt-2 font-medium max-w-xl">
            Bi-directional high-frequency data stream monitoring core performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95">
              <BarChart3 size={16} /> Advanced Analysis
           </button>
        </div>
      </div>

      {/* Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {gauges.map((gauge, idx) => (
          <GaugeComponent key={idx} {...gauge} />
        ))}
      </div>

      {/* Advanced Diagnostics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* AI Analytics */}
        <div data-card className="glass-card overflow-hidden group">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-4">
               <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-xl">
                  <Brain size={24} />
               </div>
              Neural Vision
            </h3>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">YOLO_v8 Engine</span>
          </div>
          <div className="p-10 h-72 relative bg-slate-950 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="flex flex-col items-center justify-center text-white/40 gap-6 z-10">
              <div className="relative">
                <Eye size={64} className="text-brand-secondary animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-full border-2 border-brand-secondary/30 scale-150 rounded-2xl animate-ping"></div>
              </div>
              <p className="font-black tracking-[0.4em] uppercase text-[10px]">Processing Vision Matrix...</p>
            </div>
            {/* Simulated Bounding Box Overlay */}
            <div className="absolute top-[20%] left-[30%] w-40 h-40 border-2 border-brand-secondary/40 rounded-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <div className="absolute top-[-30px] left-[-2px] bg-brand-secondary text-white text-[9px] font-black px-3 py-1.5 rounded-t-xl shadow-lg">OBJ_04: Industrial_Block (98.2%)</div>
            </div>
          </div>
        </div>

        {/* 3D Simulation / Digital Twin */}
        <div data-card className="glass-card overflow-hidden group">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-4">
               <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-xl">
                  <Box size={24} />
               </div>
              Digital Twin
            </h3>
            <div className="flex gap-2">
               <Activity size={18} className="text-emerald-500" />
            </div>
          </div>
          <div className="p-10 h-72 relative bg-slate-50 flex flex-col items-center justify-center group cursor-crosshair">
            <div className="w-24 h-24 bg-white shadow-2xl shadow-slate-200 rounded-[32px] flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
              <Cpu className="w-12 h-12 text-brand-accent/60" />
            </div>
            <p className="text-slate-800 font-black uppercase tracking-[0.3em] text-[10px]">WebGL Context Initializing</p>
            <div className="mt-4 flex gap-1">
               {[1, 2, 3].map(i => (
                 <div key={i} className={`w-1.5 h-1.5 rounded-full bg-brand-accent/20 animate-bounce`} style={{ animationDelay: `${i * 0.1}s` }}></div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
