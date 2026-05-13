import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { 
  Activity, 
  Zap, 
  Thermometer, 
  Compass, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export function DashboardPage() {
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
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    }
  }, []);

  const stats = [
    {
      label: 'System Status',
      value: 'Operational',
      icon: Activity,
      color: '#10b981', // success
      subtext: 'All joints active',
    },
    {
      label: 'Joint Precision',
      value: '±0.02mm',
      icon: Compass,
      color: '#3b82f6', // accent
      subtext: 'High accuracy mode',
    },
    {
      label: 'Energy Usage',
      value: '1.2 kWh',
      icon: Zap,
      color: '#8b5cf6', // secondary
      subtext: 'Last 24 hours',
    },
    {
      label: 'Core Temp',
      value: '34.5°C',
      icon: Thermometer,
      color: '#f59e0b', // warning
      subtext: 'Within safe limits',
    },
  ];

  const recentCommands = [
    { time: '14:32:21', command: 'Matrix pick-and-place', status: 'Success' },
    { time: '14:31:45', command: 'Home calibration', status: 'Success' },
    { time: '14:30:12', command: 'Emergency halt', status: 'Executed' },
    { time: '14:29:00', command: 'Firmware sync', status: 'Success' },
  ];

  return (
    <div ref={contentRef} className="space-y-10 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">System Overview</h1>
          <p className="text-slate-500 mt-1 font-medium text-lg">
            Real-time diagnostics and activity log for Grabber-X1
          </p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 glass-card border border-slate-200 rounded-2xl text-sm font-bold shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse relative z-10"></span>
          <span className="text-slate-700 relative z-10">Live Feed Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            data-card
            className="glass-card-vibrant p-8 hover:translate-y-[-4px] transition-all duration-300 group cursor-default"
          >
            {/* Subtle Pattern Background for individual card */}
            <div className="absolute inset-0 pattern-dots opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"></div>
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div 
                className="p-3.5 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm"
                style={{ backgroundColor: `${stat.color}10`, color: stat.color }}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="p-2 rounded-lg bg-slate-50 text-slate-300 group-hover:text-brand-accent group-hover:bg-brand-accent/5 transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 relative z-10">
              {stat.label}
            </h3>
            <p className="text-3xl font-black text-slate-900 relative z-10">{stat.value}</p>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 relative z-10">
               <span className="text-xs font-bold text-slate-500">{stat.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Visualization Placeholder */}
        <div data-card className="lg:col-span-2 glass-card-vibrant p-10 flex flex-col h-[450px]">
          <div className="absolute inset-0 pattern-grid opacity-[0.03]"></div>
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="text-2xl font-black tracking-tight">Joint Performance</h3>
            <div className="flex gap-2">
              {['24H', '7D', '30D'].map(period => (
                <button key={period} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${period === '24H' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-slate-50/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8 group cursor-pointer hover:border-brand-accent/30 transition-all duration-500 relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/5 via-transparent to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 bg-white shadow-xl shadow-slate-200 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
              <Activity className="w-10 h-10 text-brand-accent animate-pulse" />
            </div>
            <p className="text-xl font-black text-slate-800 relative z-10">Chart Engine Standby</p>
            <p className="text-sm text-slate-500 mt-2 max-w-[280px] font-medium leading-relaxed relative z-10">System is buffering kinematic data from joint sensors for real-time visualization.</p>
            
            {/* Technical HUD Marker */}
            <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-slate-300"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-slate-300"></div>
          </div>
        </div>

        {/* Resource Monitor */}
        <div data-card className="glass-card-vibrant p-10">
          <div className="absolute inset-0 pattern-dots opacity-[0.03]"></div>
          <h3 className="text-2xl font-black tracking-tight mb-10 relative z-10">Resource Monitor</h3>
          <div className="space-y-10 relative z-10">
            {[
              { label: 'CPU Load', value: 34, color: '#3b82f6' },
              { label: 'Neural Buffer', value: 68, color: '#8b5cf6' },
              { label: 'Internal Storage', value: 22, color: '#10b981' },
              { label: 'Bandwidth', value: 89, color: '#ef4444' },
            ].map((item, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-end text-sm mb-3">
                  <span className="font-black text-slate-700 uppercase tracking-wider text-[11px]">{item.label}</span>
                  <span className="text-xs font-black text-slate-400">{item.value}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner p-[1px]">
                  <div
                    className="h-full rounded-full relative transition-all duration-1000 ease-out group-hover:brightness-110"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div data-card className="glass-card-vibrant overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-md relative z-10">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-4">
            <Clock className="text-brand-accent w-8 h-8" /> Recent Activity Log
          </h3>
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-brand-accent hover:border-brand-accent transition-all shadow-sm">
            Export History
          </button>
        </div>
        <div className="divide-y divide-slate-100 relative z-10 bg-white/40">
          {recentCommands.map((cmd, idx) => (
            <div key={idx} className="flex items-center justify-between p-8 hover:bg-white/80 transition-all duration-300 group">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  cmd.status === 'Success' 
                    ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' 
                    : 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white'
                }`}>
                  {cmd.status === 'Success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                </div>
                <div>
                  <p className="font-black text-lg text-slate-800 group-hover:text-brand-accent transition-colors">
                    {cmd.command}
                  </p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{cmd.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm border transition-all ${
                  cmd.status === 'Success'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100'
                    : 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100'
                }`}>
                  {cmd.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
