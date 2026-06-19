import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Video, Download, Trash2, Maximize2, PlayCircle, Search, Filter } from 'lucide-react';
import gsap from 'gsap';

export function MediaGalleryPage() {
  const [filter, setFilter] = useState('all'); // 'all', 'image', 'video'
  const galleryRef = useRef(null);

  // Beautiful mock data
  const mediaItems = [
    { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', title: 'Workspace Assembly', date: '2026-06-18 10:24', size: '2.4 MB' },
    { id: 2, type: 'video', url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800', title: 'Arm Calibration Sequence', date: '2026-06-18 09:15', size: '15.2 MB', duration: '0:45' },
    { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', title: 'Circuit Inspection', date: '2026-06-17 16:30', size: '1.8 MB' },
    { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800', title: 'Object Detection Test', date: '2026-06-17 14:20', size: '3.1 MB' },
    { id: 5, type: 'video', url: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=800', title: 'Pick and Place Demo', date: '2026-06-16 11:05', size: '22.5 MB', duration: '1:12' },
    { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1484411598380-60b61e0631fb?auto=format&fit=crop&q=80&w=800', title: 'Sensor Readings Snapshot', date: '2026-06-15 08:45', size: '1.2 MB' },
  ];

  const filteredMedia = mediaItems.filter(item => filter === 'all' || item.type === filter);

  useEffect(() => {
    if (galleryRef.current) {
      gsap.fromTo(
        galleryRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [filter]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Media Gallery</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and view snapshots and recordings from the robot's camera system.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search media..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all w-full sm:w-64 shadow-sm"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl w-fit border border-slate-200/50 shadow-sm">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${filter === 'all' ? 'bg-white text-brand-accent shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          All Media
        </button>
        <button
          onClick={() => setFilter('image')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${filter === 'image' ? 'bg-white text-brand-accent shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <ImageIcon size={16} /> Images
        </button>
        <button
          onClick={() => setFilter('video')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${filter === 'video' ? 'bg-white text-brand-accent shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Video size={16} /> Videos
        </button>
      </div>

      {/* Gallery Grid */}
      <div ref={galleryRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.map((item) => (
          <div key={item.id} className="group glass-card overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-brand-accent/10">
            {/* Image/Video Container */}
            <div className="relative aspect-video overflow-hidden bg-slate-100">
              <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                <button className="p-3 bg-white/20 hover:bg-brand-accent text-white rounded-full transition-all duration-300 transform scale-75 group-hover:scale-100 backdrop-blur-md">
                  <Maximize2 size={20} />
                </button>
              </div>

              {/* Type Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-lg text-white text-xs font-medium border border-white/10">
                {item.type === 'video' ? <Video size={12} className="text-brand-accent" /> : <ImageIcon size={12} className="text-emerald-400" />}
                <span className="capitalize">{item.type}</span>
              </div>

              {/* Video Duration */}
              {item.type === 'video' && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-white text-xs font-medium">
                  <PlayCircle size={12} />
                  {item.duration}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-4 bg-white/60">
              <h3 className="font-semibold text-slate-800 text-sm truncate" title={item.title}>{item.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-slate-500 font-medium">
                  {item.date} • {item.size}
                </div>
                <div className="flex gap-2">
                  <button className="text-slate-400 hover:text-brand-accent transition-colors p-1">
                    <Download size={14} />
                  </button>
                  <button className="text-slate-400 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredMedia.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 glass-card">
          <ImageIcon size={48} className="mb-4 opacity-50" />
          <p className="font-medium">No media items found</p>
        </div>
      )}
    </div>
  );
}
