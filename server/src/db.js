import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Default starter seed for Belgium / Netherlands financial profile
const DEFAULT_DATA = {
  settings: {
    currency: 'EUR',
    currencySymbol: '€',
    locale: 'nl-BE',
    salaryDay: 25, // Salaris valt meestal rond de 25e
    pinCode: '', // Leeg = geen pin ingesteld
    pinEnabled: false,
    wizardCompleted: false,
    monthlyNetIncome: 2850,
    mealVoucherMonthly: 160,
    emergencyFundTargetMonths: 6,
    theme: 'light',
    advisorTone: 'encouraging_strict' // 'encouraging_strict' | 'relaxed' | 'aggressive_saver'
  },
  categories: [
    // --- INKOMSTEN ---
    { id: 'inc_salary', name: 'Netto Loon', type: 'income', group: 'income', budget: 2850, icon: 'Briefcase', color: '#10b981', isFixed: true },
    { id: 'inc_meal_vouchers', name: 'Maaltijdcheques', type: 'income', group: 'benefits', budget: 160, icon: 'Utensils', color: '#059669', isFixed: true },
    { id: 'inc_art', name: 'Verkoop Tekeningen / Kunst', type: 'income', group: 'income', budget: 0, icon: 'Palette', color: '#8b5cf6', isFixed: false },
    { id: 'inc_freelance', name: 'Opdrachten & Projecten', type: 'income', group: 'income', budget: 0, icon: 'FileText', color: '#06b6d4', isFixed: false },
    { id: 'inc_workshop', name: 'Workshops & Cursussen', type: 'income', group: 'income', budget: 0, icon: 'Users', color: '#f59e0b', isFixed: false },
    { id: 'inc_extra', name: '13e Maand / Bonus', type: 'income', group: 'income', budget: 0, icon: 'Gift', color: '#0d9488', isFixed: false },
    { id: 'inc_investments', name: 'Beleggingen / Dividenden', type: 'income', group: 'income', budget: 0, icon: 'TrendingUp', color: '#0284c7', isFixed: false },
    { id: 'inc_other', name: 'Overige Inkomsten', type: 'income', group: 'income', budget: 0, icon: 'PlusCircle', color: '#6366f1', isFixed: false },

    // --- VASTE LASTEN (BEHOEFTEN / NEEDS - 50%) ---
    { id: 'exp_housing', name: 'Wonen (Hypotheek)', type: 'expense', group: 'needs', budget: 1306.74, icon: 'Home', color: '#3b82f6', isFixed: true },
    { id: 'exp_energy', name: 'Energie (Gas & Elektriciteit)', type: 'expense', group: 'needs', budget: 160, icon: 'Zap', color: '#f59e0b', isFixed: true },
    { id: 'exp_water', name: 'Water & Afval', type: 'expense', group: 'needs', budget: 40, icon: 'Droplet', color: '#06b6d4', isFixed: true },
    { id: 'exp_insurance', name: 'Verzekeringen (Woon, Auto, Gezin)', type: 'expense', group: 'needs', budget: 95, icon: 'Shield', color: '#6366f1', isFixed: true },
    { id: 'exp_telecom', name: 'Internet, TV & Mobiel', type: 'expense', group: 'needs', budget: 75, icon: 'Wifi', color: '#8b5cf6', isFixed: true },
    { id: 'exp_tax', name: 'Belastingen & Heffingen', type: 'expense', group: 'needs', budget: 80, icon: 'FileText', color: '#ec4899', isFixed: true },
    
    // --- LEVENSONDERHOUD & DAGELIJKS (BEHOEFTEN) ---
    { id: 'exp_groceries', name: 'Boodschappen & Voeding', type: 'expense', group: 'needs', budget: 450, icon: 'ShoppingCart', color: '#10b981', isFixed: false },
    { id: 'exp_transport', name: 'Vervoer (Brandstof / OV / Onderhoud)', type: 'expense', group: 'needs', budget: 150, icon: 'Car', color: '#64748b', isFixed: false },
    { id: 'exp_health', name: 'Gezondheid & Apotheek', type: 'expense', group: 'needs', budget: 50, icon: 'HeartPulse', color: '#ef4444', isFixed: false },

    // --- LEVENSGENIETEN & WENSEN (WANTS - 30%) ---
    { id: 'exp_dining', name: 'Horeca, Terras & Bezorging', type: 'expense', group: 'wants', budget: 180, icon: 'Coffee', color: '#f97316', isFixed: false },
    { id: 'exp_clothing', name: 'Kleding & Schoenen', type: 'expense', group: 'wants', budget: 100, icon: 'ShoppingBag', color: '#d946ef', isFixed: false },
    { id: 'exp_leisure', name: 'Ontspanning, Cultuur & Hobby', type: 'expense', group: 'wants', budget: 120, icon: 'Smile', color: '#a855f7', isFixed: false },
    { id: 'exp_travel', name: 'Reizen, Uitstapjes & Vakantie', type: 'expense', group: 'wants', budget: 200, icon: 'Compass', color: '#0ea5e9', isFixed: false },
    { id: 'exp_subscriptions', name: 'Abonnementen (Netflix, Spotify, etc.)', type: 'expense', group: 'wants', budget: 35, icon: 'Tv', color: '#e11d48', isFixed: true },
    { id: 'exp_other_var', name: 'Onvoorzien / Diversen', type: 'expense', group: 'wants', budget: 80, icon: 'HelpCircle', color: '#94a3b8', isFixed: false },

    // --- SPAREN & INVESTEREN (SAVINGS - 20%) ---
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

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialise or load DB
export function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    saveDb(DEFAULT_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, falling back to default:', err);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

export function saveDb(data) {
  try {
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('Error saving database:', err);
    return false;
  }
}

// Helper query functions
export const db = {
  get: getDb,
  save: saveDb,
  
  getSettings: () => getDb().settings,
  updateSettings: (newSettings) => {
    const state = getDb();
    state.settings = { ...state.settings, ...newSettings };
    saveDb(state);
    return state.settings;
  },

  getCategories: () => getDb().categories,
  addCategory: (category) => {
    const state = getDb();
    const newCat = { ...category, id: category.id || `cat_${Date.now()}` };
    state.categories.push(newCat);
    saveDb(state);
    return newCat;
  },
  updateCategory: (id, updates) => {
    const state = getDb();
    const idx = state.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      state.categories[idx] = { ...state.categories[idx], ...updates };
      saveDb(state);
      return state.categories[idx];
    }
    return null;
  },
  deleteCategory: (id) => {
    const state = getDb();
    state.categories = state.categories.filter(c => c.id !== id);
    saveDb(state);
    return true;
  },

  getTransactions: () => getDb().transactions,
  addTransaction: (tx) => {
    const state = getDb();
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
    state.transactions.unshift(newTx);
    saveDb(state);
    return newTx;
  },
  deleteTransaction: (id) => {
    const state = getDb();
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveDb(state);
    return true;
  },

  getRecurring: () => getDb().recurring,
  addRecurring: (item) => {
    const state = getDb();
    const newItem = { ...item, id: `rec_${Date.now()}` };
    state.recurring.push(newItem);
    saveDb(state);
    return newItem;
  },
  updateRecurring: (id, updates) => {
    const state = getDb();
    const idx = state.recurring.findIndex(r => r.id === id);
    if (idx !== -1) {
      state.recurring[idx] = { ...state.recurring[idx], ...updates };
      saveDb(state);
      return state.recurring[idx];
    }
    return null;
  },
  deleteRecurring: (id) => {
    const state = getDb();
    state.recurring = state.recurring.filter(r => r.id !== id);
    saveDb(state);
    return true;
  },

  getAssets: () => getDb().assets,
  updateAssets: (assets) => {
    const state = getDb();
    state.assets = assets;
    saveDb(state);
    return state.assets;
  },

  getSavingsGoals: () => getDb().savings_goals,
  updateSavingsGoals: (goals) => {
    const state = getDb();
    state.savings_goals = goals;
    saveDb(state);
    return state.savings_goals;
  }
};
