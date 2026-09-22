import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Check, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../services/formatters';

export default function RecurringManager({ recurring = [], categories = [], onAdd, onDelete }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
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
      type,
      categoryId: categoryId || availableCategories[0]?.id,
      dayOfMonth: parseInt(dayOfMonth) || 1,
      active: true
    });
    setTitle('');
    setAmount('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Vaste Lasten & Terugkerend</h3>
          <p className="text-xs text-slate-500">Automatische maandelijkse posten</p>
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
            <span className="text-xs font-bold text-slate-700">Nieuwe vaste post toevoegen</span>
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
              placeholder="Titel (bv. Huur, Spotify)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Bedrag (€)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
            >
              {availableCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-1.5 text-xs bg-white px-2 py-1.5 border border-slate-200 rounded-xl">
              <span className="text-slate-400">Dag:</span>
              <input
                type="number"
                min="1"
                max="31"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(e.target.value)}
                className="w-10 text-xs font-bold"
              />
            </div>
          </div>

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
                <span className="text-[10px] text-slate-400">Dag {item.dayOfMonth} van de maand</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold ${
                item.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
              }`}>
                {formatCurrency(item.amount)}
              </span>
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
