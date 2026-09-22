import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Shield, Home, Zap, ShieldCheck, CreditCard, Lock } from 'lucide-react';
import { formatCurrency } from '../services/formatters';

export default function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    income: 2850,
    benefits: 160,
    salaryDay: 25,
    fixedCosts: {
      exp_housing: 1306.74,
      exp_energy: 160,
      exp_insurance: 95,
      exp_telecom: 75
    },
    savingsGoalMonthly: 350,
    pinCode: ''
  });

  const totalFixed = Object.values(formData.fixedCosts).reduce((a, b) => Number(a) + Number(b), 0);
  const totalIncome = Number(formData.income) + Number(formData.benefits);
  const estimatedFree = totalIncome - totalFixed - Number(formData.savingsGoalMonthly);

  const handleFixedChange = (id, val) => {
    setFormData(prev => ({
      ...prev,
      fixedCosts: {
        ...prev.fixedCosts,
        [id]: parseFloat(val) || 0
      }
    }));
  };

  const handleFinish = () => {
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Progress Bar */}
        <div className="flex items-center gap-1.5 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step >= i ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Introductie */}
        {step === 1 && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Welkom bij MyBudget
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              Ik ben jouw persoonlijke financiële adviseur. In 3 korte stappen stellen we jouw profiel in zodat ik direct voor je kan rekenen, waarschuwen en optimaliseren.
            </p>
            <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-left text-xs text-emerald-800 space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Alles blijft 100% lokaal op je NUC
              </p>
              <p className="font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Later altijd aanpasbaar in instellingen
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all mt-4"
            >
              <span>Start Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Inkomsten */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Stap 1 van 3</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">Maandelijkse Inkomsten</h2>
              <p className="text-xs text-slate-500">Wat komt er elke maand structureel binnen?</p>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Netto Maandloon (€)
                </label>
                <input
                  type="number"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  className="w-full text-xl font-bold text-slate-900 bg-white px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Maaltijdcheques / Extralegaal Voordeel (€)
                </label>
                <input
                  type="number"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="w-full text-xl font-bold text-slate-900 bg-white px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Dag van uitbetaling loon (bv. 25e van de maand)
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.salaryDay}
                  onChange={(e) => setFormData({ ...formData, salaryDay: e.target.value })}
                  className="w-full text-base font-semibold text-slate-900 bg-white px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-semibold text-sm hover:bg-slate-200"
              >
                Terug
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <span>Volgende: Vaste Lasten</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Vaste Lasten */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Stap 2 van 3</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">Vaste Maandelijkse Kosten</h2>
              <p className="text-xs text-slate-500">Kosten die elke maand sowieso van je rekening gaan.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Wonen (Huur/Hypotheek)</label>
                <input
                  type="number"
                  value={formData.fixedCosts.exp_housing}
                  onChange={(e) => handleFixedChange('exp_housing', e.target.value)}
                  className="w-full font-bold text-slate-900 bg-white px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Energie (Gas/Stroom)</label>
                <input
                  type="number"
                  value={formData.fixedCosts.exp_energy}
                  onChange={(e) => handleFixedChange('exp_energy', e.target.value)}
                  className="w-full font-bold text-slate-900 bg-white px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Verzekeringen</label>
                <input
                  type="number"
                  value={formData.fixedCosts.exp_insurance}
                  onChange={(e) => handleFixedChange('exp_insurance', e.target.value)}
                  className="w-full font-bold text-slate-900 bg-white px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Internet & Telecom</label>
                <input
                  type="number"
                  value={formData.fixedCosts.exp_telecom}
                  onChange={(e) => handleFixedChange('exp_telecom', e.target.value)}
                  className="w-full font-bold text-slate-900 bg-white px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded-2xl flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600">Totaal Vaste Lasten:</span>
              <span className="font-bold text-slate-900 text-sm">{formatCurrency(totalFixed)}</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-semibold text-sm hover:bg-slate-200"
              >
                Terug
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <span>Volgende: Doelen & Pincode</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Spaardoel, PIN & Afronden */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Stap 3 van 3</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">Sparen & Beveiliging</h2>
              <p className="text-xs text-slate-500">Jouw financiële doelen en optionele pincode.</p>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Gewenst Maandelijks Spaarbedrag (€)
                </label>
                <input
                  type="number"
                  value={formData.savingsGoalMonthly}
                  onChange={(e) => setFormData({ ...formData, savingsGoalMonthly: e.target.value })}
                  className="w-full text-lg font-bold text-slate-900 bg-white px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-500" /> Pincode Beveiliging (Optioneel)
                  </label>
                  <span className="text-[10px] text-slate-400">4 cijfers</span>
                </div>
                <input
                  type="password"
                  maxLength="4"
                  placeholder="Laat leeg voor geen code"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  className="w-full text-base tracking-widest font-mono text-slate-900 bg-white px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-500 placeholder:tracking-normal placeholder:font-sans placeholder:text-xs placeholder:text-slate-400"
                />
              </div>

              {/* Samenvatting van de Adviseur */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-1.5 text-xs text-emerald-900">
                <span className="font-bold flex items-center gap-1 text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5" /> Adviseurs Berekening:
                </span>
                <div className="flex justify-between text-slate-600">
                  <span>Totale Inkomsten:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(totalIncome)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Vaste Lasten + Sparen:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(totalFixed + Number(formData.savingsGoalMonthly))}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-200/60 pt-1 font-bold text-emerald-900">
                  <span>Vrij besteedbaar per maand:</span>
                  <span>{formatCurrency(estimatedFree)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-semibold text-sm hover:bg-slate-200"
              >
                Terug
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>Alles Klaarzetten & Starten</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
