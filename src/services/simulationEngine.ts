import { UserProfile, CategoryBudget, FinancialDependency, FinancialGoal, WhatIfScenarioInput, WhatIfSimulationResult, ScenarioResult } from '../types';
import { calculateHealthScore, calculateEssentialExpenses, classifyRisk } from './financialEngine';

export function calculateEMI(principal: number, annualRatePercent: number, tenureMonths: number): { monthlyEMI: number; totalInterest: number; totalPayment: number } {
  if (annualRatePercent <= 0) {
    const monthlyEMI = Math.round(principal / tenureMonths);
    return {
      monthlyEMI,
      totalInterest: 0,
      totalPayment: principal
    };
  }

  const monthlyRate = annualRatePercent / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  const roundedEMI = Math.round(emi);
  const totalPayment = roundedEMI * tenureMonths;
  const totalInterest = Math.max(totalPayment - principal, 0);

  return {
    monthlyEMI: roundedEMI,
    totalInterest,
    totalPayment
  };
}

export function runWhatIfSimulation(
  input: WhatIfScenarioInput,
  currentProfile: UserProfile,
  budgets: CategoryBudget[],
  dependencies: FinancialDependency[],
  goals: FinancialGoal[]
): WhatIfSimulationResult {
  const essentialExpenses = calculateEssentialExpenses(budgets, dependencies);
  const baselineHealth = calculateHealthScore(currentProfile, budgets, dependencies, goals);
  const baselineEmergencyMonths = baselineHealth.emergencyCoverageMonths;

  // --- Option 1: Cash / Immediate Purchase ---
  const cashProjectedSavings = Math.max(currentProfile.currentSavings - input.amount, 0);
  const cashEmergencyMonths = Number((cashProjectedSavings / Math.max(essentialExpenses, 1)).toFixed(1));
  const cashSimulatedProfile: UserProfile = {
    ...currentProfile,
    currentSavings: cashProjectedSavings
  };
  const cashHealth = calculateHealthScore(cashSimulatedProfile, budgets, dependencies, goals);
  const cashScoreDelta = cashHealth.totalScore - baselineHealth.totalScore;
  const cashRisk = classifyRisk(cashEmergencyMonths, cashHealth.totalScore, baselineHealth.debtToIncomePercent);
  
  let cashVerdict = 'High Risk Liquidity Depletion';
  if (cashEmergencyMonths >= 3.5) {
    cashVerdict = 'Safe & Manageable';
  } else if (cashEmergencyMonths >= 2.0) {
    cashVerdict = 'Moderate Caution Required';
  } else {
    cashVerdict = 'Critical: Severe Emergency Fund Drain';
  }

  const cashOption: ScenarioResult = {
    scenarioName: 'Buy Now with Full Cash',
    paymentType: 'Cash Outflow',
    initialCashOutflow: input.amount,
    monthlyObligation: 0,
    totalCost: input.amount,
    totalInterestPaid: 0,
    durationMonths: 1,
    projectedSavings: cashProjectedSavings,
    projectedEmergencyMonths: cashEmergencyMonths,
    projectedHealthScore: cashHealth.totalScore,
    scoreDelta: cashScoreDelta,
    riskLevel: cashRisk,
    feasibilityScore: Math.max(Math.min(Math.round(cashEmergencyMonths * 20), 100), 10),
    aiVerdict: cashVerdict,
    recommendationDetails: [
      `Immediate bank balance drops from ₹${currentProfile.currentSavings.toLocaleString('en-IN')} to ₹${cashProjectedSavings.toLocaleString('en-IN')}.`,
      `Emergency coverage drops from ${baselineEmergencyMonths} months to ${cashEmergencyMonths} months.`,
      cashEmergencyMonths < 2.0
        ? 'High vulnerability to unexpected medical bills or job transitions.'
        : 'Sufficient liquid reserves remain after the transaction.'
    ]
  };

  // --- Option 2: Structured EMI ---
  const tenure = input.emiDurationMonths || 6;
  const interestRate = input.interestRatePercent ?? 12;
  const downPayment = Math.min(input.downPayment || 0, input.amount * 0.5);
  const financedAmount = input.amount - downPayment;
  const { monthlyEMI, totalInterest, totalPayment } = calculateEMI(financedAmount, interestRate, tenure);

  const emiProjectedSavings = Math.max(currentProfile.currentSavings - downPayment, 0);
  const emiEmergencyMonths = Number((emiProjectedSavings / Math.max(essentialExpenses + monthlyEMI, 1)).toFixed(1));
  
  // Simulated dependency
  const simulatedDependencies: FinancialDependency[] = [
    ...dependencies,
    {
      id: 'sim-emi',
      name: `${input.purchaseItem} EMI`,
      type: 'emi',
      monthlyAmount: monthlyEMI,
      totalAmount: totalPayment,
      paidAmount: 0,
      remainingTenureMonths: tenure,
      interestRate: interestRate,
      dueDateDay: 10,
      autoRenew: false,
      category: 'Debt & EMIs',
      status: 'active'
    }
  ];

  const emiHealth = calculateHealthScore(
    { ...currentProfile, currentSavings: emiProjectedSavings },
    budgets,
    simulatedDependencies,
    goals
  );
  const emiScoreDelta = emiHealth.totalScore - baselineHealth.totalScore;
  const emiDebtRatio = Number((((baselineHealth.debtToIncomePercent * currentProfile.monthlyIncome / 100 + monthlyEMI) / currentProfile.monthlyIncome) * 100).toFixed(1));
  const emiRisk = classifyRisk(emiEmergencyMonths, emiHealth.totalScore, emiDebtRatio);

  const emiOption: ScenarioResult = {
    scenarioName: `${tenure}-Month EMI Plan (${interestRate}% p.a.)`,
    paymentType: 'Monthly Installments',
    initialCashOutflow: downPayment,
    monthlyObligation: monthlyEMI,
    totalCost: totalPayment + downPayment,
    totalInterestPaid: totalInterest,
    durationMonths: tenure,
    projectedSavings: emiProjectedSavings,
    projectedEmergencyMonths: emiEmergencyMonths,
    projectedHealthScore: emiHealth.totalScore,
    scoreDelta: emiScoreDelta,
    riskLevel: emiRisk,
    feasibilityScore: Math.max(Math.min(Math.round((100 - emiDebtRatio) * 1.1), 95), 25),
    aiVerdict: emiRisk === 'low' || emiRisk === 'medium' ? 'Balanced Liquidity Preservation' : 'Debt Strain Risk',
    recommendationDetails: [
      `Preserves ₹${emiProjectedSavings.toLocaleString('en-IN')} in emergency savings while spreading cost over ${tenure} months.`,
      `Monthly installment of ₹${monthlyEMI.toLocaleString('en-IN')} increases Debt-to-Income to ${emiDebtRatio}%.`,
      totalInterest > 0
        ? `Incurs an additional ₹${totalInterest.toLocaleString('en-IN')} in interest charges.`
        : 'Zero additional interest incurred (No-Cost EMI).'
    ]
  };

  // --- Option 3: Save & Delay Plan ---
  const monthlySavingsPace = Math.max(input.monthlyAdditionalSavings || currentProfile.monthlySavingsTarget || 10000, 2000);
  const monthsNeeded = Math.ceil(input.amount / monthlySavingsPace);
  const delayProjectedSavings = currentProfile.currentSavings + (monthlySavingsPace * monthsNeeded) - input.amount;
  const delayEmergencyMonths = baselineEmergencyMonths;
  const delayHealthScore = Math.min(baselineHealth.totalScore + 4, 98);

  const delaySavingsOption: ScenarioResult = {
    scenarioName: `Save & Purchase in ${monthsNeeded} Months`,
    paymentType: 'Disciplined Goal Sinking Fund',
    initialCashOutflow: 0,
    monthlyObligation: monthlySavingsPace,
    totalCost: input.amount,
    totalInterestPaid: 0,
    durationMonths: monthsNeeded,
    projectedSavings: delayProjectedSavings,
    projectedEmergencyMonths: delayEmergencyMonths,
    projectedHealthScore: delayHealthScore,
    scoreDelta: +4,
    riskLevel: 'low',
    feasibilityScore: 98,
    aiVerdict: 'Zero Risk & Maximum Long-Term Wealth Growth',
    recommendationDetails: [
      `Set aside ₹${monthlySavingsPace.toLocaleString('en-IN')}/month into a dedicated goal for ${monthsNeeded} months.`,
      '100% emergency fund stays intact with ₹0 debt and ₹0 interest wasted.',
      'Improves your Financial Health Score through systematic savings consistency.'
    ]
  };

  // Determine Best Option
  let bestOption: 'cash' | 'emi' | 'save_delay' = 'save_delay';
  if (cashEmergencyMonths >= 4.0 && cashHealth.totalScore >= 75) {
    bestOption = 'cash';
  } else if (emiDebtRatio <= 28 && emiEmergencyMonths >= 2.5) {
    bestOption = 'emi';
  } else {
    bestOption = 'save_delay';
  }

  let aiSummary = '';
  if (bestOption === 'save_delay') {
    aiSummary = `Buying the ${input.purchaseItem} for ₹${input.amount.toLocaleString('en-IN')} in cash would severely deplete your emergency reserve to ${cashEmergencyMonths} months (down from ${baselineEmergencyMonths} months). The safest strategy is the Save & Delay plan: allocate ₹${monthlySavingsPace.toLocaleString('en-IN')}/month to purchase it debt-free in ${monthsNeeded} months. Alternatively, if urgent, choose a 6-month EMI to maintain your liquid cushion.`;
  } else if (bestOption === 'emi') {
    aiSummary = `A ${tenure}-month EMI of ₹${monthlyEMI.toLocaleString('en-IN')}/mo is the optimal balance. It keeps ₹${emiProjectedSavings.toLocaleString('en-IN')} safe in your emergency buffer while fitting comfortably within your monthly income surplus.`;
  } else {
    aiSummary = `Your strong financial profile allows you to purchase the ${input.purchaseItem} outright in cash. Even after the ₹${input.amount.toLocaleString('en-IN')} payment, you will retain ${cashEmergencyMonths} months of emergency cushion.`;
  }

  return {
    id: `sim-${Date.now()}`,
    timestamp: new Date().toISOString(),
    input,
    baseline: {
      savings: currentProfile.currentSavings,
      emergencyMonths: baselineEmergencyMonths,
      healthScore: baselineHealth.totalScore
    },
    options: {
      cashOption,
      emiOption,
      delaySavingsOption
    },
    bestOption,
    aiExecutiveSummary: aiSummary
  };
}
