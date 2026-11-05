import React, { useState } from 'react';
import { UserCalculatorProfile } from '../data/researchData';
import { Calculator, Flame, Activity, ShieldCheck, Heart, AlertCircle, Scale, Droplet, ArrowRight, Utensils, Check, Sparkles, Dumbbell } from 'lucide-react';

interface CalculatorWorkbenchProps {
  profile: UserCalculatorProfile;
  onUpdateProfile: (updates: Partial<UserCalculatorProfile>) => void;
}

export const CalculatorWorkbench: React.FC<CalculatorWorkbenchProps> = ({ profile, onUpdateProfile }) => {
  const [activeTool, setActiveTool] = useState<
    'tdee-bmr' | 'deficit' | 'protein' | 'bmi-asian' | 'katori' | 'ghee' | 'steps'
  >('tdee-bmr');

  // Deconstruct persistent profile
  const {
    gender,
    age,
    weightKg,
    heightCm,
    activityTier,
    deficitPercent,
    fitnessGoal,
    dietPreference,
    katoriFood,
    katoriSize,
    gheeSpoons,
    dailySteps,
  } = profile;

  // 1. Mifflin-St Jeor BMR calculation
  const bmr =
    gender === 'male'
      ? Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5)
      : Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);

  // ICMR-NIN 2024 Reference Energy Requirements (Reference Indian Man 65kg / Woman 55kg)
  const icmrReferenceBmr = gender === 'male' ? 2110 : 1660;

  // TDEE
  const tdee = Math.round(bmr * activityTier);

  // Deficit
  const rawDeficitCalories = Math.round(tdee * (1 - deficitPercent / 100));
  const floorLimit = gender === 'male' ? 1500 : 1200;
  const isBelowFloor = rawDeficitCalories < floorLimit;
  const safeDeficitCalories = Math.max(rawDeficitCalories, floorLimit);
  const weeklyLossKg = ((tdee - safeDeficitCalories) * 7 / 7700).toFixed(2);

  // 5. Protein targets influenced by dietPreference & fitnessGoal
  const isVeg = dietPreference === 'vegetarian';
  let proteinMultiplier: number;
  let standardOmnivoreMultiplier: number;

  if (fitnessGoal === 'general') {
    // ICMR RDA: 0.83 g/kg for complete animal protein;
    // Vegetarian requires ~1.0 g/kg (+20%) to account for lower plant PDCAAS and digestibility
    proteinMultiplier = isVeg ? 1.0 : 0.83;
    standardOmnivoreMultiplier = 0.83;
  } else if (fitnessGoal === 'active') {
    // Active/Fat loss: 1.2 g/kg omnivore; 1.35 g/kg vegetarian to hit leucine threshold
    proteinMultiplier = isVeg ? 1.35 : 1.2;
    standardOmnivoreMultiplier = 1.2;
  } else {
    // Hypertrophy/Strength: 1.6 g/kg omnivore; 1.8 g/kg vegetarian
    proteinMultiplier = isVeg ? 1.8 : 1.6;
    standardOmnivoreMultiplier = 1.6;
  }

  const targetProteinGrams = Math.round(weightKg * proteinMultiplier);
  const omnivoreReferenceGrams = Math.round(weightKg * standardOmnivoreMultiplier);
  const bioBufferGrams = isVeg ? targetProteinGrams - omnivoreReferenceGrams : 0;

  // Asian BMI (WHO Asia-Pacific guidelines)
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  let bmiCategory = 'Normal Weight';
  let bmiColor = 'text-emerald-700 bg-emerald-100';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-amber-800 bg-amber-100';
  } else if (bmi >= 23.0 && bmi < 25.0) {
    bmiCategory = 'Overweight (Asian Cutoff)';
    bmiColor = 'text-orange-800 bg-orange-100';
  } else if (bmi >= 25.0) {
    bmiCategory = 'Obese (Asian Cutoff)';
    bmiColor = 'text-rose-800 bg-rose-100';
  }

  // Katori converter map
  const katoriDensityMap = {
    dal: { small: { g: 120, kcal: 103 }, medium: { g: 180, kcal: 155 }, large: { g: 250, kcal: 215 } },
    rice: { small: { g: 100, kcal: 130 }, medium: { g: 150, kcal: 195 }, large: { g: 210, kcal: 273 } },
    curd: { small: { g: 100, kcal: 60 }, medium: { g: 150, kcal: 90 }, large: { g: 200, kcal: 120 } },
    sabzi: { small: { g: 90, kcal: 95 }, medium: { g: 140, kcal: 150 }, large: { g: 200, kcal: 210 } },
  };
  const selectedKatoriResult = katoriDensityMap[katoriFood][katoriSize];

  // Ghee impact
  const gheeCaloriesAdded = gheeSpoons * 45;
  const gheeFatAdded = gheeSpoons * 5;

  // Steps burned
  const stepsBurned = Math.round(dailySteps * 0.038 * (weightKg / 65));
  const conservativeEatbackAllowance = Math.round(stepsBurned * 0.5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>ICMR-NIN 2024 Physiological Engine · Persistent User State Active</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          12 Indian Nutrition & Physiological Calculators
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Your physiological inputs are stored persistently throughout the portal. Grounded in ICMR-NIN norms and Asian WHO BMI thresholds.
        </p>
      </div>

      {/* Persistent Profile Indicator Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-3 px-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">Active Profile:</span>
          <span className="text-emerald-400 font-mono font-bold capitalize">{gender}</span>
          <span className="text-slate-500">·</span>
          <span className="text-white font-mono">{age} yrs</span>
          <span className="text-slate-500">·</span>
          <span className="text-white font-mono font-bold">{weightKg} kg</span>
          <span className="text-slate-500">·</span>
          <span className="text-white font-mono">{heightCm} cm</span>
          <span className="text-slate-500">·</span>
          <span className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-medium border border-slate-700 capitalize">
            {dietPreference === 'vegetarian' ? '🌱 Vegetarian' : '🍗 Non-Vegetarian'}
          </span>
        </div>
        <div className="text-slate-400 text-[11px]">
          TDEE: <strong className="text-emerald-400 font-mono">{tdee} kcal</strong> · Safe Deficit: <strong className="text-amber-400 font-mono">{safeDeficitCalories} kcal</strong>
        </div>
      </div>

      {/* Tool Switcher Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none border-b border-slate-200">
        {[
          { id: 'tdee-bmr', label: '1. TDEE & BMR (ICMR)' },
          { id: 'deficit', label: '2. Safe Deficit Planner' },
          { id: 'protein', label: '3. Indian Protein (Veg / Non-Veg)' },
          { id: 'bmi-asian', label: '4. Asian-Specific BMI' },
          { id: 'katori', label: '5. Katori-to-Gram Utility' },
          { id: 'ghee', label: '6. Hidden Tadka & Ghee' },
          { id: 'steps', label: '7. Steps-to-Calories' },
        ].map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              activeTool === tool.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* Calculator Grid: Profile Parameters (Left) + Calculation Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Profile Input Fields (Persistent) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>Physiological Inputs</span>
              </h3>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                Synced Everywhere
              </span>
            </div>

            {/* Gender Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Biological Sex (for BMR Math)</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateProfile({ gender: 'male' })}
                  className={`py-2 text-xs font-bold rounded-lg border transition ${
                    gender === 'male' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Male (पुरुष)
                </button>
                <button
                  onClick={() => onUpdateProfile({ gender: 'female' })}
                  className={`py-2 text-xs font-bold rounded-lg border transition ${
                    gender === 'female' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Female (महिला)
                </button>
              </div>
            </div>

            {/* Dietary Preference (Veg / Non-Veg) */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Dietary Preference</span>
                <span className="text-[10px] text-slate-500 font-normal">Customizes Protein & Food Advice</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateProfile({ dietPreference: 'vegetarian' })}
                  className={`py-2 text-xs font-bold rounded-lg border transition flex items-center justify-center space-x-1.5 ${
                    dietPreference === 'vegetarian'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>🌱 Vegetarian (शाकाहारी)</span>
                </button>
                <button
                  onClick={() => onUpdateProfile({ dietPreference: 'non-vegetarian' })}
                  className={`py-2 text-xs font-bold rounded-lg border transition flex items-center justify-center space-x-1.5 ${
                    dietPreference === 'non-vegetarian'
                      ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>🍗 Non-Veg (मांसाहारी)</span>
                </button>
              </div>
            </div>

            {/* Age & Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Age (Years)</label>
                <input
                  type="number"
                  min={14}
                  max={95}
                  value={age}
                  onChange={(e) => onUpdateProfile({ age: Number(e.target.value) || 28 })}
                  className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Weight (kg)</label>
                <input
                  type="number"
                  min={35}
                  max={200}
                  value={weightKg}
                  onChange={(e) => onUpdateProfile({ weightKg: Number(e.target.value) || 70 })}
                  className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Height */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Height (cm)</label>
              <input
                type="number"
                min={120}
                max={230}
                value={heightCm}
                onChange={(e) => onUpdateProfile({ heightCm: Number(e.target.value) || 172 })}
                className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[11px] text-slate-500 block">
                ≈ {Math.floor(heightCm / 30.48)} ft {Math.round((heightCm % 30.48) / 2.54)} in
              </span>
            </div>

            {/* Physical Activity Tier */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Daily Physical Activity</label>
              <select
                value={activityTier}
                onChange={(e) => onUpdateProfile({ activityTier: Number(e.target.value) })}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                <option value={1.2}>Sedentary (Desk Job, &lt;4,000 steps)</option>
                <option value={1.375}>Light Active (1-3 days gym or 6k-8k steps)</option>
                <option value={1.55}>Moderately Active (3-5 days workout / brisk walk)</option>
                <option value={1.725}>Very Active (Daily intense training / physical work)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Active Calculator Results */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tool 1: TDEE & BMR */}
          {activeTool === 'tdee-bmr' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Energy Expenditure Analysis
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">TDEE & Basal Metabolic Rate</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 text-white p-5 rounded-2xl">
                  <span className="text-xs text-slate-400 block">Maintenance Calories (TDEE)</span>
                  <span className="text-3xl font-bold font-mono text-emerald-400 mt-1 block">{tdee} kcal</span>
                  <span className="text-xs text-slate-400 mt-2 block leading-snug">
                    To maintain current weight of {weightKg} kg with your activity multiplier ({activityTier}x).
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                  <span className="text-xs text-slate-500 block">Basal Metabolic Rate (BMR)</span>
                  <span className="text-3xl font-bold font-mono text-slate-900 mt-1 block">{bmr} kcal</span>
                  <span className="text-xs text-slate-500 mt-2 block leading-snug">
                    Calories burned completely at rest (sleeping/breathing alone) via Mifflin-St Jeor.
                  </span>
                </div>
              </div>

              {/* ICMR Benchmark Card */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs space-y-1.5">
                <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ICMR-NIN 2024 Reference Comparison</span>
                </div>
                <p className="text-emerald-900 leading-relaxed">
                  For an Indian Reference {gender === 'male' ? 'Man (65 kg)' : 'Woman (55 kg)'}, the official ICMR estimated sedentary energy requirement is <strong>{icmrReferenceBmr} kcal/day</strong>. Your calculated TDEE of <strong>{tdee} kcal</strong> reflects your specific weight ({weightKg} kg) and height.
                </p>
              </div>
            </div>
          )}

          {/* Tool 2: Calorie Deficit Planner */}
          {activeTool === 'deficit' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Fat Loss Strategy
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">Calorie Deficit Target Generator</h2>
              </div>

              {/* Deficit Percentage Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Deficit Intensity:</span>
                  <span className="font-mono text-emerald-800 text-sm">
                    {deficitPercent}% Deficit (-{Math.round(tdee * (deficitPercent / 100))} kcal)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => onUpdateProfile({ deficitPercent: 15 })}
                    className={`py-2 rounded-lg font-bold border transition ${
                      deficitPercent === 15 ? 'bg-emerald-700 text-white' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Gentle (15%)
                  </button>
                  <button
                    onClick={() => onUpdateProfile({ deficitPercent: 20 })}
                    className={`py-2 rounded-lg font-bold border transition ${
                      deficitPercent === 20 ? 'bg-emerald-700 text-white' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Standard (20%)
                  </button>
                  <button
                    onClick={() => onUpdateProfile({ deficitPercent: 25 })}
                    className={`py-2 rounded-lg font-bold border transition ${
                      deficitPercent === 25 ? 'bg-emerald-700 text-white' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Aggressive (25%)
                  </button>
                </div>
              </div>

              {/* Target Display */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl">
                <span className="text-xs text-slate-400 block">Recommended Daily Caloric Target</span>
                <span className="text-4xl font-bold font-mono text-emerald-400 mt-1 block">
                  {safeDeficitCalories} kcal / day
                </span>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block">Target Fat Loss</span>
                    <span className="font-bold text-white text-sm">~{weeklyLossKg} kg / week</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">4-Week Projection</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      ~{(Number(weeklyLossKg) * 4).toFixed(1)} kg lost
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety Floor Guardrail Alert */}
              {isBelowFloor && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">ICMR-NIN Safety Floor Enforcement Active</span>
                    <p className="mt-0.5">
                      Your chosen deficit mathematically drops below {floorLimit} kcal/day. NutriBharat programmatically clamps your intake to the safe physiological minimum to prevent acute hormonal disruption and gallstone formation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tool 3: Indian Protein Target (Veg / Non-Veg Options) */}
          {activeTool === 'protein' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                    Macronutrient Optimization
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">Indian Protein Requirement Engine</h2>
                </div>

                {/* Direct Veg / Non-Veg Switcher */}
                <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => onUpdateProfile({ dietPreference: 'vegetarian' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                      dietPreference === 'vegetarian'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🌱 Vegetarian</span>
                  </button>
                  <button
                    onClick={() => onUpdateProfile({ dietPreference: 'non-vegetarian' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                      dietPreference === 'non-vegetarian'
                        ? 'bg-rose-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🍗 Non-Veg</span>
                  </button>
                </div>
              </div>

              {/* Goal Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Fitness & Training Intensity</label>
                  <span className="text-[11px] font-mono text-emerald-800 font-bold">
                    Active Multiplier: {proteinMultiplier}g / kg
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => onUpdateProfile({ fitnessGoal: 'general' })}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      fitnessGoal === 'general' ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold block text-slate-900">Baseline Maintenance</span>
                    <span className="text-[10px] text-slate-500">
                      {isVeg ? '1.00g / kg (Veg Buffer)' : '0.83g / kg (ICMR RDA)'}
                    </span>
                  </button>
                  <button
                    onClick={() => onUpdateProfile({ fitnessGoal: 'active' })}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      fitnessGoal === 'active' ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold block text-slate-900">Active / Fat Loss</span>
                    <span className="text-[10px] text-slate-500">
                      {isVeg ? '1.35g / kg (Leucine Buffer)' : '1.20g / kg (Lean Mass)'}
                    </span>
                  </button>
                  <button
                    onClick={() => onUpdateProfile({ fitnessGoal: 'hypertrophy' })}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      fitnessGoal === 'hypertrophy' ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold block text-slate-900">Gym Hypertrophy</span>
                    <span className="text-[10px] text-slate-500">
                      {isVeg ? '1.80g / kg (Plant MPS)' : '1.60g / kg (Optimal MPS)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Target Protein Output */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 block">Personalized Daily Target Protein</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded font-bold border ${
                    isVeg
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-rose-950 text-rose-300 border-rose-700'
                  }`}>
                    {isVeg ? '🌱 Vegetarian Recommended' : '🍗 Non-Vegetarian Standard'}
                  </span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-bold font-mono text-emerald-400">
                    {targetProteinGrams} grams / day
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    ({proteinMultiplier}g per kg of {weightKg}kg bodyweight)
                  </span>
                </div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800 flex items-center justify-between">
                  <span>Provides <strong>{targetProteinGrams * 4} kcal</strong> from protein</span>
                  <span>~<strong>{Math.round(((targetProteinGrams * 4) / tdee) * 100)}%</strong> of your {tdee} kcal TDEE</span>
                </div>
              </div>

              {/* SCIENTIFIC BIOAVAILABILITY & QUALITY CALLOUT */}
              {isVeg ? (
                <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Vegetarian Bioavailability & PDCAAS Adjustment Active (+{bioBufferGrams}g/day):</span>
                  </div>
                  <p className="leading-relaxed text-emerald-900">
                    Plant proteins (dals, legumes, and grains) have lower digestibility (PDCAAS 0.60–0.75) and higher phytate content. To achieve equivalent net muscle protein synthesis and supply sufficient essential leucine (2.5g/meal) without animal sources, your target is calibrated at <strong>{proteinMultiplier}g/kg</strong> (vs {standardOmnivoreMultiplier}g/kg standard non-veg), providing a <strong>+{bioBufferGrams}g daily safety buffer</strong>.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-rose-50/80 rounded-xl border border-rose-200 text-xs text-rose-950 space-y-1.5">
                  <div className="flex items-center space-x-1.5 font-bold text-rose-900">
                    <Dumbbell className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>Complete Animal Protein Standard (PDCAAS = 1.0):</span>
                  </div>
                  <p className="leading-relaxed text-rose-900">
                    Animal protein sources (skinless poultry, eggs, fish) provide all 9 essential amino acids with &gt;95% bioavailability. At <strong>{proteinMultiplier}g/kg</strong> ({targetProteinGrams}g/day), your muscle protein synthesis (MPS) trigger is achieved without needing plant digestibility buffers.
                  </p>
                </div>
              )}

              {/* Sample 4-Meal Daily Distribution Plan */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Recommended 4-Meal Daily Distribution ({isVeg ? '🌱 Vegetarian' : '🍗 Non-Vegetarian'})
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">Total: {targetProteinGrams}g</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {isVeg ? (
                    <>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>🌅 Breakfast (~{Math.round(targetProteinGrams * 0.25)}g)</span>
                          <span className="text-emerald-700 font-mono">22g - 25g</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Sattu drink (40g) OR 100g low-fat paneer cubes with black pepper.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>☀️ Lunch (~{Math.round(targetProteinGrams * 0.30)}g)</span>
                          <span className="text-emerald-700 font-mono">28g - 32g</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          1.5 katori Dal Tadka (15g P) + 2 Whole wheat rotis (6g P) + 150g Dahi (7g P).
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>🍵 Evening Snack (~{Math.round(targetProteinGrams * 0.15)}g)</span>
                          <span className="text-emerald-700 font-mono">12g - 15g</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          50g Roasted Chana (10g P) + 1 glass spiced buttermilk / chaas (3g P).
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>🌙 Dinner (~{Math.round(targetProteinGrams * 0.30)}g)</span>
                          <span className="text-emerald-700 font-mono">28g - 32g</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          50g dry Soya chunks sabzi (26g P) + green cucumber-tomato salad + 1 roti.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>🌅 Breakfast (~{Math.round(targetProteinGrams * 0.25)}g)</span>
                          <span className="text-emerald-700 font-mono">24g - 26g</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          3 Whole boiled eggs + 2 egg whites OR Egg Bhurji with 1 whole wheat toast.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>☀️ Lunch (~{Math.round(targetProteinGrams * 0.35)}g)</span>
                          <span className="text-emerald-700 font-mono">32g - 36g</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          150g Home chicken curry or Rohu fish fillet (28g P) + 2 Rotis + Salad.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>🍵 Evening Snack (~{Math.round(targetProteinGrams * 0.12)}g)</span>
                          <span className="text-emerald-700 font-mono">10g - 14g</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          2 Boiled egg whites (7g P) OR 1 glass fresh chaas with roasted peanuts.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>🌙 Dinner (~{Math.round(targetProteinGrams * 0.28)}g)</span>
                          <span className="text-emerald-700 font-mono">28g - 32g</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          120g Grilled chicken breast (30g P) + steamed vegetable sabzi + 1 roti.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* DYNAMIC: VEGETARIAN VS NON-VEGETARIAN RECOMMENDATIONS */}
              {dietPreference === 'vegetarian' ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Vegetarian High-Protein Sources & Complementary Blends (IFCT 2017):</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Soya Chunks (Nutrela)</span>
                        <span className="text-[11px] text-slate-500">50g dry (cooks to 150g bowl) · 172 kcal</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">26g Protein</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Low-Fat / Toned Milk Paneer</span>
                        <span className="text-[11px] text-slate-500">150g raw/cooked · 270 kcal · Low carb</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">33g Protein</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Yellow Dal + 2 Whole Wheat Rotis</span>
                        <span className="text-[11px] text-slate-500">1 katori dal (180g) + 2 phulkas · Cereal-pulse blend</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">14.2g Protein</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Fresh Curd / Greek Dahi</span>
                        <span className="text-[11px] text-slate-500">150g serving · 90 kcal · Gut probiotic</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">5g – 10g Protein</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Roasted Chana / Sattu Drink</span>
                        <span className="text-[11px] text-slate-500">40g sattu in chilled water with jeera · 160 kcal</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">10g Protein</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    <strong>Vegetarian Rule of Thumb:</strong> Regular full-cream paneer has 23g fat per 100g. If fat loss is your goal, prefer <em>low-fat paneer</em> or <em>soya chunks</em> to avoid exceeding your fat budget while hitting {targetProteinGrams}g protein.
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold text-rose-900 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                    <Dumbbell className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Non-Vegetarian Lean Protein Benchmarks (IFCT 2017):</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Skinless Chicken Breast</span>
                        <span className="text-[11px] text-slate-500">150g cooked · 180 kcal · Ultra lean</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">37.5g Protein</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">3 Boiled Whole Eggs + 2 Egg Whites</span>
                        <span className="text-[11px] text-slate-500">5 eggs total (edible portion) · 256 kcal</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">26.1g Protein</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Fish Curry (Rohu / Katla / Tilapia)</span>
                        <span className="text-[11px] text-slate-500">150g fish fillet · 165 kcal · Rich in Omega-3</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">28g Protein</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Home Chicken Curry (with gravy)</span>
                        <span className="text-[11px] text-slate-500">1 katori (180g) · 240 kcal</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">23.5g Protein</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Egg Bhurji (2 Whole Eggs)</span>
                        <span className="text-[11px] text-slate-500">1 plate (120g) · 195 kcal</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm">13.5g Protein</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                    <strong>Non-Veg Advantage:</strong> Animal proteins (chicken, fish, eggs) contain all 9 essential amino acids in optimal ratios with very high bio-availability (PDCAAS = 1.0). Pair with Indian roti and salad for complete fiber balance.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tool 4: Asian BMI */}
          {activeTool === 'bmi-asian' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Clinical Screening
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">WHO Asia-Pacific BMI Evaluation</h2>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Your Calculated BMI</span>
                  <span className="text-4xl font-bold font-mono text-emerald-400 mt-1 block">{bmi} kg/m²</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${bmiColor}`}>
                    {bmiCategory}
                  </span>
                </div>
              </div>

              {/* Asian Cutoffs Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  WHO Asia-Pacific & ICMR Cutoffs (Lower than Western standards):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Underweight</span>
                    <span className="font-bold text-slate-800">&lt; 18.5</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="text-emerald-700 block text-[10px]">Normal</span>
                    <span className="font-bold text-emerald-900">18.5 – 22.9</span>
                  </div>
                  <div className="p-2.5 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-orange-700 block text-[10px]">Overweight</span>
                    <span className="font-bold text-orange-900">23.0 – 24.9</span>
                  </div>
                  <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200">
                    <span className="text-rose-700 block text-[10px]">Obese</span>
                    <span className="font-bold text-rose-900">&ge; 25.0</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  *Indians exhibit higher percentage body fat and central adiposity at any given BMI compared to Caucasians, which is why clinical risk benchmarks trigger at 23.0 instead of 25.0.
                </p>
              </div>
            </div>
          )}

          {/* Tool 5: Katori Utility */}
          {activeTool === 'katori' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Kitchen Standardizer
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">Katori-to-Gram Volume Converter</h2>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Select Dish Type</label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'dal', label: 'Cooked Dal' },
                    { id: 'rice', label: 'Cooked Rice' },
                    { id: 'curd', label: 'Curd / Dahi' },
                    { id: 'sabzi', label: 'Dry Sabzi' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => onUpdateProfile({ katoriFood: d.id as any })}
                      className={`py-2 rounded-lg font-bold border transition ${
                        katoriFood === d.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Select Katori Size</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => onUpdateProfile({ katoriSize: 'small' })}
                    className={`p-3 rounded-xl border text-center transition ${
                      katoriSize === 'small' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-400' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="font-bold block text-slate-900">Small (Chhoti)</span>
                    <span className="text-[11px] text-slate-500">120 ml capacity</span>
                  </button>
                  <button
                    onClick={() => onUpdateProfile({ katoriSize: 'medium' })}
                    className={`p-3 rounded-xl border text-center transition ${
                      katoriSize === 'medium' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-400' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="font-bold block text-slate-900">Standard (Medium)</span>
                    <span className="text-[11px] text-slate-500">180 ml capacity</span>
                  </button>
                  <button
                    onClick={() => onUpdateProfile({ katoriSize: 'large' })}
                    className={`p-3 rounded-xl border text-center transition ${
                      katoriSize === 'large' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-400' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="font-bold block text-slate-900">Large (Thali Bowl)</span>
                    <span className="text-[11px] text-slate-500">250 ml capacity</span>
                  </button>
                </div>
              </div>

              {/* Conversion Output */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Calculated Net Weight</span>
                  <span className="text-3xl font-bold font-mono text-emerald-400 mt-1 block">
                    {selectedKatoriResult.g} grams
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Estimated Energy</span>
                  <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
                    {selectedKatoriResult.kcal} kcal
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tool 6: Ghee & Oil Estimator */}
          {activeTool === 'ghee' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  The Sneaky Tadka Trap
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">Cooking Oil & Ghee Impact Calculator</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Daily Discretionary Cooking Fat Added:</span>
                  <span className="font-mono text-amber-800 text-sm">{gheeSpoons} Teaspoons ({gheeSpoons * 5}g)</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={gheeSpoons}
                  onChange={(e) => onUpdateProfile({ gheeSpoons: Number(e.target.value) })}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 tsp (Light)</span>
                  <span>3 tsp (Normal Indian Home)</span>
                  <span>6 tsp (Heavy Restaurant / Dhaba)</span>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-2xl grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Hidden Daily Calories</span>
                  <span className="text-3xl font-bold font-mono text-rose-400 mt-1 block">
                    +{gheeCaloriesAdded} kcal
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Pure Fat Intake</span>
                  <span className="text-3xl font-bold font-mono text-amber-400 mt-1 block">
                    +{gheeFatAdded}g fat
                  </span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Why Weight Loss Stalls:</strong> An extra 2 tablespoons of oil or ghee across lunch and dinner adds ~270 kcal daily—enough to completely erase a 20% calorie deficit without the user ever eating junk food!
              </div>
            </div>
          )}

          {/* Tool 7: Steps to Calories */}
          {activeTool === 'steps' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  NEAT Activity Estimator
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">Steps-to-Calories Burned Calculator</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Daily Step Count:</span>
                  <span className="font-mono text-emerald-800 text-sm">{dailySteps.toLocaleString()} steps</span>
                </div>
                <input
                  type="range"
                  min={3000}
                  max={20000}
                  step={500}
                  value={dailySteps}
                  onChange={(e) => onUpdateProfile({ dailySteps: Number(e.target.value) })}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 text-white p-5 rounded-2xl">
                  <span className="text-xs text-slate-400 block">Estimated Active Burn</span>
                  <span className="text-3xl font-bold font-mono text-emerald-400 mt-1 block">
                    ~{stepsBurned} kcal
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Distance: ~{((dailySteps * 0.75) / 1000).toFixed(1)} km
                  </span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                  <span className="text-xs text-emerald-800 font-semibold block">Safe Re-Feed Allowance</span>
                  <span className="text-3xl font-bold font-mono text-emerald-900 mt-1 block">
                    +{conservativeEatbackAllowance} kcal
                  </span>
                  <span className="text-[10px] text-emerald-700 mt-1 block">
                    Capped at 50% to prevent tracker over-reporting error.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
