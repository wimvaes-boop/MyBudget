import React, { useState, useEffect } from 'react';
import { Lock, Sliders, Download, Upload, Smartphone, RefreshCw, Check, AlertTriangle, ShieldCheck, Tag, Plus, Edit2, KeyRound, BookOpen, Sparkles, Calendar } from 'lucide-react';
import { FREQUENCIES, getMonthlyEquivalent, formatFrequencyLabel, formatCurrency } from '../services/formatters';

export default function SettingsView({
  settings,
  categories = [],
  onSaveSettings,
  onUpdateCategory,
  onSmartFillBudgets,
  onExport,
  onImport,
  onReset,
  onReRunWizard,
  onOpenManual
}) {
  const [pinEnabled, setPinEnabled] = useState(settings?.pinEnabled || false);
  const [pinCode, setPinCode] = useState(settings?.pinCode || '');
  const [salaryDay, setSalaryDay] = useState(settings?.salaryDay || 25);
  const [periodType, setPeriodType] = useState(settings?.periodType || 'salary_cycle');
  const [monthlyNetIncome, setMonthlyNetIncome] = useState(settings?.monthlyNetIncome ?? 0);
  const [mealVoucherMonthly, setMealVoucherMonthly] = useState(settings?.mealVoucherMonthly ?? 0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if settings prop changes
  useEffect(() => {
    if (settings) {
      setPinEnabled(settings.pinEnabled || false);
      setPinCode(settings.pinCode || '');
      setSalaryDay(settings.salaryDay || 25);
      setPeriodType(settings.periodType || 'salary_cycle');
      setMonthlyNetIncome(settings.monthlyNetIncome ?? 0);
      setMealVoucherMonthly(settings.mealVoucherMonthly ?? 0);
    }
  }, [settings]);

  // Category budget edit modal / state
  const [editingCategory, setEditingCategory] = useState(null);
  const [catBudget, setCatBudget] = useState('');
  const [catFrequency, setCatFrequency] = useState('monthly');

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    const incomeVal = parseFloat(monthlyNetIncome) || 0;
    const mealVal = parseFloat(mealVoucherMonthly) || 0;
    await onSaveSettings({
      pinEnabled,
      pinCode: pinEnabled ? pinCode : '',
      salaryDay: parseInt(salaryDay) || 25,
      periodType,
      monthlyNetIncome: incomeVal,
      mealVoucherMonthly: mealVal
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleEditBudget = (cat) => {
    setEditingCategory(cat);
    setCatFrequency(cat.frequency || 'monthly');
    setCatBudget((cat.billingAmount || cat.budget || 0).toString());
  };

  const handleSaveBudget = async () => {
    if (!editingCategory) return;
    const billAmt = parseFloat(catBudget) || 0;
    const monthlyAmt = getMonthlyEquivalent(billAmt, catFrequency);
    await onUpdateCategory(editingCategory.id, {
      budget: monthlyAmt,
      billingAmount: billAmt,
      frequency: catFrequency
    });
    if (editingCategory.id === 'inc_salary') {
      await onSaveSettings({
        ...settings,
        monthlyNetIncome: monthlyAmt
      });
    } else if (editingCategory.id === 'inc_meal_vouchers') {
      await onSaveSettings({
        ...settings,
        mealVoucherMonthly: monthlyAmt
      });
    }
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

        {/* Periode Type Kiezer */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
          <label className="text-[11px] font-bold text-slate-700 block">
            Budgetperiode Berekening
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPeriodType('salary_cycle')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                periodType === 'salary_cycle'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-bold block">Salariscyclus</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">
                Vanaf de {salaryDay}e t/m dag vóór volgend loon
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPeriodType('calendar_month')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                periodType === 'calendar_month'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-bold block">Kalendermaand</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 leading-snug">
                1e t/m laatste dag van de maand
              </span>
            </button>
          </div>
          <span className="text-[10px] text-slate-400 block">
            {periodType === 'salary_cycle'
              ? '💡 Jouw periode telt af tussen twee salarisstortingen (bv. 25 sep - 24 okt).'
              : '💡 Jouw periode volgt strikt de kalendermaand (1 - 30/31).'}
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-600" /> Categorieën & Richtbudgetten
            </h3>
            <p className="text-xs text-slate-500">Pas per categorie aan of kies een factuurtermijn (jaarlijks, kwartaal, etc.).</p>
          </div>
          {onSmartFillBudgets && (
            <button
              type="button"
              onClick={onSmartFillBudgets}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 transition-all active:scale-95 shadow-xs whitespace-nowrap self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>🪄 Slimme Richtbudgetten</span>
            </button>
          )}
        </div>

        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-100">
          {categories.filter(c => c.type === 'expense').map((cat) => {
            const isNonMonthly = cat.frequency && cat.frequency !== 'monthly';
            return (
              <div key={cat.id} className="pt-2 pb-1.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block">{cat.name}</span>
                  {isNonMonthly && (
                    <span className="text-[10px] text-slate-400">
                      Factuur: {formatCurrency(cat.billingAmount || 0)} {formatFrequencyLabel(cat.frequency)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{formatCurrency(cat.budget)}/mnd</span>
                  </div>
                  <button
                    onClick={() => handleEditBudget(cat)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal edit category */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white p-5 rounded-3xl max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Budget instellen voor</h4>
                <p className="text-xs text-emerald-700 font-semibold">{editingCategory.name}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Betalingstermijn / Frequentie</label>
                  <select
                    value={catFrequency}
                    onChange={(e) => setCatFrequency(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    {FREQUENCIES.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {catFrequency === 'monthly' ? 'Maandbedrag (€)' : `Bedrag per ${formatFrequencyLabel(catFrequency)} (€)`}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={catBudget}
                    onChange={(e) => setCatBudget(e.target.value)}
                    className="w-full text-lg font-bold bg-slate-50 px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                    autoFocus
                  />
                </div>

                {catFrequency !== 'monthly' && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 space-y-0.5">
                    <span className="font-bold block">Maandelijkse reservering:</span>
                    <span className="text-sm font-black text-emerald-700">
                      {formatCurrency(getMonthlyEquivalent(parseFloat(catBudget) || 0, catFrequency))} per maand
                    </span>
                    <span className="text-[10px] text-emerald-700/80 block">
                      Dit bedrag wordt maandelijks gereserveerd in je budget zodat je ruim op tijd gedekt bent.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="button"
                  onClick={handleSaveBudget}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
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
            MyBudget v1.3.0 • Geïnstalleerd op NUC Server
          </span>
        </div>
      </div>

    </div>
  );
}
