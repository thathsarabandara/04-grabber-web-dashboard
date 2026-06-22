import React, { useState, useEffect, useRef } from 'react';
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  Camera, 
  Shield, 
  FileText,
  Database,
  User,
  X,
  Upload,
  Save
} from 'lucide-react';
import api from '../../../api/axiosInstance';
import { PopupDialog } from '../../../components/ui/PopupDialog';

export function FaceRecognitionTab({
  unknownPersonAction,
  setUnknownPersonAction,
  guidedFaceStep,
  setGuidedFaceStep,
  faceLogs,
  setActiveTab
}) {
  const [operators, setOperators] = useState([]);
  const [editOperatorData, setEditOperatorData] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Registration Form States
  const [operatorName, setOperatorName] = useState('');
  const [accessLevel, setAccessLevel] = useState('Level 1 - Basic Operator');
  const [faceImages, setFaceImages] = useState([]); // Array of File or Blob
  const [facePreview, setFacePreview] = useState(null); // Data URL for preview
  const [useWebcam, setUseWebcam] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const webcamRef = useRef(null);

  // Dialog State
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    confirmText: 'OK',
    onConfirm: () => { }
  });

  const fetchOperators = async () => {
    try {
      const res = await api.get('/ai/face/operators');
      setOperators(res.data);
    } catch (err) {
      console.error("Failed to fetch operators", err);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  const handleDeleteOperator = async (id) => {
    try {
      await api.delete(`/ai/face/operators/${id}`);
      fetchOperators();
    } catch (err) {
      console.error("Failed to delete operator", err);
    }
  };

  const handleUpdateOperator = async () => {
    if (!editOperatorData.name.trim()) return;
    try {
      await api.put(`/ai/face/operators/${editOperatorData.id}`, {
        name: editOperatorData.name,
        access_level: editOperatorData.access_level
      });
      setEditOperatorData(null);
      fetchOperators();
    } catch (err) {
      console.error("Failed to update operator", err);
    }
  };

  // Webcam controls
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 400 } });
      setWebcamStream(stream);
      setUseWebcam(true);
      setTimeout(() => {
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Webcam access failed", err);
      setDialog({
        isOpen: true,
        title: 'Webcam Error',
        message: 'Could not access your webcam. Please upload an image file instead.',
        type: 'warning',
        confirmText: 'OK',
        onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
    setUseWebcam(false);
  };

  const captureBurstWebcam = async () => {
    if (!webcamRef.current) return;
    const video = webcamRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 400;
    canvas.height = video.videoHeight || 400;
    const ctx = canvas.getContext('2d');

    setIsRegistering(true);
    let capturedBlobs = [];

    for (let i = 0; i < 5; i++) {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
        if (blob) {
          capturedBlobs.push(blob);
          if (i === 0) setFacePreview(canvas.toDataURL('image/jpeg'));
        }
      }
      await new Promise(r => setTimeout(r, 300));
    }

    setFaceImages(capturedBlobs);
    setIsRegistering(false);
    stopWebcam();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFaceImages(files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFacePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const resetCapture = () => {
    setFaceImages([]);
    setFacePreview(null);
    stopWebcam();
  };

  const handleRegisterSubmit = async () => {
    if (!operatorName.trim()) {
      setDialog({
        isOpen: true,
        title: 'Input Required',
        message: 'Please enter the operator name.',
        type: 'warning',
        confirmText: 'OK',
        onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
      });
      return;
    }

    if (faceImages.length === 0) {
      setDialog({
        isOpen: true,
        title: 'Image Required',
        message: 'Please upload face images or capture a webcam burst.',
        type: 'warning',
        confirmText: 'OK',
        onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
      });
      return;
    }

    setIsRegistering(true);
    try {
      const formData = new FormData();
      faceImages.forEach((img, index) => {
        const fileToSend = img instanceof Blob ? new File([img], `webcam_${index}.jpg`, { type: 'image/jpeg' }) : img;
        formData.append('files', fileToSend);
      });
      formData.append('name', operatorName);
      formData.append('access_level', accessLevel);

      const res = await api.post('/ai/face/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsRegistering(false);
      setIsRegisterModalOpen(false);
      setOperatorName('');
      setFaceImages([]);
      setFacePreview(null);
      fetchOperators();

      setDialog({
        isOpen: true,
        title: 'Face Registered',
        message: `Operator "${res.data.name}" has been successfully added to Face Recognition with ${faceImages.length} template(s).`,
        type: 'success',
        confirmText: 'OK',
        onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
      });
    } catch (err) {
      console.error(err);
      setIsRegistering(false);
      setDialog({
        isOpen: true,
        title: 'Registration Failed',
        message: `Failed to register face: ${err.response?.data?.detail || err.message}`,
        type: 'warning',
        confirmText: 'OK',
        onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const handleModalClose = () => {
    stopWebcam();
    setIsRegisterModalOpen(false);
    setOperatorName('');
    setFaceImages([]);
    setFacePreview(null);
  };

  const triggerGuidedStep = (step) => {
    setGuidedFaceStep(step);
    if (step > 0 && step <= 6) {
      // simulate capture on step change
      setTimeout(() => {
        setGuidedFaceStep(prev => prev === 6 ? 0 : prev + 1);
      }, 1200);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Module Configuration</span>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">👤 Face Recognition</h2>
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
          
          {/* Dashboard widgets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Faces</span>
              <span className="block text-lg font-black text-slate-800 mt-1">{operators.length} Operators</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precision</span>
              <span className="block text-lg font-black text-slate-800 mt-1">95.2%</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authorized Today</span>
              <span className="block text-lg font-black text-slate-800 mt-1">4 Active</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Event</span>
              <span className="block text-xs font-bold text-emerald-600 mt-1.5 truncate">10:18 - Thathsara</span>
            </div>
          </div>

          {/* Operator list section */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-800">Operator Access Control</h3>
                <p className="text-xs text-slate-400 mt-0.5">CRUD management for verified individuals.</p>
              </div>
              <button 
                onClick={() => setIsRegisterModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/10 flex items-center gap-1.5"
              >
                <UserPlus size={14} /> Add Face
              </button>
            </div>

            {operators.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <p className="text-slate-500 text-xs">No operators registered yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {operators.map(op => (
                  <div key={op.id} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-400 flex-shrink-0">
                      {op.face_path ? (
                        <img 
                          src={`${api.defaults.baseURL.replace('/api/v1', '')}${op.face_path}`} 
                          alt={op.name} 
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                          }}
                        />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate text-sm">{op.name}</h4>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mt-0.5">
                        {op.access_level.split(' - ')[1] || op.access_level}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setEditOperatorData(op)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm("Delete face profile?")) handleDeleteOperator(op.id);
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-white rounded-lg transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Guided Face Registration Wizard */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Camera size={18} className="text-emerald-500" /> Guided Registration Wizard
            </h3>
            <p className="text-xs text-slate-400 mb-6">Capture facial profile at multiple angles for enhanced verification precision.</p>
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-600">Guided Snapshot Step</span>
                <span className="text-xs font-black text-emerald-600">
                  {guidedFaceStep === 0 ? 'Wizard Inactive' : `Step ${guidedFaceStep} of 6`}
                </span>
              </div>

              {/* Progress dots */}
              <div className="grid grid-cols-6 gap-2 mb-6">
                {[1, 2, 3, 4, 5, 6].map(st => (
                  <div 
                    key={st} 
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      guidedFaceStep >= st 
                        ? 'bg-emerald-500' 
                        : 'bg-slate-200'
                    }`} 
                  />
                ))}
              </div>

              <div className="flex flex-col items-center justify-center p-6 border border-slate-200 bg-white rounded-2xl text-center min-h-[150px] relative overflow-hidden">
                {guidedFaceStep === 0 ? (
                  <>
                    <Camera size={32} className="text-slate-300 mb-2" />
                    <span className="text-xs font-bold text-slate-600 block">Deploy Guided Assistant</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Captures: Front, Left, Right, Up, Tilt Left, Tilt Right</span>
                  </>
                ) : (
                  <div className="space-y-3">
                    <span className="text-sm font-bold text-slate-800 animate-pulse block">
                      {guidedFaceStep === 1 && 'Look straight at the camera'}
                      {guidedFaceStep === 2 && 'Turn head slowly to the left'}
                      {guidedFaceStep === 3 && 'Turn head slowly to the right'}
                      {guidedFaceStep === 4 && 'Tilt chin upward'}
                      {guidedFaceStep === 5 && 'Tilt head slightly left'}
                      {guidedFaceStep === 6 && 'Tilt head slightly right'}
                    </span>
                    <div className="w-16 h-16 rounded-full border-4 border-dashed border-emerald-500 animate-spin mx-auto flex items-center justify-center">
                      <Camera size={20} className="text-emerald-500 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-2">
                {guidedFaceStep > 0 && (
                  <button 
                    onClick={() => setGuidedFaceStep(0)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Reset Wizard
                  </button>
                )}
                <button 
                  onClick={() => triggerGuidedStep(guidedFaceStep === 0 ? 1 : guidedFaceStep)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow"
                >
                  {guidedFaceStep === 0 ? 'Launch Guided Capture' : 'Capturing next angle...'}
                </button>
              </div>
            </div>
          </div>

          {/* Roles Matrix */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" /> Roles & Access Authorization
            </h3>
            <p className="text-xs text-slate-400 mb-6">Permission matrices configured according to identity level.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Identity Role</th>
                    <th className="pb-3">Robot Control</th>
                    <th className="pb-3">AI Configs</th>
                    <th className="pb-3">Settings Panel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {[
                    { role: 'Owner', ctrl: true, ai: true, settings: true },
                    { role: 'Admin', ctrl: true, ai: true, settings: false },
                    { role: 'Supervisor', ctrl: true, ai: false, settings: false },
                    { role: 'Operator', ctrl: true, ai: false, settings: false },
                    { role: 'Viewer/Guest', ctrl: false, ai: false, settings: false }
                  ].map(r => (
                    <tr key={r.role} className="hover:bg-slate-50/50">
                      <td className="py-3 font-bold text-slate-800">{r.role}</td>
                      <td className="py-3 font-bold">{r.ctrl ? <span className="text-emerald-600">✔ Allow</span> : <span className="text-red-500">✖ Blocked</span>}</td>
                      <td className="py-3 font-bold">{r.ai ? <span className="text-emerald-600">✔ Allow</span> : <span className="text-red-500">✖ Blocked</span>}</td>
                      <td className="py-3 font-bold">{r.settings ? <span className="text-emerald-600">✔ Allow</span> : <span className="text-red-500">✖ Blocked</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          
          {/* Dataset quality */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Database size={18} className="text-emerald-500" /> Dataset Quality
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Templates Collected</span>
                  <span>34 frames</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Vector Quality</span>
                  <span>94 / 100</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Lighting Score</span>
                  <span>85 / 100</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Unknown face action settings */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" /> Security Settings
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-semibold">Action when an unrecognized face enters frame:</p>

            <div className="space-y-2.5">
              {['Ignore', 'Notify', 'Lock Robot', 'Capture Snapshot'].map(act => (
                <label key={act} className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer hover:bg-slate-50 transition ${unknownPersonAction === act ? 'border-emerald-600 bg-emerald-50/10' : 'border-slate-100'}`}>
                  <input 
                    type="radio"
                    name="unknownAction"
                    checked={unknownPersonAction === act}
                    onChange={() => setUnknownPersonAction(act)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-700">{act}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recognition Log */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-emerald-500" /> Recognition Logs
            </h3>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {faceLogs.map((log, idx) => (
                <div key={idx} className="flex items-start justify-between p-2.5 rounded-xl border border-slate-100 text-xs bg-slate-50/50">
                  <div className="flex gap-2">
                    <span className="font-bold text-slate-400">{log.time}</span>
                    <span className="font-semibold text-slate-700">{log.message}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${log.status === 'authorized' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Face Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleModalClose} />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                  <UserPlus size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Register Operator Face</h2>
              </div>
              <button onClick={handleModalClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Visual Capture / Dropzone */}
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50/50 min-h-[220px] relative overflow-hidden">
                  {facePreview ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <img src={facePreview} alt="Captured Crop" className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg mb-3" />
                      <div className="text-xs font-bold text-emerald-600 mb-2">{faceImages.length} Frame(s) Captured</div>
                      <button onClick={resetCapture} className="text-xs text-red-500 font-bold hover:underline">
                        Remove & Retake
                      </button>
                    </div>
                  ) : useWebcam ? (
                    <div className="w-full flex flex-col items-center justify-center">
                      <video ref={webRef => {
                        webcamRef.current = webRef;
                        if (webRef && webcamStream && webRef.srcObject !== webcamStream) {
                          webRef.srcObject = webcamStream;
                        }
                      }} autoPlay playsInline className="w-36 h-36 rounded-full object-cover border-4 border-brand-accent shadow-lg mb-3 bg-black" />
                      <button
                        onClick={captureBurstWebcam}
                        disabled={isRegistering}
                        className="px-3 py-1.5 bg-brand-accent text-white text-xs font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50"
                      >
                        {isRegistering ? 'Capturing Burst...' : 'Capture Burst (5 frames)'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 text-slate-400">
                        <Camera size={24} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-600">Add Operator Face Data</p>
                        <p className="text-[10px] text-slate-400">Upload multiple photos or use webcam burst</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer shadow-sm flex items-center gap-1">
                          <Upload size={12} /> Upload Files
                          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                        </label>
                        <button onClick={startWebcam} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 shadow-sm flex items-center gap-1">
                          <Camera size={12} /> Use Webcam
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form fields */}
                <div className="flex flex-col justify-center space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Operator Name</label>
                    <input
                      type="text"
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      placeholder="e.g., Jane Doe"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Access Authorization</label>
                    <select
                      value={accessLevel}
                      onChange={(e) => setAccessLevel(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none text-sm transition-all appearance-none"
                    >
                      <option>Level 1 - Basic Operator</option>
                      <option>Level 2 - Supervisor</option>
                      <option>Level 3 - Administrator</option>
                      <option>Level 4 - Owner</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={handleModalClose}
                className="px-5 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterSubmit}
                disabled={isRegistering || !operatorName.trim() || faceImages.length === 0}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition text-sm flex items-center gap-1.5"
              >
                {isRegistering ? 'Registering...' : (
                  <>
                    <Save size={16} /> Save Operator
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Operator Modal */}
      {editOperatorData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditOperatorData(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <Edit2 size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Edit Operator</h2>
              </div>
              <button onClick={() => setEditOperatorData(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Operator Name</label>
                <input
                  type="text"
                  value={editOperatorData.name}
                  onChange={(e) => setEditOperatorData({...editOperatorData, name: e.target.value})}
                  placeholder="e.g., Jane Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Access Authorization</label>
                <select
                  value={editOperatorData.access_level}
                  onChange={(e) => setEditOperatorData({...editOperatorData, access_level: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent outline-none text-sm transition-all appearance-none"
                >
                  <option>Level 1 - Basic Operator</option>
                  <option>Level 2 - Supervisor</option>
                  <option>Level 3 - Administrator</option>
                  <option>Level 4 - Owner</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setEditOperatorData(null)}
                className="px-5 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOperator}
                disabled={!editOperatorData.name.trim()}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition text-sm flex items-center gap-1.5"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Popup Alerts */}
      <PopupDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        confirmText={dialog.confirmText}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
}
