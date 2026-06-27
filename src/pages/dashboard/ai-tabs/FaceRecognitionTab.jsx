import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Edit2, Trash2, Camera, Shield, User, X, Upload, Save, RefreshCw, CheckCircle, Database } from 'lucide-react';
import api from '../../../api/axiosInstance';
import { PopupDialog } from '../../../components/ui/PopupDialog';

// Construct the correct URL for operator face images served via the gateway proxy
const faceImageUrl = (facePath) => {
  if (!facePath) return null;
  const base = (api.defaults.baseURL || '').replace('/api/v1', '');
  const filename = facePath.includes('/') ? facePath.split('/').pop() : facePath;
  return `${base}/uploads/operators/${filename}`;
};

const GUIDED_STEPS = [
  { label: 'Look straight ahead', icon: '😐' },
  { label: 'Turn slightly left',  icon: '😶' },
  { label: 'Turn slightly right', icon: '😶' },
  { label: 'Tilt chin upward',    icon: '🙂' },
  { label: 'Tilt head left',      icon: '😑' },
  { label: 'Tilt head right',     icon: '😑' },
];

export function FaceRecognitionTab({ unknownPersonAction, setUnknownPersonAction, guidedFaceStep, setGuidedFaceStep, faceLogs, setActiveTab }) {
  const [operators, setOperators] = useState([]);
  const [editOperatorData, setEditOperatorData] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [modelStats, setModelStats] = useState(null);
  const [retraining, setRetraining] = useState(false);

  // Registration form
  const [operatorName, setOperatorName] = useState('');
  const [accessLevel, setAccessLevel] = useState('Level 1 - Basic Operator');
  const [capturedBlobs, setCapturedBlobs] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [captureMode, setCaptureMode] = useState('idle'); // idle | webcam | file | guided
  const [guidedStep, setGuidedStep] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);

  const videoRef = useRef(null);

  const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', type: 'success', confirmText: 'OK', onConfirm: () => {} });
  const showDialog = (title, message, type = 'success') =>
    setDialog({ isOpen: true, title, message, type, confirmText: 'OK', onConfirm: () => setDialog(p => ({ ...p, isOpen: false })) });

  const fetchOperators = async () => {
    try { const r = await api.get('/ai/face/operators'); setOperators(r.data); }
    catch (e) { console.error(e); }
  };

  const fetchStats = async () => {
    try { const r = await api.get('/ai/face/stats'); setModelStats(r.data); }
    catch (e) { console.error(e); }
  };

  useEffect(() => { fetchOperators(); fetchStats(); }, []);

  const runRetrain = async () => {
    setRetraining(true);
    try {
      const r = await api.post('/ai/face/retrain');
      setModelStats({ embedding_count: r.data.embedding_count, operator_count: r.data.operator_count, ready: r.data.embedding_count > 0 });
    } catch (e) { console.error(e); }
    finally { setRetraining(false); }
  };

  // ── Webcam helpers ──────────────────────────────────────────────────────
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 480 } });
      setWebcamStream(stream);
      setCaptureMode('webcam');
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 80);
    } catch {
      showDialog('Webcam Error', 'Cannot access webcam. Upload photos instead.', 'warning');
    }
  };

  const stopWebcam = () => {
    webcamStream?.getTracks().forEach(t => t.stop());
    setWebcamStream(null);
  };

  const captureFrame = async () => {
    if (!videoRef.current) return null;
    const v = videoRef.current;
    const c = document.createElement('canvas');
    c.width = v.videoWidth || 480; c.height = v.videoHeight || 480;
    c.getContext('2d').drawImage(v, 0, 0);
    return new Promise(res => c.toBlob(res, 'image/jpeg', 0.92));
  };

  // ── Guided mode ─────────────────────────────────────────────────────────
  const startGuided = async () => {
    setCapturedBlobs([]); setPreviewUrl(null); setGuidedStep(0);
    await startWebcam();
    setCaptureMode('guided');
  };

  const captureGuidedStep = async () => {
    const blob = await captureFrame();
    if (!blob) return;
    const newBlobs = [...capturedBlobs, blob];
    setCapturedBlobs(newBlobs);
    if (guidedStep === 0) {
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    }
    const next = guidedStep + 1;
    if (next >= GUIDED_STEPS.length) {
      stopWebcam();
      setCaptureMode('done');
    } else {
      setGuidedStep(next);
    }
  };

  // ── Quick webcam burst ───────────────────────────────────────────────────
  const captureBurst = async () => {
    setIsRegistering(true);
    const blobs = [];
    for (let i = 0; i < 5; i++) {
      const b = await captureFrame();
      if (b) { blobs.push(b); if (i === 0) setPreviewUrl(URL.createObjectURL(b)); }
      await new Promise(r => setTimeout(r, 250));
    }
    setCapturedBlobs(blobs);
    setIsRegistering(false);
    stopWebcam();
    setCaptureMode('done');
  };

  // ── File upload ──────────────────────────────────────────────────────────
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setCapturedBlobs(files);
    const r = new FileReader();
    r.onloadend = () => setPreviewUrl(r.result);
    r.readAsDataURL(files[0]);
    setCaptureMode('done');
  };

  const resetCapture = () => {
    stopWebcam();
    setCapturedBlobs([]); setPreviewUrl(null); setCaptureMode('idle'); setGuidedStep(0);
  };

  const closeModal = () => {
    resetCapture();
    setIsRegisterModalOpen(false);
    setOperatorName(''); setAccessLevel('Level 1 - Basic Operator');
  };

  // ── Submit registration ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!operatorName.trim()) { showDialog('Name Required', 'Enter the operator name.', 'warning'); return; }
    if (!capturedBlobs.length) { showDialog('Image Required', 'Capture or upload face images first.', 'warning'); return; }

    setIsRegistering(true);
    try {
      const form = new FormData();
      capturedBlobs.forEach((b, i) => {
        const file = b instanceof File ? b : new File([b], `face_${i}.jpg`, { type: 'image/jpeg' });
        form.append('files', file);
      });
      form.append('name', operatorName);
      form.append('access_level', accessLevel);

      const res = await api.post('/ai/face/register', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      closeModal();
      fetchOperators();

      // Auto-retrain immediately after adding a new face
      await runRetrain();

      showDialog(
        '✅ Face Registered & Model Updated',
        `"${res.data.name}" registered with ${res.data.samples_added} sample(s). The recognition model has been updated automatically.`,
        'success'
      );
    } catch (err) {
      showDialog('Registration Failed', err.response?.data?.detail || err.message, 'warning');
    } finally {
      setIsRegistering(false);
    }
  };

  // ── Operator CRUD ────────────────────────────────────────────────────────
  const handleDelete = async (op) => {
    setDialog({
      isOpen: true, title: 'Confirm Delete',
      message: `Remove "${op.name}" and all face data?`,
      type: 'warning', confirmText: 'Delete',
      onConfirm: async () => {
        setDialog(p => ({ ...p, isOpen: false }));
        try { await api.delete(`/ai/face/operators/${op.id}`); fetchOperators(); fetchStats(); }
        catch (e) { showDialog('Error', e.message, 'warning'); }
      }
    });
  };

  const handleUpdate = async () => {
    if (!editOperatorData?.name?.trim()) return;
    try {
      await api.put(`/ai/face/operators/${editOperatorData.id}`, { name: editOperatorData.name, access_level: editOperatorData.access_level });
      setEditOperatorData(null); fetchOperators();
    } catch (e) { showDialog('Error', e.message, 'warning'); }
  };

  const progress = captureMode === 'guided' ? Math.round((guidedStep / GUIDED_STEPS.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Module Configuration</span>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">👤 Face Recognition</h2>
        </div>
        <button onClick={() => setActiveTab('control-center')} className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-semibold">
          ← Back
        </button>
      </div>

      {/* Model Status Bar */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${modelStats?.ready ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <div>
            <span className="text-sm font-bold text-slate-800">
              {modelStats?.ready ? 'Model Ready' : 'No Faces Registered'}
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              {modelStats ? `${modelStats.embedding_count} embeddings · ${modelStats.operator_count} operators` : 'Loading…'}
            </p>
          </div>
        </div>
        <button
          onClick={runRetrain}
          disabled={retraining}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl hover:bg-emerald-50 transition disabled:opacity-50"
        >
          <RefreshCw size={13} className={retraining ? 'animate-spin' : ''} />
          {retraining ? 'Syncing…' : 'Sync Model'}
        </button>
      </div>

      {/* Operator List */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-slate-800">Registered Operators</h3>
            <p className="text-xs text-slate-400 mt-0.5">Add faces to train the recognition model.</p>
          </div>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <UserPlus size={14} /> Add Face
          </button>
        </div>

        {operators.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <User size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm font-semibold">No operators registered yet</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add Face" to register the first operator.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {operators.map(op => (
              <div key={op.id} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow flex-shrink-0 bg-slate-200">
                  {op.face_path ? (
                    <img src={faceImageUrl(op.face_path)} alt={op.name} className="w-full h-full object-cover"
                      onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                  ) : <User size={20} className="text-slate-400 m-auto mt-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate text-sm">{op.name}</h4>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {op.access_level?.split(' - ')[1] || op.access_level}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditOperatorData(op)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(op)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roles Matrix */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield size={16} className="text-emerald-500" /> Access Level Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <th className="pb-3">Role</th><th className="pb-3">Robot Control</th><th className="pb-3">AI Configs</th><th className="pb-3">Settings</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {[{ r: 'Owner', c: true, a: true, s: true }, { r: 'Admin', c: true, a: true, s: false }, { r: 'Supervisor', c: true, a: false, s: false }, { r: 'Operator', c: true, a: false, s: false }, { r: 'Viewer', c: false, a: false, s: false }].map(row => (
                <tr key={row.r} className="hover:bg-slate-50/50">
                  <td className="py-2.5 font-bold text-slate-800">{row.r}</td>
                  {[row.c, row.a, row.s].map((v, i) => <td key={i} className={`py-2.5 font-bold ${v ? 'text-emerald-600' : 'text-red-400'}`}>{v ? '✔ Allow' : '✖ Blocked'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Register Modal ── */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600"><UserPlus size={18} /></div>
                <h2 className="text-lg font-bold text-slate-800">Register Operator Face</h2>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Capture Area */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 overflow-hidden">
                {captureMode === 'done' && previewUrl ? (
                  <div className="flex flex-col items-center justify-center p-6 gap-3">
                    <img src={previewUrl} alt="preview" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg" />
                    <span className="text-xs font-bold text-emerald-600">{capturedBlobs.length} sample(s) ready</span>
                    <button onClick={resetCapture} className="text-xs text-red-500 font-bold hover:underline">↺ Retake</button>
                  </div>
                ) : captureMode === 'guided' ? (
                  <div className="p-5 space-y-4">
                    {/* Progress bar */}
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>Step {guidedStep + 1} of {GUIDED_STEPS.length}</span>
                      <span className="text-emerald-600">{capturedBlobs.length} captured</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex items-center justify-center">
                      <video ref={r => { videoRef.current = r; if (r && webcamStream) r.srcObject = webcamStream; }}
                        autoPlay playsInline className="w-40 h-40 rounded-2xl object-cover border-4 border-emerald-400 shadow-lg" />
                    </div>
                    <p className="text-center text-sm font-bold text-slate-700 animate-pulse">{GUIDED_STEPS[guidedStep]?.icon} {GUIDED_STEPS[guidedStep]?.label}</p>
                    <button onClick={captureGuidedStep} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition">
                      📸 Capture This Angle
                    </button>
                  </div>
                ) : captureMode === 'webcam' ? (
                  <div className="flex flex-col items-center p-5 gap-3">
                    <video ref={r => { videoRef.current = r; if (r && webcamStream) r.srcObject = webcamStream; }}
                      autoPlay playsInline className="w-40 h-40 rounded-2xl object-cover border-4 border-slate-300 shadow" />
                    <button onClick={captureBurst} disabled={isRegistering}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50">
                      {isRegistering ? 'Capturing…' : '📸 Burst (5 frames)'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 gap-4 text-center">
                    <Camera size={32} className="text-slate-300" />
                    <div>
                      <p className="text-sm font-bold text-slate-600">Capture face data</p>
                      <p className="text-xs text-slate-400">Use guided mode for best accuracy (6 angles)</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button onClick={startGuided} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 flex items-center gap-1">
                        <Camera size={12} /> Guided (6 angles)
                      </button>
                      <button onClick={startWebcam} className="px-3 py-1.5 bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-800 flex items-center gap-1">
                        <Camera size={12} /> Quick burst
                      </button>
                      <label className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer flex items-center gap-1">
                        <Upload size={12} /> Upload files
                        <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Operator Name</label>
                  <input type="text" value={operatorName} onChange={e => setOperatorName(e.target.value)}
                    placeholder="e.g., Jane Doe"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400 transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Access Level</label>
                  <select value={accessLevel} onChange={e => setAccessLevel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400 transition appearance-none">
                    <option>Level 1 - Basic Operator</option>
                    <option>Level 2 - Supervisor</option>
                    <option>Level 3 - Administrator</option>
                    <option>Level 4 - Owner</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-200 transition text-sm font-semibold">Cancel</button>
              <button onClick={handleSubmit}
                disabled={isRegistering || !operatorName.trim() || !capturedBlobs.length}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition text-sm flex items-center gap-1.5">
                {isRegistering ? <><RefreshCw size={14} className="animate-spin" /> Registering…</> : <><Save size={14} /> Save & Train</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editOperatorData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditOperatorData(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600"><Edit2 size={18} /></div>
                <h2 className="text-lg font-bold text-slate-800">Edit Operator</h2>
              </div>
              <button onClick={() => setEditOperatorData(null)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Name</label>
                <input type="text" value={editOperatorData.name}
                  onChange={e => setEditOperatorData({ ...editOperatorData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Access Level</label>
                <select value={editOperatorData.access_level}
                  onChange={e => setEditOperatorData({ ...editOperatorData, access_level: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm appearance-none">
                  <option>Level 1 - Basic Operator</option>
                  <option>Level 2 - Supervisor</option>
                  <option>Level 3 - Administrator</option>
                  <option>Level 4 - Owner</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setEditOperatorData(null)} className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-200 transition text-sm font-semibold">Cancel</button>
              <button onClick={handleUpdate} disabled={!editOperatorData.name?.trim()}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-xl font-semibold transition text-sm flex items-center gap-1.5">
                <Save size={14} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <PopupDialog isOpen={dialog.isOpen} title={dialog.title} message={dialog.message} type={dialog.type} confirmText={dialog.confirmText} onConfirm={dialog.onConfirm} />
    </div>
  );
}
