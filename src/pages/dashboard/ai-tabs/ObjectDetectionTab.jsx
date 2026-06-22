import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  RotateCw,
  AlertCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import api from '../../../api/axiosInstance';

export function ObjectDetectionTab({
  confidenceThreshold,
  setConfidenceThreshold,
  objectCanvasRef,
  setActiveTab
}) {
  const [streamError, setStreamError] = useState(false);
  const [stats, setStats] = useState({
    model_status: 'YOLO11s',
    detection_fps: 30,
    detected_today: 342,
    precision: 98.5,
    camera_status: 'Connected'
  });
  
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainFeedback, setRetrainFeedback] = useState('');

  const cameraUrl = localStorage.getItem('grabber_camera_url') || 'http://192.168.1.105:81/stream';
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  // Construct stream URL with confidence threshold
  const streamUrl = `${apiBase}/ai/stream?camera_url=${encodeURIComponent(cameraUrl)}&conf_threshold=${confidenceThreshold / 100}`;

  // Fetch stats on mount and poll every 3 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get(`/ai/status?camera_url=${encodeURIComponent(cameraUrl)}`);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch AI status:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [cameraUrl]);

  // Reset stream error on settings change
  useEffect(() => {
    setStreamError(false);
  }, [confidenceThreshold]);

  // Draw mock bounding boxes on canvas if live stream fails
  useEffect(() => {
    const canvas = objectCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Helper to draw bounding box
    const drawBox = (x, y, w, h, label, conf, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = color;
      ctx.fillRect(x - 1, y - 24, w + 2, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`${label} ${conf}%`, x + 6, y - 8);
    };

    // Draw mock objects depending on confidence setting
    if (confidenceThreshold <= 80) {
      drawBox(60, 100, 70, 150, 'Bottle', '80', '#10b981');
    } else {
      drawBox(60, 100, 70, 150, 'Unidentified', '80', '#ef4444');
    }

    if (confidenceThreshold <= 75) {
      drawBox(200, 160, 80, 80, 'Cube', '75', '#10b981');
    } else {
      drawBox(200, 160, 80, 80, 'Unidentified', '75', '#ef4444');
    }

    if (confidenceThreshold <= 90) {
      drawBox(350, 80, 60, 110, 'Phone', '90', '#10b981');
    } else {
      drawBox(350, 80, 60, 110, 'Unidentified', '90', '#ef4444');
    }
  }, [confidenceThreshold, objectCanvasRef]);

  const handleRetrain = async () => {
    setIsRetraining(true);
    setRetrainFeedback('');
    try {
      // Simulate real training delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await api.post('/ai/retrain', {
        classes: ['All']
      });
      if (response.data.new_precision) {
        setStats(prev => ({
          ...prev,
          precision: response.data.new_precision
        }));
      }
      setRetrainFeedback(response.data.message || 'Model successfully retrained!');
    } catch (err) {
      console.error('Failed to retrain model:', err);
      setRetrainFeedback('Error: Failed to retrain model.');
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Module Configuration</span>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">📦 Object Recognition</h2>
        </div>
        <button 
          onClick={() => setActiveTab('control-center')}
          className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-semibold"
        >
          ← Back to Control Center
        </button>
      </div>

      {retrainFeedback && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold ${
          retrainFeedback.includes('Error') 
            ? 'bg-red-50 border border-red-200 text-red-700' 
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          <AlertCircle size={18} />
          <span>{retrainFeedback}</span>
          <button 
            className="ml-auto underline text-xs" 
            onClick={() => setRetrainFeedback('')}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Camera Feed */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-lg">
            <div className="px-4 py-3 bg-slate-800 border-b border-slate-700/60 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {streamError ? 'Simulated AI Feed' : 'Live AI Feed Camera'}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-black">30 FPS</span>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {!streamError ? (
                <img 
                  src={streamUrl} 
                  alt="Live Object Detection Feed" 
                  className="w-full h-full object-cover"
                  onError={() => setStreamError(true)}
                />
              ) : (
                <canvas 
                  ref={objectCanvasRef} 
                  width={480} 
                  height={270}
                  className="w-full h-full"
                />
              )}
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Model Status</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-black text-slate-800">{stats.model_status}</span>
              </div>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detection FPS</span>
              <span className="block text-lg font-black text-slate-800 mt-1">{stats.detection_fps} FPS</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detected Today</span>
              <span className="block text-lg font-black text-slate-800 mt-1">{stats.detected_today}</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precision</span>
              <span className="block text-lg font-black text-slate-800 mt-1">{stats.precision}%</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Camera Status</span>
              <span className="block text-xs font-bold text-emerald-600 mt-1">{stats.camera_status}</span>
            </div>
          </div>
        </div>

        {/* Configuration Columns */}
        <div className="space-y-6">
          {/* Confidence Filter Card */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sliders size={18} className="text-blue-500" /> Confidence Filter
            </h3>
            <p className="text-xs text-slate-500 mb-4">Minimum model certainty required to highlight boxes. Detections below this threshold are labeled as 'Unidentified'.</p>
            
            <div className="space-y-4 pt-2">
              <div className="flex justify-between font-bold text-slate-700 text-sm">
                <span>50%</span>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-black">{confidenceThreshold}% Threshold</span>
                <span>95%</span>
              </div>
              <input 
                type="range"
                min="50"
                max="95"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
              />
            </div>
          </div>

          {/* Model Retraining Card */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <RotateCw size={18} className="text-blue-500" /> Model Retraining
            </h3>
            <p className="text-xs text-slate-500 mb-4">Retrain the YOLO neural network model with the latest dataset to improve precision.</p>
            
            <button
              onClick={handleRetrain}
              disabled={isRetraining}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-black shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 transition duration-300"
            >
              <RotateCw size={16} className={isRetraining ? 'animate-spin' : ''} />
              {isRetraining ? 'Retraining Neural Network...' : 'Retrain YOLO Model'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
