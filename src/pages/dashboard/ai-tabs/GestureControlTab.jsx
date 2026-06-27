import React from 'react';
import {
  HandMetal,
  Sliders,
  Plus,
  Trash2,
  Camera,
  Zap,
  Move,
  Layers,
  Info
} from 'lucide-react';
import api from '../../../api/axiosInstance';

const BUILT_IN_MOTIONS = [
  { motion: 'Hand moves Left',                action: 'BASE LEFT',       servo: 'Base Servo',     icon: '←' },
  { motion: 'Hand moves Right',               action: 'BASE RIGHT',      servo: 'Base Servo',     icon: '→' },
  { motion: 'Hand moves Up',                  action: 'SHOULDER LEFT',   servo: 'Shoulder Servo', icon: '↑' },
  { motion: 'Hand moves Down',                action: 'SHOULDER RIGHT',  servo: 'Shoulder Servo', icon: '↓' },
  { motion: 'Hand moves Forward (to camera)', action: 'ELBOW LEFT',      servo: 'Elbow Servo',    icon: '⊙' },
  { motion: 'Hand moves Backward (away)',     action: 'ELBOW RIGHT',     servo: 'Elbow Servo',    icon: '⊗' },
  { motion: 'Open Palm (≥4 fingers)',         action: 'OPEN GRIP',       servo: 'Gripper Servo',  icon: '🖐' },
  { motion: 'Closed Fist (≤1 finger)',        action: 'CLOSE GRIP',      servo: 'Gripper Servo',  icon: '✊' },
];

const VALID_ACTIONS = [
  { group: 'Base',     options: ['BASE LEFT', 'BASE RIGHT'] },
  { group: 'Shoulder', options: ['SHOULDER LEFT', 'SHOULDER RIGHT'] },
  { group: 'Elbow',    options: ['ELBOW LEFT', 'ELBOW RIGHT'] },
  { group: 'Gripper',  options: ['OPEN GRIP', 'CLOSE GRIP'] },
];

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
  const videoRef = React.useRef(null);
  const [webcamStream, setWebcamStream] = React.useState(null);
  const [isCapturing, setIsCapturing] = React.useState(false);
  const [capturedSamples, setCapturedSamples] = React.useState(0);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 480 } });
      setWebcamStream(stream);
      setGestureWizardStep(1);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch {
      alert('Cannot access webcam — check browser permissions.');
    }
  };

  const stopWebcam = () => {
    webcamStream?.getTracks().forEach(t => t.stop());
    setWebcamStream(null);
    setGestureWizardStep(0);
    setCapturedSamples(0);
  };

  const captureFrame = async () => {
    if (!videoRef.current) return null;
    const v = videoRef.current;
    const c = document.createElement('canvas');
    c.width = v.videoWidth || 480;
    c.height = v.videoHeight || 480;
    c.getContext('2d').drawImage(v, 0, 0);
    return new Promise(res => c.toBlob(res, 'image/jpeg', 0.92));
  };

  const registerGestureSample = async () => {
    if (!newGestureName.trim()) { alert('Enter a pose name first.'); return; }
    const blob = await captureFrame();
    if (!blob) return;
    setIsCapturing(true);
    const form = new FormData();
    form.append('frame', new File([blob], 'gesture.jpg', { type: 'image/jpeg' }));
    form.append('gesture_name', newGestureName);
    form.append('action', 'BASE LEFT');
    try {
      const res = await api.post('/ai/gesture/custom/register', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCapturedSamples(res.data.sample_count);
      const settingsRes = await api.get('/ai/gesture/settings');
      setGestureMappings(settingsRes.data.mappings);
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    } finally {
      setIsCapturing(false);
    }
  };

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/ai/gesture/settings');
        setGestureMappings(res.data.mappings);
        setGestureControlEnabled(res.data.control_enabled);
        setGestureSafetyEnabled(res.data.safety_enabled);
      } catch (err) {
        console.error('Failed to fetch gesture settings', err);
      }
    };
    fetchSettings();
  }, []);

  const removeGesture = async (gesture) => {
    try {
      const res = await api.delete(`/ai/gesture/mappings/${encodeURIComponent(gesture)}`);
      setGestureMappings(res.data.mappings);
    } catch (err) {
      console.error('Failed to delete gesture mapping', err);
    }
  };

  const addCustomGesture = async (e) => {
    e.preventDefault();
    if (!newGestureName.trim()) return;
    try {
      const res = await api.post('/ai/gesture/mappings', {
        gesture_name: newGestureName,
        action: 'BASE LEFT'
      });
      setGestureMappings(res.data.mappings);
      setNewGestureName('');
    } catch (err) {
      console.error('Failed to add gesture mapping', err);
      alert(err.response?.data?.detail || err.message);
    }
  };

  const updateGestureAction = async (gesture, action) => {
    try {
      const res = await api.post('/ai/gesture/mappings', { gesture_name: gesture, action });
      setGestureMappings(res.data.mappings);
    } catch (err) {
      console.error('Failed to update gesture action', err);
      alert(err.response?.data?.detail || err.message);
    }
  };

  const handleGestureControlToggle = async (enable) => {
    try {
      const res = await api.post('/ai/gesture/settings', {
        control_enabled: enable,
        safety_enabled: gestureSafetyEnabled
      });
      setGestureControlEnabled(res.data.control_enabled);
    } catch (err) {
      console.error('Failed to update gesture control setting', err);
    }
  };

  const handleSafetyToggle = async (enable) => {
    try {
      const res = await api.post('/ai/gesture/settings', {
        control_enabled: gestureControlEnabled,
        safety_enabled: enable
      });
      setGestureSafetyEnabled(res.data.safety_enabled);
    } catch (err) {
      console.error('Failed to update gesture safety setting', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Global Control Switches */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Sliders size={18} className="text-purple-500" /> Global Control Switches
        </h3>
        <p className="text-xs text-slate-500 mb-6">Configure execution permissions for hand gesture control commands.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Gesture Teleoperation</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Control arm movements directly using camera feeds</span>
            </div>
            <button 
              onClick={() => handleGestureControlToggle(!gestureControlEnabled)}
              className={`w-11 h-6 rounded-full transition-all duration-300 relative ${gestureControlEnabled ? 'bg-purple-600' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${gestureControlEnabled ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                Gesture Safety Lock
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Require supervisor authorization before control activation</span>
            </div>
            <button 
              onClick={() => handleSafetyToggle(!gestureSafetyEnabled)}
              className={`w-11 h-6 rounded-full transition-all duration-300 relative ${gestureSafetyEnabled ? 'bg-purple-600' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${gestureSafetyEnabled ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mode 1: Built-in Motion Detection ─────────────────────────── */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/60 rounded-3xl p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Move size={18} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Mode 1 — Built-in Motion Detection</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Always active. Move your hand in frame — direction is detected automatically. No setup required.
            </p>
          </div>
          <span className="ml-auto px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full tracking-wider">
            Always On
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-purple-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-purple-100/70 text-purple-700">
                <th className="px-4 py-2.5 text-left font-bold">Hand Motion</th>
                <th className="px-4 py-2.5 text-left font-bold">Robot Action</th>
                <th className="px-4 py-2.5 text-left font-bold hidden sm:table-cell">Servo</th>
              </tr>
            </thead>
            <tbody>
              {BUILT_IN_MOTIONS.map((row, i) => (
                <tr key={i} className={`border-t border-purple-100 ${i % 2 === 0 ? 'bg-white' : 'bg-purple-50/40'}`}>
                  <td className="px-4 py-2.5 text-slate-700 flex items-center gap-2">
                    <span className="text-base">{row.icon}</span>
                    {row.motion}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 font-black rounded-md tracking-wide">
                      {row.action}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 hidden sm:table-cell">{row.servo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-start gap-2 mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
          <Info size={13} className="text-indigo-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-indigo-700">
            Open Palm and Closed Fist are detected from finger extension geometry and take priority over motion.
            Motion commands fire when the wrist travels at least 3% of the frame width across 6 consecutive frames.
          </p>
        </div>
      </div>

      {/* ── Mode 2: Custom Static Pose Registration ────────────────────── */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6 space-y-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded-xl">
            <Layers size={18} className="text-slate-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Mode 2 — Custom Static Pose Registration</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Optional. Capture your own static finger poses and map them to any of the 8 actions.
              Registered poses take priority over built-in motion detection.
            </p>
          </div>
          <span className="ml-auto px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-full tracking-wider">
            Optional
          </span>
        </div>

        {/* Registered mappings */}
        <div>
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sliders size={13} className="text-purple-500" /> Registered Custom Poses
          </h4>

          {Object.keys(gestureMappings).length === 0 ? (
            <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
              <HandMetal size={24} className="text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-bold">No custom poses registered yet</p>
              <p className="text-[11px] text-slate-400 mt-1">Use the capture wizard below to add your own.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(gestureMappings).map(([gesture, action]) => (
                <div key={gesture} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs">
                  <span className="font-bold text-slate-800 flex-1 truncate">{gesture}</span>

                  <select
                    value={action}
                    onChange={(e) => updateGestureAction(gesture, e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-700 outline-none focus:ring-1 focus:ring-purple-500 text-xs"
                  >
                    {VALID_ACTIONS.map(group => (
                      <optgroup key={group.group} label={group.group}>
                        {group.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  <button
                    onClick={() => removeGesture(gesture)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new mapping name */}
          <form onSubmit={addCustomGesture} className="border-t border-slate-100 pt-4 mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Custom pose name (e.g. Peace-Sign)"
              value={newGestureName}
              onChange={(e) => setNewGestureName(e.target.value)}
              className="flex-1 px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-purple-500 bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1 shrink-0"
            >
              <Plus size={12} /> Add Name
            </button>
          </form>
        </div>

        {/* Pose Capture Wizard */}
        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Camera size={13} className="text-purple-500" /> Pose Capture Wizard
          </h4>
          <p className="text-[11px] text-slate-400 mb-4">
            Enter a pose name above, then open your webcam and capture 5–10 samples of the same hand pose from slightly different angles.
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-600">Samples Recorded:</span>
              <span className="text-xs font-black text-purple-600">{capturedSamples}</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 border border-slate-200 bg-white rounded-2xl min-h-[180px] relative overflow-hidden">
              {gestureWizardStep === 0 ? (
                <>
                  <HandMetal size={28} className="text-slate-300 mb-2" />
                  <span className="text-xs font-bold text-slate-600">Pose not recording</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Click Start Webcam to begin.</span>
                  <button
                    onClick={startWebcam}
                    className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 shadow"
                  >
                    Start Webcam
                  </button>
                </>
              ) : (
                <div className="space-y-3 w-full flex flex-col items-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-44 h-44 rounded-xl object-cover border-4 border-purple-200 shadow-sm"
                  />
                  <span className="text-[11px] font-bold text-slate-600">Hold your pose and capture samples</span>
                </div>
              )}
            </div>

            {gestureWizardStep > 0 && (
              <div className="flex justify-between mt-4 gap-2">
                <button
                  onClick={stopWebcam}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                >
                  Stop
                </button>
                <button
                  onClick={registerGestureSample}
                  disabled={isCapturing}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 shadow disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <Zap size={12} />
                  {isCapturing ? 'Capturing...' : '📸 Capture Sample'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
