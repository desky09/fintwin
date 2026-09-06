import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge, ProgressBar, Modal } from '../common/Card';
import { FinancialDependency, Category } from '../../types';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  Tv, 
  Smartphone, 
  Home, 
  Car, 
  HeartPulse 
} from 'lucide-react';

export const DependenciesView: React.FC = () => {
  const { dependencies, addDependency, deleteDependency, userProfile, healthScore } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<'loan' | 'emi' | 'subscription' | 'credit_card' | 'insurance'>('subscription');
  const [monthlyAmount, setMonthlyAmount] = useState<number>(500);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [remainingTenure, setRemainingTenure] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [dueDateDay, setDueDateDay] = useState<number>(10);
  const [category, setCategory] = useState<Category>('Entertainment');

  const totalMonthlyOutflow = dependencies
    .filter(d => d.status === 'active')
    .reduce((sum, d) => sum + d.monthlyAmount, 0);

  const filteredDeps = dependencies.filter(d => {
    if (filterType === 'all') return true;
    return d.type === filterType;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addDependency({
      name,
      type,
      monthlyAmount: Number(monthlyAmount),
      totalAmount: totalAmount ? Number(totalAmount) : undefined,
      paidAmount: 0,
      remainingTenureMonths: type === 'emi' || type === 'loan' ? Number(remainingTenure) : undefined,
      interestRate: interestRate ? Number(interestRate) : undefined,
      dueDateDay: Number(dueDateDay),
      autoRenew: type === 'subscription' || type === 'insurance',
      category,
      status: 'active'
    });

    // Reset
    setName('');
    setMonthlyAmount(500);
    setIsAddModalOpen(false);
  };

  const getDepIcon = (dep: FinancialDependency) => {
    if (dep.type === 'subscription') return <Tv className="w-4 h-4 text-pink-500" />;
    if (dep.type === 'emi' || dep.type === 'loan') return <CreditCard className="w-4 h-4 text-fintwin-indigo" />;
    if (dep.type === 'insurance') return <HeartPulse className="w-4 h-4 text-rose-500" />;
    return <CreditCard className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div className="space-y-6 animate-fade-slide-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-fintwin-ink dark:text-white tracking-tight">
              Financial Dependencies & Recurring Obligations
            </h1>
            <Badge variant="indigo" size="sm">
              {dependencies.length} Tracked
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your loans, EMIs, recurring SaaS subscriptions, insurance policies, and credit card commitments.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Dependency
        </Button>
      </div>

      {/* SUMMARY BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-800/60">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Monthly Commitments</span>
          <div className="text-2xl font-black text-fintwin-indigo dark:text-indigo-400 mt-1">
            ₹{totalMonthlyOutflow.toLocaleString('en-IN')}/mo
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {((totalMonthlyOutflow / userProfile.monthlyIncome) * 100).toFixed(1)}% of your monthly paycheck
          </p>
        </Card>

        <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/60">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Debt-to-Income (DTI) Ratio</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {healthScore.debtToIncomePercent}%
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {healthScore.debtToIncomePercent <= 25 ? 'Healthy & Low Risk' : 'Moderate Burden'}
          </p>
        </Card>

        <Card className="p-4 bg-amber-50/50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/60">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Subscriptions</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {dependencies.filter(d => d.type === 'subscription').length} Services
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Auto-renewing recurring charges
          </p>
        </Card>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2 pb-2">
        {['all', 'subscription', 'emi', 'loan', 'insurance'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              filterType === t 
                ? 'bg-fintwin-indigo text-white shadow-sm' 
                : 'bg-white dark:bg-fintwin-darkSurface text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {t === 'all' ? 'All Obligations' : `${t}s`}
          </button>
        ))}
      </div>

      {/* DEPENDENCIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDeps.map(dep => {
          const isEMIorLoan = dep.type === 'emi' || dep.type === 'loan';
          const payoffPercent = isEMIorLoan && dep.totalAmount && dep.paidAmount 
            ? Math.round((dep.paidAmount / dep.totalAmount) * 100)
            : 0;

          return (
            <Card key={dep.id} className="p-5 flex flex-col justify-between group hover:-translate-y-1">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      {getDepIcon(dep)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-fintwin-ink dark:text-white group-hover:text-fintwin-indigo transition-colors">
                        {dep.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {dep.type} • {dep.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteDependency(dep.id)}
                    className="text-slate-300 hover:text-fintwin-coral p-1 transition-colors"
                    title="Delete Dependency"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Monthly Obligation:</span>
                    <span className="font-extrabold text-fintwin-ink dark:text-white">
                      ₹{dep.monthlyAmount.toLocaleString('en-IN')}/mo
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Due Date:</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {dep.dueDateDay}th of every month
                    </span>
                  </div>

                  {isEMIorLoan && dep.remainingTenureMonths !== undefined && (
                    <div className="pt-2 space-y-1.5">
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>Payoff Progress ({payoffPercent}%)</span>
                        <span>{dep.remainingTenureMonths} mo left</span>
                      </div>
                      <ProgressBar value={payoffPercent} size="sm" showPercentage={false} />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <Badge variant={dep.autoRenew ? 'mint' : 'slate'} size="sm">
                  {dep.autoRenew ? 'Auto-Debit Active' : 'Manual Transfer'}
                </Badge>
                <span className="text-slate-400 font-mono">
                  {dep.interestRate ? `${dep.interestRate}% p.a.` : 'Fixed'}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ADD DEPENDENCY MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Financial Dependency / EMI"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Obligation Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Car Loan EMI, Spotify Premium, Health Insurance"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              >
                <option value="subscription">Subscription (Netflix/Gym)</option>
                <option value="emi">Product EMI</option>
                <option value="loan">Bank Loan (Home/Car)</option>
                <option value="insurance">Insurance Policy</option>
                <option value="credit_card">Credit Card Bill</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Monthly Amount (₹)
              </label>
              <input
                type="number"
                required
                value={monthlyAmount}
                onChange={e => setMonthlyAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-extrabold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              />
            </div>
          </div>

          {(type === 'emi' || type === 'loan') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Remaining Tenure (Months)
                </label>
                <input
                  type="number"
                  value={remainingTenure}
                  onChange={e => setRemainingTenure(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={interestRate}
                  onChange={e => setInterestRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Due Date Day (1-31)
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={dueDateDay}
                onChange={e => setDueDateDay(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              >
                <option value="Debt & EMIs">Debt & EMIs</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Housing & Rent">Housing & Rent</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Transportation">Transportation</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Obligation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
