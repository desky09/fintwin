export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type HealthScoreTier = 'Excellent' | 'Good' | 'Moderate' | 'Risky' | 'Critical';

export type Category = 
  | 'Housing & Rent'
  | 'Groceries'
  | 'Dining & Food'
  | 'Utilities & Bills'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping & Gadgets'
  | 'Healthcare'
  | 'Debt & EMIs'
  | 'Investments'
  | 'Miscellaneous';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  monthlyIncome: number;
  currentSavings: number;
  monthlySavingsTarget: number;
  overallMonthlyBudgetCap: number;
  currency: CurrencyCode;
  personaType: 'salaried' | 'freelancer' | 'family' | 'custom';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  merchant: string;
  amount: number;
  category: Category;
  type: 'expense' | 'income' | 'investment';
  date: string;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI' | 'Net Banking';
  description?: string;
  isScanned?: boolean;
  receiptUrl?: string;
  confidence?: number;
}

export interface CategoryBudget {
  category: Category;
  allocatedAmount: number;
  spentAmount: number;
  iconName: string;
  color: string;
}

export interface FinancialDependency {
  id: string;
  name: string;
  type: 'loan' | 'emi' | 'subscription' | 'credit_card' | 'insurance' | 'utility';
  monthlyAmount: number;
  totalAmount?: number;
  paidAmount?: number;
  remainingTenureMonths?: number;
  interestRate?: number;
  dueDateDay: number;
  autoRenew: boolean;
  category: Category;
  status: 'active' | 'completed' | 'paused';
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  monthlyTarget: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  icon: string;
}

export interface HealthScoreBreakdown {
  totalScore: number;
  tier: HealthScoreTier;
  savingsScore: number; // out of 30
  expenseControlScore: number; // out of 20
  emergencyFundScore: number; // out of 20
  debtBurdenScore: number; // out of 15
  goalProgressScore: number; // out of 15
  emergencyCoverageMonths: number;
  essentialMonthlyExpenses: number;
  savingsRatePercent: number;
  debtToIncomePercent: number;
  insights: string[];
}

export interface WhatIfScenarioInput {
  purchaseItem: string;
  amount: number;
  paymentMethod: 'cash' | 'credit_card' | 'emi' | 'save_delay';
  emiDurationMonths: number; // 3, 6, 9, 12, 24
  interestRatePercent: number;
  downPayment: number;
  monthlyAdditionalSavings: number;
  impactedGoalId?: string;
}

export interface ScenarioResult {
  scenarioName: string;
  paymentType: string;
  initialCashOutflow: number;
  monthlyObligation: number;
  totalCost: number;
  totalInterestPaid: number;
  durationMonths: number;
  projectedSavings: number;
  projectedEmergencyMonths: number;
  projectedHealthScore: number;
  scoreDelta: number;
  riskLevel: RiskLevel;
  feasibilityScore: number; // 0 - 100
  aiVerdict: string;
  recommendationDetails: string[];
}

export interface WhatIfSimulationResult {
  id: string;
  timestamp: string;
  input: WhatIfScenarioInput;
  baseline: {
    savings: number;
    emergencyMonths: number;
    healthScore: number;
  };
  options: {
    cashOption: ScenarioResult;
    emiOption: ScenarioResult;
    delaySavingsOption: ScenarioResult;
  };
  bestOption: 'cash' | 'emi' | 'save_delay';
  aiExecutiveSummary: string;
}

export interface OCRScanResult {
  merchant: string;
  date: string;
  amount: number;
  category: Category;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI';
  confidence: number;
  rawText: string;
  lineItems: Array<{ description: string; price: number; quantity?: number }>;
  budgetCheck: {
    categoryLimit: number;
    spentBefore: number;
    spentAfter: number;
    remainingAfter: number;
    status: 'within' | 'approaching' | 'exceeded';
    message: string;
    isOverallBreach: boolean;
  };
}

export interface ForecastPeriod {
  month: string;
  projectedIncome: number;
  projectedExpense: number;
  projectedSavings: number;
  cumulativeSavings: number;
  upperConfidenceBound: number;
  lowerConfidenceBound: number;
  categoryBreakdown: Record<string, number>;
}

export interface MLAnomaly {
  id: string;
  category: Category;
  baselineAvg: number;
  currentTrend: number;
  growthPercent: number;
  severity: 'low' | 'warning' | 'critical';
  recommendation: string;
}

export interface ESP32DeviceState {
  isConnected: boolean;
  screenIndex: number; // 0: Health, 1: Emergency, 2: Savings, 3: Risk
  ledColor: 'green' | 'amber' | 'red' | 'blue';
  ledBlinking: boolean;
  activeRisk: RiskLevel;
  displayStatusText: string;
  lastSyncTimestamp: string;
}
