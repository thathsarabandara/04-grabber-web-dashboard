import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import api from '../../api/axiosInstance';
import { useRobotWebSocket } from '../../hooks/useRobotWebSocket';
import { 
  Maximize2, 
  Minimize2, 
  Circle, 
  Square, 
  Video, 
  Settings2, 
  RefreshCcw, 
  Zap,
  Gamepad2,
  Sliders,
  Terminal,
  ChevronDown,
  Bookmark,
  Play,
  Pause,
  Trash2,
  Save,
  Clock,
  Camera
} from 'lucide-react';
import { PopupDialog } from '../../components/ui/PopupDialog';
import { NoRobotsLock } from '../../components/ui/NoRobotsLock';

export function ControlPanelPage() {
  const [joints, setJoints] = useState({ j1: 90, j2: 100, j3: 60, j4: 90 });
  const [speed, setSpeed] = useState(50);
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    onCancel: null,
    confirmText: 'OK',
    cancelText: 'Cancel'
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [liveTelemetry, setLiveTelemetry] = useState({ fps: 60, ping: 12 });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTelemetry({
        fps: Math.round(57 + Math.random() * 5),
        ping: Math.round(8 + Math.random() * 10)
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  const [robots, setRobots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRobotId, setSelectedRobotId] = useState('');
  const [safetyError, setSafetyError] = useState(null);
  const [cameraUrl, setCameraUrl] = useState(() => {
    return localStorage.getItem('grabber_camera_url') || 'http://192.168.1.105:81/stream';
  });
  const [streamError, setStreamError] = useState(false);

  const getStreamUrl = (url) => {
    if (!url) return '';
    if (url.includes('/telemetry/media/stream') || url.includes('/ai/stream')) return url;
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    return `${apiBase}/ai/stream?camera_url=${encodeURIComponent(url)}`;
  };

  const contentRef = useRef(null);
  const joystick1Ref = useRef(null);
  const joystick1ContainerRef = useRef(null);
  const joystick2Ref = useRef(null);
  const joystick2ContainerRef = useRef(null);

  // Camera Media States
  const [isCapturingSnapshot, setIsCapturingSnapshot] = useState(false);
  const [isRecordingCameraVideo, setIsRecordingCameraVideo] = useState(false);
  const [cameraRecordingTime, setCameraRecordingTime] = useState(0);

  // Refs for camera recording
  const imageRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const cameraTimerRef = useRef(null);
  const cameraContainerRef = useRef(null);

  const [poses, setPoses] = useState([]);
  const [newPoseName, setNewPoseName] = useState('');
  const [sequences, setSequences] = useState([]);
  const [newSequenceName, setNewSequenceName] = useState('');
  const [recordedFrames, setRecordedFrames] = useState([]);
  const [isSequencePlaying, setIsSequencePlaying] = useState(false);
  const sequenceInterval = useRef(null);
  const recordingInterval = useRef(null);

  useRobotWebSocket((message) => {
    console.log('[WS Update] ControlPanelPage:', message);
    setRobots((prevRobots) => 
      prevRobots.map((robot) => {
        if (robot.robot_id === message.robotId) {
          return {
            ...robot,
            status: message.status,
            firmware_version: message.firmware || robot.firmware_version
          };
        }
        return robot;
      })
    );
  });

  const handleEmergencyStop = async () => {
    if (!selectedRobotId) return;
    setSafetyError(null);
    try {
      await api.post(`/robots/${selectedRobotId}/commands/emergency-stop`);
    } catch (err) {
      console.error('Failed to trigger Emergency Stop', err);
      setSafetyError(err.response?.data?.message || 'Failed to trigger Emergency Stop');
    }
  };

  const handleClearEstop = async () => {
    if (!selectedRobotId) return;
    setSafetyError(null);
    try {
      await api.post(`/robots/${selectedRobotId}/commands/clear-emergency-stop`);
    } catch (err) {
      console.error('Failed to clear Emergency Stop', err);
      setSafetyError(err.response?.data?.message || 'Failed to clear Emergency Stop');
    }
  };

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await api.get('/robots');
        setRobots(response.data);
        if (response.data.length > 0) {
          setSelectedRobotId(response.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch robots', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRobots();

    const elements = contentRef.current?.querySelectorAll('[data-animate]');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  const handleToggleFullScreen = () => {
    const element = cameraContainerRef.current;
    if (!element) return;

    if (!document.fullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, []);

  const selectedRobot = robots.find(r => r.id === selectedRobotId);

  const joy1Deflection = useRef({ x: 0, y: 0 });
  const joy2Deflection = useRef({ x: 0, y: 0 });
  const joystickInterval = useRef(null);

  const jointsRef = useRef(joints);
  useEffect(() => {
    jointsRef.current = joints;
  }, [joints]);

  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const fetchPoses = async () => {
    if (!selectedRobotId) return;
    try {
      const res = await api.get(`/robots/${selectedRobotId}/poses`);
      setPoses(res.data);
    } catch (err) {
      console.error('Failed to fetch poses', err);
    }
  };

  const fetchSequences = async () => {
    if (!selectedRobotId) return;
    try {
      const res = await api.get(`/robots/${selectedRobotId}/sequences`);
      setSequences(res.data);
    } catch (err) {
      console.error('Failed to fetch sequences', err);
    }
  };

  useEffect(() => {
    fetchPoses();
    fetchSequences();
  }, [selectedRobotId]);

  const handleSavePose = async () => {
    if (!selectedRobotId || !newPoseName) return;
    try {
      await api.post(`/robots/${selectedRobotId}/poses`, {
        name: newPoseName,
        pose: joints
      });
      setNewPoseName('');
      fetchPoses();
    } catch (err) {
      console.error('Failed to save pose', err);
    }
  };

  const handleExecutePose = async (poseId) => {
    if (!selectedRobotId) return;
    try {
      await api.post(`/robots/${selectedRobotId}/poses/${poseId}/execute`);
      const executedPose = poses.find((p) => p.id === poseId);
      if (executedPose && executedPose.pose) {
        setJoints(executedPose.pose);
      }
    } catch (err) {
      console.error('Failed to execute pose', err);
    }
  };

  const handleDeletePose = async (poseId) => {
    if (!selectedRobotId) return;
    try {
      await api.delete(`/robots/${selectedRobotId}/poses/${poseId}`);
      fetchPoses();
    } catch (err) {
      console.error('Failed to delete pose', err);
    }
  };

  const handleSaveSequence = async () => {
    if (!selectedRobotId || !newSequenceName || recordedFrames.length === 0) return;
    try {
      await api.post(`/robots/${selectedRobotId}/sequences`, {
        name: newSequenceName,
        frames: recordedFrames
      });
      setNewSequenceName('');
      fetchSequences();
    } catch (err) {
      console.error('Failed to save sequence', err);
    }
  };

  const handleDeleteSequence = async (sequenceId) => {
    if (!selectedRobotId) return;
    try {
      await api.delete(`/robots/${selectedRobotId}/sequences/${sequenceId}`);
      fetchSequences();
    } catch (err) {
      console.error('Failed to delete sequence', err);
    }
  };

  const handleLoadSequence = (sequence) => {
    handleStopSequence();
    setRecordedFrames(sequence.frames);
  };

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordedFrames((prev) => {
          const lastFrame = prev[prev.length - 1];
          if (!lastFrame || 
              lastFrame.j1 !== jointsRef.current.j1 || 
              lastFrame.j2 !== jointsRef.current.j2 || 
              lastFrame.j3 !== jointsRef.current.j3 || 
              lastFrame.j4 !== jointsRef.current.j4) {
            return [...prev, { ...jointsRef.current, time: Date.now() }];
          }
          return prev;
        });
      }, 200);
    } else {
      if (recordingInterval.current) clearInterval(recordingInterval.current);
    }
    return () => {
      if (recordingInterval.current) clearInterval(recordingInterval.current);
    };
  }, [isRecording]);

  const handlePlaySequence = () => {
    if (recordedFrames.length === 0 || isSequencePlaying) return;
    setIsSequencePlaying(true);
    let index = 0;
    
    sequenceInterval.current = setInterval(() => {
      if (index >= recordedFrames.length) {
        clearInterval(sequenceInterval.current);
        setIsSequencePlaying(false);
        return;
      }
      
      const frame = recordedFrames[index];
      setJoints({ j1: frame.j1, j2: frame.j2, j3: frame.j3, j4: frame.j4 });
      
      api.post(`/robots/${selectedRobotId}/commands/move-joint`, { joint: 'j1', angle: parseFloat(frame.j1) });
      api.post(`/robots/${selectedRobotId}/commands/move-joint`, { joint: 'j2', angle: parseFloat(frame.j2) });
      api.post(`/robots/${selectedRobotId}/commands/move-joint`, { joint: 'j3', angle: parseFloat(frame.j3) });
      api.post(`/robots/${selectedRobotId}/commands/move-joint`, { joint: 'j4', angle: parseFloat(frame.j4) });
      
      index++;
    }, 200);
  };

  const handleStopSequence = () => {
    if (sequenceInterval.current) clearInterval(sequenceInterval.current);
    setIsSequencePlaying(false);
  };

  const handleClearSequence = () => {
    setRecordedFrames([]);
    handleStopSequence();
    setIsRecording(false);
  };

  const startJoystickLoop = () => {
    if (joystickInterval.current) return;
    
    joystickInterval.current = setInterval(() => {
      const j1D = joy1Deflection.current;
      const j2D = joy2Deflection.current;
      const currentSpeed = speedRef.current;
      
      let changed = false;
      const newJoints = { ...jointsRef.current };
      
      // Speed factor determines max degrees changed per 150ms
      const maxChange = (currentSpeed / 100) * 10; // up to 10 degrees at 100% speed

      // Joystick 1: X -> j1 (Base), Y -> j2 (Shoulder)
      if (Math.abs(j1D.x) > 0.15) {
        newJoints.j1 = Math.max(1, Math.min(180, Math.round(newJoints.j1 + j1D.x * maxChange)));
        changed = true;
      }
      if (Math.abs(j1D.y) > 0.15) {
        newJoints.j2 = Math.max(50, Math.min(150, Math.round(newJoints.j2 + j1D.y * maxChange)));
        changed = true;
      }

      // Joystick 2: X -> j3 (Elbow), Y -> j4 (Gripper)
      if (Math.abs(j2D.x) > 0.15) {
        newJoints.j3 = Math.max(20, Math.min(100, Math.round(newJoints.j3 + j2D.x * maxChange)));
        changed = true;
      }
      if (Math.abs(j2D.y) > 0.15) {
        newJoints.j4 = Math.max(70, Math.min(100, Math.round(newJoints.j4 + j2D.y * maxChange)));
        changed = true;
      }

      if (changed) {
        setJoints(newJoints);
        // Send updates to the robot
        if (Math.abs(j1D.x) > 0.15) sendJointCommand('j1', newJoints.j1);
        if (Math.abs(j1D.y) > 0.15) sendJointCommand('j2', newJoints.j2);
        if (Math.abs(j2D.x) > 0.15) sendJointCommand('j3', newJoints.j3);
        if (Math.abs(j2D.y) > 0.15) sendJointCommand('j4', newJoints.j4);
      }
    }, 150);
  };

  const checkStopJoystickLoop = () => {
    if (
      joy1Deflection.current.x === 0 &&
      joy1Deflection.current.y === 0 &&
      joy2Deflection.current.x === 0 &&
      joy2Deflection.current.y === 0
    ) {
      if (joystickInterval.current) {
        clearInterval(joystickInterval.current);
        joystickInterval.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (joystickInterval.current) {
        clearInterval(joystickInterval.current);
      }
    };
  }, []);

  const handleJoystick1Move = (e) => {
    if (!joystick1ContainerRef.current || !joystick1Ref.current) return;
    const rect = joystick1ContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let x = e.clientX - centerX;
    let y = e.clientY - centerY;
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = rect.width / 2 - 30;

    if (distance > maxDistance) {
      const angle = Math.atan2(y, x);
      x = Math.cos(angle) * maxDistance;
      y = Math.sin(angle) * maxDistance;
    }
    gsap.to(joystick1Ref.current, { x, y, duration: 0.1 });

    joy1Deflection.current = {
      x: x / maxDistance,
      y: -y / maxDistance
    };

    startJoystickLoop();
  };

  const resetJoystick1 = () => {
    gsap.to(joystick1Ref.current, { x: 0, y: 0, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
    joy1Deflection.current = { x: 0, y: 0 };
    checkStopJoystickLoop();
  };

  const handleJoystick2Move = (e) => {
    if (!joystick2ContainerRef.current || !joystick2Ref.current) return;
    const rect = joystick2ContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let x = e.clientX - centerX;
    let y = e.clientY - centerY;
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = rect.width / 2 - 30;

    if (distance > maxDistance) {
      const angle = Math.atan2(y, x);
      x = Math.cos(angle) * maxDistance;
      y = Math.sin(angle) * maxDistance;
    }
    gsap.to(joystick2Ref.current, { x, y, duration: 0.1 });

    joy2Deflection.current = {
      x: x / maxDistance,
      y: -y / maxDistance
    };

    startJoystickLoop();
  };

  const resetJoystick2 = () => {
    gsap.to(joystick2Ref.current, { x: 0, y: 0, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
    joy2Deflection.current = { x: 0, y: 0 };
    checkStopJoystickLoop();
  };

  const handleJointChange = (joint, value) => {
    setJoints((prev) => ({ ...prev, [joint]: value }));
  };

  const sendJointCommand = async (joint, angle) => {
    if (!selectedRobotId) return;
    try {
      await api.post(`/robots/${selectedRobotId}/commands/move-joint`, {
        joint,
        angle: parseFloat(angle)
      });
    } catch (err) {
      console.error(`Failed to move joint ${joint}`, err);
    }
  };

  const handleCommitSync = async () => {
    if (!selectedRobotId) return;
    try {
      // Loop over all joints and send a command for each
      for (const [joint, angle] of Object.entries(joints)) {
        await api.post(`/robots/${selectedRobotId}/commands/move-joint`, {
          joint,
          angle: parseFloat(angle)
        });
      }
    } catch (err) {
      console.error('Failed to commit sync pose', err);
    }
  };

  const handleResetPose = async () => {
    if (!selectedRobotId) return;
    try {
      await api.post(`/robots/${selectedRobotId}/commands/home`);
      setJoints({ j1: 90, j2: 100, j3: 60, j4: 90 });
    } catch (err) {
      console.error('Failed to reset pose', err);
    }
  };

  // Clean up recording animation frames and timers on unmount
  useEffect(() => {
    return () => {
      if (cameraTimerRef.current) clearInterval(cameraTimerRef.current);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  const handleTakeSnapshot = async () => {
    if (!imageRef.current) {
      setDialog({
        isOpen: true,
        title: 'Capture Failed',
        message: 'Camera stream is not active. Unable to take snapshot.',
        type: 'warning',
        confirmText: 'OK',
        onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
      });
      return;
    }
    setIsCapturingSnapshot(true);
    try {
      const img = imageRef.current;
      
      // Create canvas locally to grab current frame from imageRef
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 640;
      canvas.height = img.naturalHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not initialize canvas context');
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get the image blob
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to encode image frame'));
        }, 'image/jpeg', 0.90);
      });
      
      const file = new File([blob], `snapshot-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', `Snapshot ${new Date().toLocaleString()}`);
      
      const res = await api.post('/telemetry/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 10000
      });
      
      console.log('Snapshot captured and uploaded successfully:', res.data);
      setDialog({
        isOpen: true,
        title: 'Snapshot Saved',
        message: 'Snapshot captured successfully and saved to gallery!',
        type: 'success',
        confirmText: 'OK',
        onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
      });
    } catch (err) {
      console.error('Failed to capture snapshot', err);
      setDialog({
        isOpen: true,
        title: 'Snapshot Failed',
        message: `Failed to capture snapshot: ${err.message}`,
        type: 'warning',
        confirmText: 'OK',
        onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
      });
    } finally {
      setIsCapturingSnapshot(false);
    }
  };

  const handleStartCameraRecording = () => {
    if (!imageRef.current) return;
    
    recordedChunksRef.current = [];
    setCameraRecordingTime(0);
    setIsRecordingCameraVideo(true);

    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    const img = imageRef.current;
    canvas.width = img.naturalWidth || 640;
    canvas.height = img.naturalHeight || 480;

    const drawFrame = () => {
      if (img && ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        animationFrameIdRef.current = requestAnimationFrame(drawFrame);
      }
    };
    drawFrame();

    try {
      const stream = canvas.captureStream(15);
      
      let options = { mimeType: 'video/webm;codecs=vp8' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: '' };
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
          animationFrameIdRef.current = null;
        }

        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        await uploadRecordedVideo(blob);
      };

      recorder.start();

      cameraTimerRef.current = setInterval(() => {
        setCameraRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Failed to start camera recording:', err);
      setDialog({
        isOpen: true,
        title: 'Recording Error',
        message: `Recording error: ${err.message}`,
        type: 'warning',
        confirmText: 'OK',
        onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
      });
      setIsRecordingCameraVideo(false);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    }
  };

  const handleStopCameraRecording = () => {
    setIsRecordingCameraVideo(false);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (cameraTimerRef.current) {
      clearInterval(cameraTimerRef.current);
      cameraTimerRef.current = null;
    }
  };

  const uploadRecordedVideo = async (videoBlob) => {
    try {
      const file = new File([videoBlob], `recording-${Date.now()}.webm`, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', `Video Recording ${new Date().toLocaleString()}`);
      
      const minutes = Math.floor(cameraRecordingTime / 60);
      const seconds = cameraRecordingTime % 60;
      const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      formData.append('duration', durationStr);

      const res = await api.post('/telemetry/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Video uploaded successfully:', res.data);
      setDialog({
        isOpen: true,
        title: 'Video Saved',
        message: 'Video recording saved to gallery successfully!',
        type: 'success',
        confirmText: 'OK',
        onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
      });
    } catch (err) {
      console.error('Failed to upload video recording:', err);
      setDialog({
        isOpen: true,
        title: 'Error',
        message: `Failed to save video: ${err.response?.data?.detail || err.message}`,
        type: 'warning',
        confirmText: 'OK',
        onConfirm: () => setDialog(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const handleToggleCameraRecording = () => {
    if (isRecordingCameraVideo) {
      handleStopCameraRecording();
    } else {
      handleStartCameraRecording();
    }
  };

  const calculateCoordinates = () => {
    const L1 = 150; // mm (link 1 length)
    const L2 = 120; // mm (link 2 length)

    const radBase = ((joints.j1 || 90) - 90) * Math.PI / 180;
    const radShoulder = (90 - (joints.j2 || 90)) * Math.PI / 180;
    const radElbow = (90 - (joints.j3 || 50)) * Math.PI / 180;

    const R = L1 * Math.cos(radShoulder) + L2 * Math.cos(radShoulder + radElbow);
    
    const X = R * Math.cos(radBase);
    const Y = R * Math.sin(radBase);
    const Z = L1 * Math.sin(radShoulder) + L2 * Math.sin(radShoulder + radElbow);

    return {
      x: (X >= 0 ? '+' : '') + X.toFixed(2),
      y: (Y >= 0 ? '+' : '') + Y.toFixed(2),
      z: (Z >= 0 ? '+' : '') + Z.toFixed(2)
    };
  };

  const renderSafetyControls = (isCompact = false) => {
    if (isCompact) {
      return (
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-3 text-white">
            Safety Controls
          </h3>
          {safetyError && (
            <div className="mb-4 p-3 bg-red-100/25 border border-red-500/25 text-red-200 text-xs font-bold rounded-xl">
              {safetyError}
            </div>
          )}
          <div className="space-y-3">
            <button
              onClick={handleEmergencyStop}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[9px] rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20"
            >
              🚨 Emergency Stop
            </button>
            <button
              onClick={handleClearEstop}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[9px] rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm border border-white/10"
            >
              🔓 Clear E-Stop / Reset
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="glass-card p-10 border-red-200/50 bg-red-50/10">
        <h3 className="text-2xl font-black tracking-tight text-red-900 mb-6 flex items-center gap-3">
          Safety Controls
        </h3>
        {safetyError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-xs font-bold rounded-xl">
            {safetyError}
          </div>
        )}
        <div className="space-y-4">
          <button
            onClick={handleEmergencyStop}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20"
          >
            🚨 Emergency Stop
          </button>
          <button
            onClick={handleClearEstop}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            🔓 Clear E-Stop / Reset
          </button>
        </div>
      </div>
    );
  };

  const renderJoysticks = (isCompact = false) => {
    if (isCompact) {
      return (
        <div className="grid grid-cols-1 gap-6">
          {/* Joystick 1 */}
          <div className="p-6 relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl text-white">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Gamepad2 size={60} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black tracking-tight flex items-center gap-2">
                <Gamepad2 size={16} className="text-brand-accent" /> Base & Shoulder
              </h3>
            </div>
            
            <div className="flex justify-center py-2 relative z-10">
              <div
                ref={joystick1ContainerRef}
                className="relative w-36 h-36 bg-white/5 border-[3px] border-white/10 rounded-full shadow-md flex items-center justify-center cursor-crosshair group"
                onMouseMove={handleJoystick1Move}
                onMouseLeave={resetJoystick1}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-[1px] h-[80%] bg-slate-400"></div>
                  <div className="absolute w-[80%] h-[1px] bg-slate-400"></div>
                  <div className="absolute w-[75%] h-[75%] rounded-full border border-slate-300"></div>
                  <div className="absolute w-[25%] h-[25%] rounded-full border border-slate-300"></div>
                </div>
                <div
                  ref={joystick1Ref}
                  className="w-10 h-10 bg-slate-900 rounded-xl shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
                >
                  <div className="w-1 h-1 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Base</p>
                <p className="text-xs font-black text-white">{joints.j1}°</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Shoulder</p>
                <p className="text-xs font-black text-white">{joints.j2}°</p>
              </div>
            </div>
          </div>

          {/* Joystick 2 */}
          <div className="p-6 relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl text-white">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Gamepad2 size={60} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black tracking-tight flex items-center gap-2">
                <Gamepad2 size={16} className="text-emerald-500" /> Grip & Elbow
              </h3>
            </div>
            
            <div className="flex justify-center py-2 relative z-10">
              <div
                ref={joystick2ContainerRef}
                className="relative w-36 h-36 bg-white/5 border-[3px] border-white/10 rounded-full shadow-md flex items-center justify-center cursor-crosshair group"
                onMouseMove={handleJoystick2Move}
                onMouseLeave={resetJoystick2}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-[1px] h-[80%] bg-slate-400"></div>
                  <div className="absolute w-[80%] h-[1px] bg-slate-400"></div>
                  <div className="absolute w-[75%] h-[75%] rounded-full border border-slate-300"></div>
                  <div className="absolute w-[25%] h-[25%] rounded-full border border-slate-300"></div>
                </div>
                <div
                  ref={joystick2Ref}
                  className="w-10 h-10 bg-slate-900 rounded-xl shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
                >
                  <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Elbow</p>
                <p className="text-xs font-black text-white">{joints.j3}°</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Grip</p>
                <p className="text-xs font-black text-white">{joints.j4}°</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Joystick 1 */}
        <div data-animate className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Gamepad2 size={80} />
          </div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
              <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg">
                <Gamepad2 size={18} />
              </div>
              Base & Shoulder
            </h3>
          </div>
          
          <div className="flex justify-center py-4 relative z-10">
            <div
              ref={joystick1ContainerRef}
              className="relative w-48 h-48 rounded-full bg-slate-100/50 border-[4px] border-white shadow-xl flex items-center justify-center cursor-crosshair group"
              onMouseMove={handleJoystick1Move}
              onMouseLeave={resetJoystick1}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-[1px] h-[80%] bg-slate-400"></div>
                <div className="absolute w-[80%] h-[1px] bg-slate-400"></div>
                <div className="absolute w-[75%] h-[75%] rounded-full border border-slate-300"></div>
                <div className="absolute w-[25%] h-[25%] rounded-full border border-slate-300"></div>
              </div>

              <div
                ref={joystick1Ref}
                className="w-12 h-12 bg-slate-900 rounded-2xl shadow-xl shadow-slate-950/20 flex items-center justify-center transform-gpu hover:scale-105 transition-transform duration-300 cursor-grab active:cursor-grabbing"
              >
                <div className="w-1 h-1 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Base</p>
              <p className="text-sm font-black text-slate-800">{joints.j1}°</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Shoulder</p>
              <p className="text-sm font-black text-slate-800">{joints.j2}°</p>
            </div>
          </div>
        </div>

        {/* Joystick 2 */}
        <div data-animate className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Gamepad2 size={80} />
          </div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <Gamepad2 size={18} />
              </div>
              Grip & Elbow
            </h3>
          </div>
          
          <div className="flex justify-center py-4 relative z-10">
            <div
              ref={joystick2ContainerRef}
              className="relative w-48 h-48 rounded-full bg-slate-100/50 border-[4px] border-white shadow-xl flex items-center justify-center cursor-crosshair group"
              onMouseMove={handleJoystick2Move}
              onMouseLeave={resetJoystick2}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-[1px] h-[80%] bg-slate-400"></div>
                <div className="absolute w-[80%] h-[1px] bg-slate-400"></div>
                <div className="absolute w-[75%] h-[75%] rounded-full border border-slate-300"></div>
                <div className="absolute w-[25%] h-[25%] rounded-full border border-slate-300"></div>
              </div>

              <div
                ref={joystick2Ref}
                className="w-12 h-12 bg-slate-900 rounded-2xl shadow-xl shadow-slate-950/20 flex items-center justify-center transform-gpu hover:scale-105 transition-transform duration-300 cursor-grab active:cursor-grabbing"
              >
                <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Elbow</p>
              <p className="text-sm font-black text-slate-800">{joints.j3}°</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Grip</p>
              <p className="text-sm font-black text-slate-800">{joints.j4}°</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderKinematics = (isCompact = false) => {
    if (isCompact) {
      return (
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
              <Sliders size={20} className="text-brand-secondary" /> Kinematics
            </h3>
          </div>

          {/* Speed Control */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Torque Velocity</label>
              <span className="text-xs font-black text-brand-accent px-2 py-0.5 bg-white/10 rounded border border-white/10">{speed}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700/50 rounded-full appearance-none cursor-pointer accent-brand-accent shadow-inner"
            />
          </div>

          {/* Individual Joints */}
          <div className="space-y-6">
            {[
              { id: 'j1', label: 'Base Rotation', min: 1, max: 180, color: '#3b82f6' },
              { id: 'j2', label: 'Shoulder Pitch', min: 50, max: 150, color: '#8b5cf6' },
              { id: 'j3', label: 'Elbow Position', min: 20, max: 100, color: '#10b981' },
              { id: 'j4', label: 'Gripper Claw', min: 70, max: 100, color: '#f59e0b' },
            ].map((joint) => (
              <div key={joint.id} className="group">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-brand-accent transition-colors">
                    {joint.label}
                  </label>
                  <span className="text-[9px] font-black bg-white/10 border border-white/10 px-2 py-1 rounded text-white shadow-sm">
                    {joints[joint.id]}°
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min={joint.min}
                    max={joint.max}
                    value={joints[joint.id]}
                    onChange={(e) => handleJointChange(joint.id, parseInt(e.target.value))}
                    onMouseUp={(e) => sendJointCommand(joint.id, parseInt(e.target.value))}
                    onTouchEnd={(e) => sendJointCommand(joint.id, parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-700/50 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: joint.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Matrix */}
          <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-white/10">
            <button 
              onClick={handleCommitSync}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-accent text-white font-black uppercase tracking-widest text-[9px] rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-accent/20"
            >
              <Zap size={12} /> Commit Sync
            </button>
            <button 
              onClick={handleResetPose}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest text-[9px] rounded-xl transition-all hover:bg-white/20 active:scale-95 shadow-sm"
            >
              <RefreshCcw size={12} /> Reset Pose
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="glass-card p-10 text-slate-800">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-4">
            <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-xl">
              <Sliders size={24} />
            </div>
            Kinematics
          </h3>
          <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-brand-accent rounded-xl transition-all">
            <Settings2 size={18} />
          </button>
        </div>

        {/* Speed Control */}
        <div className="mb-12 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Torque Velocity</label>
            <span className="text-sm font-black text-brand-accent px-3 py-1 bg-white rounded-lg shadow-sm">{speed}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-accent shadow-inner"
          />
        </div>

        {/* Individual Joints */}
        <div className="space-y-10">
          {[
            { id: 'j1', label: 'Base Rotation', min: 1, max: 180, color: '#3b82f6' },
            { id: 'j2', label: 'Shoulder Pitch', min: 50, max: 150, color: '#8b5cf6' },
            { id: 'j3', label: 'Elbow Position', min: 20, max: 100, color: '#10b981' },
            { id: 'j4', label: 'Gripper Claw', min: 70, max: 100, color: '#f59e0b' },
          ].map((joint) => (
            <div key={joint.id} className="group">
              <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-brand-accent transition-colors">
                  {joint.label}
                </label>
                <span className="text-[10px] font-black bg-white border border-slate-100 px-3 py-1.5 rounded-lg text-slate-500 shadow-sm">
                  {joints[joint.id]}°
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="range"
                  min={joint.min}
                  max={joint.max}
                  value={joints[joint.id]}
                  onChange={(e) => handleJointChange(joint.id, parseInt(e.target.value))}
                  onMouseUp={(e) => sendJointCommand(joint.id, parseInt(e.target.value))}
                  onTouchEnd={(e) => sendJointCommand(joint.id, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-secondary transition-all"
                  style={{ accentColor: joint.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action Matrix */}
        <div className="grid grid-cols-2 gap-4 mt-12 pt-10 border-t border-slate-100">
          <button 
            onClick={handleCommitSync}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-brand-accent text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-accent/20"
          >
            <Zap size={14} /> Commit Sync
          </button>
          <button 
            onClick={handleResetPose}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-600 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
          >
            <RefreshCcw size={14} /> Reset Pose
          </button>
        </div>
      </div>
    );
  };

  const renderPosesLibrary = (isCompact = false) => {
    if (isCompact) {
      return (
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-white">
          <h3 className="text-sm font-black tracking-tight flex items-center gap-2 mb-4">
            <Bookmark size={16} className="text-indigo-500" /> Poses Library
          </h3>
          
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="New Pose Name..." 
              value={newPoseName}
              onChange={(e) => setNewPoseName(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-white/30"
            />
            <button 
              onClick={handleSavePose}
              disabled={!newPoseName}
              className="p-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md active:scale-95"
            >
              <Save size={16} />
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {poses.length === 0 ? (
              <p className="text-[10px] text-slate-400 text-center py-4 font-bold bg-white/5 rounded-xl border border-dashed border-white/10">No saved poses</p>
            ) : (
              poses.map(pose => (
                <div key={pose.id} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5 shadow-sm group hover:border-indigo-500/30 transition-all">
                  <span className="text-[11px] font-black truncate pr-4 uppercase tracking-wider text-white">{pose.name}</span>
                  <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleExecutePose(pose.id)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-emerald-500 rounded border border-white/10 transition-all active:scale-95"
                      title="Execute Pose"
                    >
                      <Play size={12} className="fill-current" />
                    </button>
                    <button 
                      onClick={() => handleDeletePose(pose.id)}
                      className="p-1 bg-slate-800 hover:bg-red-900/50 text-red-400 rounded border border-white/10 transition-all active:scale-95"
                      title="Delete Pose"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-black tracking-tight flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
            <Bookmark size={18} />
          </div>
          Poses Library
        </h3>
        
        <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            placeholder="New Pose Name..." 
            value={newPoseName}
            onChange={(e) => setNewPoseName(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
          />
          <button 
            onClick={handleSavePose}
            disabled={!newPoseName}
            className="p-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md active:scale-95"
          >
            <Save size={18} />
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {poses.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4 font-bold bg-slate-50/50 rounded-xl border border-dashed border-slate-200">No saved poses</p>
          ) : (
            poses.map(pose => (
              <div key={pose.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm group hover:border-indigo-200 hover:shadow-md transition-all">
                <span className="text-xs font-black text-slate-700 truncate pr-4 uppercase tracking-wider">{pose.name}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleExecutePose(pose.id)}
                    className="p-1.5 bg-white text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg shadow-sm border border-slate-200 transition-all active:scale-95"
                    title="Execute Pose"
                  >
                    <Play size={14} className="fill-current" />
                  </button>
                  <button 
                    onClick={() => handleDeletePose(pose.id)}
                    className="p-1.5 bg-white text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg shadow-sm border border-slate-200 transition-all active:scale-95"
                    title="Delete Pose"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderMotionSequencer = (isCompact = false) => {
    if (isCompact) {
      return (
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-white">
          <h3 className="text-sm font-black tracking-tight flex items-center gap-2 mb-4">
            <Clock size={16} className="text-amber-500" /> Motion Sequencer
          </h3>

          <div className="flex flex-col items-center justify-center">
            <div className="flex gap-2 mb-4 w-full justify-center">
              <button
                onClick={() => setIsRecording(!isRecording)}
                disabled={isSequencePlaying}
                className={`flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRecording 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                    : 'bg-slate-800 border border-white/10 text-white hover:bg-slate-700'
                }`}
              >
                {isRecording ? <Square size={12} className="fill-current" /> : <Circle size={12} className="text-red-500 fill-current" />}
                {isRecording ? 'Stop' : 'Rec'}
              </button>
              
              <button
                onClick={isSequencePlaying ? handleStopSequence : handlePlaySequence}
                disabled={recordedFrames.length === 0 || isRecording}
                className={`flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSequencePlaying
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-slate-800 border border-white/10 text-white hover:bg-slate-700'
                }`}
              >
                {isSequencePlaying ? <Pause size={12} className="fill-current" /> : <Play size={12} className="text-emerald-500 fill-current" />}
                {isSequencePlaying ? 'Pause' : 'Play'}
              </button>

              <button
                onClick={handleClearSequence}
                disabled={recordedFrames.length === 0 || isSequencePlaying}
                className="px-3 bg-slate-800 border border-white/10 hover:bg-red-950/50 text-slate-400 hover:text-red-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear Sequence"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5 border border-white/5">
              <div 
                className={`h-full rounded-full transition-all duration-200 relative overflow-hidden ${isSequencePlaying ? 'bg-amber-500' : isRecording ? 'bg-red-500' : 'bg-brand-accent'}`}
                style={{ width: `${Math.min(100, (recordedFrames.length / 50) * 100)}%` }}
              >
                {(isRecording || isSequencePlaying) && (
                   <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] animate-[shimmer_1s_infinite]"></div>
                )}
              </div>
            </div>
            <div className="w-full flex justify-between mt-2.5 mb-4">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">Frames: {recordedFrames.length}</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded flex items-center gap-1">
                 <span className={`w-1 h-1 rounded-full ${isSequencePlaying ? 'bg-amber-500 animate-pulse' : isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
                 {isSequencePlaying ? 'Playing' : isRecording ? 'Recording' : 'Ready'}
              </span>
            </div>

            <div className="w-full border-t border-white/10 pt-4 mt-2">
              <h4 className="text-[8px] font-black tracking-widest uppercase text-slate-400 mb-2">Saved Sequences</h4>
              
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  placeholder="New Sequence Name..." 
                  value={newSequenceName}
                  onChange={(e) => setNewSequenceName(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-white/30"
                />
                <button 
                  onClick={handleSaveSequence}
                  disabled={!newSequenceName || recordedFrames.length === 0}
                  className="p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md active:scale-95"
                >
                  <Save size={16} />
                </button>
              </div>

              <div className="space-y-2 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                {sequences.length === 0 ? (
                  <p className="text-[10px] text-slate-400 text-center py-4 font-bold bg-white/5 rounded-xl border border-dashed border-white/10">No saved sequences</p>
                ) : (
                  sequences.map(seq => (
                    <div key={seq.id} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5 shadow-sm group hover:border-amber-500/30 transition-all">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black truncate pr-4 uppercase tracking-wider text-white">{seq.name}</span>
                        <span className="text-[8px] text-slate-400 font-bold">{seq.frames?.length || 0} Frames</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleLoadSequence(seq)}
                          className="p-1 bg-slate-800 hover:bg-slate-700 text-emerald-500 rounded border border-white/10 transition-all active:scale-95"
                          title="Load Sequence"
                        >
                          <Bookmark size={12} className="fill-current" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSequence(seq.id)}
                          className="p-1 bg-slate-800 hover:bg-red-900/50 text-red-400 rounded border border-white/10 transition-all active:scale-95"
                          title="Delete Sequence"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-black tracking-tight flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
            <Clock size={18} />
          </div>
          Motion Sequencer
        </h3>

        <div className="flex flex-col items-center justify-center h-full pb-4">
          <div className="flex gap-3 mb-6 w-full justify-center">
            <button
              onClick={() => setIsRecording(!isRecording)}
              disabled={isSequencePlaying}
              className={`flex items-center justify-center gap-2 flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isRecording 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
              }`}
            >
              {isRecording ? <Square size={14} className="fill-current" /> : <Circle size={14} className="text-red-500 fill-current" />}
              {isRecording ? 'Stop Rec' : 'Record'}
            </button>
            
            <button
              onClick={isSequencePlaying ? handleStopSequence : handlePlaySequence}
              disabled={recordedFrames.length === 0 || isRecording}
              className={`flex items-center justify-center gap-2 flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isSequencePlaying
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
              }`}
            >
              {isSequencePlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="text-emerald-500 fill-current" />}
              {isSequencePlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={handleClearSequence}
              disabled={recordedFrames.length === 0 || isSequencePlaying}
              className="px-4 bg-white border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              title="Clear Sequence"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-200 relative overflow-hidden ${isSequencePlaying ? 'bg-amber-500' : isRecording ? 'bg-red-500' : 'bg-brand-accent'}`}
              style={{ width: `${Math.min(100, (recordedFrames.length / 50) * 100)}%` }}
            >
              {(isRecording || isSequencePlaying) && (
                 <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] animate-[shimmer_1s_infinite]"></div>
              )}
            </div>
          </div>
          <div className="w-full flex justify-between mt-3 mb-6">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">Frames: {recordedFrames.length}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md flex items-center gap-1">
               <span className={`w-1.5 h-1.5 rounded-full ${isSequencePlaying ? 'bg-amber-500 animate-pulse' : isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></span>
               {isSequencePlaying ? 'Playing' : isRecording ? 'Recording' : 'Ready'}
            </span>
          </div>

          <div className="w-full border-t border-slate-100 pt-6">
            <h4 className="text-xs font-black tracking-widest uppercase text-slate-400 mb-4">Saved Sequences</h4>
            
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="New Sequence Name..." 
                value={newSequenceName}
                onChange={(e) => setNewSequenceName(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-inner"
              />
              <button 
                onClick={handleSaveSequence}
                disabled={!newSequenceName || recordedFrames.length === 0}
                className="p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md active:scale-95"
              >
                <Save size={18} />
              </button>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
              {sequences.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 font-bold bg-slate-50/50 rounded-xl border border-dashed border-slate-200">No saved sequences</p>
              ) : (
                sequences.map(seq => (
                  <div key={seq.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm group hover:border-amber-200 hover:shadow-md transition-all">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-700 truncate pr-4 uppercase tracking-wider">{seq.name}</span>
                      <span className="text-[9px] text-slate-400 font-bold">{seq.frames?.length || 0} Frames</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleLoadSequence(seq)}
                        className="p-1.5 bg-white text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg shadow-sm border border-slate-200 transition-all active:scale-95"
                        title="Load Sequence"
                      >
                        <Bookmark size={14} className="fill-current" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSequence(seq.id)}
                        className="p-1.5 bg-white text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg shadow-sm border border-slate-200 transition-all active:scale-95"
                        title="Delete Sequence"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (robots.length === 0) {
    return (
      <NoRobotsLock 
        title="Control Panel Restricted"
        message="You must pair a physical Grabber robotic device with your profile to access the manual control interface, live stream feeds, and safety triggers."
      />
    );
  }

  const coords = calculateCoordinates();

  return (
    <div ref={contentRef} className="space-y-12 pb-20">
      {/* Header */}
      <div data-animate className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
             <Terminal size={12} /> Real-time Control
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Manual Interface</h1>
          <p className="text-lg text-slate-500 mt-2 font-medium max-w-xl mb-4">
            Precise robotic arm manipulation and low-latency visual feedback.
          </p>
          <div className="relative inline-block mt-2">
            <select
              value={selectedRobotId}
              onChange={(e) => setSelectedRobotId(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl font-bold text-sm outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all shadow-sm"
            >
              {robots.length === 0 ? (
                <option value="">No robots available</option>
              ) : (
                robots.map(robot => (
                  <option key={robot.id} value={robot.id}>
                    {robot.name || `Robot ${robot.robot_id}`} ({robot.status || 'OFFLINE'})
                  </option>
                ))
              )}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
             {[1, 2, 3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {i}
               </div>
             ))}
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Operators</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Control Area */}
        <div data-animate className="lg:col-span-2 space-y-10">
          {/* Camera Feed Container */}
          <div ref={cameraContainerRef} className={`glass-card overflow-hidden group relative shadow-2xl ${isFullScreen ? 'fixed inset-0 z-[100] !rounded-none w-full h-full' : 'h-[500px]'}`}>
            <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
              {/* Actual Camera Feed */}
              {cameraUrl && !streamError && (
                <img 
                  ref={imageRef}
                  src={getStreamUrl(cameraUrl)} 
                  crossOrigin="anonymous"
                  alt="ESP32-CAM Stream" 
                  className="w-full h-full object-cover"
                  onError={() => setStreamError(true)}
                />
              )}
              {/* Simulated Camera Feed / Fallback */}
              {(!cameraUrl || streamError) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 gap-6 bg-slate-950 z-0">
                  <div className="relative">
                    <Video size={80} className="opacity-20 animate-pulse" />
                    <div className="absolute inset-0 bg-brand-accent/30 blur-[60px] rounded-full"></div>
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="font-black tracking-[0.3em] uppercase text-[10px] text-white/40">Feed: {selectedRobot ? (selectedRobot.name || selectedRobot.robot_id) : 'NO_SIGNAL'}</p>
                    <p className="text-[10px] font-bold text-red-500 uppercase">{streamError ? 'Stream Connection Failed' : 'No Stream URL Provided'}</p>
                  </div>
                </div>
              )}

              {/* HUD Elements */}
              <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                         selectedRobot?.status?.toLowerCase() === 'emergency_stop' ? 'bg-red-500' :
                         selectedRobot?.status?.toLowerCase() === 'error_state' || selectedRobot?.status?.toLowerCase() === 'error' ? 'bg-orange-500' :
                         selectedRobot?.status?.toLowerCase() === 'moving' ? 'bg-blue-500' :
                         selectedRobot?.status?.toLowerCase() === 'idle' || selectedRobot?.status?.toLowerCase() === 'executing' ? 'bg-emerald-500' : 'bg-slate-500'
                       }`}></span>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                         Status: {selectedRobot?.status || 'OFFLINE'}
                       </p>
                    </div>
                    <p className="text-white/60 font-mono text-[10px] bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                      {liveTelemetry.fps} FPS | {liveTelemetry.ping}ms PING | {speed}% SPEED
                    </p>
                  </div>
                  <div className="flex gap-3 pointer-events-auto items-center">
                    <input 
                      type="text" 
                      placeholder="Stream URL..."
                      value={cameraUrl}
                      onChange={(e) => { 
                         const val = e.target.value;
                         setCameraUrl(val); 
                         setStreamError(false); 
                         localStorage.setItem('grabber_camera_url', val);
                      }}
                      className="w-48 lg:w-64 bg-black/40 hover:bg-black/60 focus:bg-black/80 backdrop-blur-md rounded-xl text-white text-xs px-4 py-3 border border-white/10 outline-none transition-all placeholder:text-white/30 shadow-lg"
                    />
                    <button
                      onClick={handleToggleFullScreen}
                      className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all border border-white/10"
                      title={isFullScreen ? "Minimize" : "Maximize"}
                    >
                      {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                    <button
                      onClick={handleTakeSnapshot}
                      disabled={isCapturingSnapshot || !cameraUrl || streamError}
                      className={`p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all border border-white/10 ${
                        isCapturingSnapshot ? 'animate-pulse opacity-50' : 'active:scale-95'
                      }`}
                      title="Take Snapshot"
                    >
                      <Camera size={20} />
                    </button>
                    <button
                      onClick={handleToggleCameraRecording}
                      disabled={!cameraUrl || streamError}
                      className={`p-3 backdrop-blur-md rounded-xl text-white transition-all border ${
                        isRecordingCameraVideo ? 'bg-red-500 border-red-400 shadow-xl shadow-red-500/40' : 'bg-white/10 hover:bg-white/20 border-white/10'
                      }`}
                      title={isRecordingCameraVideo ? "Stop Recording" : "Record Video"}
                    >
                      {isRecordingCameraVideo ? <Square size={20} /> : <Video size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="font-mono text-[11px] text-white/50 space-y-1.5 bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                    <p className="flex justify-between gap-6"><span>X-AXIS:</span> <span className="text-white">{coords.x}</span></p>
                    <p className="flex justify-between gap-6"><span>Y-AXIS:</span> <span className="text-white">{coords.y}</span></p>
                    <p className="flex justify-between gap-6"><span>Z-AXIS:</span> <span className="text-white">{coords.z}</span></p>
                  </div>
                  {isRecordingCameraVideo && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-xl text-red-500 text-xs font-black uppercase tracking-widest animate-pulse pointer-events-auto">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                      REC: {Math.floor(cameraRecordingTime / 60)}:{((cameraRecordingTime % 60).toString().padStart(2, '0'))}
                    </div>
                  )}
                </div>
              </div>

              {/* Fullscreen Floating Controls Panel */}
              {isFullScreen && (
                <div className="absolute top-4 right-4 bottom-4 w-[380px] bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-y-auto custom-scrollbar z-50 pointer-events-auto text-white text-left shadow-2xl flex flex-col">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
                    <div>
                      <h2 className="text-sm font-black tracking-tight flex items-center gap-2">
                        <Sliders size={16} className="text-brand-accent animate-pulse" /> CONTROL WIDGET
                      </h2>
                      <p className="text-[9px] text-white/40 font-bold uppercase mt-1">Operator Mode: Fullscreen</p>
                    </div>
                    <button 
                      onClick={handleToggleFullScreen}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/75 hover:text-white"
                      title="Exit Fullscreen"
                    >
                      <Minimize2 size={16} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar">
                    {renderSafetyControls(true)}
                    {renderJoysticks(true)}
                    {renderKinematics(true)}
                    {renderPosesLibrary(true)}
                    {renderMotionSequencer(true)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Standard Controls (Only shown when not in fullscreen) */}
          {!isFullScreen && (
            <>
              {renderJoysticks(false)}
              <div data-animate className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderPosesLibrary(false)}
                {renderMotionSequencer(false)}
              </div>
            </>
          )}
        </div>

        {/* Sidebar Controls (Only shown when not in fullscreen) */}
        {!isFullScreen && (
          <div data-animate className="space-y-10">
            {renderKinematics(false)}
            {renderSafetyControls(false)}

            {/* Pro Tip Card */}
            <div className="glass-card p-10 bg-slate-900 text-white border-none relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Zap size={160} />
               </div>
              <div className="relative z-10">
                <h4 className="font-black uppercase tracking-widest text-[10px] text-brand-accent mb-4">Protocol Note</h4>
                <p className="text-lg font-bold leading-relaxed text-white/90">
                  Hold <span className="text-brand-accent px-2 py-0.5 bg-white/10 rounded-md">SHIFT</span> to lock axes during vector manipulation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <PopupDialog 
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
      />
    </div>
  );
}

