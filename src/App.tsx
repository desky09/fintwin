import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { PersistentFAB } from './components/layout/PersistentFAB';
import { BillScannerModal } from './components/scanner/BillScannerModal';
import { OnboardingWizardModal } from './components/onboarding/OnboardingWizardModal';

// Feature Views
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { WhatIfSimulator } from './components/simulator/WhatIfSimulator';
import { TransactionsView } from './components/transactions/TransactionsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ForecastView } from './components/forecast/ForecastView';
import { DependenciesView } from './components/dependencies/DependenciesView';
import { BudgetsView } from './components/budgets/BudgetsView';
import { GoalsView } from './components/goals/GoalsView';
import { AIAdvisorView } from './components/ai/AIAdvisorView';
import { ESP32MeterView } from './components/iot/ESP32MeterView';
import { SettingsView } from './components/settings/SettingsView';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'simulator':
        return <WhatIfSimulator />;
      case 'transactions':
        return <TransactionsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'forecast':
        return <ForecastView />;
      case 'dependencies':
        return <DependenciesView />;
      case 'budgets':
        return <BudgetsView />;
      case 'goals':
        return <GoalsView />;
      case 'ai':
        return <AIAdvisorView />;
      case 'iot':
        return <ESP32MeterView />;
      case 'settings':
        return <SettingsView />;
      case 'landing':
        return <LandingPage />;
      case 'auth':
        return <AuthPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B0F17] text-white selection:bg-[#EEFC57] selection:text-[#0B0F17]">
      {/* Left Navigation Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Navbar 
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
          isSidebarOpen={isSidebarOpen} 
        />

        {/* Main Content Viewport */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Action Button for Desktop */}
      <PersistentFAB />

      {/* Mobile Floating Bottom Dock */}
      <BottomNav />

      {/* Global Bill Scanner OCR Modal */}
      <BillScannerModal />

      {/* 4-Step Onboarding Modal */}
      <OnboardingWizardModal 
        isOpen={isOnboardingOpen} 
        onClose={() => setIsOnboardingOpen(false)} 
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
