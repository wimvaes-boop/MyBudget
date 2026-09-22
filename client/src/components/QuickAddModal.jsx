import React, { useState, useEffect } from 'react';
import { X, Check, ArrowUpRight, ArrowDownRight, Camera, Sparkles } from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import { formatCurrency } from '../services/formatters';

export default function QuickAddModal({ isOpen, onClose, onSave, categories = [], onOpenScanner }) {
  const [type, setType] = useState('expense'); // 'expense' | 'income'
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group and sort categories by popularity and usage
  const expenseCategories = categories.filter(c => c.type === 'expense');
  // Daily / popular variable expenses at the top
  const popularExpenses = expenseCategories.filter(c => !c.isFixed);
  // Fixed monthly costs (paid 1x per month) at the bottom
  const fixedExpenses = expenseCategories.filter(c => c.isFixed);

  // Income categories
  const incomeCategories = categories.filter(c => c.type === 'income');

  const availableCategories = type === 'expense' 
    ? [...popularExpenses, ...fixedExpenses] 
    : incomeCategories;

  // Set intelligent default category when type or modal opens
  useEffect(() => {
    if (type === 'expense') {
      // Default to Boodschappen or first popular category rather than fixed housing
      const defaultExp = popularExpenses.find(c => c.id === 'exp_groceries') || popularExpenses[0] || expenseCategories[0];
      if (!categoryId || !availableCategories.find(c => c.id === categoryId)) {
        if (defaultExp) setCategoryId(defaultExp.id);
      }
    } else {
      // Income default
      const defaultInc = incomeCategories.find(c => c.id === 'inc_salary') || incomeCategories[0];
      if (!categoryId || !incomeCategories.find(c => c.id === categoryId)) {
        if (defaultInc) setCategoryId(defaultInc.id);
      }
    }
  }, [type, isOpen]);

  if (!isOpen) return null;

  const handleAddAmount = (add) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + add).toString());
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const remainingBudget = selectedCategory ? Math.max(0, (selectedCategory.budget || 0) - (selectedCategory.spent || 0)) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    setIsSubmitting(true);
    try {
      await onSave({
        amount: numAmount,
        type,
        categoryId: categoryId || availableCategories[0]?.id,
        note: note.trim(),
        paymentMethod,
        date
      });
      // Reset form
      setAmount('');
      setNote('');
      onClose();
    } catch (err) {
      console.error('Error submitting transaction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-48">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                type === 'expense'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ArrowDownRight className="w-3.5 h-3.5" /> Uitgave
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                type === 'income'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Inkomst
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Quick Scanner Shortcut for receipts */}
          {type === 'expense' && onOpenScanner && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenScanner();
              }}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-100/70 transition-all active:scale-[0.98] shadow-xs"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Kassaticket scannen via foto</span>
              <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded-full font-semibold">Nieuw</span>
            </button>
          )}

          {/* Amount Input with big display */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center">
            <span className="text-xs text-slate-400 font-medium mb-1">Bedrag in Euro</span>
            <div className="flex items-center justify-center gap-1 w-full">
              <span className="text-3xl font-bold text-slate-400">€</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-48 text-center text-4xl font-extrabold text-slate-900 bg-transparent focus:outline-none placeholder-slate-300"
                required
              />
            </div>

            {/* Quick Add Pills */}
            <div className="flex gap-2 mt-3 flex-wrap justify-center">
              {[5, 10, 20, 50, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAddAmount(val)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-700 active:scale-95 transition-all shadow-xs"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Category Picker Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {type === 'expense' ? 'Populaire Onkosten' : 'Inkomstenbron'}
              </label>
              {selectedCategory && selectedCategory.budget > 0 && type === 'expense' && !selectedCategory.isFixed && (
                <span className="text-[11px] font-medium text-slate-500">
                  Resterend: <span className="text-emerald-600 font-semibold">{formatCurrency(remainingBudget)}</span>
                </span>
              )}
            </div>

            {/* When Expense: Show Popular first */}
            {type === 'expense' ? (
              <div className="space-y-3">
                {/* Popular / Daily expenses */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {popularExpenses.map((cat) => {
                    const isSelected = categoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryId(cat.id)}
                        className={`flex flex-col items-center p-2 rounded-2xl border text-center transition-all active:scale-95 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                            : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700'
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center mb-1 text-white shadow-xs"
                          style={{ backgroundColor: cat.color || '#64748b' }}
                        >
                          <DynamicIcon name={cat.icon} className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-semibold truncate w-full leading-tight">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Fixed Monthly Costs (Bottom, calm, separate) */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Vaste Maandlasten (1x per maand)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                    {fixedExpenses.map((cat) => {
                      const isSelected = categoryId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategoryId(cat.id)}
                          className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20'
                              : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <div 
                            className="w-5 h-5 rounded-lg flex items-center justify-center text-white shrink-0"
                            style={{ backgroundColor: cat.color || '#64748b' }}
                          >
                            <DynamicIcon name={cat.icon} className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-[10px] font-medium truncate">
                            {cat.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* When Income: Show all clear income choices */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {incomeCategories.map((cat) => {
                  const isSelected = categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryId(cat.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all active:scale-95 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                          : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
                        style={{ backgroundColor: cat.color || '#10b981' }}
                      >
                        <DynamicIcon name={cat.icon} className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-semibold leading-tight line-clamp-2">
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Method Pills */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Betaalmethode
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {[
                { id: 'bank', label: 'Bankkaart' },
                { id: 'meal_voucher', label: 'Maaltijdcheque' },
                { id: 'cash', label: 'Cash' },
                { id: 'credit_card', label: 'Kredietkaart' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all truncate ${
                    paymentMethod === m.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Omschrijving
              </label>
              <input
                type="text"
                placeholder={type === 'expense' ? 'bv. Delhaize, Tankbeurt' : 'bv. Verkoop schilderij, Workshop'}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Datum
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>{type === 'expense' ? 'Uitgave Opslaan' : 'Inkomst Opslaan'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
