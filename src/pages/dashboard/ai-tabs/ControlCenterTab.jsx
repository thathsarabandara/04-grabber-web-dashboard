import React from 'react';
import { 
  Cpu, 
  Power, 
  Settings, 
  UserPlus, 
  Activity,
  ScanFace,
  Square,
  Play
} from 'lucide-react';

export function ControlCenterTab({
  tasks,
  handleToggleTask,
  setActiveTab,
  colorMap,
  iconMap,
  taskDescriptions
}) {
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
      default:
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
            <Activity size={12} /> Idle
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const Icon = iconMap[task.id] || ScanFace;
          const colors = colorMap[task.id] || { gradient: 'from-blue-500 to-indigo-600', lightBg: 'bg-blue-50/50' };
          const customAction = null;
          
          return (
            <div key={task.id} className={`glass-card overflow-hidden group relative transition-all duration-300 hover:shadow-xl hover:shadow-brand-accent/5 ${task.status === 'active' ? 'border-brand-accent/30' : ''}`}>
              <div className={`h-1.5 w-full bg-gradient-to-r ${colors.gradient}`} />
              
              <div className={`p-6 ${colors.lightBg}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100 text-slate-700 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} />
                  </div>
                  <StatusBadge status={task.status} />
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2">{task.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 min-h-[40px]">
                  {taskDescriptions[task.id] || task.title}
                </p>

                {/* Performance HUD */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-xs border-t border-slate-200/50 pt-4">
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Model Precision</span>
                    <span className="text-slate-800 font-black text-sm">{task.accuracy}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">CPU Latency</span>
                    <span className="text-slate-800 font-black text-sm">{task.latency}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-200/50">
                  <button 
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2
                      ${task.status === 'active' 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' 
                        : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    <Power size={14} />
                    {task.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  {customAction ? (
                    <button 
                      onClick={() => {
                        setActiveTab('face-rec');
                        setActiveModal('face-rec');
                      }}
                      className="flex-[1.4] py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-brand-accent hover:text-white hover:border-brand-accent text-slate-700 transition shadow-sm text-sm font-medium flex items-center justify-center gap-1.5"
                    >
                      <UserPlus size={14} /> {customAction}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setActiveTab(task.id)}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition shadow-sm"
                    >
                      <Settings size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
