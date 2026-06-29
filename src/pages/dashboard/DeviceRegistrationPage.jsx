import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import api from '../../api/axiosInstance';
import { useRobotWebSocket } from '../../hooks/useRobotWebSocket';
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
  Search,
  Edit2
} from 'lucide-react';

export function DeviceRegistrationPage() {
  const [devices, setDevices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    robotId: '',
    serialNumber: '',
  });
  const [error, setError] = useState(null);
  
  // Details Modal State
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [deviceToRemove, setDeviceToRemove] = useState(null);

  const contentRef = useRef(null);

  useRobotWebSocket((message) => {
    console.log('[WS Update] DeviceRegistrationPage:', message);
    setDevices((prevDevices) => 
      prevDevices.map((device) => {
        if (device.robot_id === message.robotId) {
          return {
            ...device,
            status: message.status,
            firmware_version: message.firmware || device.firmware_version,
            last_seen: new Date().toISOString()
          };
        }
        return device;
      })
    );
    
    setSelectedDevice((prevSelected) => {
      if (prevSelected && prevSelected.robot_id === message.robotId) {
        return {
          ...prevSelected,
          status: message.status,
          firmware_version: message.firmware || prevSelected.firmware_version,
          last_seen: new Date().toISOString()
        };
      }
      return prevSelected;
    });
  });

  const fetchDevices = async () => {
    try {
      const response = await api.get('/robots');
      setDevices(response.data);
    } catch (err) {
      console.error('Failed to fetch devices', err);
    }
  };

  useEffect(() => {
    fetchDevices();
    const elements = contentRef.current?.querySelectorAll('[data-animate]');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  const handleAddDevice = async () => {
    setError(null);
    if (formData.robotId && formData.serialNumber) {
      try {
        await api.post('/robots/pair', {
          robotId: formData.robotId,
          serialKey: formData.serialNumber
        });
        setFormData({ robotId: '', serialNumber: '' });
        setShowForm(false);
        fetchDevices();
      } catch (err) {
        console.error('Failed to register asset', err);
        setError(err.response?.data?.message || 'Failed to register asset');
      }
    } else {
      setError('Robot ID and Serial Key are required');
    }
  };

  const handleRemoveDevice = (device) => {
    setDeviceToRemove(device);
  };

  const confirmRemoveDevice = async () => {
    if (!deviceToRemove) return;
    try {
      await api.delete(`/robots/${deviceToRemove.id}`);
      fetchDevices();
    } catch (err) {
      console.error('Failed to remove asset', err);
    } finally {
      setDeviceToRemove(null);
    }
  };

  const openDetailsModal = (device) => {
    setSelectedDevice(device);
    setEditingName(device.name || '');
    setShowDetailsModal(true);
  };

  const handleUpdateName = async () => {
    if (!selectedDevice || !editingName.trim()) return;
    setIsUpdating(true);
    try {
      await api.patch(`/robots/${selectedDevice.id}`, { name: editingName.trim() });
      setShowDetailsModal(false);
      fetchDevices();
    } catch (err) {
      console.error('Failed to update name', err);
    } finally {
      setIsUpdating(false);
    }
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
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Details Modal */}
      {showDetailsModal && selectedDevice && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-lg p-8 space-y-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">Robot Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Editable Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Robot Name</label>
                <div className="flex items-center gap-2">
                  <div className="relative group flex-1">
                    <Edit2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-accent" size={18} />
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-medium"
                    />
                  </div>
                  <button
                    onClick={handleUpdateName}
                    disabled={isUpdating || editingName === selectedDevice.name || !editingName.trim()}
                    className="px-6 py-3.5 bg-brand-accent text-white font-bold rounded-2xl shadow-lg shadow-brand-accent/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Read Only Stats */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Robot ID</label>
                  <div className="text-sm font-mono font-medium text-slate-700">{selectedDevice.robot_id}</div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Firmware</label>
                  <div className="text-sm font-mono font-medium text-slate-700">{selectedDevice.firmware_version || 'Unknown'}</div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Model</label>
                  <div className="text-sm font-medium text-slate-700">{selectedDevice.model || 'Unknown'}</div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Status</label>
                  <div className="text-sm font-medium text-slate-700">{selectedDevice.status || 'Offline'}</div>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Last Seen</label>
                  <div className="text-sm font-medium text-slate-700">{selectedDevice.last_seen ? new Date(selectedDevice.last_seen).toLocaleString() : 'Never'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal Overlay */}
      {deviceToRemove && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-sm p-8 space-y-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Unpair Robot?</h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to remove <span className="font-bold text-slate-700">{deviceToRemove.name || deviceToRemove.robot_id}</span> from your fleet? This action cannot be undone.
            </p>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setDeviceToRemove(null)}
                className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveDevice}
                className="flex-1 px-6 py-3.5 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
              >
                Unpair
              </button>
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
                    <h3 className="text-xl font-bold tracking-tight">{device.name || `Robot Asset ${device.robot_id}`}</h3>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      device.status?.toLowerCase() === 'online' || device.status?.toLowerCase() === 'active'
                        ? 'bg-brand-success/10 border-brand-success/20 text-brand-success'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      {(device.status?.toLowerCase() === 'online' || device.status?.toLowerCase() === 'active') ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {device.status || 'Offline'}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <ShieldCheck size={14} className="text-brand-accent/60" />
                      ID: <span className="text-slate-600 font-mono">{device.robot_id}</span>
                    </div>
                    {device.firmware_version && (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Binary size={14} className="text-brand-secondary/60" />
                        FW: <span className="text-slate-600 font-mono">{device.firmware_version}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Clock size={14} />
                      Last Sync: <span className="text-slate-600">{device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100  pt-6 md:pt-0 md:pl-8">
                <button 
                  onClick={() => openDetailsModal(device)}
                  className="flex-1 md:flex-none px-6 py-2.5 bg-slate-50  hover:bg-brand-accent/10 hover:text-brand-accent rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                  Details
                </button>
                <button
                  onClick={() => handleRemoveDevice(device)}
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

