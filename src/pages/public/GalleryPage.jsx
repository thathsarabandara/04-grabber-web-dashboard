import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { 
  X,
  Play,
  CheckCircle2,
  Maximize2,
  Camera,
} from 'lucide-react';
import { projectTimeline } from '../../data/timelineData';

export function GalleryPage() {
  const contentRef = useRef(null);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const elements = contentRef.current?.querySelectorAll('[data-animate]');
    if (elements && elements.length > 0) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }
  }, []);

  // Ensure body scroll is locked when modal is open
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
    <div className="relative min-h-screen pb-20">
      <div className="absolute inset-0 pattern-dots opacity-[0.2] pointer-events-none"></div>

      <div ref={contentRef} className="max-w-5xl mx-auto space-y-16 px-4 sm:px-6 relative z-10 pt-8">
        
        {/* Header section */}
        <div data-animate className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-accent/5 -translate-x-full group-hover:translate-x-0 transition-transform"></div>
              <Camera size={12} className="relative z-10" /> <span className="relative z-10">Evolution Timeline</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Project Evolution</h1>
            <p className="text-lg text-slate-500 font-medium max-w-xl">
              Tracing the development of the Grabber System from a manual prototype to a fully connected robotic ecosystem.
            </p>
          </div>
        </div>

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical line running down the middle (hidden on small screens) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 transform -translate-x-1/2 z-0"></div>

          <div className="space-y-16 md:space-y-24">
            {projectTimeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={item.id} data-animate className={`relative flex flex-col md:flex-row gap-8 md:gap-12 items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Timeline dot */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-slate-100 shadow-xl items-center justify-center z-10">
                    <span className="text-brand-accent font-black text-lg">D{item.day}</span>
                  </div>

                  {/* Content Side */}
                  <div className={`w-full md:w-1/2 flex flex-col ${isEven ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
                    <div className="glass-card-vibrant p-8 w-full shadow-lg shadow-slate-200/50 border border-slate-200/60 rounded-2xl relative overflow-hidden group hover:border-brand-accent/30 transition-all duration-500">
                      
                      {/* Optional Day Badge for Mobile */}
                      <div className="md:hidden inline-block mb-4 px-3 py-1 bg-brand-accent/10 text-brand-accent text-xs font-black rounded-lg">
                        Day {item.day}
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-sm font-bold text-brand-accent mb-4">{item.subtitle}</p>
                      
                      <p className="text-slate-600 mb-6 text-sm leading-relaxed">{item.description}</p>
                      
                      <div className="space-y-4 mb-6">
                        <div className={`bg-slate-50 p-4 rounded-xl border border-slate-100 ${isEven ? 'md:text-right' : 'md:text-left'} text-left`}>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Core Implementation</p>
                          <ul className="space-y-2">
                            {item.implemented.map((impl, idx) => (
                              <li key={idx} className={`flex items-start gap-2 text-sm text-slate-700 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>{impl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6 justify-start">
                        {item.tags.slice(0,3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {item.video && (
                        <button 
                          onClick={() => setActiveItem(item)}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-accent transition-colors shadow-md ${isEven ? 'md:flex-row-reverse' : ''}`}
                        >
                          <Play size={14} /> Watch Sequence
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Visual Side (Thumbnail) */}
                  <div className="w-full md:w-1/2">
                    <div 
                      className="aspect-video bg-slate-100 rounded-2xl relative overflow-hidden shadow-xl border border-slate-200/50 cursor-pointer group"
                      onClick={() => item.video && setActiveItem(item)}
                    >
                      {item.video ? (
                        <>
                          <video 
                            src={item.video} 
                            muted 
                            loop 
                            autoPlay 
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/40 backdrop-blur-md border border-white/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl">
                              <Maximize2 size={24} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50 pattern-grid opacity-[0.8]">
                          <Camera size={48} className="mb-4 opacity-20" />
                          <p className="text-xs font-black uppercase tracking-widest opacity-50">Visual Pending</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Fullscreen Video Modal - Attractive Light Theme */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xl p-4 md:p-8 animate-in fade-in duration-300">
          
          <button 
            onClick={() => setActiveItem(null)}
            className="absolute top-6 right-6 md:top-8 md:right-8 p-3 bg-white hover:bg-slate-100 text-slate-900 rounded-full shadow-2xl transition-all hover:scale-105 z-50 border border-slate-200"
          >
            <X size={24} />
          </button>

          <div className="max-w-7xl w-full max-h-[95vh] flex flex-col lg:flex-row bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] relative">
            
            {/* Video Player Section */}
            <div className="w-full lg:w-3/5 bg-slate-50 relative flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200">
              {activeItem.video ? (
                <video 
                  src={activeItem.video} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain max-h-[45vh] lg:max-h-[90vh]"
                />
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 pattern-grid opacity-80 w-full">
                  <Camera size={48} className="mb-4 opacity-30" />
                  <p className="text-sm font-bold uppercase tracking-widest opacity-50">No Visual Available</p>
                </div>
              )}
            </div>

            {/* Modal Details Panel (Light Mode) */}
            <div className="w-full lg:w-2/5 p-8 lg:p-12 overflow-y-auto max-h-[50vh] lg:max-h-[95vh] custom-scrollbar bg-white">
              <div className="space-y-10">
                
                {/* Header */}
                <div>
                  <div className="inline-block px-4 py-1.5 mb-6 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-black rounded-full uppercase tracking-[0.2em]">
                    Day {activeItem.day}
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-3 tracking-tight">{activeItem.title}</h2>
                  <p className="text-slate-500 font-medium leading-relaxed text-lg">
                    {activeItem.subtitle}
                  </p>
                </div>

                {/* Implementation List */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Implementation Focus</p>
                  <ul className="space-y-3 bg-slate-50/80 p-6 rounded-2xl border border-slate-100">
                    {activeItem.implemented.map((impl, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                        <CheckCircle2 size={18} className="text-brand-accent shrink-0 mt-0.5" />
                        <span>{impl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* System Flow */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Flow</p>
                  <div className="bg-slate-900 p-5 rounded-2xl text-sm font-medium font-mono text-emerald-400 border border-slate-800 overflow-x-auto shadow-inner shadow-slate-950/20">
                    {activeItem.flow}
                  </div>
                </div>

                {/* Why It Matters */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Context</p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    {activeItem.context}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100">
                  {activeItem.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
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
