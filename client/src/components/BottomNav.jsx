import React from 'react';
import { Home, Sparkles, Plus, PieChart, Sliders } from 'lucide-react';

export default function BottomNav({ currentTab, onSelectTab, onOpenQuickAdd }) {
  const tabs = [
    { id: 'dashboard', label: 'Overzicht', icon: Home },
    { id: 'advisor', label: 'Adviseur', icon: Sparkles },
    { id: 'quick_add', label: 'Invoer', icon: Plus, isAction: true },
    { id: 'charts', label: 'Grafieken', icon: PieChart },
    { id: 'settings', label: 'Beheer', icon: Sliders }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav pb-safe shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={onOpenQuickAdd}
                className="relative -top-3 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-all border-4 border-slate-50"
                aria-label="Snel toevoegen"
              >
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </button>
            );
          }

          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all active:scale-95 ${
                isActive ? 'text-emerald-700 font-semibold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-emerald-50' : 'bg-transparent'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
