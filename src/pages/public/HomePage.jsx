import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Cpu, 
  Wifi, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  Globe,
  Cpu as CpuIcon,
  ChevronLeft,
  Play,
  Terminal,
  Activity
} from 'lucide-react';
import gsap from 'gsap';
import { projectTimeline } from '../../data/timelineData';

export function HomePage() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const [pingRate, setPingRate] = useState(4.2);
  const [bandwidth, setBandwidth] = useState(32.4);
  const [jointAngles, setJointAngles] = useState([45, -15, 90, 10]);
  const [mqttLogs, setMqttLogs] = useState([
    'PUB: telemetry/joint_1 -> 45.0',
    'PUB: telemetry/joint_2 -> -15.0',
    'SUB: commands/gripper -> 1'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPingRate(prev => {
        const change = (Math.random() - 0.5) * 0.4;
        return parseFloat(Math.max(2.8, Math.min(6.5, prev + change)).toFixed(1));
      });
      setBandwidth(prev => {
        const change = (Math.random() - 0.5) * 3.5;
        return parseFloat(Math.max(15.0, Math.min(50.0, prev + change)).toFixed(1));
      });
      setJointAngles(() => {
        const t = Date.now() / 2000;
        return [
          Math.round(45 + Math.sin(t) * 20),
          Math.round(-15 + Math.cos(t * 1.5) * 15),
          Math.round(90 + Math.sin(t * 0.8) * 25),
          Math.round(15 + Math.cos(t * 2) * 10)
        ];
      });
      setMqttLogs(prev => {
        const topics = ['telemetry/joint_1', 'telemetry/joint_2', 'telemetry/joint_3', 'telemetry/gripper', 'status/temp', 'status/battery'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const randomVal = (Math.random() * 100 - 50).toFixed(1);
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return [
          `[${timestamp}] PUB: ${randomTopic} -> ${randomVal}`,
          ...prev.slice(0, 2)
        ];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAutoplayPaused) return;
    const interval = setInterval(() => {
      setActiveVideoIdx(prev => (prev + 1) % projectTimeline.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isAutoplayPaused]);

  const handlePrev = () => {
    setIsAutoplayPaused(true);
    setActiveVideoIdx(prev => (prev - 1 + projectTimeline.length) % projectTimeline.length);
  };

  const handleNext = () => {
    setIsAutoplayPaused(true);
    setActiveVideoIdx(prev => (prev + 1) % projectTimeline.length);
  };

  const getYouTubeId = (url) => {
    if (!url) return '';
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

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

      {/* System Operations Command Hub */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-left space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-xl w-fit shadow-inner">
                 <Activity size={20} className="animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Live Infrastructure</span>
           </div>
           <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">System Operations Hub</h2>
           <p className="text-lg text-slate-500 font-medium max-w-xl">
              Real-time monitoring nodes reporting service telemetry and inverse kinematic state variables across the Grabber cluster.
           </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {/* Card 1: MQTT Broker */}
           <div className="glass-card-vibrant p-6 flex flex-col gap-4 border border-slate-100 hover:border-brand-accent/20 transition-all shadow-md">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">MQTT Server Broker</span>
                 </div>
                 <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-mono text-[8px] font-black uppercase tracking-wider animate-pulse">Online</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-white/5 font-mono text-[9px] text-white/70 h-[96px] overflow-hidden flex flex-col justify-end gap-1.5 text-left">
                 {mqttLogs.map((log, i) => (
                    <p key={i} className="truncate tracking-wide text-emerald-400/90">{log}</p>
                 ))}
              </div>
              <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-100">
                 <span>Active Topics: 14</span>
                 <span>Clients: 2</span>
              </div>
           </div>

           {/* Card 2: AI Pipeline */}
           <div className="glass-card-vibrant p-6 flex flex-col gap-4 border border-slate-100 hover:border-brand-accent/20 transition-all shadow-md">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Vision Engine</span>
                 </div>
                 <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-mono text-[8px] font-black uppercase tracking-wider animate-pulse">Running</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-white/5 font-mono text-[9px] text-white/70 h-[96px] flex flex-col justify-center gap-2 text-left">
                 <div className="flex justify-between">
                    <span className="text-white/40">YOLO:</span>
                    <span className="text-brand-accent font-black">STEEL_NUT [98%]</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-white/40">Gesture:</span>
                    <span className="text-brand-secondary font-black">PALM_FLAT</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-white/40">FPS // Latency:</span>
                    <span className="text-emerald-400 font-black">60.0 // 4.8ms</span>
                 </div>
              </div>
              <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-100">
                 <span>Model: YOLOv8n</span>
                 <span>Processor: Edge AI</span>
              </div>
           </div>

           {/* Card 3: Robot Kinematics */}
           <div className="glass-card-vibrant p-6 flex flex-col gap-4 border border-slate-100 hover:border-brand-accent/20 transition-all shadow-md">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Zap size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Robot Actuators</span>
                 </div>
                 <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-mono text-[8px] font-black uppercase tracking-wider animate-pulse">Nominal</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-white/5 flex flex-col justify-between h-[96px] font-mono text-[8px] text-white/50 text-left bg-gradient-to-b from-slate-950 to-slate-900">
                 <div className="space-y-1">
                    <div className="flex justify-between text-[7px]">
                       <span>BASE (J1)</span>
                       <span className="text-white font-bold">{jointAngles[0]}°</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-brand-accent transition-all duration-300" style={{ width: `${(jointAngles[0]+90)/1.8}%` }}></div>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <div className="flex justify-between text-[7px]">
                       <span>SHOULDER (J2)</span>
                       <span className="text-white font-bold">{jointAngles[1]}°</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-brand-secondary transition-all duration-300" style={{ width: `${(jointAngles[1]+90)/1.8}%` }}></div>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <div className="flex justify-between text-[7px]">
                       <span>ELBOW (J3)</span>
                       <span className="text-white font-bold">{jointAngles[2]}°</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${(jointAngles[2]+90)/1.8}%` }}></div>
                    </div>
                 </div>
              </div>
              <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-100">
                 <span>4-DOF Inverse Kin</span>
                 <span>Calibrated: Yes</span>
              </div>
           </div>

           {/* Card 4: Telemetry Socket */}
           <div className="glass-card-vibrant p-6 flex flex-col gap-4 border border-slate-100 hover:border-brand-accent/20 transition-all shadow-md">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Wifi size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Telemetry Streamer</span>
                 </div>
                 <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-mono text-[8px] font-black uppercase tracking-wider animate-pulse">Streaming</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-white/5 font-mono text-[9px] text-white/70 h-[96px] flex flex-col justify-center gap-2 text-left">
                 <div className="flex justify-between">
                    <span className="text-white/40">RTT Ping:</span>
                    <span className="text-emerald-400 font-black">{pingRate} ms</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-white/40">Throughput:</span>
                    <span className="text-brand-accent font-black">{bandwidth} KB/s</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-white/40">Packet Loss:</span>
                    <span className="text-emerald-400 font-black">0.00%</span>
                 </div>
              </div>
              <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-100">
                 <span>Socket: gRPC</span>
                 <span>Buffer Size: 2KB</span>
              </div>
           </div>
        </div>
      </section>

      {/* Project Evolution Vlog Carousel */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-xl w-fit shadow-inner">
                   <Play size={20} className="fill-brand-accent animate-pulse" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ecosystem History</span>
             </div>
             <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Project Evolution Vlog</h2>
             <p className="text-lg text-slate-500 font-medium max-w-xl">
                Watch our 16-day development milestones. The active card autoplays. Click any slide to focus.
             </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 shrink-0">
             <button 
               onClick={() => setIsAutoplayPaused(!isAutoplayPaused)}
               className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white hover:bg-slate-50 transition-all shadow-sm"
             >
                <span className={`w-2 h-2 rounded-full ${isAutoplayPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-ping'}`} />
                {isAutoplayPaused ? 'Autoplay Paused' : 'Autoplay Active'}
             </button>
             
             <div className="flex gap-2">
                <button 
                  onClick={handlePrev}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all"
                  aria-label="Previous day"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={handleNext}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all"
                  aria-label="Next day"
                >
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>
        </div>

        {/* 3-Card Auto-Carousel 3D Stage */}
        <div className="relative h-[320px] sm:h-[400px] w-full max-w-6xl mx-auto flex items-center justify-center overflow-visible">
           {projectTimeline.map((item, idx) => {
              // Calculate difference from activeVideoIdx with wrapping
              let diff = idx - activeVideoIdx;
              const total = projectTimeline.length;
              
              if (diff > total / 2) {
                 diff -= total;
              } else if (diff < -total / 2) {
                 diff += total;
              }

              const isCenter = diff === 0;
              const isLeft = diff === -1;
              const isRight = diff === 1;
              const isFarLeft = diff === -2;
              const isFarRight = diff === 2;
              const isVisible = isCenter || isLeft || isRight || isFarLeft || isFarRight;

              let transformStyle;
              let zIndex;
              let opacity;
              let pointerEvents;

              if (isCenter) {
                 transformStyle = 'translate3d(0, 0, 0) rotateY(0deg) scale(1.05)';
                 zIndex = 30;
                 opacity = 1;
                 pointerEvents = 'auto';
              } else if (isLeft) {
                 transformStyle = 'translate3d(-28%, 0, -100px) rotateY(18deg) scale(0.9)';
                 zIndex = 20;
                 opacity = 0.65;
                 pointerEvents = 'auto';
              } else if (isRight) {
                 transformStyle = 'translate3d(28%, 0, -100px) rotateY(-18deg) scale(0.9)';
                 zIndex = 20;
                 opacity = 0.65;
                 pointerEvents = 'auto';
              } else if (isFarLeft) {
                 transformStyle = 'translate3d(-52%, 0, -200px) rotateY(32deg) scale(0.75)';
                 zIndex = 10;
                 opacity = 0.3;
                 pointerEvents = 'auto';
              } else if (isFarRight) {
                 transformStyle = 'translate3d(52%, 0, -200px) rotateY(-32deg) scale(0.75)';
                 zIndex = 10;
                 opacity = 0.3;
                 pointerEvents = 'auto';
              } else {
                 transformStyle = diff < 0 
                    ? 'translate3d(-70%, 0, -300px) rotateY(40deg) scale(0.6)' 
                    : 'translate3d(70%, 0, -300px) rotateY(-40deg) scale(0.6)';
                 zIndex = 5;
                 opacity = 0;
                 pointerEvents = 'none';
              }

              const itemYtId = getYouTubeId(item.video);

              return (
                 <div 
                   key={item.id}
                   onClick={() => {
                      if (!isCenter && isVisible) {
                         setIsAutoplayPaused(true);
                         setActiveVideoIdx(idx);
                      }
                   }}
                   className="absolute w-[75%] sm:w-[45%] md:w-[35%] lg:w-[30%] h-full transition-all duration-700 ease-out select-none"
                   style={{
                      transform: transformStyle,
                      zIndex: zIndex,
                      opacity: opacity,
                      pointerEvents: pointerEvents,
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                   }}
                 >
                    <div className={`w-full h-full glass-card-vibrant rounded-[2.5rem] bg-slate-950 overflow-hidden relative flex flex-col group border shadow-2xl transition-all duration-500 ${
                       isCenter 
                         ? 'border-brand-accent/50 shadow-brand-accent/15' 
                         : 'border-white/10 opacity-75 hover:opacity-100 cursor-pointer hover:border-white/20'
                    }`}>
                       {/* Top Header of Card */}
                       <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between z-20 bg-slate-950/80 backdrop-blur-md">
                          <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${
                             isCenter ? 'bg-brand-accent text-white animate-pulse' : 'bg-white/10 text-white/60'
                          }`}>
                             Day {String(item.day).padStart(2, '0')}
                          </span>
                          <span className="text-[8px] font-mono text-white/40 tracking-wider">
                             NODE_0{item.day}
                          </span>
                       </div>

                       {/* Media viewport */}
                       <div className="flex-1 relative w-full overflow-hidden bg-slate-900 flex items-center justify-center min-h-0">
                          {isCenter && itemYtId ? (
                             <iframe
                                className="w-full h-full absolute inset-0 z-10 border-0 pointer-events-auto"
                                src={`https://www.youtube.com/embed/${itemYtId}?autoplay=1&mute=1&loop=1&playlist=${itemYtId}&controls=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
                                title={item.title}
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                             />
                          ) : (
                             <>
                                {itemYtId ? (
                                   <img 
                                     src={`https://img.youtube.com/vi/${itemYtId}/hqdefault.jpg`} 
                                     alt={item.title}
                                     className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                   />
                                ) : (
                                   <div className="text-white/20 text-xs font-mono">STREAM_OFFLINE</div>
                                )}
                                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition-all">
                                   <div className="p-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white shadow-xl group-hover:scale-110 transition-transform">
                                      <Play size={16} className="fill-white" />
                                   </div>
                                </div>
                             </>
                          )}
                       </div>

                       {/* Bottom Title of Card */}
                       <div className="p-4 sm:p-5 bg-slate-950/80 backdrop-blur-md border-t border-white/5 flex flex-col gap-2">
                          <h3 className="text-sm sm:text-base font-black text-white text-left truncate group-hover:text-brand-accent transition-colors leading-tight">
                             {item.title}
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                             {item.tags.slice(0, 2).map((tag, idx_tag) => (
                                <span key={idx_tag} className="text-[7px] font-mono text-white/40 tracking-wide uppercase">
                                   {tag}
                                </span>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              );
           })}
        </div>

        {/* Dots Indicators */}
        <div className="flex justify-center gap-2 pt-4">
           {projectTimeline.map((item, idx) => (
              <button 
                key={item.id}
                onClick={() => {
                   setIsAutoplayPaused(true);
                   setActiveVideoIdx(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                   idx === activeVideoIdx 
                     ? 'bg-brand-accent w-6' 
                     : 'bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Go to day ${item.day}`}
              />
           ))}
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
