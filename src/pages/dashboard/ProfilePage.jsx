import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  ShieldAlert, 
  LogOut,
  ChevronRight,
  Clock,
  ShieldCheck,
  Cpu,
  Settings
} from 'lucide-react';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'Thathsara',
    lastName: 'Bandara',
    email: 'thathsara@grabber-x.io',
    phone: '+94 77 123 4567',
    image: null,
    role: 'Senior System Operator',
    joinedDate: 'Jan 2026'
  });
  const [editData, setEditData] = useState(profile);
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

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  return (
    <div ref={contentRef} className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div data-animate className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
              <User size={12} /> Account Management
           </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Operator Identity</h1>
          <p className="text-lg text-slate-500 mt-2 font-medium max-w-xl">
            Configure system access protocols and personal credentials.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-red-100 text-red-500 hover:bg-red-50 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm">
          <LogOut size={16} /> Terminate Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Profile Sidebar */}
        <div data-animate className="lg:col-span-4 space-y-8">
          <div className="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-accent to-brand-secondary"></div>
            <div className="relative group mb-8">
              <div className="w-40 h-40 rounded-[40px] bg-slate-50 flex items-center justify-center text-slate-300 shadow-inner overflow-hidden border-4 border-white">
                {profile.image ? (
                  <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                     <User size={80} className="opacity-20" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-3 bg-slate-900 rounded-2xl text-white shadow-2xl border-4 border-white cursor-pointer hover:scale-110 transition-all duration-300">
                <Camera size={20} />
                <input type="file" hidden accept="image/*" />
              </label>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profile.firstName} {profile.lastName}</h2>
            <div className="mt-2 px-4 py-1 bg-brand-accent/5 rounded-full inline-block">
               <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent">{profile.role}</p>
            </div>
            
            <div className="w-full mt-10 pt-10 border-t border-slate-50 space-y-5">
              <div className="flex items-center justify-between text-xs p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                <span className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Operator ID</span>
                <span className="font-mono font-black text-slate-800">OP-482-X</span>
              </div>
              <div className="flex items-center justify-between text-xs p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                <span className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Clearance</span>
                <div className="flex items-center gap-2 text-emerald-600">
                   <ShieldCheck size={14} />
                   <span className="font-black">LEVEL 4</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 flex items-center gap-6 bg-slate-900 text-white border-none shadow-xl shadow-slate-900/10">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-accent">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Total System Time</p>
              <p className="text-xl font-black">1,248 Hours</p>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div data-animate className="lg:col-span-8 space-y-10">
          <div className="glass-card p-10">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-4">
                 <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                    <Settings size={24} />
                 </div>
                 Core Identity
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 text-white bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20"
                >
                  <Edit3 size={14} /> Modify
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                  >
                    <Save size={14} /> Commit
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    <X size={14} /> Abort
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                <input
                  type="text"
                  value={isEditing ? editData.firstName : profile.firstName}
                  onChange={(e) => isEditing && setEditData({ ...editData, firstName: e.target.value })}
                  readOnly={!isEditing}
                  className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-black text-slate-800 disabled:opacity-70"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                <input
                  type="text"
                  value={isEditing ? editData.lastName : profile.lastName}
                  onChange={(e) => isEditing && setEditData({ ...editData, lastName: e.target.value })}
                  readOnly={!isEditing}
                  className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-black text-slate-800 disabled:opacity-70"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                  <Mail size={12} /> Contact Email
                </label>
                <input
                  type="email"
                  value={isEditing ? editData.email : profile.email}
                  onChange={(e) => isEditing && setEditData({ ...editData, email: e.target.value })}
                  readOnly={!isEditing}
                  className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-black text-slate-800 disabled:opacity-70"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                  <Phone size={12} /> Comm Line
                </label>
                <input
                  type="tel"
                  value={isEditing ? editData.phone : profile.phone}
                  onChange={(e) => isEditing && setEditData({ ...editData, phone: e.target.value })}
                  readOnly={!isEditing}
                  className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-black text-slate-800 disabled:opacity-70"
                />
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-400">
                  <ShieldCheck size={18} />
                </div>
                <div>
                   <p className="text-[11px] font-black uppercase tracking-widest text-slate-900">Security Keys</p>
                   <p className="text-xs font-medium text-slate-500">MFA & Hardware authentication</p>
                </div>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-brand-accent hover:underline decoration-2 underline-offset-4">Manage Access</button>
            </div>
          </div>

          <div className="glass-card p-10 bg-red-50 border-red-100">
            <h3 className="text-2xl font-black tracking-tight text-red-600 flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                 <ShieldAlert size={24} />
              </div>
              System Purge
            </h3>
            <p className="text-base text-red-900/60 mb-8 font-medium leading-relaxed max-w-2xl">
              Permanently terminate your operator session and purge all kinematic history and neural logs from the central core. This action cannot be reversed.
            </p>
            <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-95">
              Initiate Account Purge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
