import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge, ProgressBar, Modal } from '../common/Card';
import { Target, Plus, Sparkles, TrendingUp, Calendar, CheckCircle2, ShieldCheck, Bike, GraduationCap, Hammer } from 'lucide-react';
import { FinancialGoal } from '../../types';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, updateGoalAmount, healthScore, userProfile } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [boostSimAmount, setBoostSimAmount] = useState(2000);

  // Form State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState<number>(50000);
  const [currentAmount, setCurrentAmount] = useState<number>(10000);
  const [monthlyTarget, setMonthlyTarget] = useState<number>(5000);
  const [deadline, setDeadline] = useState('2027-06-30');
  const [category, setCategory] = useState('General Savings');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addGoal({
      name,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      deadline,
      monthlyTarget: Number(monthlyTarget),
      category,
      priority,
      icon: 'Target'
    });

    setName('');
    setIsAddModalOpen(false);
  };

  const totalTargetAll = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSavedAll = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <div className="space-y-6 animate-fade-slide-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-fintwin-ink dark:text-white tracking-tight">
              Goal Planner & Sinking Funds
            </h1>
            <Badge variant="indigo" size="sm">
              {goals.length} Active Goals
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Map out life milestones, vehicle purchases, emergency funds, and simulate savings pace boosts.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Create New Goal
        </Button>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-800/60">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Goal Targets</span>
          <div className="text-2xl font-black text-fintwin-indigo dark:text-indigo-400 mt-1">
            ₹{totalTargetAll.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Across {goals.length} life milestones
          </p>
        </Card>

        <Card className="p-4 bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/60">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Accumulated Funds</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{totalSavedAll.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {Math.round((totalSavedAll / Math.max(totalTargetAll, 1)) * 100)}% overall completion
          </p>
        </Card>

        <Card className="p-4 bg-amber-50/40 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/60">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Monthly Allocation Required</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            ₹{goals.reduce((s, g) => s + g.monthlyTarget, 0).toLocaleString('en-IN')}/mo
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Systematic monthly transfer
          </p>
        </Card>
      </div>

      {/* GOAL ACCELERATOR SIMULATOR BANNER */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-emerald-50/80 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-emerald-950/40 border border-indigo-200/80 dark:border-indigo-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-fintwin-indigo text-white shadow-md shadow-fintwin-indigo/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-fintwin-ink dark:text-white">
                Goal Accelerator Simulator: What happens if I save ₹{boostSimAmount.toLocaleString('en-IN')} more each month?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Adding just ₹{boostSimAmount.toLocaleString('en-IN')}/mo shaves an average of <strong>3.5 months</strong> off your goal completion dates and adds <strong>+6 points</strong> to your Financial Health Score!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[1000, 2000, 5000].map(amt => (
              <button
                key={amt}
                onClick={() => setBoostSimAmount(amt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  boostSimAmount === amt
                    ? 'bg-fintwin-indigo text-white border-fintwin-indigo shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                +₹{amt.toLocaleString('en-IN')}/mo
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* GOALS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const progressPercent = Math.min(Math.round((goal.currentAmount / Math.max(goal.targetAmount, 1)) * 100), 100);
          const remainingAmount = Math.max(goal.targetAmount - goal.currentAmount, 0);
          const monthsAtCurrentPace = Math.ceil(remainingAmount / Math.max(goal.monthlyTarget, 1));
          const monthsAtBoostedPace = Math.ceil(remainingAmount / Math.max(goal.monthlyTarget + boostSimAmount, 1));
          const monthsSaved = Math.max(monthsAtCurrentPace - monthsAtBoostedPace, 0);

          return (
            <Card key={goal.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-fintwin-indigo">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-fintwin-ink dark:text-white">
                        {goal.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {goal.category} • Target by {new Date(goal.deadline).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <Badge variant={goal.priority === 'high' ? 'coral' : 'indigo'} size="sm">
                    {goal.priority.toUpperCase()} PRIORITY
                  </Badge>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-300">
                      Saved: ₹{goal.currentAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-fintwin-indigo dark:text-indigo-400">
                      Target: ₹{goal.targetAmount.toLocaleString('en-IN')} ({progressPercent}%)
                    </span>
                  </div>
                  <ProgressBar value={progressPercent} size="md" showPercentage={false} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Monthly Sinking Fund:</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-100">
                      ₹{goal.monthlyTarget.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Estimated ETA:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      In {monthsAtCurrentPace} Months
                    </span>
                  </div>
                </div>

                {/* Boost insight */}
                <div className="mt-3 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    Saving +₹{boostSimAmount.toLocaleString('en-IN')}/mo finishes this goal <strong>{monthsSaved} months sooner!</strong>
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  ₹{remainingAmount.toLocaleString('en-IN')} to go
                </span>
                <button
                  onClick={() => updateGoalAmount(goal.id, goal.currentAmount + 5000)}
                  className="px-3 py-1 text-xs font-bold text-fintwin-indigo hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors"
                >
                  + Add ₹5,000 Deposit
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CREATE GOAL MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Financial Milestone Goal"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Goal Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. New Dream Bike, Emergency Fund 2.0, Bali Trip"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Target Amount (₹)
              </label>
              <input
                type="number"
                required
                value={targetAmount}
                onChange={e => setTargetAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-extrabold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Currently Saved (₹)
              </label>
              <input
                type="number"
                value={currentAmount}
                onChange={e => setCurrentAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-extrabold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Monthly Contribution (₹)
              </label>
              <input
                type="number"
                required
                value={monthlyTarget}
                onChange={e => setMonthlyTarget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-extrabold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-medium focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Goal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
