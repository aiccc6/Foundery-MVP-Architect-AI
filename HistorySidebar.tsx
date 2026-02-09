
import React from 'react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (id: string) => void;
  onNew: () => void;
  activeId: string | null;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onNew, activeId }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
        <button
          onClick={onNew}
          className="w-full py-4 px-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Build New MVP
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Blueprint Registry</h3>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{history.length}</span>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            </div>
            <p className="text-xs text-slate-400 font-medium">Your generated blueprints will appear here for 1-click access.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all group border ${
                    activeId === item.id 
                      ? 'bg-blue-50/50 border-blue-100 shadow-sm' 
                      : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
                  }`}
                >
                  <div className={`font-bold text-sm mb-1 truncate ${activeId === item.id ? 'text-blue-700' : 'text-slate-800'}`}>
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate mb-2 uppercase tracking-wider">
                    {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {item.idea}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="p-6 border-t border-slate-100 text-[10px] font-bold text-slate-300 tracking-[0.2em] text-center uppercase">
        V 1.0.4 PRODUCTION
      </div>
    </div>
  );
};

export default HistorySidebar;
