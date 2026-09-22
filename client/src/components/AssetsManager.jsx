import React, { useState } from 'react';
import { Landmark, TrendingUp, ShieldCheck, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { formatCurrency } from '../services/formatters';

export default function AssetsManager({ assets = [], onSaveAssets }) {
  const [items, setItems] = useState(assets);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const totalAssets = items.reduce((sum, a) => sum + (Number(a.value) || 0), 0);

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditValue(item.value.toString());
  };

  const handleSaveEdit = async (id) => {
    const updated = items.map(a => a.id === id ? { ...a, value: parseFloat(editValue) || 0, updatedAt: new Date().toISOString() } : a);
    setItems(updated);
    setEditingId(null);
    await onSaveAssets(updated);
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-emerald-600" /> Bezit & Beleggingen
          </h3>
          <p className="text-xs text-slate-500">Overzicht van je opgebouwd vermogen</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-black text-emerald-600">{formatCurrency(totalAssets)}</span>
          <span className="text-[10px] text-slate-400 block">Totaal Vermogen</span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                {item.category === 'savings' ? <ShieldCheck className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
                <span className="text-[10px] text-slate-400">{item.notes}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {editingId === item.id ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-20 px-2 py-1 text-xs font-bold bg-white border border-emerald-400 rounded-lg text-right"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(item.id)}
                    className="p-1 bg-emerald-600 text-white rounded-lg"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900">{formatCurrency(item.value)}</span>
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                    title="Wijzigen"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
