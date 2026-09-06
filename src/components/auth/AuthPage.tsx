import React from 'react';
import { useApp } from '@/context/AppContext';
import CloudWatchForm from '@/components/ui/cloud-watch-form';
import { Sparkles, ShieldCheck, Activity, ArrowLeft } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { setUserProfile, setActiveTab } = useApp();

  const handleAuthSuccess = (userData: { name: string; email: string; mode: 'signin' | 'signup' }) => {
    setUserProfile(prev => ({
      ...prev,
      name: userData.name || prev.name,
      email: userData.email || prev.email
    }));
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center relative animate-fade-slide-up py-6">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top back shortcut */}
      <div className="w-full max-w-md mb-2 flex items-center justify-between px-2 z-10">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-xs font-bold text-slate-500 hover:text-fintwin-indigo flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <span className="text-[11px] font-mono text-slate-400">
          SSL 256-Bit Encrypted
        </span>
      </div>

      {/* Cloud Watch Eye Tracking Form Component */}
      <div className="w-full z-10">
        <CloudWatchForm onSuccess={handleAuthSuccess} />
      </div>

      {/* Feature security badges footer */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 z-10">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Client-Side Privacy
        </span>
        <span className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-fintwin-indigo" /> Live Twin Sync
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Predictive Guardian
        </span>
      </div>
    </div>
  );
};
