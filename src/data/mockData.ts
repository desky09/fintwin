import { UserProfile, Transaction, CategoryBudget, FinancialDependency, FinancialGoal } from '../types';

export const PERSONA_A_SALARIED: {
  profile: UserProfile;
  transactions: Transaction[];
  budgets: CategoryBudget[];
  dependencies: FinancialDependency[];
  goals: FinancialGoal[];
} = {
  profile: {
    id: 'user-persona-a',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@techcorp.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    monthlyIncome: 50000,
    currentSavings: 80000,
    monthlySavingsTarget: 23000,
    overallMonthlyBudgetCap: 27000,
    currency: 'INR',
    personaType: 'salaried',
    createdAt: '2026-01-15'
  },
  budgets: [
    { category: 'Groceries', allocatedAmount: 7000, spentAmount: 5200, iconName: 'ShoppingBag', color: '#10B981' },
    { category: 'Housing & Rent', allocatedAmount: 11000, spentAmount: 11000, iconName: 'Home', color: '#6366F1' },
    { category: 'Dining & Food', allocatedAmount: 3500, spentAmount: 3100, iconName: 'Utensils', color: '#F59E0B' },
    { category: 'Transportation', allocatedAmount: 2500, spentAmount: 1900, iconName: 'Car', color: '#3B82F6' },
    { category: 'Entertainment', allocatedAmount: 2000, spentAmount: 1800, iconName: 'Film', color: '#EC4899' },
    { category: 'Utilities & Bills', allocatedAmount: 2000, spentAmount: 1600, iconName: 'Zap', color: '#8B5CF6' },
    { category: 'Shopping & Gadgets', allocatedAmount: 3000, spentAmount: 2400, iconName: 'Smartphone', color: '#06B6D4' }
  ],
  dependencies: [
    {
      id: 'dep-1',
      name: 'Gadget Loan (Tablet EMI)',
      type: 'emi',
      monthlyAmount: 2800,
      totalAmount: 33600,
      paidAmount: 22400,
      remainingTenureMonths: 4,
      interestRate: 11.5,
      dueDateDay: 5,
      autoRenew: false,
      category: 'Debt & EMIs',
      status: 'active'
    },
    {
      id: 'dep-2',
      name: 'Netflix Premium 4K',
      type: 'subscription',
      monthlyAmount: 649,
      dueDateDay: 18,
      autoRenew: true,
      category: 'Entertainment',
      status: 'active'
    },
    {
      id: 'dep-3',
      name: 'Spotify Family Plan',
      type: 'subscription',
      monthlyAmount: 179,
      dueDateDay: 22,
      autoRenew: true,
      category: 'Entertainment',
      status: 'active'
    },
    {
      id: 'dep-4',
      name: 'Anytime Fitness Gym',
      type: 'subscription',
      monthlyAmount: 1500,
      dueDateDay: 1,
      autoRenew: true,
      category: 'Healthcare',
      status: 'active'
    },
    {
      id: 'dep-5',
      name: 'Term Health Insurance',
      type: 'insurance',
      monthlyAmount: 1200,
      totalAmount: 14400,
      dueDateDay: 10,
      autoRenew: true,
      category: 'Healthcare',
      status: 'active'
    }
  ],
  goals: [
    {
      id: 'goal-1',
      name: '6-Month Emergency Fund',
      targetAmount: 150000,
      currentAmount: 80000,
      deadline: '2026-12-31',
      monthlyTarget: 10000,
      category: 'Safety',
      priority: 'high',
      icon: 'ShieldCheck'
    },
    {
      id: 'goal-2',
      name: 'Dream Royal Enfield Bike',
      targetAmount: 120000,
      currentAmount: 35000,
      deadline: '2027-04-30',
      monthlyTarget: 8000,
      category: 'Vehicle',
      priority: 'medium',
      icon: 'Bike'
    }
  ],
  transactions: [
    {
      id: 'tx-1',
      userId: 'user-persona-a',
      merchant: 'FreshMart Supermarket',
      amount: 2450,
      category: 'Groceries',
      type: 'expense',
      date: '2026-09-04',
      paymentMethod: 'UPI',
      description: 'Weekly organic veggies & pantry items',
      isScanned: true,
      confidence: 0.98
    },
    {
      id: 'tx-2',
      userId: 'user-persona-a',
      merchant: 'Urban Landlord Rent',
      amount: 11000,
      category: 'Housing & Rent',
      type: 'expense',
      date: '2026-09-01',
      paymentMethod: 'Net Banking',
      description: 'September 2026 Apartment Rent'
    },
    {
      id: 'tx-3',
      userId: 'user-persona-a',
      merchant: 'Swiggy Gourmet',
      amount: 850,
      category: 'Dining & Food',
      type: 'expense',
      date: '2026-09-03',
      paymentMethod: 'UPI',
      description: 'Dinner with colleagues',
      isScanned: true,
      confidence: 0.95
    },
    {
      id: 'tx-4',
      userId: 'user-persona-a',
      merchant: 'Indian Oil Fuel Station',
      amount: 1200,
      category: 'Transportation',
      type: 'expense',
      date: '2026-09-02',
      paymentMethod: 'Debit Card',
      description: 'Full tank petrol for commute'
    },
    {
      id: 'tx-5',
      userId: 'user-persona-a',
      merchant: 'Electricity BESCOM',
      amount: 1600,
      category: 'Utilities & Bills',
      type: 'expense',
      date: '2026-09-02',
      paymentMethod: 'UPI',
      description: 'August monthly power consumption',
      isScanned: true,
      confidence: 0.99
    },
    {
      id: 'tx-6',
      userId: 'user-persona-a',
      merchant: 'Amazon Retail',
      amount: 2400,
      category: 'Shopping & Gadgets',
      type: 'expense',
      date: '2026-08-28',
      paymentMethod: 'Credit Card',
      description: 'Wireless ergonomic mouse & desk pad'
    },
    {
      id: 'tx-7',
      userId: 'user-persona-a',
      merchant: 'TechCorp Salary Deposit',
      amount: 50000,
      category: 'Investments',
      type: 'income',
      date: '2026-09-01',
      paymentMethod: 'Net Banking',
      description: 'August 2026 Monthly Salary'
    }
  ]
};

export const PERSONA_B_FREELANCER: {
  profile: UserProfile;
  transactions: Transaction[];
  budgets: CategoryBudget[];
  dependencies: FinancialDependency[];
  goals: FinancialGoal[];
} = {
  profile: {
    id: 'user-persona-b',
    name: 'Rhea Sen (Freelancer)',
    email: 'rhea.design@freelance.co',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    monthlyIncome: 75000,
    currentSavings: 140000,
    monthlySavingsTarget: 32000,
    overallMonthlyBudgetCap: 38000,
    currency: 'INR',
    personaType: 'freelancer',
    createdAt: '2025-11-20'
  },
  budgets: [
    { category: 'Housing & Rent', allocatedAmount: 16000, spentAmount: 16000, iconName: 'Home', color: '#6366F1' },
    { category: 'Groceries', allocatedAmount: 8000, spentAmount: 6800, iconName: 'ShoppingBag', color: '#10B981' },
    { category: 'Dining & Food', allocatedAmount: 6000, spentAmount: 5100, iconName: 'Utensils', color: '#F59E0B' },
    { category: 'Utilities & Bills', allocatedAmount: 4000, spentAmount: 3200, iconName: 'Zap', color: '#8B5CF6' },
    { category: 'Shopping & Gadgets', allocatedAmount: 4000, spentAmount: 6900, iconName: 'Smartphone', color: '#EF4444' }
  ],
  dependencies: [
    {
      id: 'dep-b1',
      name: 'WeWork Co-working Desk',
      type: 'subscription',
      monthlyAmount: 7000,
      dueDateDay: 1,
      autoRenew: true,
      category: 'Housing & Rent',
      status: 'active'
    },
    {
      id: 'dep-b2',
      name: 'Adobe Creative Cloud',
      type: 'subscription',
      monthlyAmount: 4200,
      dueDateDay: 14,
      autoRenew: true,
      category: 'Shopping & Gadgets',
      status: 'active'
    },
    {
      id: 'dep-b3',
      name: 'MacBook Pro EMI',
      type: 'emi',
      monthlyAmount: 4500,
      totalAmount: 54000,
      paidAmount: 36000,
      remainingTenureMonths: 4,
      interestRate: 9.5,
      dueDateDay: 10,
      autoRenew: false,
      category: 'Debt & EMIs',
      status: 'active'
    }
  ],
  goals: [
    {
      id: 'goal-b1',
      name: 'Tax Reserve 2026',
      targetAmount: 80000,
      currentAmount: 60000,
      deadline: '2026-11-30',
      monthlyTarget: 10000,
      category: 'Taxes',
      priority: 'high',
      icon: 'ShieldAlert'
    },
    {
      id: 'goal-b2',
      name: '6-Month Runway Fund',
      targetAmount: 250000,
      currentAmount: 140000,
      deadline: '2027-06-30',
      monthlyTarget: 15000,
      category: 'Safety',
      priority: 'high',
      icon: 'ShieldCheck'
    }
  ],
  transactions: [
    {
      id: 'tx-b1',
      userId: 'user-persona-b',
      merchant: 'Fintech App Client Invoice',
      amount: 45000,
      category: 'Investments',
      type: 'income',
      date: '2026-09-02',
      paymentMethod: 'Net Banking',
      description: 'UI/UX Deliverable Milestone 1'
    },
    {
      id: 'tx-b2',
      userId: 'user-persona-b',
      merchant: 'SaaS Design Retainer',
      amount: 30000,
      category: 'Investments',
      type: 'income',
      date: '2026-09-03',
      paymentMethod: 'UPI',
      description: 'Monthly retainership fee'
    },
    {
      id: 'tx-b3',
      userId: 'user-persona-b',
      merchant: 'Apple Store Repair & Accessory',
      amount: 6900,
      category: 'Shopping & Gadgets',
      type: 'expense',
      date: '2026-09-04',
      paymentMethod: 'Credit Card',
      description: 'Monitor arm & USB-C dock',
      isScanned: true,
      confidence: 0.99
    }
  ]
};

export const PERSONA_C_FAMILY: {
  profile: UserProfile;
  transactions: Transaction[];
  budgets: CategoryBudget[];
  dependencies: FinancialDependency[];
  goals: FinancialGoal[];
} = {
  profile: {
    id: 'user-persona-c',
    name: 'Vikram & Priya Patel',
    email: 'vikram.patel@corp.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    monthlyIncome: 120000,
    currentSavings: 210000,
    monthlySavingsTarget: 45000,
    overallMonthlyBudgetCap: 74000,
    currency: 'INR',
    personaType: 'family',
    createdAt: '2025-05-10'
  },
  budgets: [
    { category: 'Housing & Rent', allocatedAmount: 32000, spentAmount: 32000, iconName: 'Home', color: '#6366F1' },
    { category: 'Groceries', allocatedAmount: 18000, spentAmount: 14500, iconName: 'ShoppingBag', color: '#10B981' },
    { category: 'Utilities & Bills', allocatedAmount: 9000, spentAmount: 8200, iconName: 'Zap', color: '#8B5CF6' },
    { category: 'Transportation', allocatedAmount: 8000, spentAmount: 7100, iconName: 'Car', color: '#3B82F6' },
    { category: 'Healthcare', allocatedAmount: 7000, spentAmount: 4800, iconName: 'HeartPulse', color: '#EF4444' }
  ],
  dependencies: [
    {
      id: 'dep-c1',
      name: 'HDFC Home Loan EMI',
      type: 'loan',
      monthlyAmount: 32000,
      totalAmount: 3500000,
      paidAmount: 950000,
      remainingTenureMonths: 140,
      interestRate: 8.75,
      dueDateDay: 7,
      autoRenew: false,
      category: 'Housing & Rent',
      status: 'active'
    },
    {
      id: 'dep-c2',
      name: 'Hyundai Creta Car EMI',
      type: 'emi',
      monthlyAmount: 11500,
      totalAmount: 690000,
      paidAmount: 414000,
      remainingTenureMonths: 24,
      interestRate: 8.9,
      dueDateDay: 15,
      autoRenew: false,
      category: 'Transportation',
      status: 'active'
    },
    {
      id: 'dep-c3',
      name: 'Max Bupa Family Health Cover',
      type: 'insurance',
      monthlyAmount: 3200,
      totalAmount: 38400,
      dueDateDay: 20,
      autoRenew: true,
      category: 'Healthcare',
      status: 'active'
    }
  ],
  goals: [
    {
      id: 'goal-c1',
      name: 'Children Higher Education Fund',
      targetAmount: 1000000,
      currentAmount: 210000,
      deadline: '2030-06-30',
      monthlyTarget: 20000,
      category: 'Education',
      priority: 'high',
      icon: 'GraduationCap'
    },
    {
      id: 'goal-c2',
      name: 'Kitchen & Living Renovation',
      targetAmount: 300000,
      currentAmount: 90000,
      deadline: '2027-03-31',
      monthlyTarget: 15000,
      category: 'Home',
      priority: 'medium',
      icon: 'Hammer'
    }
  ],
  transactions: [
    {
      id: 'tx-c1',
      userId: 'user-persona-c',
      merchant: 'VP Executive Salary',
      amount: 120000,
      category: 'Investments',
      type: 'income',
      date: '2026-09-01',
      paymentMethod: 'Net Banking',
      description: 'Monthly Senior Management Remuneration'
    },
    {
      id: 'tx-c2',
      userId: 'user-persona-c',
      merchant: 'D-Mart Mega Hypermarket',
      amount: 8400,
      category: 'Groceries',
      type: 'expense',
      date: '2026-09-02',
      paymentMethod: 'Credit Card',
      description: 'Monthly bulk pantry & household essentials',
      isScanned: true,
      confidence: 0.97
    }
  ]
};
