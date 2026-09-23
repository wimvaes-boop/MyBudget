import React, { useState } from 'react';
import { Lock, Sliders, Download, Upload, Smartphone, RefreshCw, Check, AlertTriangle, ShieldCheck, Tag, Plus, Edit2, KeyRound, BookOpen } from 'lucide-react';
import { formatCurrency } from '../services/formatters';

export default function SettingsView({ settings, categories = [], onSaveSettings, onUpdateCategory, onExport, onImport, onReset, onReRunWizard, onOpenManual }) {
  const [pinEnabled, setPinEnabled] = useState(settings?.pinEnabled || false);
  const [pinCode, setPinCode] = useState(settings?.pinCode || '');
  const [salaryDay, setSalaryDay] = useState(settings?.salaryDay || 25);
  const [monthlyNetIncome, setMonthlyNetIncome] = useState(settings?.monthlyNetIncome ?? 0);
  const [mealVoucherMonthly, setMealVoucherMonthly] = useState(settings?.mealVoucherMonthly ?? 0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Category budget edit modal / state
  const [editingCategory, setEditingCategory] = useState(null);
  const [catBudget, setCatBudget] = useState('');

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    await onSaveSettings({
      pinEnabled,
      pinCode: pinEnabled ? pinCode : '',
      salaryDay: parseInt(salaryDay) || 25,
      monthlyNetIncome: parseFloat(monthlyNetIncome) || 0,
      mealVoucherMonthly: parseFloat(mealVoucherMonthly) || 0
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleEditBudget = (cat) => {
    setEditingCategory(cat);
    setCatBudget(cat.budget.toString());
  };

  const handleSaveBudget = async () => {
    if (!editingCategory) return;
    await onUpdateCategory(editingCategory.id, { budget: parseFloat(catBudget) || 0 });
    setEditingCategory(null);
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300">
      
      {/* 1. Algemene Inkomsten & Pincode Instellingen */}
      <form onSubmit={handleSaveGeneral} className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-600" /> Basis Gegevens & Inkomsten
            </h3>
            <p className="text-xs text-slate-500">Pas je maandelijks profiel aan</p>
          </div>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Opgeslagen
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Netto Maandloon (€)</label>
            <input
              type="number"
              value={monthlyNetIncome}
              onChange={(e) => setMonthlyNetIncome(e.target.value)}
              className="w-full text-sm font-bold bg-white px-2.5 py-1.5 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Maaltijdcheques (€/mnd)</label>
            <input
              type="number"
              value={mealVoucherMonthly}
              onChange={(e) => setMealVoucherMonthly(e.target.value)}
              className="w-full text-sm font-bold bg-white px-2.5 py-1.5 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <label className="text-[11px] font-bold text-slate-600 block mb-1">Dag van Salarisuitbetaling</label>
          <input
            type="number"
            min="1"
            max="31"
            value={salaryDay}
            onChange={(e) => setSalaryDay(e.target.value)}
            className="w-full text-sm font-bold bg-white px-2.5 py-1.5 border border-slate-200 rounded-xl"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            Hierop baseert de adviseur de aftelling en het dagelijks besteedbaar budget.
          </span>
        </div>

        {/* PIN CODE TOGGLE */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Pincode Beveiliging</span>
                <span className="text-[10px] text-slate-400">Vraag om 4-cijferige pincode bij openen</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={pinEnabled}
              onChange={(e) => setPinEnabled(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          {pinEnabled && (
            <div className="pt-2 border-t border-slate-200/60">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">4-cijferige Pincode</label>
              <input
                type="password"
                maxLength="4"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="bv. 1234"
                className="w-full text-base tracking-widest font-mono bg-white px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                required={pinEnabled}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" /> Instellingen Opslaan
        </button>
      </form>

      {/* 2. Categorie Budgetten Beheren */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1">
          <Tag className="w-4 h-4 text-emerald-600" /> Categorieën & Maandbudgetten
        </h3>
        <p className="text-xs text-slate-500 mb-3">Tik op een categorie om het maandbedrag aan te passen.</p>

        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 divide-y divide-slate-100">
          {categories.filter(c => c.type === 'expense').map((cat) => (
            <div key={cat.id} className="pt-2 pb-1 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">{cat.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{formatCurrency(cat.budget)}</span>
                <button
                  onClick={() => handleEditBudget(cat)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal edit category */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white p-5 rounded-3xl max-w-xs w-full shadow-2xl space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Budget voor {editingCategory.name}</h4>
              <input
                type="number"
                value={catBudget}
                onChange={(e) => setCatBudget(e.target.value)}
                className="w-full text-lg font-bold bg-slate-50 px-3 py-2 border rounded-xl"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleSaveBudget}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Opslaan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. iPhone PWA & Tailscale Gids */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100">iPhone Startscherm App (PWA)</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          Open deze pagina op je iPhone in Safari via je Tailscale adres (bv. <code className="text-emerald-300 font-mono bg-slate-800 px-1 py-0.5 rounded">http://[jouw-nuc-ip]:3001</code>).
        </p>
        <div className="bg-slate-800/80 rounded-2xl p-3 text-xs text-slate-300 space-y-1.5 border border-slate-700">
          <p className="font-semibold text-white">📲 Zo installeer je de app als een kaartje:</p>
          <p>1. Tik onderaan in Safari op de <strong>Deelknop</strong> (vierkant met pijltje omhoog).</p>
          <p>2. Scroll naar beneden en kies <strong>'Zet op beginscherm'</strong>.</p>
          <p>3. Nu opent MyBudget zonder Safari adresbalk en werkt het exact als een echte app!</p>
        </div>
      </div>

      {/* 4. Handleiding & Hulp */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-600" /> Hulp & Handleiding
        </h3>
        <p className="text-xs text-slate-500">Bekijk de complete handleiding met tips over het dagbudget, de scanner en installatie op iPhone.</p>
        <button
          onClick={onOpenManual}
          type="button"
          className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200/80 rounded-2xl text-xs font-bold text-emerald-800 flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs"
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Gebruikershandleiding Openen</span>
        </button>
      </div>

      {/* 5. Data Backup & Restore */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Data & Veiligheid</h3>
        <p className="text-xs text-slate-500">Exporteer je gegevens als JSON backup of herstel een eerdere backup.</p>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onExport}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 flex flex-col items-center gap-1.5 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Backup Downloaden</span>
          </button>

          <label className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 flex flex-col items-center gap-1.5 transition-all active:scale-95 cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Backup Herstellen</span>
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
          </label>
        </div>

        <div className="pt-2 flex justify-between items-center text-xs">
          <button
            onClick={onReRunWizard}
            className="text-emerald-700 font-semibold hover:underline"
          >
            Start wizard opnieuw
          </button>
          <button
            onClick={onReset}
            className="text-rose-600 font-semibold hover:underline"
          >
            Data wissen / Resetten
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 text-center">
          <span className="text-[11px] font-bold text-slate-400">
            MyBudget v1.2.0 • Geïnstalleerd op NUC Server
          </span>
        </div>
      </div>

    </div>
  );
}
