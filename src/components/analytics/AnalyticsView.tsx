import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, ProgressBar } from '../common/Card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { PieChart as PieIcon, TrendingUp, DollarSign, Activity, AlertCircle } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { budgets, userProfile, healthScore, dependencies } = useApp();

  // Category comparison data (Allocated vs Spent)
  const categoryComparisonData = budgets.map(b => ({
    name: b.category.split(' ')[0],
    fullName: b.category,
    Allocated: b.allocatedAmount,
    Spent: b.spentAmount,
    Variance: b.allocatedAmount - b.spentAmount
  }));

  // Velocity data
  const velocityData = [
    { day: 'Day 1-5', velocity: 12400, expected: 5000 },
    { day: 'Day 6-10', velocity: 6200, expected: 5000 },
    { day: 'Day 11-15', velocity: 4100, expected: 5000 },
    { day: 'Day 16-20', velocity: 2800, expected: 5000 },
    { day: 'Day 21-25', velocity: 1900, expected: 5000 },
    { day: 'Day 26-30', velocity: 0, expected: 5000 }
  ];

  return (
    <div className="space-y-6 animate-fade-slide-up pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-fintwin-ink dark:text-white tracking-tight">
          Financial Twin Analytics & Health Breakdown
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics across category variance, spending velocity, and the 5-factor educational health score.
        </p>
      </div>

      {/* HEALTH SCORE 5-PILLAR BREAKDOWN MATRIX */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-6">
          <div>
            <h3 className="font-extrabold text-base text-fintwin-ink dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-fintwin-indigo" />
              Financial Health Score Engine (Weighting Breakdown)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Educational 100-point algorithm evaluating 5 key behavioral pillars
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-fintwin-indigo dark:text-indigo-400">
              {healthScore.totalScore}/100
            </span>
            <Badge variant={healthScore.totalScore >= 60 ? 'mint' : healthScore.totalScore >= 40 ? 'amber' : 'coral'}>
              {healthScore.tier}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Pillar 1: Savings (30%) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300">Savings Behavior</span>
              <span className="font-extrabold text-fintwin-indigo">{healthScore.savingsScore}/30</span>
            </div>
            <ProgressBar value={healthScore.savingsScore} max={30} size="sm" showPercentage={false} dynamicColor={false} variant="indigo" />
            <p className="text-[10px] text-slate-400 leading-tight">
              Savings rate: {healthScore.savingsRatePercent}% of monthly net income.
            </p>
          </div>

          {/* Pillar 2: Expense Control (20%) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300">Expense Control</span>
              <span className="font-extrabold text-fintwin-mint">{healthScore.expenseControlScore}/20</span>
            </div>
            <ProgressBar value={healthScore.expenseControlScore} max={20} size="sm" showPercentage={false} dynamicColor={false} variant="mint" />
            <p className="text-[10px] text-slate-400 leading-tight">
              Adherence to defined category thresholds.
            </p>
          </div>

          {/* Pillar 3: Emergency Fund (20%) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300">Emergency Fund</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{healthScore.emergencyFundScore}/20</span>
            </div>
            <ProgressBar value={healthScore.emergencyFundScore} max={20} size="sm" showPercentage={false} dynamicColor={false} variant="mint" />
            <p className="text-[10px] text-slate-400 leading-tight">
              {healthScore.emergencyCoverageMonths} months of essential buffer.
            </p>
          </div>

          {/* Pillar 4: Debt Burden (15%) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300">Debt Burden</span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400">{healthScore.debtBurdenScore}/15</span>
            </div>
            <ProgressBar value={healthScore.debtBurdenScore} max={15} size="sm" showPercentage={false} dynamicColor={false} variant="amber" />
            <p className="text-[10px] text-slate-400 leading-tight">
              Debt-to-Income is {healthScore.debtToIncomePercent}%.
            </p>
          </div>

          {/* Pillar 5: Goal Progress (15%) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300">Goal Progress</span>
              <span className="font-extrabold text-indigo-500">{healthScore.goalProgressScore}/15</span>
            </div>
            <ProgressBar value={healthScore.goalProgressScore} max={15} size="sm" showPercentage={false} dynamicColor={false} variant="indigo" />
            <p className="text-[10px] text-slate-400 leading-tight">
              Active goal pacing & sinking fund consistency.
            </p>
          </div>
        </div>
      </Card>

      {/* CHARTS: ALLOCATED VS SPENT & VELOCITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Allocated vs Spent Bar Chart (7 cols) */}
        <Card className="p-6 lg:col-span-7">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
            <div>
              <h3 className="font-extrabold text-base text-fintwin-ink dark:text-white">
                Category Budget vs Actual Spent
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing budget headroom and overspend variances
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryComparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={val => `₹${val/1000}k`} />
                <Tooltip 
                  formatter={(val: number, name: string) => [`₹${val.toLocaleString('en-IN')}`, name]}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Allocated" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Spent" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Spending Velocity Timeline (5 cols) */}
        <Card className="p-6 lg:col-span-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
            <div>
              <h3 className="font-extrabold text-base text-fintwin-ink dark:text-white">
                Spending Velocity (Burndown)
              </h3>
              <p className="text-xs text-slate-400">
                Early-month spikes (rent/EMIs) vs steady pace
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={val => `₹${val/1000}k`} />
                <Tooltip 
                  formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`]}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="velocity" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} name="Actual Spend" />
                <Line type="monotone" dataKey="expected" stroke="#10B981" strokeDasharray="4 4" strokeWidth={2} name="Target Run-rate" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
