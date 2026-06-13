import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import api from '../../api/axiosInstance';
import { 
  Maximize2, 
  Minimize2, 
  Circle, 
  Square, 
  Video, 
  Settings2, 
  RefreshCcw, 
  Zap,
  Gamepad2,
  Sliders,
  Terminal,
  ChevronDown
} from 'lucide-react';

export function ControlPanelPage() {
  const [joints, setJoints] = useState({ j1: 0, j2: 45, j3: 90, j4: 0 });
  const [speed, setSpeed] = useState(50);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [robots, setRobots] = useState([]);
  const [selectedRobotId, setSelectedRobotId] = useState('');
  const contentRef = useRef(null);
  const joystick1Ref = useRef(null);
  const joystick1ContainerRef = useRef(null);
  const joystick2Ref = useRef(null);
  const joystick2ContainerRef = useRef(null);

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await api.get('/robots');
        setRobots(response.data);
        if (response.data.length > 0) {
          setSelectedRobotId(response.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch robots', err);
      }
    };
    fetchRobots();

    const elements = contentRef.current?.querySelectorAll('[data-animate]');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  const selectedRobot = robots.find(r => r.id === selectedRobotId);

  const handleJoystickMove = (e, containerRef, stickRef) => {
    if (!containerRef.current || !stickRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = rect.width / 2 - 30;

    if (distance > maxDistance) {
      const angle = Math.atan2(y, x);
      const newX = Math.cos(angle) * maxDistance;
      const newY = Math.sin(angle) * maxDistance;
      gsap.to(stickRef.current, { x: newX, y: newY, duration: 0.1 });
    } else {
      gsap.to(stickRef.current, { x, y, duration: 0.1 });
    }
  };

  const resetJoystick = (stickRef) => {
    gsap.to(stickRef.current, { x: 0, y: 0, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
  };

  const handleJointChange = (joint, value) => {
    setJoints((prev) => ({ ...prev, [joint]: value }));
  };

  return (
    <div ref={contentRef} className="space-y-12 pb-20">
      {/* Header */}
      <div data-animate className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
             <Terminal size={12} /> Real-time Control
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Manual Interface</h1>
          <p className="text-lg text-slate-500 mt-2 font-medium max-w-xl mb-4">
            Precise robotic arm manipulation and low-latency visual feedback.
          </p>
          <div className="relative inline-block mt-2">
            <select
              value={selectedRobotId}
              onChange={(e) => setSelectedRobotId(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl font-bold text-sm outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all shadow-sm"
            >
              {robots.length === 0 ? (
                <option value="">No robots available</option>
              ) : (
                robots.map(robot => (
                  <option key={robot.id} value={robot.id}>
                    {robot.name || `Robot ${robot.robot_id}`}
                  </option>
                ))
              )}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
             {[1, 2, 3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {i}
               </div>
             ))}
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Operators</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Control Area */}
        <div data-animate className="lg:col-span-2 space-y-10">
          {/* Camera Feed Container */}
          <div className={`glass-card overflow-hidden group relative shadow-2xl ${isFullScreen ? 'fixed inset-0 z-[100] !rounded-none' : 'h-[500px]'}`}>
            <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
              {/* Simulated Camera Feed */}
              <div className="flex flex-col items-center justify-center text-slate-700 gap-6">
                <div className="relative">
                  <Video size={80} className="opacity-20 animate-pulse" />
                  <div className="absolute inset-0 bg-brand-accent/30 blur-[60px] rounded-full"></div>
                </div>
                <div className="space-y-2 text-center">
                   <p className="font-black tracking-[0.3em] uppercase text-[10px] text-white/40">Feed: {selectedRobot ? (selectedRobot.name || selectedRobot.robot_id) : 'NO_SIGNAL'}</p>
                   <p className="text-[10px] font-bold text-brand-accent uppercase">Handshake Protocol Active</p>
                </div>
              </div>

              {/* HUD Elements */}
              <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Signal Stable</p>
                    </div>
                    <p className="text-white/60 font-mono text-[10px] bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">60 FPS | 12ms PING | 4.2 MB/S</p>
                  </div>
                  <div className="flex gap-3 pointer-events-auto">
                    <button
                      onClick={() => setIsFullScreen(!isFullScreen)}
                      className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all border border-white/10"
                    >
                      {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-3 backdrop-blur-md rounded-xl text-white transition-all border ${
                        isRecording ? 'bg-red-500 border-red-400 shadow-xl shadow-red-500/40' : 'bg-white/10 hover:bg-white/20 border-white/10'
                      }`}
                    >
                      {isRecording ? <Square size={20} /> : <Circle size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="font-mono text-[11px] text-white/50 space-y-1.5 bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                    <p className="flex justify-between gap-6"><span>X-AXIS:</span> <span className="text-white">+124.52</span></p>
                    <p className="flex justify-between gap-6"><span>Y-AXIS:</span> <span className="text-white">-08.12</span></p>
                    <p className="flex justify-between gap-6"><span>Z-AXIS:</span> <span className="text-white">+244.00</span></p>
                  </div>
                  {isRecording && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-xl text-red-500 text-xs font-black uppercase tracking-widest animate-pulse">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      00:12:45
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Joystick Control Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div data-animate className="glass-card p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Gamepad2 size={80} />
               </div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg">
                     <Gamepad2 size={18} />
                  </div>
                  Base & Shoulder
                </h3>
              </div>
              
              <div className="flex justify-center py-4 relative z-10">
                <div
                  ref={joystick1ContainerRef}
                  className="relative w-48 h-48 rounded-full bg-slate-100/50 border-[4px] border-white shadow-xl flex items-center justify-center cursor-crosshair group"
                  onMouseMove={(e) => handleJoystickMove(e, joystick1ContainerRef, joystick1Ref)}
                  onMouseLeave={() => resetJoystick(joystick1Ref)}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="w-[1px] h-[80%] bg-slate-400"></div>
                    <div className="absolute w-[80%] h-[1px] bg-slate-400"></div>
                    <div className="absolute w-[75%] h-[75%] rounded-full border border-slate-300"></div>
                    <div className="absolute w-[25%] h-[25%] rounded-full border border-slate-300"></div>
                  </div>

                  <div
                    ref={joystick1Ref}
                    className="w-12 h-12 bg-slate-900 rounded-2xl shadow-xl shadow-slate-950/20 flex items-center justify-center transform-gpu hover:scale-105 transition-transform duration-300 cursor-grab active:cursor-grabbing"
                  >
                    <div className="w-1 h-1 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-6">
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Base</p>
                    <p className="text-sm font-black text-slate-800">42.5°</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Shoulder</p>
                    <p className="text-sm font-black text-slate-800">-12.8°</p>
                 </div>
              </div>
            </div>

            <div data-animate className="glass-card p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Gamepad2 size={80} />
               </div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                     <Gamepad2 size={18} />
                  </div>
                  Grip & Elbow
                </h3>
              </div>
              
              <div className="flex justify-center py-4 relative z-10">
                <div
                  ref={joystick2ContainerRef}
                  className="relative w-48 h-48 rounded-full bg-slate-100/50 border-[4px] border-white shadow-xl flex items-center justify-center cursor-crosshair group"
                  onMouseMove={(e) => handleJoystickMove(e, joystick2ContainerRef, joystick2Ref)}
                  onMouseLeave={() => resetJoystick(joystick2Ref)}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="w-[1px] h-[80%] bg-slate-400"></div>
                    <div className="absolute w-[80%] h-[1px] bg-slate-400"></div>
                    <div className="absolute w-[75%] h-[75%] rounded-full border border-slate-300"></div>
                    <div className="absolute w-[25%] h-[25%] rounded-full border border-slate-300"></div>
                  </div>

                  <div
                    ref={joystick2Ref}
                    className="w-12 h-12 bg-slate-900 rounded-2xl shadow-xl shadow-slate-950/20 flex items-center justify-center transform-gpu hover:scale-105 transition-transform duration-300 cursor-grab active:cursor-grabbing"
                  >
                    <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-6">
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Grip</p>
                    <p className="text-sm font-black text-slate-800">12.0mm</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Elbow</p>
                    <p className="text-sm font-black text-slate-800">45.0°</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div data-animate className="space-y-10">
          {/* Joint Parameters */}
          <div className="glass-card p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-4">
                <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-xl">
                   <Sliders size={24} />
                </div>
                Kinematics
              </h3>
              <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-brand-accent rounded-xl transition-all">
                <Settings2 size={18} />
              </button>
            </div>

            {/* Speed Control */}
            <div className="mb-12 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Torque Velocity</label>
                <span className="text-sm font-black text-brand-accent px-3 py-1 bg-white rounded-lg shadow-sm">{speed}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-accent shadow-inner"
              />
            </div>

            {/* Individual Joints */}
            <div className="space-y-10">
              {[
                { id: 'j1', label: 'Base Rotation', min: -180, max: 180, color: '#3b82f6' },
                { id: 'j2', label: 'Shoulder Pitch', min: -45, max: 135, color: '#8b5cf6' },
                { id: 'j3', label: 'Elbow Position', min: 0, max: 180, color: '#10b981' },
                { id: 'j4', label: 'Wrist Rotation', min: -180, max: 180, color: '#f59e0b' },
              ].map((joint) => (
                <div key={joint.id} className="group">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-brand-accent transition-colors">
                      {joint.label}
                    </label>
                    <span className="text-[10px] font-black bg-white border border-slate-100 px-3 py-1.5 rounded-lg text-slate-500 shadow-sm">
                      {joints[joint.id]}°
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min={joint.min}
                      max={joint.max}
                      value={joints[joint.id]}
                      onChange={(e) => handleJointChange(joint.id, parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-secondary transition-all"
                      style={{ accentColor: joint.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Matrix */}
            <div className="grid grid-cols-2 gap-4 mt-12 pt-10 border-t border-slate-100">
              <button className="flex items-center justify-center gap-3 px-6 py-4 bg-brand-accent text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-accent/20">
                <Zap size={14} /> Commit Sync
              </button>
              <button className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-600 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all hover:bg-slate-50 active:scale-95 shadow-sm">
                <RefreshCcw size={14} /> Reset Pose
              </button>
            </div>
          </div>

          {/* Pro Tip Card */}
          <div className="glass-card p-10 bg-slate-900 text-white border-none relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Zap size={160} />
             </div>
            <div className="relative z-10">
              <h4 className="font-black uppercase tracking-widest text-[10px] text-brand-accent mb-4">Protocol Note</h4>
              <p className="text-lg font-bold leading-relaxed text-white/90">
                Hold <span className="text-brand-accent px-2 py-0.5 bg-white/10 rounded-md">SHIFT</span> to lock axes during vector manipulation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
