import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge } from '../common/Card';
import { generateExpenseAndSavingsForecast, detectSpendingAnomalies } from '../../services/forecastingEngine';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Brain, 
  ShieldAlert, 
  Calendar, 
  Sliders, 
  ArrowUpRight 
} from 'lucide-react';

export const ForecastView: React.FC = () => {
  const { userProfile, budgets, transactions } = useApp();

  const [horizon, setHorizon] = useState<number>(12); // 3, 6, 12 months
  const [salaryBoostPercent, setSalaryBoostPercent] = useState<number>(0);
  const [expenseCutPercent, setExpenseCutPercent] = useState<number>(0);

  // Adjusted profile for scenario forecasting
  const simulatedProfile = {
    ...userProfile,
    monthlyIncome: Math.round(userProfile.monthlyIncome * (1 + salaryBoostPercent / 100))
  };

  const simulatedBudgets = budgets.map(b => ({
    ...b,
    spentAmount: Math.round(b.spentAmount * (1 - expenseCutPercent / 100)),
    allocatedAmount: Math.round(b.allocatedAmount * (1 - expenseCutPercent / 100))
  }));

  const forecastData = generateExpenseAndSavingsForecast(
    simulatedProfile,
    simulatedBudgets,
    transactions,
    horizon
  );

  const anomalies = detectSpendingAnomalies(budgets, transactions);

  const endHorizonCumulative = forecastData[forecastData.length - 1]?.cumulativeSavings || 0;
  const netWealthGained = endHorizonCumulative - userProfile.currentSavings;

  return (
    <div className="space-y-6 animate-fade-slide-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-fintwin-ink dark:text-white tracking-tight">
              Machine Learning Expense & Savings Forecast
            </h1>
            <Badge variant="indigo" size="sm" icon={<Brain className="w-3 h-3" />}>
              Linear Regression + Drift
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Predictive time-series modeling of category spending drift, seasonal inflation, and 12-month wealth accumulation.
          </p>
        </div>

        {/* Horizon Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          {[3, 6, 12].map(m => (
            <button
              key={m}
              onClick={() => setHorizon(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                horizon === m 
                  ? 'bg-fintwin-indigo text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-fintwin-ink'
              }`}
            >
              {m} Months
            </button>
          ))}
        </div>
      </div>

      {/* ML ANOMALIES & OVERSPEND RADAR */}
      {anomalies.length > 0 && (
        <Card className="p-5 border-l-4 border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              ML Anomaly Detector: {anomalies.length} Category Alert{anomalies.length > 1 ? 's' : ''} Identified
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {anomalies.map(anomaly => (
              <div key={anomaly.id} className="p-3 rounded-xl bg-white dark:bg-fintwin-darkSurface border border-amber-200/60 dark:border-amber-900/60 text-xs space-y-1 shadow-sm">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{anomaly.category}</span>
                  <Badge variant={anomaly.severity === 'critical' ? 'coral' : 'amber'} size="sm">
                    {anomaly.growthPercent}% of Cap
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{anomaly.recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 12-MONTH CUMULATIVE WEALTH PROJECTION */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-6">
          <div>
            <h3 className="font-extrabold text-base text-fintwin-ink dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-fintwin-mint" />
              {horizon}-Month Cumulative Savings Trajectory
            </h3>
            <p className="text-xs text-slate-400">
              Projected net balance growth under current behavior
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400">Projected Total Balance:</span>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                ₹{endHorizonCumulative.toLocaleString('en-IN')}
              </div>
            </div>
            <Badge variant="mint" size="sm" icon={<ArrowUpRight className="w-3.5 h-3.5" />}>
              +₹{netWealthGained.toLocaleString('en-IN')}
            </Badge>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#94A3B8" fontSize={11} tickFormatter={val => `₹${val/1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={11} tickFormatter={val => `₹${val/1000}k`} />
              <Tooltip 
                formatter={(val: number, name: string) => [`₹${val.toLocaleString('en-IN')}`, name]}
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              
              <Area yAxisId="left" type="monotone" dataKey="cumulativeSavings" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorCumSavings)" name="Cumulative Savings" />
              <Bar yAxisId="right" dataKey="projectedExpense" fill="#EF4444" radius={[4, 4, 0, 0]} name="Monthly Expense" opacity={0.8} />
              <Line yAxisId="right" type="monotone" dataKey="projectedSavings" stroke="#4F46E5" strokeWidth={2.5} name="Monthly Savings" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* INTERACTIVE FORECAST MODIFIERS */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <Sliders className="w-5 h-5 text-fintwin-indigo" />
          <h3 className="font-extrabold text-base text-fintwin-ink dark:text-white">
            Interactive Scenario Modifiers (Sensitivity Testing)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Income Modifier */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-300">Hypothetical Salary Increment (%):</span>
              <span className="text-fintwin-indigo font-extrabold">+{salaryBoostPercent}% (₹{(userProfile.monthlyIncome * (1 + salaryBoostPercent / 100)).toLocaleString('en-IN')}/mo)</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={salaryBoostPercent}
              onChange={e => setSalaryBoostPercent(Number(e.target.value))}
              className="w-full accent-fintwin-indigo cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Baseline)</span>
              <span>+25%</span>
              <span>+50% Promotion</span>
            </div>
          </div>

          {/* Expense Cut Modifier */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-300">Discretionary Expense Reduction (%):</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">-{expenseCutPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={expenseCutPercent}
              onChange={e => setExpenseCutPercent(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Current)</span>
              <span>-20% Optimized</span>
              <span>-40% Frugal</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
