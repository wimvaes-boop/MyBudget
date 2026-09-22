import React from 'react';
import DynamicIcon from './DynamicIcon';
import { formatCurrency } from '../services/formatters';

export default function BudgetCategoryCard({ category, onSelectCategory, onQuickAddForCategory }) {
  const { name, budget = 0, spent = 0, icon, color, pct = 0, type, isFixed } = category;

  const isIncome = type === 'income';
  const isOverspent = !isIncome && spent > budget + 1 && budget > 0;
  const isFixedPaid = isFixed && spent >= budget - 1 && !isOverspent;
  const isNearLimit = !isIncome && !isFixed && pct >= 80 && pct <= 100;
  const remaining = Math.max(0, budget - spent);

  // Progress bar color logic
  let barColor = 'bg-emerald-500';
  if (isOverspent) barColor = 'bg-rose-500';
  else if (isNearLimit) barColor = 'bg-amber-500';
  else if (isFixedPaid) barColor = 'bg-emerald-600';

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-soft hover:shadow-card transition-all flex flex-col justify-between">
      
      {/* Top row: Icon, Category Name, Budget Target */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
            style={{ backgroundColor: color || '#64748b' }}
          >
            <DynamicIcon name={icon} className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{name}</h4>
              {isFixed && (
                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                  Vast
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">
              {isIncome ? 'Verwacht' : 'Vast/Budget'}: {formatCurrency(budget, false)}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-xs font-black ${
            isOverspent ? 'text-rose-600' : isIncome || isFixedPaid ? 'text-emerald-700' : 'text-slate-900'
          }`}>
            {formatCurrency(spent, false)}
          </span>
          <span className="text-[10px] text-slate-400 block">
            {isIncome ? 'ontvangen' : `van ${formatCurrency(budget, false)}`}
          </span>
        </div>
      </div>

      {/* Progress Bar (for expenses) */}
      {!isIncome && budget > 0 && (
        <div className="space-y-1">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>
              {isFixedPaid ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">✓ Betaald / Voldaan</span>
              ) : (
                <span>{pct}% verbruikt</span>
              )}
            </span>
            <span>
              {isOverspent ? (
                <span className="text-rose-600 font-bold">€ {(spent - budget).toFixed(0)} te veel</span>
              ) : isFixedPaid ? (
                <span className="text-slate-400 font-normal">Geen extra kosten</span>
              ) : (
                <span>Nog {formatCurrency(remaining, false)} over</span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
