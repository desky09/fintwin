import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge, ProgressBar } from '../common/Card';
import { SlidersHorizontal, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Category } from '../../types';

export const BudgetsView: React.FC = () => {
  const { budgets, updateBudget, userProfile, healthScore } = useApp();

  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const budgetSurplus = userProfile.monthlyIncome - totalAllocated;

  return (
    <div className="space-y-6 animate-fade-slide-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-fintwin-ink dark:text-white tracking-tight">
              Monthly Category Budget Allocations
            </h1>
            <Badge variant={totalSpent <= totalAllocated ? 'mint' : 'coral'} size="sm">
              {totalSpent <= totalAllocated ? 'Budget Disciplined' : 'Over Limit'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Adjust your monthly category caps in real-time. FinTwin watches every bill upload against these limits.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Total Monthly Allocated:</span>
          <div className="text-xl font-black text-fintwin-indigo dark:text-indigo-400">
            ₹{totalAllocated.toLocaleString('en-IN')} / ₹{userProfile.monthlyIncome.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* OVERVIEW SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white dark:bg-fintwin-darkSurface">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Monthly Spent</span>
          <div className="text-2xl font-black text-fintwin-ink dark:text-white mt-1">
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {Math.round((totalSpent / Math.max(totalAllocated, 1)) * 100)}% of total allocation
          </p>
        </Card>

        <Card className="p-4 bg-white dark:bg-fintwin-darkSurface">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unallocated Income Buffer</span>
          <div className={`text-2xl font-black mt-1 ${budgetSurplus >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-fintwin-coral'}`}>
            ₹{budgetSurplus.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {budgetSurplus >= 0 ? 'Surplus routed to savings/investments' : 'Allocations exceed net paycheck!'}
          </p>
        </Card>

        <Card className="p-4 bg-white dark:bg-fintwin-darkSurface">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Expense Control Score</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {healthScore.expenseControlScore}/20 Pts
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Weighted contribution to 0-100 Twin Health
          </p>
        </Card>
      </div>

      {/* CATEGORY SLIDERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {budgets.map(budget => {
          const ratio = budget.spentAmount / Math.max(budget.allocatedAmount, 1);
          const isBreached = ratio >= 1.0;
          const isWarning = ratio >= 0.8 && !isBreached;
          const remaining = budget.allocatedAmount - budget.spentAmount;

          return (
            <Card key={budget.category} className="p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: budget.color }} />
                    <h4 className="font-bold text-sm text-fintwin-ink dark:text-white">
                      {budget.category}
                    </h4>
                  </div>
                  <Badge 
                    variant={isBreached ? 'coral' : isWarning ? 'amber' : 'mint'}
                    size="sm"
                  >
                    {isBreached ? 'Over Budget' : isWarning ? 'Near Limit' : 'On Track'}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">
                      Spent: <strong className="text-fintwin-ink dark:text-white">₹{budget.spentAmount.toLocaleString('en-IN')}</strong>
                    </span>
                    <span className={remaining < 0 ? 'text-fintwin-coral font-bold' : 'text-slate-500 font-medium'}>
                      {remaining < 0 ? `Over by ₹${Math.abs(remaining).toLocaleString('en-IN')}` : `₹${remaining.toLocaleString('en-IN')} left`}
                    </span>
                  </div>
                  <ProgressBar value={budget.spentAmount} max={budget.allocatedAmount} size="md" showPercentage={false} />
                </div>

                {/* Interactive Allocation Slider */}
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    <span>Monthly Allocation Limit:</span>
                    <span className="font-extrabold text-fintwin-indigo dark:text-indigo-400">
                      ₹{budget.allocatedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="500"
                    value={budget.allocatedAmount}
                    onChange={e => updateBudget(budget.category as Category, Number(e.target.value))}
                    className="w-full accent-fintwin-indigo cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>₹1,000</span>
                    <span>₹25,000</span>
                    <span>₹50,000</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
