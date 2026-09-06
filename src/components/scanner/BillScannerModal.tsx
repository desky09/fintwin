import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal, Button, Badge } from '../common/Card';
import { PRESET_RECEIPTS, PresetReceipt } from '../../data/presetReceipts';
import { processReceiptOCR } from '../../services/ocrScannerService';
import { OCRScanResult, Category } from '../../types';
import { 
  Scan, 
  UploadCloud, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Receipt, 
  FileText, 
  ArrowRight, 
  RefreshCw,
  Sparkles,
  Layers,
  ZoomIn
} from 'lucide-react';

export const BillScannerModal: React.FC = () => {
  const { isScannerOpen, setIsScannerOpen, budgets, userProfile, addTransaction, setActiveTab } = useApp();

  // Step 1: 'capture' | Step 2: 'reading' | Step 3: 'review' | Step 4: 'success'
  const [step, setStep] = useState<'capture' | 'reading' | 'review' | 'success'>('capture');
  const [selectedPreset, setSelectedPreset] = useState<PresetReceipt | null>(null);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<OCRScanResult | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Form edit states during review
  const [editMerchant, setEditMerchant] = useState('');
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editCategory, setEditCategory] = useState<Category>('Groceries');
  const [editDate, setEditDate] = useState('');
  const [editPaymentMethod, setEditPaymentMethod] = useState<'Cash' | 'Credit Card' | 'Debit Card' | 'UPI'>('UPI');

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

  // Reset modal state on open
  useEffect(() => {
    if (isScannerOpen) {
      setStep('capture');
      setSelectedPreset(null);
      setCustomFile(null);
      setCustomImagePreview(null);
      setScanResult(null);
    }
  }, [isScannerOpen]);

  const handleSelectPreset = (preset: PresetReceipt) => {
    setSelectedPreset(preset);
    startScanningProcess({ presetId: preset.id });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomFile(file);
      const url = URL.createObjectURL(file);
      setCustomImagePreview(url);
      setSelectedPreset(null);
      startScanningProcess({
        merchant: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        amount: 3450,
        category: 'Groceries'
      });
    }
  };

  const startScanningProcess = (payload: { presetId?: string; merchant?: string; amount?: number; category?: Category }) => {
    setStep('reading');
    
    // Simulate realistic OCR machine vision & neural parsing latency
    setTimeout(() => {
      const result = processReceiptOCR(payload, budgets, userProfile);
      setScanResult(result);
      setEditMerchant(result.merchant);
      setEditAmount(result.amount);
      setEditCategory(result.category);
      setEditDate(result.date);
      setEditPaymentMethod(result.paymentMethod);
      setStep('review');
    }, 1800);
  };

  // Re-compute budget check dynamically if user edits the amount or category
  const dynamicBudgetCheck = React.useMemo(() => {
    if (!scanResult) return null;
    const targetBudget = budgets.find(b => b.category === editCategory);
    const categoryLimit = targetBudget ? targetBudget.allocatedAmount : 5000;
    const spentBefore = targetBudget ? targetBudget.spentAmount : 0;
    const spentAfter = spentBefore + Number(editAmount || 0);
    const remainingAfter = categoryLimit - spentAfter;
    const ratio = spentAfter / Math.max(categoryLimit, 1);

    let status: 'within' | 'approaching' | 'exceeded' = 'within';
    let message = '';
    if (ratio >= 1.0) {
      status = 'exceeded';
      message = `Critical: This bill is ₹${Math.abs(remainingAfter).toLocaleString('en-IN')} above your ${editCategory} budget this month!`;
    } else if (ratio >= 0.8) {
      status = 'approaching';
      message = `Warning: You are close to your ${editCategory} limit. Only ₹${remainingAfter.toLocaleString('en-IN')} remaining.`;
    } else {
      status = 'within';
      message = `Logged. You have ₹${remainingAfter.toLocaleString('en-IN')} left in ${editCategory} this month.`;
    }

    return {
      categoryLimit,
      spentBefore,
      spentAfter,
      remainingAfter,
      status,
      message,
      ratio
    };
  }, [scanResult, editCategory, editAmount, budgets]);

  const handleConfirmLogExpense = () => {
    if (!editAmount || editAmount <= 0) return;

    addTransaction({
      merchant: editMerchant || 'Scanned Retail Outlet',
      amount: Number(editAmount),
      category: editCategory,
      type: 'expense',
      date: editDate || new Date().toISOString().split('T')[0],
      paymentMethod: editPaymentMethod,
      description: `OCR Scanned Receipt (${scanResult?.confidence ? Math.round(scanResult.confidence * 100) : 98}% confidence)`,
      isScanned: true,
      confidence: scanResult?.confidence || 0.98
    });

    setStep('success');
  };

  return (
    <Modal
      isOpen={isScannerOpen}
      onClose={() => setIsScannerOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-fintwin-indigo" />
          <span>Smart Bill Scanner & OCR Guardian</span>
        </div>
      }
      maxWidth="4xl"
    >
      {/* STEP 1: CAPTURE */}
      {step === 'capture' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h4 className="text-base font-bold text-fintwin-ink dark:text-white">
              Capture or Select a Bill / Receipt
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              FinTwin reads merchant details, amounts, line items, and warns in real-time before you breach your monthly category budget.
            </p>
          </div>

          {/* Drag & Drop / Camera Viewfinder */}
          <div className="relative group border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-fintwin-indigo dark:hover:border-fintwin-indigo rounded-3xl p-8 text-center bg-slate-50/70 dark:bg-slate-900/40 transition-colors">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-fintwin-indigo flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-fintwin-ink dark:text-white">
                  Drop your receipt photo here, or <span className="text-fintwin-indigo underline">browse files</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, WebP, PDF (receipts, utility bills, POS slips)
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                <Camera className="w-4 h-4 text-fintwin-indigo" /> Direct Camera & Gallery capture enabled
              </div>
            </div>
          </div>

          {/* Preset Sample Receipts for Instant Hackathon Testing */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-fintwin-indigo" />
                Or Try Preset Demo Receipts (Instant Test)
              </span>
              <span className="text-[11px] text-slate-400">Click any card to simulate live scan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_RECEIPTS.map(preset => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-fintwin-darkSurface hover:border-fintwin-indigo dark:hover:border-indigo-500/80 hover:shadow-md cursor-pointer transition-all flex items-start justify-between group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 group-hover:text-fintwin-indigo transition-colors">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-fintwin-ink dark:text-white group-hover:text-fintwin-indigo transition-colors">
                        {preset.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">{preset.subtitle}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-extrabold text-xs text-fintwin-ink dark:text-white">
                          ₹{preset.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">({preset.category})</span>
                      </div>
                    </div>
                  </div>

                  <Badge 
                    size="sm" 
                    variant={preset.badge === 'Safe' ? 'mint' : preset.badge === 'Warning' ? 'amber' : 'coral'}
                  >
                    {preset.badge}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: SCANNING LASER ANIMATION */}
      {step === 'reading' && (
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative w-64 h-80 rounded-2xl bg-slate-900 border-2 border-indigo-500/60 p-4 shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Pulsing Laser Line Animation */}
            <div className="laser-line" />

            {/* Mock Receipt Wireframe Lines inside Scanner */}
            <div className="space-y-3 opacity-60">
              <div className="h-4 bg-indigo-400/40 rounded w-3/4 mx-auto" />
              <div className="h-2 bg-indigo-400/20 rounded w-1/2 mx-auto" />
              <div className="border-b border-dashed border-indigo-500/40 my-3" />
              <div className="h-2.5 bg-indigo-400/30 rounded w-full" />
              <div className="h-2.5 bg-indigo-400/30 rounded w-5/6" />
              <div className="h-2.5 bg-indigo-400/30 rounded w-4/6" />
              <div className="h-2.5 bg-indigo-400/30 rounded w-full" />
            </div>

            <div className="space-y-2 opacity-70">
              <div className="border-b border-dashed border-indigo-500/40 my-2" />
              <div className="h-4 bg-emerald-400/40 rounded w-2/3 mx-auto" />
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-fintwin-ink dark:text-white flex items-center justify-center gap-2">
              <Scan className="w-5 h-5 text-fintwin-indigo animate-spin" />
              Reading & Extracting Bill Items...
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Analyzing OCR text, line items, merchant tax ID, and matching against your monthly budget...
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & LIVE BUDGET IMPACT CHECK */}
      {step === 'review' && scanResult && dynamicBudgetCheck && (
        <div className="space-y-6">
          {/* Real-time Alert Banner based on Budget Impact */}
          <div className={`p-4 rounded-2xl border transition-all ${
            dynamicBudgetCheck.status === 'exceeded'
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 animate-subtle-shake'
              : dynamicBudgetCheck.status === 'approaching'
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              {dynamicBudgetCheck.status === 'exceeded' ? (
                <XCircle className="w-6 h-6 text-fintwin-coral flex-shrink-0 mt-0.5" />
              ) : dynamicBudgetCheck.status === 'approaching' ? (
                <AlertTriangle className="w-6 h-6 text-fintwin-amber flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-fintwin-mint flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-sm">
                    {dynamicBudgetCheck.status === 'exceeded'
                      ? '⚠️ CRITICAL OVER-BUDGET ALERT'
                      : dynamicBudgetCheck.status === 'approaching'
                        ? '⚡ WARNING: APPROACHING CATEGORY LIMIT'
                        : '✅ WITHIN MONTHLY BUDGET'}
                  </h5>
                  <Badge 
                    size="sm" 
                    variant={dynamicBudgetCheck.status === 'exceeded' ? 'coral' : dynamicBudgetCheck.status === 'approaching' ? 'amber' : 'mint'}
                  >
                    {Math.round(dynamicBudgetCheck.ratio * 100)}% Used
                  </Badge>
                </div>
                <p className="text-xs mt-1 leading-relaxed">{dynamicBudgetCheck.message}</p>
              </div>
            </div>
          </div>

          {/* Side-by-Side Split: Editable Form (Left) vs Receipt Preview (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Editable Inputs */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Extracted Bill Details (Editable)
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                  OCR Confidence: {Math.round((scanResult.confidence || 0.98) * 100)}%
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Merchant / Payee Name
                </label>
                <input
                  type="text"
                  value={editMerchant}
                  onChange={e => setEditMerchant(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold text-fintwin-ink dark:text-white focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={e => setEditAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-sm font-extrabold text-fintwin-ink dark:text-white focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-medium text-fintwin-ink dark:text-white focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value as Category)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-semibold text-fintwin-ink dark:text-white focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={editPaymentMethod}
                    onChange={e => setEditPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-fintwin-darkSurface text-xs font-medium text-fintwin-ink dark:text-white focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              {/* Real-time Category Budget Progress Bar Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {editCategory} Budget Impact:
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    ₹{dynamicBudgetCheck.spentAfter.toLocaleString('en-IN')} / ₹{dynamicBudgetCheck.categoryLimit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      dynamicBudgetCheck.status === 'exceeded'
                        ? 'bg-fintwin-coral'
                        : dynamicBudgetCheck.status === 'approaching'
                          ? 'bg-fintwin-amber'
                          : 'bg-fintwin-mint'
                    }`}
                    style={{ width: `${Math.min(dynamicBudgetCheck.ratio * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Before bill: ₹{dynamicBudgetCheck.spentBefore.toLocaleString('en-IN')}</span>
                  <span>After bill: {dynamicBudgetCheck.remainingAfter < 0 ? `Over by ₹${Math.abs(dynamicBudgetCheck.remainingAfter).toLocaleString('en-IN')}` : `₹${dynamicBudgetCheck.remainingAfter.toLocaleString('en-IN')} remaining`}</span>
                </div>
              </div>
            </div>

            {/* Right: Receipt Photo / Raw Document Visualizer */}
            <div className="md:col-span-5 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Receipt Document
                </span>
                <button
                  onClick={() => setIsZoomed(prev => !prev)}
                  className="text-xs text-fintwin-indigo dark:text-indigo-400 flex items-center gap-1 hover:underline"
                >
                  <ZoomIn className="w-3.5 h-3.5" /> {isZoomed ? 'Reset View' : 'Zoom In'}
                </button>
              </div>

              <div className={`p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800 shadow-inner overflow-y-auto max-h-72 transition-all ${isZoomed ? 'scale-105 origin-top' : ''}`}>
                <div className="text-center pb-2 border-b border-slate-800">
                  <div className="font-bold text-slate-100 uppercase tracking-widest">{editMerchant}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Scanned Bill #{Date.now().toString().slice(-6)}</div>
                </div>

                <div className="py-2.5 space-y-1.5 text-[11px]">
                  {scanResult.lineItems && scanResult.lineItems.length > 0 ? (
                    scanResult.lineItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-slate-300 truncate max-w-[150px]">{item.description}</span>
                        <span className="text-slate-100 font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total Purchase</span>
                      <span className="text-slate-100 font-bold">₹{editAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-dashed border-slate-700 flex justify-between items-center font-bold text-sm text-cyan-400">
                  <span>TOTAL PAID</span>
                  <span>₹{editAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep('capture')}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Scan Another Bill
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {dynamicBudgetCheck.status === 'exceeded' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsScannerOpen(false);
                    setActiveTab('simulator');
                  }}
                  icon={<Sparkles className="w-4 h-4 text-fintwin-indigo" />}
                >
                  Simulate in What-If
                </Button>
              )}
              <Button
                variant={dynamicBudgetCheck.status === 'exceeded' ? 'danger' : 'primary'}
                size="md"
                onClick={handleConfirmLogExpense}
                icon={<CheckCircle2 className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Confirm & Log to Digital Twin
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS CONFIRMATION */}
      {step === 'success' && (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/80 text-fintwin-mint flex items-center justify-center mx-auto shadow-lg shadow-fintwin-mint/20 animate-fade-slide-up">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-fintwin-ink dark:text-white">
              Bill Successfully Logged!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              ₹{editAmount.toLocaleString('en-IN')} for {editMerchant} has been added to {editCategory}. Your digital twin and health score have been updated in real-time.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep('capture')}
            >
              Scan Another
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsScannerOpen(false)}
            >
              View Updated Dashboard
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
