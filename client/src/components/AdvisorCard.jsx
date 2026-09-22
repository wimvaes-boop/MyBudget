import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, ChevronRight, Calendar, Info, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../services/formatters';

export default function AdvisorCard({ advisorData, onGoToAdvisor }) {
  if (!advisorData) return null;

  const { summary, month, categoryAlerts, insights } = advisorData;
  const topInsight = insights?.[0] || null;
  const dangerAlert = categoryAlerts?.find(a => a.level === 'danger') || categoryAlerts?.[0];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-5 shadow-xl shadow-slate-900/10 border border-slate-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-44 h-44 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Advisor Badge & Days Left */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">
              Financiële Analyse
            </span>
            <span className="text-[11px] text-slate-400">
              Nog {month?.daysUntilSalary || 15} dagen tot volgend salaris
            </span>
          </div>
        </div>

        <button
          onClick={onGoToAdvisor}
          className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-xl border border-slate-700/60 transition-all"
        >
          <span>Advies</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Metric: Daily Safe-to-Spend Allowance */}
      <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
        <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-3.5 border border-slate-700/50">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Veilig dagbudget
          </span>
          <div className="text-2xl font-black text-emerald-400 tracking-tight">
            € {summary?.dailySafeToSpend?.toFixed(0) || 0}
            <span className="text-xs text-slate-400 font-normal ml-1">/dag</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Vrij te besteden
          </span>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-3.5 border border-slate-700/50">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Noodfonds Dekking
          </span>
          <div className="text-2xl font-black text-teal-300 tracking-tight">
            {summary?.emergencyFundCoverageMonths || 0}
            <span className="text-xs text-slate-400 font-normal ml-1">mnd</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Buffer vaste lasten
          </span>
        </div>
      </div>

      {/* Realtime Alert or Actionable Tip Banner */}
      {dangerAlert ? (
        <div className="bg-rose-500/15 border border-rose-500/30 rounded-2xl p-3 flex items-start gap-2.5 relative z-10">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-rose-200 block">{dangerAlert.message}</span>
            <span className="text-[11px] text-rose-300/80">Pas je tempo aan om binnen budget te blijven.</span>
          </div>
        </div>
      ) : topInsight ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex items-start gap-2.5 relative z-10">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-emerald-200 block">{topInsight.title}</span>
            <span className="text-[11px] text-slate-300 line-clamp-1">{topInsight.description}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
