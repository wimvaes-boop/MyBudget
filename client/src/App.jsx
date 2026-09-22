import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import AdvisorCard from './components/AdvisorCard';
import AdvisorView from './components/AdvisorView';
import BudgetCategoryCard from './components/BudgetCategoryCard';
import TransactionList from './components/TransactionList';
import QuickAddModal from './components/QuickAddModal';
import SetupWizard from './components/SetupWizard';
import PinLockScreen from './components/PinLockScreen';
import ChartsView from './components/ChartsView';
import SettingsView from './components/SettingsView';
import RecurringManager from './components/RecurringManager';
import AssetsManager from './components/AssetsManager';
import ReceiptScannerModal from './components/ReceiptScannerModal';
import { api } from './services/api';
import { formatCurrency } from './services/formatters';
import { Plus, Sparkles, Filter, CheckCircle2, TrendingUp, ArrowDownRight, ArrowUpRight, Wallet, Shield, Camera } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' | 'advisor' | 'charts' | 'settings'
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'daily' | 'fixed' | 'income' | 'savings'
  
  // Security & Onboarding states
  const [isLocked, setIsLocked] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  // Load all data
  const loadData = useCallback(async () => {
    try {
      const data = await api.getDashboard();
      setDashboardData(data);
      
      // Check if PIN lock is active on first load
      if (data.settings?.pinEnabled && data.settings?.pinCode) {
        // If not unlocked in sessionStorage
        const unlocked = sessionStorage.getItem('mybudget_unlocked');
        if (!unlocked) {
          setIsLocked(true);
        }
      }

      // Check if wizard completed
      if (!data.settings?.wizardCompleted) {
        setShowWizard(true);
      }
    } catch (err) {
      console.error('Error fetching app data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const handleUnlock = () => {
    sessionStorage.setItem('mybudget_unlocked', 'true');
    setIsLocked(false);
  };

  const handleManualLock = () => {
    sessionStorage.removeItem('mybudget_unlocked');
    setIsLocked(true);
  };

  const handleCompleteWizard = async (wizardPayload) => {
    try {
      await api.completeWizard(wizardPayload);
      setShowWizard(false);
      await loadData();
    } catch (err) {
      console.error('Error completing wizard:', err);
    }
  };

  const handleSaveTransaction = async (tx) => {
    try {
      await api.addTransaction(tx);
      await loadData();
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await api.deleteTransaction(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const handleUpdateCategory = async (id, data) => {
    try {
      await api.updateCategory(id, data);
      await loadData();
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const handleSaveSettings = async (settings) => {
    try {
      await api.saveSettings(settings);
      await loadData();
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const handleAddRecurring = async (item) => {
    try {
      await api.addRecurring(item);
      await loadData();
    } catch (err) {
      console.error('Error adding recurring:', err);
    }
  };

  const handleDeleteRecurring = async (id) => {
    try {
      await api.deleteRecurring(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting recurring:', err);
    }
  };

  const handleSaveAssets = async (assets) => {
    try {
      await api.saveAssets(assets);
      await loadData();
    } catch (err) {
      console.error('Error saving assets:', err);
    }
  };

  const handleExport = () => {
    window.location.href = '/api/export';
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
      });
      alert('Data succesvol hersteld!');
      await loadData();
    } catch (err) {
      alert('Fout bij importeren van backup');
    }
  };

  const handleReset = async () => {
    if (window.confirm('Weet je zeker dat je alle transacties wilt wissen en opnieuw wilt instellen?')) {
      await api.resetData();
      await loadData();
    }
  };

  // If locked with PIN
  if (isLocked) {
    return <PinLockScreen onUnlock={handleUnlock} correctPin={dashboardData?.settings?.pinCode} />;
  }

  // Loading state
  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl animate-pulse shadow-xl shadow-emerald-600/20">
          €
        </div>
        <span className="text-sm font-bold text-slate-700 mt-4 tracking-tight">MyBudget laden...</span>
        <span className="text-xs text-slate-400 mt-1">Verbinding maken met NUC Dashboard</span>
      </div>
    );
  }

  const { advisor, settings, recentTransactions = [], recurring = [] } = dashboardData;
  const categories = advisor?.categoriesWithStats || [];

  // Group categories logically
  const popularExpenses = categories.filter(c => c.type === 'expense' && !c.isFixed);
  const fixedExpenses = categories.filter(c => c.type === 'expense' && c.isFixed);
  const incomeCategories = categories.filter(c => c.type === 'income');
  const savingsCategories = categories.filter(c => c.group === 'savings');

  // Filter categories for dashboard list
  const filteredCategories = categories.filter(c => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'daily') return c.type === 'expense' && !c.isFixed;
    if (categoryFilter === 'fixed') return c.type === 'expense' && c.isFixed;
    if (categoryFilter === 'income') return c.type === 'income';
    if (categoryFilter === 'savings') return c.group === 'savings';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top App Header */}
      <Navbar
        advisorData={advisor}
        settings={settings}
        onLock={handleManualLock}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-4 pb-28">
        
        {/* TAB 1: HOOFD DASHBOARD */}
        {currentTab === 'dashboard' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            
            {/* 1. Financiële Adviseur Widget */}
            <AdvisorCard
              advisorData={advisor}
              onGoToAdvisor={() => setCurrentTab('advisor')}
            />

            {/* 2. Maandoverzicht Cashflow Kaart */}
            <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Maandbalans ({new Date().toLocaleDateString('nl-BE', { month: 'long', year: 'numeric' })})
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Dag {advisor?.month?.currentDay} / {advisor?.month?.daysInMonth}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100/80">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Inkomsten</span>
                  <span className="text-sm sm:text-base font-black text-emerald-700 block mt-0.5">
                    {formatCurrency(advisor?.summary?.effectiveIncome, false)}
                  </span>
                </div>

                <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100/80">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">Uitgegeven</span>
                  <span className="text-sm sm:text-base font-black text-rose-700 block mt-0.5">
                    {formatCurrency(advisor?.summary?.actualExpenses, false)}
                  </span>
                </div>

                <div className="p-3 bg-slate-100/80 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-700 uppercase block">Resterend</span>
                  <span className="text-sm sm:text-base font-black text-slate-900 block mt-0.5">
                    {formatCurrency(Math.max(0, (advisor?.summary?.effectiveIncome || 0) - (advisor?.summary?.actualExpenses || 0)), false)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons: Handmatige invoer & Kassaticket Scannen */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="flex items-center justify-center gap-2 p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 font-bold text-xs text-slate-800 shadow-soft active:scale-[0.98] transition-all"
              >
                <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Snel Toevoegen</span>
              </button>

              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
              >
                <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Camera className="w-4 h-4" />
                </div>
                <span>Bon Scannen</span>
              </button>
            </div>

            {/* 3. Categorieën Overzicht & Filter Tabs */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Budgetten & Categorieën</h3>
                  <p className="text-[11px] text-slate-400">Populaire & dagelijkse kosten bovenaan</p>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{categories.length} categorieën</span>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {[
                  { id: 'all', label: 'Overzicht' },
                  { id: 'daily', label: 'Dagelijks & Populair' },
                  { id: 'fixed', label: 'Vaste Lasten (1x/mnd)' },
                  { id: 'income', label: 'Inkomsten' },
                  { id: 'savings', label: 'Sparen' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCategoryFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all active:scale-95 ${
                      categoryFilter === f.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* OVERZICHT MODE: Separate Popular Daily from Fixed Monthly Costs */}
              {categoryFilter === 'all' ? (
                <div className="space-y-4">
                  {/* Sectie 1: Dagelijkse & Populaire Uitgaven */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Dagelijkse & Populaire Uitgaven
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Veelgebruikt</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {popularExpenses.map((cat) => (
                        <BudgetCategoryCard key={cat.id} category={cat} />
                      ))}
                    </div>
                  </div>

                  {/* Sectie 2: Vaste Maandlasten (Hypotheek, Energie, etc.) */}
                  <div className="space-y-2 pt-3 border-t border-slate-200/60">
                    <div className="flex items-center justify-between px-1">
                      <div>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Vaste Maandlasten (1x per maand)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Hypotheek (€ 1.306,74), energie & contracten
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                        Vast bedrag
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {fixedExpenses.map((cat) => (
                        <BudgetCategoryCard key={cat.id} category={cat} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Specific Filtered List */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredCategories.map((cat) => (
                    <BudgetCategoryCard key={cat.id} category={cat} />
                  ))}
                </div>
              )}
            </div>

            {/* 4. Recente Transacties Lijst */}
            <TransactionList
              transactions={recentTransactions}
              categories={categories}
              onDeleteTransaction={handleDeleteTransaction}
            />

          </div>
        )}

        {/* TAB 2: VOLLEDIGE ADVISEUR PAGINA */}
        {currentTab === 'advisor' && (
          <AdvisorView
            advisorData={advisor}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          />
        )}

        {/* TAB 3: STATISTIEKEN & GRAFIEKEN */}
        {currentTab === 'charts' && (
          <ChartsView
            advisorData={advisor}
          />
        )}

        {/* TAB 4: BEHEER & INSTELLINGEN */}
        {currentTab === 'settings' && (
          <div className="space-y-6">
            <RecurringManager
              recurring={recurring}
              categories={categories}
              onAdd={handleAddRecurring}
              onDelete={handleDeleteRecurring}
            />

            <AssetsManager
              assets={dashboardData.assets || []}
              onSaveAssets={handleSaveAssets}
            />

            <SettingsView
              settings={settings}
              categories={categories}
              onSaveSettings={handleSaveSettings}
              onUpdateCategory={handleUpdateCategory}
              onExport={handleExport}
              onImport={handleImport}
              onReset={handleReset}
              onReRunWizard={() => setShowWizard(true)}
            />
          </div>
        )}

      </main>

      {/* Floating Action Quick Add Button for Mobile */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSave={handleSaveTransaction}
        categories={categories}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Receipt Scanner Modal (OCR Kassaticket) */}
      <ReceiptScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSave={handleSaveTransaction}
        categories={categories}
      />

      {/* Setup Wizard Modal (On first start or reset) */}
      {showWizard && (
        <SetupWizard
          onComplete={handleCompleteWizard}
        />
      )}

    </div>
  );
}
