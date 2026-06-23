import React from 'react';
import { 
  ArrowRightLeft, 
  Brain, 
  Sliders, 
  Activity, 
  Upload, 
  Database, 
  Trash2,
  Plus
} from 'lucide-react';
import api from '../../../api/axiosInstance';

export function SmartSortingTab({
  sortingCategories,
  setSortingCategories,
  newCategoryName,
  setNewCategoryName,
  sortingRules,
  setSortingRules,
  newRuleObject,
  setNewRuleObject,
  newRuleBin,
  setNewRuleBin,
  showSortingSuggestion,
  setShowSortingSuggestion,
  sortingSimulating,
  setSortingSimulating,
  sortingSimResult,
  setSortingSimResult,
  setActiveTab
}) {

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/ai/sorting/settings');
        setSortingCategories(res.data.categories);
        setSortingRules(res.data.rules);
      } catch (err) {
        console.error("Failed to fetch sorting settings", err);
      }
    };
    fetchSettings();
  }, []);

  const addSortingCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const res = await api.post('/ai/sorting/categories', {
        name: newCategoryName
      });
      setSortingCategories(res.data.categories);
      setNewCategoryName('');
    } catch (err) {
      console.error("Failed to add sorting category", err);
    }
  };

  const removeSortingCategory = async (cat) => {
    try {
      const res = await api.delete(`/ai/sorting/categories/${encodeURIComponent(cat)}`);
      setSortingCategories(res.data.categories);
      setSortingRules(res.data.rules);
    } catch (err) {
      console.error("Failed to remove sorting category", err);
    }
  };

  const addSortingRule = async (e) => {
    e.preventDefault();
    if (!newRuleObject.trim() || !newRuleBin.trim()) return;
    try {
      const res = await api.post('/ai/sorting/rules', {
        object_name: newRuleObject,
        bin_name: newRuleBin
      });
      setSortingRules(res.data.rules);
      setNewRuleObject('');
      setNewRuleBin('');
    } catch (err) {
      console.error("Failed to add sorting rule", err);
    }
  };

  const removeSortingRule = async (id) => {
    try {
      const res = await api.delete(`/ai/sorting/rules/${id}`);
      setSortingRules(res.data.rules);
    } catch (err) {
      console.error("Failed to remove sorting rule", err);
    }
  };

  const acceptRecommendationRule = async () => {
    try {
      const res = await api.post('/ai/sorting/rules', {
        object_name: 'Mouse',
        bin_name: 'Electronics Bin'
      });
      setSortingRules(res.data.rules);
      setShowSortingSuggestion(false);
    } catch (err) {
      console.error("Failed to accept recommendation rule", err);
    }
  };

  const triggerSortingSim = async () => {
    if (sortingSimulating) return;
    setSortingSimulating(true);
    setSortingSimResult("Loading camera frame snapshot...");
    
    try {
      const res = await api.post('/ai/sorting/simulate');
      
      setTimeout(() => {
        setSortingSimResult("Running YOLOv8 class identification...");
      }, 1200);

      setTimeout(() => {
        setSortingSimResult(res.data.result_message);
        setSortingSimulating(false);
      }, 2800);
    } catch (err) {
      console.error("Failed to run sorting simulation", err);
      setSortingSimulating(false);
      setSortingSimResult("Simulation failed. Make sure sorting rules are configured.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Module Configuration</span>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">📊 Smart Sorting Assistant</h2>
        </div>
        <button 
          onClick={() => setActiveTab('control-center')}
          className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-semibold"
        >
          ← Back to Control Center
        </button>
      </div>

      {/* Suggestion banner */}
      {showSortingSuggestion && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-5 relative overflow-hidden flex items-start gap-4 shadow-sm">
          <div className="p-3 bg-indigo-100 text-indigo-800 rounded-2xl flex-shrink-0 animate-bounce">
            <Brain size={20} />
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h4 className="font-extrabold text-indigo-900 text-sm">Sorting Rule Recommendation</h4>
            <p className="text-xs text-indigo-700 leading-relaxed mt-1">
              AI Suggestion: We noticed you frequently detect <strong>"Mouse"</strong> items. Would you like to map <strong>"Mouse"</strong> to <strong>"Electronics Bin"</strong>?
            </p>
            <div className="flex gap-2.5 mt-3">
              <button 
                onClick={acceptRecommendationRule}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black shadow"
              >
                Accept Rule
              </button>
              <button 
                onClick={() => setShowSortingSuggestion(false)}
                className="px-3 py-1.5 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button 
            onClick={() => setShowSortingSuggestion(false)}
            className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dashboard stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine Status</span>
              <span className="block text-sm font-bold text-slate-800 mt-1">Active (Rule Set)</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classification Accuracy</span>
              <span className="block text-sm font-bold text-emerald-600 mt-1">98.1%</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rules Mapped</span>
              <span className="block text-sm font-bold text-slate-800 mt-1">{sortingRules.length} Rules</span>
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Routed Today</span>
              <span className="block text-sm font-bold text-slate-800 mt-1">84 Objects</span>
            </div>
          </div>

          {/* Active categories manager */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Database size={18} className="text-indigo-500" /> Bin Sorting Categories
            </h3>
            <p className="text-xs text-slate-400 mb-6">Manage recognized target bins inside workspace coordinate field.</p>

            <div className="flex flex-wrap gap-2.5 mb-6">
              {sortingCategories.map(cat => (
                <div key={cat} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                  <span>{cat}</span>
                  <button 
                    onClick={() => removeSortingCategory(cat)}
                    className="text-slate-400 hover:text-red-500 font-bold transition ml-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Category builder */}
            <form onSubmit={addSortingCategory} className="border-t border-slate-100 pt-6 flex gap-2">
              <input 
                type="text" 
                placeholder="New Bin Category (e.g. Metals Bin)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
              >
                <Plus size={12} /> Add Bin
              </button>
            </form>
          </div>

          {/* Logical rules builder */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sliders size={18} className="text-indigo-500" /> Routing Rules Builder
            </h3>
            <p className="text-xs text-slate-400 mb-6">Create IF-THEN conditional sorting logic triggered upon object detection.</p>

            <div className="space-y-3 mb-6">
              {sortingRules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <span className="text-slate-400">IF</span> 
                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded">{rule.object}</span>
                    <span className="text-slate-400">THEN route to</span>
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded">{rule.bin}</span>
                  </div>
                  <button 
                    onClick={() => removeSortingRule(rule.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Form to add rule */}
            <form onSubmit={addSortingRule} className="border-t border-slate-100 pt-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-500">Create Logical Mapping</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">IF Object Detected</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bottle"
                    value={newRuleObject}
                    onChange={(e) => setNewRuleObject(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">THEN Route to Bin</label>
                  <select 
                    value={newRuleBin}
                    onChange={(e) => setNewRuleBin(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
                  >
                    <option value="">Select Destination Bin</option>
                    {sortingCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                >
                  <Plus size={12} /> Save Rule
                </button>
              </div>
            </form>
          </div>

        </div>

        <div className="space-y-6">
          
          {/* Sorting Assistant simulator */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <ArrowRightLeft size={18} className="text-indigo-500" /> Sorting Decision Simulator
            </h3>
            <p className="text-xs text-slate-500 mb-6">Simulate camera capture classification and routing result.</p>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">Simulate Snapshot</span>
                <button 
                  onClick={triggerSortingSim}
                  disabled={sortingSimulating}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition ${sortingSimulating ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-950 text-white hover:bg-slate-800'}`}
                >
                  {sortingSimulating ? 'Processing...' : 'Run Simulation Frame'}
                </button>
              </div>

              <div className="flex flex-col items-center justify-center p-4 border border-slate-200 bg-white rounded-2xl text-center min-h-[100px] relative overflow-hidden">
                {!sortingSimulating && sortingSimResult === "Ready" ? (
                  <>
                    <Upload size={24} className="text-slate-300 mb-1" />
                    <span className="text-xs font-bold text-slate-600">No snapshot simulated</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Click test button to load mock frames.</span>
                  </>
                ) : (
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-slate-800 block leading-relaxed">
                      {sortingSimResult}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assistant Info block */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-5 flex items-start gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-800 rounded-2xl flex-shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-indigo-900 text-sm">Dynamic Re-routing</h4>
              <p className="text-xs text-indigo-700 leading-relaxed mt-1">
                If the destination bin is filled, the smart sorting assistant will automatically coordinate a backup path based on category similarity models.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
