import { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import api from '../../api/axiosInstance';
import { useTelemetryWebSocket } from '../../hooks/useTelemetryWebSocket';
import { NoRobotsLock } from '../../components/ui/NoRobotsLock';
import { 
  Radio, 
  Zap, 
  Thermometer, 
  Compass, 
  Cpu,
  Brain,
  Box,
  Eye,
  BarChart3,
  Waves,
  Battery,
  BatteryCharging,
  BatteryWarning,
  Activity,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis,
  LineChart, Line, Legend
} from 'recharts';

export function TelemetryPage() {
  const contentRef = useRef(null);
  
  const [robots, setRobots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRobotId, setSelectedRobotId] = useState('');
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [currentTelemetry, setCurrentTelemetry] = useState(null);

  // Initialize GSAP
  useEffect(() => {
    const cards = contentRef.current?.querySelectorAll('[data-card]');
    if (cards) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.08, 
          ease: 'power2.out'
        }
      );
    }
  }, []);

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
  }, []);

  // Fetch historical data when robot changes
  useEffect(() => {
    if (!selectedRobotId) return;
    
    const fetchHistory = async () => {
      try {
        // Fetch from the API gateway telemetry route
        const response = await api.get(`/telemetry/${selectedRobotId}?limit=50`);
        // Map data to chart format
        const historyData = response.data.map((record, index, arr) => {
          let motion = 0;
          if (index > 0) {
              const prev = arr[index - 1];
              motion = Math.abs((record.base_angle || 0) - (prev.base_angle || 0)) + 
                       Math.abs((record.shoulder_angle || 0) - (prev.shoulder_angle || 0)) +
                       Math.abs((record.elbow_angle || 0) - (prev.elbow_angle || 0)) +
                       Math.abs((record.grip_angle || 0) - (prev.grip_angle || 0));
          }
          return {
            time: new Date(record.timestamp).toLocaleTimeString(),
            power: record.power || 0,
            current: record.current || 0,
            voltage: record.voltage || 0,
            base: record.base_angle || 0,
            shoulder: record.shoulder_angle || 0,
            elbow: record.elbow_angle || 0,
            grip: record.grip_angle || 0,
            motion: motion
          };
        });
        setTelemetryHistory(historyData);
        if (response.data.length > 0) {
            // Set current telemetry to latest historical if no realtime yet
            setCurrentTelemetry(response.data[response.data.length - 1]);
        }
      } catch (err) {
        console.error('Failed to fetch telemetry history', err);
      }
    };
    fetchHistory();
  }, [selectedRobotId]);

  // Handle Real-time WebSocket
  useTelemetryWebSocket((message) => {
    if (message.robotId !== robots.find(r => r.id === selectedRobotId)?.robot_id) return;
    
    const payload = message.data;
    
    // Update current telemetry
    const newTelemetry = {
      base_angle: payload.angles?.base || 0,
      shoulder_angle: payload.angles?.shoulder || 0,
      elbow_angle: payload.angles?.elbow || 0,
      grip_angle: payload.angles?.grip || 0,
      voltage: payload.power?.voltage || 0,
      current: payload.power?.current || 0,
      power: payload.power?.power || 0,
      peak_current: payload.power?.peakCurrent || 0,
      idle_current: payload.power?.idleCurrent || 0,
      moving_current: payload.power?.movingCurrent || 0,
      energy_wh: payload.power?.energyWh || 0,
      remaining_capacity: payload.power?.remainingCapacity || 0,
      runtime_mins: payload.power?.runtimeMins || 0,
    };
    setCurrentTelemetry(newTelemetry);

    // Update history chart
    setTelemetryHistory(prev => {
      let motion = 0;
      if (prev.length > 0) {
          const last = prev[prev.length - 1];
          motion = Math.abs(newTelemetry.base_angle - last.base) + 
                   Math.abs(newTelemetry.shoulder_angle - last.shoulder) +
                   Math.abs(newTelemetry.elbow_angle - last.elbow) +
                   Math.abs(newTelemetry.grip_angle - last.grip);
      }
      const newRecord = {
        time: new Date().toLocaleTimeString(),
        power: newTelemetry.power,
        current: newTelemetry.current,
        voltage: newTelemetry.voltage,
        base: newTelemetry.base_angle,
        shoulder: newTelemetry.shoulder_angle,
        elbow: newTelemetry.elbow_angle,
        grip: newTelemetry.grip_angle,
        motion: motion
      };
      const updated = [...prev, newRecord];
      if (updated.length > 50) updated.shift();
      return updated;
    });
  });

  const radarData = useMemo(() => [
    { subject: 'Base', A: currentTelemetry?.base_angle || 0, fullMark: 180 },
    { subject: 'Shoulder', A: currentTelemetry?.shoulder_angle || 0, fullMark: 180 },
    { subject: 'Elbow', A: currentTelemetry?.elbow_angle || 0, fullMark: 180 },
    { subject: 'Grip', A: currentTelemetry?.grip_angle || 0, fullMark: 180 },
  ], [currentTelemetry]);

  const getBatteryColor = (percent) => {
      if (percent > 60) return '#10b981'; // Green
      if (percent > 20) return '#f59e0b'; // Yellow
      return '#ef4444'; // Red
  };

  const batteryPercent = currentTelemetry?.remaining_capacity || 0;
  const batteryColor = getBatteryColor(batteryPercent);
  
  const motorStress = currentTelemetry?.peak_current > 0 
    ? (currentTelemetry.current / currentTelemetry.peak_current) * 100 
    : 0;

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
        title="Telemetry Data Restricted"
        message="You must pair a physical Grabber robotic device with your profile to view live battery, voltage, current, and joint kinematic telemetry logs."
      />
    );
  }

  return (
    <div ref={contentRef} className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Waves size={12} className="animate-pulse" /> Live Telemetry Stream
           </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">System Telemetry</h1>
          <p className="text-lg text-slate-500 mt-2 font-medium max-w-xl mb-4">
            Advanced real-time power monitoring and joint kinematics visualization.
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
                    {robot.name || `Robot ${robot.robot_id}`}
                  </option>
                ))
              )}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95">
              <BarChart3 size={16} /> Advanced Analysis
           </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Battery HUD */}
        <div data-card className="glass-card p-6 border-t-4" style={{ borderColor: batteryColor }}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Battery Status</h3>
                {batteryPercent > 20 ? <BatteryCharging size={20} color={batteryColor} /> : <BatteryWarning size={20} color={batteryColor} className="animate-pulse" />}
            </div>
            <div className="space-y-4">
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-slate-900">{batteryPercent.toFixed(0)}</span>
                    <span className="text-lg font-bold text-slate-400 mb-1">%</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Voltage: {(currentTelemetry?.voltage || 0).toFixed(2)}V</span>
                    <span>{currentTelemetry?.runtime_mins > 500 ? '> 8h' : `${(currentTelemetry?.runtime_mins || 0).toFixed(0)}m left`}</span>
                </div>
                {/* Progress Bar */}
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${batteryPercent}%`, backgroundColor: batteryColor }}></div>
                </div>
            </div>
        </div>

        {/* Current Draw */}
        <div data-card className="glass-card p-6 border-t-4 border-blue-500">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Current Draw</h3>
                <Zap size={20} className="text-blue-500" />
            </div>
            <div className="space-y-4">
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-slate-900">{(currentTelemetry?.current || 0).toFixed(0)}</span>
                    <span className="text-lg font-bold text-slate-400 mb-1">mA</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Idle: {(currentTelemetry?.idle_current || 0).toFixed(0)}mA</span>
                    <span>Peak: {(currentTelemetry?.peak_current || 0).toFixed(0)}mA</span>
                </div>
                {/* Motor Stress Bar */}
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, motorStress)}%` }}></div>
                </div>
            </div>
        </div>

        {/* Power Consumption */}
        <div data-card className="glass-card p-6 border-t-4 border-purple-500">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Power Usage</h3>
                <Activity size={20} className="text-purple-500" />
            </div>
            <div className="space-y-4">
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-slate-900">{(currentTelemetry?.power || 0).toFixed(0)}</span>
                    <span className="text-lg font-bold text-slate-400 mb-1">mW</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Moving Avg: {(currentTelemetry?.moving_current || 0).toFixed(0)}mA</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `100%`, opacity: 0.5 }}></div>
                </div>
            </div>
        </div>

        {/* Energy Used */}
        <div data-card className="glass-card p-6 border-t-4 border-emerald-500">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Total Energy</h3>
                <Box size={20} className="text-emerald-500" />
            </div>
            <div className="space-y-4">
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-slate-900">{(currentTelemetry?.energy_wh || 0).toFixed(2)}</span>
                    <span className="text-lg font-bold text-slate-400 mb-1">Wh</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Session Accumulation</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-300 w-full"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Raw Joint Angles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { label: 'Base J1', value: currentTelemetry?.base_angle || 0, max: 180, color: '#3b82f6' },
            { label: 'Shoulder J2', value: currentTelemetry?.shoulder_angle || 0, max: 180, color: '#8b5cf6' },
            { label: 'Elbow J3', value: currentTelemetry?.elbow_angle || 0, max: 180, color: '#10b981' },
            { label: 'Grip J4', value: currentTelemetry?.grip_angle || 0, max: 180, color: '#f59e0b' },
        ].map((joint, idx) => (
            <div key={idx} data-card className="glass-card p-5 relative overflow-hidden group">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{joint.label}</h4>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900">{joint.value.toFixed(1)}</span>
                            <span className="text-[10px] font-bold text-slate-400">°</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(joint.value / joint.max) * 100}%`, backgroundColor: joint.color }}></div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Advanced Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Power Dynamics vs Motion Chart */}
        <div data-card className="lg:col-span-2 glass-card p-6">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Activity size={18} /></div>
                    Power Dynamics vs Motion Activity
                </h3>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                        <Area yAxisId="left" type="monotone" dataKey="power" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPower)" name="Power (mW)" />
                        <Area yAxisId="right" type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" name="Current (mA)" />
                        <Line yAxisId="left" type="monotone" dataKey="motion" stroke="#10b981" strokeWidth={2} dot={false} name="Motion Activity (deg/s)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Robotic Posture Radar */}
        <div data-card className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Compass size={18} /></div>
                    Posture Signature
                </h3>
            </div>
            <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 180]} tick={false} axisLine={false} />
                        <Radar name="Angle" dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.3} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Kinematics & Sag Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kinematic History */}
        <div data-card className="glass-card p-6">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Box size={18} /></div>
                    Kinematic Synchronization
                </h3>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 180]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                        <Line type="monotone" dataKey="base" stroke="#3b82f6" strokeWidth={2} dot={false} name="Base" />
                        <Line type="monotone" dataKey="shoulder" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Shoulder" />
                        <Line type="monotone" dataKey="elbow" stroke="#10b981" strokeWidth={2} dot={false} name="Elbow" />
                        <Line type="monotone" dataKey="grip" stroke="#f59e0b" strokeWidth={2} dot={false} name="Grip" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Battery Sag Profile */}
        <div data-card className="glass-card p-6">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Zap size={18} /></div>
                    Battery Sag Profile
                </h3>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" dataKey="current" name="Current" unit="mA" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis type="number" dataKey="voltage" name="Voltage" unit="V" domain={['dataMin - 0.2', 'dataMax + 0.2']} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <ZAxis type="number" range={[40, 40]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Scatter name="Sag" data={telemetryHistory} fill="#f59e0b" fillOpacity={0.6} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

    </div>
  );
}
