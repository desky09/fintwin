import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge } from '../common/Card';
import { maskEmail } from '@/lib/utils';
import { 
  Settings as SettingsIcon, 
  User, 
  RefreshCw, 
  Download, 
  Upload, 
  Key, 
  ShieldCheck, 
  Check, 
  HelpCircle,
  Sparkles,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    userProfile, 
    setUserProfile, 
    resetActivePersona, 
    activePersona, 
    switchPersona, 
    geminiApiKey, 
    setGeminiApiKey,
    setActiveTab,
    transactions,
    budgets,
    dependencies,
    goals
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [isEmailMasked, setIsEmailMasked] = useState(true);
  const [income, setIncome] = useState(userProfile.monthlyIncome);
  const [savings, setSavings] = useState(userProfile.currentSavings);
  const [budgetCap, setBudgetCap] = useState(userProfile.overallMonthlyBudgetCap);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name,
      email,
      monthlyIncome: Number(income),
      currentSavings: Number(savings),
      overallMonthlyBudgetCap: Number(budgetCap)
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const fullBackup = {
      userProfile,
      transactions,
      budgets,
      dependencies,
      goals,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintwin_${activePersona}_backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-slide-up pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Settings & Digital Twin Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize user parameters, privacy preferences, currency, and demo states.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-fade-slide-up">
          <Check className="w-5 h-5" />
          <span>Profile configuration successfully saved!</span>
        </div>
      )}

      {/* USER PROFILE CONFIGURATION FORM */}
      <Card className="p-6 border border-slate-800 bg-[#121824]/90">
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#EEFC57]" />
              <h3 className="font-extrabold text-base text-white">
                Personal Financial Twin Profile
              </h3>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" /> Privacy Protected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-semibold text-white focus:ring-2 focus:ring-[#EEFC57] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300">
                  Email Address
                </label>
                <button
                  type="button"
                  onClick={() => setIsEmailMasked(prev => !prev)}
                  className="text-[10px] text-[#EEFC57] hover:underline flex items-center gap-1 font-bold"
                >
                  {isEmailMasked ? (
                    <>
                      <Eye className="w-3 h-3" /> Reveal Email
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" /> Hide / Mask
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={isEmailMasked ? maskEmail(email) : email}
                  onChange={e => {
                    if (!isEmailMasked) {
                      setEmail(e.target.value);
                    }
                  }}
                  readOnly={isEmailMasked}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-semibold text-white focus:ring-2 focus:ring-[#EEFC57] focus:outline-none ${
                    isEmailMasked ? 'cursor-pointer text-slate-300 tracking-wider' : ''
                  }`}
                  onClick={() => {
                    if (isEmailMasked) setIsEmailMasked(false);
                  }}
                  title={isEmailMasked ? "Click to reveal and edit email" : "Email address"}
                />
                {isEmailMasked && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <Lock className="w-3 h-3" /> MASKED
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Monthly Net Income (₹)
              </label>
              <input
                type="number"
                value={income}
                onChange={e => setIncome(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-extrabold text-white focus:ring-2 focus:ring-[#EEFC57] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Current Liquid Savings Buffer (₹)
              </label>
              <input
                type="number"
                value={savings}
                onChange={e => setSavings(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-extrabold text-white focus:ring-2 focus:ring-[#EEFC57] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Overall Monthly Spending Budget Cap (₹)
              </label>
              <input
                type="number"
                value={budgetCap}
                onChange={e => setBudgetCap(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-extrabold text-white focus:ring-2 focus:ring-[#EEFC57] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Currency & Region
              </label>
              <select
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-800 text-xs font-semibold text-slate-300 opacity-80 cursor-not-allowed"
              >
                <option>INR - Indian Rupee (₹)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <Button variant="primary" size="md" type="submit" className="bg-[#EEFC57] text-[#0B0F17] hover:bg-[#EEFC57]/90 font-black">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* DEMO PERSONA CONTROLS & DATA BACKUP */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <Sparkles className="w-5 h-5 text-fintwin-indigo" />
          <h3 className="font-extrabold text-base text-fintwin-ink dark:text-white">
            Hackathon Demo Controls & Data Management
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Reset Active Persona to Baseline Mock State
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Restores initial transactions, budgets, goals, and demo numbers.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className="w-4 h-4 text-fintwin-indigo" />}
            onClick={() => {
              resetActivePersona();
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 2000);
            }}
          >
            Reset Active Persona
          </Button>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Export Complete Digital Twin JSON
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Download your transactions, budgets, dependencies, and simulation records.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportData}
          >
            Export JSON Data
          </Button>
        </div>
      </Card>
    </div>
  );
};
