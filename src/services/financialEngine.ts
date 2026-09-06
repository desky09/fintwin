import { UserProfile, CategoryBudget, FinancialDependency, FinancialGoal, HealthScoreBreakdown, HealthScoreTier, RiskLevel } from '../types';

export function calculateEssentialExpenses(
  budgets: CategoryBudget[],
  dependencies: FinancialDependency[]
): number {
  const essentialCategories = ['Housing & Rent', 'Groceries', 'Utilities & Bills', 'Healthcare', 'Debt & EMIs'];
  
  const budgetEssentials = budgets
    .filter(b => essentialCategories.includes(b.category))
    .reduce((sum, b) => sum + b.allocatedAmount, 0);

  const activeDebtSubscriptions = dependencies
    .filter(d => d.status === 'active')
    .reduce((sum, d) => sum + d.monthlyAmount, 0);

  // Take the higher realistic floor of essentials
  return Math.max(budgetEssentials, activeDebtSubscriptions, 15000);
}

export function calculateHealthScore(
  profile: UserProfile,
  budgets: CategoryBudget[],
  dependencies: FinancialDependency[],
  goals: FinancialGoal[]
): HealthScoreBreakdown {
  const totalIncome = Math.max(profile.monthlyIncome, 1);
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  
  const totalDebtMonthly = dependencies
    .filter(d => d.status === 'active' && (d.type === 'loan' || d.type === 'emi' || d.type === 'credit_card'))
    .reduce((sum, d) => sum + d.monthlyAmount, 0);

  const essentialMonthlyExpenses = calculateEssentialExpenses(budgets, dependencies);
  const emergencyCoverageMonths = Number((profile.currentSavings / Math.max(essentialMonthlyExpenses, 1)).toFixed(1));

  // 1. Savings Behavior (30 pts)
  const monthlySavings = Math.max(totalIncome - totalSpent, 0);
  const savingsRatePercent = Number(((monthlySavings / totalIncome) * 100).toFixed(1));
  let savingsScore = 0;
  if (savingsRatePercent >= 40) savingsScore = 30;
  else if (savingsRatePercent >= 25) savingsScore = 24 + ((savingsRatePercent - 25) / 15) * 6;
  else if (savingsRatePercent >= 15) savingsScore = 16 + ((savingsRatePercent - 15) / 10) * 8;
  else if (savingsRatePercent >= 5) savingsScore = 8 + ((savingsRatePercent - 5) / 10) * 8;
  else savingsScore = Math.max(savingsRatePercent, 2);

  // 2. Expense Control (20 pts)
  let expenseControlScore = 20;
  if (totalSpent > totalAllocated) {
    const overspendRatio = (totalSpent - totalAllocated) / Math.max(totalAllocated, 1);
    expenseControlScore = Math.max(20 - overspendRatio * 30, 4);
  } else {
    // Check individual category breaches
    const breachedCount = budgets.filter(b => b.spentAmount > b.allocatedAmount).length;
    expenseControlScore = Math.max(20 - breachedCount * 3, 8);
  }

  // 3. Emergency Fund Coverage (20 pts)
  let emergencyFundScore = 0;
  if (emergencyCoverageMonths >= 6) emergencyFundScore = 20;
  else if (emergencyCoverageMonths >= 3) emergencyFundScore = 14 + ((emergencyCoverageMonths - 3) / 3) * 6;
  else if (emergencyCoverageMonths >= 1.5) emergencyFundScore = 8 + ((emergencyCoverageMonths - 1.5) / 1.5) * 6;
  else if (emergencyCoverageMonths >= 0.5) emergencyFundScore = 4 + ((emergencyCoverageMonths - 0.5) / 1) * 4;
  else emergencyFundScore = Math.max(emergencyCoverageMonths * 6, 1);

  // 4. Debt Burden (15 pts)
  const debtToIncomePercent = Number(((totalDebtMonthly / totalIncome) * 100).toFixed(1));
  let debtBurdenScore = 0;
  if (debtToIncomePercent <= 10) debtBurdenScore = 15;
  else if (debtToIncomePercent <= 25) debtBurdenScore = 12 + ((25 - debtToIncomePercent) / 15) * 3;
  else if (debtToIncomePercent <= 40) debtBurdenScore = 7 + ((40 - debtToIncomePercent) / 15) * 5;
  else if (debtToIncomePercent <= 55) debtBurdenScore = 3 + ((55 - debtToIncomePercent) / 15) * 4;
  else debtBurdenScore = 1;

  // 5. Goal Progress (15 pts)
  let goalProgressScore = 12; // default if no goals
  if (goals.length > 0) {
    const avgProgress = goals.reduce((acc, g) => acc + Math.min(g.currentAmount / Math.max(g.targetAmount, 1), 1), 0) / goals.length;
    goalProgressScore = Math.round(avgProgress * 15);
  }

  const rawTotal = Math.round(savingsScore + expenseControlScore + emergencyFundScore + debtBurdenScore + goalProgressScore);
  const totalScore = Math.min(Math.max(rawTotal, 5), 99);

  let tier: HealthScoreTier = 'Moderate';
  if (totalScore >= 80) tier = 'Excellent';
  else if (totalScore >= 60) tier = 'Good';
  else if (totalScore >= 40) tier = 'Moderate';
  else if (totalScore >= 20) tier = 'Risky';
  else tier = 'Critical';

  // Insights generation
  const insights: string[] = [];
  if (emergencyCoverageMonths < 3) {
    insights.push(`Emergency cushion is ${emergencyCoverageMonths} months (target: 3-6 months). Prioritize liquid reserves.`);
  } else {
    insights.push(`Strong emergency coverage of ${emergencyCoverageMonths} months provides high resilience against shocks.`);
  }

  if (savingsRatePercent >= 30) {
    insights.push(`High savings rate of ${savingsRatePercent}% allows rapid goal acceleration.`);
  } else if (savingsRatePercent < 15) {
    insights.push(`Current savings rate is ${savingsRatePercent}%. Aim to trim discretionary subscriptions.`);
  }

  if (debtToIncomePercent > 30) {
    insights.push(`Debt-to-Income is ${debtToIncomePercent}%. Avoid taking on new EMIs.`);
  }

  return {
    totalScore,
    tier,
    savingsScore: Math.round(savingsScore),
    expenseControlScore: Math.round(expenseControlScore),
    emergencyFundScore: Math.round(emergencyFundScore),
    debtBurdenScore: Math.round(debtBurdenScore),
    goalProgressScore: Math.round(goalProgressScore),
    emergencyCoverageMonths,
    essentialMonthlyExpenses,
    savingsRatePercent,
    debtToIncomePercent,
    insights
  };
}

export function classifyRisk(emergencyMonths: number, score: number, debtRatio: number): RiskLevel {
  if (emergencyMonths < 1.0 || score < 30 || debtRatio > 50) return 'critical';
  if (emergencyMonths < 2.5 || score < 55 || debtRatio > 35) return 'high';
  if (emergencyMonths < 4.0 || score < 75 || debtRatio > 25) return 'medium';
  return 'low';
}
