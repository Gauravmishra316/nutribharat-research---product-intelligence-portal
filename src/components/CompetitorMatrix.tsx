import React, { useState } from 'react';
import { COMPETITORS_LIST, CompetitorData } from '../data/researchData';
import { Check, X, ShieldAlert, Zap, TrendingUp, DollarSign } from 'lucide-react';

export const CompetitorMatrix: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<string>(COMPETITORS_LIST[0].name);

  const activeComp = COMPETITORS_LIST.find((c) => c.name === selectedComp) || COMPETITORS_LIST[0];

  const marketGaps = [
    {
      title: '1. The "Family Pot" Conflict',
      evidence: 'r/Fitness_India top threads: Mothers get offended when users weigh dry ingredients before cooking for a family of 5.',
      competitorStatus: 'Fittr and Cronometer mandate gram weighing. Zero support for shared kadhai batches.',
      solution: 'NutriBharat Family Batch Estimator: splits raw pot ingredients into standard katori servings.',
    },
    {
      title: '2. Katori Measurement Ambiguity',
      evidence: 'Stainless steel katoris in Indian homes vary from 120ml to 250ml (up to ±180 kcal variance per meal).',
      competitorStatus: 'MyFitnessPal and Lose It! force "cups" or opaque hardcoded "1 serving" multipliers.',
      solution: '3-tier visual katori calibration (Small 120ml, Medium 180ml, Large 250ml) with liquid density guides.',
    },
    {
      title: '3. Invisible Cooking Fat (The Sneaky Tadka)',
      evidence: 'ICMR-NIN 2024: Invisible discretionary fat adds 30–50% of total daily energy in urban Indian diets.',
      competitorStatus: 'Apps assume fixed minimal oil; users under-report 200–400 kcal of mustard oil and desi ghee daily.',
      solution: '1-tap "Ghee & Tadka Dial" on every cooked Indian item (dry, 1 tsp ghee, heavy dhaba tadka).',
    },
    {
      title: '4. Logging Friction Fatigue',
      evidence: '62% of calorie app users churn in 14 days due to the 18-tap per meal barrier (Mobile Health Report 2024).',
      competitorStatus: 'Healthify and MyFitnessPal require separate search queries for roti, dal, sabzi, curd, and salad.',
      solution: 'Natural-language sentence logging parses entire lunch plates in <15 seconds.',
    },
    {
      title: '5. The "Dal as Protein" Fallacy',
      evidence: 'Common dilemma: Eating 10 bowls of dal to hit 70g protein floods the body with 2,000 kcal of carbs.',
      competitorStatus: 'Apps treat protein passively without distinguishing low-density sources from high-density anchors.',
      solution: 'Indian Protein-to-Calorie Density Ratio highlighting soya chunks, low-fat paneer, and egg whites.',
    },
    {
      title: '6. Predatory Human Coaching Sales',
      evidence: 'Over 1,200 complaints on consumer grievance portals about aggressive telemarketing calls from Healthify.',
      competitorStatus: 'Healthify & Fittr prioritize high-ticket coach sales (₹1,200–₹5,000/mo) over software utility.',
      solution: 'NutriBharat Pro: Honest, self-contained software utility at ₹999/year via UPI. Zero telemarketing calls.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <span>Phase 4 & 5 Synthesis · Competitor Benchmarking & Unserved Gaps</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Competitor Landscape & Market Vulnerability Matrix
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Detailed comparison of Indian market leaders (Healthify, Fittr) and global tracking suites (MyFitnessPal, MacroFactor, Cronometer) across pricing, data integrity, and local kitchen compatibility.
        </p>
      </div>

      {/* Competitor Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {COMPETITORS_LIST.map((comp) => {
          const isSelected = comp.name === selectedComp;
          return (
            <button
              key={comp.name}
              onClick={() => setSelectedComp(comp.name)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[10px] font-bold block mb-1 ${isSelected ? 'text-emerald-400' : 'text-slate-600 font-semibold'}`}>
                {comp.badge}
              </span>
              <h3 className="font-bold text-xs sm:text-sm truncate">{comp.name}</h3>
              <span className={`text-[11px] block mt-1 truncate ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                {comp.pricingIndia.split('|')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Competitor Deep Dive */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">{activeComp.name}</h2>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                {activeComp.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Target Audience: {activeComp.targetUser}</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Pricing in India</span>
            <span className="text-sm font-bold font-mono text-emerald-800">{activeComp.pricingIndia}</span>
            <span className="text-[10px] text-slate-400 block">Global: {activeComp.pricingGlobal}</span>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-500 block">Food Database Integrity</span>
            <span className="font-bold text-slate-900 mt-1 block">{activeComp.databaseScore}</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-500 block">Indian Food & Katori Support</span>
            <span className="font-bold text-slate-900 mt-1 block">{activeComp.indianCoverage}</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-500 block">AI & Logging Technology</span>
            <span className="font-bold text-slate-900 mt-1 block">{activeComp.aiLogging}</span>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/80 space-y-2">
            <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Documented Strengths</span>
            </span>
            <ul className="space-y-1 text-emerald-900 list-disc pl-4">
              {activeComp.strengths.map((str, i) => (
                <li key={i}>{str}</li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200/80 space-y-2">
            <span className="font-bold text-rose-900 flex items-center space-x-1.5">
              <X className="w-4 h-4 text-rose-600" />
              <span>Critical Weaknesses & Churn Drivers</span>
            </span>
            <ul className="space-y-1 text-rose-900 list-disc pl-4">
              {activeComp.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* The 6 Market Gaps Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">The 6 Underserved Indian Market Gaps (Phase 5 Evidence)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketGaps.map((gap, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">{gap.title}</h3>

              <div className="space-y-2 text-xs">
                <div className="text-slate-600">
                  <strong className="text-slate-800">User Pain Evidence: </strong>
                  {gap.evidence}
                </div>
                <div className="text-rose-700 bg-rose-50/50 p-2 rounded border border-rose-100">
                  <strong>Competitor Flaw: </strong>
                  {gap.competitorStatus}
                </div>
                <div className="text-emerald-800 bg-emerald-50/60 p-2 rounded border border-emerald-200">
                  <strong>NutriBharat Solution: </strong>
                  {gap.solution}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
