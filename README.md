# 🇮🇳 NutriBharat — Research & Product Intelligence Portal

[![React 19](https://img.shields.io/badge/React-19.0-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Google GenAI SDK](https://img.shields.io/badge/Google_Gemini-API_v2.4-orange.svg?logo=google)](https://ai.google.dev/)
[![ICMR-NIN & IFCT](https://img.shields.io/badge/Data_Standard-ICMR--NIN_%26_IFCT_2017-green.svg)](https://www.nin.res.in/)

> A full-stack, India-first nutrition intelligence portal and health engine. Built to bridge the critical gap in existing calorie-tracking platforms by incorporating authentic Indian dietary habits, standard Indian household measurements (*katori*, *roti*, *ladle*, *spoons*), regional recipes, and Gemini-powered natural language meal logging.

---

## 📸 Application Screenshots & Visual Previews

### 1. Indian Food & Regional Nutrition Database (ICMR-NIN & IFCT 2017)
![Indian Food Database](screenshots/food-database.png)

### 2. Interactive Calculator Workbench (BMR, TDEE, Deficit & Macros)
![Calculator Workbench](screenshots/calculator-preview.png)

### 3. Natural Language AI Meal Logger (Gemini-Powered Hinglish/English)
![Natural Language Logger](screenshots/nlp-logger-preview.png)

---

## ✨ Key Features

1. **ICMR-NIN Calibrated Food Database**:
   - Covers regional Indian cuisines (North, South, East, West).
   - Household measurement units: *katori*, *roti*, *piece*, *teaspoon*, *tablespoon*, and *grams*.
   - Filter by diet preference (**Vegetarian**, **Non-Vegetarian**, **Vegan**, **Jain**).

2. **AI Natural Language Meal Logger**:
   - Powered by **Google Gemini API**.
   - Accepts multi-item natural conversational inputs in **English**, **Hindi**, or colloquial **Hinglish**.
   - Automatically decomposes complex meals into ingredients, calculates nutritional breakdown, and suggests corrections.

3. **Clinical & Fitness Calculators**:
   - **Mifflin-St Jeor & Harris-Benedict BMR / TDEE** calculators calibrated for South Asian body composition profiles.
   - Macro nutrient distribution tailored for vegetarian and non-vegetarian Indian food options.
   - Water and electrolyte hydration planner based on Indian climate zones.

4. **NutriBharat Market & User Research Suite**:
   - In-depth market demand analysis for Indian nutrition.
   - Competitor benchmarking matrix (vs. MyFitnessPal, HealthifyMe, Fittr, Cronometer).
   - Real search queries, user questions explorer, and product gap documentation.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User["User Client (Browser)"] --> UI["React 19 + Tailwind CSS Frontend"]
    
    subgraph UI_Components ["UI Components"]
        FoodDB["Food Database & Search"]
        Calc["Calculator Workbench"]
        NLP["Natural Language Meal Logger"]
        QExp["Questions & Insights Explorer"]
    end
    
    UI --> UI_Components
    
    subgraph State_And_Storage ["Persistence & Standards"]
        LocalStore["localStorage (Diet & Profile Cache)"]
        IFCT["ICMR-NIN & IFCT 2017 Dataset"]
    end
    
    FoodDB --> IFCT
    Calc --> LocalStore
    
    subgraph AI_Backend ["AI Intelligence Layer"]
        Gemini["Google Gemini GenAI SDK"]
    end
    
    NLP --> Gemini
```

---

## 🚀 Getting Started

Follow these step-by-step instructions to run the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.0.0 or higher recommended) -> [Download Node.js](https://nodejs.org/)
- **npm** (comes bundled with Node.js) or **yarn** / **pnpm**
- **Git** -> [Download Git](https://git-scm.com/)

---

### Step-by-Step Installation Guide

#### 1. Clone the Repository
```bash
git clone https://github.com/Gauravmishra316/nutribharat-research---product-intelligence-portal.git
cd nutribharat-research---product-intelligence-portal
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Open `.env.local` and add your **Google Gemini API Key**:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
> [!TIP]
> You can generate a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

#### 4. Run Development Server
```bash
npm run dev
```
Once started, open your browser and navigate to:
```
http://localhost:3000
```

#### 5. Build for Production
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 📂 Project Directory Structure

```
nutribharat-research-&-product-intelligence-portal/
├── research/                               # Strategic market & product research
│   ├── 01-search-demand.md                 # Search volume & Indian user intent
│   ├── 02-user-questions.md                # Real consumer nutrition FAQs
│   ├── 03-indian-food-search.md            # Nutritional taxonomy of regional food
│   ├── 04-competitors.md                   # Market competitor landscape
│   ├── 05-gaps.md                          # Identified industry gaps & opportunities
│   ├── 06-product-design.md                # UX/UI principles & IA
│   ├── 07-ia-seo.md                        # Information architecture & SEO strategy
│   ├── 08-calculators.md                   # Mathematical models & formulas
│   └── 09-mvp-roadmap-journeys-safety.md   # Product roadmap & clinical disclaimers
├── src/
│   ├── components/
│   │   ├── CalculatorWorkbench.tsx         # BMR, TDEE, Deficit & Macro Calculators
│   │   ├── CompetitorMatrix.tsx            # Interactive competitor analysis table
│   │   ├── FoodDatabase.tsx                # Indian food database & portion converter
│   │   ├── NaturalLanguageLogger.tsx       # AI meal parser (Gemini API)
│   │   ├── Navbar.tsx                      # Top bar with veg/non-veg diet toggle
│   │   ├── QuestionExplorer.tsx            # Consumer question search & insights
│   │   └── ReportViewer.tsx                # Embedded report viewer
│   ├── data/
│   │   └── researchData.ts                 # Master dataset, food list, calculations
│   ├── App.tsx                             # Main dashboard & tab routing
│   ├── index.css                           # Tailwind CSS stylesheet
│   └── main.tsx                            # React entry point
├── FINAL-REPORT.md                         # Executive summary & product brief
├── package.json                            # Scripts & dependencies
├── tsconfig.json                           # TypeScript configuration
└── vite.config.ts                          # Vite build configuration
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Build Tooling** | [Vite 8.3](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Iconography & Motion** | [Lucide React](https://lucide.dev/), [Framer Motion](https://motion.dev/) |
| **AI / Natural Language** | [Google Gemini GenAI SDK (`@google/genai`)](https://www.npmjs.com/package/@google/genai) |
| **Scientific Data Reference**| ICMR-National Institute of Nutrition (NIN) & IFCT 2017 |

---

## 📜 Scientific Nutrition Disclaimer

> *NutriBharat is an informational and research platform intended for dietary awareness and nutrition planning. Nutritional values are derived from published ICMR-NIN and IFCT tables. Individuals with chronic medical conditions (such as diabetes, renal disorders, or cardiovascular conditions) should consult an accredited physician or registered dietitian before undertaking any restrictive diet plan.*

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 👤 Author

- **Gaurav Mishra**
- GitHub: [@Gauravmishra316](https://github.com/Gauravmishra316)
- Repository: [nutribharat-research---product-intelligence-portal](https://github.com/Gauravmishra316/nutribharat-research---product-intelligence-portal)
