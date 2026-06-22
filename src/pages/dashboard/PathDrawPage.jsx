import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import api from '../../api/axiosInstance';
import { NoRobotsLock } from '../../components/ui/NoRobotsLock';
import { 
  Trash2, 
  Play, 
  Download, 
  MapPin, 
  MousePointer2, 
  Layers,
  Save,
  Square
} from 'lucide-react';

export function PathDrawPage() {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [robots, setRobots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await api.get('/robots');
        setRobots(response.data);
      } catch (err) {
        console.error('Failed to fetch robots', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRobots();
  }, []);

  useEffect(() => {
    const elements = contentRef.current?.querySelectorAll('[data-animate]');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );
    }

    // Initialize canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.parentNode.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawGrid();
    }
  }, []);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const step = 30;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#1e293b' : '#f1f5f9';
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoint = { x, y };
    const newPoints = [...points, newPoint];
    setPoints(newPoints);

    const ctx = canvas.getContext('2d');
    
    // Draw connecting line
    if (points.length > 0) {
      const prev = points[points.length - 1];
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw point with glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#3b82f6';
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.stroke();
  };

  const handleClear = () => {
    setPoints([]);
    drawGrid();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (robots.length === 0) {
    return (
      <NoRobotsLock 
        title="Path Planning Restricted"
        message="You must pair a physical Grabber robotic device with your profile to define kinematic spatial waypoints and trace motion trajectories."
      />
    );
  }

  return (
    <div ref={contentRef} className="space-y-10 pb-10">
      {/* Header */}
      <div data-animate className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Kinematic Path Plan</h1>
          <p className="text-slate-500  mt-1 font-medium">
            Define spatial waypoints and motion trajectories for Grabber-X1
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white  border border-slate-200  rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            <Layers size={16} /> Layers
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-accent/20 hover:scale-[1.02] transition-all">
            <Save size={16} /> Save Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Drawing Workspace */}
        <div data-animate className="lg:col-span-3 glass-card overflow-hidden h-[600px] relative">
          <div className="absolute top-6 left-6 z-10 flex items-center gap-4 bg-white/80  backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl">
            <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-xl">
              <MousePointer2 size={20} />
            </div>
            <div className="pr-4 border-r border-slate-200 ">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Tool</p>
              <p className="text-xs font-bold">Waypoint Marker</p>
            </div>
            <div className="px-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coordinates</p>
              <p className="text-xs font-mono font-bold">X: 000 | Y: 000</p>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-crosshair bg-slate-50/50 "
          ></canvas>
        </div>

        {/* Waypoints Inspector */}
        <div data-animate className="space-y-8">
          <div className="glass-card p-6 h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-3">
                <MapPin className="text-brand-accent" /> Waypoints
              </h3>
              <span className="text-[10px] font-black bg-brand-accent/10 text-brand-accent px-2.5 py-1 rounded-full uppercase tracking-tighter">
                {points.length} nodes
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {points.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                  <div className="p-4 bg-slate-100  rounded-full mb-3">
                    <MousePointer2 size={32} />
                  </div>
                  <p className="text-xs font-bold">Click canvas to add nodes</p>
                </div>
              ) : (
                points.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50  rounded-2xl border border-slate-100  flex items-center justify-between group hover:border-brand-accent/30 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand-accent rounded-full"></span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node {idx + 1}</p>
                      </div>
                      <p className="text-xs font-mono font-bold mt-1">X:{Math.round(point.x)} Y:{Math.round(point.y)}</p>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Execution Controls */}
            <div className="mt-8 pt-6 border-t border-slate-100  space-y-3">
              <button
                onClick={() => setIsExecuting(!isExecuting)}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] ${
                  isExecuting 
                    ? 'bg-slate-100  text-slate-600' 
                    : 'bg-brand-success text-white shadow-brand-success/20'
                }`}
              >
                {isExecuting ? <Square size={18} /> : <Play size={18} />}
                {isExecuting ? 'Abort Path' : 'Execute Plan'}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleClear}
                  className="flex items-center justify-center gap-2 py-3 bg-slate-50  hover:bg-red-50  text-slate-400 hover:text-red-500 rounded-xl font-bold text-xs transition-all border border-slate-100 "
                >
                  <Trash2 size={16} /> Clear
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-slate-50  text-slate-400 hover:text-brand-accent rounded-xl font-bold text-xs transition-all border border-slate-100 ">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-brand-accent/5 rounded-3xl border border-brand-accent/10">
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Paths are automatically optimized for <strong>minimum jerk</strong> and <strong>power efficiency</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

