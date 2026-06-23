import React, { useEffect } from 'react';
import { 
  Package, 
  Sliders, 
  Maximize2, 
  Activity,
  PlayCircle,
  Settings
} from 'lucide-react';
import api from '../../../api/axiosInstance';

export function PickPlaceTab({
  selectionRule,
  setSelectionRule,
  graspForces,
  setGraspForces,
  workspaceCoords,
  setWorkspaceCoords,
  pickStrategy,
  setPickStrategy,
  isSimulatingPick,
  setIsSimulatingPick,
  pickCanvasRef,
  setActiveTab
}) {

  const [simulationLogs, setSimulationLogs] = React.useState([
    "[10:15:32] CMD: PICK target_id=Cube_01",
    "[10:15:33] IK_SOLVER: theta=[45, 90, -12, 0]",
    "[10:15:35] GRIP: pressure_sensor=Medium",
    "[10:15:36] CMD: DROP target_id=Bin_Red",
    "[10:15:38] IK_SOLVER: theta=[0, 30, 10, 0]",
    "[10:15:39] Pick success. Cycle time 7.2s"
  ]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/ai/pick-place/settings');
        setSelectionRule(res.data.settings.selection_rule);
        setPickStrategy(res.data.settings.pick_strategy);
        setWorkspaceCoords({
          pickMinX: res.data.settings.pick_min_x,
          pickMaxX: res.data.settings.pick_max_x,
          dropMinX: res.data.settings.drop_min_x,
          dropMaxX: res.data.settings.drop_max_x
        });
        setGraspForces(res.data.grasp_forces);
      } catch (err) {
        console.error("Failed to load pick & place settings", err);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async (updates) => {
    try {
      const payload = {
        selection_rule: updates.selectionRule !== undefined ? updates.selectionRule : selectionRule,
        pick_strategy: updates.pickStrategy !== undefined ? updates.pickStrategy : pickStrategy,
        pick_min_x: updates.workspaceCoords !== undefined ? updates.workspaceCoords.pickMinX : workspaceCoords.pickMinX,
        pick_max_x: updates.workspaceCoords !== undefined ? updates.workspaceCoords.pickMaxX : workspaceCoords.pickMaxX,
        drop_min_x: updates.workspaceCoords !== undefined ? updates.workspaceCoords.dropMinX : workspaceCoords.dropMinX,
        drop_max_x: updates.workspaceCoords !== undefined ? updates.workspaceCoords.dropMaxX : workspaceCoords.dropMaxX,
        grasp_forces: updates.graspForces !== undefined ? updates.graspForces : graspForces
      };
      const res = await api.post('/ai/pick-place/settings', payload);
      setSelectionRule(res.data.settings.selection_rule);
      setPickStrategy(res.data.settings.pick_strategy);
      setWorkspaceCoords({
        pickMinX: res.data.settings.pick_min_x,
        pickMaxX: res.data.settings.pick_max_x,
        dropMinX: res.data.settings.drop_min_x,
        dropMaxX: res.data.settings.drop_max_x
      });
      setGraspForces(res.data.grasp_forces);
    } catch (err) {
      console.error("Failed to save pick & place settings", err);
    }
  };

  const updateSelectionRule = (rule) => {
    setSelectionRule(rule);
    saveSettings({ selectionRule: rule });
  };

  const updatePickStrategy = (strat) => {
    setPickStrategy(strat);
    saveSettings({ pickStrategy: strat });
  };

  const updateWorkspaceCoord = (coord, val) => {
    const updated = { ...workspaceCoords, [coord]: val };
    setWorkspaceCoords(updated);
    saveSettings({ workspaceCoords: updated });
  };

  const updateGraspForce = (obj, force) => {
    const updated = { ...graspForces, [obj]: force };
    setGraspForces(updated);
    saveSettings({ graspForces: updated });
  };

  // 2D Pick Animation Simulation using kinematic coordinate steps from backend
  const handlePickSimulation = async () => {
    if (isSimulatingPick) return;
    setIsSimulatingPick(true);
    const canvas = pickCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const res = await api.post('/ai/pick-place/simulate');
      const pathCoords = res.data.path_coords;
      setSimulationLogs(res.data.log_entries);

      let frame = 0;
      const animate = () => {
        if (frame >= pathCoords.length) {
          setIsSimulatingPick(false);
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw workbench floor
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 200, canvas.width, 20);
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(0, 200, canvas.width, 1);

        // Draw Pick zone
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.fillRect(60, 140, 80, 60);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        ctx.strokeRect(60, 140, 80, 60);

        // Draw Drop zone
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        ctx.fillRect(320, 140, 80, 60);
        ctx.strokeStyle = '#10b981';
        ctx.strokeRect(320, 140, 80, 60);

        const currentFrameData = pathCoords[frame];
        const armX = currentFrameData.armX;
        const armY = currentFrameData.armY;
        const objX = currentFrameData.objX;
        const objY = currentFrameData.objY;

        // Draw object
        if (frame < 100) {
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(objX - 10, objY - 10, 20, 20);
        } else {
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(330, 180, 20, 20);
        }

        // Draw robot arm links
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(220, 30); // base shoulder
        ctx.lineTo(armX, armY - 30); // elbow joint
        ctx.lineTo(armX, armY); // gripper endpoint
        ctx.stroke();

        // Draw gripper claws
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(armX - 10, armY);
        ctx.lineTo(armX - 5, armY + 8);
        ctx.moveTo(armX + 10, armY);
        ctx.lineTo(armX + 5, armY + 8);
        ctx.stroke();

        frame++;
        requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
    } catch (err) {
      console.error("Failed to run pick & place animation simulation", err);
      setIsSimulatingPick(false);
    }
  };

  // Draw initial state of simulation
  useEffect(() => {
    const canvas = pickCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 200, canvas.width, 20);
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(90, 180, 20, 20);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(220, 30);
      ctx.lineTo(100, 70);
      ctx.lineTo(100, 100);
      ctx.stroke();
    }
  }, [pickCanvasRef]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Module Configuration</span>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">🎯 AI Pick & Place</h2>
        </div>
        <button 
          onClick={() => setActiveTab('control-center')}
          className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-semibold"
        >
          ← Back to Control Center
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats list */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Success Rate</span>
              <span className="block text-sm font-bold text-emerald-600 mt-1">96.8%</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Objects Picked</span>
              <span className="block text-sm font-bold text-slate-800 mt-1">148</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Failed Picks</span>
              <span className="block text-sm font-bold text-red-500 mt-1">5</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Pick Time</span>
              <span className="block text-sm font-bold text-slate-800 mt-1">4.2s</span>
            </div>
          </div>

          {/* Target Select rules */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sliders size={18} className="text-blue-500" /> Object Selection Rules
            </h3>
            <p className="text-xs text-slate-400 mb-6">Configure criteria model uses to lock onto the target object first.</p>

            <div className="grid grid-cols-2 gap-3">
              {['Highest Confidence', 'Nearest Center', 'Specific Class', 'Highest Priority'].map(rule => (
                <label key={rule} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-slate-50 transition ${selectionRule === rule ? 'border-blue-600 bg-blue-50/10' : 'border-slate-100'}`}>
                  <input 
                    type="radio"
                    name="selRule"
                    checked={selectionRule === rule}
                    onChange={() => updateSelectionRule(rule)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-700">{rule}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Grasp Configs */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Settings size={18} className="text-blue-500" /> Grasp Pressure Configurations
            </h3>
            <p className="text-xs text-slate-400 mb-6">Select optimal gripping power thresholds per object class type to safeguard fragile objects.</p>

            <div className="space-y-4">
              {Object.entries(graspForces).map(([obj, force]) => (
                <div key={obj} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-bold text-slate-700 capitalize">{obj}</span>
                  <div className="flex gap-1.5">
                    {['Low', 'Medium', 'High'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => updateGraspForce(obj, opt)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black border transition ${force === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2D Interactive Simulation Preview */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-slate-800">Kinematic Pathway Simulation</h3>
                <p className="text-xs text-slate-400 mt-0.5">Preview motion trajectories before executing arm commands.</p>
              </div>
              <button 
                onClick={handlePickSimulation}
                disabled={isSimulatingPick}
                className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 rounded-xl text-xs font-black shadow flex items-center gap-1.5"
              >
                <PlayCircle size={14} /> {isSimulatingPick ? 'Simulating...' : 'Preview Pick Path'}
              </button>
            </div>

            <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex justify-center items-center py-4">
              <canvas 
                ref={pickCanvasRef}
                width={440}
                height={220}
                className="bg-white rounded-xl shadow-inner border border-slate-200" 
              />
            </div>
          </div>

        </div>

        <div className="space-y-6">
          
          {/* Workspace Coordinate validation inputs */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Maximize2 size={18} className="text-blue-500" /> Physical Workzone Bounds
            </h3>
            <p className="text-xs text-slate-500 mb-6">Enforce bounding coordinates to prevent collision accidents.</p>

            <div className="space-y-4">
              {Object.entries(workspaceCoords).map(([coord, val]) => (
                <div key={coord} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-black text-slate-600 uppercase">{coord.replace('Min', ' Min').replace('Max', ' Max')}</span>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      value={val}
                      onChange={(e) => updateWorkspaceCoord(coord, parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 bg-white border border-slate-200 rounded text-right text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-400 font-bold">mm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grab strategy radio configs */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sliders size={18} className="text-blue-500" /> Approach Angle Strategy
            </h3>
            <p className="text-xs text-slate-500 mb-4">Coordinate strategy used by inverse kinematics solver:</p>

            <div className="space-y-2.5">
              {['Top-Down Vertical', 'Angular Side Reach', 'Slanted Slide-In'].map(str => (
                <label key={str} className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer hover:bg-slate-50 transition ${pickStrategy === str ? 'border-blue-600 bg-blue-50/10' : 'border-slate-100'}`}>
                  <input 
                    type="radio"
                    name="approachStrategyRadio"
                    checked={pickStrategy === str}
                    onChange={() => updatePickStrategy(str)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-700">{str}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Coordinates log */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" /> Motion Coordinates Log
            </h3>
            
            <div className="font-mono text-[10px] text-slate-500 space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {simulationLogs.map((log, idx) => (
                <div key={idx} className={log.includes('success') ? "text-emerald-600 font-bold" : ""}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
