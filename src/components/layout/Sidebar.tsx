import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutGrid, 
  Sparkles, 
  Scan, 
  CreditCard, 
  TrendingUp, 
  LineChart, 
  PieChart, 
  SlidersHorizontal, 
  Target, 
  Bot, 
  Cpu, 
  Settings, 
  Compass, 
  LogIn,
  ArrowRight,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, setIsScannerOpen, esp32State } = useApp();

  const menuNavItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutGrid },
    { id: 'simulator', label: 'What-If Twin', icon: Sparkles },
    { id: 'scanner_trigger', label: 'Smart Bill Scan', icon: Scan, isAction: true },
    { id: 'transactions', label: 'Accounts & Cards', icon: CreditCard },
    { id: 'analytics', label: 'Investing & Flow', icon: LineChart },
    { id: 'forecast', label: 'Insights & Forecast', icon: TrendingUp },
    { id: 'dependencies', label: 'Dependencies', icon: CreditCard },
    { id: 'budgets', label: 'Budgets', icon: SlidersHorizontal },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'ai', label: 'AI Advisor', icon: Bot },
    { id: 'iot', label: 'Health Meter', icon: Cpu, isIoT: true }
  ];

  const generalNavItems = [
    { id: 'auth', label: 'Sign In / Sign Up', icon: LogIn },
    { id: 'landing', label: 'Landing Demo', icon: Compass },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleItemClick = (item: { id: string; isAction?: boolean }) => {
    if (item.isAction) {
      setIsScannerOpen(true);
    } else {
      setActiveTab(item.id);
    }
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 z-40 h-screen w-64 flex-shrink-0 bg-[#0C1019] border-r border-[#192231] transition-all duration-300 overflow-y-auto flex flex-col justify-between p-4 ${
          isOpen ? 'left-0' : '-left-64 md:left-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Logo Header matching exact image */}
          <div 
            className="flex items-center gap-2.5 px-2 py-2 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-6 h-6 rounded-full border-2 border-[#EEFC57] border-t-transparent flex items-center justify-center animate-spin-slow">
              <div className="w-2 h-2 rounded-full bg-[#EEFC57]" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
              FinTwin <span className="text-[10px] font-mono text-[#EEFC57] bg-[#EEFC57]/15 px-1.5 py-0.2 rounded font-bold">AI</span>
            </span>
          </div>

          {/* MENU SECTION */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              MENU
            </p>

            {menuNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-[#EEFC57] text-[#0C1019] shadow-yellow-glow' 
                      : item.isAction
                        ? 'bg-[#151C2B] text-[#EEFC57] hover:bg-[#1C2538] border border-[#EEFC57]/30 my-1'
                        : 'text-slate-400 hover:text-white hover:bg-[#141B29]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0C1019]' : item.isAction ? 'text-[#EEFC57]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.isIoT && (
                    <span className={`w-2 h-2 rounded-full ${
                      esp32State.ledColor === 'green' ? 'bg-emerald-400 animate-pulse' : esp32State.ledColor === 'amber' ? 'bg-amber-400' : 'bg-rose-500 animate-ping'
                    }`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* GENERAL SECTION */}
          <div className="space-y-1 pt-2">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              GENERAL
            </p>

            {generalNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-[#EEFC57] text-[#0C1019] shadow-yellow-glow' 
                      : 'text-slate-400 hover:text-white hover:bg-[#141B29]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0C1019]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM PROMO CARD (Matching 'Upgrade to PRO' card in screenshot) */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-b from-[#141C2B] to-[#0E1420] border border-[#222E42] shadow-xl text-left space-y-3">
          <div>
            <h4 className="font-extrabold text-xs text-white">
              Upgrade to PRO
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Unlock unlimited AI what-if simulations, auto OCR bill matching, and real-time bank twin sync.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('simulator')}
            className="w-full py-2 px-3 rounded-xl bg-[#EEFC57] hover:bg-[#E0EE45] text-[#0C1019] font-black text-xs flex items-center justify-center gap-1 shadow-yellow-glow transition-all"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <p className="text-[9px] text-slate-500 text-center">
            © 2026 FinTwin. All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
};
