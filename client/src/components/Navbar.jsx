import React from 'react';
import { ShieldCheck, Sparkles, RefreshCw, Lock, Smartphone, Wifi } from 'lucide-react';

export default function Navbar({ advisorData, settings, onLock, onRefresh, isRefreshing }) {
  const healthScore = advisorData?.summary?.healthScore || 80;

  // Determine score color badge
  const getScoreBadge = () => {
    if (healthScore >= 80) return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'Financieel Gezond' };
    if (healthScore >= 60) return { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Aandacht Nodig' };
    return { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'Bijsturen' };
  };

  const badge = getScoreBadge();

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-200/80 px-4 py-3 pt-safe">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Brand & Advisor Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-bold text-lg">
            €
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base">MyBudget</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-900 text-white shadow-xs">
                v1.2.0
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> Adviseur
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{advisorData?.isStandalone || window?.location?.hostname?.includes('github.io') ? 'Standalone Privé' : 'NUC Dashboard'}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">{advisorData?.isStandalone || window?.location?.hostname?.includes('github.io') ? 'Lokaal Beveiligd' : 'Tailscale OK'}</span>
            </div>
          </div>
        </div>

        {/* Right Action Icons: Health Score & Lock */}
        <div className="flex items-center gap-2">
          {/* Health Score Pill */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${badge.bg}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>{healthScore}/100</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className={`p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            title="Verversen"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Optional Lock Button */}
          {settings?.pinEnabled && (
            <button
              onClick={onLock}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all"
              title="Vergrendel app"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
