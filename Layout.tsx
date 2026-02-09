import React, { useState, useEffect, useRef } from 'react';
import { TabType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  showNav?: boolean;
}

const FoundryLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20L40 20L35 45L10 20Z" fill="#7C72FF" />
    <path d="M40 20L70 45L40 90L40 20Z" fill="#1D19D8" />
    <path d="M70 45L85 30L70 20L70 45Z" fill="#7C72FF" />
    <path d="M40 90L30 80L40 70L40 90Z" fill="#7C72FF" />
  </svg>
);

const Layout: React.FC<LayoutProps> = ({ children, sidebar, activeTab, onTabChange, showNav }) => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [logo, setLogo] = useState<string | null>(() => localStorage.getItem('app_logo'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogo(base64String);
        localStorage.setItem('app_logo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'blueprint', label: 'Blueprint', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/></svg> },
    { id: 'roadmap', label: 'Roadmap', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 19V5l12 7-12 7z"/></svg> },
    { id: 'competitors', label: 'Competitors', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'caseStudies', label: 'Case Studies', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-300">
      {sidebar && (
        <aside className="no-print w-full md:w-80 border-r border-slate-200 dark:border-slate-800 bg-[var(--bg-secondary)] overflow-y-auto shrink-0 flex flex-col">
          {sidebar}
        </aside>
      )}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="no-print h-20 bg-[var(--bg-secondary)] border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload custom logo"
            >
              {logo ? (
                <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
              ) : (
                <FoundryLogo />
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoUpload} 
                className="hidden" 
                accept="image/*"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight leading-none">Foundry</h1>
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Architect</p>
              </div>
            </div>

            {showNav && onTabChange && (
              <nav className="hidden lg:flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      activeTab === tab.id 
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-[var(--text-primary)]"
              title="Toggle Theme"
            >
              {isDark ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M17.66 6.34l1.42-1.42"/></svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </div>
        </header>

        {showNav && onTabChange && (
          <div className="lg:hidden no-print px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-[var(--bg-secondary)] overflow-x-auto whitespace-nowrap scrollbar-hide">
            <div className="flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2 shrink-0 ${
                    activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {tab.id === activeTab && tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth bg-[var(--bg-primary)]">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;