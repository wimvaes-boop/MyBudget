import React from 'react';
import { Sparkles, Shield, AlertTriangle, TrendingUp, CheckCircle2, Award, Calendar, Lightbulb, PieChart, Utensils, HelpCircle } from 'lucide-react';
import { formatCurrency } from '../services/formatters';

export default function AdvisorView({ advisorData, onOpenQuickAdd }) {
  if (!advisorData) return null;

  const { summary, rule50_30_20, categoryAlerts, insights, month } = advisorData;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-lg shadow-emerald-700/15 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" /> High-End Financieel Advies
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-1">
            Financiële Gezondheid: {summary?.healthScore || 80}/100
          </h1>
          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-md">
            Gefeliciteerd met je gezonde basis. Hieronder vind je directe analyses, tempo-indicatoren per categorie en gerichte actiepunten voor deze maand.
          </p>
        </div>
      </div>

      {/* 1. DE 50 / 30 / 20 BUDGETVERDELING */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" /> 50 / 30 / 20 Verdeling
            </h2>
            <p className="text-xs text-slate-500">De gouden standaard voor gebalanceerd financieel beheer</p>
          </div>
        </div>

        {/* 3 Interactive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* 50% Behoeften (Needs) */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700">50% Vaste Behoeften</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  rule50_30_20?.needs?.actualPct <= 52 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {rule50_30_20?.needs?.actualPct || 0}% van inkomsten
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">Huur/hypotheek, energie, voeding, verzekeringen</p>
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900">
                {formatCurrency(rule50_30_20?.needs?.actualAmount || 0)}
              </div>
              <span className="text-[10px] text-slate-500">
                Ideaal richtbedrag: max. {formatCurrency(rule50_30_20?.needs?.idealAmount || 0)}
              </span>
            </div>
          </div>

          {/* 30% Wensen (Wants) */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700">30% Wensen & Plezier</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  rule50_30_20?.wants?.actualPct <= 32 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {rule50_30_20?.wants?.actualPct || 0}% van inkomsten
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">Horeca, reizen, kleding, hobby's & vrije tijd</p>
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900">
                {formatCurrency(rule50_30_20?.wants?.actualAmount || 0)}
              </div>
              <span className="text-[10px] text-slate-500">
                Ideaal richtbedrag: max. {formatCurrency(rule50_30_20?.wants?.idealAmount || 0)}
              </span>
            </div>
          </div>

          {/* 20% Sparen & Beleggen (Savings) */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700">20% Sparen & Groei</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  rule50_30_20?.savings?.actualPct >= 18 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {rule50_30_20?.savings?.actualPct || 0}% van inkomsten
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">Noodfonds, ETF's, pensioensparen & vastgoed</p>
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900">
                {formatCurrency(rule50_30_20?.savings?.budgetedAmount || 0)}
              </div>
              <span className="text-[10px] text-slate-500">
                Ideaal richtbedrag: min. {formatCurrency(rule50_30_20?.savings?.idealAmount || 0)}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. TEMPO & BURN-RATE WAARSCHUWINGEN */}
      {categoryAlerts && categoryAlerts.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Snelheidsmeter & Burn-rate Alerts
          </h2>
          <div className="space-y-2.5">
            {categoryAlerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${
                  alert.level === 'danger'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-xl mt-0.5 ${
                    alert.level === 'danger' ? 'bg-rose-200 text-rose-700' : 'bg-amber-200 text-amber-800'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block">{alert.categoryName}</span>
                    <p className="text-xs opacity-90">{alert.message}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold">{alert.pct}%</span>
                  <span className="text-[10px] block opacity-70">van budget</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CONCRETE AANBEVELINGEN & BESPAARKANSEN */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-emerald-600" /> Slimme Adviezen & Inzichten
        </h2>

        <div className="space-y-3">
          {insights && insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all flex items-start gap-3.5"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                insight.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                insight.color === 'rose' ? 'bg-rose-100 text-rose-700' :
                insight.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                insight.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                'bg-teal-100 text-teal-700'
              }`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                    {insight.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{insight.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
