import React, { useState } from 'react';
import { Sparkles, MessageSquare, Check, RefreshCw, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ParsedItem {
  id: string;
  name: string;
  matchedPortion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidence: number;
  cookingNote: string;
}

export const NaturalLanguageLogger: React.FC = () => {
  const defaultPrompt = 'I ate 2 rotis, one bowl dal, paneer sabzi and a glass of chaas';

  const [inputPrompt, setInputPrompt] = useState<string>(defaultPrompt);
  const [includeGhee, setIncludeGhee] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasParsed, setHasParsed] = useState<boolean>(true);

  // Preset scenarios
  const presets = [
    { label: 'Phase 6 Benchmark', text: 'I ate 2 rotis, one bowl dal, paneer sabzi and a glass of chaas' },
    { label: 'High-Protein Breakfast', text: 'Ate 1 plate kanda poha, 2 boiled eggs and black coffee' },
    { label: 'South Indian Breakfast', text: 'Had 3 idlis, 1 bowl sambar, 2 tbsp coconut chutney and 1 cup chai' },
    { label: 'Sunday Comfort Lunch', text: '2 rotis with ghee, 1 katori rajma chawal and 1 bowl curd' },
    { label: 'Street Food Cheat Snack', text: '1 aloo samosa with sweet chutney and 1 cup cutting chai' },
  ];

  // Parser heuristic
  const parseMealInput = (text: string): ParsedItem[] => {
    const lower = text.toLowerCase();
    const items: ParsedItem[] = [];

    // 1. Roti detection
    if (lower.includes('roti') || lower.includes('chapati') || lower.includes('phulka')) {
      let count = 1;
      if (lower.includes('2') || lower.includes('two')) count = 2;
      else if (lower.includes('3') || lower.includes('three')) count = 3;
      else if (lower.includes('4') || lower.includes('four')) count = 4;

      const gheeCal = includeGhee ? 45 * count : 0;
      const gheeFat = includeGhee ? 5 * count : 0;

      items.push({
        id: 'roti',
        name: `Whole Wheat Roti (${count} medium)`,
        matchedPortion: `${count} pieces (${count * 35}g dry atta)`,
        calories: 85 * count + gheeCal,
        protein: Number((3.0 * count).toFixed(1)),
        carbs: Number((17.5 * count).toFixed(1)),
        fat: Number((0.4 * count + gheeFat).toFixed(1)),
        fiber: Number((2.1 * count).toFixed(1)),
        confidence: 94,
        cookingNote: includeGhee ? 'Ghee brushed (+45 kcal/roti included)' : 'Dry phulka (no oil/ghee)',
      });
    }

    // 2. Dal detection
    if (lower.includes('dal') || lower.includes('daal') || lower.includes('lentil')) {
      items.push({
        id: 'dal',
        name: 'Yellow Toor Dal Tadka (Cooked)',
        matchedPortion: '1 standard katori (180g)',
        calories: 155,
        protein: 8.2,
        carbs: 22.5,
        fat: 3.8,
        fiber: 4.0,
        confidence: 91,
        cookingNote: 'IFCT standard home tadka (1 tsp mustard oil/ghee)',
      });
    }

    // 3. Paneer Sabzi
    if (lower.includes('paneer')) {
      items.push({
        id: 'paneer-sabzi',
        name: 'Home-Style Paneer Sabzi',
        matchedPortion: '1 medium bowl (150g)',
        calories: 220,
        protein: 9.5,
        carbs: 8.5,
        fat: 16.5,
        fiber: 2.1,
        confidence: 86,
        cookingNote: '~40g paneer cubes in spiced tomato-onion gravy',
      });
    }

    // 4. Chaas
    if (lower.includes('chaas') || lower.includes('buttermilk') || lower.includes('mattha')) {
      items.push({
        id: 'chaas',
        name: 'Salted Buttermilk (Chaas)',
        matchedPortion: '1 tall glass (250 ml)',
        calories: 48,
        protein: 2.2,
        carbs: 3.6,
        fat: 2.0,
        fiber: 0.0,
        confidence: 96,
        cookingNote: 'Diluted curd with jeera and rock salt',
      });
    }

    // 5. Poha
    if (lower.includes('poha')) {
      items.push({
        id: 'poha',
        name: 'Kanda Poha with Peanuts',
        matchedPortion: '1 medium plate (150g)',
        calories: 240,
        protein: 4.5,
        carbs: 38.0,
        fat: 8.0,
        fiber: 2.4,
        confidence: 92,
        cookingNote: 'Prepared with turmeric, mustard seeds & roasted peanuts',
      });
    }

    // 6. Boiled eggs
    if (lower.includes('egg')) {
      let count = 1;
      if (lower.includes('2') || lower.includes('two')) count = 2;
      else if (lower.includes('3') || lower.includes('three')) count = 3;
      items.push({
        id: 'egg',
        name: `Boiled Whole Eggs (${count} large)`,
        matchedPortion: `${count} whole eggs (${count * 50}g)`,
        calories: 74 * count,
        protein: Number((6.3 * count).toFixed(1)),
        carbs: Number((0.4 * count).toFixed(1)),
        fat: Number((5.0 * count).toFixed(1)),
        fiber: 0.0,
        confidence: 98,
        cookingNote: 'Standard Grade A large egg (edible portion)',
      });
    }

    // 7. Idlis
    if (lower.includes('idli') || lower.includes('idlis')) {
      let count = 2;
      if (lower.includes('3') || lower.includes('three')) count = 3;
      else if (lower.includes('4') || lower.includes('four')) count = 4;
      items.push({
        id: 'idli',
        name: `Steamed Idlis (${count} pieces)`,
        matchedPortion: `${count} standard idlis (${count * 45}g)`,
        calories: 65 * count,
        protein: Number((2.1 * count).toFixed(1)),
        carbs: Number((13.5 * count).toFixed(1)),
        fat: Number((0.2 * count).toFixed(1)),
        fiber: Number((0.8 * count).toFixed(1)),
        confidence: 95,
        cookingNote: 'Steamed fermented rice and urad dal batter',
      });
    }

    // 8. Sambar & Chutney
    if (lower.includes('sambar')) {
      items.push({
        id: 'sambar',
        name: 'Vegetable Sambar',
        matchedPortion: '1 medium katori (150g)',
        calories: 95,
        protein: 3.8,
        carbs: 16.0,
        fat: 1.8,
        fiber: 3.2,
        confidence: 90,
        cookingNote: 'Toor dal with drumstick, bottle gourd and tamarind',
      });
    }
    if (lower.includes('chutney')) {
      items.push({
        id: 'chutney',
        name: 'Coconut Chutney (Fresh)',
        matchedPortion: '2 tablespoons (30g)',
        calories: 65,
        protein: 0.9,
        carbs: 2.2,
        fat: 6.0,
        fiber: 1.2,
        confidence: 88,
        cookingNote: 'Grated coconut with mustard seed & curry leaf tadka',
      });
    }

    // 9. Rice / Rajma
    if (lower.includes('rice') || lower.includes('chawal')) {
      items.push({
        id: 'rice',
        name: 'Cooked White Rice',
        matchedPortion: '1 medium katori (150g)',
        calories: 195,
        protein: 3.9,
        carbs: 43.5,
        fat: 0.6,
        fiber: 0.6,
        confidence: 94,
        cookingNote: 'Boiled white polished basmati rice',
      });
    }
    if (lower.includes('rajma')) {
      items.push({
        id: 'rajma',
        name: 'Punjabi Rajma Masala',
        matchedPortion: '1 medium katori (180g)',
        calories: 210,
        protein: 9.2,
        carbs: 29.0,
        fat: 6.2,
        fiber: 7.0,
        confidence: 90,
        cookingNote: 'Kidney beans in thick onion-tomato masala gravy',
      });
    }

    // 10. Samosa & Chai
    if (lower.includes('samosa')) {
      items.push({
        id: 'samosa',
        name: 'Aloo Samosa (Fried)',
        matchedPortion: '1 piece (85g)',
        calories: 285,
        protein: 3.5,
        carbs: 32.0,
        fat: 16.0,
        fiber: 1.8,
        confidence: 92,
        cookingNote: 'Deep-fried maida pastry with spiced potato filling',
      });
    }
    if (lower.includes('chai') || lower.includes('tea')) {
      items.push({
        id: 'chai',
        name: 'Chai (Milk & 2 tsp Sugar)',
        matchedPortion: '1 cup (150 ml)',
        calories: 95,
        protein: 2.5,
        carbs: 14.0,
        fat: 3.2,
        fiber: 0.0,
        confidence: 95,
        cookingNote: 'Includes 40 kcal of refined sugar',
      });
    }
    if (lower.includes('gulab jamun')) {
      items.push({
        id: 'gulab-jamun',
        name: 'Gulab Jamun in Syrup',
        matchedPortion: '1 piece (50g)',
        calories: 185,
        protein: 2.8,
        carbs: 26.0,
        fat: 8.0,
        fiber: 0.2,
        confidence: 94,
        cookingNote: 'Fried khoya ball soaked in 35% sugar syrup',
      });
    }

    // Default fallback if empty
    if (items.length === 0) {
      items.push({
        id: 'custom',
        name: 'Mixed Indian Home Meal',
        matchedPortion: '1 standard plate',
        calories: 450,
        protein: 15.0,
        carbs: 65.0,
        fat: 14.0,
        fiber: 6.0,
        confidence: 70,
        cookingNote: 'General heuristic estimation for mixed Indian plate',
      });
    }

    return items;
  };

  const parsedItems = parseMealInput(inputPrompt);

  const totalCalories = parsedItems.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = Number(parsedItems.reduce((acc, curr) => acc + curr.protein, 0).toFixed(1));
  const totalCarbs = Number(parsedItems.reduce((acc, curr) => acc + curr.carbs, 0).toFixed(1));
  const totalFat = Number(parsedItems.reduce((acc, curr) => acc + curr.fat, 0).toFixed(1));
  const totalFiber = Number(parsedItems.reduce((acc, curr) => acc + curr.fiber, 0).toFixed(1));

  // Average confidence
  const avgConfidence = Math.round(
    parsedItems.reduce((acc, curr) => acc + curr.confidence, 0) / parsedItems.length
  );

  const handleSimulateParse = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setHasParsed(true);
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Phase 6 Design Spec · Natural-Language Entity Extraction Testbench</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Natural-Language Meal Logging Simulator
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Experience the worked example requested in Phase 6. Instead of 18 taps across 4 menus in MyFitnessPal, type or speak your full Indian meal in one conversational sentence.
        </p>
      </div>

      {/* Main Console Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 mb-8">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Enter What You Ate (Natural English or Hinglish):</span>
            </span>
            <span className="text-slate-500 font-normal">Auto-parses katoris, rotis, ghee & drinks</span>
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="e.g. I ate 2 rotis with ghee, 1 bowl dal, paneer sabzi and a glass of chaas"
              className="w-full p-4 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>
        </div>

        {/* Preset Quick Selectors */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">Try Evidenced Research Presets:</span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputPrompt(p.text);
                  handleSimulateParse();
                }}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                  inputPrompt === p.text
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls & Ghee Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeGhee}
                onChange={(e) => setIncludeGhee(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="font-semibold text-slate-700">Include Desi Ghee Brush (+45 kcal / roti)</span>
            </label>
          </div>

          <button
            onClick={handleSimulateParse}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Parse Meal in &lt;1 Second</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {hasParsed && (
        <div className="space-y-6">
          {/* Header Metric Cards */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
                  Parsing Completed Successfully
                </span>
                <h3 className="text-xl font-bold mt-0.5">Total Meal Nutritional Sum</h3>
                <span className="text-xs text-slate-400">
                  Confidence Score: <span className="font-bold text-emerald-400 font-mono">{avgConfidence}%</span> · Grounded in IFCT 2017
                </span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black font-mono text-emerald-400">{totalCalories} kcal</span>
                <span className="text-xs text-slate-400 block">
                  Variance Window: {Math.round(totalCalories * 0.9)} – {Math.round(totalCalories * 1.15)} kcal
                </span>
              </div>
            </div>

            {/* Macro Breakdown Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-2">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Protein</span>
                <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">{totalProtein}g</span>
                <span className="text-[10px] text-slate-400">Muscle recovery</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Carbohydrates</span>
                <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">{totalCarbs}g</span>
                <span className="text-[10px] text-slate-400">Roti & pulses</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Fats</span>
                <span className="text-xl font-bold text-rose-400 font-mono mt-0.5 block">{totalFat}g</span>
                <span className="text-[10px] text-slate-400">Tadka & dairy fat</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Dietary Fiber</span>
                <span className="text-xl font-bold text-cyan-400 font-mono mt-0.5 block">{totalFiber}g</span>
                <span className="text-[10px] text-slate-400">Satiety & gut health</span>
              </div>
            </div>
          </div>

          {/* Parsed Line Items Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">Extracted Food Entities ({parsedItems.length} items detected)</h4>
              <span className="text-xs text-emerald-600 font-medium flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Ready to commit to daily log</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Detected Item</th>
                    <th className="py-3 px-4">Standard Portion</th>
                    <th className="py-3 px-4 text-right">Calories</th>
                    <th className="py-3 px-4 text-right">Protein</th>
                    <th className="py-3 px-4 text-right">Carbs</th>
                    <th className="py-3 px-4 text-right">Fat</th>
                    <th className="py-3 px-4">Cooking Assumption</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-3 px-4 text-slate-600 font-mono">{item.matchedPortion}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">{item.calories} kcal</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">{item.protein}g</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">{item.carbs}g</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">{item.fat}g</td>
                      <td className="py-3 px-4 text-slate-500 italic text-[11px]">{item.cookingNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Variance & Accuracy Callout */}
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 text-xs flex items-start space-x-3 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Scientific Estimation Transparency (Safety Mandate):</span>
              <p className="leading-relaxed">
                Prepared Indian foods possess intrinsic variability based on cooking oil depth, gravy reduction, and flour knead weight. Rather than claiming impossible precision down to single digits, NutriBharat informs users that this meal is calculated at <strong>{totalCalories} kcal with an expected ±10–15% variance window</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
