# Phase 8: Comprehensive Evaluation of Candidate Calculators & Tools

**Document ID:** `research/08-calculators.md`  
**Scope:** Systematic assessment of 13 potential nutritional and physiological calculation tools across Search Demand, User Intent, Build Complexity, Clinical Usefulness, and Architectural Placement (Public SEO Page vs. Logged-In Core Product Feature).

---

## 1. Candidate Calculators Evaluation Matrix

| Calculator / Tool | Estimated Monthly Searches (India) | Primary User Intent | Technical & Mathematical Build Complexity | Long-Term Product Usefulness | Placement Architecture |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. BMR Calculator (Basal Metabolic Rate)** | 350,000 – 450,000 | Informational: "What is the absolute minimum calories my body burns at rest?" | **Low** (Mifflin-St Jeor equation + ICMR-NIN reference comparison) | **High** (Foundational for all calorie targets) | **Both**: Standalone public SEO tool (`/calculators/bmr/`) + automated backend engine during profile setup. |
| **2. TDEE Calculator (Total Daily Energy Expenditure)** | 120,000 – 180,000 | Utility: "How many calories do I actually burn including my daily activity?" | **Low-Medium** (BMR multiplied by activity coefficient with NEAT explanations) | **Very High** (Direct anchor for maintenance calories) | **Both**: Public SEO page (`/calculators/tdee/`) + dynamic logged-in dashboard baseline. |
| **3. Calorie Deficit Planner** | 110,000 – 165,000 | Action-Oriented: "How much should I eat to safely lose 0.5 kg per week?" | **Medium** (Applies safe deficit percentage with ICMR physiological floor guardrails) | **Essential (Core Value)** | **Both**: Public acquisition page + core logged-in target generator. |
| **4. Macro Distribution Calculator** | 60,000 – 95,000 | Planning: "How many grams of carbs, protein, and fat should I eat daily?" | **Medium** (Calculates target calories into macro grams based on diet preference) | **High** | **Both**: Public interactive tool + in-app macro progress budget. |
| **5. Indian Protein Requirement Calculator** | 50,000 – 80,000 | Reassurance & Planning: "Am I deficient in protein as an Indian vegetarian?" | **Low-Medium** (ICMR 0.83g/kg baseline up to 1.6–2.0g/kg for gym trainees) | **Very High** | **Both**: Standalone public page (`/calculators/protein/`) with Indian protein food recommendations. |
| **6. BMI & Asian Health Risk Calculator** | 1,200,000 – 1,800,000 | Broad Screening: "Am I normal weight or overweight?" | **Low** ($\text{Weight (kg)} / [\text{Height (m)}]^2$) | **Moderate** (Limited for athletes, but massive top-of-funnel traffic) | **Public SEO Page**: Pure acquisition magnet with explicit WHO Asian cutoff (Overweight $\ge 23$, Obese $\ge 25$). |
| **7. Ideal Body Weight (Hamwi & Miller formulas)** | 80,000 – 130,000 | Curiosity & Goal Setting: "What should someone of my height weigh?" | **Low** | **Moderate-Low** (Arbitrary without body fat consideration) | **Public SEO Page Only**: Traffic driver; not used for core product algorithms. |
| **8. Steps-to-Calories Burned Calculator** | 110,000 – 190,000 | Trade-off: "How many calories did my 10,000 steps walk burn?" | **Low-Medium** (Weight, height, pace, step cadence conversion) | **High** | **Both**: High-ranking public utility + optional daily sync module in app. |
| **9. Water & Electrolyte Intake Calculator** | 90,000 – 140,000 | Lifestyle: "How many liters of water do I need in Indian climate?" | **Low** (35ml/kg baseline + climate/exercise addition) | **Moderate** | **Both**: Public SEO page + daily hydration logging widget. |
| **10. Katori & Household Utensil Converter** | 15,000 – 25,000 (Low volume, extreme pain point) | Kitchen Utility: "How many grams of cooked dal/rice fits in my katori?" | **Low-Medium** (Volume-to-density conversion for 30+ Indian dishes) | **Exceptional** (Solves Gap 2) | **Both**: Unique viral public tool (`/calculators/katori/`) + built into the logging interface. |
| **11. Indian Food Calorie & Ghee Estimator** | 70,000 – 110,000 | Immediate Food Lookup: "What are the calories in 2 rotis with ghee?" | **Medium** (Modular selection of bread + gravy + cooking fat) | **Exceptional** | **Both**: Public SEO lookup (`/food/roti-calculator/`) + core food logger component. |
| **12. Multi-Ingredient Meal Calorie Builder** | 40,000 – 60,000 | Recipe & Meal Planning: "How many calories in my entire lunch plate?" | **Medium-High** (Multi-item composition table with sum totals) | **Very High** | **Core Product Feature**: Main screen of the application. |
| **13. Calories Burned by Specific Activity** | 45,000 – 75,000 | Workout Tracking: "Calories burned in 30 mins yoga / cycling / cricket" | **Medium** (MET values: Compendium of Physical Activities) | **Moderate** | **Public SEO Page**: Useful for search capture; conservative in-app integration. |

---

## 2. In-Depth Evaluation of the "Big 5" Public Acquisition Calculators

### 1. The BMR & ICMR Indian Benchmark Calculator
- **Mathematical Specification:**
  - Standard Mifflin-St Jeor:
    $$\text{BMR} = 10W + 6.25H - 5A + S \quad (S = +5\text{ for men}, -161\text{ for women})$$
  - Indian Clinical Context Display: In addition to the raw number, the calculator compares the result to the **ICMR-NIN 2024 Reference Norms** (2,110 kcal for 65kg sedentary adult man; 1,660 kcal for 55kg sedentary adult woman), explaining why genetic body fat percentage differences matter.
- **Conversion Strategy:** Users receive their number and see: *"Ready to turn your BMR into a real Indian meal plan? Click here to start tracking for free."*

### 2. The Katori-to-Gram Converter (The Viral Differentiator)
- **Why It Wins:** None of the major global platforms (MyFitnessPal, Lose It!, Cronometer) understand a "katori". Healthify only allows generic selection.
- **Interactive UI:** A visual selector with 3 standard Indian stainless-steel vessels:
  - *Small Katori (Chhoti Katori - 120 ml)*: 100g cooked dal, 80g dry sabzi, 100g dahi.
  - *Standard Katori (Medium Katori - 180 ml)*: 155g cooked dal, 130g dry sabzi, 150g dahi, 140g cooked rice.
  - *Large / Thali Bowl (Badi Katori - 250 ml)*: 220g cooked dal, 190g sabzi, 200g cooked rice.
- **SEO Advantage:** Instant Google snippet capture for queries like `1 katori dal in grams`, `how much is 1 bowl of rice in grams`.

### 3. The Indian Calorie Deficit Planner
- **The Problem It Solves:** Western deficit calculators often recommend arbitrary crash targets (e.g. 1,000 kcal/day), which leads to binge eating, lethargy, and loss of lean muscle mass.
- **Safety Algorithm:**
  1. Computes TDEE.
  2. Offers 3 scientifically validated tiers:
     - **Gentle Fat Loss (10–15% deficit):** Preserves 100% muscle, easiest adherence.
     - **Standard Fat Loss (20% deficit):** Industry gold standard (~0.5 kg loss/week).
     - **Aggressive Deficit (25% deficit):** Capped at 25% max; triggers safety alert if calories drop below 1,200 kcal (women) or 1,500 kcal (men).
  3. Displays estimated target completion date with realistic plateau warnings.

---

*Checkpoint complete. Saved to `research/08-calculators.md`.*
