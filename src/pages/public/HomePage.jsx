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
  Play
} from 'lucide-react';
import gsap from 'gsap';
import { projectTimeline } from '../../data/timelineData';

export function HomePage() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const pageRef = useRef(null);

  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

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
          gsap.fromTo(
            entry.target,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
          );
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const elements = pageRef.current?.querySelectorAll('[data-animate]');
    elements?.forEach(el => observer.observe(el));

    if (featuresRef.current) {
        const featureElements = featuresRef.current.querySelectorAll('[data-animate-feature]');
        featureElements.forEach(el => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pageRef} className="space-y-32 pb-40 overflow-hidden font-sans selection:bg-brand-accent/30 relative text-slate-900 bg-slate-50">
      {/* Global Background Pattern restored */}
      <div className="absolute inset-0 pattern-grid opacity-[0.25] pointer-events-none -z-10"></div>
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-20 sm:pt-28 flex flex-col items-center text-center px-6"
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

        <div data-hero-animate className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-200 shadow-xl shadow-slate-200/50 mb-10 transition-all hover:scale-105 cursor-default relative overflow-hidden group">
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
            className="px-12 py-5 bg-white border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl shadow-sm hover:bg-slate-100 hover:translate-y-[-2px] active:translate-y-[1px] transition-all flex items-center gap-4"
          >
            Capabilities
          </Link>
        </div>

        {/* Hero Visual */}
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
      <div className="max-w-7xl mx-auto px-6 relative mt-12 mb-20">
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

      {/* Features Grid (Restored Original Content) */}
      <section ref={featuresRef} className="max-w-7xl mx-auto px-6 space-y-20 relative">
        <div className="text-center space-y-6">
           <div className="inline-block px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-accent/5 -translate-x-full group-hover:translate-x-0 transition-transform"></div>
              <span className="relative">Core Infrastructure</span>
           </div>
          <h2 data-animate-feature className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900">Engineered for Reliability</h2>
          <p data-animate-feature className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Every component of Grabber is built to handle mission-critical industrial workloads with zero compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Zap,
              title: 'Sub-ms Latency',
              description: 'Ultra-low latency control loops optimized for high-frequency industrial remote operation.',
              color: '#f59e0b',
              bg: 'bg-amber-50'
            },
            {
              icon: CpuIcon,
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
              data-animate-feature
              className="glass-card-vibrant group p-8 hover:translate-y-[-8px] transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50"
            >
              <div className={`p-4 rounded-2xl ${feature.bg} w-fit mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`} style={{ color: feature.color }}>
                <feature.icon size={28} />
              </div>
              <h3 className="font-bold text-2xl mb-4 tracking-tight text-slate-900">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
              
              <div className="absolute bottom-4 right-4 flex gap-1 opacity-10 group-hover:opacity-30 transition-opacity">
                <div className="w-1 h-4 bg-slate-900"></div>
                <div className="w-1 h-2 bg-slate-900 mt-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Relevant Long-Form Content Blocks with Image Placeholders */}
      <section className="max-w-7xl mx-auto px-6 space-y-32 relative pt-10">
            {/* Block 1: Kinematics Engine */}
            <div data-animate className="flex flex-col lg:flex-row items-center gap-16">
               <div className="flex-1 space-y-6">
                  <div className="inline-block px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                     Inverse Kinematics
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                     Flawless Motion<br/>Control Algorithms
                  </h2>
                  <p className="text-lg text-slate-500 leading-relaxed font-medium">
                     Our proprietary kinematics engine abstracts the complex mathematics of robotic arm movement, allowing operators to dictate end-effector positions seamlessly. We process spatial transformations in real-time, ensuring that every command translates into smooth, collision-free physical motion across all joints.
                  </p>
                  <Link to="/features" className="inline-flex items-center gap-2 text-brand-accent font-bold pt-4">
                     Explore kinematics <ArrowRight size={20} />
                  </Link>
               </div>
               <div className="flex-1 w-full">
                  <div className="w-full aspect-square sm:aspect-[4/3] bg-white rounded-3xl flex flex-col items-center justify-center text-slate-400 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 group">
                     <img src="https://via.placeholder.com/600x450?text=Kinematics+Visualization" alt="Kinematics" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
               </div>
            </div>

            {/* Block 2: AI Pipeline */}
            <div data-animate className="flex flex-col lg:flex-row-reverse items-center gap-16">
               <div className="flex-1 space-y-6">
                  <div className="inline-block px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                     Neural Vision
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                     Autonomous Visual<br/>Identification
                  </h2>
                  <p className="text-lg text-slate-500 leading-relaxed font-medium">
                     Integrated directly into the control stream, the Grabber AI pipeline processes video feeds at 60 FPS to identify components, hazards, and alignment markers. Operators receive augmented overlays on their terminals, reducing cognitive load and dramatically improving operational safety in high-stress environments.
                  </p>
                  <Link to="/features" className="inline-flex items-center gap-2 text-brand-accent font-bold pt-4">
                     View AI models <ArrowRight size={20} />
                  </Link>
               </div>
               <div className="flex-1 w-full">
                  <div className="w-full aspect-square sm:aspect-[4/3] bg-white rounded-3xl flex flex-col items-center justify-center text-slate-400 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 group">
                     <img src="https://via.placeholder.com/600x450?text=AI+Vision+Pipeline" alt="AI Pipeline" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
               </div>
            </div>
      </section>

      {/* Project Evolution Vlog Carousel (Restored Original Content) */}
      <section className="max-w-7xl mx-auto px-6 space-y-12 relative pt-10">
        <div data-animate className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-xl w-fit shadow-inner">
                   <Play size={20} className="fill-brand-accent animate-pulse" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Ecosystem History</span>
             </div>
             <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Project Evolution Vlog</h2>
             <p className="text-lg text-slate-500 font-medium max-w-xl">
                Watch our 16-day development milestones. The active card autoplays. Click any slide to focus.
             </p>
          </div>

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
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={handleNext}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>
        </div>

        {/* 3-Card Auto-Carousel 3D Stage */}
        <div data-animate className="relative h-[320px] sm:h-[400px] w-full max-w-6xl mx-auto flex items-center justify-center overflow-visible">
           {projectTimeline.map((item, idx) => {
              let diff = idx - activeVideoIdx;
              const total = projectTimeline.length;
              if (diff > total / 2) diff -= total;
              else if (diff < -total / 2) diff += total;

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
                      zIndex,
                      opacity,
                      pointerEvents,
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                   }}
                 >
                    <div className={`w-full h-full glass-card-vibrant rounded-[2.5rem] bg-white overflow-hidden relative flex flex-col group border shadow-2xl transition-all duration-500 ${
                       isCenter 
                         ? 'border-brand-accent/50 shadow-brand-accent/15' 
                         : 'border-slate-200 opacity-90 hover:opacity-100 cursor-pointer hover:border-slate-300'
                    }`}>
                       <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between z-20 bg-white/80 backdrop-blur-md">
                          <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${
                             isCenter ? 'bg-brand-accent text-white animate-pulse' : 'bg-slate-100 text-slate-500'
                          }`}>
                             Day {String(item.day).padStart(2, '0')}
                          </span>
                          <span className="text-[8px] font-mono text-slate-400 tracking-wider">
                             NODE_0{item.day}
                          </span>
                       </div>

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

                       <div className="p-4 sm:p-5 bg-white/90 backdrop-blur-md border-t border-slate-100 flex flex-col gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 text-left truncate group-hover:text-brand-accent transition-colors leading-tight">
                             {item.title}
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                             {item.tags.slice(0, 2).map((tag, idx_tag) => (
                                <span key={idx_tag} className="text-[7px] font-mono text-slate-400 tracking-wide uppercase">
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
                     : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to day ${item.day}`}
              />
           ))}
        </div>
      </section>

      {/* Modern Minimalist CTA */}
      <section className="px-6 max-w-5xl mx-auto pt-20 relative">
         <div data-animate className="bg-white rounded-[3rem] p-16 sm:p-24 text-center relative overflow-hidden flex flex-col items-center justify-center shadow-2xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 mb-8 leading-tight">
               Deploy Your Fleet <br/>In Minutes.
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
               Join top industrial automation teams that rely on Grabber's high-fidelity telemetry and intuitive platform.
            </p>
            <Link to="/auth/register" className="inline-flex items-center gap-2 px-12 py-5 bg-slate-900 text-white font-bold text-lg rounded-full hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10">
               Access Platform Terminal
            </Link>
         </div>
      </section>

    </div>
  );
}
