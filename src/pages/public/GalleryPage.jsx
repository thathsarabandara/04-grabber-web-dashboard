import { useRef, useEffect, useState } from 'react';
import { 
  X,
  Play,
  CheckCircle2,
  Camera,
  Cpu,
  RefreshCw,
  Settings,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { projectTimeline } from '../../data/timelineData';

const YoutubeIcon = ({ size = 18, className = "" }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
    fill="currentColor"
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export function GalleryPage() {
  const timelineRef = useRef(null);
  const [timelineItems, setTimelineItems] = useState(projectTimeline);
  const [cardPositions, setCardPositions] = useState({});
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [hoveredCardDay, setHoveredCardDay] = useState(null);
  const [clickedCardDay, setClickedCardDay] = useState(null);
  
  // Console state
  const [showConsole, setShowConsole] = useState(false);
  const [selectedConsoleDay, setSelectedConsoleDay] = useState(1);
  const [consoleUrl, setConsoleUrl] = useState('');
  const [consoleSuccessMsg, setConsoleSuccessMsg] = useState('');

  // Helper to parse YouTube Video ID
  const getYouTubeId = (url) => {
    if (!url) return '';
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };
  
  // Update timeline video url
  const handleUpdateVideo = (e) => {
    e.preventDefault();
    if (!consoleUrl.trim()) return;
    
    const parsedId = getYouTubeId(consoleUrl);
    if (!parsedId) {
      alert('Invalid YouTube URL. Please enter a valid watch link, share link, or ID.');
      return;
    }
    
    setTimelineItems(prev => prev.map(item => {
      if (item.day === Number(selectedConsoleDay)) {
        return { ...item, video: consoleUrl };
      }
      return item;
    }));
    
    setConsoleSuccessMsg(`Successfully updated Day ${selectedConsoleDay} feed!`);
    setConsoleUrl('');
    
    setTimeout(() => {
      setConsoleSuccessMsg('');
    }, 3000);
  };

  const handleResetTimeline = () => {
    setTimelineItems(projectTimeline);
    setConsoleSuccessMsg('Timeline videos reset to default.');
    setTimeout(() => setConsoleSuccessMsg(''), 3000);
  };

  // Scroll tracker listener for 3D layout calculations
  useEffect(() => {
    const handleScroll = () => {
      const container = timelineRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate active progress timeline height
      const startOffset = windowHeight / 2;
      const totalHeight = rect.height - startOffset;
      const scrolled = -rect.top + startOffset;
      const percent = Math.min(Math.max((scrolled / totalHeight) * 100, 0), 100);
      setScrollPercent(percent);

      // Compute normalized distance coefficients (-1 to 1) for each card
      const positions = {};
      timelineItems.forEach(item => {
        const el = document.getElementById(`timeline-card-wrapper-${item.day}`);
        if (el) {
          const cardRect = el.getBoundingClientRect();
          const centerY = windowHeight / 2;
          const cardCenter = cardRect.top + cardRect.height / 2;
          
          // Normalized relative offset
          const distance = (cardCenter - centerY) / (windowHeight / 1.15);
          positions[item.day] = Math.min(Math.max(distance, -1), 1);
        }
      });
      setCardPositions(positions);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Initial execution
    handleScroll();
    const timeout = setTimeout(handleScroll, 150);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timeout);
    };
  }, [timelineItems]);

  // Compute active day based on closest card to center viewport
  let activeDay = 1;
  let minDistance = 999;
  timelineItems.forEach(item => {
    const dist = Math.abs(cardPositions[item.day] ?? (item.day === 1 ? 0 : 1));
    if (dist < minDistance) {
      minDistance = dist;
      activeDay = item.day;
    }
  });

  // Scroll lock when modal is open
  useEffect(() => {
    if (activeItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeItem]);

  return (
    <div className="relative min-h-screen pb-32 bg-slate-50/20 overflow-hidden font-sans pattern-dots">
      {/* Background decoration patterns */}
      <div className="absolute inset-0 pattern-grid opacity-[0.05] pointer-events-none z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-blue-50/20 via-transparent to-transparent pointer-events-none z-0"></div>
      
      {/* Glowing background orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-300/10 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="absolute top-2/3 right-1/4 w-[500px] h-[500px] bg-purple-300/10 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <style dangerouslySetInnerHTML={{__html: `
        .text-outline-indigo {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(99, 102, 241, 0.12);
        }
        .active-day-glow {
          box-shadow: 0 25px 60px rgba(99, 102, 241, 0.055), inset 0 0 0 1px rgba(99, 102, 241, 0.12);
          border-color: rgba(99, 102, 241, 0.18);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.4);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.6);
        }
      `}} />

      <div className="max-w-5xl mx-auto space-y-16 px-4 sm:px-6 relative z-10 pt-16">
        
        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-4 animate-pulse-slow">
            <Camera size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Evolution Showcase</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-tight text-slate-800">
            Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Milestones</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            The engineering logs of Grabber platform, mapping the daily progression from the blueprint stages to high-fidelity AI-guided execution.
          </p>
          
          <div className="flex items-center justify-center gap-6 pt-4">
            <a 
              href="https://www.youtube.com/@thathsarabandara4647" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-red-600/20 cursor-pointer"
            >
              <YoutubeIcon size={18} className="fill-white" /> Watch Channel
            </a>
          </div>
        </div>

        {/* Timeline scroll container */}
        <div ref={timelineRef} className="relative" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Vertical dashed timeline connector line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-slate-200/80 border-l border-dashed border-slate-350 z-0 transform -translate-x-1/2"></div>
          
          {/* Vertical liquid progress line active fill (Desktop) */}
          <div 
            className="hidden md:block absolute left-1/2 top-0 w-[1.5px] bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 z-0 transform -translate-x-1/2 transition-all duration-300 ease-out" 
            style={{ height: `${scrollPercent}%` }}
          ></div>

          {/* Vertical timeline connector line (Mobile) */}
          <div className="md:hidden absolute left-4 top-0 bottom-0 w-[1.5px] bg-slate-200/80 border-l border-dashed border-slate-350 z-0"></div>
          <div 
            className="md:hidden absolute left-4 top-0 w-[1.5px] bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 z-0 transition-all duration-300 ease-out" 
            style={{ height: `${scrollPercent}%` }}
          ></div>

          <div className="space-y-16 md:space-y-24">
            {timelineItems.map((item, index) => {
              const isEven = index % 2 === 0;
              const ytId = getYouTubeId(item.video);
              
              // Scroll Calculations for 3D Transforms
              const dist = cardPositions[item.day] ?? (item.day === 1 ? 0 : 1); // Default Day 1 to 0 (centered) on load, others to 1
              const isHovered = hoveredCardDay === item.day;
              const isClicked = clickedCardDay === item.day;
              
              // Focus Thresholds
              const isFocused = Math.abs(dist) < 0.22 || isHovered || isClicked;  // Show extended details
              const isVideoClose = Math.abs(dist) < 0.35 || isHovered || isClicked; // Mount and play video stream
              const isActiveNode = item.day === activeDay || isHovered || isClicked;
              
              // 3D Offset Variables
              const rotateX = dist * -15; // Tilts forward/backward
              const rotateY = dist * 7;   // Subtle yaw rotation
              const scale = 1 - Math.min(Math.abs(dist) * 0.08, 0.1);
              const translateZ = -Math.abs(dist) * 80;
              const opacityVal = 1 - Math.min(Math.abs(dist) * 0.45, 0.5);

              return (
                <div 
                  key={item.id} 
                  id={`timeline-card-wrapper-${item.day}`}
                  className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                >
                  
                  {/* Timeline node dot (Desktop) */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10 items-center justify-center">
                    <div className={`rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-500 ${
                      isActiveNode 
                      ? 'w-10 h-10 border-4 border-indigo-600 scale-105 shadow-[0_0_15px_rgba(99,102,241,0.25)]' 
                      : 'w-8 h-8 border-2 border-slate-300 scale-100'
                    }`}>
                      <span className={`text-[8px] font-black transition-colors ${isActiveNode ? 'text-indigo-600' : 'text-slate-400'}`}>
                        D{item.day}
                      </span>
                    </div>
                  </div>

                  {/* Mobile node dot */}
                  <div className="md:hidden absolute left-4 transform -translate-x-1/2 z-10 flex items-center justify-center top-8">
                    <div className={`rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-500 ${
                      isActiveNode 
                      ? 'w-6 h-6 border-2 border-indigo-600' 
                      : 'w-5 h-5 border border-slate-300'
                    }`}>
                      <span className={`text-[7px] font-black ${isActiveNode ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {item.day}
                      </span>
                    </div>
                  </div>

                  {/* LEFT PANE GRID SLOT (Card or spacing depending on index) */}
                  <div className="col-span-1 md:col-span-5">
                    {isEven ? (
                      <div 
                        id={`timeline-card-${item.day}`}
                        onMouseEnter={() => setHoveredCardDay(item.day)}
                        onMouseLeave={() => setHoveredCardDay(null)}
                        onClick={() => setClickedCardDay(clickedCardDay === item.day ? null : item.day)}
                        style={{
                          transform: `perspective(1000px) rotateX(${isFocused ? 0 : rotateX}deg) rotateY(${isFocused ? 0 : rotateY}deg) translateZ(${isFocused ? 0 : translateZ}px) scale(${isFocused ? 1.02 : scale})`,
                          opacity: isFocused ? 1 : opacityVal,
                          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out, border-color 0.5s, box-shadow 0.5s'
                        }}
                        className={`ml-8 md:ml-0 bg-white border rounded-[2.2rem] overflow-hidden select-none cursor-pointer group ${
                          isFocused 
                          ? 'active-day-glow shadow-[0_20px_50px_rgba(99,102,241,0.08)]' 
                          : 'border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:border-slate-200'
                        }`}
                      >
                        
                        {/* Video Frame Preview */}
                        <div className="aspect-video w-full bg-slate-950 relative overflow-hidden border-b border-slate-100">
                          {isVideoClose && ytId ? (
                            <>
                              <iframe 
                                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=${isMuted ? '1' : '0'}&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
                                title={item.title}
                                allow="autoplay; encrypted-media"
                                className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none transition-all duration-75 border-0"
                              />
                              
                              {/* Audio controllers */}
                              <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMuted(!isMuted);
                                  }}
                                  className="p-2 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md border border-white/10 rounded-full text-white transition-all cursor-pointer"
                                  title={isMuted ? 'Unmute stream audio' : 'Mute stream audio'}
                                >
                                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                                </button>
                                <button
                                  onClick={() => setActiveItem(item)}
                                  className="p-2 bg-white/95 hover:bg-white backdrop-blur-md border border-slate-200/50 rounded-full text-slate-800 transition-all cursor-pointer"
                                  title="Fullscreen cinematic details"
                                >
                                  <Maximize2 size={12} />
                                </button>
                              </div>
                            </>
                          ) : (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveItem(item);
                              }}
                              className="absolute inset-0 w-full h-full bg-slate-950 relative overflow-hidden group/thumb cursor-pointer"
                            >
                              {ytId ? (
                                <>
                                  <img 
                                    src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover opacity-60 scale-100 group-hover/thumb:scale-105 transition-transform duration-700" 
                                  />
                                  <div className="absolute inset-0 bg-slate-950/20 group-hover/thumb:bg-slate-950/10 transition-colors duration-300"></div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-slate-800 scale-95 group-hover/thumb:scale-105 transition-all duration-300">
                                      <Play size={16} className="ml-0.5 fill-slate-800 text-slate-800" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50 pattern-grid opacity-[0.8] w-full h-full">
                                  <Camera size={32} className="mb-2 opacity-20" />
                                  <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Scroll to center and load stream</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Content description details */}
                        <div className="p-8 space-y-5">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-md">Day {item.day}</span>
                              <h3 className="text-xl font-black text-slate-800 tracking-tight transition-colors duration-300 mt-1 flex items-center gap-2">
                                <span>{item.title}</span>
                                <span className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                                  {isFocused ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </span>
                              </h3>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.subtitle}</p>
                            </div>
                            <span className="text-6xl font-black font-mono text-outline-indigo select-none leading-none opacity-40">
                              0{item.day}
                            </span>
                          </div>

                          {/* Dynamic Scroll Accordion Expansion Block */}
                          <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
                            isFocused ? 'max-h-[580px] opacity-100 mt-5 pt-5 border-t border-slate-100' : 'max-h-0 opacity-0 pointer-events-none'
                          }`}>
                            <div className="space-y-5">
                              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                                {item.description}
                              </p>

                              {/* Benchmarks grid */}
                              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-2">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Development Benchmarks</span>
                                <ul className="space-y-2">
                                  {item.implemented.map((impl, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-semibold leading-snug">
                                      <CheckCircle2 size={13} className="text-indigo-500 shrink-0 mt-0.5" />
                                      <span>{impl}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Project context motivations */}
                              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Project Context</span>
                                <p className="text-slate-400 text-[10px] font-semibold leading-normal">
                                  {item.context}
                                </p>
                              </div>

                              {/* Tags and launcher triggers */}
                              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100/80">
                                <div className="flex flex-wrap gap-1">
                                  {item.tags.map((tag, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[8px] font-bold rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <button
                                  onClick={() => setActiveItem(item)}
                                  className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-slate-700 hover:text-indigo-600 transition-colors duration-300 cursor-pointer"
                                >
                                  <span>Cinematic Console</span>
                                  <Play size={8} fill="currentColor" />
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>
                    ) : (
                      <div className="hidden md:block"></div> /* Space filler block */
                    )}
                  </div>

                  {/* CENTER GAP (2 columns) */}
                  <div className="hidden md:block col-span-2"></div>

                  {/* RIGHT PANE GRID SLOT (Card or spacing depending on index) */}
                  <div className="col-span-1 md:col-span-5">
                    {!isEven ? (
                      <div 
                        id={`timeline-card-${item.day}`}
                        onMouseEnter={() => setHoveredCardDay(item.day)}
                        onMouseLeave={() => setHoveredCardDay(null)}
                        onClick={() => setClickedCardDay(clickedCardDay === item.day ? null : item.day)}
                        style={{
                          transform: `perspective(1000px) rotateX(${isFocused ? 0 : rotateX}deg) rotateY(${isFocused ? 0 : rotateY}deg) translateZ(${isFocused ? 0 : translateZ}px) scale(${isFocused ? 1.02 : scale})`,
                          opacity: isFocused ? 1 : opacityVal,
                          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out, border-color 0.5s, box-shadow 0.5s'
                        }}
                        className={`ml-8 md:ml-0 bg-white border rounded-[2.2rem] overflow-hidden select-none cursor-pointer group ${
                          isFocused 
                          ? 'active-day-glow shadow-[0_20px_50px_rgba(99,102,241,0.08)]' 
                          : 'border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:border-slate-200'
                        }`}
                      >
                        
                        {/* Video Frame Preview */}
                        <div className="aspect-video w-full bg-slate-950 relative overflow-hidden border-b border-slate-100">
                          {isVideoClose && ytId ? (
                            <>
                              <iframe 
                                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=${isMuted ? '1' : '0'}&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
                                title={item.title}
                                allow="autoplay; encrypted-media"
                                className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none transition-all duration-75 border-0"
                              />
                              
                              {/* Audio controllers */}
                              <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMuted(!isMuted);
                                  }}
                                  className="p-2 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md border border-white/10 rounded-full text-white transition-all cursor-pointer"
                                  title={isMuted ? 'Unmute stream audio' : 'Mute stream audio'}
                                >
                                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                                </button>
                                <button
                                  onClick={() => setActiveItem(item)}
                                  className="p-2 bg-white/95 hover:bg-white backdrop-blur-md border border-slate-200/50 rounded-full text-slate-800 transition-all cursor-pointer"
                                  title="Fullscreen cinematic details"
                                >
                                  <Maximize2 size={12} />
                                </button>
                              </div>

                              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-white bg-slate-950/40 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[8px] font-black uppercase tracking-widest pointer-events-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Stream Focus</span>
                              </div>
                            </>
                          ) : (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveItem(item);
                              }}
                              className="absolute inset-0 w-full h-full bg-slate-950 relative overflow-hidden group/thumb cursor-pointer"
                            >
                              {ytId ? (
                                <>
                                  <img 
                                    src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover opacity-60 scale-100 group-hover/thumb:scale-105 transition-transform duration-700" 
                                  />
                                  <div className="absolute inset-0 bg-slate-950/20 group-hover/thumb:bg-slate-950/10 transition-colors duration-300"></div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-slate-800 scale-95 group-hover/thumb:scale-105 transition-all duration-300">
                                      <Play size={16} className="ml-0.5 fill-slate-800 text-slate-800" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50 pattern-grid opacity-[0.8] w-full h-full">
                                  <Camera size={32} className="mb-2 opacity-20" />
                                  <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Scroll to center and load stream</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Content description details */}
                        <div className="p-8 space-y-5">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-md">Day {item.day}</span>
                              <h3 className="text-xl font-black text-slate-800 tracking-tight transition-colors duration-300 mt-1 flex items-center gap-2">
                                <span>{item.title}</span>
                                <span className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                                  {isFocused ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </span>
                              </h3>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.subtitle}</p>
                            </div>
                            <span className="text-6xl font-black font-mono text-outline-indigo select-none leading-none opacity-40">
                              0{item.day}
                            </span>
                          </div>

                          {/* Dynamic Scroll Accordion Expansion Block */}
                          <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
                            isFocused ? 'max-h-[580px] opacity-100 mt-5 pt-5 border-t border-slate-100' : 'max-h-0 opacity-0 pointer-events-none'
                          }`}>
                            <div className="space-y-5">
                              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                                {item.description}
                              </p>

                              {/* Benchmarks grid */}
                              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-2">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Development Benchmarks</span>
                                <ul className="space-y-2">
                                  {item.implemented.map((impl, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-semibold leading-snug">
                                      <CheckCircle2 size={13} className="text-indigo-500 shrink-0 mt-0.5" />
                                      <span>{impl}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Project context motivations */}
                              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Project Context</span>
                                <p className="text-slate-400 text-[10px] font-semibold leading-normal">
                                  {item.context}
                                </p>
                              </div>

                              {/* Tags and launcher triggers */}
                              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100/80">
                                <div className="flex flex-wrap gap-1">
                                  {item.tags.map((tag, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[8px] font-bold rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <button
                                  onClick={() => setActiveItem(item)}
                                  className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-slate-700 hover:text-indigo-600 transition-colors duration-300 cursor-pointer"
                                >
                                  <span>Cinematic Console</span>
                                  <Play size={8} fill="currentColor" />
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>
                    ) : (
                      <div className="hidden md:block"></div> /* Space filler block */
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Floating Gear for slide-over settings console */}
      <button
        onClick={() => setShowConsole(true)}
        className="fixed bottom-8 right-8 z-40 bg-white/95 backdrop-blur-md border border-slate-200/80 hover:border-slate-350 shadow-lg px-5 py-3 rounded-full hover:bg-slate-50 transition-all duration-300 flex items-center gap-2 cursor-pointer group"
      >
        <Settings size={14} className="text-slate-600 group-hover:rotate-45 transition-transform duration-500" />
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Configure Streams</span>
      </button>

      {/* Slide-over Config Console Panel */}
      {showConsole && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-slate-900/10 backdrop-blur-xs transition-opacity" 
            onClick={() => setShowConsole(false)}
          />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-350">
              
              {/* Slide header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Cpu className="text-indigo-500 w-4 h-4 animate-pulse" />
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-800">Neural Streams</h2>
                </div>
                <button 
                  onClick={() => setShowConsole(false)}
                  className="p-2 hover:bg-slate-150 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Dynamically override any timeline node stream by pasting a YouTube URL. Changes are reflected live on the evolution desk.
                </p>

                <form onSubmit={handleUpdateVideo} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Select Node</label>
                    <select 
                      value={selectedConsoleDay} 
                      onChange={(e) => setSelectedConsoleDay(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                      {timelineItems.map(item => (
                        <option key={item.id} value={item.day}>Day {item.day} - {item.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">YouTube Feed URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      value={consoleUrl}
                      onChange={(e) => setConsoleUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-md shadow-indigo-100 cursor-pointer"
                  >
                    Activate Feed
                  </button>
                </form>

                <button
                  onClick={handleResetTimeline}
                  className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors border border-slate-200/60 cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw size={12} />
                  Reset All Feeds
                </button>

                {consoleSuccessMsg && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 animate-fade-in">
                    <CheckCircle2 size={13} />
                    <span>{consoleSuccessMsg}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Video Modal (Light cyber-terminal) */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xl p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
          
          {/* Close button */}
          <button 
            onClick={() => setActiveItem(null)}
            className="absolute top-6 right-6 md:top-8 md:right-8 p-3 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50 border border-slate-200 cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="max-w-5xl w-full max-h-[90vh] flex flex-col lg:flex-row bg-white border border-slate-200/80 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            
            {/* Video Player Section */}
            <div className="w-full lg:w-3/5 bg-slate-950 relative flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200/80">
              {getYouTubeId(activeItem.video) ? (
                <iframe 
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeItem.video)}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                  title={activeItem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full aspect-video lg:h-full lg:w-full border-0 shadow-inner"
                />
              ) : (
                <div className="h-64 lg:h-96 flex flex-col items-center justify-center text-slate-400 pattern-grid opacity-80 w-full">
                  <Camera size={38} className="mb-3 opacity-30" />
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50 text-slate-400">Stream Not Active</p>
                </div>
              )}
            </div>

            {/* Modal Details Panel (Light Cyber Theme) */}
            <div className="w-full lg:w-2/5 p-8 lg:p-10 overflow-y-auto max-h-[50vh] lg:max-h-[90vh] custom-scrollbar bg-white">
              <div className="space-y-8">
                
                {/* Header */}
                <div>
                  <div className="inline-block px-3 py-1 mb-4 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black rounded-lg uppercase tracking-[0.15em]">
                    Timeline Node {activeItem.day}
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-1.5 tracking-tight leading-tight">{activeItem.title}</h2>
                  <p className="text-slate-400 font-bold leading-relaxed text-[10px] uppercase tracking-widest">
                    {activeItem.subtitle}
                  </p>
                </div>

                {/* Implementation List */}
                <div className="space-y-3">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Implementation Targets</p>
                  <ul className="space-y-3 bg-slate-50/40 p-5 rounded-2xl border border-slate-100">
                    {activeItem.implemented.map((impl, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                        <CheckCircle2 size={14} className="text-indigo-500 shrink-0 mt-0.5 opacity-90" />
                        <span className="leading-normal">{impl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Why It Matters / Context */}
                <div className="space-y-3">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Project Context</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                    {activeItem.context}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-6 border-t border-slate-100">
                  {activeItem.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1.5 bg-slate-100 text-slate-500 hover:text-slate-700 text-[9px] font-bold rounded-lg border border-slate-200/50">
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
