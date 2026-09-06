import { UserProfile, CategoryBudget, Transaction, ForecastPeriod, MLAnomaly } from '../types';

export function generateExpenseAndSavingsForecast(
  profile: UserProfile,
  budgets: CategoryBudget[],
  transactions: Transaction[],
  horizonMonths: number = 6
): ForecastPeriod[] {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  
  const currentTotalSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const baselineMonthlyExpense = Math.max(currentTotalSpent, budgets.reduce((acc, b) => acc + b.allocatedAmount, 0) * 0.95);
  const baselineMonthlyIncome = profile.monthlyIncome;

  // Linear trend factor (inflation + slight trend modeling)
  const monthlyGrowthRate = 0.008; // 0.8% organic monthly drift
  let cumulativeSavings = profile.currentSavings;

  const forecast: ForecastPeriod[] = [];

  for (let i = 1; i <= horizonMonths; i++) {
    const targetMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const monthLabel = `${monthNames[targetMonthDate.getMonth()]} ${targetMonthDate.getFullYear().toString().slice(2)}`;
    
    // Slight seasonal variation (e.g. festive season or summer peak)
    const seasonalityMultiplier = 1 + (Math.sin(i * 0.7) * 0.03);
    const projectedExpense = Math.round(baselineMonthlyExpense * Math.pow(1 + monthlyGrowthRate, i) * seasonalityMultiplier);
    const projectedIncome = baselineMonthlyIncome;
    const projectedSavings = Math.max(projectedIncome - projectedExpense, 0);
    
    cumulativeSavings += projectedSavings;

    const uncertaintySpread = projectedExpense * (0.04 + i * 0.015);

    const categoryBreakdown: Record<string, number> = {};
    budgets.forEach(b => {
      const proportion = b.allocatedAmount / Math.max(baselineMonthlyExpense, 1);
      categoryBreakdown[b.category] = Math.round(projectedExpense * proportion);
    });

    forecast.push({
      month: monthLabel,
      projectedIncome,
      projectedExpense,
      projectedSavings,
      cumulativeSavings,
      upperConfidenceBound: Math.round(projectedExpense + uncertaintySpread),
      lowerConfidenceBound: Math.round(Math.max(projectedExpense - uncertaintySpread, 0)),
      categoryBreakdown
    });
  }

  return forecast;
}

export function detectSpendingAnomalies(budgets: CategoryBudget[], transactions: Transaction[]): MLAnomaly[] {
  const anomalies: MLAnomaly[] = [];

  budgets.forEach((budget, index) => {
    const ratio = budget.spentAmount / Math.max(budget.allocatedAmount, 1);
    if (ratio >= 0.85) {
      const growthPercent = Math.round((ratio - 1) * 100);
      const isBreached = ratio >= 1.0;
      
      anomalies.push({
        id: `anomaly-${index}`,
        category: budget.category,
        baselineAvg: budget.allocatedAmount,
        currentTrend: budget.spentAmount,
        growthPercent: growthPercent > 0 ? growthPercent : Math.round(ratio * 100),
        severity: isBreached ? 'critical' : ratio >= 0.9 ? 'warning' : 'low',
        recommendation: isBreached 
          ? `Over budget by ₹${(budget.spentAmount - budget.allocatedAmount).toLocaleString('en-IN')}. Pause non-essential ${budget.category} purchases until next cycle.`
          : `Approaching cap (${Math.round(ratio * 100)}% consumed). Only ₹${(budget.allocatedAmount - budget.spentAmount).toLocaleString('en-IN')} remaining.`
      });
    }
  });

  return anomalies;
}
