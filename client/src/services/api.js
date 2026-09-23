import { analyzeFinancesLocally } from './localAdvisor';

// Detect whether we are on a static host (GitHub Pages) or on NUC
const isGithubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
const isSubpath = typeof window !== 'undefined' && window.location.pathname.startsWith('/budget');
const API_BASE = isSubpath ? '/budget/api' : '/api';

// Starter seed data for standalone mode (Belgium / Netherlands profile)
const DEFAULT_LOCAL_STATE = {
  settings: {
    currency: 'EUR',
    currencySymbol: '€',
    locale: 'nl-BE',
    salaryDay: 25,
    pinCode: '',
    pinEnabled: false,
    wizardCompleted: true,
    monthlyNetIncome: 2850,
    mealVoucherMonthly: 160,
    emergencyFundTargetMonths: 6,
    theme: 'light',
    advisorTone: 'encouraging_strict'
  },
  categories: [
    { id: 'inc_salary', name: 'Netto Loon', type: 'income', group: 'income', budget: 2850, icon: 'Briefcase', color: '#10b981', isFixed: true },
    { id: 'inc_meal_vouchers', name: 'Maaltijdcheques', type: 'income', group: 'benefits', budget: 160, icon: 'Utensils', color: '#059669', isFixed: true },
    { id: 'inc_art', name: 'Verkoop Tekeningen / Kunst', type: 'income', group: 'income', budget: 0, icon: 'Palette', color: '#8b5cf6', isFixed: false },
    { id: 'inc_freelance', name: 'Opdrachten & Projecten', type: 'income', group: 'income', budget: 0, icon: 'FileText', color: '#06b6d4', isFixed: false },
    { id: 'inc_workshop', name: 'Workshops & Cursussen', type: 'income', group: 'income', budget: 0, icon: 'Users', color: '#f59e0b', isFixed: false },
    { id: 'inc_extra', name: '13e Maand / Bonus', type: 'income', group: 'income', budget: 0, icon: 'Gift', color: '#0d9488', isFixed: false },
    { id: 'inc_investments', name: 'Beleggingen / Dividenden', type: 'income', group: 'income', budget: 0, icon: 'TrendingUp', color: '#0284c7', isFixed: false },
    { id: 'inc_other', name: 'Overige Inkomsten', type: 'income', group: 'income', budget: 0, icon: 'PlusCircle', color: '#6366f1', isFixed: false },

    { id: 'exp_housing', name: 'Wonen (Hypotheek)', type: 'expense', group: 'needs', budget: 1306.74, icon: 'Home', color: '#3b82f6', isFixed: true },
    { id: 'exp_energy', name: 'Energie (Gas & Elektriciteit)', type: 'expense', group: 'needs', budget: 160, icon: 'Zap', color: '#f59e0b', isFixed: true },
    { id: 'exp_water', name: 'Water & Afval', type: 'expense', group: 'needs', budget: 40, icon: 'Droplet', color: '#06b6d4', isFixed: true },
    { id: 'exp_insurance', name: 'Verzekeringen (Woon, Auto, Gezin)', type: 'expense', group: 'needs', budget: 95, icon: 'Shield', color: '#6366f1', isFixed: true },
    { id: 'exp_telecom', name: 'Internet, TV & Mobiel', type: 'expense', group: 'needs', budget: 75, icon: 'Wifi', color: '#8b5cf6', isFixed: true },
    { id: 'exp_tax', name: 'Belastingen & Heffingen', type: 'expense', group: 'needs', budget: 80, icon: 'FileText', color: '#ec4899', isFixed: true },

    { id: 'exp_groceries', name: 'Boodschappen & Voeding', type: 'expense', group: 'needs', budget: 450, icon: 'ShoppingCart', color: '#10b981', isFixed: false },
    { id: 'exp_transport', name: 'Vervoer (Brandstof / OV / Onderhoud)', type: 'expense', group: 'needs', budget: 150, icon: 'Car', color: '#64748b', isFixed: false },
    { id: 'exp_health', name: 'Gezondheid & Apotheek', type: 'expense', group: 'needs', budget: 50, icon: 'HeartPulse', color: '#ef4444', isFixed: false },

    { id: 'exp_dining', name: 'Horeca, Terras & Bezorging', type: 'expense', group: 'wants', budget: 180, icon: 'Coffee', color: '#f97316', isFixed: false },
    { id: 'exp_clothing', name: 'Kleding & Schoenen', type: 'expense', group: 'wants', budget: 100, icon: 'ShoppingBag', color: '#d946ef', isFixed: false },
    { id: 'exp_leisure', name: 'Ontspanning, Cultuur & Hobby', type: 'expense', group: 'wants', budget: 120, icon: 'Smile', color: '#a855f7', isFixed: false },
    { id: 'exp_travel', name: 'Reizen, Uitstapjes & Vakantie', type: 'expense', group: 'wants', budget: 200, icon: 'Compass', color: '#0ea5e9', isFixed: false },
    { id: 'exp_subscriptions', name: 'Abonnementen (Netflix, Spotify, etc.)', type: 'expense', group: 'wants', budget: 35, icon: 'Tv', color: '#e11d48', isFixed: true },
    { id: 'exp_other_var', name: 'Onvoorzien / Diversen', type: 'expense', group: 'wants', budget: 80, icon: 'HelpCircle', color: '#94a3b8', isFixed: false },

    { id: 'sav_emergency', name: 'Noodfonds Buffer', type: 'expense', group: 'savings', budget: 150, icon: 'PiggyBank', color: '#10b981', isFixed: false },
    { id: 'sav_invest', name: 'Beleggingen (ETF / Fondsen)', type: 'expense', group: 'savings', budget: 200, icon: 'TrendingUp', color: '#059669', isFixed: false },
    { id: 'sav_pension', name: 'Pensioensparen (Belastingvoordeel)', type: 'expense', group: 'savings', budget: 85, icon: 'Award', color: '#047857', isFixed: true }
  ],
  recurring: [
    { id: 'rec_salary', title: 'Maandelijks Salaris', amount: 2850, type: 'income', categoryId: 'inc_salary', dayOfMonth: 25, active: true },
    { id: 'rec_meals', title: 'Maaltijdcheques Storting', amount: 160, type: 'income', categoryId: 'inc_meal_vouchers', dayOfMonth: 25, active: true },
    { id: 'rec_mortgage', title: 'Hypotheek (Wonen)', amount: 1306.74, type: 'expense', categoryId: 'exp_housing', dayOfMonth: 1, active: true },
    { id: 'rec_energy', title: 'Voorschot Energie (Luminus / Engie)', amount: 160, type: 'expense', categoryId: 'exp_energy', dayOfMonth: 5, active: true },
    { id: 'rec_telecom', title: 'Internet & Mobiel', amount: 75, type: 'expense', categoryId: 'exp_telecom', dayOfMonth: 12, active: true },
    { id: 'rec_insurance', title: 'Verzekeringspakket', amount: 95, type: 'expense', categoryId: 'exp_insurance', dayOfMonth: 15, active: true },
    { id: 'rec_pension', title: 'Pensioensparen Fiscale Max', amount: 85, type: 'expense', categoryId: 'sav_pension', dayOfMonth: 20, active: true }
  ],
  transactions: [],
  assets: [
    { id: 'ast_savings', name: 'Spaarrekening (Buffer)', category: 'savings', value: 8500, returnRate: 2.0, notes: 'Direct opvraagbare noodbuffer', updatedAt: new Date().toISOString() },
    { id: 'ast_etf', name: 'Wereldwijde ETF Portefeuille', category: 'investments', value: 14200, returnRate: 7.5, notes: 'Lange termijn vermogensopbouw (MSCI World / S&P500)', updatedAt: new Date().toISOString() },
    { id: 'ast_pension', name: 'Pensioenspaarfonds', category: 'pension', value: 6800, returnRate: 5.0, notes: 'Jaarlijks 30% belastingvermindering', updatedAt: new Date().toISOString() }
  ],
  savings_goals: [
    { id: 'goal_emergency', title: 'Noodbuffer (6 mnd vaste lasten)', targetAmount: 9000, currentAmount: 8500, deadline: '2026-12-31', icon: 'ShieldCheck', color: '#10b981' },
    { id: 'goal_vacation', title: 'Zomervakantie Reisfonds', targetAmount: 2500, currentAmount: 1400, deadline: '2027-06-30', icon: 'Sun', color: '#0ea5e9' },
    { id: 'goal_renovation', title: 'Woningonderhoud & Vernieuwing', targetAmount: 5000, currentAmount: 1800, deadline: '2027-12-31', icon: 'Wrench', color: '#8b5cf6' }
  ]
};

// LocalStorage Helper
function getLocalState() {
  try {
    const raw = localStorage.getItem('mybudget_data');
    if (!raw) {
      saveLocalState(DEFAULT_LOCAL_STATE);
      return JSON.parse(JSON.stringify(DEFAULT_LOCAL_STATE));
    }
    return JSON.parse(raw);
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_LOCAL_STATE));
  }
}

function saveLocalState(state) {
  try {
    localStorage.setItem('mybudget_data', JSON.stringify(state));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

// Track whether backend is active or if we fall back to standalone
let useLocalMode = isGithubPages;

export const api = {
  async getDashboard() {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/dashboard`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend niet bereikbaar, overschakelen naar Standalone Private Mode:', err.message);
        useLocalMode = true;
      }
    }

    // Standalone fallback
    const state = getLocalState();
    const advisor = analyzeFinancesLocally(state);
    return {
      status: 'ok',
      isStandalone: true,
      settings: state.settings,
      advisor,
      recentTransactions: (state.transactions || []).slice(0, 15),
      savingsGoals: state.savings_goals || [],
      recurring: state.recurring || [],
      assets: state.assets || []
    };
  },

  async getAdvisor() {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/advisor`);
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }
    const state = getLocalState();
    return analyzeFinancesLocally(state);
  },

  async getTransactions() {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/transactions`);
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }
    return getLocalState().transactions || [];
  },

  async addTransaction(tx) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tx)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const state = getLocalState();
    const newTx = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      date: tx.date || new Date().toISOString().split('T')[0],
      amount: parseFloat(tx.amount) || 0,
      type: tx.type || 'expense',
      categoryId: tx.categoryId,
      note: tx.note || '',
      paymentMethod: tx.paymentMethod || 'bank',
      isRecurring: tx.isRecurring || false
    };
    state.transactions = state.transactions || [];
    state.transactions.unshift(newTx);
    saveLocalState(state);
    return newTx;
  },

  async deleteTransaction(id) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const state = getLocalState();
    state.transactions = (state.transactions || []).filter(t => t.id !== id);
    saveLocalState(state);
    return { success: true };
  },

  async getCategories() {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }
    return getLocalState().categories || [];
  },

  async updateCategory(id, data) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/categories/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const state = getLocalState();
    const idx = (state.categories || []).findIndex(c => c.id === id);
    if (idx !== -1) {
      state.categories[idx] = { ...state.categories[idx], ...data };
      saveLocalState(state);
      return state.categories[idx];
    }
    return null;
  },

  async addCategory(data) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const state = getLocalState();
    const newCat = { ...data, id: data.id || `cat_${Date.now()}` };
    state.categories.push(newCat);
    saveLocalState(state);
    return newCat;
  },

  async deleteCategory(id) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const state = getLocalState();
    state.categories = (state.categories || []).filter(c => c.id !== id);
    saveLocalState(state);
    return { success: true };
  },

  async getRecurring() {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/recurring`);
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }
    return getLocalState().recurring || [];
  },

  async addRecurring(data) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/recurring`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const state = getLocalState();
    const newItem = { ...data, id: `rec_${Date.now()}` };
    state.recurring = state.recurring || [];
    state.recurring.push(newItem);
    saveLocalState(state);
    return newItem;
  },

  async updateRecurring(id, data) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/recurring/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const state = getLocalState();
    const idx = (state.recurring || []).findIndex(r => r.id === id);
    if (idx !== -1) {
      state.recurring[idx] = { ...state.recurring[idx], ...data };
      saveLocalState(state);
      return state.recurring[idx];
    }
    return null;
  },

  async deleteRecurring(id) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/recurring/${id}`, { method: 'DELETE' });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const state = getLocalState();
    state.recurring = (state.recurring || []).filter(r => r.id !== id);
    saveLocalState(state);
    return { success: true };
  },

  async getAssets() {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/assets`);
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }
    return getLocalState().assets || [];
  },

  async saveAssets(assets) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/assets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assets)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const state = getLocalState();
    state.assets = assets;
    saveLocalState(state);
    return state.assets;
  },

  async getSavingsGoals() {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/savings-goals`);
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }
    return getLocalState().savings_goals || [];
  },

  async saveSavingsGoals(goals) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/savings-goals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goals)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const state = getLocalState();
    state.savings_goals = goals;
    saveLocalState(state);
    return state.savings_goals;
  },

  async getSettings() {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/settings`);
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }
    return getLocalState().settings || DEFAULT_LOCAL_STATE.settings;
  },

  async saveSettings(settings) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const state = getLocalState();
    state.settings = { ...state.settings, ...settings };
    saveLocalState(state);
    return state.settings;
  },

  async verifyPin(pin) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/settings/verify-pin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin })
        });
        if (res.ok) {
          const data = await res.json();
          return data.valid === true;
        }
      } catch (e) {
        useLocalMode = true;
      }
    }

    const settings = getLocalState().settings;
    if (!settings.pinEnabled || !settings.pinCode) return true;
    return settings.pinCode === pin;
  },

  async completeWizard(payload) {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/wizard/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const state = getLocalState();
    state.settings.wizardCompleted = true;
    if (payload.income) state.settings.monthlyNetIncome = Number(payload.income);
    if (payload.salaryDay) state.settings.salaryDay = Number(payload.salaryDay);
    if (payload.pinCode) {
      state.settings.pinCode = payload.pinCode;
      state.settings.pinEnabled = true;
    }
    saveLocalState(state);
    return { success: true, settings: state.settings };
  },

  async resetData() {
    if (!useLocalMode) {
      try {
        const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch (e) {
        useLocalMode = true;
      }
    }

    const defaultState = JSON.parse(JSON.stringify(DEFAULT_LOCAL_STATE));
    defaultState.transactions = [];
    defaultState.settings.wizardCompleted = false;
    defaultState.settings.pinCode = '';
    defaultState.settings.pinEnabled = false;
    saveLocalState(defaultState);
    return { success: true };
  }
};
