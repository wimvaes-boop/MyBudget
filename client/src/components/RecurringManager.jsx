import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Check, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FREQUENCIES, getMonthlyEquivalent, formatFrequencyLabel, formatCurrency } from '../services/formatters';

export default function RecurringManager({ recurring = [], categories = [], onAdd, onDelete }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [type, setType] = useState('expense');
  const [categoryId, setCategoryId] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState(1);

  const availableCategories = categories.filter(c => c.type === type);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    await onAdd({
      title: title.trim(),
      amount: parseFloat(amount),
      frequency,
      type,
      categoryId: categoryId || availableCategories[0]?.id,
      dayOfMonth: parseInt(dayOfMonth) || 1,
      active: true
    });
    setTitle('');
    setAmount('');
    setFrequency('monthly');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Vaste Lasten & Terugkerend</h3>
          <p className="text-xs text-slate-500">Automatische maandelijkse of periodieke facturen</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Nieuw
        </button>
      </div>

      {/* Add form modal / inline */}
      {isAdding && (
        <form onSubmit={handleSave} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">Nieuwe periodieke post toevoegen</span>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-1 text-xs font-bold rounded-lg border ${
                type === 'expense' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white text-slate-600'
              }`}
            >
              Vaste Uitgave
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-1 text-xs font-bold rounded-lg border ${
                type === 'income' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600'
              }`}
            >
              Vaste Inkomst
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Titel (bv. Belasting, Auto, Spotify)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              required
            />
            <input
              type="number"
              step="any"
              placeholder="Factuurbedrag (€)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Categorie</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              >
                {availableCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Dag in de maand</label>
              <div className="flex items-center gap-1.5 text-xs bg-white px-2 py-1.5 border border-slate-200 rounded-xl">
                <span className="text-slate-400">Dag:</span>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(e.target.value)}
                  className="w-full text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-1">Frequentie / Betalingstermijn</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
            >
              {FREQUENCIES.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {frequency !== 'monthly' && amount && (
            <div className="p-2.5 bg-emerald-50 rounded-xl text-xs text-emerald-800 flex justify-between items-center border border-emerald-100">
              <span>Maandelijkse reservering:</span>
              <span className="font-bold text-emerald-900">
                {formatCurrency(getMonthlyEquivalent(parseFloat(amount) || 0, frequency))} / maand
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" /> Opslaan
          </button>
        </form>
      )}

      {/* List */}
      <div className="divide-y divide-slate-100">
        {recurring.map((item) => (
          <div key={item.id} className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${
                item.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {item.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">{item.title}</span>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                  <span>Dag {item.dayOfMonth}</span>
                  {item.frequency && item.frequency !== 'monthly' && (
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                      {formatFrequencyLabel(item.frequency)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className={`text-xs font-bold block ${
                  item.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                }`}>
                  {formatCurrency(item.amount)}
                </span>
                {item.frequency && item.frequency !== 'monthly' && (
                  <span className="text-[10px] text-slate-400 block font-medium">
                    ({formatCurrency(getMonthlyEquivalent(item.amount, item.frequency))}/mnd)
                  </span>
                )}
              </div>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
