import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  ListTodo, 
  Settings,
  Sparkles,
  Command
} from 'lucide-react';

export function TaskSchedulerPage() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Initial Scan & Calibrate', action: 'calibrate', status: 'Pending' },
    { id: 2, name: 'Fetch SKU-284 Container', action: 'move', status: 'Pending' },
    { id: 3, name: 'Precision Grip Action', action: 'grip', status: 'Pending' },
    { id: 4, name: 'Deposit at Station B', action: 'move', status: 'Pending' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [isRunning, setIsRunning] = useState(false);
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

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        name: newTask,
        action: 'custom',
        status: 'Pending',
      }]);
      setNewTask('');
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const moveTask = (id, direction) => {
    const idx = tasks.findIndex((t) => t.id === id);
    if ((direction === 'up' && idx > 0) || (direction === 'down' && idx < tasks.length - 1)) {
      const newTasks = [...tasks];
      const swap = direction === 'up' ? idx - 1 : idx + 1;
      [newTasks[idx], newTasks[swap]] = [newTasks[swap], newTasks[idx]];
      setTasks(newTasks);
    }
  };

  return (
    <div ref={contentRef} className="space-y-10 pb-10">
      {/* Header */}
      <div data-animate className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Task Sequence</h1>
          <p className="text-slate-500  mt-1 font-medium">
            Automate complex multi-step operations
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-[0.98] shadow-lg ${
              isRunning
                ? 'bg-red-500 text-white shadow-red-500/20'
                : 'bg-brand-success text-white shadow-brand-success/20'
            }`}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            {isRunning ? 'Halt Execution' : 'Execute Sequence'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sequence Builder Sidebar */}
        <div data-animate className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Plus size={14} /> New Instruction
            </h3>
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Task name..."
                  className="w-full pl-4 pr-10 py-3 bg-slate-50  border border-slate-200  rounded-xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-medium"
                />
                <button 
                  onClick={addTask}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brand-accent text-white rounded-lg hover:scale-105 transition-transform"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Templates</p>
                {[
                  { name: 'Scan & Pick', icon: Sparkles },
                  { name: 'Safety Reset', icon: Settings },
                  { name: 'Cycle Test', icon: Command }
                ].map((template) => (
                  <button
                    key={template.name}
                    onClick={() => setNewTask(template.name)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-100  hover:bg-slate-50  transition-all text-slate-600 "
                  >
                    <template.icon size={14} className="text-brand-accent" />
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">System Notice</p>
            <p className="text-xs leading-relaxed opacity-80">
              Recursive sequences are limited to 50 iterations to prevent mechanical fatigue.
            </p>
          </div>
        </div>

        {/* Task Queue Main */}
        <div data-animate className="lg:col-span-3">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-slate-100  flex items-center justify-between bg-slate-50/50 ">
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-3">
                <ListTodo className="text-brand-accent" /> Instruction Stack
              </h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-brand-accent/10 text-brand-accent text-[10px] font-black uppercase rounded-full">
                  Loop: Off
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 ">
              {tasks.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center opacity-30">
                  <ListTodo size={48} className="mb-4" />
                  <p className="font-bold uppercase tracking-widest text-xs">No active instructions</p>
                </div>
              ) : (
                tasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className="group p-6 flex items-center justify-between hover:bg-slate-50/50  transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => moveTask(task.id, 'up')}
                          disabled={idx === 0}
                          className="hover:text-brand-accent disabled:opacity-0 transition-colors"
                        >
                          <ChevronUp size={20} />
                        </button>
                        <button 
                          onClick={() => moveTask(task.id, 'down')}
                          disabled={idx === tasks.length - 1}
                          className="hover:text-brand-accent disabled:opacity-0 transition-colors"
                        >
                          <ChevronDown size={20} />
                        </button>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-slate-100  rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500">
                            {idx + 1}
                          </span>
                          <p className="font-bold text-slate-800 ">{task.name}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-9">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{task.action}</span>
                          <span className="w-1 h-1 bg-slate-300  rounded-full"></span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-slate-300  rounded-full"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeTask(task.id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50  rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {tasks.length > 0 && (
              <div className="p-6 bg-slate-50/50  border-t border-slate-100  flex justify-center">
                <button className="text-xs font-black uppercase tracking-widest text-brand-accent hover:underline">
                  Clear All Instructions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

