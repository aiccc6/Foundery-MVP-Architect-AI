import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HistorySidebar from './components/HistorySidebar';
import BlueprintDisplay from './components/BlueprintDisplay';
import SkeletonLoader from './components/SkeletonLoader';
import { geminiService } from './services/geminiService';
import { Blueprint, HistoryItem, TabType } from './types';

const TechLogo = ({ name, src }: { name: string; src: string }) => (
  <div className="flex flex-col items-center gap-2 group cursor-default">
    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center p-3 shadow-sm group-hover:shadow-lg transition-all group-hover:border-blue-500/50 group-hover:-translate-y-1">
      <img src={src} alt={name} className="w-full h-full object-contain" />
    </div>
    <span className="font-bold text-[9px] tracking-[0.25em] text-slate-400 dark:text-slate-500 uppercase group-hover:text-blue-600 transition-colors">
      {name}
    </span>
  </div>
);

const App: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeBlueprint, setActiveBlueprint] = useState<Blueprint | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('blueprint');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('foundry_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (blueprint: Blueprint) => {
    const newItem: HistoryItem = {
      id: blueprint.id,
      title: blueprint.title,
      idea: blueprint.originalIdea,
      timestamp: blueprint.createdAt
    };
    const updatedHistory = [newItem, ...history.filter(h => h.id !== blueprint.id)].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('foundry_history', JSON.stringify(updatedHistory));
    localStorage.setItem(`foundry_bp_${blueprint.id}`, JSON.stringify(blueprint));
  };

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setIsGenerating(true);
    setError(null);
    setActiveBlueprint(null);
    setActiveTab('blueprint');

    try {
      const result = await geminiService.generateBlueprint(idea);
      const newBlueprint: Blueprint = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        originalIdea: idea,
        title: result.title || "Untitled Architected Solution",
        createdAt: Date.now(),
        content: result
      };

      setActiveBlueprint(newBlueprint);
      saveToHistory(newBlueprint);
      setIdea('');
    } catch (err: any) {
      setError(err.message || "An architectural exception occurred. Please refine your concept.");
    } finally {
      setIsGenerating(false);
    }
  };

  const loadBlueprint = (id: string) => {
    const saved = localStorage.getItem(`foundry_bp_${id}`);
    if (saved) {
      setActiveBlueprint(JSON.parse(saved));
      setError(null);
      setActiveTab('blueprint');
    }
  };

  const startNew = () => {
    setActiveBlueprint(null);
    setIdea('');
    setError(null);
  };

  return (
    <Layout 
      sidebar={
        <HistorySidebar 
          history={history} 
          onSelect={loadBlueprint} 
          onNew={startNew}
          activeId={activeBlueprint?.id || null}
        />
      }
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showNav={!!activeBlueprint}
    >
      {!activeBlueprint && !isGenerating && (
        <div className="py-2 md:py-4 flex flex-col items-center animate-in fade-in duration-700">
          <h1 className="text-5xl md:text-7xl font-black text-[var(--text-primary)] tracking-tighter mb-4 leading-none text-center">
            Architect Your <br />
            <span className="text-blue-600">Startup Legacy.</span>
          </h1>
          
          <p className="text-[var(--text-secondary)] text-sm md:text-base font-medium text-center max-w-lg mb-8">
            Professional-grade suite for validation. Get MVP blueprints, visual roadmaps, competitor analysis, and proven case studies in seconds.
          </p>

          <div className="w-full max-w-3xl glass p-2 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:shadow-blue-100/50 dark:hover:shadow-none">
            <div className="relative">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Briefly describe your startup vision..."
                className="w-full h-32 md:h-40 p-8 bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[2rem] text-xl font-medium focus:border-blue-500/50 focus:ring-0 outline-none transition-all resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
              />
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={handleGenerate}
                  disabled={!idea.trim() || isGenerating}
                  className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-base hover:bg-blue-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg active:scale-95 group"
                >
                  Architect MVP
                  <svg className="group-hover:translate-x-1 transition-transform" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 w-full max-w-2xl no-print">
            <div className="text-center mb-6">
              <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em]">
                Powered by
              </span>
            </div>
            <div className="grid grid-cols-4 gap-6 md:gap-10">
              <TechLogo 
                name="GEMINI-3" 
                src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg"
              />
              <TechLogo 
                name="AWS-CLOUD" 
                src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
              />
              <TechLogo 
                name="STRIPE-PAY" 
                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
              />
              <TechLogo 
                name="DOCKER" 
                src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg"
              />
            </div>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="py-20 max-w-5xl mx-auto">
          <div className="text-center mb-16">
             <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 rounded-full text-white text-xs font-black tracking-[0.3em] uppercase mb-10 shadow-2xl animate-pulse">
                <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
                Synthesizing Market Data
             </div>
             <h2 className="text-5xl font-black text-[var(--text-primary)] mb-6 tracking-tighter">Drafting Strategy...</h2>
             <p className="text-[var(--text-secondary)] text-xl font-medium">Crunching competitors, visual roadmaps, and verified historical data points.</p>
          </div>
          <SkeletonLoader />
        </div>
      )}

      {error && (
        <div className="max-w-xl mx-auto bg-[var(--bg-secondary)] border border-red-100 dark:border-red-900/30 p-12 rounded-[3rem] text-center my-20 shadow-2xl">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h3 className="text-3xl font-black text-[var(--text-primary)] mb-4">Architecture Halted</h3>
          <p className="text-[var(--text-secondary)] font-medium mb-12">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl active:scale-95"
          >
            Refine & Retry
          </button>
        </div>
      )}

      {activeBlueprint && !isGenerating && (
        <div className="pb-20">
           <BlueprintDisplay blueprint={activeBlueprint} activeTab={activeTab} />
        </div>
      )}
    </Layout>
  );
};

export default App;