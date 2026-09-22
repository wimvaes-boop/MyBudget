import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart3, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { formatCurrency } from '../services/formatters';

export default function ChartsView({ advisorData }) {
  const [chartType, setChartType] = useState('categories'); // 'categories' | 'rules' | 'balance'

  if (!advisorData) return null;

  const { categoriesWithStats = [], summary, rule50_30_20 } = advisorData;

  // Filter expense categories that have actual spend or budget
  const expenseData = categoriesWithStats
    .filter(c => c.type === 'expense' && (c.spent > 0 || c.budget > 0))
    .map(c => ({
      name: c.name,
      value: c.spent > 0 ? c.spent : c.budget,
      color: c.color || '#64748b',
      spent: c.spent,
      budget: c.budget
    }))
    .sort((a, b) => b.value - a.value);

  // 50/30/20 data
  const ruleData = [
    {
      name: 'Behoeften (50%)',
      Werkelijk: rule50_30_20?.needs?.actualAmount || 0,
      Ideaal: rule50_30_20?.needs?.idealAmount || 0
    },
    {
      name: 'Wensen (30%)',
      Werkelijk: rule50_30_20?.wants?.actualAmount || 0,
      Ideaal: rule50_30_20?.wants?.idealAmount || 0
    },
    {
      name: 'Sparen (20%)',
      Werkelijk: rule50_30_20?.savings?.budgetedAmount || 0,
      Ideaal: rule50_30_20?.savings?.idealAmount || 0
    }
  ];

  // Cashflow summary data
  const cashflowData = [
    { name: 'Inkomsten', bedrag: summary?.effectiveIncome || 0, fill: '#10b981' },
    { name: 'Uitgaven', bedrag: summary?.actualExpenses || summary?.budgetedExpenses || 0, fill: '#ef4444' },
    { name: 'Vrij / Sparen', bedrag: Math.max(0, (summary?.effectiveIncome || 0) - (summary?.actualExpenses || 0)), fill: '#3b82f6' }
  ];

  const totalSpent = expenseData.reduce((acc, cur) => acc + (cur.spent || 0), 0);

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300">
      
      {/* Top Selector Pills */}
      <div className="flex gap-2 p-1.5 bg-slate-200/70 rounded-2xl">
        <button
          onClick={() => setChartType('categories')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            chartType === 'categories'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PieIcon className="w-3.5 h-3.5" /> Verdeling
        </button>
        <button
          onClick={() => setChartType('rules')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            chartType === 'rules'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> 50/30/20
        </button>
        <button
          onClick={() => setChartType('balance')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            chartType === 'balance'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Balans
        </button>
      </div>

      {/* Chart 1: Category Distribution Donut */}
      {chartType === 'categories' && (
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">Uitgaven per Categorie</h3>
            <span className="text-xs font-black text-slate-900">{formatCurrency(totalSpent)} totaal</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`€ ${Number(value).toFixed(2)}`, 'Bedrag']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Legends List */}
          <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-1">
            {expenseData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{formatCurrency(item.spent || item.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart 2: 50/30/20 Ideal vs Actual Bar Chart */}
      {chartType === 'rules' && (
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">50/30/20: Werkelijk vs. Ideaal</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">Vergelijk je actuele uitgaven met de aanbevolen normen.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ruleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => [`€ ${Number(value).toFixed(0)}`, '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Werkelijk" fill="#059669" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Ideaal" fill="#94a3b8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 3: Cashflow Balans */}
      {chartType === 'balance' && (
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Cashflow Overzicht</h3>
          <p className="text-xs text-slate-500 mb-4">Totale inkomsten tegenover alle maandelijkse lasten.</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => [`€ ${Number(value).toFixed(0)}`, 'Bedrag']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="bedrag" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Maandelijkse Inkomsten</span>
              <span className="text-base font-extrabold text-emerald-600">{formatCurrency(summary?.effectiveIncome)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Totaal Lasten</span>
              <span className="text-base font-extrabold text-rose-600">{formatCurrency(summary?.actualExpenses || summary?.budgetedExpenses)}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
