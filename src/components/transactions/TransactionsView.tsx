import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge, Modal } from '../common/Card';
import { Transaction, Category } from '../../types';
import { 
  ReceiptText, 
  Search, 
  Filter, 
  Plus, 
  Scan, 
  Trash2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Tag, 
  Calendar 
} from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction, budgets, setIsScannerOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Manual Transaction Form
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState<number>(500);
  const [category, setCategory] = useState<Category>('Groceries');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit Card' | 'Debit Card' | 'UPI'>('UPI');
  const [description, setDescription] = useState('');

  const categories: Category[] = [
    'Housing & Rent',
    'Groceries',
    'Dining & Food',
    'Utilities & Bills',
    'Transportation',
    'Entertainment',
    'Shopping & Gadgets',
    'Healthcare',
    'Debt & EMIs'
  ];

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesType = selectedType === 'all' || t.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || amount <= 0) return;

    addTransaction({
      merchant,
      amount: Number(amount),
      category,
      type,
      date,
      paymentMethod,
      description: description || 'Manual Transaction Entry',
      isScanned: false
    });

    setMerchant('');
    setAmount(500);
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-slide-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-fintwin-ink dark:text-white tracking-tight">
              Transaction Ledger & Bill History
            </h1>
            <Badge variant="indigo" size="sm">
              {transactions.length} Records
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, and inspect verified transactions logged manually or via smart OCR bill scanning.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={<Scan className="w-4 h-4 text-fintwin-indigo" />}
            onClick={() => setIsScannerOpen(true)}
          >
            Scan Bill (OCR)
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search merchant, notes, items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-semibold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
        </div>
      </Card>

      {/* TRANSACTIONS TABLE / LIST */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Merchant & Payee</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-fintwin-indigo font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                          {tx.merchant.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-fintwin-ink dark:text-white">
                              {tx.merchant}
                            </span>
                            {tx.isScanned && (
                              <Badge size="sm" variant="indigo" className="text-[9px] py-0 px-1.5">
                                OCR Scanned
                              </Badge>
                            )}
                          </div>
                          {tx.description && (
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">{tx.description}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">
                      {tx.category}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {tx.paymentMethod}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {tx.date}
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-sm">
                      <span className={tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}>
                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-slate-300 hover:text-fintwin-coral p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MANUAL TRANSACTION ENTRY MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Manual Transaction"
        maxWidth="md"
      >
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Merchant / Recipient Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Starbucks Coffee, BigBasket, Shell Petrol"
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-extrabold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              >
                <option value="expense">Expense (-)</option>
                <option value="income">Income (+)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-medium focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
            >
              <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Description / Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Office lunch with engineering team"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-medium focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Log Transaction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
