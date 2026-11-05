import React, { useState } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { FoodDatabase } from './components/FoodDatabase';
import { NaturalLanguageLogger } from './components/NaturalLanguageLogger';
import { CalculatorWorkbench } from './components/CalculatorWorkbench';
import { QuestionExplorer } from './components/QuestionExplorer';
import { UserCalculatorProfile, DEFAULT_CALCULATOR_PROFILE } from './data/researchData';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('food-db');

  // Persistent User Profile State (Stored in localStorage and synced across all tools)
  const [profile, setProfile] = useState<UserCalculatorProfile>(() => {
    try {
      const saved = localStorage.getItem('nutribharat_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CALCULATOR_PROFILE;
  });

  const handleUpdateProfile = (updates: Partial<UserCalculatorProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('nutribharat_user_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation with Persistent Diet Preference Toggle */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dietPreference={profile.dietPreference}
        onToggleDietPreference={(preference) => handleUpdateProfile({ dietPreference: preference })}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'food-db' && (
          <FoodDatabase
            userProfile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
        {activeTab === 'calculators' && (
          <CalculatorWorkbench
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
        {activeTab === 'nlp-logger' && <NaturalLanguageLogger />}
        {activeTab === 'questions' && <QuestionExplorer />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm">NutriBharat Nutrition Suite</span>
                <span className="text-[11px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                  ICMR-NIN & IFCT 2017
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded font-bold border ${
                  profile.dietPreference === 'vegetarian'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border-rose-800'
                }`}>
                  {profile.dietPreference === 'vegetarian' ? '🌱 Veg Mode' : '🍗 Non-Veg Mode'}
                </span>
              </div>
              <p className="text-slate-400 mt-1 max-w-xl text-[11px]">
                Personalized nutrition, calorie-tracking, and diet-planning engine tailored to Indian culinary habits with grams, pieces, and katori calibrations.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-slate-400 text-xs">
              <button onClick={() => setActiveTab('food-db')} className="hover:text-white transition">IFCT Food DB & Meal Plate</button>
              <button onClick={() => setActiveTab('calculators')} className="hover:text-white transition">12 Calculators</button>
              <button onClick={() => setActiveTab('nlp-logger')} className="hover:text-white transition">NLP Logger</button>
              <button onClick={() => setActiveTab('questions')} className="hover:text-white transition">100+ User Questions</button>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>
                Scientific Reference: ICMR-NIN 2024 Dietary Guidelines · IFCT 2017 (NIN Hyderabad) · WHO Asia-Pacific BMI Guidelines
              </span>
            </div>
            <span>September 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
