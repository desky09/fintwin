import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge } from '../common/Card';
import { WhatIfScenarioInput } from '../../types';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Wallet, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Zap,
  Sliders
} from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const { 
    userProfile, 
    healthScore, 
    activeSimulation, 
    runSimulation, 
    applySimulationToTwin,
    setActiveTab
  } = useApp();

  const [item, setItem] = useState(activeSimulation?.input.purchaseItem || 'Flagship Smartphone');
  const [amount, setAmount] = useState(activeSimulation?.input.amount || 70000);
  const [emiMonths, setEmiMonths] = useState(activeSimulation?.input.emiDurationMonths || 6);
  const [interestRate, setInterestRate] = useState(activeSimulation?.input.interestRatePercent ?? 12);
  const [downPayment, setDownPayment] = useState(activeSimulation?.input.downPayment || 0);
  const [additionalSavings, setAdditionalSavings] = useState(activeSimulation?.input.monthlyAdditionalSavings || 10000);
  const [showAppliedToast, setShowAppliedToast] = useState<string | null>(null);

  const presetItems = [
    { name: 'Flagship Smartphone', amount: 70000, tenure: 6, rate: 12 },
    { name: 'MacBook M3 Pro', amount: 125000, tenure: 12, rate: 10 },
    { name: 'Dream Royal Enfield Bike', amount: 95000, tenure: 9, rate: 11 },
    { name: 'International Vacation', amount: 150000, tenure: 12, rate: 12 },
    { name: 'Ergonomic Standing Desk', amount: 28000, tenure: 3, rate: 0 }
  ];

  const handleApplyPreset = (preset: typeof presetItems[0]) => {
    setItem(preset.name);
    setAmount(preset.amount);
    setEmiMonths(preset.tenure);
    setInterestRate(preset.rate);

    const input: WhatIfScenarioInput = {
      purchaseItem: preset.name,
      amount: preset.amount,
      paymentMethod: 'cash',
      emiDurationMonths: preset.tenure,
      interestRatePercent: preset.rate,
      downPayment,
      monthlyAdditionalSavings: additionalSavings
    };
    runSimulation(input);
  };

  const handleSimulate = () => {
    const input: WhatIfScenarioInput = {
      purchaseItem: item,
      amount,
      paymentMethod: 'cash',
      emiDurationMonths: emiMonths,
      interestRatePercent: interestRate,
      downPayment,
      monthlyAdditionalSavings: additionalSavings
    };
    runSimulation(input);
  };

  const handleApply = (scenarioType: 'cash' | 'emi' | 'save_delay') => {
    applySimulationToTwin(scenarioType);
    setShowAppliedToast(`Scenario applied! Your digital twin has been updated.`);
    setTimeout(() => setShowAppliedToast(null), 4000);
  };

  const currentResult = activeSimulation || runSimulation({
    purchaseItem: item,
    amount,
    paymentMethod: 'cash',
    emiDurationMonths: emiMonths,
    interestRatePercent: interestRate,
    downPayment,
    monthlyAdditionalSavings: additionalSavings
  });

  const { options, bestOption, aiExecutiveSummary, baseline } = currentResult;

  return (
    <div className="space-y-8 animate-fade-slide-up pb-12">
      {/* Header & Tagline Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-fintwin-darkBg via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-fintwin-indigo/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <Badge variant="indigo" size="sm" className="mb-3 bg-indigo-500/20 text-indigo-300 border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Flagship Predictive Decision Engine
          </Badge>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            What-If Financial Decision Simulator
          </h1>
          
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Test any purchase, loan, or lifestyle change before committing real money. FinTwin models the exact impact on your emergency reserves, future cashflow, and Financial Health Score.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
              <span className="text-slate-400">Current Savings:</span>
              <span className="font-bold text-white">₹{userProfile.currentSavings.toLocaleString('en-IN')}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
              <span className="text-slate-400">Emergency Buffer:</span>
              <span className="font-bold text-emerald-300">{baseline.emergencyMonths} Months</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
              <span className="text-slate-400">Twin Health Score:</span>
              <span className="font-bold text-indigo-300">{baseline.healthScore}/100</span>
            </div>
          </div>
        </div>
      </div>

      {showAppliedToast && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-xl animate-fade-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{showAppliedToast}</span>
          </div>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className="underline text-emerald-100 hover:text-white"
          >
            Go to Dashboard
          </button>
        </div>
      )}

      {/* Preset Quick Chips */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Quick Scenario Presets (Click to Test)
          </span>
          <span className="text-[11px] text-fintwin-indigo dark:text-indigo-400 font-semibold">
            Try the ₹70,000 Phone Hackathon Demo
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {presetItems.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                item === preset.name && amount === preset.amount
                  ? 'bg-fintwin-indigo text-white border-fintwin-indigo shadow-md shadow-fintwin-indigo/25 scale-105'
                  : 'bg-white dark:bg-fintwin-darkSurface text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-fintwin-indigo/50'
              }`}
            >
              {preset.name} (₹{preset.amount.toLocaleString('en-IN')})
            </button>
          ))}
        </div>
      </div>

      {/* Input Parameters Controls Panel */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-fintwin-indigo" />
            <h3 className="font-bold text-base text-fintwin-ink dark:text-white">
              Simulation Parameters
            </h3>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={handleSimulate}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Re-Calculate Projection
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              Purchase or Expense Name
            </label>
            <input
              type="text"
              value={item}
              onChange={e => setItem(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-semibold text-fintwin-ink dark:text-white focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 flex justify-between">
              <span>Amount (₹)</span>
              <span className="text-fintwin-indigo font-extrabold">₹{amount.toLocaleString('en-IN')}</span>
            </label>
            <input
              type="number"
              value={amount}
              step="1000"
              min="1000"
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm font-extrabold text-fintwin-ink dark:text-white focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
            />
          </div>

          {/* EMI Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              EMI Tenure (Months)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[3, 6, 12, 24].map(months => (
                <button
                  key={months}
                  onClick={() => { setEmiMonths(months); }}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    emiMonths === months
                      ? 'bg-fintwin-indigo text-white border-fintwin-indigo shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200'
                  }`}
                >
                  {months}M
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 flex justify-between">
              <span>Annual Interest Rate (%)</span>
              <span className="text-slate-500 font-bold">{interestRate}%</span>
            </label>
            <select
              value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-semibold text-fintwin-ink dark:text-white focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
            >
              <option value="0">0% (No Cost EMI)</option>
              <option value="9">9% p.a. (Bank Promotional)</option>
              <option value="12">12% p.a. (Standard Credit Card)</option>
              <option value="15">15% p.a. (Personal Loan)</option>
              <option value="18">18% p.a. (NBFC Consumer Loan)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* AI Twin Executive Recommendation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-slate-900/60 border border-indigo-200/80 dark:border-indigo-800/80 shadow-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-fintwin-indigo text-white shadow-md shadow-fintwin-indigo/30 flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-extrabold text-sm sm:text-base text-fintwin-ink dark:text-white">
                FinTwin AI Executive Recommendation:
              </h4>
              <Badge 
                variant={bestOption === 'save_delay' ? 'mint' : bestOption === 'emi' ? 'indigo' : 'amber'}
                size="sm"
              >
                Recommended: {bestOption === 'save_delay' ? 'Save & Delay Plan' : bestOption === 'emi' ? `${emiMonths}-Month EMI` : 'Buy in Cash'}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {aiExecutiveSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 3-WAY SIDE-BY-SIDE SCENARIO MATRIX */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-lg text-fintwin-ink dark:text-white">
            Comparative Scenario Analysis
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Side-by-side projected twin impacts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SCENARIO 1: CASH PURCHASE */}
          <Card 
            className={`p-6 flex flex-col justify-between relative ${
              bestOption === 'cash' ? 'ring-2 ring-fintwin-indigo' : ''
            }`}
            variant="glass"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="coral" size="sm" icon={<Wallet className="w-3 h-3" />}>
                    Option A: Immediate Cash
                  </Badge>
                  <h4 className="text-base font-extrabold text-fintwin-ink dark:text-white mt-2">
                    Buy Now with Cash
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-fintwin-coral">
                    {options.cashOption.scoreDelta} pts
                  </span>
                  <p className="text-[10px] text-slate-400">Health Impact</p>
                </div>
              </div>

              <div className="mt-5 space-y-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Initial Outflow:</span>
                  <span className="font-extrabold text-fintwin-ink dark:text-white">
                    ₹{options.cashOption.initialCashOutflow.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Remaining Savings:</span>
                  <span className={`font-extrabold ${options.cashOption.projectedSavings < 20000 ? 'text-fintwin-coral' : 'text-slate-800 dark:text-slate-100'}`}>
                    ₹{options.cashOption.projectedSavings.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Emergency Cushion:</span>
                  <span className={`font-bold ${options.cashOption.projectedEmergencyMonths < 2.0 ? 'text-fintwin-coral font-extrabold' : 'text-slate-700'}`}>
                    {options.cashOption.projectedEmergencyMonths} Months
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Risk Assessment:</span>
                  <Badge variant={options.cashOption.riskLevel === 'critical' ? 'coral' : 'amber'} size="sm">
                    {options.cashOption.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
              </div>

              <div className="py-4 space-y-2 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  {options.cashOption.aiVerdict}
                </p>
                <ul className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {options.cashOption.recommendationDetails.map((detail, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant={options.cashOption.riskLevel === 'critical' ? 'outline' : 'secondary'}
                size="sm"
                onClick={() => handleApply('cash')}
                className="w-full"
              >
                Apply Cash Purchase
              </Button>
            </div>
          </Card>

          {/* SCENARIO 2: STRUCTURED EMI */}
          <Card 
            className={`p-6 flex flex-col justify-between relative ${
              bestOption === 'emi' ? 'ring-2 ring-fintwin-indigo shadow-glow-indigo' : ''
            }`}
            variant="glass"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="indigo" size="sm" icon={<CreditCard className="w-3 h-3" />}>
                    Option B: Structured EMI
                  </Badge>
                  <h4 className="text-base font-extrabold text-fintwin-ink dark:text-white mt-2">
                    {emiMonths}-Month Installments
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {options.emiOption.scoreDelta} pts
                  </span>
                  <p className="text-[10px] text-slate-400">Health Impact</p>
                </div>
              </div>

              <div className="mt-5 space-y-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Monthly EMI:</span>
                  <span className="font-extrabold text-fintwin-indigo dark:text-indigo-400">
                    ₹{options.emiOption.monthlyObligation.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Preserved Savings:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₹{options.emiOption.projectedSavings.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Emergency Cushion:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {options.emiOption.projectedEmergencyMonths} Months (Protected)
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Total Interest Paid:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    ₹{options.emiOption.totalInterestPaid.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="py-4 space-y-2 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  {options.emiOption.aiVerdict}
                </p>
                <ul className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {options.emiOption.recommendationDetails.map((detail, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-fintwin-indigo">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApply('emi')}
                className="w-full"
              >
                Apply EMI to Digital Twin
              </Button>
            </div>
          </Card>

          {/* SCENARIO 3: SAVE & DELAY SINKING FUND */}
          <Card 
            className={`p-6 flex flex-col justify-between relative ${
              bestOption === 'save_delay' ? 'ring-2 ring-fintwin-mint shadow-glow-mint' : ''
            }`}
            variant="glass"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="mint" size="sm" icon={<Clock className="w-3 h-3" />}>
                    Option C: Save & Sinking Fund
                  </Badge>
                  <h4 className="text-base font-extrabold text-fintwin-ink dark:text-white mt-2">
                    Save {options.delaySavingsOption.durationMonths} Months & Buy
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    +{options.delaySavingsOption.scoreDelta} pts
                  </span>
                  <p className="text-[10px] text-slate-400">Health Impact</p>
                </div>
              </div>

              <div className="mt-5 space-y-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Monthly Sinking Fund:</span>
                  <span className="font-extrabold text-fintwin-mint">
                    ₹{options.delaySavingsOption.monthlyObligation.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Target Purchase Date:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    In {options.delaySavingsOption.durationMonths} Months
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Emergency Buffer:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {options.delaySavingsOption.projectedEmergencyMonths} Months (100% Intact)
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Interest & Debt:</span>
                  <Badge variant="mint" size="sm">
                    ₹0 DEBT / ₹0 INTEREST
                  </Badge>
                </div>
              </div>

              <div className="py-4 space-y-2 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  {options.delaySavingsOption.aiVerdict}
                </p>
                <ul className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {options.delaySavingsOption.recommendationDetails.map((detail, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-fintwin-mint">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="mint"
                size="sm"
                onClick={() => handleApply('save_delay')}
                className="w-full"
              >
                Create Goal Sinking Fund
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
