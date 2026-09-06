import { Category, CategoryBudget, OCRScanResult, UserProfile } from '../types';
import { PRESET_RECEIPTS } from '../data/presetReceipts';

export function processReceiptOCR(
  rawInput: {
    merchant?: string;
    amount?: number;
    category?: Category;
    date?: string;
    presetId?: string;
  },
  budgets: CategoryBudget[],
  profile: UserProfile
): OCRScanResult {
  // If preset selected
  if (rawInput.presetId) {
    const preset = PRESET_RECEIPTS.find(p => p.id === rawInput.presetId);
    if (preset) {
      const budget = budgets.find(b => b.category === preset.mockResult.category);
      const categoryLimit = budget ? budget.allocatedAmount : 5000;
      const spentBefore = budget ? budget.spentAmount : 0;
      const spentAfter = spentBefore + preset.mockResult.amount;
      const remainingAfter = categoryLimit - spentAfter;
      const ratio = spentAfter / Math.max(categoryLimit, 1);
      
      let status: 'within' | 'approaching' | 'exceeded' = 'within';
      let message = '';
      if (ratio >= 1.0) {
        status = 'exceeded';
        message = `Critical: This bill is ₹${Math.abs(remainingAfter).toLocaleString('en-IN')} above your ${preset.mockResult.category} budget this month!`;
      } else if (ratio >= 0.8) {
        status = 'approaching';
        message = `Warning: You are close to your ${preset.mockResult.category} limit. Only ₹${remainingAfter.toLocaleString('en-IN')} remaining.`;
      } else {
        status = 'within';
        message = `Logged. You have ₹${remainingAfter.toLocaleString('en-IN')} left in ${preset.mockResult.category} this month.`;
      }

      const totalSpentAll = budgets.reduce((acc, b) => acc + b.spentAmount, 0) + preset.mockResult.amount;
      const isOverallBreach = totalSpentAll > profile.overallMonthlyBudgetCap;

      return {
        ...preset.mockResult,
        budgetCheck: {
          categoryLimit,
          spentBefore,
          spentAfter,
          remainingAfter,
          status,
          message,
          isOverallBreach
        }
      };
    }
  }

  // Custom bill input
  const merchant = rawInput.merchant || 'Retail Merchant Outlet';
  const amount = rawInput.amount || 1250;
  const category: Category = rawInput.category || 'Shopping & Gadgets';
  const date = rawInput.date || new Date().toISOString().split('T')[0];

  const budget = budgets.find(b => b.category === category);
  const categoryLimit = budget ? budget.allocatedAmount : 5000;
  const spentBefore = budget ? budget.spentAmount : 0;
  const spentAfter = spentBefore + amount;
  const remainingAfter = categoryLimit - spentAfter;
  const ratio = spentAfter / Math.max(categoryLimit, 1);

  let status: 'within' | 'approaching' | 'exceeded' = 'within';
  let message = '';
  if (ratio >= 1.0) {
    status = 'exceeded';
    message = `Critical: This bill is ₹${Math.abs(remainingAfter).toLocaleString('en-IN')} above your ${category} budget this month!`;
  } else if (ratio >= 0.8) {
    status = 'approaching';
    message = `Warning: You are close to your ${category} limit. Only ₹${remainingAfter.toLocaleString('en-IN')} remaining.`;
  } else {
    status = 'within';
    message = `Logged. You have ₹${remainingAfter.toLocaleString('en-IN')} left in ${category} this month.`;
  }

  const totalSpentAll = budgets.reduce((acc, b) => acc + b.spentAmount, 0) + amount;
  const isOverallBreach = totalSpentAll > profile.overallMonthlyBudgetCap;

  return {
    merchant,
    date,
    amount,
    category,
    paymentMethod: 'UPI',
    confidence: 0.97,
    rawText: `${merchant.toUpperCase()}\nDate: ${date}\nTOTAL AMOUNT: ₹${amount.toLocaleString('en-IN')}\nPayment Status: SUCCESS\nThank you for your business!`,
    lineItems: [
      { description: `${category} Itemized Expense`, price: amount, quantity: 1 }
    ],
    budgetCheck: {
      categoryLimit,
      spentBefore,
      spentAfter,
      remainingAfter,
      status,
      message,
      isOverallBreach
    }
  };
}
