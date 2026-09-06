import { PERSONA_A_SALARIED, PERSONA_B_FREELANCER, PERSONA_C_FAMILY } from '../data/mockData';
import { UserProfile, Transaction, CategoryBudget, FinancialDependency, FinancialGoal } from '../types';

const STORAGE_KEYS = {
  ACTIVE_PERSONA: 'fintwin_active_persona',
  PROFILE: 'fintwin_profile',
  TRANSACTIONS: 'fintwin_transactions',
  BUDGETS: 'fintwin_budgets',
  DEPENDENCIES: 'fintwin_dependencies',
  GOALS: 'fintwin_goals',
  THEME: 'fintwin_theme',
  GEMINI_KEY: 'fintwin_gemini_api_key'
};

export function loadInitialData(personaId: string = 'user-persona-a') {
  let source = PERSONA_A_SALARIED;
  if (personaId === 'user-persona-b') source = PERSONA_B_FREELANCER;
  if (personaId === 'user-persona-c') source = PERSONA_C_FAMILY;

  try {
    const savedPersona = localStorage.getItem(STORAGE_KEYS.ACTIVE_PERSONA);
    if (savedPersona === personaId) {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const savedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const savedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      const savedDeps = localStorage.getItem(STORAGE_KEYS.DEPENDENCIES);
      const savedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);

      return {
        profile: savedProfile ? JSON.parse(savedProfile) : source.profile,
        transactions: savedTx ? JSON.parse(savedTx) : source.transactions,
        budgets: savedBudgets ? JSON.parse(savedBudgets) : source.budgets,
        dependencies: savedDeps ? JSON.parse(savedDeps) : source.dependencies,
        goals: savedGoals ? JSON.parse(savedGoals) : source.goals
      };
    }
  } catch (e) {
    console.error('Error reading localStorage data', e);
  }

  return {
    profile: source.profile,
    transactions: source.transactions,
    budgets: source.budgets,
    dependencies: source.dependencies,
    goals: source.goals
  };
}

export function saveStateToStorage(
  personaId: string,
  profile: UserProfile,
  transactions: Transaction[],
  budgets: CategoryBudget[],
  dependencies: FinancialDependency[],
  goals: FinancialGoal[]
) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PERSONA, personaId);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    localStorage.setItem(STORAGE_KEYS.DEPENDENCIES, JSON.stringify(dependencies));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

export function resetPersonaData(personaId: string) {
  let source = PERSONA_A_SALARIED;
  if (personaId === 'user-persona-b') source = PERSONA_B_FREELANCER;
  if (personaId === 'user-persona-c') source = PERSONA_C_FAMILY;

  saveStateToStorage(personaId, source.profile, source.transactions, source.budgets, source.dependencies, source.goals);
  return source;
}
