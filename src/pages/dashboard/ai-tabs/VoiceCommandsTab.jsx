import React from 'react';
import { 
  Mic, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Plus, 
  Trash2, 
  PlayCircle,
  RefreshCw,
  Sliders
} from 'lucide-react';
import api from '../../../api/axiosInstance';

export function VoiceCommandsTab({
  voiceCommands,
  setVoiceCommands,
  voiceMappings,
  setVoiceMappings,
  newVoicePhrase,
  setNewVoicePhrase,
  newVoiceAction,
  setNewVoiceAction,
  newVoiceTarget,
  setNewVoiceTarget,
  wakeWord,
  setWakeWord,
  voiceLanguage,
  setVoiceLanguage,
  isListening,
  setIsListening,
  voiceTranscript,
  setVoiceTranscript,
  voiceIntent,
  setVoiceIntent,
  voiceAction,
  setVoiceAction,
  setActiveTab
}) {

  React.useEffect(() => {
    const fetchVoiceSettings = async () => {
      try {
        const res = await api.get('/ai/voice/settings');
        setVoiceCommands(res.data.commands);
        setWakeWord(res.data.wake_word);
        setVoiceLanguage(res.data.language);
      } catch (err) {
        console.error("Failed to load voice settings", err);
      }
    };
    fetchVoiceSettings();
  }, []);

  const triggerVoiceListenSim = async () => {
    if (isListening) return;
    setIsListening(true);
    setVoiceTranscript("Simulating voice input stream...");
    setVoiceIntent("None");
    setVoiceAction("None");
    
    try {
      const res = await api.post('/ai/voice/test');
      
      // Step 1: Speak phrase
      setTimeout(() => {
        setVoiceTranscript(`"${wakeWord}, ${res.data.phrase.toLowerCase()}"`);
      }, 1500);

      // Step 2: Extract Intent
      setTimeout(() => {
        setVoiceIntent(res.data.intent);
      }, 3000);

      // Step 3: Trigger Action
      setTimeout(() => {
        setVoiceAction(res.data.action);
        setIsListening(false);
      }, 4500);
    } catch (err) {
      console.error("Failed to trigger voice simulator", err);
      setIsListening(false);
      setVoiceTranscript("Simulation failed. Make sure voice command mappings are configured.");
    }
  };

  const removeVoiceCommand = async (id) => {
    try {
      const res = await api.delete(`/ai/voice/commands/${id}`);
      setVoiceCommands(res.data.commands);
    } catch (err) {
      console.error("Failed to remove voice command rule", err);
    }
  };

  const addVoiceCommand = async (e) => {
    e.preventDefault();
    if (!newVoicePhrase.trim() || newVoiceAction === 'UNASSIGNED') return;
    try {
      const res = await api.post('/ai/voice/commands', {
        phrase: newVoicePhrase,
        action: newVoiceAction,
        target: newVoiceTarget || 'any'
      });
      setVoiceCommands(res.data.commands);
      setNewVoicePhrase('');
      setNewVoiceAction('UNASSIGNED');
      setNewVoiceTarget('');
    } catch (err) {
      console.error("Failed to add voice command rule", err);
    }
  };

  const updateWakeWord = async (word) => {
    try {
      const res = await api.post('/ai/voice/settings', {
        wake_word: word,
        language: voiceLanguage
      });
      setWakeWord(res.data.wake_word);
    } catch (err) {
      console.error("Failed to update wake word", err);
    }
  };

  const updateLanguage = async (lang) => {
    try {
      const res = await api.post('/ai/voice/settings', {
        wake_word: wakeWord,
        language: lang
      });
      setVoiceLanguage(res.data.language);
    } catch (err) {
      console.error("Failed to update language setting", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Module Configuration</span>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">🎤 Voice Commands</h2>
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine Status</span>
              <span className="block text-sm font-bold text-slate-800 mt-1">Sherpa-ONNX</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
              <span className="block text-sm font-bold text-emerald-600 mt-1">94.8%</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Commands</span>
              <span className="block text-sm font-bold text-slate-800 mt-1">{voiceCommands.length} Mapped</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wake Word</span>
              <span className="block text-xs font-bold text-emerald-600 mt-1.5 truncate">"{wakeWord}"</span>
            </div>
          </div>

          {/* Voice mappings list */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sliders size={18} className="text-amber-500" /> Voice Phrase Mappings
            </h3>
            <p className="text-xs text-slate-400 mb-6">Map spoken commands to specific robotic macro actions.</p>

            <div className="space-y-3 mb-6">
              {voiceCommands.map((cmd) => (
                <div key={cmd.id} className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs">
                  <div className="flex-1 min-w-0">
                    <span className="block font-bold text-slate-800 truncate">"{cmd.phrase}"</span>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">Target: {cmd.target}</span>
                  </div>
                  
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg font-black text-amber-700 uppercase text-[10px]">
                    {cmd.action}
                  </span>

                  <button 
                    onClick={() => removeVoiceCommand(cmd.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom voice mapping builder */}
            <form onSubmit={addVoiceCommand} className="border-t border-slate-100 pt-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-500">Add Voice Command Rule</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input 
                  type="text" 
                  placeholder='Phrase (e.g. "go to sleep")'
                  value={newVoicePhrase}
                  onChange={(e) => setNewVoicePhrase(e.target.value)}
                  className="px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                />
                <select 
                  value={newVoiceAction}
                  onChange={(e) => setNewVoiceAction(e.target.value)}
                  className="px-3 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-700"
                >
                  <option value="UNASSIGNED">SELECT ACTION</option>
                  <option value="MOVE_HOME">MOVE HOME</option>
                  <option value="STOP_ALL">EMERGENCY STOP</option>
                  <option value="DANCE">DANCE MACRO</option>
                  <option value="GRAB">GRAB OBJECT</option>
                  <option value="RELEASE">RELEASE OBJECT</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Target (Optional: e.g. Bottle)"
                  value={newVoiceTarget}
                  onChange={(e) => setNewVoiceTarget(e.target.value)}
                  className="px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                >
                  <Plus size={12} /> Add Rule
                </button>
              </div>
            </form>
          </div>

          {/* Interactive tester */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Mic size={18} className="text-amber-500" /> Interactive Voice Command Tester
            </h3>
            <p className="text-xs text-slate-400 mb-6">Test the speech recognition engine and intent model parsing logic.</p>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">Simulate Mic Capture</span>
                <button 
                  onClick={triggerVoiceListenSim}
                  disabled={isListening}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition ${isListening ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-950 text-white hover:bg-slate-800'}`}
                >
                  {isListening ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" /> Analyzing Audio...
                    </>
                  ) : (
                    <>
                      <Mic size={12} /> Start Speaking Test
                    </>
                  )}
                </button>
              </div>

              {/* Status parameters */}
              <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-3 font-mono text-[11px] text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold">Transcript:</span>
                  <span className="text-slate-800 max-w-[280px] text-right font-semibold">{voiceTranscript}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold">Parsed Intent:</span>
                  <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-indigo-700 font-bold">{voiceIntent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Result Action:</span>
                  <span className="font-bold text-emerald-600">{voiceAction}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          
          {/* Wake Word config */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Volume2 size={18} className="text-amber-500" /> Wake Word Settings
            </h3>
            <p className="text-xs text-slate-500 mb-4">Set the hotword used to trigger model analysis.</p>
            
            <div className="space-y-3">
              {['Hey Robot', 'OK Grabber', 'Listen Robot', 'Wake Grabber'].map(word => (
                <label key={word} className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer hover:bg-slate-50 transition ${wakeWord === word ? 'border-amber-600 bg-amber-50/10' : 'border-slate-100'}`}>
                  <input 
                    type="radio"
                    name="wakewordRadio"
                    checked={wakeWord === word}
                    onChange={() => updateWakeWord(word)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-700">"{word}"</span>
                </label>
              ))}
            </div>
          </div>

          {/* Languages selection */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Volume1 size={18} className="text-amber-500" /> Language Configuration
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-semibold">Select vocal analysis language model:</p>
            
            <div className="space-y-3">
              {['English (US)', 'English (UK)', 'Spanish (ES)', 'German (DE)'].map(lang => (
                <label key={lang} className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer hover:bg-slate-50 transition ${voiceLanguage === lang ? 'border-amber-600 bg-amber-50/10' : 'border-slate-100'}`}>
                  <input 
                    type="radio"
                    name="voiceLangRadio"
                    checked={voiceLanguage === lang}
                    onChange={() => updateLanguage(lang)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-700">{lang}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
