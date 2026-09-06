import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button, Badge } from '../common/Card';
import { 
  Search, 
  Bell, 
  Users, 
  RefreshCw, 
  Menu, 
  X, 
  ChevronDown, 
  Scan,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { 
    userProfile, 
    activePersona, 
    switchPersona, 
    resetActivePersona, 
    setIsScannerOpen,
    setActiveTab,
    healthScore
  } = useApp();

  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const personas = [
    { id: 'user-persona-a', name: 'Aarav Sharma (Salaried)', subtitle: 'Income: ₹50k | Savings: ₹80k (Demo Flow)', role: 'Persona A: Salaried Pro' },
    { id: 'user-persona-b', name: 'Rhea Sen (Freelancer)', subtitle: 'Income: ₹75k | Irregular Client Invoices', role: 'Persona B: Freelancer / Variable' },
    { id: 'user-persona-c', name: 'Vikram & Priya (Family)', subtitle: 'Income: ₹1.2L | High Dependencies & EMIs', role: 'Persona C: Family Budget Manager' }
  ];

  const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0B0F17]/90 backdrop-blur-xl border-b border-[#1A2230] px-4 sm:px-8 py-4 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Greeting & Date matching screenshot */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#141B29] focus:outline-none"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <p className="text-[11px] font-semibold text-slate-400">
              {currentDateFormatted}
            </p>
            <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {userProfile.name.split(' ')[0]}
            </h2>
          </div>
        </div>

        {/* Right: Search Bar, Notifications, Persona Switcher & Avatar */}
        <div className="flex items-center gap-3">
          {/* Search Input Bar matching screenshot */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141B29] border border-[#202B3C] text-xs w-72 text-slate-300 shadow-inner">
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Type here to search , Transactions , accounts..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full text-white placeholder:text-slate-500 font-medium"
            />
          </div>

          {/* Scan Bill Quick Action */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141B29] hover:bg-[#1C2538] border border-[#202B3C] text-xs font-bold text-[#EEFC57] transition-colors"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Scan Bill</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPersonaDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl bg-[#141B29] hover:bg-[#1C2538] text-white border border-[#202B3C] transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-[#EEFC57]" />
              <span className="hidden sm:inline">{userProfile.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {personaDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-[#131926] rounded-2xl shadow-2xl border border-[#243046] p-2 z-50 animate-fade-slide-up text-left"
                onMouseLeave={() => setPersonaDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-[#1F2737] flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Personas</span>
                  <button 
                    onClick={() => { resetActivePersona(); setPersonaDropdownOpen(false); }}
                    className="text-[11px] text-[#EEFC57] hover:underline flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                </div>
                <div className="py-1 space-y-1">
                  {personas.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        switchPersona(p.id);
                        setPersonaDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex flex-col ${
                        activePersona === p.id 
                          ? 'bg-[#EEFC57]/15 text-[#EEFC57] font-bold border border-[#EEFC57]/30' 
                          : 'hover:bg-[#1A2336] text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{p.name}</span>
                        {activePersona === p.id && <span className="text-[9px] bg-[#EEFC57] text-[#0B0F17] font-black px-1.5 py-0.2 rounded-full">ACTIVE</span>}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">{p.subtitle}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notification Button */}
          <button 
            onClick={() => setActiveTab('ai')}
            className="p-2 rounded-xl bg-[#141B29] hover:bg-[#1C2538] border border-[#202B3C] text-slate-300 hover:text-white transition-colors relative"
            title="Notifications & AI Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#EEFC57] absolute top-1.5 right-1.5" />
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={() => setActiveTab('settings')}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#202B3C] hover:border-[#EEFC57] cursor-pointer transition-colors shadow-sm flex-shrink-0"
          >
            <img 
              src={userProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
              alt={userProfile.name}
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};
