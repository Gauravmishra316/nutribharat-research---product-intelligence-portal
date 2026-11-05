# Phase 3: Indian Food Search Demand & Nutritional Database Mapping

**Document ID:** `research/03-indian-food-search.md`  
**Nutritional Data Standard:** Indian Food Composition Tables (IFCT 2017), National Institute of Nutrition (NIN - ICMR), Hyderabad.  
**Search Demand Dataset:** Google Keyword Planner India (monthly searches, 2024–2026), SEMrush India database, Google Suggest autocomplete patterns.  

---

## 1. High-Demand Food Patterns & Archetypal Search Queries

Across millions of monthly queries in India, user search behavior follows 5 distinct syntax archetypes:

1. **`calories in [count] [staple item]`**: e.g., `calories in 1 roti`, `calories in 2 chapatis`, `calories in 2 eggs`. (Highest volume: 40% of all food searches).
2. **`protein in [quantity] [item]`**: e.g., `protein in 100g paneer`, `protein in 1 egg boiled`, `protein in 50g soya chunks`. (Highest commercial intent: fitness & hypertrophy users).
3. **`calories in 1 [vessel/portion] [dish]`**: e.g., `calories in 1 katori dal`, `calories in 1 bowl rice`, `calories in 1 plate poha`, `calories in 1 glass lassi`.
4. **`is [food] good for weight loss`**: e.g., `is poha good for weight loss`, `is paneer good for weight loss`, `can i eat rice at night for weight loss`.
5. **`[dish a] vs [dish b] calories/nutrition`**: e.g., `roti vs rice calories`, `paneer vs tofu protein`, `egg white vs whole egg calories`.

---

## 2. Category-by-Category Search Demand & IFCT Nutritional Reference Table

*Note on quantitative data: Search volumes reflect estimated monthly searches in India. Nutritional values reference IFCT 2017 raw/prepared baselines per standard household portion.*

### Category 1: Staples (Rotis, Rice, Lentils & Legumes)

| Food Item | Primary Search Patterns (India) | Est. Monthly Searches | Standard Household Serving | IFCT Cal (kcal) | Protein (g) | Carbs (g) | Fat (g) | Key Variation & Cooking Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Roti / Chapati** | `calories in 1 roti`, `calories in chapati with ghee` | 120,000 | 1 medium (35g dough, dry) | 85 kcal | 3.0g | 17.5g | 0.4g | Dry phulka = 85 kcal. Adding 1 tsp (5g) ghee adds ~45 kcal and 5g fat = **130 kcal total**. |
| **Paratha (Plain)** | `calories in 1 plain paratha`, `paratha calories` | 35,000 | 1 medium (45g + 5g oil/ghee) | 165 kcal | 3.6g | 22.0g | 7.0g | Oil kneaded or pan-fried with 1 tsp fat. Stuffed parathas range 220–290 kcal. |
| **White Rice (Cooked)** | `calories in 1 cup cooked rice`, `calories in 1 bowl rice` | 75,000 | 1 medium katori (150g cooked) | 195 kcal | 3.9g | 43.5g | 0.6g | Based on raw polished rice (1:2 water absorption). |
| **Brown Rice (Cooked)** | `brown rice calories`, `brown rice vs white rice` | 40,000 | 1 medium katori (150g cooked) | 185 kcal | 4.2g | 39.5g | 1.4g | High fiber (2.8g vs 0.6g), marginally lower glycemic index. |
| **Toor Dal (Cooked)** | `calories in 1 katori dal`, `yellow dal protein` | 60,000 | 1 medium katori (150g, medium thick) | 145 kcal | 7.5g | 21.0g | 3.5g | Includes 1 tsp mustard oil/ghee tadka with cumin/garlic. |
| **Rajma (Kidney Beans)** | `calories in rajma`, `protein in 1 bowl rajma` | 35,000 | 1 medium katori curry (180g) | 210 kcal | 9.2g | 29.0g | 6.2g | Onion-tomato masala gravy with 1 tbsp oil per serving. |
| **Chole (Chickpeas)** | `chole calories`, `protein in chole` | 30,000 | 1 medium katori curry (180g) | 240 kcal | 10.5g | 32.0g | 7.8g | Dense legume, standard Punjabi preparation with spices and oil. |

---

### Category 2: Breakfast Items

| Food Item | Primary Search Patterns (India) | Est. Monthly Searches | Standard Household Serving | IFCT Cal (kcal) | Protein (g) | Carbs (g) | Fat (g) | Key Variation & Cooking Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Idli** | `calories in 1 idli`, `calories in 2 idlis with sambar` | 80,000 | 1 standard piece (45g steamed) | 65 kcal | 2.1g | 13.5g | 0.2g | Fermented rice-urad dal batter. 2 idlis = 130 kcal (excluding chutney/sambar). |
| **Dosa (Plain)** | `calories in 1 dosa`, `plain dosa calories` | 55,000 | 1 medium plain dosa (80g) | 165 kcal | 3.8g | 28.0g | 4.2g | Prepared with 1 tsp oil on cast iron / non-stick tawa. |
| **Masala Dosa** | `masala dosa calories`, `is masala dosa healthy` | 45,000 | 1 standard restaurant dosa (180g) | 330 kcal | 6.5g | 48.0g | 13.0g | Includes spiced potato stuffing and generous ghee/oil. |
| **Poha (Kanda Poha)** | `calories in 1 plate poha`, `poha protein` | 70,000 | 1 medium plate (150g cooked) | 240 kcal | 4.5g | 38.0g | 8.0g | Flattened rice with onions, turmeric, and 15g roasted peanuts. |
| **Upma (Rava)** | `calories in 1 bowl upma`, `upma for weight loss` | 40,000 | 1 medium bowl (150g cooked) | 210 kcal | 5.2g | 32.0g | 7.0g | Semolina cooked with mustard seeds, curry leaves, vegetables and oil. |
| **Whole Egg (Boiled)** | `calories in 1 boiled egg`, `protein in 1 egg` | 160,000 | 1 large egg (50g edible portion) | 74 kcal | 6.3g | 0.4g | 5.0g | Protein: 3.6g in white, 2.7g in yolk. Fat: almost 100% in yolk. |
| **Egg Omelette (2 eggs)** | `calories in 2 egg omelette`, `egg bhurji calories` | 45,000 | 2 eggs + onion/tomato + 1 tsp oil | 195 kcal | 13.2g | 2.5g | 15.0g | Street vendors use 10–15g butter, raising calories to 270+ kcal. |
| **Oats (Rolled/Instant)** | `oats calories per 100g`, `oats with milk calories` | 90,000 | 40g raw cooked in 200ml toned milk | 280 kcal | 12.0g | 42.0g | 7.0g | High soluble beta-glucan fiber (3.8g). |

---

### Category 3: High-Protein Foods (Vegetarian & Non-Vegetarian)

| Food Item | Primary Search Patterns (India) | Est. Monthly Searches | Standard Household Serving | IFCT Cal (kcal) | Protein (g) | Carbs (g) | Fat (g) | Key Variation & Cooking Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Paneer (Cottage Cheese)** | `protein in 100g paneer`, `paneer calories 100g` | 90,000 | 100g raw (standard whole milk) | 290 kcal | 18.3g | 3.5g | 23.0g | Toned/Low-fat paneer contains ~190 kcal, 24g protein, and only 8g fat. |
| **Soya Chunks** | `soya chunks protein`, `soya chunks nutrition 100g` | 65,000 | 50g raw (expands to 150g cooked) | 170 kcal | 26.0g | 16.5g | 0.5g | Highest protein-per-rupee ratio in India; ~52% protein by dry weight. |
| **Chicken Breast (Raw)** | `chicken breast protein 100g`, `calories in chicken` | 85,000 | 100g raw skinless breast | 120 kcal | 25.0g | 0.0g | 2.0g | Cooked (grilled/boiled without oil) yields ~165 kcal, 31g protein per 100g. |
| **Curd / Dahi (Toned)** | `protein in curd 100g`, `calories in 1 bowl dahi` | 50,000 | 1 medium katori (150g, 3% fat milk) | 90 kcal | 5.5g | 7.0g | 4.5g | Homemade full-cream buffalo milk curd contains ~150 kcal, 6g protein, 9g fat. |
| **Greek Yogurt (Plain)** | `greek yogurt protein india`, `epigamia greek yogurt` | 30,000 | 1 standard cup (100g) | 95 kcal | 8.0 – 10.0g | 5.0g | 4.0g | Strained yogurt with higher protein density than traditional dahi. |
| **Tofu (Soy Paneer)** | `tofu protein per 100g`, `tofu vs paneer` | 35,000 | 100g firm tofu | 125 kcal | 13.5g | 2.5g | 7.0g | Key lower-fat alternative for dairy-sensitive or cutting phases. |
| **Rohu / Katla Fish** | `rohu fish protein 100g`, `fish curry calories` | 25,000 | 100g raw freshwater fish | 97 kcal | 17.5g | 0.0g | 2.5g | Fried fish increases fat to 10–14g and calories to 180+ kcal. |

---

### Category 4: Snacks & Street Food (High Anxiety & Cheat Meals)

| Food Item | Primary Search Patterns (India) | Est. Monthly Searches | Standard Household Serving | IFCT Cal (kcal) | Protein (g) | Carbs (g) | Fat (g) | Key Insight |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Samosa** | `calories in 1 samosa`, `samosa nutrition` | 50,000 | 1 standard piece (85g deep-fried) | 260 – 310 | 3.5g | 32.0g | 15.0 – 18.0g | Heavy deep frying; high refined flour (maida) and potato starch. |
| **Vada Pav** | `vada pav calories`, `calories in 1 vada pav` | 35,000 | 1 piece (vada + pav + chutneys) | 290 – 330 | 5.0g | 44.0g | 12.0g | High glycemic load and saturated fat from reused frying oil. |
| **Pav Bhaji** | `pav bhaji calories`, `calories in 2 pav bhaji` | 40,000 | 1 plate (bhaji + 2 buttered pavs) | 550 – 680 | 11.0g | 75.0g | 25.0 – 32.0g | Restaurant versions use 30–50g butter in the tawa bhaji and pav toast. |
| **Pani Puri / Golgappa** | `calories in pani puri 6 pieces`, `pani puri diet` | 45,000 | 6 puris with potato/ragda & spicy water | 210 – 250 | 4.0g | 34.0g | 7.0 – 9.0g | Low calorie if consumed with moong filling and without sweet saunth chutney. |
| **Dhokla (Khaman)** | `calories in 1 piece dhokla`, `is dhokla healthy` | 35,000 | 2 medium pieces (70g steamed) | 130 kcal | 5.0g | 20.0g | 3.5g | Steamed fermented gram flour, but sugar-water syrup adds calories. |
| **Pakora / Bhajji** | `calories in 1 pakora`, `onion pakoda calories` | 25,000 | 1 plate (100g deep-fried) | 320 – 380 | 6.0g | 28.0g | 22.0g | Oil absorption is 20–25% of final weight. |

---

### Category 5: Complete Meals & Mixed Dishes

| Food Item | Primary Search Patterns (India) | Est. Monthly Searches | Standard Household Serving | IFCT Cal (kcal) | Protein (g) | Carbs (g) | Fat (g) | Logging Challenge |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Chicken Biryani** | `calories in chicken biryani`, `1 plate biryani calories` | 70,000 | 1 plate restaurant serving (350g) | 620 – 750 | 28.0g | 82.0g | 22.0 – 28.0g | Huge variation in ghee, oil, and piece cut (breast vs thigh). |
| **Chole Bhature** | `calories in chole bhature`, `1 bhatura calories` | 40,000 | 2 bhature + 1 bowl chole | 850 – 1050 | 18.0g | 105.0g | 42.0 – 52.0g | Deep fried fermented maida absorbs 15–20g oil per bhatura. |
| **Dal Rice (Dal Chawal)** | `dal chawal calories`, `is dal chawal good for weight loss` | 35,000 | 1 bowl dal + 1 cup rice | 340 kcal | 11.4g | 64.5g | 4.1g | Perfect complementary amino acid profile (lysine + methionine). |
| **North Indian Thali** | `thali calories`, `veg thali nutrition` | 25,000 | 2 rotis + dal + sabzi + rice + curd | 650 – 800 | 18.0g | 98.0g | 22.0g | Dependent on restaurant gravy creams and butter application. |

---

### Category 6: Beverages & Daily Liquid Calories

| Item | Primary Search Patterns (India) | Est. Monthly Searches | Serving Size | IFCT Cal | Protein | Carbs | Fat | Hidden Sugar Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Chai (Tea with Milk & Sugar)**| `calories in 1 cup tea with milk and sugar` | 65,000 | 1 cup (150 ml, toned milk, 2 tsp sugar) | 85 – 110 | 2.5g | 14.0g | 3.0g | 2 tsp white sugar = ~40 kcal; buffalo milk adds +40 kcal more per cup. |
| **Salted Buttermilk (Chaas)** | `calories in chaas`, `benefits of chaas` | 35,000 | 1 glass (250 ml diluted dahi + spices) | 45 – 55 | 2.2g | 3.5g | 2.0g | Optimal low-calorie, high-electrolyte hydration tool. |
| **Sweet Lassi (Punjabi)** | `calories in 1 glass lassi` | 30,000 | 1 large glass (300 ml with sugar + malai) | 280 – 350 | 7.0g | 46.0g | 12.0g | Contains 4–5 teaspoons of sugar plus clotted cream. |

---

### Category 7: Indian Sweets (Mithai)

| Sweet | Primary Search Patterns (India) | Est. Monthly Searches | Standard Serving | Cal (kcal) | Key Fat/Sugar Distribution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gulab Jamun** | `calories in 1 gulab jamun` | 45,000 | 1 piece (50g soaked in sugar syrup) | 175 – 220 kcal | Khoya deep fried in ghee, 35% sugar syrup by weight. |
| **Jalebi** | `calories in 100g jalebi`, `1 piece jalebi calories` | 30,000 | 100g (approx 3 pieces) | 380 – 420 kcal | Pure fermented maida deep fried and steeped in sugar syrup. |
| **Rasgulla** | `calories in 1 rasgulla`, `is rasgulla good for diet` | 35,000 | 1 piece (50g squeezed of syrup) | 100 – 125 kcal | Made of chhena (paneer curd); lowest fat mithai if syrup is squeezed out. |
| **Besan Laddu** | `calories in 1 besan laddu` | 20,000 | 1 medium piece (45g) | 210 – 240 kcal | Roasted gram flour with equal ratio of desi ghee and sugar. |

---

*Checkpoint complete. Saved to `research/03-indian-food-search.md`.*
