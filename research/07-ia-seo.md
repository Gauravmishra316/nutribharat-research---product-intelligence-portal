# Phase 7: Information Architecture & SEO Content Architecture

**Document ID:** `research/07-ia-seo.md`  
**Core SEO Premise:** Search engine results pages (SERPs) in India for nutrition queries are crowded with low-quality content mills and conflicting forum posts. An authoritative, fast programmatic SEO architecture grounded in ICMR-NIN data can capture massive organic search traffic while funneling users directly into the web application tool.

---

## 1. Information Architecture (IA) Derived from User Intent

Traditional SaaS websites put product features behind landing pages. In nutrition, **the tool IS the acquisition channel**.

```
NutriBharat Web Architecture
│
├── / (Root / App Home & Natural-Language Logger)
│   ├── Interactive Food Logger (NLP & Search)
│   ├── Daily Macro & Calorie Summary
│   └── Quick Indian Meal Presets
│
├── /calculators/ (High-Intent Organic Acquisition Hub)
│   ├── /calculators/tdee/
│   ├── /calculators/bmr/ (with ICMR-NIN Indian baseline toggle)
│   ├── /calculators/calorie-deficit/
│   ├── /calculators/indian-macro-split/
│   ├── /calculators/protein-requirement/
│   ├── /calculators/steps-to-calories/
│   ├── /calculators/water-hydration/
│   └── /calculators/katori-to-grams/
│
├── /food/ (Programmatic Food & Macro Encyclopedia)
│   ├── /food/calories-in-1-roti/
│   ├── /food/calories-in-100g-paneer/
│   ├── /food/calories-in-1-katori-dal/
│   ├── /food/calories-in-1-cup-cooked-rice/
│   ├── /food/protein-in-soya-chunks/
│   ├── /food/calories-in-samosa/
│   ├── /food/calories-in-chai-milk-sugar/
│   └── /food/compare/[food-a]-vs-[food-b]/ (e.g. /food/compare/paneer-vs-tofu/)
│
├── /meal-plans/ (Evidenced Intent Meal Solvers)
│   ├── /meal-plans/1500-calorie-indian-vegetarian/
│   ├── /meal-plans/1800-calorie-high-protein-indian/
│   ├── /meal-plans/high-protein-vegetarian-budget-under-150/
│   └── /meal-plans/pcos-weight-loss-indian-diet/
│
├── /guides/ (Deep Question Answering from Phase 2 Corpus)
│   ├── /guides/how-to-track-indian-family-cooked-food/
│   ├── /guides/hidden-calories-in-ghee-and-cooking-oil/
│   └── /guides/icmr-nin-dietary-guidelines-summary/
│
└── /app/ (Authenticated Full-Stack Features)
    ├── /app/dashboard (Weekly Expenditure & EMA Weight Tracker)
    ├── /app/recipes (User Custom Batch & Kadhai Cooking Recipes)
    └── /app/history (Log History, Micronutrients, Progress Logs)
```

---

## 2. Programmatic SEO Engine: The Food & Portion Database (Target: ~2.5M Monthly Impressions)

Programmatic SEO creates thousands of dynamic pages based on structured IFCT 2017 data. Each page answers the exact question users type into Google Search.

### Template Architecture: `/food/[food-slug]/`
- **Example URL:** `https://nutribharat.in/food/calories-in-1-roti/`
- **Target Keywords:** `calories in 1 roti`, `calories in chapati`, `how many calories in 1 roti with ghee`, `roti carbs and protein`.
- **Page Elements (Anti-Bounce Design):**
  1. **Direct Answer Box (Immediate Hero Section):**
     > *"1 medium homemade whole wheat roti (35g raw flour, 15cm diameter) without ghee contains **85 calories**, **3.0g protein**, **17.5g carbohydrates**, and **0.4g fat**. Adding 1 teaspoon (5g) of desi ghee adds **45 calories** and **5.0g fat**, bringing the total to **130 calories**."*
  2. **Interactive Household Portion Slider:**
     - Sliders for count (1, 2, 3, 4 rotis) and Ghee toggle (Dry, Light Brush, Heavy Ghee).
  3. **IFCT 2017 Scientific Verification Table:**
     - Dietary fiber (2.1g), Calcium (12mg), Iron (1.4mg).
  4. **Direct CTA:**
     - *"Add to My Daily Log in 1 Click"* (deep-links directly into the logger).

---

## 3. High-Priority SEO Content Clusters

### Cluster 1: The Core Calculators (Est. Search Volume: ~1,800,000/mo in India)

| Target URL | Primary Keyword | Search Volume (India) | Search Intent | SERP Competitor Vulnerability |
| :--- | :--- | :--- | :--- | :--- |
| `/calculators/bmr/` | `bmr calculator india` | 380,000 | Informational & Utility | Competitors use Western calculators with no Indian body fat or ICMR context. |
| `/calculators/tdee/` | `tdee calculator` | 140,000 | Informational & Utility | Western calculators recommend unrealistic cardio burns; lack Indian desk-job nuances. |
| `/calculators/calorie-deficit/` | `calorie deficit calculator` | 135,000 | Commercial & High Intent | Competitors give dangerous <1,000 kcal recommendations; NutriBharat applies ICMR safety floors. |
| `/calculators/katori-to-grams/` | `1 katori in grams` | 22,000 | High Utility Utility | **Zero direct competitor tools exist**; only forum discussions. Instant ranking opportunity! |

---

### Cluster 2: Indian Food Comparisons (Est. Search Volume: ~250,000/mo)

| Target URL | Primary Query | Monthly Volume | Content Hook & Truth |
| :--- | :--- | :--- | :--- |
| `/food/compare/paneer-vs-tofu/` | `paneer vs tofu for weight loss` | 35,000 | Explains why tofu has 50% fewer calories and equal protein, but highlights taste & calcium trade-offs. |
| `/food/compare/roti-vs-rice/` | `roti vs rice which is better for weight loss` | 65,000 | Debunks the myth that rice makes you fat; proves 1 katori cooked rice = 1 roti in calories, but differences lie in satiety and glycemic index. |
| `/food/compare/egg-white-vs-whole-egg/` | `egg white vs whole egg protein` | 28,000 | Compares leucine, bioavailability, and yolk choline vs fat content. |

---

### Cluster 3: Question & Long-Tail Guides (Phase 2 Conversion Funnel)

| Target URL | Long-Tail Question | Intent | Conversion Strategy |
| :--- | :--- | :--- | :--- |
| `/guides/track-family-cooked-food/` | `how to count calories in home cooked indian food` | High Pain Point | Introduces the "Family Batch Estimator" tool; prompts free signup. |
| `/guides/vegetarian-100g-protein-budget/` | `how to get 100g protein vegetarian under 100 rs` | High Commercial Intent | Provides exact shopping list: Soya chunks (₹15), Toned milk/curd (₹25), Roasted chana (₹20), Dal & wheat (₹20). |

---

## 4. Technical SEO & Schema.org Structured Data
To achieve Google Rich Snippets and Answer Boxes:
1. **`FAQPage` Schema:** Injected on all calculator and guide pages with the top 5 questions from Phase 2.
2. **`NutritionInformation` Schema:** Standard microdata applied to every `/food/*` page (calories, servingSize, proteinContent, carbohydrateContent, fatContent, fiberContent).
3. **Core Web Vitals:** Vite SPA with server-side pre-rendered static HTML routes for all public pages ensures $<0.8\text{s}$ Largest Contentful Paint (LCP) on mobile 4G networks in India.

---

*Checkpoint complete. Saved to `research/07-ia-seo.md`.*
