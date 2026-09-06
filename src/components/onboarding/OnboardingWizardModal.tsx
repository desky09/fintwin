import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal, Button, Badge, ProgressBar } from '../common/Card';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, CreditCard, Sliders } from 'lucide-react';
import { Category } from '../../types';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, setUserProfile, updateBudget, addDependency, setActiveTab } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Income & Cap
  const [income, setIncome] = useState(userProfile.monthlyIncome || 50000);
  const [budgetCap, setBudgetCap] = useState(userProfile.overallMonthlyBudgetCap || 27000);
  const [savings, setSavings] = useState(userProfile.currentSavings || 80000);

  // Step 2: Selected Dependency Chips
  const [selectedChips, setSelectedChips] = useState<string[]>(['Rent', 'Netflix', 'Gym']);

  const presetChips = [
    { name: 'Apartment Rent', amount: 11000, type: 'loan', category: 'Housing & Rent' },
    { name: 'Netflix Premium', amount: 649, type: 'subscription', category: 'Entertainment' },
    { name: 'Spotify Music', amount: 179, type: 'subscription', category: 'Entertainment' },
    { name: 'Fitness Gym', amount: 1500, type: 'subscription', category: 'Healthcare' },
    { name: 'Car Loan EMI', amount: 9500, type: 'emi', category: 'Transportation' },
    { name: 'Health Insurance', amount: 1200, type: 'insurance', category: 'Healthcare' }
  ];

  // Step 3: Category Allocations
  const [groceriesAlloc, setGroceriesAlloc] = useState(7000);
  const [diningAlloc, setDiningAlloc] = useState(3500);
  const [utilitiesAlloc, setUtilitiesAlloc] = useState(2000);
  const [shoppingAlloc, setShoppingAlloc] = useState(3000);

  const toggleChip = (name: string) => {
    setSelectedChips(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleFinishOnboarding = () => {
    // Save Profile
    setUserProfile(prev => ({
      ...prev,
      monthlyIncome: Number(income),
      currentSavings: Number(savings),
      overallMonthlyBudgetCap: Number(budgetCap)
    }));

    // Update Budgets
    updateBudget('Groceries' as Category, groceriesAlloc);
    updateBudget('Dining & Food' as Category, diningAlloc);
    updateBudget('Utilities & Bills' as Category, utilitiesAlloc);
    updateBudget('Shopping & Gadgets' as Category, shoppingAlloc);

    // Add selected chips as dependencies
    presetChips.filter(c => selectedChips.includes(c.name)).forEach(c => {
      addDependency({
        name: c.name,
        type: c.type as any,
        monthlyAmount: c.amount,
        dueDateDay: 10,
        autoRenew: true,
        category: c.category as any,
        status: 'active'
      });
    });

    onClose();
    setActiveTab('dashboard');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-fintwin-indigo" />
          <span>FinTwin 4-Step Digital Twin Onboarding</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Step Indicator Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Step {step} of 4: {
              step === 1 ? 'Income & Savings Buffer' :
              step === 2 ? 'Recurring Dependencies' :
              step === 3 ? 'Category Budget Caps' : 'Twin Summary & Activation'
            }</span>
            <span className="text-fintwin-indigo">{step * 25}%</span>
          </div>
          <ProgressBar value={step * 25} max={100} size="sm" showPercentage={false} dynamicColor={false} />
        </div>

        {/* STEP 1: INCOME & BUFFER */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-extrabold text-fintwin-ink dark:text-white">
                Set Your Baseline Financial Parameters
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                FinTwin uses your net income and liquid buffer to compute your emergency coverage in months.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Monthly Net Take-Home Paycheck (₹)
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={e => setIncome(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-extrabold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Current Liquid Savings in Bank (₹)
                </label>
                <input
                  type="number"
                  value={savings}
                  onChange={e => setSavings(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-extrabold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Target Overall Monthly Budget Cap (₹)
                </label>
                <input
                  type="number"
                  value={budgetCap}
                  onChange={e => setBudgetCap(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-extrabold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="primary" size="md" onClick={() => setStep(2)} icon={<ArrowRight className="w-4 h-4" />}>
                Continue to Dependencies
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: PRESET DEPENDENCIES */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-extrabold text-fintwin-ink dark:text-white">
                Quick-Add Your Recurring Obligations
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Select your existing rent, subscriptions, and EMIs to calculate your Debt-to-Income (DTI).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {presetChips.map(chip => {
                const isSelected = selectedChips.includes(chip.name);
                return (
                  <div
                    key={chip.name}
                    onClick={() => toggleChip(chip.name)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-fintwin-indigo text-fintwin-indigo dark:text-indigo-300 font-bold shadow-sm'
                        : 'bg-white dark:bg-fintwin-darkSurface border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs">{chip.name}</div>
                      <div className="text-[11px] opacity-80">₹{chip.amount.toLocaleString('en-IN')}/mo</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-fintwin-indigo flex-shrink-0" />}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={() => setStep(3)} icon={<ArrowRight className="w-4 h-4" />}>
                Configure Category Caps
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: CATEGORY BUDGET SLIDERS */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-extrabold text-fintwin-ink dark:text-white">
                Set Category Budget Allowances
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                FinTwin's smart OCR scanner will verify all future uploaded bills against these limits.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Groceries & Pantry:</span>
                  <span className="font-bold text-fintwin-indigo">₹{groceriesAlloc.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="20000"
                  step="500"
                  value={groceriesAlloc}
                  onChange={e => setGroceriesAlloc(Number(e.target.value))}
                  className="w-full accent-fintwin-indigo"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Dining & Food Delivery:</span>
                  <span className="font-bold text-fintwin-indigo">₹{diningAlloc.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={diningAlloc}
                  onChange={e => setDiningAlloc(Number(e.target.value))}
                  className="w-full accent-fintwin-indigo"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Utilities & Power:</span>
                  <span className="font-bold text-fintwin-indigo">₹{utilitiesAlloc.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={utilitiesAlloc}
                  onChange={e => setUtilitiesAlloc(Number(e.target.value))}
                  className="w-full accent-fintwin-indigo"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Shopping & Gadgets:</span>
                  <span className="font-bold text-fintwin-indigo">₹{shoppingAlloc.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  value={shoppingAlloc}
                  onChange={e => setShoppingAlloc(Number(e.target.value))}
                  className="w-full accent-fintwin-indigo"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={() => setStep(4)} icon={<ArrowRight className="w-4 h-4" />}>
                Review Twin Summary
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: SUMMARY & ACTIVATION */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-fintwin-indigo flex items-center justify-center mx-auto mb-2 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-extrabold text-fintwin-ink dark:text-white">
                Your Financial Digital Twin is Configured!
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Ready to simulate decisions, track obligations, and activate the OCR guardian.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Net Income:</span>
                <span className="font-extrabold">₹{income.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Savings Buffer:</span>
                <span className="font-extrabold text-emerald-600">₹{savings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Obligations:</span>
                <span className="font-extrabold">{selectedChips.length} active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Overall Monthly Cap:</span>
                <span className="font-extrabold text-fintwin-indigo">₹{budgetCap.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={handleFinishOnboarding} icon={<CheckCircle2 className="w-4 h-4" />}>
                Activate & Launch Twin
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
