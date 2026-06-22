import React from 'react';
import { 
  HandMetal, 
  Sliders, 
  Activity, 
  Plus, 
  Trash2,
  Lock,
  PlayCircle
} from 'lucide-react';

export function GestureControlTab({
  gestureMappings,
  setGestureMappings,
  gestureSafetyEnabled,
  setGestureSafetyEnabled,
  gestureControlEnabled,
  setGestureControlEnabled,
  gestureWizardStep,
  setGestureWizardStep,
  newGestureName,
  setNewGestureName,
  setGestureSafetyConfirmOpen,
  setPendingGestureAction,
  setActiveTab
}) {

  const startGestureTraining = () => {
    setGestureWizardStep(1);
    setTimeout(() => setGestureWizardStep(2), 1500);
    setTimeout(() => setGestureWizardStep(3), 3000);
    setTimeout(() => setGestureWizardStep(4), 4500);
  };

  const handleGestureControlToggle = (enable) => {
    if (enable && gestureSafetyEnabled) {
      setPendingGestureAction(true);
      setGestureSafetyConfirmOpen(true);
    } else {
      setGestureControlEnabled(enable);
    }
  };

  const removeGesture = (gesture) => {
    const updated = { ...gestureMappings };
    delete updated[gesture];
    setGestureMappings(updated);
  };

  const addCustomGesture = (e) => {
    e.preventDefault();
    if (!newGestureName.trim()) return;
    setGestureMappings({
      ...gestureMappings,
      [newGestureName]: 'UNASSIGNED'
    });
    setNewGestureName('');
  };

  const updateGestureAction = (gesture, action) => {
    setGestureMappings({
      ...gestureMappings,
      [gesture]: action
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-500">Module Configuration</span>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">✋ Hand Gesture Control</h2>
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
          
          {/* Dashboard stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Model Status</span>
              <span className="block text-sm font-bold text-slate-800 mt-1">MediaPipe Hands</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
              <span className="block text-sm font-bold text-emerald-600 mt-1">92.1%</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Gestures</span>
              <span className="block text-sm font-bold text-slate-800 mt-1">{Object.keys(gestureMappings).length} Gestures</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telemetry Link</span>
              <span className="block text-xs font-bold text-emerald-600 mt-1">Active</span>
            </div>
          </div>

          {/* Mappings */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sliders size={18} className="text-purple-500" /> Gesture Action Mappings
            </h3>
            <p className="text-xs text-slate-400 mb-6">Map recognized hand poses to robot motion macros.</p>

            <div className="space-y-3 mb-6">
              {Object.entries(gestureMappings).map(([gesture, action]) => (
                <div key={gesture} className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs">
                  <span className="font-bold text-slate-800 flex-1">{gesture}</span>
                  
                  <select 
                    value={action}
                    onChange={(e) => updateGestureAction(gesture, e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-700 outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="UNASSIGNED">UNASSIGNED</option>
                    <option value="STOP">STOP (Emergency)</option>
                    <option value="CLOSE GRIPPER">CLOSE GRIPPER</option>
                    <option value="OPEN GRIPPER">OPEN GRIPPER</option>
                    <option value="HOME POSITION">HOME POSITION</option>
                    <option value="MOVE LEFT">MOVE LEFT</option>
                    <option value="MOVE RIGHT">MOVE RIGHT</option>
                    <option value="PICK AND PLACE">PICK AND PLACE</option>
                  </select>

                  <button 
                    onClick={() => removeGesture(gesture)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom gesture builder */}
            <form onSubmit={addCustomGesture} className="border-t border-slate-100 pt-6 flex gap-2">
              <input 
                type="text" 
                placeholder="Custom Pose Name (e.g. V-Sign)"
                value={newGestureName}
                onChange={(e) => setNewGestureName(e.target.value)}
                className="flex-1 px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-purple-500 bg-white"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
              >
                <Plus size={12} /> Add Pose
              </button>
            </form>
          </div>

          {/* Gesture Training wizard */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <HandMetal size={18} className="text-purple-500" /> Pose Capture Wizard
            </h3>
            <p className="text-xs text-slate-400 mb-6">Train a new gesture model template on local workspace camera.</p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-600">Model Capture Progress</span>
                <span className="text-xs font-black text-purple-600">
                  {gestureWizardStep === 0 ? 'Not running' : `Pose ${gestureWizardStep} of 4`}
                </span>
              </div>

              {/* Progress dots */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[1, 2, 3, 4].map(st => (
                  <div 
                    key={st} 
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      gestureWizardStep >= st 
                        ? 'bg-purple-500' 
                        : 'bg-slate-200'
                    }`} 
                  />
                ))}
              </div>

              <div className="flex flex-col items-center justify-center p-6 border border-slate-200 bg-white rounded-2xl text-center min-h-[140px] relative overflow-hidden">
                {gestureWizardStep === 0 ? (
                  <>
                    <HandMetal size={32} className="text-slate-300 mb-2" />
                    <span className="text-xs font-bold text-slate-600 block">Record New Pose Frames</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Captures 100 spatial landmarks in 5 seconds.</span>
                  </>
                ) : (
                  <div className="space-y-3">
                    <span className="text-sm font-bold text-slate-800 animate-pulse block">
                      {gestureWizardStep === 1 && 'Hold Hand steady in frame...'}
                      {gestureWizardStep === 2 && 'Vary hand distance slightly...'}
                      {gestureWizardStep === 3 && 'Tilt hand left and right...'}
                      {gestureWizardStep === 4 && 'Generating feature vector weights...'}
                    </span>
                    <div className="w-12 h-12 rounded-full border-4 border-dashed border-purple-500 animate-spin mx-auto flex items-center justify-center">
                      <Activity size={18} className="text-purple-500 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-2">
                {gestureWizardStep > 0 && (
                  <button 
                    onClick={() => setGestureWizardStep(0)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Reset Wizard
                  </button>
                )}
                <button 
                  onClick={startGestureTraining}
                  disabled={gestureWizardStep > 0}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow"
                >
                  {gestureWizardStep === 0 ? 'Launch Pose Wizard' : 'Training...'}
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          
          {/* Master Control Toggles */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sliders size={18} className="text-purple-500" /> Control Switches
            </h3>
            <p className="text-xs text-slate-500 mb-6">Master settings for hand gesture command bindings.</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Gesture Teleoperation</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Control arm movements directly</span>
                </div>
                <button 
                  onClick={() => handleGestureControlToggle(!gestureControlEnabled)}
                  className={`w-11 h-6 rounded-full transition-all duration-300 relative ${gestureControlEnabled ? 'bg-purple-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${gestureControlEnabled ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <span className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                    <Lock size={12} className="text-amber-500" /> Gesture Safety Lock
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Confirm teleoperation switches</span>
                </div>
                <button 
                  onClick={() => setGestureSafetyEnabled(!gestureSafetyEnabled)}
                  className={`w-11 h-6 rounded-full transition-all duration-300 relative ${gestureSafetyEnabled ? 'bg-purple-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${gestureSafetyEnabled ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Safety mapping warning */}
          <div className="bg-purple-50 border border-purple-200 rounded-3xl p-5 flex items-start gap-4">
            <div className="p-3 bg-purple-100 text-purple-800 rounded-2xl flex-shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-purple-900 text-sm">Calibration Check</h4>
              <p className="text-xs text-purple-700 leading-relaxed mt-1">
                Always ensure your hand is clearly visible and within 1.5 meters of the host camera. Maintain adequate lighting for optimal vector estimation.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
