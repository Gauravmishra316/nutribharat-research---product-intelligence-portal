# Phase 9: MVP Definition, Strategic Roadmap, User Journeys, Monetization & Safety Framework

**Document ID:** `research/09-mvp-roadmap-journeys-safety.md`  
**Guiding Principle:** Solve ONE problem exceptionally well first: **Frictionless, accurate Indian home-cooked meal logging with trustworthy ICMR-NIN science**, before layering peripheral fitness features.

---

## 1. MVP Feature Scope (Ruthless Prioritization)

### Must-Have (MVP Core)
1. **Natural-Language Indian Meal Logger:** Parses sentences like *"2 rotis with ghee, 1 katori dal, and dry bhindi"* into verified itemized macros in under 15 seconds.  
   *Rationale:* Solves the #1 churn driver in fitness apps: 18-tap logging friction.
2. **IFCT 2017 Verified Indian Food Database:** 500+ common Indian home and street foods with curated macros (no unverified crowdsourced garbage).  
   *Rationale:* Eliminates conflicting 25-entry search results for basic dal and roti.
3. **The "Household Measure" Engine (Katori & Ghee Modifiers):** Seamless toggle for small/medium/large katori and dry vs. ghee-brushed rotis.  
   *Rationale:* Accounts for 200–400 hidden calories in Indian home cooking without requiring a kitchen scale.
4. **ICMR-NIN 2024 Calorie & Protein Engine:** TDEE, BMR, and safe deficit targets calibrated for South Asian body composition.  
   *Rationale:* Establishes clinical credibility against generic Western calorie calculators.
5. **The Big 5 Macro Dashboard:** Daily Calories, Protein, Carbs, Fat, and Dietary Fiber with adherence indicators.  
   *Rationale:* Essential metrics for weight loss and blood sugar management without overwhelming users.

### Should-Have (Fast Follow in V1.1)
1. **"Calorie Budget Remaining" Meal Solver:** "I have 450 calories left for dinner—show me 3 Indian meals I can eat."  
   *Rationale:* Directly satisfies one of the highest-frequency daily user anxieties.
2. **Weekly Calorie Bank (Adherence Neutrality):** Displays 7-day caloric average to absorb weekend cheat meals without psychological guilt.  
   *Rationale:* Drastically improves 30-day retention and prevents binge-restrict cycles.
3. **Weight Trend Smoothing (Exponential Moving Average):** Dampens daily water weight fluctuations caused by high-sodium Indian restaurant food.  
   *Rationale:* Prevents panic and premature diet abandonment.

### Later (V2 / V3)
1. **Computer Vision Photo Logging:** Taking a photo of a thali to auto-detect portions. (Delayed due to API costs and inability to detect cooking oil depth).
2. **Wearable Sync (Google Fit / Apple Health / Smartwatches):** Syncing steps and active burn. (Delayed because manual step input is sufficient for MVP).
3. **Regional Indian Language UI:** Hindi, Tamil, Telugu, Marathi localizations. (Delayed until English urban product-market fit is established).

### Avoid Initially (Explicit Anti-Scope)
- **1-on-1 Human Tele-Coaching Marketplace:** High operational overhead; creates predatory sales incentives that ruin user trust (the primary consumer grievance with Healthify).
- **Selling Supplements / Cloud Kitchen Delivery:** Distorts recommendation objectivity.
- **Complex Micronutrient Charts (Vitamins A-K, Zinc, Selenium):** Distracts from caloric balance and protein intake.

---

## 2. Product Roadmap: MVP → V2 → V3

```
┌────────────────────────────┐    ┌────────────────────────────┐    ┌────────────────────────────┐
│         MVP (V1.0)         │    │          V2.0              │    │          V3.0              │
│  "The Frictionless Logger" │ ─► │ "The Adaptive Nutritionist"│ ─► │ "The Metabolic Companion"  │
└────────────────────────────┘    └────────────────────────────┘    └────────────────────────────┘
• Natural-Language NLP Input     • Dynamic Expenditure (TDEE)  • AI Photo Food Logging
• IFCT 2017 Curated Database       adaptive algorithm            • Smart Barcode Packaged Food
• Katori & Ghee Calibrator       • Indian Meal Solver          • Regional Language Prompts
• ICMR-NIN 2024 Calculators      • Family Pot Recipe Splitter    (Hindi, Tamil, Marathi)
• Big 5 Daily Macro Dashboard    • Wearable Steps Sync         • Clinical Export for Doctors
• Export & Save Daily Logs       • WhatsApp Quick-Log Bot      • Micronutrient & PCOS Guides
```

---

## 3. Key User Journeys (Step-by-Step Walkthroughs)

### Journey A: New User Onboarding (Under 60 Seconds)
1. **Arrival:** User lands on public `/calculators/tdee/` from a Google search.
2. **Input:** Enters Age (28), Sex (Male), Height (175 cm), Weight (78 kg), Desk Job (Sedentary).
3. **Instant Insight:** Calculates TDEE (2,150 kcal). App shows: *"To lose 0.4 kg/week safely, your target is 1,750 kcal/day with 85g protein (ICMR-NIN standard)."*
4. **1-Click Activation:** User clicks *"Track My First Meal"*. Profile is cached locally—no forced password/SMS wall before value delivery.

### Journey B: The Indian-Food Natural-Language Logging Experience (The "Aha!" Moment)
1. **User Action:** After lunch, user opens app, taps the mic or types:  
   `"Had 2 rotis with ghee, 1 katori yellow dal, dry bhindi sabzi, and a small glass of salted chaas"`
2. **Parsing (Instant):** The NLP engine splits the input into 4 items, recognizes "with ghee" (+45 kcal), and maps "katori" to 180g standard volume.
3. **Visual Confirmation Card:** Displays itemized list:
   - Roti (x2, ghee brushed): 215 kcal, 6.0g P
   - Yellow Dal (1 katori, 180g): 155 kcal, 8.2g P
   - Bhindi Sabzi (1 katori, 150g): 110 kcal, 2.5g P
   - Salted Chaas (250 ml): 48 kcal, 2.2g P
   - *Total: 528 kcal | 18.9g Protein | 62g Carbs | 21g Fat*
4. **Save:** User taps *"Confirm & Add to Lunch"*. Done in 8 seconds.

### Journey C: Returning User Facing Dinner Dilemma ("What Can I Eat?")
1. **User Status:** User has consumed 1,250 kcal out of 1,750 kcal daily budget. Remaining: **500 kcal, needs 30g protein to hit daily goal**.
2. **Action:** User taps *"Suggest Dinner"*.
3. **System Options:**
   - *Option 1 (Quick Cook):* 150g Low-fat Paneer Bhurji + 1 Dry Phulka (420 kcal, 32g protein).
   - *Option 2 (High Protein Budget):* 50g Soya Chunks Curry + 1 cup Rice + Cucumber Salad (410 kcal, 29g protein).
   - *Option 3 (Non-Veg):* 150g Grilled Chicken Breast + 1 Katori Dal (430 kcal, 42g protein).
4. **Selection:** User selects Option 1, which pre-populates their dinner log.

---

## 4. Evidenced Monetization Strategy

### Analysis of Competitor Revenue Models in India

| Model | Competitor Precedent | Evidence of Indian Willingness to Pay | Verdict for NutriBharat |
| :--- | :--- | :--- | :--- |
| **Freemium + Annual Pro Subscription** | Healthify (₹2,499/yr), Fittr (₹2,000+/mo coaching), MacroFactor (~₹5,900/yr) | Indian consumers resist recurring monthly charges without UPI AutoPay, but pay upfront for annual value (₹999 – ₹1,999/yr sweet spot). | **Primary Revenue Engine (NutriBharat Pro at ₹999 – ₹1,499/year)** |
| **Micro-Transactions / AI Token Credits** | Emerging AI utilities | Pay-per-log creates friction and encourages users not to log meals, accelerating churn. | **Avoid** |
| **Intrusive Display Ads** | MyFitnessPal Free Tier | Ruinous to UI aesthetic; low CPM in India ($0.50–$1.50 per 1,000 impressions). Destroys trust. | **Avoid initially** |
| **Corporate / B2B Wellness Plans** | Cult.fit / Healthify corporate wellness | High contract values (₹50k–₹5L per corporate employer) for employee metabolic health tracking. | **V2 Expansion Strategy** |

### NutriBharat Tier Structure
- **Free Tier (Forever Free & Generous):** Unlimited natural-language meal logging, full IFCT 2017 Indian food database, core BMR/TDEE calculators, Big 5 daily macro tracking.
- **NutriBharat Pro (₹99/month or ₹999/year with UPI):**
  1. *Adaptive Expenditure Algorithm:* Adjusts calorie targets dynamically based on scale weight trends (MacroFactor-style).
  2. *Smart Indian Meal Solver:* Unlimited "What can I eat for my remaining calories?" suggestions.
  3. *WhatsApp Quick Logging:* Log meals by sending text or voice notes directly to a verified WhatsApp business bot.
  4. *Doctor/Dietitian PDF Export:* Clean, clinical one-page summary of 30-day macro adherence and weight trends.

---

## 5. Safety, Clinical Accuracy & Medical Boundaries

### Strict Medical Disclaimers & Ethics Framework
1. **Not Medical Advice:**
   - Every report, calculator, and diet suggestion displays:  
     *"NutriBharat is a nutritional estimation and educational tool, not a medical device. Caloric and macronutrient figures are derived from the ICMR-NIN 2024 Dietary Guidelines and IFCT 2017 scientific averages. Consult a registered medical practitioner or clinical dietitian before initiating severe dietary restrictions, especially if managing diabetes, hypertension, renal impairment, or pregnancy."*
2. **Estimation Transparency & Confidence Intervals:**
   - Prepared food calories are never presented as absolute physiological constants. The app displays confidence ranges (e.g. *"Estimated: 520 kcal (±10% variance depending on cooking oil)"*).
3. **Guardrails Against Dangerous Eating Disorders:**
   - **Absolute Hard Floor:** The system programmatically refuses to calculate or endorse calorie deficit targets below **1,200 kcal/day for adult females** or **1,500 kcal/day for adult males**. If a user enters an aggressive target, an advisory banner appears citing ICMR-NIN nutritional deficiency warnings.
4. **Clinical Referrals for High-Risk Conditions:**
   - When a user selects severe symptoms (e.g. uncontrolled blood sugar, suspected eating disorders), the app displays verified helplines and prompts consultation with an Indian Dietetic Association (IDA) certified dietitian.

---

*Checkpoint complete. Saved to `research/09-mvp-roadmap-journeys-safety.md`.*
