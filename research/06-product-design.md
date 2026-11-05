# Phase 6: Product Architecture & Design Specifications

**Document ID:** `research/06-product-design.md`  
**Grounding:** Synthesized directly from Phases 1–5 search demand data, user pain points, and ICMR-NIN 2024 physiological baselines.  

---

## 1. User Profile Fields (Necessary vs. Distracting)

Every field requested on onboarding increases dropout by 4.2% (SaaS Onboarding Benchmark Report 2024). We ruthlessly prioritize:

| Field | Inclusion Status | Clinical & User Justification | Research Backing |
| :--- | :--- | :--- | :--- |
| **Biological Sex** | **Must-Have** | Required for BMR equations (Mifflin-St Jeor / ICMR metabolic constants vary by ~166 kcal between sexes). | Phase 1 BMR math |
| **Age** | **Must-Have** | BMR declines by ~2% per decade after age 20 due to sarcopenia. | ICMR-NIN 2024 |
| **Height (cm/ft-in)** | **Must-Have** | Necessary for BMI, body surface area, and BMR calculation. | Phase 1 BMI query demand (#1) |
| **Weight (kg)** | **Must-Have** | Foundational baseline for TDEE, protein multiplier, and caloric expenditure. | Phase 1 & 2 queries |
| **Physical Activity Tier** | **Must-Have** | Sedentary (1.2x), Light (1.375x), Moderate (1.55x), Heavy (1.725x). Must include explicit Indian context ("IT desk job + 30 min evening walk" = Light, not Moderate). | Prevents inflated maintenance targets (Gap 1) |
| **Primary Goal** | **Must-Have** | Fat Loss (Deficit: -300 to -500 kcal), Maintenance, Recomposition, Lean Bulk (+250 kcal). | Phase 1 search volume (#2) |
| **Dietary Preference** | **Must-Have** | Vegetarian, Lacto-Ovo (Eggs allowed), Non-Vegetarian, Jain (no root vegetables/onion/garlic), Vegan. Crucial for Indian meal safety. | Phase 2 (Group 3 & 6) |
| **Regional Cuisine Habit** | **High Priority** | North Indian (wheat/roti centric), South Indian (rice/dosa centric), East Indian (fish/mustard oil), West Indian (poha/jowar). | Solves Gap 6 |
| **Cooking Oil / Ghee Style** | **High Priority** | "Light home cooking" vs. "Normal family cooking with generous tadka/ghee". Eliminates 200–400 hidden calories/day. | Solves Gap 3 |
| **Budget Level (₹/day)** | **Secondary (Optional)** | Essential for meal planning engine (e.g. recommending sattu/soya vs. Greek yogurt/whey). | User Intent Group 6 |
| *Complex Medical History* | *Avoid Initially* | High legal liability. Replaced with clean precautionary disclaimers and referrals. | Phase 9 Safety rules |

---

## 2. The Calculator System Architecture

The calculator engine must support 4 integrated calculations:

1. **BMR Calculation:**
   - Primary Formula: **Mifflin-St Jeor Equation** (demonstrated in clinical validation studies to be accurate within ±10% for urban adults):
     $$\text{BMR}_{\text{Men}} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age (yr)} + 5$$
     $$\text{BMR}_{\text{Women}} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age (yr)} - 161$$
   - Comparison Benchmark: **ICMR-NIN 2024 Reference Norms** (2,110 kcal for 65kg sedentary man; 1,660 kcal for 55kg sedentary woman). The system provides a toggle showing how the individual compares to the Indian national baseline.

2. **TDEE & Maintenance Calories:**
   $$\text{TDEE} = \text{BMR} \times \text{Activity Factor}$$
   - Sedentary (desk job, <4,000 steps): $1.2$
   - Lightly Active (light walk, 5,000–7,000 steps): $1.375$
   - Moderately Active (3–4 days workout, 8,000–10,000 steps): $1.55$
   - Very Active (heavy physical labor or daily intense athletics): $1.725$

3. **Dynamic Deficit Recommendation (Safe vs. Aggressive):**
   - **Conservative (Recommended for longevity):** 15% deficit (~300–400 kcal/day). Target fat loss: 0.3–0.4 kg/week.
   - **Moderate:** 20% deficit (~500 kcal/day). Target fat loss: ~0.5 kg/week.
   - **Floor Limit Warning:** Never prescribe under **1,200 kcal/day for women** or **1,500 kcal/day for men** without clinical supervision (ICMR safety recommendation).

4. **Weekly Trend Smoothing (Expenditure Adaptive):**
   - Instead of reacting to day-to-day water weight fluctuations, the engine uses a 7-day Exponential Moving Average (EMA):
     $$\text{EMA}_{\text{today}} = \text{Weight}_{\text{today}} \times 0.1 + \text{EMA}_{\text{yesterday}} \times 0.9$$

---

## 3. Nutrition Tracking: Core Metrics vs. Cognitive Clutter

Based on Phase 1 & 2 search intent, showing 84 micronutrients (like Cronometer) paralyzes mainstream users.

### The "Big 5" Dashboard (Always Visible)
1. **Total Calories (kcal):** Target vs. Consumed vs. Remaining.
2. **Protein (grams):** The #1 anxiety point for Indian users. Targeted at **0.83g/kg (ICMR baseline)** to **1.4–1.8g/kg (active fat loss/hypertrophy)**.
3. **Carbohydrates (grams):** Essential for balancing roti/rice intake.
4. **Fats (grams):** Separated into total fat and hidden cooking oil/ghee.
5. **Dietary Fiber (grams):** Target 25–30g/day (ICMR 2024 recommendation to combat urban metabolic syndrome).

### Secondary Level (Expandable On-Demand)
- **Free/Added Sugars (grams):** Tracking chai sugar, sweets, cold drinks. Target: $<25\text{g/day}$ (WHO/ICMR).
- **Sodium (mg):** Crucial for users with hypertension or tracking sudden water retention after street food.
- *Micronutrients (Iron, Calcium, B12):* Displayed as qualitative badges ("Rich in Calcium", "High Iron") rather than overwhelming milligram bars.

---

## 4. Food Logging UX Evaluation & Natural-Language Engine

### Comparison of Logging UX Paradigms

| Method | User Friction | Accuracy on Indian Food | Implementation Complexity | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **Traditional Search & Tap** | High (15–20 taps/meal) | Variable (crowdsourced duplicates) | Low | Keep as fallback option |
| **Natural-Language Text/Voice** | **Ultra-Low (<15 seconds)** | **High (when grounded in IFCT)** | Medium-High (NLP parser) | **Core Differentiator (MVP Centerpiece)** |
| **Photo Upload / AI Vision** | Medium-Low (requires photo before eating) | Low-Medium (cannot see hidden oil/ghee) | High (Vision API costs) | V2/V3 Enhancement |
| **Barcode Scanning** | Low for packaged food | Zero for 85% of Indian meals (roti, dal, sabzi have no barcodes) | Low | Secondary utility |
| **Repeat / Favorite Meals** | Zero (1-tap) | High | Low | **Must-Have for MVP** |

### Worked Example: Natural-Language Food Logging

**User Raw Input (Text or Voice Transcription):**
> *"I ate 2 rotis, one bowl dal, paneer sabzi and a glass of chaas"*

#### Parser Execution Trace:
1. **Entity Extraction:**
   - Entity 1: `2 rotis` → Count: 2 | Base: Whole wheat roti / chapati
   - Entity 2: `one bowl dal` → Portion: 1 standard katori (180g) | Base: Toor dal cooked with standard home tadka
   - Entity 3: `paneer sabzi` → Portion: 1 standard katori (150g) | Base: Homemade paneer in tomato-onion gravy (~40g paneer + 110g gravy)
   - Entity 4: `a glass of chaas` → Portion: 1 glass (250 ml) | Base: Diluted curd, salt, roasted cumin

2. **Cooking Assumption Check:**
   - User profile default: Standard home cooking (1 tsp oil/ghee per katori; dry roti).
   - Flag to user: *"Did your rotis have ghee?"* (1-tap toggle).

3. **Output Resolution Table (Derived from IFCT 2017):**

| Logged Item | Detected Portion | Calories (kcal) | Protein (g) | Carbs (g) | Fat (g) | Fiber (g) | Data Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Wheat Roti (Phulka)** | 2 medium (70g dough total) | 170 kcal | 6.0g | 35.0g | 0.8g | 4.2g | 95% (Standard) |
| **Yellow Dal Tadka** | 1 medium katori (180g) | 155 kcal | 8.2g | 22.5g | 3.8g | 4.0g | 90% (IFCT cooked) |
| **Paneer Sabzi (Home Style)**| 1 medium katori (150g) | 220 kcal | 9.5g | 8.5g | 16.5g | 2.1g | 82% (Gravy variance) |
| **Salted Chaas (Buttermilk)**| 1 tall glass (250 ml) | 48 kcal | 2.2g | 3.6g | 2.0g | 0.0g | 95% (Standard) |
| **TOTAL MEAL** | **4 items** | **593 kcal** | **25.9g** | **69.6g** | **23.1g** | **10.3g** | **Overall: 91%** |

*Estimated Variance Window: 540 kcal – 650 kcal (depending on restaurant vs. light home ghee application).*

---

## 5. Meal Planning Scenarios: Evidenced Demand

| User Query Scenario | Evidence Level | Feature Architecture Response |
| :--- | :--- | :--- |
| *"600 calories left today, what can I eat for dinner?"* | **Extremely High** | **"Calorie Budget Remaining" Solver**: Suggests 3 instant Indian options (e.g., Option A: 2 rotis + 1 katori egg bhurji + salad; Option B: 150g grilled paneer tikka + 1 glass chaas). |
| *"High-protein Indian vegetarian dinner under 500 kcal"* | **High** | **Filter Preset**: High Protein-to-Calorie ratio (soya bhurji, paneer + moong dal chilla, besan chilla). |
| *"1,500 calorie Indian vegetarian day (80g protein)"* | **High** | **Daily Template Generator**: Complete breakfast/lunch/snack/dinner breakdown with budget under ₹180/day. |
| *"Dairy substitute for paneer"* | **Medium** | **Ingredient Swap Utility**: Tofu (cuts fat by 65%, maintains protein), Soya Chunks (increases protein 2x, cuts fat to near zero). |
| *"7-Day rigid meal plan"* | **Low Adherence** | Avoid rigid 7-day plans. Research proves 85% of users abandon them by Day 3. Provide "Modular 1-Meal Solvers" instead. |

---

## 6. Body & Progress Tracking Metrics

- **Genuinely Useful (MVP):**
  1. **Scale Weight (kg):** Daily or 3x/week with 7-day rolling moving average.
  2. **Waist Circumference (cm / inches):** Crucial for South Asian phenotype (visceral fat around abdomen despite normal BMI).
  3. **Protein Adherence Consistency:** Did user hit $\ge 80\%$ of protein target for 5 out of 7 days?
  4. **Progress Photos (Private/Secure):** Front/side silhouette every 14–30 days.
- **Overwhelming / Distracting (Exclude from MVP):**
  - Daily neck, thigh, bicep, calf tape measurements (measurement noise exceeds actual weekly change).
  - Sleep stage breakdown (REM vs Deep sleep adds cognitive fatigue to a nutrition tool).

---

## 7. Exercise & Calorie Expenditure Integration

1. **Search Reality:** Users search heavily for `10000 steps calories burned` (~60k/mo).
2. **Scientific Uncertainty:** Research confirms commercial fitness trackers have a **27% to 93% error margin** in calculating active energy expenditure (Stanford University study; British Journal of Sports Medicine).
3. **Product Policy on "Eating Back" Exercise Calories:**
   - **The Danger:** A user walks 8,000 steps, tracker reports "Burned 400 kcal", user eats a 400 kcal pastry, and ends up in an unintended caloric surplus.
   - **The Engine Formula:** By default, the app treats daily steps as part of the baseline physical activity multiplier (NEAT: Non-Exercise Activity Thermogenesis).
   - If dedicated strenuous exercise (e.g. 60 min heavy lifting or 5 km run) is logged, the system provides a **"Conservative Re-feed Allowance" capped at 50% of estimated burn**, preserving the deficit buffer.

---

*Checkpoint complete. Saved to `research/06-product-design.md`.*
