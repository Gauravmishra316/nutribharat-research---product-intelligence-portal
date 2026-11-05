import React, { useState, useEffect, useMemo } from 'react';
import { INDIAN_FOOD_DATABASE, FoodItem, UserCalculatorProfile } from '../data/researchData';
import {
  Search,
  Flame,
  Sparkles,
  Scale,
  Info,
  Check,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Copy,
  CheckCheck,
  X,
  Layers,
  ChevronRight,
  PieChart,
  Dumbbell,
  ShieldCheck,
  Zap,
  BookmarkPlus,
  RefreshCw,
  Award,
  Droplets,
  Droplet,
  RotateCcw,
  Settings,
} from 'lucide-react';

export interface MealPlateItem {
  instanceId: string;
  foodId: string;
  name: string;
  hindiName: string;
  portionDesc: string;
  weightGrams: number;
  piecesCount?: number;
  baseServingGrams: number;
  baseCalories: number;
  baseProtein: number;
  baseCarbs: number;
  baseFat: number;
  baseFiber: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  gheeMode?: 'dry' | 'light' | 'generous';
  gheeNote?: string;
  multiplier: number;
}

interface FoodDatabaseProps {
  userProfile?: UserCalculatorProfile;
  onUpdateProfile?: (updates: Partial<UserCalculatorProfile>) => void;
}

// Preset Indian Meal Plates for instant 1-click loading
interface PlatePreset {
  id: string;
  name: string;
  tag: string;
  type: 'veg' | 'non-veg';
  description: string;
  items: {
    foodId: string;
    piecesCount?: number;
    customGrams?: number;
    gheeMode?: 'dry' | 'light' | 'generous';
  }[];
}

const PRESET_PLATES: PlatePreset[] = [
  {
    id: 'north-thali',
    name: 'Classic North Indian Thali',
    tag: 'Balanced Homestyle',
    type: 'veg',
    description: '2 Phulkas with light ghee, Toor Dal, Dahi, and fresh salad',
    items: [
      { foodId: 'roti-wheat', piecesCount: 2, gheeMode: 'light' },
      { foodId: 'toor-dal-cooked', customGrams: 180 },
      { foodId: 'dahi-curd', customGrams: 150 },
    ],
  },
  {
    id: 'high-protein-veg',
    name: 'High Protein Gym Veg Plate',
    tag: 'Muscle Gain (48g Protein)',
    type: 'veg',
    description: 'Soya chunks curry, 2 Rotis, Dal Tadka, and fresh Dahi',
    items: [
      { foodId: 'soya-chunks-cooked', customGrams: 150 },
      { foodId: 'toor-dal-cooked', customGrams: 180 },
      { foodId: 'roti-wheat', piecesCount: 2, gheeMode: 'dry' },
      { foodId: 'dahi-curd', customGrams: 150 },
    ],
  },
  {
    id: 'rajma-chawal',
    name: 'Punjabi Rajma-Chawal Feast',
    tag: 'Complete Amino Acids',
    type: 'veg',
    description: 'Basmati steamed rice with rich Punjabi Rajma and spiced Chaas',
    items: [
      { foodId: 'steamed-basmati', customGrams: 150 },
      { foodId: 'rajma-masala', customGrams: 200 },
      { foodId: 'chaas', piecesCount: 1 },
    ],
  },
  {
    id: 'nonveg-fitness-thali',
    name: 'High-Protein Fitness Chicken Plate',
    tag: 'Lean Muscle (55g Protein)',
    type: 'non-veg',
    description: 'Home chicken curry, 2 Rotis, 2 Boiled egg whites/whole eggs, and Chaas',
    items: [
      { foodId: 'chicken-curry-home', customGrams: 200 },
      { foodId: 'roti-wheat', piecesCount: 2, gheeMode: 'dry' },
      { foodId: 'boiled-egg', piecesCount: 2 },
      { foodId: 'chaas', piecesCount: 1 },
    ],
  },
  {
    id: 'healthy-breakfast',
    name: 'Nutritious Poha & Eggs Breakfast',
    tag: 'Energizing Morning',
    type: 'non-veg',
    description: 'Kanda Poha with crunchy peanuts and 2 whole boiled eggs',
    items: [
      { foodId: 'poha', customGrams: 150 },
      { foodId: 'boiled-egg', piecesCount: 2 },
      { foodId: 'chai-with-milk', piecesCount: 1 },
    ],
  },
];

export const FoodDatabase: React.FC<FoodDatabaseProps> = ({ userProfile, onUpdateProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFoodId, setSelectedFoodId] = useState<string>('roti-wheat');

  // Serving Configuration Modes: 'grams' vs 'pieces'
  const [servingMode, setServingMode] = useState<'grams' | 'pieces'>('pieces');
  const [customGrams, setCustomGrams] = useState<number>(35);
  const [piecesCount, setPiecesCount] = useState<number>(2);
  const [gheeMode, setGheeMode] = useState<'dry' | 'light' | 'generous'>('dry');

  // Meal Plate / Cart State
  const [mealPlate, setMealPlate] = useState<MealPlateItem[]>(() => {
    try {
      const saved = localStorage.getItem('nutribharat_meal_plate');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Initial sample meal plate so user sees how it works right away
    return [
      {
        instanceId: 'sample-1',
        foodId: 'roti-wheat',
        name: 'Whole Wheat Roti (Phulka)',
        hindiName: 'रोटी / फुल्का',
        portionDesc: '2 pieces (70g)',
        weightGrams: 70,
        piecesCount: 2,
        baseServingGrams: 35,
        baseCalories: 85,
        baseProtein: 3.0,
        baseCarbs: 17.5,
        baseFat: 0.4,
        baseFiber: 2.1,
        calories: 215,
        protein: 6.0,
        carbs: 35.0,
        fat: 5.8,
        fiber: 4.2,
        gheeMode: 'light',
        gheeNote: '+1 tsp ghee (45 kcal)',
        multiplier: 2,
      },
      {
        instanceId: 'sample-2',
        foodId: 'toor-dal-cooked',
        name: 'Toor Dal Tadka',
        hindiName: 'तूर दाल तड़का',
        portionDesc: '180g (1 medium katori)',
        weightGrams: 180,
        piecesCount: 1,
        baseServingGrams: 180,
        baseCalories: 155,
        baseProtein: 8.2,
        baseCarbs: 22.5,
        baseFat: 3.8,
        baseFiber: 4.0,
        calories: 155,
        protein: 8.2,
        carbs: 22.5,
        fat: 3.8,
        fiber: 4.0,
        multiplier: 1,
      },
      {
        instanceId: 'sample-3',
        foodId: 'dahi-curd',
        name: 'Fresh Dahi / Curd (Plain)',
        hindiName: 'ताज़ा सादा दही',
        portionDesc: '150g (1 katori)',
        weightGrams: 150,
        piecesCount: 1,
        baseServingGrams: 150,
        baseCalories: 95,
        baseProtein: 6.5,
        baseCarbs: 7.0,
        baseFat: 4.5,
        baseFiber: 0,
        calories: 95,
        protein: 6.5,
        carbs: 7.0,
        fat: 4.5,
        fiber: 0,
        multiplier: 1,
      },
    ];
  });

  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [showPlateModal, setShowPlateModal] = useState<boolean>(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState<boolean>(false);
  const [showGoalEditor, setShowGoalEditor] = useState<boolean>(false);
  const [customWaterInput, setCustomWaterInput] = useState<string>('');

  // Sync meal plate to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nutribharat_meal_plate', JSON.stringify(mealPlate));
    } catch (e) {}
  }, [mealPlate]);

  const categories = [
    { key: 'all', label: 'All Foods' },
    { key: 'staple', label: 'Staples (Roti, Pulao, Dal, Rice)' },
    { key: 'protein', label: 'High Protein (Paneer, Soya, Chicken, Eggs)' },
    { key: 'breakfast', label: 'Breakfast (Poha, Idli, Upma)' },
    { key: 'snack', label: 'Street Snacks (Samosa, Vada Pav)' },
    { key: 'beverage', label: 'Beverages (Chai, Chaas)' },
    { key: 'sweet', label: 'Mithai (Gulab Jamun)' },
  ];

  const isNonVegItem = (id: string) =>
    ['boiled-egg', 'chicken-breast-raw', 'egg-bhurji', 'chicken-curry-home'].includes(id);

  const filteredFoods = INDIAN_FOOD_DATABASE.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hindiName.toLowerCase().includes(searchQuery.toLowerCase());
    const isNonVeg = isNonVegItem(item.id);
    const matchesDiet =
      dietFilter === 'all' ? true : dietFilter === 'veg' ? !isNonVeg : isNonVeg;
    return matchesCat && matchesSearch && matchesDiet;
  });

  const activeFood = INDIAN_FOOD_DATABASE.find((f) => f.id === selectedFoodId) || INDIAN_FOOD_DATABASE[0];

  // Helper: Determine if item is naturally counted in discrete pieces or servings
  const isPieceOriented =
    activeFood.id.includes('roti') ||
    activeFood.id.includes('paratha') ||
    activeFood.id.includes('idli') ||
    activeFood.id.includes('samosa') ||
    activeFood.id.includes('vada') ||
    activeFood.id.includes('egg') ||
    activeFood.id.includes('gulab-jamun') ||
    activeFood.category === 'sweet';

  const unitPieceLabel = isPieceOriented ? 'piece(s) / नग' : 'serving(s) / प्लेट / कटोरी';
  const singlePieceWeight = activeFood.servingGrams || 100;

  // When active food changes, update default custom grams to the item's standard serving
  useEffect(() => {
    setCustomGrams(activeFood.servingGrams);
    if (isPieceOriented) {
      setPiecesCount(2);
    } else {
      setPiecesCount(1);
    }
    setGheeMode('dry');
  }, [selectedFoodId, activeFood.servingGrams]);

  // Compute Ghee impact
  let extraCal = 0;
  let extraFat = 0;
  if (activeFood.category === 'staple' && activeFood.id.includes('roti')) {
    if (gheeMode === 'light') {
      extraCal = 45;
      extraFat = 5.0;
    } else if (gheeMode === 'generous') {
      extraCal = 90;
      extraFat = 10.0;
    }
  }

  // Calculate stats based on Grams or Pieces
  let calculatedGrams = customGrams;
  let ratio = customGrams / (activeFood.servingGrams || 100);

  if (servingMode === 'pieces') {
    calculatedGrams = Math.round(singlePieceWeight * piecesCount);
    ratio = piecesCount;
  }

  const calcCalories = Math.round(activeFood.calories * ratio + extraCal);
  const calcProtein = Number((activeFood.protein * ratio).toFixed(1));
  const calcCarbs = Number((activeFood.carbs * ratio).toFixed(1));
  const calcFat = Number((activeFood.fat * ratio + extraFat).toFixed(1));
  const calcFiber = Number((activeFood.fiber * ratio).toFixed(1));

  // Add active food item to Plate / Cart
  const handleAddToPlate = () => {
    const portionText =
      servingMode === 'grams'
        ? `${calculatedGrams}g weight`
        : `${piecesCount} ${unitPieceLabel.split('/')[0].trim()} (${calculatedGrams}g)`;

    const newItem: MealPlateItem = {
      instanceId: `${activeFood.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      foodId: activeFood.id,
      name: activeFood.name,
      hindiName: activeFood.hindiName,
      portionDesc: portionText,
      weightGrams: calculatedGrams,
      piecesCount: servingMode === 'pieces' ? piecesCount : undefined,
      baseServingGrams: activeFood.servingGrams,
      baseCalories: activeFood.calories,
      baseProtein: activeFood.protein,
      baseCarbs: activeFood.carbs,
      baseFat: activeFood.fat,
      baseFiber: activeFood.fiber,
      calories: calcCalories,
      protein: calcProtein,
      carbs: calcCarbs,
      fat: calcFat,
      fiber: calcFiber,
      gheeMode: activeFood.id.includes('roti') ? gheeMode : undefined,
      gheeNote: extraCal > 0 ? `+${extraCal} kcal ghee` : undefined,
      multiplier: ratio,
    };

    setMealPlate((prev) => [...prev, newItem]);
  };

  // Quick add 1 standard serving from food card directly
  const handleQuickAddFood = (food: FoodItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const newItem: MealPlateItem = {
      instanceId: `${food.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      foodId: food.id,
      name: food.name,
      hindiName: food.hindiName,
      portionDesc: food.servingDesc,
      weightGrams: food.servingGrams,
      piecesCount: 1,
      baseServingGrams: food.servingGrams,
      baseCalories: food.calories,
      baseProtein: food.protein,
      baseCarbs: food.carbs,
      baseFat: food.fat,
      baseFiber: food.fiber,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      fiber: food.fiber,
      multiplier: 1,
    };
    setMealPlate((prev) => [...prev, newItem]);
  };

  // Adjust item portion directly in cart (+0.5x or -0.5x multiplier)
  const handleUpdateItemMultiplier = (instanceId: string, delta: number) => {
    setMealPlate((prev) =>
      prev
        .map((item) => {
          if (item.instanceId !== instanceId) return item;
          const newMultiplier = Math.max(0.5, Number((item.multiplier + delta).toFixed(1)));
          const newGrams = Math.round(item.baseServingGrams * newMultiplier);

          let gheeExtra = 0;
          let fatExtra = 0;
          if (item.gheeMode === 'light') {
            gheeExtra = 45;
            fatExtra = 5;
          } else if (item.gheeMode === 'generous') {
            gheeExtra = 90;
            fatExtra = 10;
          }

          const newPieces = item.piecesCount ? Math.max(0.5, item.piecesCount + delta) : undefined;
          const desc = newPieces
            ? `${newPieces} pcs (${newGrams}g)`
            : `${newGrams}g portion`;

          return {
            ...item,
            multiplier: newMultiplier,
            weightGrams: newGrams,
            piecesCount: newPieces,
            portionDesc: desc,
            calories: Math.round(item.baseCalories * newMultiplier + gheeExtra),
            protein: Number((item.baseProtein * newMultiplier).toFixed(1)),
            carbs: Number((item.baseCarbs * newMultiplier).toFixed(1)),
            fat: Number((item.baseFat * newMultiplier + fatExtra).toFixed(1)),
            fiber: Number((item.baseFiber * newMultiplier).toFixed(1)),
          };
        })
    );
  };

  // Remove item from plate
  const handleRemoveItem = (instanceId: string) => {
    setMealPlate((prev) => prev.filter((item) => item.instanceId !== instanceId));
  };

  // Clear entire plate
  const handleClearPlate = () => {
    setMealPlate([]);
  };

  // Load a Pre-Built Plate Preset
  const handleLoadPreset = (preset: PlatePreset) => {
    const newItems: MealPlateItem[] = [];

    preset.items.forEach((pItem, idx) => {
      const food = INDIAN_FOOD_DATABASE.find((f) => f.id === pItem.foodId);
      if (!food) return;

      let pieces = pItem.piecesCount || 1;
      let grams = pItem.customGrams || food.servingGrams;
      let ratioMult = 1;

      if (pItem.piecesCount) {
        grams = Math.round(food.servingGrams * pieces);
        ratioMult = pieces;
      } else if (pItem.customGrams) {
        ratioMult = pItem.customGrams / food.servingGrams;
      }

      let extraGheeCal = 0;
      let extraGheeFat = 0;
      if (pItem.gheeMode === 'light') {
        extraGheeCal = 45;
        extraGheeFat = 5.0;
      } else if (pItem.gheeMode === 'generous') {
        extraGheeCal = 90;
        extraGheeFat = 10.0;
      }

      newItems.push({
        instanceId: `preset-${preset.id}-${pItem.foodId}-${Date.now()}-${idx}`,
        foodId: food.id,
        name: food.name,
        hindiName: food.hindiName,
        portionDesc: pItem.piecesCount
          ? `${pItem.piecesCount} pcs (${grams}g)`
          : `${grams}g`,
        weightGrams: grams,
        piecesCount: pItem.piecesCount,
        baseServingGrams: food.servingGrams,
        baseCalories: food.calories,
        baseProtein: food.protein,
        baseCarbs: food.carbs,
        baseFat: food.fat,
        baseFiber: food.fiber,
        calories: Math.round(food.calories * ratioMult + extraGheeCal),
        protein: Number((food.protein * ratioMult).toFixed(1)),
        carbs: Number((food.carbs * ratioMult).toFixed(1)),
        fat: Number((food.fat * ratioMult + extraGheeFat).toFixed(1)),
        fiber: Number((food.fiber * ratioMult).toFixed(1)),
        gheeMode: pItem.gheeMode,
        gheeNote: extraGheeCal > 0 ? `+${extraGheeCal} kcal ghee` : undefined,
        multiplier: ratioMult,
      });
    });

    setMealPlate(newItems);
    setShowPresetsMenu(false);
  };

  // Real-time Aggregated Plate totals
  const plateCalories = useMemo(
    () => mealPlate.reduce((acc, curr) => acc + curr.calories, 0),
    [mealPlate]
  );
  const plateProtein = useMemo(
    () => Number(mealPlate.reduce((acc, curr) => acc + curr.protein, 0).toFixed(1)),
    [mealPlate]
  );
  const plateCarbs = useMemo(
    () => Number(mealPlate.reduce((acc, curr) => acc + curr.carbs, 0).toFixed(1)),
    [mealPlate]
  );
  const plateFat = useMemo(
    () => Number(mealPlate.reduce((acc, curr) => acc + curr.fat, 0).toFixed(1)),
    [mealPlate]
  );
  const plateFiber = useMemo(
    () => Number(mealPlate.reduce((acc, curr) => acc + curr.fiber, 0).toFixed(1)),
    [mealPlate]
  );
  const plateTotalGrams = useMemo(
    () => mealPlate.reduce((acc, curr) => acc + curr.weightGrams, 0),
    [mealPlate]
  );

  // Macro Energy Distribution (% of calories from each macro)
  const caloriesFromProtein = plateProtein * 4;
  const caloriesFromCarbs = plateCarbs * 4;
  const caloriesFromFat = plateFat * 9;
  const totalMacroCalories = caloriesFromProtein + caloriesFromCarbs + caloriesFromFat || 1;

  const pctProtein = Math.round((caloriesFromProtein / totalMacroCalories) * 100);
  const pctCarbs = Math.round((caloriesFromCarbs / totalMacroCalories) * 100);
  const pctFat = Math.max(0, 100 - pctProtein - pctCarbs);

  // User Profile Target Comparisons
  const userWeight = userProfile?.weightKg || 70;
  const userHeight = userProfile?.heightCm || 172;
  const userAge = userProfile?.age || 28;
  const userGender = userProfile?.gender || 'male';
  const userActivityTier = userProfile?.activityTier || 1.2;
  const isVeg = userProfile?.dietPreference === 'vegetarian';

  // Quick Mifflin BMR & TDEE
  const estimatedBMR =
    userGender === 'male'
      ? 10 * userWeight + 6.25 * userHeight - 5 * userAge + 5
      : 10 * userWeight + 6.25 * userHeight - 5 * userAge - 161;

  const estimatedTDEE = Math.round(estimatedBMR * userActivityTier);
  const estimatedProteinTarget = Math.round(userWeight * (isVeg ? 1.0 : 0.83));

  const mealCalorieContributionPct = Math.round((plateCalories / estimatedTDEE) * 100);
  const mealProteinContributionPct = Math.round((plateProtein / estimatedProteinTarget) * 100);
  const fiberDailyGoal = 30; // ICMR 2024 recommendation: 30g/day
  const mealFiberContributionPct = Math.round((plateFiber / fiberDailyGoal) * 100);

  // Nutritional Quality Analysis of the Plate
  const hasCereal = mealPlate.some(
    (i) => i.foodId.includes('roti') || i.foodId.includes('rice') || i.foodId.includes('pulao') || i.foodId.includes('poha')
  );
  const hasPulseOrLegume = mealPlate.some(
    (i) => i.foodId.includes('dal') || i.foodId.includes('rajma') || i.foodId.includes('chole') || i.foodId.includes('khichdi')
  );
  const hasHighProteinAnimalOrSoya = mealPlate.some(
    (i) =>
      i.foodId.includes('soya') ||
      i.foodId.includes('chicken') ||
      i.foodId.includes('egg') ||
      i.foodId.includes('paneer')
  );
  const hasCompleteProtein =
    (hasCereal && hasPulseOrLegume) || hasHighProteinAnimalOrSoya;

  // Dedicated Water Intake & Hydration Metrics (Persisted in userProfile)
  const GLASS_SIZE_ML = 250;
  const waterIntakeMl = userProfile?.waterIntakeMl ?? 1500;
  const waterGoalMl = userProfile?.waterGoalMl ?? 2500;
  const waterUnit = userProfile?.waterUnit ?? 'glasses';

  const currentGlasses = Number((waterIntakeMl / GLASS_SIZE_ML).toFixed(1));
  const goalGlasses = Math.max(1, Math.round(waterGoalMl / GLASS_SIZE_ML));
  const waterPercentage = Math.min(200, Math.round((waterIntakeMl / (waterGoalMl || 2500)) * 100));

  // ICMR 2024 guidance: ~35ml/kg for warm climate in India
  const icmrRecommendedWaterMl = Math.round(userWeight * 35);
  const icmrRecommendedGlasses = Math.round(icmrRecommendedWaterMl / GLASS_SIZE_ML);

  const handleSetWaterMl = (newMl: number) => {
    const clamped = Math.max(0, Math.min(10000, newMl));
    onUpdateProfile?.({ waterIntakeMl: clamped });
  };

  const handleAddWaterMl = (deltaMl: number) => {
    const nextVal = Math.max(0, Math.min(10000, waterIntakeMl + deltaMl));
    onUpdateProfile?.({ waterIntakeMl: nextVal });
  };

  const handleUpdateWaterGoal = (newGoal: number) => {
    const clamped = Math.max(500, Math.min(10000, newGoal));
    onUpdateProfile?.({ waterGoalMl: clamped });
    setShowGoalEditor(false);
  };

  const handleToggleWaterUnit = (unit: 'glasses' | 'ml') => {
    onUpdateProfile?.({ waterUnit: unit });
  };

  const handleResetWater = () => {
    onUpdateProfile?.({ waterIntakeMl: 0 });
  };

  // Copy meal summary to clipboard
  const handleCopyMealSummary = () => {
    const lines = mealPlate.map(
      (item) =>
        `• ${item.name} (${item.portionDesc}): ${item.calories} kcal | ${item.protein}g Protein | ${item.carbs}g Carbs | ${item.fat}g Fat | ${item.fiber}g Fiber`
    );
    const waterSummaryText = `\n💧 DAILY WATER INTAKE:\n• Consumed: ${
      waterUnit === 'glasses'
        ? `${currentGlasses} / ${goalGlasses} glasses (${waterIntakeMl} ml)`
        : `${waterIntakeMl} / ${waterGoalMl} ml (${currentGlasses} glasses)`
    } (${waterPercentage}% of ${waterGoalMl} ml goal)\n• ICMR Hydration Guideline: ~${icmrRecommendedWaterMl} ml/day based on ${userWeight}kg body weight`;

    const summaryText = `🍛 My NutriBharat Meal Plate (${mealPlate.length} items · ${plateTotalGrams}g):\n\n${lines.join(
      '\n'
    )}\n\n═════════════════════════════════════\nTOTAL NUTRITIONAL PROFILE:\n🔥 Calories: ${plateCalories} kcal (${mealCalorieContributionPct}% of TDEE)\n💪 Protein: ${plateProtein}g (${mealProteinContributionPct}% of Daily Target)\n🌾 Carbohydrates: ${plateCarbs}g (${pctCarbs}% Energy)\n🥑 Fats: ${plateFat}g (${pctFat}% Energy)\n🥗 Dietary Fiber: ${plateFiber}g (${mealFiberContributionPct}% of ICMR 30g Goal)\nMacro Ratio: ${pctProtein}% Protein : ${pctCarbs}% Carbs : ${pctFat}% Fat${waterSummaryText}\n═════════════════════════════════════\nGrounded in ICMR-NIN 2024 Dietary Guidelines & IFCT 2017.`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Interactive Meal Plate Cart · Real-Time Macro Sum · IFCT 2017 Grounded</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Indian Food Database & Meal Plate Cart
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Add multiple Indian dishes by <strong>Pieces</strong> (e.g. 2 rotis, 3 idlis, 2 eggs) or <strong>Exact Grams</strong> (e.g. 180g Pulao, 200g Dal) and monitor your aggregated calories, protein, carbs, fat, and fiber in real-time.
          </p>
        </div>

        {/* Action Controls: Presets Dropdown & Open Plate Drawer */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {/* Quick Presets Button */}
          <div className="relative">
            <button
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs"
            >
              <BookmarkPlus className="w-4 h-4 text-amber-500" />
              <span>Load Thali Preset</span>
            </button>

            {/* Presets Dropdown */}
            {showPresetsMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="p-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Pre-Built Indian Thalis</span>
                  <button
                    onClick={() => setShowPresetsMenu(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1 mt-1">
                  {PRESET_PLATES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleLoadPreset(p)}
                      className="w-full text-left p-2 rounded-lg hover:bg-emerald-50/80 transition text-xs group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 group-hover:text-emerald-700">
                          {p.name}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                            p.type === 'veg'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.type === 'veg' ? '🌱 Veg' : '🍗 Non-Veg'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {p.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Water Status Pill in Header */}
          <div
            onClick={() => {
              const el = document.getElementById('water-intake-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-semibold shadow-2xs cursor-pointer transition"
            title="Jump to Water Intake section"
          >
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-mono font-bold">
              {waterUnit === 'glasses' ? `${currentGlasses}/${goalGlasses} gl` : `${waterIntakeMl}/${waterGoalMl} ml`}
            </span>
            <span className="text-[10px] text-sky-700 font-bold bg-white px-1.5 py-0.5 rounded border border-sky-200">
              {waterPercentage}%
            </span>
          </div>

          {/* View Meal Plate CTA Button */}
          <button
            onClick={() => setShowPlateModal(true)}
            className="relative inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm border border-slate-700"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>My Plate ({mealPlate.length})</span>
            <span className="font-mono text-emerald-400 font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {plateCalories} kcal
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid: Food Browser (Left) + Serving & Weight Calibrator (Middle) + Live Meal Plate (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Food Search & List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food (e.g. pulao, poha, roti, idli, samosa, dal, chicken)..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Diet Filter & Profile Quick-Sync */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDietFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                    dietFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setDietFilter('veg')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center space-x-1 ${
                    dietFilter === 'veg'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🌱 Veg</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDietFilter('non-veg')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center space-x-1 ${
                    dietFilter === 'non-veg'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🍗 Non-Veg</span>
                </button>
              </div>

              {/* Profile Diet Preference Indicator */}
              {userProfile && onUpdateProfile && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdateProfile({
                      dietPreference:
                        userProfile.dietPreference === 'vegetarian'
                          ? 'non-vegetarian'
                          : 'vegetarian',
                    })
                  }
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center space-x-1 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded border border-slate-200 transition"
                  title="Click to switch your global profile diet preference"
                >
                  <span>Profile:</span>
                  <span className="font-bold text-slate-900">
                    {userProfile.dietPreference === 'vegetarian' ? '🌱 Veg' : '🍗 Non-Veg'}
                  </span>
                  <span className="text-[10px] text-emerald-800 underline">switch</span>
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.key
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Food Cards Grid */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredFoods.map((food) => {
              const isSelected = food.id === activeFood.id;
              const isNonVeg = isNonVegItem(food.id);
              return (
                <div
                  key={food.id}
                  onClick={() => setSelectedFoodId(food.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        {/* Standard Indian Veg/Non-Veg Mark */}
                        <span
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                            isNonVeg ? 'border-amber-800' : 'border-emerald-600'
                          }`}
                          title={isNonVeg ? 'Non-Vegetarian' : 'Vegetarian'}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isNonVeg ? 'bg-amber-800' : 'bg-emerald-600'
                            }`}
                          />
                        </span>
                        <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                          {food.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({food.hindiName})
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 block">
                        {food.servingDesc}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {food.calories} kcal
                      </span>
                      <button
                        onClick={(e) => handleQuickAddFood(food, e)}
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-xs"
                        title="Add 1 standard serving directly to Meal Plate"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <div>
                      P: <span className="font-semibold text-slate-800">{food.protein}g</span>
                    </div>
                    <div>
                      C: <span className="font-semibold text-slate-800">{food.carbs}g</span>
                    </div>
                    <div>
                      F: <span className="font-semibold text-slate-800">{food.fat}g</span>
                    </div>
                    <div>
                      Fib: <span className="font-semibold text-slate-800">{food.fiber}g</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Column: Active Food Weigher & Pieces / Grams Calibrator */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 sticky top-24">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {activeFood.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  1 Base Serving = {activeFood.servingGrams}g
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{activeFood.name}</h2>
              <p className="text-xs text-slate-500">{activeFood.hindiName}</p>
            </div>

            {/* Serving Input Mode Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Select Input Method:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setServingMode('pieces')}
                  className={`py-2 rounded-lg font-bold transition flex items-center justify-center space-x-1.5 ${
                    servingMode === 'pieces'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Quantity in Pieces</span>
                </button>
                <button
                  onClick={() => setServingMode('grams')}
                  className={`py-2 rounded-lg font-bold transition flex items-center justify-center space-x-1.5 ${
                    servingMode === 'grams'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Weight in Grams</span>
                </button>
              </div>
            </div>

            {/* MODE 1: Direct Pieces / Quantity Input */}
            {servingMode === 'pieces' ? (
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Enter Number of Pieces / Servings:
                  </label>
                  <span className="text-xs text-emerald-800 font-mono font-bold">
                    {piecesCount} {isPieceOriented ? 'pieces' : 'servings'} = {calculatedGrams}g
                  </span>
                </div>

                {/* Direct Number Input for Pieces */}
                <div className="relative">
                  <input
                    type="number"
                    min={0.25}
                    max={50}
                    step={0.5}
                    value={piecesCount}
                    onChange={(e) => setPiecesCount(Math.max(0.1, Number(e.target.value) || 1))}
                    className="w-full p-2.5 pl-3 pr-24 text-lg font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Enter pieces (e.g. 1, 2, 3)"
                  />
                  <span className="absolute right-3 top-3 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {isPieceOriented ? 'pieces (नग)' : 'portions'}
                  </span>
                </div>

                {/* Quick Pieces Selection Chips */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Quick piece presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[0.5, 1, 2, 3, 4, 5].map((count) => (
                      <button
                        key={count}
                        onClick={() => setPiecesCount(count)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition ${
                          piecesCount === count
                            ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {count} {count === 1 ? 'pc' : 'pcs'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                  Base Reference:{' '}
                  <strong>
                    1 piece/serving = {singlePieceWeight}g
                  </strong>{' '}
                  ({activeFood.servingDesc})
                </div>
              </div>
            ) : (
              /* MODE 2: Direct Grams Input */
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Enter Exact Weight in Grams:</span>
                  <span className="text-emerald-800 font-mono font-bold text-sm">
                    {calculatedGrams} grams
                  </span>
                </label>

                {/* Direct Number Input for Grams */}
                <div className="relative">
                  <input
                    type="number"
                    min={5}
                    max={2000}
                    step={5}
                    value={customGrams}
                    onChange={(e) => setCustomGrams(Math.max(5, Number(e.target.value) || 0))}
                    className="w-full p-2.5 pl-3 pr-14 text-base font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Enter grams (e.g. 150, 180, 200)"
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-semibold text-slate-400">
                    grams (g)
                  </span>
                </div>

                {/* Quick Grams Chips */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Quick gram presets for {activeFood.name}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[50, 100, 150, 180, 200, 250, 300].map((gm) => (
                      <button
                        key={gm}
                        onClick={() => setCustomGrams(gm)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition ${
                          customGrams === gm
                            ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {gm}g
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ghee Modifier (for rotis and breads) */}
            {activeFood.id.includes('roti') && (
              <div className="space-y-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80">
                <label className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Desi Ghee / Butter Brush</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    onClick={() => setGheeMode('dry')}
                    className={`py-1.5 px-2 rounded-lg font-medium transition ${
                      gheeMode === 'dry'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    Dry (0g)
                  </button>
                  <button
                    onClick={() => setGheeMode('light')}
                    className={`py-1.5 px-2 rounded-lg font-medium transition ${
                      gheeMode === 'light'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    1 tsp (+45 kcal)
                  </button>
                  <button
                    onClick={() => setGheeMode('generous')}
                    className={`py-1.5 px-2 rounded-lg font-medium transition ${
                      gheeMode === 'generous'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    2 tsp (+90 kcal)
                  </button>
                </div>
              </div>
            )}

            {/* Live Energy & Macro Readout */}
            <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {servingMode === 'pieces'
                    ? `${piecesCount} ${unitPieceLabel.split('/')[0].trim()} (${calculatedGrams}g):`
                    : `${calculatedGrams} grams:`}
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {calcCalories} kcal
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1 text-center text-xs pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">Protein</span>
                  <span className="font-bold text-emerald-400 font-mono">{calcProtein}g</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Carbs</span>
                  <span className="font-bold text-amber-400 font-mono">{calcCarbs}g</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Fat</span>
                  <span className="font-bold text-rose-400 font-mono">{calcFat}g</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Fiber</span>
                  <span className="font-bold text-cyan-400 font-mono">{calcFiber}g</span>
                </div>
              </div>
            </div>

            {/* Add to Plate Button */}
            <button
              onClick={handleAddToPlate}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>
                Add{' '}
                {servingMode === 'pieces'
                  ? `${piecesCount} ${unitPieceLabel.split('/')[0].trim()}`
                  : `${calculatedGrams}g`}{' '}
                to Meal Plate
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: "My Meal Plate / Cart" (Live Total Meals Detail) */}
        <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto pr-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">My Meal Plate</h3>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded font-bold">
                  {mealPlate.length} items
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-800 font-mono px-2 py-0.5 rounded font-bold">
                  {plateTotalGrams}g
                </span>
              </div>
            </div>

            {/* Quick Hydration Status Bar inside Meal Plate */}
            <div
              onClick={() => {
                const el = document.getElementById('water-intake-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50/80 border border-sky-200/80 cursor-pointer hover:bg-sky-100/70 transition text-xs shadow-2xs"
              title="Click to jump down to Water Intake controls"
            >
              <div className="flex items-center space-x-1.5 text-sky-950 font-semibold">
                <Droplets className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="text-[11px] text-slate-600">Day Water:</span>
                <span className="font-mono font-bold text-sky-800">
                  {waterUnit === 'glasses'
                    ? `${currentGlasses} / ${goalGlasses} gl`
                    : `${waterIntakeMl} / ${waterGoalMl} ml`}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  waterPercentage >= 100
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-white text-sky-700 border-sky-200'
                }`}
              >
                {waterPercentage}% Goal
              </span>
            </div>

            {/* Item List with In-Cart Quantity Controls */}
            {mealPlate.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl space-y-2">
                <ShoppingBag className="w-7 h-7 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-600">Your meal plate is empty.</p>
                <p className="text-[11px] text-slate-500">
                  Select foods like Roti, Pulao, Poha, or Dal and click{' '}
                  <strong>Add to Meal Plate</strong> or load a preset thali above.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {mealPlate.map((item) => (
                  <div
                    key={item.instanceId}
                    className="p-3 bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 transition"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 leading-tight">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.portionDesc} ·{' '}
                          <span className="text-emerald-700 font-bold font-mono">
                            {item.calories} kcal
                          </span>
                        </div>
                        {item.gheeNote && (
                          <span className="text-[10px] text-amber-800 bg-amber-100/70 px-1 py-0.5 rounded inline-block font-medium">
                            {item.gheeNote}
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.instanceId)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Macro pill summary and in-cart + / - adjuster */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-600 font-mono">
                      <span>P:{item.protein}g · C:{item.carbs}g · F:{item.fat}g</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleUpdateItemMultiplier(item.instanceId, -0.5)}
                          className="w-5 h-5 rounded bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 transition"
                          title="Decrease portion"
                        >
                          -
                        </button>
                        <span className="text-[11px] font-bold text-slate-800 px-1">
                          {item.multiplier}x
                        </span>
                        <button
                          onClick={() => handleUpdateItemMultiplier(item.instanceId, 0.5)}
                          className="w-5 h-5 rounded bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 transition"
                          title="Increase portion"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Meal Plate Summary Total Card */}
            {mealPlate.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                {/* Total Energy and Macros */}
                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Meal Energy</span>
                      <span className="text-2xl font-bold font-mono text-emerald-400">
                        {plateCalories} kcal
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">% of Daily TDEE</span>
                      <span className="text-xs font-mono font-bold bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-slate-700">
                        {mealCalorieContributionPct}% of {estimatedTDEE}
                      </span>
                    </div>
                  </div>

                  {/* 4 Macros */}
                  <div className="grid grid-cols-4 gap-1 text-center text-xs pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Protein</span>
                      <span className="font-bold text-emerald-400 font-mono text-xs">
                        {plateProtein}g
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono">
                        {pctProtein}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Carbs</span>
                      <span className="font-bold text-amber-400 font-mono text-xs">
                        {plateCarbs}g
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono">{pctCarbs}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fat</span>
                      <span className="font-bold text-rose-400 font-mono text-xs">
                        {plateFat}g
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono">{pctFat}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fiber</span>
                      <span className="font-bold text-cyan-400 font-mono text-xs">
                        {plateFiber}g
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono">
                        {mealFiberContributionPct}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Stacked Macro Ratio Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Macro Energy Ratio</span>
                      <span className="font-mono text-slate-300">
                        P:{pctProtein}% · C:{pctCarbs}% · F:{pctFat}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 flex overflow-hidden">
                      <div
                        style={{ width: `${pctProtein}%` }}
                        className="bg-emerald-500 h-full"
                        title={`Protein: ${pctProtein}%`}
                      />
                      <div
                        style={{ width: `${pctCarbs}%` }}
                        className="bg-amber-400 h-full"
                        title={`Carbohydrates: ${pctCarbs}%`}
                      />
                      <div
                        style={{ width: `${pctFat}%` }}
                        className="bg-rose-500 h-full"
                        title={`Fat: ${pctFat}%`}
                      />
                    </div>
                  </div>
                </div>

                {/* Plate Quality & Clinical Insights */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center space-x-1 text-slate-800 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Plate Nutritional Assessment:</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    {hasCompleteProtein ? (
                      <div className="flex items-center space-x-1 text-emerald-800 font-medium">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Complete Amino Acid Profile (Cereal + Pulse / Protein)</span>
                      </div>
                    ) : (
                      <div className="text-amber-800">
                        Tip: Pair with a dal, paneer, or egg to complete the amino acid pool.
                      </div>
                    )}
                    {plateProtein >= 25 ? (
                      <div className="text-emerald-700 font-medium">
                        ✓ Meets leucine threshold (&gt;25g P) for Muscle Protein Synthesis.
                      </div>
                    ) : (
                      <div className="text-slate-500">
                        Protein is {plateProtein}g ({mealProteinContributionPct}% of your{' '}
                        {estimatedProteinTarget}g daily target).
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: Copy Summary & Clear */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={handleCopyMealSummary}
                    className="py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition flex items-center justify-center space-x-1.5"
                  >
                    {copiedSummary ? (
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                  <button
                    onClick={handleClearPlate}
                    className="py-2 px-3 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium transition flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Plate</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Water Intake Section */}
          <div
            id="water-intake-section"
            className="bg-white border border-sky-200 rounded-2xl p-5 shadow-sm space-y-4 bg-gradient-to-b from-sky-50/50 via-white to-white"
          >
            {/* Header: Title, Unit Toggle & Settings */}
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-xs">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                    <span>Daily Water Intake</span>
                  </h3>
                  <p className="text-[10px] text-slate-500">दैनिक जल सेवन · Hydration Tracker</p>
                </div>
              </div>

              {/* Unit Toggle: Glasses vs ml */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => handleToggleWaterUnit('glasses')}
                  className={`px-2 py-1 rounded-md transition ${
                    waterUnit === 'glasses'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Track by glasses (1 standard glass = 250 ml)"
                >
                  🥛 Glasses
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleWaterUnit('ml')}
                  className={`px-2 py-1 rounded-md transition ${
                    waterUnit === 'ml'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Track by milliliters"
                >
                  💧 ml
                </button>
              </div>
            </div>

            {/* Main Metric Counter & Status Badge */}
            <div className="bg-sky-50/80 border border-sky-100 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">
                  {waterUnit === 'glasses' ? 'Glasses Consumed Today:' : 'Volume Consumed Today:'}
                </span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-2xl font-black font-mono text-sky-700">
                    {waterUnit === 'glasses' ? currentGlasses : waterIntakeMl.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    / {waterUnit === 'glasses' ? goalGlasses : waterGoalMl.toLocaleString()}{' '}
                    {waterUnit === 'glasses' ? 'glasses' : 'ml'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {waterUnit === 'glasses'
                    ? `≈ ${waterIntakeMl.toLocaleString()} ml total`
                    : `≈ ${currentGlasses} glasses (250ml each)`}
                </span>
              </div>

              <div className="text-right space-y-1">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block border ${
                    waterPercentage >= 100
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : waterPercentage >= 50
                      ? 'bg-sky-100 text-sky-800 border-sky-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}
                >
                  {waterPercentage >= 100 ? '🎉 Goal Met' : `${waterPercentage}% Done`}
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  Target: {waterGoalMl} ml
                </span>
              </div>
            </div>

            {/* Dynamic Water Level Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>Daily Hydration Goal</span>
                <span className="font-mono font-bold text-sky-800">{waterPercentage}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                <div
                  style={{ width: `${Math.min(100, waterPercentage)}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 transition-all duration-300 shadow-xs"
                />
              </div>
            </div>

            {/* Interactive Visual Glasses Grid */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700 flex items-center space-x-1">
                  <span>Interactive Glass Tracker</span>
                  <span className="text-[10px] text-slate-400 font-normal">(tap glass to set)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">1 glass = 250ml</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: Math.max(10, Math.min(15, goalGlasses)) }).map((_, idx) => {
                  const glassNum = idx + 1;
                  const isFilled = currentGlasses >= glassNum;
                  const isHalfFilled = !isFilled && currentGlasses >= glassNum - 0.5;

                  return (
                    <button
                      key={glassNum}
                      type="button"
                      onClick={() => handleSetWaterMl(glassNum * GLASS_SIZE_ML)}
                      className={`relative py-2 px-1 rounded-xl flex flex-col items-center justify-center transition group border ${
                        isFilled
                          ? 'bg-sky-500 text-white border-sky-400 shadow-xs ring-1 ring-sky-300'
                          : isHalfFilled
                          ? 'bg-sky-100 text-sky-700 border-sky-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-600'
                      }`}
                      title={`Click to set intake to ${glassNum} glasses (${glassNum * 250} ml)`}
                    >
                      <Droplet
                        className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                          isFilled ? 'fill-white text-white' : 'text-current'
                        }`}
                      />
                      <span className="text-[10px] font-mono font-bold mt-0.5">#{glassNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Increment / Decrement Action Buttons */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleAddWaterMl(GLASS_SIZE_ML)}
                  className="py-2 px-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition flex items-center justify-center space-x-1 shadow-xs"
                  title="Add 1 glass (250 ml)"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+1 Glass</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddWaterMl(500)}
                  className="py-2 px-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold transition flex items-center justify-center space-x-1 shadow-xs"
                  title="Add 500 ml bottle (2 glasses)"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+500ml</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddWaterMl(100)}
                  className="py-2 px-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold transition flex items-center justify-center space-x-1 border border-sky-200"
                  title="Add 100 ml small cup or sip"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+100ml</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleAddWaterMl(-GLASS_SIZE_ML)}
                  disabled={waterIntakeMl <= 0}
                  className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition flex items-center justify-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed text-[11px]"
                  title="Remove 1 glass (250 ml)"
                >
                  <Minus className="w-3 h-3" />
                  <span>-1 Glass (250ml)</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetWater}
                  className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-medium transition flex items-center justify-center space-x-1 text-[11px]"
                  title="Reset today's water to 0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Today</span>
                </button>
              </div>
            </div>

            {/* Customizable Goal & Custom Input Toggle */}
            <div className="border-t border-slate-100 pt-2.5 space-y-2">
              <button
                type="button"
                onClick={() => setShowGoalEditor(!showGoalEditor)}
                className="w-full flex items-center justify-between text-[11px] text-slate-600 hover:text-slate-900 font-medium transition py-1"
              >
                <span className="flex items-center space-x-1">
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Customize Daily Target & Quick Log</span>
                </span>
                <span className="text-sky-600 underline text-[10px]">
                  {showGoalEditor ? 'Hide' : 'Edit Goal'}
                </span>
              </button>

              {showGoalEditor && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-150 text-xs">
                  {/* Goal Presets */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Target presets (based on Indian climate & exercise):
                    </span>
                    <div className="grid grid-cols-4 gap-1 font-mono">
                      {[2000, 2500, 3000, 3500].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => handleUpdateWaterGoal(g)}
                          className={`py-1 rounded text-[11px] font-bold border transition ${
                            waterGoalMl === g
                              ? 'bg-sky-600 text-white border-sky-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {(g / 1000).toFixed(1)}L
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Direct Custom Volume Log Input */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Log exact custom volume:
                    </span>
                    <div className="flex space-x-1.5">
                      <input
                        type="number"
                        min={0}
                        max={10000}
                        step={50}
                        value={customWaterInput}
                        onChange={(e) => setCustomWaterInput(e.target.value)}
                        placeholder="e.g. 1750 ml"
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = Number(customWaterInput);
                          if (!isNaN(val) && val >= 0) {
                            handleSetWaterMl(val);
                            setCustomWaterInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-sky-600 text-white rounded-lg font-bold text-xs hover:bg-sky-500 transition"
                      >
                        Set
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const val = Number(customWaterInput);
                          if (!isNaN(val) && val > 0) {
                            handleAddWaterMl(val);
                            setCustomWaterInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-sky-100 text-sky-800 rounded-lg font-bold text-xs hover:bg-sky-200 transition border border-sky-200"
                      >
                        +Add
                      </button>
                    </div>
                  </div>

                  {/* ICMR Benchmark Note */}
                  <div className="text-[10px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200 leading-relaxed">
                    💡 <strong>ICMR-NIN 2024 Hydration Benchmark</strong>:{' '}
                    ~35 ml per kg body weight ({userWeight}kg = ~<strong>{icmrRecommendedWaterMl} ml</strong> /{' '}
                    <strong>{icmrRecommendedGlasses} glasses</strong>) for healthy adults in India.
                  </div>
                </div>
              )}
            </div>

            {/* Ayurvedic & Clinical Hydration Tip */}
            <div className="bg-sky-50/60 p-2.5 rounded-xl border border-sky-200/70 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center space-x-1 text-sky-900 font-bold">
                <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Ayurvedic Meal Synergy</span>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-600">
                Drink water 30 minutes before your meal. Avoid chugging cold water during Indian meals to prevent quenching digestive fire (Jatharagni) and diluting gastric enzymes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Full Plate Modal View & Deep Nutritional Analysis */}
      {showPlateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    My Complete Meal Plate Nutritional Profile
                  </h2>
                  <p className="text-xs text-slate-500">
                    {mealPlate.length} aggregate items · Total Meal Weight: {plateTotalGrams} grams
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPlateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item List */}
            {mealPlate.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-600">Your meal plate is currently empty.</p>
                <p className="text-slate-500">Add foods from the database to view detailed meal analytics.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {mealPlate.map((item) => (
                  <div
                    key={item.instanceId}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                      <span className="text-slate-500">{item.portionDesc}</span>
                      <div className="grid grid-cols-4 gap-2 text-[11px] text-slate-600 mt-1 font-mono">
                        <span>P: {item.protein}g</span>
                        <span>C: {item.carbs}g</span>
                        <span>F: {item.fat}g</span>
                        <span>Fib: {item.fiber}g</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="font-mono font-bold text-emerald-700 text-sm block">
                        {item.calories} kcal
                      </span>
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleUpdateItemMultiplier(item.instanceId, -0.5)}
                          className="w-5 h-5 rounded bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold">{item.multiplier}x</span>
                        <button
                          onClick={() => handleUpdateItemMultiplier(item.instanceId, 0.5)}
                          className="w-5 h-5 rounded bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.instanceId)}
                          className="ml-2 text-rose-600 hover:text-rose-700 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Readout in Modal */}
            {mealPlate.length > 0 && (
              <div className="space-y-4">
                <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Total Sum for this Meal</span>
                      <span className="text-3xl font-bold font-mono text-emerald-400 block">
                        {plateCalories} kcal
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Daily Budget Share</span>
                      <span className="text-sm font-mono font-bold text-emerald-300">
                        {mealCalorieContributionPct}% of {estimatedTDEE} kcal
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs pt-3 border-t border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Protein</span>
                      <span className="font-bold text-emerald-400 font-mono text-sm">
                        {plateProtein}g
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {mealProteinContributionPct}% of daily goal
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Carbs</span>
                      <span className="font-bold text-amber-400 font-mono text-sm">
                        {plateCarbs}g
                      </span>
                      <span className="text-[10px] text-slate-400 block">{pctCarbs}% energy</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fat</span>
                      <span className="font-bold text-rose-400 font-mono text-sm">{plateFat}g</span>
                      <span className="text-[10px] text-slate-400 block">{pctFat}% energy</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fiber</span>
                      <span className="font-bold text-cyan-400 font-mono text-sm">
                        {plateFiber}g
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {mealFiberContributionPct}% of 30g goal
                      </span>
                    </div>
                  </div>

                  {/* Macro Progress Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Macronutrient Calorie Split</span>
                      <span className="font-mono">
                        Protein: {pctProtein}% · Carbs: {pctCarbs}% · Fat: {pctFat}%
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden">
                      <div style={{ width: `${pctProtein}%` }} className="bg-emerald-500 h-full" />
                      <div style={{ width: `${pctCarbs}%` }} className="bg-amber-400 h-full" />
                      <div style={{ width: `${pctFat}%` }} className="bg-rose-500 h-full" />
                    </div>
                  </div>
                </div>

                {/* ICMR Dietary Standards Benchmark Comparison */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>ICMR-NIN 2024 Balanced Thali Benchmark Comparison</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 pt-1">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-800">Protein Ratio</div>
                      <div className="font-mono text-emerald-700 font-bold mt-0.5">
                        {pctProtein}% (Ideal: 15–20%)
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {pctProtein >= 15
                          ? 'Optimal protein density for satiety and muscle maintenance.'
                          : 'Consider adding soya, paneer, eggs, or chicken to reach 15%+.'}
                      </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-800">Carbohydrate Ratio</div>
                      <div className="font-mono text-amber-700 font-bold mt-0.5">
                        {pctCarbs}% (Ideal: 50–60%)
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {pctCarbs <= 65
                          ? 'Well-calibrated carbohydrate load avoiding insulin spikes.'
                          : 'Carbohydrates are slightly elevated; consider reducing rice/roti portions.'}
                      </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-800">Dietary Fiber</div>
                      <div className="font-mono text-cyan-700 font-bold mt-0.5">
                        {plateFiber}g ({mealFiberContributionPct}% of 30g)
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {plateFiber >= 8
                          ? 'Excellent prebiotic fiber supporting gut microbiome.'
                          : 'Add raw cucumber-tomato salad or legumes to raise fiber.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Daily Hydration Status in Modal */}
                <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 font-bold text-sky-950">
                      <Droplets className="w-4 h-4 text-sky-600" />
                      <span>Daily Hydration & Meal Fluid Balance</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-sky-700 bg-white px-2.5 py-0.5 rounded-full border border-sky-200">
                      {waterUnit === 'glasses'
                        ? `${currentGlasses} / ${goalGlasses} glasses`
                        : `${waterIntakeMl.toLocaleString()} / ${waterGoalMl.toLocaleString()} ml`}{' '}
                      ({waterPercentage}%)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-sky-200/60 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, waterPercentage)}%` }}
                      className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 rounded-full"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600 pt-1">
                    <span>
                      💧 <strong>Digestive Transit</strong>: Consuming this meal ({plateFiber}g fiber) with adequate daily hydration ensures smooth gastrointestinal transit and prevents post-meal lethargy.
                    </span>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAddWaterMl(GLASS_SIZE_ML)}
                        className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-xs shadow-xs flex items-center space-x-1 transition"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+1 Glass</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddWaterMl(500)}
                        className="px-2.5 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-bold text-xs shadow-xs flex items-center space-x-1 transition"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+500ml</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={handleCopyMealSummary}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
              >
                {copiedSummary ? (
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copiedSummary ? 'Copied Summary' : 'Copy Complete Breakdown'}</span>
              </button>
              <button
                onClick={() => setShowPlateModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
              >
                Done / Keep Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
