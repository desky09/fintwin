import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutGrid, 
  CreditCard, 
  Scan, 
  LineChart, 
  Settings,
  Sparkles
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsScannerOpen } = useApp();

  return (
    <div className="md:hidden fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto bg-[#141B28]/95 backdrop-blur-xl border border-[#222E42] shadow-2xl rounded-full px-4 py-2 flex items-center justify-between gap-6 max-w-xs w-full">
        {/* Overview */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`p-2 rounded-full transition-all ${
            activeTab === 'dashboard' ? 'text-[#EEFC57]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Overview"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>

        {/* Transactions / Cards */}
        <button
          onClick={() => setActiveTab('transactions')}
          className={`p-2 rounded-full transition-all ${
            activeTab === 'transactions' ? 'text-[#EEFC57]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Accounts & Cards"
        >
          <CreditCard className="w-5 h-5" />
        </button>

        {/* Center Neon Yellow Action Pill matching screenshot mobile dock */}
        <button
          onClick={() => setIsScannerOpen(true)}
          className="w-11 h-11 rounded-2xl bg-[#EEFC57] text-[#0B0F17] flex items-center justify-center shadow-yellow-glow active:scale-95 transition-all -my-1"
          aria-label="Scan Bill"
        >
          <Scan className="w-5 h-5" />
        </button>

        {/* Analytics / Flow */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`p-2 rounded-full transition-all ${
            activeTab === 'analytics' ? 'text-[#EEFC57]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Analytics"
        >
          <LineChart className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`p-2 rounded-full transition-all ${
            activeTab === 'settings' ? 'text-[#EEFC57]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
