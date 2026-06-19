import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  ScanFace, 
  HandMetal, 
  Mic, 
  Package, 
  ArrowRightLeft, 
  Power, 
  Settings, 
  Activity,
  CheckCircle2,
  AlertCircle,
  X,
  Camera,
  UserPlus,
  Save,
  Crosshair,
  Plus
} from 'lucide-react';
import gsap from 'gsap';

export function AITrainingPage() {
  const containerRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null); // 'face-rec' | 'gesture' | null
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const aiTasks = [
    {
      id: 'obj-detect',
      title: 'Object Detection',
      description: 'Real-time YOLOv8 bounding boxes for identifying tools and objects on the workbench.',
      icon: ScanFace,
      status: 'active',
      accuracy: '98.5%',
      latency: '24ms',
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50/50'
    },
    {
      id: 'face-rec',
      title: 'Face Recognition',
      description: 'Operator authentication and personalized workspace adjustments based on facial data.',
      icon: ScanFace,
      status: 'idle',
      accuracy: '95.2%',
      latency: '45ms',
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50/50',
      customAction: 'Register Face'
    },
    {
      id: 'gesture',
      title: 'Hand Gesture Controls',
      description: 'Teleoperate the robotic arm remotely using intuitive hand and finger tracking.',
      icon: HandMetal,
      status: 'active',
      accuracy: '92.1%',
      latency: '30ms',
      color: 'from-purple-500 to-fuchsia-600',
      bgLight: 'bg-purple-50/50',
      customAction: 'Configure Gestures'
    },
    {
      id: 'voice',
      title: 'Voice Commands',
      description: 'Natural language processing for hands-free robotic operations and macro executions.',
      icon: Mic,
      status: 'error',
      accuracy: '88.4%',
      latency: '120ms',
      color: 'from-orange-500 to-red-600',
      bgLight: 'bg-orange-50/50'
    },
    {
      id: 'pick-place',
      title: 'AI Pick & Place',
      description: 'Autonomous grasping and manipulation of complex objects using depth analysis.',
      icon: Package,
      status: 'idle',
      accuracy: '96.8%',
      latency: '85ms',
      color: 'from-brand-accent to-brand-secondary',
      bgLight: 'bg-brand-accent/5'
    },
    {
      id: 'sorting',
      title: 'Smart Sorting Assistant',
      description: 'Automated categorization and placement of mixed objects into designated bins.',
      icon: ArrowRightLeft,
      status: 'idle',
      accuracy: '94.0%',
      latency: '60ms',
      color: 'from-amber-400 to-orange-500',
      bgLight: 'bg-amber-50/50'
    }
  ];

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)' }
      );
    }
  }, []);

  const handleScanSimulation = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsScanning(false), 500);
      }
    }, 100);
  };

  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Active
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
            <AlertCircle size={12} /> Error
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
            <Activity size={12} /> Idle
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-accent/10 rounded-2xl text-brand-accent">
            <Brain size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Training & Inference</h1>
            <p className="text-slate-500 text-sm mt-1">Configure and monitor deep learning models powering robotic autonomy.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition shadow-sm text-sm">
            <Activity size={16} /> Global Logs
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-accent to-brand-secondary hover:opacity-90 text-white rounded-xl font-medium transition shadow-lg shadow-brand-accent/20 text-sm">
            <Power size={16} /> Start All
          </button>
        </div>
      </div>

      {/* AI Tasks Grid */}
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {aiTasks.map((task) => (
          <div key={task.id} className={`glass-card overflow-hidden group relative transition-all duration-300 hover:shadow-xl hover:shadow-brand-accent/5 ${task.status === 'active' ? 'border-brand-accent/30' : ''}`}>
            
            {/* Top gradient bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${task.color}`} />
            
            <div className={`p-6 ${task.bgLight}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-100 text-slate-700 group-hover:scale-110 transition-transform duration-300`}>
                  <task.icon size={24} />
                </div>
                <StatusBadge status={task.status} />
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{task.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 min-h-[40px]">
                {task.description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-200/50">
                <button 
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2
                    ${task.status === 'active' 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  <Power size={14} />
                  {task.status === 'active' ? 'Stop' : 'Start'}
                </button>
                
                {task.customAction ? (
                  <button 
                    onClick={() => setActiveModal(task.id)}
                    className="flex-[1.5] py-2 bg-white border border-slate-200 rounded-xl hover:bg-brand-accent hover:text-white hover:border-brand-accent text-slate-600 transition shadow-sm text-sm font-medium"
                  >
                    {task.customAction}
                  </button>
                ) : (
                  <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition shadow-sm">
                    <Settings size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activeModal === 'face-rec' ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'}`}>
                  {activeModal === 'face-rec' ? <ScanFace size={20} /> : <HandMetal size={20} />}
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  {activeModal === 'face-rec' ? 'Register Operator Face' : 'Hand Gesture Configuration'}
                </h2>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {activeModal === 'face-rec' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Camera Feed Side */}
                  <div className="relative aspect-square sm:aspect-video lg:aspect-square bg-slate-900 rounded-2xl overflow-hidden shadow-inner border-4 border-slate-800">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                      alt="Camera Feed" 
                      className={`w-full h-full object-cover transition-all duration-700 ${isScanning ? 'brightness-50 grayscale' : 'brightness-100'}`}
                    />
                    
                    {/* Face Detection Overlay (Mock) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className={`w-48 h-64 border-2 ${isScanning ? 'border-brand-accent animate-pulse' : 'border-white/50'} rounded-full relative transition-colors duration-300`}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 transition-opacity duration-300" style={{ opacity: isScanning ? 1 : 0 }}>
                          Analyzing 68 landmarks...
                        </div>
                        {/* Corner markers */}
                        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-brand-accent" />
                        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-brand-accent" />
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-brand-accent" />
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-brand-accent" />
                      </div>
                    </div>

                    {/* Scanner Line */}
                    {isScanning && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent/80 shadow-[0_0_15px_rgba(var(--brand-accent),0.8)]"
                           style={{ animation: 'scan 2s linear infinite' }}>
                        <style>{`@keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }`}</style>
                      </div>
                    )}
                  </div>

                  {/* Form Side */}
                  <div className="space-y-6 flex flex-col justify-center">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Operator Name</label>
                      <input type="text" placeholder="e.g., Jane Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Access Level</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all appearance-none">
                        <option>Level 1 - Basic Operator</option>
                        <option>Level 2 - Supervisor</option>
                        <option>Level 3 - Administrator</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      {isScanning ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-semibold text-slate-700">
                            <span>Extracting features...</span>
                            <span>{scanProgress}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-accent transition-all duration-200" style={{ width: `${scanProgress}%` }} />
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={handleScanSimulation}
                          className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                        >
                          <Camera size={20} /> Capture Face Data
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'gesture' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Gestures List */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-slate-800">Mapped Gestures</h3>
                      <button className="text-sm font-medium text-brand-accent hover:text-brand-secondary flex items-center gap-1 transition-colors">
                        <Plus size={16} /> Add New
                      </button>
                    </div>

                    {[
                      { gesture: '✌️ Peace Sign', action: 'Home Position', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                      { gesture: '✊ Closed Fist', action: 'Close Gripper', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                      { gesture: '🖐️ Open Palm', action: 'Open Gripper', color: 'bg-amber-50 text-amber-700 border-amber-100' },
                      { gesture: '🤏 Pinch', action: 'Precision Mode', color: 'bg-purple-50 text-purple-700 border-purple-100' },
                    ].map((item, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border ${item.color} flex items-center justify-between group hover:shadow-md transition-all`}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.gesture.split(' ')[0]}</span>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">{item.gesture.split(' ').slice(1).join(' ')}</p>
                            <p className="font-semibold">{item.action}</p>
                          </div>
                        </div>
                        <button className="p-2 bg-white/50 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all text-slate-600">
                          <Settings size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Camera Feed Side */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Crosshair size={18} className="text-brand-accent" />
                      <h3 className="font-bold text-slate-800">Live Tracker Preview</h3>
                    </div>
                    <div className="relative flex-1 bg-slate-900 rounded-xl overflow-hidden min-h-[300px]">
                      <img 
                        src="https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&q=80&w=800" 
                        alt="Hand Tracking" 
                        className="w-full h-full object-cover opacity-80"
                      />
                      {/* Tracking Overlay Mock */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Mock Skeleton lines */}
                        <polyline points="50,90 45,60 30,40 20,20" fill="none" stroke="#00f2fe" strokeWidth="0.5" className="animate-pulse" />
                        <polyline points="45,60 40,30 35,10" fill="none" stroke="#00f2fe" strokeWidth="0.5" className="animate-pulse" />
                        <polyline points="45,60 55,30 60,10" fill="none" stroke="#00f2fe" strokeWidth="0.5" className="animate-pulse" />
                        <polyline points="45,60 70,40 80,25" fill="none" stroke="#00f2fe" strokeWidth="0.5" className="animate-pulse" />
                        {/* Joints */}
                        {[
                          [50,90], [45,60], [30,40], [20,20],
                          [40,30], [35,10], [55,30], [60,10],
                          [70,40], [80,25]
                        ].map((point, i) => (
                          <circle key={i} cx={point[0]} cy={point[1]} r="1.5" fill="#4facfe" />
                        ))}
                      </svg>
                      
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                        <span className="text-white text-xs font-medium">Confidence: 94%</span>
                        <span className="text-emerald-400 text-sm font-bold tracking-wider">🖐️ OPEN PALM</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 rounded-xl font-semibold bg-brand-accent hover:bg-brand-secondary text-white shadow-lg shadow-brand-accent/20 transition-all flex items-center gap-2">
                <Save size={18} /> Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
