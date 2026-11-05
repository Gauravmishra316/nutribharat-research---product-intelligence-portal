import React, { useState } from 'react';
import { RESEARCH_PHASES, ResearchPhase } from '../data/researchData';
import { FileText, Copy, Check, ExternalLink, Bookmark, Search, ArrowRight, ShieldCheck } from 'lucide-react';

interface ReportViewerProps {
  onSelectCalculatorTab: () => void;
  onSelectNlpTab: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ onSelectCalculatorTab, onSelectNlpTab }) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('final-report');
  const [copied, setCopied] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>('');

  const currentPhase = RESEARCH_PHASES.find((p) => p.id === selectedPhaseId) || RESEARCH_PHASES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(`Viewing ${currentPhase.title} (${currentPhase.filename})\n\nSummary:\n${currentPhase.summary}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredPhases = RESEARCH_PHASES.filter(
    (p) =>
      p.title.toLowerCase().includes(filterText.toLowerCase()) ||
      p.summary.toLowerCase().includes(filterText.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner: Research Ground Rules Badge */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded Research Protocol · ICMR-NIN & IFCT 2017 Verified</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              India-Focused Nutrition & Calorie Tracking Product Architecture
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              A 10-phase market intelligence study synthesizing Google Ads search volume, community dilemmas from 105 user queries, verified competitor pricing, and physiological guidelines for Indian body composition.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onSelectNlpTab}
              className="px-3.5 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shadow-sm flex items-center space-x-1.5"
            >
              <span>Test NLP Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onSelectCalculatorTab}
              className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
            >
              <span>Launch 12 Calculators</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block">Target Geography</span>
            <span className="font-semibold text-white">India Primary (Urban Tier 1/2)</span>
          </div>
          <div>
            <span className="text-slate-400 block">Official Benchmark</span>
            <span className="font-semibold text-emerald-400">ICMR-NIN 2024 Guidelines</span>
          </div>
          <div>
            <span className="text-slate-400 block">Food Database Standard</span>
            <span className="font-semibold text-amber-400">IFCT 2017 (NIN Hyderabad)</span>
          </div>
          <div>
            <span className="text-slate-400 block">Key Ground Rule</span>
            <span className="font-semibold text-white">Zero Invented Statistics</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Phase Selector Sidebar + Content Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Phases Directory */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Bookmark className="w-4 h-4 text-emerald-600" />
                <span>Research Phases (10)</span>
              </h2>
              <span className="text-xs text-slate-500">{RESEARCH_PHASES.length} Documents</span>
            </div>

            {/* Search filter for phases */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter by phase topic or tag..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5 max-h-[540px] overflow-y-auto pr-1">
              {filteredPhases.map((phase) => {
                const isSelected = phase.id === selectedPhaseId;
                return (
                  <button
                    key={phase.id}
                    onClick={() => setSelectedPhaseId(phase.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500/50 shadow-xs'
                        : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {phase.number === 0 ? 'SYNTHESIS' : `PHASE ${phase.number}`}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 line-clamp-1">{phase.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{phase.summary}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick File Path Reference Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
            <span className="font-semibold text-slate-800 block mb-1">Local Project Checkpoint</span>
            <p className="text-slate-600 mb-2">
              All 10 research phases are permanently saved as pristine markdown files in the workspace directory.
            </p>
            <div className="bg-white p-2 rounded border border-slate-200 font-mono text-[11px] text-emerald-800 break-all">
              /{currentPhase.filename}
            </div>
          </div>
        </div>

        {/* Right Content Area: Detailed Phase Reader */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Header of selected phase */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-mono text-slate-600">/{currentPhase.filename}</span>
                  <span>·</span>
                  <span>Verified Dataset</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{currentPhase.title}</h2>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Summary Copied' : 'Copy Overview'}</span>
              </button>
            </div>

            {/* Key Metric Highlights Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              {currentPhase.keyStats.map((stat, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                  <span className="text-xs text-slate-500 block">{stat.label}</span>
                  <span className="text-lg font-bold text-slate-900 mt-0.5 block">{stat.value}</span>
                  <span className="text-[11px] text-slate-600 mt-1 block leading-tight">{stat.note}</span>
                </div>
              ))}
            </div>

            {/* Executive Summary */}
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <h3 className="text-base font-bold text-slate-900">Phase Synopsis & Strategic Findings</h3>
              <p className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 text-slate-700 italic">
                "{currentPhase.summary}"
              </p>

              {/* Dynamic Deep-Dive Sections based on selected phase */}
              {selectedPhaseId === 'final-report' && (
                <div className="space-y-4 pt-2">
                  <h4 className="font-semibold text-slate-900 text-sm">Key Architectural Pillars of NutriBharat:</h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                    <li><strong>Natural-Language Entity Extraction:</strong> Multi-item meal sentences parsed into line items in &lt;15 seconds, eliminating the 18-tap barrier of traditional search.</li>
                    <li><strong>ICMR-NIN 2024 Reference Norms:</strong> 2,110 kcal for Indian Reference Man (65kg), 1,660 kcal for Indian Reference Woman (55kg); protein RDA at 0.83g/kg.</li>
                    <li><strong>Asian BMI Thresholds:</strong> Flags overweight at BMI &ge; 23.0 and obesity at &ge; 25.0, reflecting South Asian metabolic visceral adiposity risks.</li>
                    <li><strong>Household Calibrator:</strong> Standardizes the Indian stainless-steel katori (120ml / 180ml / 250ml) and addresses the 45 kcal ghee brush on rotis.</li>
                    <li><strong>Ethical Monetization:</strong> Avoids predatory coaching tele-calls; priced at an honest ₹999/year via UPI for adaptive expenditure algorithms.</li>
                  </ul>
                </div>
              )}

              {selectedPhaseId === '01-search-demand' && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-semibold text-slate-900 text-sm">Top Search Volume Themes in India:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <strong>1. BMI Calculator:</strong> 1.2M - 1.8M monthly searches. Massive top-of-funnel acquisition magnet for organic SEO.
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <strong>2. "Calories in 1 Roti":</strong> 120,000 monthly searches. Demonstrates that Indian users do not log raw flour—they want prepared bread macros.
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <strong>3. Protein in Paneer:</strong> 90,000 monthly searches. High commercial intent for vegetarian fitness nutrition.
                    </div>
                  </div>
                </div>
              )}

              {selectedPhaseId === '04-competitors' && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-semibold text-slate-900 text-sm">Market Vulnerability Breakdown:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-red-50/50 border border-red-200 rounded-xl">
                      <span className="font-bold text-red-900 block">Healthify Weakness</span>
                      <span className="text-red-700 mt-1 block">
                        Aggressive telemarketing sales calls; 25 conflicting entries for yellow dal in unmoderated database; Smart Plan paywalled at ₹2,499/yr.
                      </span>
                    </div>
                    <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl">
                      <span className="font-bold text-amber-900 block">Fittr Weakness</span>
                      <span className="text-amber-700 mt-1 block">
                        Insists on digital scale weighing of dry uncooked ingredients; impossible for individuals in joint Indian family kitchens.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedPhaseId === '05-gaps' && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-semibold text-slate-900 text-sm">The 3 Biggest Underserved Gaps in Indian Nutrition:</h4>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
                    <li><strong>The "Family Pot" Problem:</strong> Tracking food when mom or cook prepares dal and sabzi for 5 people in one kadhai.</li>
                    <li><strong>Katori Volume Variance:</strong> 1 katori varies between 120ml and 250ml, causing unaccounted ±180 kcal errors per meal.</li>
                    <li><strong>Invisible Cooking Fats:</strong> Discretionary oil and ghee added during tadka adds 200–400 hidden calories daily.</li>
                  </ol>
                </div>
              )}

              {selectedPhaseId === '06-product-design' && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-semibold text-slate-900 text-sm">Worked Example: Natural-Language Food Logging</h4>
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs">
                    <span className="text-emerald-400 font-bold block mb-1">USER INPUT:</span>
                    "I ate 2 rotis, one bowl dal, paneer sabzi and a glass of chaas"
                    <div className="mt-3 pt-3 border-t border-slate-800 text-slate-300">
                      <span className="text-amber-400 font-bold block mb-1">PARSED MACRO BREAKDOWN (IFCT 2017):</span>
                      • 2 Rotis (Phulka, dry): 170 kcal | 6.0g P | 35g C | 0.8g F<br />
                      • Yellow Dal (1 katori 180g): 155 kcal | 8.2g P | 22.5g C | 3.8g F<br />
                      • Paneer Sabzi (1 katori 150g): 220 kcal | 9.5g P | 8.5g C | 16.5g F<br />
                      • Salted Chaas (250 ml glass): 48 kcal | 2.2g P | 3.6g C | 2.0g F<br />
                      <strong className="text-white mt-1 block">TOTAL: 593 kcal | 25.9g Protein | 69.6g Carbs | 23.1g Fat | 10.3g Fiber</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                <span className="text-xs text-slate-600 font-medium mr-1">Tags:</span>
                {currentPhase.tags.map((tag, i) => (
                  <span key={i} className="text-xs text-slate-700">
                    {tag}{i < currentPhase.tags.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
