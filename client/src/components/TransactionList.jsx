import React from 'react';
import { Trash2, ArrowDownRight, ArrowUpRight, CreditCard, Utensils, Banknote } from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import { formatCurrency, formatDate } from '../services/formatters';

export default function TransactionList({ transactions = [], categories = [], onDeleteTransaction }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-soft">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
          <CreditCard className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-slate-700">Nog geen transacties geregistreerd</p>
        <p className="text-xs text-slate-400 mt-0.5">Tik op de grote '+' knop onderaan om je eerste uitgave of inkomst in te voeren.</p>
      </div>
    );
  }

  const getCategory = (catId) => {
    return categories.find(c => c.id === catId) || {
      name: 'Overig',
      icon: 'Tag',
      color: '#64748b'
    };
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'meal_voucher': return 'Maaltijdcheque';
      case 'cash': return 'Cash';
      case 'credit_card': return 'Kredietkaart';
      default: return 'Bankkaart';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 shadow-soft border border-slate-100">
      <div className="flex items-center justify-between px-2 mb-3">
        <h3 className="text-sm font-bold text-slate-900">Recente Transacties</h3>
        <span className="text-[11px] text-slate-400 font-medium">{transactions.length} mutaties</span>
      </div>

      <div className="divide-y divide-slate-100">
        {transactions.map((tx) => {
          const cat = getCategory(tx.categoryId);
          const isExpense = tx.type === 'expense';

          return (
            <div
              key={tx.id}
              className="py-3 px-2 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: cat.color || '#64748b' }}
                >
                  <DynamicIcon name={cat.icon} className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {tx.note || cat.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span>{formatDate(tx.date)}</span>
                    <span>•</span>
                    <span>{cat.name}</span>
                    {tx.paymentMethod === 'meal_voucher' && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">Maaltijdcheque</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-sm font-black tracking-tight ${
                  isExpense ? 'text-slate-900' : 'text-emerald-600'
                }`}>
                  {isExpense ? '-' : '+'} {formatCurrency(tx.amount)}
                </span>

                <button
                  onClick={() => onDeleteTransaction(tx.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                  title="Verwijderen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
