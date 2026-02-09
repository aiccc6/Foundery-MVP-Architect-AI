import React from 'react';
import { Blueprint, TabType } from '../types';

interface BlueprintDisplayProps {
  blueprint: Blueprint;
  activeTab: TabType;
}

const Section: React.FC<{ title: string; content: string; isMentorTip?: boolean }> = ({ title, content, isMentorTip }) => {
  const formatMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('### ')) return <h4 key={i} className="text-base font-bold text-[var(--text-primary)] mt-6 mb-2 border-l-4 border-blue-600 pl-3">{line.replace('### ', '')}</h4>;
      if (line.startsWith('## ')) return <h3 key={i} className="text-xl font-bold text-[var(--text-primary)] mt-8 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">{line.replace('## ', '')}</h3>;
      
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={i} className={`flex gap-4 mb-4 items-start ${isMentorTip ? 'p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50' : ''}`}>
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black mt-0.5 shadow-md">
              {numMatch[1]}
            </span>
            <div className="flex-1">
              <p className="text-[var(--text-secondary)] leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: numMatch[2].replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
            </div>
          </div>
        );
      }

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const textOnly = line.trim().substring(2);
        return (
          <div key={i} className="flex gap-3 mb-2 ml-4">
            <span className="text-blue-500 font-bold mt-1.5">•</span>
            <p className="text-[var(--text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: textOnly.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
          </div>
        );
      }

      if (line.includes('|')) {
        const cells = line.split('|').filter(c => c.trim() !== '');
        if (line.includes('---')) return null;
        const isHeader = i < lines.length - 1 && lines[i+1].includes('---');
        return (
          <div key={i} className={`flex border-b border-slate-100 dark:border-slate-800 py-4 ${isHeader ? 'bg-slate-50 dark:bg-slate-900/50 font-bold' : ''}`}>
            {cells.map((cell, ci) => (
              <div key={ci} className="flex-1 px-4 text-sm text-[var(--text-secondary)] font-medium">
                {cell.trim()}
              </div>
            ))}
          </div>
        );
      }

      if (line.trim() === '') return <div key={i} className="h-2" />;

      return <p key={i} className="text-[var(--text-secondary)] leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />;
    });
  };

  return (
    <div className="mb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h3 className="text-2xl font-black text-[var(--text-primary)] mb-6 tracking-tight flex items-center gap-3">
        {isMentorTip && (
          <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </span>
        )}
        {title}
      </h3>
      <div className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm ${isMentorTip ? 'ring-2 ring-blue-500/20' : ''}`}>
        {formatMarkdown(content)}
      </div>
    </div>
  );
};

const BlueprintDisplay: React.FC<BlueprintDisplayProps> = ({ blueprint, activeTab }) => {
  const { content } = blueprint;

  const renderBlueprint = () => (
    <div className="space-y-4">
      <Section title="Problem Statement" content={content.blueprint.problemStatement} />
      <Section title="Target Users" content={content.blueprint.targetUsers} />
      <Section title="Core Features" content={content.blueprint.coreFeatures} />
      <Section title="User Flow" content={content.blueprint.userFlow} />
      <Section title="System Architecture" content={content.blueprint.systemArchitecture} />
      <Section title="Database Schema" content={content.blueprint.databaseSchema} />
      <Section title="API Design" content={content.blueprint.apiDesign} />
      <Section title="AI Integration Strategy" content={content.blueprint.geminiIntegration} />
      <Section title="Tech Stack" content={content.blueprint.techStack} />
      <Section title="Security & Privacy" content={content.blueprint.securityPrivacy} />
      <Section title="14-Day Build Roadmap" content={content.blueprint.timeline} />
      {content.blueprint.futureScaling && <Section title="Future Scaling" content={content.blueprint.futureScaling} />}
    </div>
  );

  const renderRoadmap = () => {
    const quadrants = content.roadmap.priorityQuadrants || {
      quickWins: [{ name: 'Auth Module', reason: 'High impact, low difficulty with Firebase/Supabase.' }],
      strategicBets: [{ name: 'Custom AI Engine', reason: 'High impact but heavy R&D required.' }],
      maintenance: [{ name: 'Admin Dashboard', reason: 'Needed for ops but low user visibility.' }],
      distractions: [{ name: 'Mobile App', reason: 'Avoid until web PMF is validated.' }]
    };

    const resources = content.roadmap.resourceAllocation || [
      { name: 'Engineering', description: 'Core API development and infra.', value: 40 },
      { name: 'Design', description: 'User interface and prototype design.', value: 20 },
      { name: 'Marketing', description: 'User acquisition and landing pages.', value: 15 }
    ];

    return (
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resource Allocation Cards */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm flex flex-col">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Resource Allocation
            </h3>
            <div className="space-y-4">
              {resources.map((res, idx) => (
                <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-sm text-[var(--text-primary)]">{res.name}</span>
                    {res.value && <span className="text-[10px] font-black text-blue-600">{res.value}%</span>}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">{res.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MVP Priority Matrix (Quadrants) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm flex flex-col">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
              MVP Priority Quadrants
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border border-green-100 bg-green-50/30 rounded-2xl">
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest block mb-2">High Impact / Low Effort</span>
                <ul className="space-y-1">
                  {quadrants.quickWins.map((q, i) => (
                    <li key={i} className="text-xs font-bold text-[var(--text-primary)]">
                      • {q.name} <span className="font-medium text-[var(--text-secondary)] text-[11px]">— {q.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border border-blue-100 bg-blue-50/30 rounded-2xl">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">Strategic Bets (High Effort)</span>
                <ul className="space-y-1">
                  {quadrants.strategicBets.map((q, i) => (
                    <li key={i} className="text-xs font-bold text-[var(--text-primary)]">
                      • {q.name} <span className="font-medium text-[var(--text-secondary)] text-[11px]">— {q.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Gantt (HTML/CSS) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 md:p-14 shadow-sm">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
            Implementation Gantt (14 Days)
          </h3>
          <div className="overflow-x-auto pb-8 -mx-4 px-4 scrollbar-thin scrollbar-thumb-blue-600/40 scrollbar-track-slate-100 dark:scrollbar-track-slate-800">
            <div className="min-w-[1800px] space-y-12 pb-4">
              {content.roadmap.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-12 group">
                  <div className="w-96 shrink-0">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[12px] font-black text-blue-600 shadow-sm">{i + 1}</span>
                      <div>
                        <div className="text-sm font-black text-[var(--text-primary)] group-hover:text-blue-600 transition-colors uppercase tracking-wider">{m.name}</div>
                        <div className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight mt-1">{m.description}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] overflow-hidden relative border border-slate-100 dark:border-slate-700/50 shadow-inner">
                    <div 
                      className="absolute top-4 bottom-4 bg-blue-600 rounded-2xl flex items-center justify-center text-[11px] text-white font-black px-6 whitespace-nowrap shadow-xl transition-all group-hover:bg-blue-700 active:scale-95 group-hover:scale-[1.005] hover:z-10 cursor-default border border-blue-400/30" 
                      style={{ 
                        left: `${((m.start - 1) / 14) * 100}%`, 
                        width: `${((m.end - m.start + 1) / 14) * 100}%` 
                      }}
                    >
                      Day {m.start}{m.start !== m.end ? ` - ${m.end}` : ''}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex items-center gap-12 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="w-96 shrink-0 invisible"></div>
                <div className="flex-1 flex justify-between px-2">
                   {Array.from({length: 14}).map((_, i) => (
                     <div key={i} className="flex flex-col items-center gap-2">
                       <div className="w-0.5 h-3 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day {i+1}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCompetitors = () => {
    const comparisonMetrics = content.competitors.comparisonMetrics || [
      { metric: 'Ease of Use', ourProduct: 'Excellent', competitorA: 'Average', competitorB: 'Poor' },
      { metric: 'Cost Efficiency', ourProduct: 'Optimized', competitorA: 'High', competitorB: 'Low' },
      { metric: 'Feature Set', ourProduct: 'Focused MVP', competitorA: 'Bloated', competitorB: 'Niche' }
    ];

    return (
      <div className="space-y-12">
        <Section title="Market Landscape" content={content.competitors.analysis} />
        
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 md:p-14 shadow-sm">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
            Strategic Comparison Radar
          </h3>
          <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-[2rem]">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Strategic Metric</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-blue-600">Our Product</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Competitor A</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Competitor B</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {comparisonMetrics.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-5 text-sm font-black text-[var(--text-primary)]">{m.metric}</td>
                    <td className="px-6 py-5 text-sm font-bold text-blue-600">{m.ourProduct}</td>
                    <td className="px-6 py-5 text-sm font-medium text-[var(--text-secondary)]">{m.competitorA}</td>
                    <td className="px-6 py-5 text-sm font-medium text-[var(--text-secondary)]">{m.competitorB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.competitors.list.map((c, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm group hover:border-blue-400 transition-all hover:shadow-xl">
              <div className="mb-6">
                <h4 className="text-xl font-black text-[var(--text-primary)]">{c.name}</h4>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{c.marketPosition} • {c.price}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Core Strength</h5>
                  <p className="text-xs font-bold text-[var(--text-primary)]">{c.strength}</p>
                </div>
                <div>
                  <h5 className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Gap/Weakness</h5>
                  <p className="text-xs font-medium text-[var(--text-secondary)]">{c.weakness}</p>
                </div>
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                  <h5 className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-1">Differentiator</h5>
                  <p className="text-xs font-black text-[var(--text-primary)] italic">"{c.differentiator || 'Coming Soon'}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Section title="Strategic Differentiators" content={content.competitors.differentiators} isMentorTip={true} />
      </div>
    );
  };

  const renderCaseStudies = () => (
    <div className="space-y-16">
      <div className="px-4">
        <h3 className="text-3xl font-black mb-2 text-blue-600">Benchmark Legends</h3>
        <p className="text-slate-500 font-medium mb-12">Historical analysis of unicorns that faced similar initial pivots.</p>
      </div>
      
      {content.caseStudies.map((cs, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[4rem] p-12 md:p-16 shadow-sm overflow-hidden relative group hover:shadow-2xl transition-all duration-700">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:scale-125 transition-transform duration-1000"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
              <div className="w-36 h-36 bg-white dark:bg-slate-800 rounded-[3rem] flex items-center justify-center p-8 shadow-2xl border border-slate-50 dark:border-slate-700 shrink-0 overflow-hidden transform group-hover:rotate-3 transition-transform">
                 <img 
                    src={cs.logoUrl} 
                    alt={cs.name} 
                    className="w-full h-full object-contain" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<span class="text-6xl font-black text-blue-600">${cs.name[0]}</span>`;
                    }} 
                  />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-6 mb-4">
                  <h4 className="text-6xl font-black text-[var(--text-primary)] tracking-tighter">{cs.name}</h4>
                  <div className="px-6 py-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                    {cs.revenue}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-2xl font-bold text-blue-600 tracking-tight">Founded by {cs.founders}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-5 space-y-12">
                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 h-full flex flex-col">
                  <h5 className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-4 bg-red-500 rounded-full"></span>
                    The Core Dilemma
                  </h5>
                  <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium flex-1">
                    {cs.problem}
                  </p>
                </div>
              </div>
              
              <div className="lg:col-span-7 space-y-12">
                <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border-2 border-blue-50 dark:border-blue-900/20 shadow-xl h-full flex flex-col">
                  <h5 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                    Execution & Pivot Strategy
                  </h5>
                  <div className="space-y-10 flex-1">
                    <p className="text-lg text-[var(--text-primary)] leading-relaxed font-semibold">
                      {cs.approach}
                    </p>
                    <div className="p-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                      <h6 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Benchmark Success</h6>
                      <p className="text-2xl font-black leading-snug italic tracking-tight">
                        "{cs.outcome}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="blueprint-container animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-14 no-print px-1">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-12 shadow-sm">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path d="M12 2v20"/><path d="m5 15 7 7 7-7"/><path d="m5 9 7-7 7 7"/>
          </svg>
          Certified Enterprise Execution Blueprint
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tighter mb-8 leading-tight">{blueprint.title}</h2>
        <div className="flex flex-wrap items-center gap-8 text-slate-400 font-bold uppercase tracking-[0.3em] text-[11px]">
          <span className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm"></span>
            Project Hash: {blueprint.id}
          </span>
          <span className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
            Authenticated: {new Date(blueprint.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="px-0 md:px-1">
        {activeTab === 'blueprint' && renderBlueprint()}
        {activeTab === 'roadmap' && renderRoadmap()}
        {activeTab === 'competitors' && renderCompetitors()}
        {activeTab === 'caseStudies' && renderCaseStudies()}
      </div>
    </div>
  );
};

export default BlueprintDisplay;