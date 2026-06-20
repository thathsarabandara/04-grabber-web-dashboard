import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Video, Download, Trash2, Maximize2, PlayCircle, Search, Filter, X } from 'lucide-react';
import gsap from 'gsap';
import api from '../../api/axiosInstance';

export function MediaGalleryPage() {
  const [filter, setFilter] = useState('all'); // 'all', 'image', 'video'
  const [search, setSearch] = useState('');
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const galleryRef = useRef(null);

  const getMediaUrl = (path) => {
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace('/api/v1', '');
    return `${baseUrl}${path}`;
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await api.get('/telemetry/media');
      setMediaItems(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching media gallery:", err);
      setError("Failed to load gallery items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this media item?")) {
      try {
        await api.delete(`/telemetry/media/${id}`);
        setMediaItems((prev) => prev.filter((item) => item.id !== id));
        if (activeMedia && activeMedia.id === id) {
          setActiveMedia(null);
        }
      } catch (err) {
        console.error('Failed to delete media item:', err);
        alert('Failed to delete media item.');
      }
    }
  };

  const handleDownload = (item, e) => {
    if (e) e.stopPropagation();
    const url = getMediaUrl(item.url);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.original_name || item.title || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMedia = mediaItems.filter(item => {
    const matchesFilter = filter === 'all' || item.media_type === filter;
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) || 
                          item.original_name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    if (galleryRef.current && !loading) {
      gsap.fromTo(
        galleryRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', overwrite: 'auto' }
      );
    }
  }, [filter, loading, mediaItems]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Media Gallery</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and view snapshots and recordings from the robot's camera system.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search media..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all w-full sm:w-64 shadow-sm"
            />
          </div>
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

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          {error}
          <button onClick={fetchMedia} className="underline ml-2 font-semibold">Try again</button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-card animate-pulse h-60 bg-slate-100 rounded-2xl overflow-hidden animate-pulse"></div>
          ))}
        </div>
      ) : (
        /* Gallery Grid */
        <div ref={galleryRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setActiveMedia(item)}
              className="group glass-card overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-brand-accent/10 cursor-pointer"
            >
              {/* Image/Video Container */}
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                {item.media_type === 'video' ? (
                  <div className="relative w-full h-full">
                    <video 
                      src={getMediaUrl(item.url)} 
                      preload="metadata" 
                      className="w-full h-full object-cover" 
                      muted 
                      playsInline 
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <PlayCircle size={36} className="text-white/80 drop-shadow-md group-hover:scale-110 transition duration-300" />
                    </div>
                  </div>
                ) : (
                  <img 
                    src={getMediaUrl(item.url)} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                  <span className="p-3 bg-white/20 hover:bg-brand-accent text-white rounded-full transition-all duration-300 transform scale-75 group-hover:scale-100 backdrop-blur-md">
                    <Maximize2 size={20} />
                  </span>
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs font-medium border border-white/10">
                  {item.media_type === 'video' ? <Video size={12} className="text-brand-accent" /> : <ImageIcon size={12} className="text-emerald-400" />}
                  <span className="capitalize">{item.media_type}</span>
                </div>

                {/* Video Duration */}
                {item.media_type === 'video' && item.duration && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-white text-xs font-medium">
                    {item.duration}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-4 bg-white/60">
                <h3 className="font-semibold text-slate-800 text-sm truncate" title={item.title}>{item.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-[10px] text-slate-500 font-medium">
                    {new Date(item.captured_at).toLocaleDateString()} {new Date(item.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.file_size}
                  </div>
                  <div className="flex gap-2 pointer-events-auto">
                    <button 
                      onClick={(e) => handleDownload(item, e)}
                      className="text-slate-400 hover:text-brand-accent transition-colors p-1"
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(item.id, e)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && filteredMedia.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 glass-card bg-white/40">
          <ImageIcon size={48} className="mb-4 opacity-50 text-slate-300" />
          <p className="font-medium text-slate-500">No media items found</p>
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {activeMedia && (
        <div 
          onClick={() => setActiveMedia(null)}
          className="fixed inset-0 z-[110] bg-slate-950/90 flex flex-col justify-center items-center p-4 md:p-8 backdrop-blur-md transition-all duration-300"
        >
          {/* Close button */}
          <button 
            onClick={() => setActiveMedia(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition border border-white/10 shadow-lg pointer-events-auto"
          >
            <X size={24} />
          </button>
          
          {/* Media Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl"
          >
            {activeMedia.media_type === 'video' ? (
              <video 
                src={getMediaUrl(activeMedia.url)} 
                controls 
                autoPlay 
                className="max-w-full max-h-[75vh] object-contain"
              />
            ) : (
              <img 
                src={getMediaUrl(activeMedia.url)} 
                alt={activeMedia.title} 
                className="max-w-full max-h-[75vh] object-contain"
              />
            )}
          </div>
          
          {/* Details */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="mt-6 text-center space-y-2 pointer-events-auto"
          >
            <h2 className="text-white font-bold text-lg">{activeMedia.title}</h2>
            <p className="text-slate-400 text-xs">
              Captured: {new Date(activeMedia.captured_at).toLocaleString()} • Size: {activeMedia.file_size}
              {activeMedia.duration && ` • Duration: ${activeMedia.duration}`}
            </p>
            <div className="flex gap-4 justify-center mt-2">
              <button 
                onClick={(e) => handleDownload(activeMedia, e)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white text-xs font-semibold rounded-xl transition shadow-md"
              >
                <Download size={14} /> Download
              </button>
              <button 
                onClick={(e) => handleDelete(activeMedia.id, e)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold rounded-xl transition"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
