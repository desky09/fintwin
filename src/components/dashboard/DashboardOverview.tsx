import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge } from '../common/Card';
import { 
  CreditCard, 
  Send, 
  PlusCircle, 
  ArrowDownLeft, 
  ReceiptText, 
  CalendarClock, 
  TrendingUp, 
  Sparkles, 
  Scan, 
  Bot, 
  ArrowRight, 
  ChevronDown,
  Layers,
  Activity,
  Wallet,
  PiggyBank,
  LineChart
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart as ReLineChart, 
  Line, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const DashboardOverview: React.FC = () => {
  const { 
    userProfile, 
    budgets, 
    transactions, 
    dependencies, 
    healthScore, 
    setIsScannerOpen, 
    setActiveTab 
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('Current Cycle');

  const totalSpentThisMonth = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const totalAllocatedBudget = budgets.reduce((acc, b) => acc + b.allocatedAmount, 0);
  const budgetRatio = totalSpentThisMonth / Math.max(userProfile.overallMonthlyBudgetCap, 1);

  const upcomingDuesCount = dependencies.filter(d => d.status === 'active').length;
  const upcomingDuesTotal = dependencies
    .filter(d => d.status === 'active')
    .reduce((sum, d) => sum + d.monthlyAmount, 0);

  // Multi-curve line chart data matching screenshot curve aesthetic
  const multiCurveTrend = [
    { year: '2018', line1: 20000, line2: 12000, line3: 8000 },
    { year: '2019', line1: 28000, line2: 16000, line3: 11000 },
    { year: '2020', line1: 35000, line2: 24000, line3: 15000 },
    { year: '2021', line1: 30000, line2: 28000, line3: 19000 },
    { year: '2022', line1: 45000, line2: 40000, line3: 27000 },
    { year: '2023', line1: 52000, line2: 48000, line3: 35000 },
    { year: '2024', line1: 68000, line2: 55000, line3: 44000 },
    { year: '2025', line1: 82000, line2: 60000, line3: 50000 },
    { year: '2026', line1: 105000, line2: 72000, line3: 58000 }
  ];

  // Donut chart colors matching neon yellow / cyan / purple palette
  const donutColors = ['#EEFC57', '#06B6D4', '#A855F7', '#FF3B8A', '#22C55E', '#F59E0B'];
  const spendBreakdown = budgets.map((b, i) => ({
    name: b.category,
    amount: b.spentAmount,
    color: donutColors[i % donutColors.length]
  })).filter(d => d.amount > 0);

  const recentList = transactions.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-slide-up pb-16">
      {/* TOP ROW: TOTAL NET WORTH & MULTI-LINE CHART + QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Total Net Worth Card with Multi-Line Curves (8 cols) */}
        <Card className="p-6 lg:col-span-8 flex flex-col justify-between relative overflow-hidden bg-[#131926] border-[#1F2737]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Total net worth
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                ACCT · A-002145
              </span>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-1">
                <span className="text-lg text-slate-400 font-bold">₹</span>
                <span>{userProfile.currentSavings.toLocaleString('en-IN')}.00</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                +7% this month
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Across 4 accounts, 2 institutions • {healthScore.emergencyCoverageMonths} months emergency buffer
            </p>
          </div>

          {/* Multi-Line Curves Canvas */}
          <div className="h-44 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={multiCurveTrend} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <Tooltip 
                  formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`]}
                  contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#202B3C', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
                {/* Cyan Curve */}
                <Line type="monotone" dataKey="line3" stroke="#06B6D4" strokeWidth={2.5} dot={false} />
                {/* Pink Curve */}
                <Line type="monotone" dataKey="line2" stroke="#FF3B8A" strokeWidth={2.5} dot={false} />
                {/* Neon Yellow Main Curve with glowing dot at peak */}
                <Line 
                  type="monotone" 
                  dataKey="line1" 
                  stroke="#EEFC57" 
                  strokeWidth={3.5} 
                  dot={{ r: 4, fill: '#EEFC57', stroke: '#0B0F17', strokeWidth: 2 }} 
                />
              </ReLineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1F2737] text-xs">
            <button
              onClick={() => setActiveTab('analytics')}
              className="px-3 py-1.5 rounded-lg bg-[#192233] hover:bg-[#202B3F] text-slate-200 hover:text-white font-bold text-[11px] border border-[#243046] transition-colors"
            >
              View Report
            </button>
            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
              <span>2018</span>
              <span>2020</span>
              <span>2022</span>
              <span>2024</span>
              <span className="text-[#EEFC57] font-bold">2026</span>
            </div>
          </div>
        </Card>

        {/* Right: Quick Actions Card (4 cols) */}
        <Card className="p-6 lg:col-span-4 flex flex-col justify-between bg-[#131926] border-[#1F2737]">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 mb-4">
              Quick actions
            </h3>

            {/* 3 Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="p-3.5 rounded-2xl bg-[#171F30] hover:bg-[#1E283E] hover:border-[#EEFC57]/40 border border-[#202B3D] text-slate-200 hover:text-white flex flex-col items-center justify-center gap-2 transition-all group"
              >
                <div className="p-2 rounded-xl bg-[#202B3E] group-hover:bg-[#EEFC57] group-hover:text-[#0B0F17] text-slate-300 transition-colors">
                  <Scan className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold">Send / Scan</span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className="p-3.5 rounded-2xl bg-[#171F30] hover:bg-[#1E283E] hover:border-[#EEFC57]/40 border border-[#202B3D] text-slate-200 hover:text-white flex flex-col items-center justify-center gap-2 transition-all group"
              >
                <div className="p-2 rounded-xl bg-[#202B3E] group-hover:bg-[#EEFC57] group-hover:text-[#0B0F17] text-slate-300 transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold">Simulate</span>
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className="p-3.5 rounded-2xl bg-[#171F30] hover:bg-[#1E283E] hover:border-[#EEFC57]/40 border border-[#202B3D] text-slate-200 hover:text-white flex flex-col items-center justify-center gap-2 transition-all group"
              >
                <div className="p-2 rounded-xl bg-[#202B3E] group-hover:bg-[#EEFC57] group-hover:text-[#0B0F17] text-slate-300 transition-colors">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold">AI Advice</span>
              </button>
            </div>
          </div>

          {/* Pay Bills / Upcoming Dues Bottom Strip */}
          <div 
            onClick={() => setActiveTab('dependencies')}
            className="mt-4 p-3.5 rounded-2xl bg-[#171F30] hover:bg-[#1E283E] border border-[#202B3D] cursor-pointer flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <CalendarClock className="w-4 h-4 text-[#EEFC57]" />
              <span className="text-xs font-bold text-slate-200">
                Pay bills · {upcomingDuesCount} due this week
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#EEFC57]">
              ₹{upcomingDuesTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </Card>
      </div>

      {/* MIDDLE ROW: 3 ACCOUNT CARDS (Checking, Savings, Investing) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Checking */}
        <Card className="p-5 bg-[#131926] border-[#1F2737] hover:border-[#EEFC57]/30 transition-all cursor-pointer" onClick={() => setActiveTab('transactions')}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-[#EEFC57] rounded-sm" />
              Checking & Daily Spend
            </span>
            <CreditCard className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-white mt-3">
            ₹{totalSpentThisMonth.toLocaleString('en-IN')}.00
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            **** 2254 1 · available now
          </p>
        </Card>

        {/* Card 2: Savings */}
        <Card className="p-5 bg-[#131926] border-[#1F2737] hover:border-[#EEFC57]/30 transition-all cursor-pointer" onClick={() => setActiveTab('goals')}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-emerald-400 rounded-sm" />
              Savings Reserve
            </span>
            <PiggyBank className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-white mt-3">
            ₹{userProfile.currentSavings.toLocaleString('en-IN')}.00
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            3.8% APY · {healthScore.emergencyCoverageMonths} Mo Emergency Cushion
          </p>
        </Card>

        {/* Card 3: Investing */}
        <Card className="p-5 bg-[#131926] border-[#1F2737] hover:border-[#EEFC57]/30 transition-all cursor-pointer" onClick={() => setActiveTab('forecast')}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-cyan-400 rounded-sm" />
              Investing & Twin Goals
            </span>
            <LineChart className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-white mt-3">
            ₹{budgets.reduce((s, b) => s + b.allocatedAmount, 0).toLocaleString('en-IN')}.00
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-mono font-semibold">
            +5.1% · {healthScore.savingsRatePercent}% net savings rate
          </p>
        </Card>
      </div>

      {/* BOTTOM ROW: SPENDING BREAKDOWN DONUT + RECENT TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bottom Left: Spending Breakdown Donut Card (6 cols) */}
        <Card className="p-6 lg:col-span-6 bg-[#131926] border-[#1F2737] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2737]">
              <h3 className="text-xs font-semibold text-slate-400">
                Spending breakdown
              </h3>
              <button className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white">
                <span>{selectedMonth}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 mt-6">
              {/* Donut Chart with center percentage matching image */}
              <div className="sm:col-span-6 h-48 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendBreakdown}
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="amount"
                    >
                      {spendBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`]}
                      contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#202B3C', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-white">
                    {Math.round(budgetRatio * 100)}%
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    ↑ Used
                  </span>
                </div>
              </div>

              {/* Category Legend matching exact dot styling */}
              <div className="sm:col-span-6 space-y-3">
                {spendBreakdown.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 truncate max-w-[110px]">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-white font-mono">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#1F2737] flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Monthly budget limit: ₹{userProfile.overallMonthlyBudgetCap.toLocaleString('en-IN')}</span>
            <button onClick={() => setActiveTab('budgets')} className="text-[#EEFC57] font-bold hover:underline flex items-center gap-1">
              Adjust Caps <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* Bottom Right: Recent Transactions List (6 cols) */}
        <Card className="p-6 lg:col-span-6 bg-[#131926] border-[#1F2737] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2737] mb-3">
              <h3 className="text-xs font-semibold text-slate-400">
                Recent transactions
              </h3>
              <button 
                onClick={() => setActiveTab('transactions')}
                className="text-xs font-bold text-[#EEFC57] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {recentList.map(tx => (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#182030] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Circle Initial Avatar */}
                    <div className="w-8 h-8 rounded-full bg-[#202B3E] text-slate-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {tx.merchant.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate max-w-[150px]">
                          {tx.merchant}
                        </span>
                        {tx.isScanned && (
                          <span className="text-[9px] bg-[#EEFC57]/20 text-[#EEFC57] px-1 py-0.2 rounded font-bold">
                            OCR
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {tx.category} · {tx.date}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold font-mono ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1F2737] flex items-center justify-between text-xs">
            <span className="text-slate-500">Live ledger updated</span>
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="text-[#EEFC57] font-bold hover:underline flex items-center gap-1"
            >
              Scan New Bill <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
