import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { 
  Plus, 
  Trash2, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Tag, 
  Binary, 
  Clock,
  ShieldCheck,
  Search
} from 'lucide-react';

export function DeviceRegistrationPage() {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'Main Arm - Fabrication Alpha',
      robotId: 'GRB-001-A',
      serialNumber: 'SN-2026-X100',
      status: 'Active',
      lastSeen: '2m ago',
    },
    {
      id: 2,
      name: 'Auxiliary Grip - Testing B',
      robotId: 'GRB-002-T',
      serialNumber: 'SN-2026-X102',
      status: 'Inactive',
      lastSeen: '14h ago',
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    robotId: '',
    serialNumber: '',
  });
  const contentRef = useRef(null);

  useEffect(() => {
    const elements = contentRef.current?.querySelectorAll('[data-animate]');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  const handleAddDevice = () => {
    if (formData.name && formData.robotId && formData.serialNumber) {
      setDevices([...devices, {
        id: Date.now(),
        ...formData,
        status: 'Active',
        lastSeen: 'Just now',
      }]);
      setFormData({ name: '', robotId: '', serialNumber: '' });
      setShowForm(false);
    }
  };

  const handleRemoveDevice = (id) => {
    setDevices(devices.filter((d) => d.id !== id));
  };

  return (
    <div ref={contentRef} className="max-w-5xl mx-auto space-y-10 pb-10">
      {/* Header */}
      <div data-animate className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Fleet Inventory</h1>
          <p className="text-slate-500  mt-1 font-medium">
            Authorized robotic assets and hardware authentication
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter assets..." 
              className="pl-10 pr-4 py-2.5 bg-white  border border-slate-200  rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-brand-accent text-white font-bold rounded-2xl shadow-lg shadow-brand-accent/20 flex items-center gap-3 hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Register Asset</span>
          </button>
        </div>
      </div>

      {/* Registration Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div data-animate className="glass-card w-full max-w-lg p-8 space-y-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">Device Credentials</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100  rounded-xl transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Designation</label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-accent" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Primary Fabrication Unit"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50  border border-slate-200  rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Robot ID</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-accent" size={18} />
                    <input
                      type="text"
                      value={formData.robotId}
                      onChange={(e) => setFormData({ ...formData, robotId: e.target.value })}
                      placeholder="GRB-001"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50  border border-slate-200  rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Serial Hex</label>
                  <div className="relative group">
                    <Binary className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-accent" size={18} />
                    <input
                      type="text"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      placeholder="SN-X400"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50  border border-slate-200  rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={handleAddDevice}
                  className="flex-1 py-4 bg-brand-accent text-white font-bold rounded-2xl shadow-lg shadow-brand-accent/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
                >
                  Confirm Registration
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-4 bg-slate-100  text-slate-600  font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Abort
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Grid */}
      <div data-animate className="grid grid-cols-1 gap-6">
        {devices.length === 0 ? (
          <div className="glass-card py-20 flex flex-col items-center justify-center opacity-30">
            <Cpu size={64} className="mb-4" />
            <p className="font-bold uppercase tracking-widest text-sm">No Hardware Authenticated</p>
          </div>
        ) : (
          devices.map((device) => (
            <div
              key={device.id}
              className="glass-card group p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-brand-accent/30 transition-all duration-300"
            >
              <div className="flex items-center gap-6">
                <div className={`p-5 rounded-3xl bg-slate-100  group-hover:scale-110 transition-transform ${device.status === 'Active' ? 'text-brand-success' : 'text-slate-400'}`}>
                  <Cpu size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-bold tracking-tight">{device.name}</h3>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      device.status === 'Active'
                        ? 'bg-brand-success/10 border-brand-success/20 text-brand-success'
                        : 'bg-slate-100 border-slate-200   text-slate-500'
                    }`}>
                      {device.status === 'Active' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {device.status}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <ShieldCheck size={14} className="text-brand-accent/60" />
                      ID: <span className="text-slate-600  font-mono">{device.robotId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Binary size={14} className="text-brand-secondary/60" />
                      SN: <span className="text-slate-600  font-mono">{device.serialNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Clock size={14} />
                      Last Sync: <span className="text-slate-600 ">{device.lastSeen}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100  pt-6 md:pt-0 md:pl-8">
                <button className="flex-1 md:flex-none px-6 py-2.5 bg-slate-50  hover:bg-brand-accent/10 hover:text-brand-accent rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                  Diagnostic
                </button>
                <button
                  onClick={() => handleRemoveDevice(device.id)}
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50  rounded-xl transition-all"
                  title="Remove device"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div data-animate className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
        <ShieldCheck size={12} /> Secure Hardware-Level Authentication Enforced
      </div>
    </div>
  );
}

