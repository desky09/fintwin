import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  Transaction,
  CategoryBudget,
  FinancialDependency,
  FinancialGoal,
  HealthScoreBreakdown,
  WhatIfScenarioInput,
  WhatIfSimulationResult,
  ESP32DeviceState,
  Category
} from '../types';
import { loadInitialData, saveStateToStorage, resetPersonaData } from '../services/storageService';
import { calculateHealthScore } from '../services/financialEngine';
import { runWhatIfSimulation } from '../services/simulationEngine';

interface AppContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  transactions: Transaction[];
  budgets: CategoryBudget[];
  dependencies: FinancialDependency[];
  goals: FinancialGoal[];
  healthScore: HealthScoreBreakdown;
  activePersona: string;
  switchPersona: (personaId: string) => void;
  resetActivePersona: () => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'userId'>) => Transaction;
  deleteTransaction: (id: string) => void;
  addDependency: (dep: Omit<FinancialDependency, 'id'>) => void;
  deleteDependency: (id: string) => void;
  addGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  updateGoalAmount: (id: string, newAmount: number) => void;
  updateBudget: (category: Category, newAllocated: number) => void;
  
  // What-If Simulator
  activeSimulation: WhatIfSimulationResult | null;
  runSimulation: (input: WhatIfScenarioInput) => WhatIfSimulationResult;
  applySimulationToTwin: (scenarioType: 'cash' | 'emi' | 'save_delay') => void;
  
  // UI States
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  
  // ESP32 Hardware Simulator
  esp32State: ESP32DeviceState;
  cycleEsp32Screen: () => void;
  
  // AI Advisor Key
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePersona, setActivePersona] = useState<string>(() => {
    return localStorage.getItem('fintwin_active_persona') || 'user-persona-a';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('fintwin_theme') === 'dark' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('fintwin_gemini_api_key') || '';
  });

  // Initial Data
  const initial = useMemo(() => loadInitialData(activePersona), [activePersona]);

  const [userProfile, setUserProfile] = useState<UserProfile>(initial.profile);
  const [transactions, setTransactions] = useState<Transaction[]>(initial.transactions);
  const [budgets, setBudgets] = useState<CategoryBudget[]>(initial.budgets);
  const [dependencies, setDependencies] = useState<FinancialDependency[]>(initial.dependencies);
  const [goals, setGoals] = useState<FinancialGoal[]>(initial.goals);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fintwin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fintwin_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Save changes to storage
  useEffect(() => {
    saveStateToStorage(activePersona, userProfile, transactions, budgets, dependencies, goals);
  }, [activePersona, userProfile, transactions, budgets, dependencies, goals]);

  // Save Gemini Key
  useEffect(() => {
    localStorage.setItem('fintwin_gemini_api_key', geminiApiKey);
  }, [geminiApiKey]);

  // Compute live Health Score
  const healthScore = useMemo(() => {
    return calculateHealthScore(userProfile, budgets, dependencies, goals);
  }, [userProfile, budgets, dependencies, goals]);

  // What-If Simulation State
  const [activeSimulation, setActiveSimulation] = useState<WhatIfSimulationResult | null>(() => {
    // Initialize default ₹70,000 phone simulation matching Winning Demo Flow
    return runWhatIfSimulation(
      {
        purchaseItem: 'Flagship Smartphone',
        amount: 70000,
        paymentMethod: 'cash',
        emiDurationMonths: 6,
        interestRatePercent: 12,
        downPayment: 0,
        monthlyAdditionalSavings: 10000
      },
      initial.profile,
      initial.budgets,
      initial.dependencies,
      initial.goals
    );
  });

  const runSimulation = (input: WhatIfScenarioInput) => {
    const result = runWhatIfSimulation(input, userProfile, budgets, dependencies, goals);
    setActiveSimulation(result);
    return result;
  };

  const applySimulationToTwin = (scenarioType: 'cash' | 'emi' | 'save_delay') => {
    if (!activeSimulation) return;
    const { input, options } = activeSimulation;

    if (scenarioType === 'cash') {
      setUserProfile(prev => ({
        ...prev,
        currentSavings: Math.max(prev.currentSavings - input.amount, 0)
      }));
      // Add as transaction
      addTransaction({
        merchant: `${input.purchaseItem} (Cash Purchase)`,
        amount: input.amount,
        category: 'Shopping & Gadgets',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Debit Card',
        description: 'Simulated Cash Purchase applied to Digital Twin'
      });
    } else if (scenarioType === 'emi') {
      const emiRes = options.emiOption;
      addDependency({
        name: `${input.purchaseItem} EMI`,
        type: 'emi',
        monthlyAmount: emiRes.monthlyObligation,
        totalAmount: emiRes.totalCost,
        paidAmount: 0,
        remainingTenureMonths: emiRes.durationMonths,
        interestRate: input.interestRatePercent,
        dueDateDay: 10,
        autoRenew: false,
        category: 'Debt & EMIs',
        status: 'active'
      });
      if (input.downPayment > 0) {
        setUserProfile(prev => ({
          ...prev,
          currentSavings: Math.max(prev.currentSavings - input.downPayment, 0)
        }));
      }
    } else if (scenarioType === 'save_delay') {
      addGoal({
        name: `${input.purchaseItem} Sinking Fund`,
        targetAmount: input.amount,
        currentAmount: 0,
        deadline: new Date(Date.now() + options.delaySavingsOption.durationMonths * 30 * 86400000).toISOString().split('T')[0],
        monthlyTarget: options.delaySavingsOption.monthlyObligation,
        category: 'Shopping',
        priority: 'high',
        icon: 'Sparkles'
      });
    }
  };

  // Switch persona handler
  const switchPersona = (personaId: string) => {
    setActivePersona(personaId);
    const data = loadInitialData(personaId);
    setUserProfile(data.profile);
    setTransactions(data.transactions);
    setBudgets(data.budgets);
    setDependencies(data.dependencies);
    setGoals(data.goals);

    // Re-run demo simulation for the new persona
    const newSim = runWhatIfSimulation(
      {
        purchaseItem: personaId === 'user-persona-c' ? 'Modular Kitchen Appliance' : 'Flagship Smartphone',
        amount: personaId === 'user-persona-c' ? 85000 : 70000,
        paymentMethod: 'cash',
        emiDurationMonths: 6,
        interestRatePercent: 12,
        downPayment: 0,
        monthlyAdditionalSavings: 10000
      },
      data.profile,
      data.budgets,
      data.dependencies,
      data.goals
    );
    setActiveSimulation(newSim);
  };

  const resetActivePersona = () => {
    const data = resetPersonaData(activePersona);
    setUserProfile(data.profile);
    setTransactions(data.transactions);
    setBudgets(data.budgets);
    setDependencies(data.dependencies);
    setGoals(data.goals);
  };

  // Transaction CRUD & auto-budget sync
  const addTransaction = (txData: Omit<Transaction, 'id' | 'userId'>): Transaction => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      userId: userProfile.id
    };

    setTransactions(prev => [newTx, ...prev]);

    if (newTx.type === 'expense') {
      setBudgets(prev => prev.map(b => {
        if (b.category === newTx.category) {
          return { ...b, spentAmount: b.spentAmount + newTx.amount };
        }
        return b;
      }));
    } else if (newTx.type === 'income') {
      setUserProfile(prev => ({
        ...prev,
        currentSavings: prev.currentSavings + newTx.amount
      }));
    }

    return newTx;
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (tx && tx.type === 'expense') {
      setBudgets(prev => prev.map(b => {
        if (b.category === tx.category) {
          return { ...b, spentAmount: Math.max(b.spentAmount - tx.amount, 0) };
        }
        return b;
      }));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Dependencies CRUD
  const addDependency = (depData: Omit<FinancialDependency, 'id'>) => {
    const newDep: FinancialDependency = {
      ...depData,
      id: `dep-${Date.now()}`
    };
    setDependencies(prev => [newDep, ...prev]);
  };

  const deleteDependency = (id: string) => {
    setDependencies(prev => prev.filter(d => d.id !== id));
  };

  // Goals CRUD
  const addGoal = (goalData: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = {
      ...goalData,
      id: `goal-${Date.now()}`
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoalAmount = (id: string, newAmount: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: newAmount } : g));
  };

  const updateBudget = (category: Category, newAllocated: number) => {
    setBudgets(prev => prev.map(b => b.category === category ? { ...b, allocatedAmount: newAllocated } : b));
  };

  // ESP32 IoT Device State
  const [esp32ScreenIndex, setEsp32ScreenIndex] = useState<number>(0);
  const cycleEsp32Screen = () => {
    setEsp32ScreenIndex(prev => (prev + 1) % 4);
  };

  const esp32State: ESP32DeviceState = useMemo(() => {
    const score = healthScore.totalScore;
    let ledColor: 'green' | 'amber' | 'red' | 'blue' = 'green';
    let risk = healthScore.tier;
    
    if (score >= 80) ledColor = 'green';
    else if (score >= 60) ledColor = 'green';
    else if (score >= 40) ledColor = 'amber';
    else ledColor = 'red';

    return {
      isConnected: true,
      screenIndex: esp32ScreenIndex,
      ledColor,
      ledBlinking: score < 40,
      activeRisk: score >= 60 ? 'low' : score >= 40 ? 'medium' : 'high',
      displayStatusText: `HEALTH: ${score}/100 | ${risk.toUpperCase()}`,
      lastSyncTimestamp: 'LIVE SYNC'
    };
  }, [healthScore, esp32ScreenIndex]);

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        transactions,
        budgets,
        dependencies,
        goals,
        healthScore,
        activePersona,
        switchPersona,
        resetActivePersona,
        addTransaction,
        deleteTransaction,
        addDependency,
        deleteDependency,
        addGoal,
        updateGoalAmount,
        updateBudget,
        activeSimulation,
        runSimulation,
        applySimulationToTwin,
        activeTab,
        setActiveTab,
        isDarkMode,
        toggleDarkMode,
        isScannerOpen,
        setIsScannerOpen,
        esp32State,
        cycleEsp32Screen,
        geminiApiKey,
        setGeminiApiKey
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
