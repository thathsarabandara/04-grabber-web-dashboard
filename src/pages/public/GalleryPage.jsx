import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { 
  Maximize2, 
  Layers, 
  Camera, 
  Eye, 
  Info,
  Filter,
  LayoutGrid,
  Image as ImageIcon
} from 'lucide-react';

export function GalleryPage() {
  const contentRef = useRef(null);

  useEffect(() => {
    const elements = contentRef.current?.querySelectorAll('[data-animate]');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, []);

  const galleryItems = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: `Operation Sequence ${1042 + i}`,
    category: ['Precision Assembly', 'Neural Training', 'Kinematic Test', 'Industrial Demo'][i % 4],
    timestamp: '2h ago'
  }));

  return (
    <div ref={contentRef} className="space-y-12 pb-20 relative">
      <div className="absolute inset-0 pattern-dots opacity-[0.2] pointer-events-none"></div>

      <div data-animate className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-accent/5 -translate-x-full group-hover:translate-x-0 transition-transform"></div>
            <Camera size={12} className="relative z-10" /> <span className="relative z-10">Visual Archive</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">System Documentation</h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl">
            High-fidelity captures from active Grabber deployments and lab testing.
          </p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm">
          <button className="p-2.5 bg-white text-brand-accent rounded-lg shadow-sm border border-slate-100">
            <LayoutGrid size={18} />
          </button>
          <button className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            data-animate
            className="group relative glass-card-vibrant overflow-hidden aspect-square cursor-pointer hover:border-brand-accent/30 transition-all duration-500 shadow-xl shadow-slate-200/50"
          >
            {/* Visual Placeholder / Static Background */}
            <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
              <div className="absolute inset-0 pattern-grid opacity-[0.05]"></div>
              <ImageIcon className="text-slate-200 transition-transform duration-700 group-hover:scale-110" size={64} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Hover Indicators */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0">
              <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-brand-accent transition-colors">
                <Maximize2 size={18} />
              </div>
            </div>

            <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0 delay-75">
              <div className="px-3 py-1.5 bg-brand-accent/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2">
                <Eye size={12} /> Live Capture
              </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">{item.category}</p>
                <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                  <Layers size={12} /> Batch #{item.id}09
                </div>
                <Info size={16} className="text-white/50 hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lab Note */}
      <div data-animate className="glass-card-vibrant p-12 text-center border-dashed border-2 border-slate-200 relative z-10 overflow-hidden group">
        <div className="absolute inset-0 pattern-grid opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"></div>
        <h2 className="text-2xl font-black mb-4 relative z-10 text-slate-900">Request Forensic Access</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-8 relative z-10">
          Full-resolution raw kinematic logs and thermal imaging datasets are available for institutional partners.
        </p>
        <button className="relative z-10 px-10 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20 group-hover:bg-brand-accent duration-500">
          Partnership Portal
        </button>
      </div>
    </div>
  );
}
