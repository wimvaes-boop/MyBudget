// Dynamically detect API base URL (supports both /budget/ proxy and direct :3001)
const isSubpath = typeof window !== 'undefined' && window.location.pathname.startsWith('/budget');
const API_BASE = isSubpath ? '/budget/api' : '/api';

export const api = {
  async getDashboard() {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Kon dashboard data niet laden');
    return res.json();
  },

  async getAdvisor() {
    const res = await fetch(`${API_BASE}/advisor`);
    if (!res.ok) throw new Error('Kon adviseur data niet laden');
    return res.json();
  },

  async getTransactions() {
    const res = await fetch(`${API_BASE}/transactions`);
    if (!res.ok) throw new Error('Kon transacties niet ophalen');
    return res.json();
  },

  async addTransaction(tx) {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx)
    });
    if (!res.ok) throw new Error('Kon transactie niet opslaan');
    return res.json();
  },

  async deleteTransaction(id) {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Kon transactie niet verwijderen');
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Kon categorieën niet laden');
    return res.json();
  },

  async updateCategory(id, data) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Kon categorie niet bijwerken');
    return res.json();
  },

  async addCategory(data) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Kon categorie niet toevoegen');
    return res.json();
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Kon categorie niet verwijderen');
    return res.json();
  },

  async getRecurring() {
    const res = await fetch(`${API_BASE}/recurring`);
    if (!res.ok) throw new Error('Kon vaste lasten niet laden');
    return res.json();
  },

  async addRecurring(data) {
    const res = await fetch(`${API_BASE}/recurring`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Kon vaste post niet toevoegen');
    return res.json();
  },

  async updateRecurring(id, data) {
    const res = await fetch(`${API_BASE}/recurring/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Kon vaste post niet bijwerken');
    return res.json();
  },

  async deleteRecurring(id) {
    const res = await fetch(`${API_BASE}/recurring/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Kon vaste post niet verwijderen');
    return res.json();
  },

  async getAssets() {
    const res = await fetch(`${API_BASE}/assets`);
    if (!res.ok) throw new Error('Kon bezittingen niet laden');
    return res.json();
  },

  async saveAssets(assets) {
    const res = await fetch(`${API_BASE}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assets)
    });
    if (!res.ok) throw new Error('Kon bezittingen niet opslaan');
    return res.json();
  },

  async getSavingsGoals() {
    const res = await fetch(`${API_BASE}/savings-goals`);
    if (!res.ok) throw new Error('Kon doelen niet laden');
    return res.json();
  },

  async saveSavingsGoals(goals) {
    const res = await fetch(`${API_BASE}/savings-goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goals)
    });
    if (!res.ok) throw new Error('Kon doelen niet opslaan');
    return res.json();
  },

  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Kon instellingen niet laden');
    return res.json();
  },

  async saveSettings(settings) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Kon instellingen niet opslaan');
    return res.json();
  },

  async verifyPin(pin) {
    const res = await fetch(`${API_BASE}/settings/verify-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.valid === true;
  },

  async completeWizard(payload) {
    const res = await fetch(`${API_BASE}/wizard/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Kon wizard niet afronden');
    return res.json();
  },

  async resetData() {
    const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Kon data niet resetten');
    return res.json();
  }
};
