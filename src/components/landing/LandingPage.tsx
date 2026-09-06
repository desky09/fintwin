import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AuroraHero } from '@/components/ui/aurora-hero-bg';
import { Card, Button, Badge } from '../common/Card';
import { 
  Sparkles, 
  Scan, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Camera, 
  AlertTriangle, 
  CreditCard,
  ChevronRight,
  PieChart as PieIcon,
  Bot,
  Cpu,
  Lock,
  Compass,
  DollarSign,
  Layers,
  BarChart3,
  HelpCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, switchPersona, setIsScannerOpen } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleGetStarted = () => {
    setActiveTab('auth');
  };

  const handleLearnMore = () => {
    const el = document.getElementById('characteristics');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const characteristics = [
    {
      icon: <Activity className="w-6 h-6 text-[#EEFC57]" />,
      title: 'Deterministic Digital Twin Engine',
      category: 'Mathematical Modeling',
      desc: 'FinTwin builds a live mathematical simulation of your wealth, calculating runway, essential buffers, and liquidity 12 months ahead without banking lock-in.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#EEFC57]" />,
      title: 'What-If Purchase Simulator',
      category: 'Proactive Decisions',
      desc: 'Simulate high-ticket items like a ₹70,000 smartphone or vacation before spending. Instantly compares Cash vs. 6-Month EMI vs. Sinking Fund with automated risk ratings.'
    },
    {
      icon: <Scan className="w-6 h-6 text-[#EEFC57]" />,
      title: 'Smart Neural OCR Bill Guardian',
      category: 'Real-Time Interception',
      desc: 'Snap or drag-and-drop any receipt. FinTwin parses line items, categories, and taxes, warning you in real-time if the purchase breaches your monthly category ceiling.'
    },
    {
      icon: <Bot className="w-6 h-6 text-[#EEFC57]" />,
      title: 'Conversational AI Financial Twin',
      category: 'Grounded Intelligence',
      desc: 'Ask questions like "Can I afford this?" or "How do I optimize my monthly savings?". Backed by deterministic calculations with zero financial hallucinations.'
    },
    {
      icon: <Users className="w-6 h-6 text-[#EEFC57]" />,
      title: 'Family & Freelance Dependency Tree',
      category: 'Multi-Stream Support',
      desc: 'Dynamic cashflow models that adapt to salaried professionals, irregular freelance invoices, elderly parents, and high-EMI family managers.'
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#EEFC57]" />,
      title: 'ESP32 IoT Ambient Health Meter',
      category: 'Physical Hardware Sync',
      desc: 'Includes embedded C++ firmware and an interactive on-screen physical simulator with a 128x64 OLED monitor and glowing RGB safety status LED.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Snap Bill via OCR',
      desc: 'Photograph or drag-and-drop any store receipt or utility bill. Our neural OCR extracts merchant, amount, and category instantly.'
    },
    {
      step: '02',
      title: 'Read & Predict Consequences',
      desc: 'FinTwin calculates the exact impact on your category budget and emergency buffer months before money is permanently spent.'
    },
    {
      step: '03',
      title: 'Intervene & Protect Wealth',
      desc: 'Instant visual guardian alerts you with Green (Safe), Amber (Near Limit), or Coral Red (Over-Budget warning modal).'
    }
  ];

  const personas = [
    {
      id: 'user-persona-a',
      title: 'Persona A: Salaried Professional',
      profile: 'Aarav Sharma • Income: ₹50k • Savings: ₹80k',
      quote: 'Wants to know if buying a ₹70k phone in cash will destroy his 3-month emergency cushion.',
      badge: 'Hackathon Winning Flow'
    },
    {
      id: 'user-persona-b',
      title: 'Persona B: Irregular Freelancer',
      profile: 'Rhea Sen • Income: ₹75k • Variable Invoices',
      quote: 'Needs to cleanly separate fixed monthly co-working/software subscriptions from discretionary lifestyle spending.',
      badge: 'Variable Cashflow'
    },
    {
      id: 'user-persona-c',
      title: 'Persona C: Family Budget Manager',
      profile: 'Vikram & Priya • Income: ₹1.2L • High EMIs',
      quote: 'Managing multiple school fees, home loans, car EMIs, and requires rapid OCR logging of paper utility bills.',
      badge: 'High Dependencies'
    }
  ];

  const faqs = [
    {
      q: 'How does FinTwin differ from standard expense trackers?',
      a: 'Traditional apps only report past spending after you have already lost the money. FinTwin acts as a predictive digital twin that models future financial consequences ("What happens if I buy this?") and warns you before spending breaches your budget.'
    },
    {
      q: 'How is the Financial Health Score (0-100) calculated?',
      a: 'FinTwin uses an educational 5-factor weighted algorithm: Savings Behavior (30%), Expense Control (20%), Emergency Fund Coverage (20%), Debt Burden (15%), and Goal Progress (15%).'
    },
    {
      q: 'Does FinTwin require my real bank credentials or OTPs?',
      a: 'No! FinTwin is a privacy-first predictive simulator. It operates on synthetic and user-controlled profiles with zero need for banking passwords or sensitive UPI PINs.'
    },
    {
      q: 'Can FinTwin connect to physical IoT hardware?',
      a: 'Yes! FinTwin includes an embedded ESP32 C++ firmware (fintwin_esp32.ino) and an on-screen simulator with a 128x64 OLED screen and glowing RGB status LED that turns green, amber, or red based on live financial risk.'
    }
  ];

  return (
    <div className="space-y-16 animate-fade-slide-up pb-24 -mt-6 -mx-4 sm:-mx-8">
      {/* AURORA HERO SECTION */}
      <AuroraHero
        title="Welcome to FinTwin"
        description='"Don’t just track where your money went. See where your money is going." — An intelligent, deterministic digital twin for proactive financial modeling and risk simulation.'
        primaryAction={{
          label: "Get Started",
          onClick: handleGetStarted,
        }}
        secondaryAction={{
          label: "Learn More",
          onClick: handleLearnMore,
        }}
      />

      {/* FLOATING INTERACTIVE MOCKUP PREVIEW */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative mx-auto rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-[#1E293B]/80 to-[#0F172A]/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
          <div className="rounded-2xl bg-[#0B0F17] border border-slate-800 p-5 sm:p-6 shadow-inner text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">fintwin.app/live-twin</span>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-[#EEFC57]/10 text-[#EEFC57] border border-[#EEFC57]/30">
                Twin Health: 78/100 (Good)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">User Profile:</span>
                <span className="font-extrabold text-sm text-white">Souvik Chakraborty</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Liquid Savings Buffer:</span>
                <span className="font-extrabold text-sm text-emerald-400">₹80,000 (3.5 Mo Buffer)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">What-If Status:</span>
                <span className="font-extrabold text-sm text-[#EEFC57]">Ready to Simulate</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#EEFC57] text-[#0B0F17] shadow-sm font-black">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200">
                    User Decision: "What happens if I buy a ₹70,000 smartphone in cash?"
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    FinTwin Verdict: Depletes emergency cushion from 3.5 mo to 0.4 mo (<strong className="text-rose-400">Critical Risk</strong>). Recommends 6-mo EMI or 4-mo Sinking Fund.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('simulator')}
                className="px-4 py-2 rounded-xl bg-[#EEFC57] text-[#0B0F17] text-xs font-black hover:bg-[#EEFC57]/90 transition-all flex-shrink-0"
              >
                Explore Scenario
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6-CARD CHARACTERISTICS GRID (LEARN MORE ANCHOR) */}
      <section id="characteristics" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#EEFC57] bg-[#EEFC57]/10 px-3 py-1 rounded-full border border-[#EEFC57]/20">
            <Zap className="w-3.5 h-3.5" /> Key Characteristics & Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Why FinTwin Outperforms Traditional Trackers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered with a deterministic twin engine, proactive OCR budgeting, and physical IoT feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {characteristics.map((feat, idx) => (
            <Card key={idx} className="p-6 flex flex-col justify-between hover:-translate-y-1 transition-all border border-slate-800 bg-[#121824]/90 hover:border-[#EEFC57]/50 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-[#EEFC57]/10 text-[#EEFC57] group-hover:bg-[#EEFC57] group-hover:text-[#0B0F17] transition-all">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    {feat.category}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-white group-hover:text-[#EEFC57] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3-STEP 'HOW IT WORKS' FLOW */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EEFC57]">
            The OCR Guardian Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How FinTwin Intercepts Overspending
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <Card key={idx} className="p-6 relative border border-slate-800 bg-[#121824]/90">
              <span className="text-4xl font-black text-[#EEFC57]/20 absolute top-4 right-4">
                {s.step}
              </span>
              <h4 className="font-extrabold text-base text-white mt-2">
                {s.title}
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {s.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* PERSONA TESTBED SHOWCASE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EEFC57]">
            Hackathon Demo Personas
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Pre-Loaded Real-World Financial Personas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map(p => (
            <Card key={p.id} className="p-6 flex flex-col justify-between border border-slate-800 bg-[#121824]/90">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEFC57]/10 text-[#EEFC57] border border-[#EEFC57]/30 mb-3">
                  {p.badge}
                </div>
                <h4 className="font-extrabold text-base text-white">
                  {p.title}
                </h4>
                <p className="text-xs font-semibold text-slate-300 mt-1">
                  {p.profile}
                </p>
                <p className="text-xs text-slate-400 mt-3 italic leading-relaxed">
                  "{p.quote}"
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-[#EEFC57] text-[#0B0F17] hover:bg-[#EEFC57]/90 font-bold"
                  onClick={() => {
                    switchPersona(p.id);
                    setActiveTab('dashboard');
                  }}
                >
                  Load & Simulate {p.title.split(':')[0]}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        {faqs.map((faq, idx) => (
          <Card key={idx} className="p-4 cursor-pointer border border-slate-800 bg-[#121824]/90" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
            <div className="flex items-center justify-between font-bold text-xs sm:text-sm text-white">
              <span>{faq.q}</span>
              <span className="text-[#EEFC57] text-lg font-black">{activeFaq === idx ? '−' : '+'}</span>
            </div>
            {activeFaq === idx && (
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed pt-2 border-t border-slate-800">
                {faq.a}
              </p>
            )}
          </Card>
        ))}
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#1E293B] to-[#0F172A] border border-slate-700 text-center space-y-4 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Ready to Take Control of Your Financial Future?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Experience proactive financial modeling with zero banking lock-in. Sign in as Souvik Chakraborty or explore simulated personas right now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleGetStarted}
              className="px-8 py-3.5 rounded-full bg-[#EEFC57] text-[#0B0F17] font-black text-sm hover:bg-[#EEFC57]/90 shadow-xl transition-all"
            >
              Get Started Now
            </button>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-6 py-3.5 rounded-full bg-slate-800 text-white font-bold text-sm hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-2"
            >
              <Scan className="w-4 h-4 text-[#EEFC57]" /> Test Bill Scanner
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

