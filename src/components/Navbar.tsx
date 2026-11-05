import React from 'react';
import { Utensils, Calculator, MessageSquareText, HelpCircle, Sparkles } from 'lucide-react';

export type TabType = 'food-db' | 'calculators' | 'nlp-logger' | 'questions';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  dietPreference?: 'vegetarian' | 'non-vegetarian';
  onToggleDietPreference?: (preference: 'vegetarian' | 'non-vegetarian') => void;
  onExportReport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  dietPreference = 'vegetarian',
  onToggleDietPreference,
}) => {
  const tabs = [
    { id: 'food-db' as TabType, label: 'IFCT Food DB & Meal Plate', icon: Utensils, sub: 'Grams, Pieces & Meal Cart' },
    { id: 'calculators' as TabType, label: '12 Calculators', icon: Calculator, sub: 'ICMR-NIN Engine' },
    { id: 'nlp-logger' as TabType, label: 'Natural Language Logger', icon: MessageSquareText, sub: 'AI Sentence Parser' },
    { id: 'questions' as TabType, label: '100+ User Questions', icon: HelpCircle, sub: '7 Intent Clusters' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 flex items-center justify-center font-bold text-slate-950 shadow-sm text-lg tracking-tight">
              NB
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-tight text-white text-base sm:text-lg">NutriBharat</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-medium px-2 py-0.5 rounded border border-emerald-500/30">
                  Nutrition App
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                India-Focused Nutrition, Calorie Tracker & Diet Planning
              </p>
            </div>
          </div>

          {/* Persistent Diet Preference Toggle in Navbar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onToggleDietPreference && (
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 shadow-inner">
                <button
                  type="button"
                  onClick={() => onToggleDietPreference('vegetarian')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                    dietPreference === 'vegetarian'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Switch to Vegetarian Mode"
                >
                  <span>🌱</span>
                  <span className="hidden sm:inline">Vegetarian</span>
                  <span className="sm:hidden">Veg</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleDietPreference('non-vegetarian')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                    dietPreference === 'non-vegetarian'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Switch to Non-Vegetarian Mode"
                >
                  <span>🍗</span>
                  <span className="hidden sm:inline">Non-Veg</span>
                  <span className="sm:hidden">Non-Veg</span>
                </button>
              </div>
            )}

            {/* ICMR Standard Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>ICMR-NIN 2024 & IFCT 2017</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 overflow-x-auto scrollbar-none py-1.5 -mb-px border-t border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
