import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge } from '../common/Card';
import { askFinancialAdvisor, AIMessage } from '../../services/aiAdvisorService';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Zap, 
  HelpCircle, 
  Key, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const AIAdvisorView: React.FC = () => {
  const { 
    userProfile, 
    budgets, 
    dependencies, 
    goals, 
    healthScore, 
    setActiveTab, 
    runSimulation,
    geminiApiKey,
    setGeminiApiKey
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(geminiApiKey);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${userProfile.name.split(' ')[0]}! I am FinTwin, your AI Financial Digital Twin Advisor. I have analyzed your income (₹${userProfile.monthlyIncome.toLocaleString('en-IN')}), liquid reserves (₹${userProfile.currentSavings.toLocaleString('en-IN')}), and current Financial Health Score (${healthScore.totalScore}/100 - ${healthScore.tier}). How can I assist your financial decisions today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      highlightPills: [
        { label: 'Twin Health', value: `${healthScore.totalScore}/100`, variant: healthScore.totalScore >= 60 ? 'mint' : 'amber' },
        { label: 'Emergency Fund', value: `${healthScore.emergencyCoverageMonths} Months`, variant: healthScore.emergencyCoverageMonths >= 3 ? 'mint' : 'coral' }
      ],
      structuredPoints: [
        'Ask about major purchases to test liquidity and emergency reserve impacts.',
        'Inquire about category overspending and budget leaks.',
        'Explore 1-year and 5-year savings trajectories and goal milestone dates.'
      ]
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const presetQuestions = [
    'Can I afford a ₹70,000 phone?',
    'Where am I overspending?',
    'How much can I save in one year?',
    'When can I reach my bike goal?',
    'What happens if I save ₹2,000 more every month?',
    'Why did my financial health score decrease?'
  ];

  const handleSendMessage = async (queryText: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const aiResponse = await askFinancialAdvisor(
        textToSend,
        userProfile,
        budgets,
        dependencies,
        goals,
        healthScore,
        geminiApiKey
      );
      setMessages(prev => [...prev, aiResponse]);
    } catch (e) {
      console.error('Error getting AI advice', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: AIMessage['suggestedAction']) => {
    if (!action) return;
    if (action.actionType === 'open_simulator') {
      if (action.payload) {
        runSimulation({
          purchaseItem: action.payload.item || 'Flagship Smartphone',
          amount: action.payload.amount || 70000,
          paymentMethod: 'cash',
          emiDurationMonths: 6,
          interestRatePercent: 12,
          downPayment: 0,
          monthlyAdditionalSavings: 10000
        });
      }
      setActiveTab('simulator');
    } else if (action.actionType === 'open_budgets') {
      setActiveTab('budgets');
    } else if (action.actionType === 'open_goals') {
      setActiveTab('goals');
    }
  };

  return (
    <div className="space-y-6 animate-fade-slide-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-fintwin-ink dark:text-white tracking-tight">
              FinTwin AI Financial Advisor
            </h1>
            <Badge variant="indigo" size="sm" icon={<Sparkles className="w-3 h-3" />}>
              Context-Aware Reasoning
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ask natural-language questions about affordability, overspending leaks, goal timelines, and score improvements.
          </p>
        </div>

        <button
          onClick={() => setShowKeyModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors self-start sm:self-auto"
        >
          <Key className="w-3.5 h-3.5 text-fintwin-indigo" />
          <span>{geminiApiKey ? 'Custom Gemini Key (Active)' : 'Use Live Gemini API Key (Optional)'}</span>
        </button>
      </div>

      {/* CHAT CONTAINER */}
      <Card className="flex flex-col h-[600px] p-0 overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-fintwin-indigo text-white shadow-md shadow-fintwin-indigo/25'
                    : 'bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-fintwin-ink dark:text-slate-100 shadow-sm'
                }`}
              >
                {/* Assistant Header */}
                {msg.sender === 'assistant' && (
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-fintwin-indigo flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-fintwin-indigo dark:text-indigo-400">
                      FinTwin Intelligence
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">{msg.timestamp}</span>
                  </div>
                )}

                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Highlight Pills */}
                {msg.highlightPills && msg.highlightPills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800">
                    {msg.highlightPills.map((pill, i) => (
                      <div key={i} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                        <span className="text-slate-400 mr-1.5">{pill.label}:</span>
                        <strong className={pill.variant === 'mint' ? 'text-fintwin-mint' : pill.variant === 'coral' ? 'text-fintwin-coral' : 'text-fintwin-indigo dark:text-indigo-400'}>
                          {pill.value}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}

                {/* Structured Points */}
                {msg.structuredPoints && msg.structuredPoints.length > 0 && (
                  <div className="mt-3 space-y-1.5 bg-white/60 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/60 text-xs">
                    {msg.structuredPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Action Button */}
                {msg.suggestedAction && (
                  <div className="mt-3.5 pt-2">
                    <button
                      onClick={() => handleActionClick(msg.suggestedAction)}
                      className="px-3 py-1.5 rounded-xl bg-fintwin-indigo text-white font-bold text-xs flex items-center gap-1.5 hover:bg-fintwin-indigoDark transition-colors shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {msg.suggestedAction.label} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl max-w-xs animate-pulse">
              <Bot className="w-4 h-4 text-fintwin-indigo animate-spin" />
              <span>FinTwin is calculating deterministic math & reasoning...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Questions Chips */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> Prompts:
          </span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-fintwin-indigo/50 hover:text-fintwin-indigo transition-colors flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Query Input Bar */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-fintwin-darkSurface">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask FinTwin anything (e.g. 'Can I buy a ₹70,000 phone?', 'Where am I overspending?')..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
            />
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              icon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </form>
        </div>
      </Card>

      {/* GEMINI KEY CONFIG MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-slide-up">
          <div className="bg-white dark:bg-fintwin-darkSurface rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-fintwin-indigo" />
              <h3 className="font-extrabold text-base text-fintwin-ink dark:text-white">
                Configure Gemini API Key
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              FinTwin works 100% out of the box with its built-in deterministic financial engine. If you want live LLM responses from Google Gemini 1.5 Flash, enter your API key below.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempApiKey}
                onChange={e => setTempApiKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-mono focus:ring-2 focus:ring-fintwin-indigo focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeyModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setGeminiApiKey(tempApiKey);
                  setShowKeyModal(false);
                }}
              >
                Save Key
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
