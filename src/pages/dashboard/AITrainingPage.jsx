import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  ScanFace,
  Power,
  X,
  Camera,
  Upload,
  Play,
  Square,
  Save,
  HandMetal,
  Mic,
  Package,
  ArrowRightLeft
} from 'lucide-react';
import gsap from 'gsap';
import api from '../../api/axiosInstance';
import { PopupDialog } from '../../components/ui/PopupDialog';
import { NoRobotsLock } from '../../components/ui/NoRobotsLock';

// Import modular tab components
import { ControlCenterTab } from './ai-tabs/ControlCenterTab';

import { FaceRecognitionTab } from './ai-tabs/FaceRecognitionTab';
import { GestureControlTab } from './ai-tabs/GestureControlTab';
import { VoiceCommandsTab } from './ai-tabs/VoiceCommandsTab';
import { PickPlaceTab } from './ai-tabs/PickPlaceTab';
import { SmartSortingTab } from './ai-tabs/SmartSortingTab';

export function AITrainingPage() {
  const containerRef = useRef(null);
  const pickCanvasRef = useRef(null);
  const objectCanvasRef = useRef(null);

  // Navigation tabs: 'control-center' | 'obj-detect' | 'face-rec' | 'gesture' | 'voice' | 'pick-place' | 'sorting'
  const [activeTab, setActiveTab] = useState('control-center');

  const defaultTasks = [
    { id: "obj-detect", title: "Object Detection", status: "idle", accuracy: "98.5%", latency: "12ms" },
    { id: "face-rec", title: "Face Recognition", status: "idle", accuracy: "95.2%", latency: "15ms" },
    { id: "gesture", title: "Hand Gesture Controls", status: "idle", accuracy: "92.1%", latency: "22ms" },
    { id: "voice", title: "Voice Commands", status: "idle", accuracy: "88.4%", latency: "110ms" },
    { id: "pick-place", title: "AI Pick & Place", status: "idle", accuracy: "96.8%", latency: "45ms" },
    { id: "sorting", title: "Smart Sorting Assistant", status: "idle", accuracy: "94.0%", latency: "30ms" }
  ];

  const [tasks, setTasks] = useState(defaultTasks);
  const [robots, setRobots] = useState([]);
  const [isLoadingRobots, setIsLoadingRobots] = useState(true);

  // Resource Monitoring Simulated Stats
  // --- MODULE CONFIGURATION STATES ---



  // 2. Face Recognition State
  const [unknownPersonAction, setUnknownPersonAction] = useState('Notify');
  const [guidedFaceStep, setGuidedFaceStep] = useState(0); // 0 to 6
  const [faceLogs, setFaceLogs] = useState([
    { time: '10:18', message: 'Thathsara Recognized', status: 'authorized' },
    { time: '10:15', message: 'Unknown Person Detected', status: 'unknown' },
    { time: '10:01', message: 'John Perera Recognized', status: 'authorized' },
    { time: '09:42', message: 'Supervisor Authorized System', status: 'authorized' }
  ]);

  // 3. Hand Gesture Control State
  const [gestureMappings, setGestureMappings] = useState({
    'Open Hand': 'STOP',
    'Fist': 'CLOSE GRIPPER',
    'Thumb Up': 'OPEN GRIPPER',
    'Thumb Down': 'HOME POSITION',
    'Point Left': 'MOVE LEFT',
    'Point Right': 'MOVE RIGHT'
  });
  const [gestureSafetyEnabled, setGestureSafetyEnabled] = useState(true);
  const [gestureControlEnabled, setGestureControlEnabled] = useState(false);
  const [gestureWizardStep, setGestureWizardStep] = useState(0); // 0 to 4
  const [newGestureName, setNewGestureName] = useState('');
  const [gestureSafetyConfirmOpen, setGestureSafetyConfirmOpen] = useState(false);
  const [pendingGestureAction, setPendingGestureAction] = useState(null);

  // 4. Voice Command State
  const [voiceCommands, setVoiceCommands] = useState([
    { id: 1, phrase: 'Open Gripper', action: 'RELEASE', target: 'gripper' },
    { id: 2, phrase: 'Close Gripper', action: 'GRAB', target: 'gripper' },
    { id: 3, phrase: 'Move Left', action: 'MOVE_LEFT', target: 'arm' },
    { id: 4, phrase: 'Move Right', action: 'MOVE_RIGHT', target: 'arm' },
    { id: 5, phrase: 'Home Position', action: 'MOVE_HOME', target: 'arm' },
    { id: 6, phrase: 'Emergency Stop', action: 'STOP_ALL', target: 'all' }
  ]);
  const [voiceMappings, setVoiceMappings] = useState([
    { phrase: 'Pick Bottle', action: 'Pick And Place', target: 'Bottle' },
    { phrase: 'Tidy Desk', action: 'Smart Sorting', target: 'All Items' }
  ]);
  const [newVoicePhrase, setNewVoicePhrase] = useState('');
  const [newVoiceAction, setNewVoiceAction] = useState('UNASSIGNED');
  const [newVoiceTarget, setNewVoiceTarget] = useState('');
  const [wakeWord, setWakeWord] = useState('Hey Robot');
  const [voiceLanguage, setVoiceLanguage] = useState('English (US)');

  // Voice Tester States
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('Ready for speech simulation...');
  const [voiceIntent, setVoiceIntent] = useState('None');
  const [voiceAction, setVoiceAction] = useState('None');

  // 5. AI Pick & Place State
  const [selectionRule, setSelectionRule] = useState('Highest Priority');
  const [graspForces, setGraspForces] = useState({
    Bottle: 'Medium',
    Cube: 'High',
    Cup: 'Low',
    Phone: 'Medium'
  });
  const [workspaceCoords, setWorkspaceCoords] = useState({
    pickMinX: -100,
    pickMaxX: 100,
    dropMinX: 150,
    dropMaxX: 250
  });
  const [pickStrategy, setPickStrategy] = useState('Top-Down Vertical');
  const [isSimulatingPick, setIsSimulatingPick] = useState(false);

  // 6. Smart Sorting State
  const [sortingCategories, setSortingCategories] = useState(['Plastic', 'Metal', 'Electronics', 'Tools', 'Stationery']);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [sortingRules, setSortingRules] = useState([
    { id: 1, object: 'Bottle', bin: 'Plastic' },
    { id: 2, object: 'Phone', bin: 'Electronics' },
    { id: 3, object: 'Cube', bin: 'Metal' }
  ]);
  const [newRuleObject, setNewRuleObject] = useState('');
  const [newRuleBin, setNewRuleBin] = useState('');
  const [showSortingSuggestion, setShowSortingSuggestion] = useState(true);
  const [sortingSimulating, setSortingSimulating] = useState(false);
  const [sortingSimResult, setSortingSimResult] = useState('Ready');

  // Map task IDs to icons
  const iconMap = {
    'obj-detect': ScanFace,
    'face-rec': ScanFace,
    'gesture': HandMetal,
    'voice': Mic,
    'pick-place': Package,
    'sorting': ArrowRightLeft
  };

  // Map task IDs to colors
  const colorMap = {
    'obj-detect': { gradient: 'from-blue-500 to-indigo-600', lightBg: 'bg-blue-50/50', border: 'border-blue-200' },
    'face-rec': { gradient: 'from-emerald-500 to-teal-600', lightBg: 'bg-emerald-50/50', border: 'border-emerald-200' },
    'gesture': { gradient: 'from-purple-500 to-fuchsia-600', lightBg: 'bg-purple-50/50', border: 'border-purple-200' },
    'voice': { gradient: 'from-orange-500 to-red-600', lightBg: 'bg-orange-50/50', border: 'border-orange-200' },
    'pick-place': { gradient: 'from-brand-accent to-brand-secondary', lightBg: 'bg-brand-accent/5', border: 'border-blue-200' },
    'sorting': { gradient: 'from-amber-400 to-orange-500', lightBg: 'bg-amber-50/50', border: 'border-amber-200' }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get('/ai/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch AI tasks", err);
    }
  };

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await api.get('/robots');
        setRobots(response.data);
      } catch (err) {
        console.error('Failed to fetch robots', err);
      } finally {
        setIsLoadingRobots(false);
      }
    };
    fetchRobots();

    fetchTasks();
    const interval = setInterval(() => {
      fetchTasks();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // GSAP Tab Switching Animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const endpoint = currentStatus === 'active' ? '/ai/tasks/stop' : '/ai/tasks/start';
      await api.post(endpoint, { task_id: taskId });
      await fetchTasks();
    } catch (err) {
      console.error(`Failed to toggle task ${taskId}`, err);
    }
  };

  const handleStartAll = async () => {
    try {
      await api.post('/ai/tasks/start-all');
      await fetchTasks();
    } catch (err) {
      console.error("Failed to start all tasks", err);
    }
  };

  const handleStopAll = async () => {
    try {
      await api.post('/ai/tasks/stop-all');
      await fetchTasks();
    } catch (err) {
      console.error("Failed to stop all tasks", err);
    }
  };



  const taskDescriptions = {
    'obj-detect': 'Real-time object bounding boxes for identifying tools and blocks on the workbench.',
    'face-rec': 'Operator identification and security authentication using facial features.',
    'gesture': 'Teleoperate the grabber arm remotely using hand gestures via camera.',
    'voice': 'Natural language voice inputs for hands-free macro movements and tasks.',
    'pick-place': 'Autonomous pick-and-place grabbing based on real-time spatial detection.',
    'sorting': 'Smart block classification and automated color bin sorting.'
  };

  // Dynamic Routing mapping
  const renderTabContent = () => {
    switch (activeTab) {
      case 'face-rec':
        return (
          <FaceRecognitionTab
            unknownPersonAction={unknownPersonAction}
            setUnknownPersonAction={setUnknownPersonAction}
            guidedFaceStep={guidedFaceStep}
            setGuidedFaceStep={setGuidedFaceStep}
            faceLogs={faceLogs}
            setActiveTab={setActiveTab}
          />
        );
      case 'gesture':
        return (
          <GestureControlTab
            gestureMappings={gestureMappings}
            setGestureMappings={setGestureMappings}
            gestureSafetyEnabled={gestureSafetyEnabled}
            setGestureSafetyEnabled={setGestureSafetyEnabled}
            gestureControlEnabled={gestureControlEnabled}
            setGestureControlEnabled={setGestureControlEnabled}
            gestureWizardStep={gestureWizardStep}
            setGestureWizardStep={setGestureWizardStep}
            newGestureName={newGestureName}
            setNewGestureName={setNewGestureName}
            setGestureSafetyConfirmOpen={setGestureSafetyConfirmOpen}
            setPendingGestureAction={setPendingGestureAction}
            setActiveTab={setActiveTab}
          />
        );
      case 'voice':
        return (
          <VoiceCommandsTab
            robots={robots}
            voiceCommands={voiceCommands}
            setVoiceCommands={setVoiceCommands}
            voiceMappings={voiceMappings}
            setVoiceMappings={setVoiceMappings}
            newVoicePhrase={newVoicePhrase}
            setNewVoicePhrase={setNewVoicePhrase}
            newVoiceAction={newVoiceAction}
            setNewVoiceAction={setNewVoiceAction}
            newVoiceTarget={newVoiceTarget}
            setNewVoiceTarget={setNewVoiceTarget}
            wakeWord={wakeWord}
            setWakeWord={setWakeWord}
            voiceLanguage={voiceLanguage}
            setVoiceLanguage={setVoiceLanguage}
            isListening={isListening}
            setIsListening={setIsListening}
            voiceTranscript={voiceTranscript}
            setVoiceTranscript={setVoiceTranscript}
            voiceIntent={voiceIntent}
            setVoiceIntent={setVoiceIntent}
            voiceAction={voiceAction}
            setVoiceAction={setVoiceAction}
            setActiveTab={setActiveTab}
          />
        );
      case 'pick-place':
        return (
          <PickPlaceTab
            selectionRule={selectionRule}
            setSelectionRule={setSelectionRule}
            graspForces={graspForces}
            setGraspForces={setGraspForces}
            workspaceCoords={workspaceCoords}
            setWorkspaceCoords={setWorkspaceCoords}
            pickStrategy={pickStrategy}
            setPickStrategy={setPickStrategy}
            isSimulatingPick={isSimulatingPick}
            setIsSimulatingPick={setIsSimulatingPick}
            pickCanvasRef={pickCanvasRef}
            setActiveTab={setActiveTab}
          />
        );
      case 'sorting':
        return (
          <SmartSortingTab
            sortingCategories={sortingCategories}
            setSortingCategories={setSortingCategories}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            sortingRules={sortingRules}
            setSortingRules={setSortingRules}
            newRuleObject={newRuleObject}
            setNewRuleObject={setNewRuleObject}
            newRuleBin={newRuleBin}
            setNewRuleBin={setNewRuleBin}
            showSortingSuggestion={showSortingSuggestion}
            setShowSortingSuggestion={setShowSortingSuggestion}
            sortingSimulating={sortingSimulating}
            setSortingSimulating={setSortingSimulating}
            sortingSimResult={sortingSimResult}
            setSortingSimResult={setSortingSimResult}
            setActiveTab={setActiveTab}
          />
        );
      case 'control-center':
      default:
        return (
          <ControlCenterTab
            tasks={tasks}
            handleToggleTask={handleToggleTask}
            setActiveTab={setActiveTab}
            colorMap={colorMap}
            iconMap={iconMap}
            taskDescriptions={taskDescriptions}
          />
        );
    }
  };

  if (isLoadingRobots) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (robots.length === 0) {
    return (
      <NoRobotsLock 
        title="AI Modules Restricted"
        message="You must pair a physical Grabber robotic device with your profile to configure computer vision tasks, face recognition databases, and gesture/voice control models."
      />
    );
  }

  return (
    <div className="space-y-8 relative">

      {/* Top Level Sub-Navigation Tab Bar */}
      <div className="bg-white/80 border border-slate-200/50 shadow-glass rounded-2xl p-2.5 flex items-center overflow-x-auto gap-1 scrollbar-thin">
        {[
          { id: 'control-center', label: '🔥 Control Center' },
          { id: 'face-rec', label: '👤 Face Recognition' },
          { id: 'gesture', label: '✋ Gesture Control' },
          { id: 'voice', label: '🎤 Voice Commands' },
          { id: 'pick-place', label: '🎯 Pick & Place' },
          { id: 'sorting', label: '📊 Smart Sorting' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${activeTab === tab.id ? 'bg-gradient-to-r from-brand-accent to-brand-secondary text-white shadow-md shadow-brand-accent/20' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/65'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-accent/10 rounded-2xl text-brand-accent">
            <Brain size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Task Orchestrator</h1>
            <p className="text-slate-500 text-sm mt-1">Activate computer vision models, custom gestures, and automated task pipelines.</p>
          </div>
        </div>

        {activeTab === 'control-center' && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleStopAll}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition shadow-sm text-sm"
            >
              <Square size={16} /> Stop All
            </button>
            <button
              onClick={handleStartAll}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-accent to-brand-secondary hover:opacity-90 text-white rounded-xl font-medium transition shadow-lg shadow-brand-accent/20 text-sm"
            >
              <Play size={16} /> Start All
            </button>
          </div>
        )}
      </div>

      {/* Dynamically Router View wrapper with ref for animations */}
      <div ref={containerRef}>
        {renderTabContent()}
      </div>
    </div>
  );
}
