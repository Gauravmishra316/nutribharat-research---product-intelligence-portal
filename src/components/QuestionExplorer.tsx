import React, { useState } from 'react';
import { USER_QUESTIONS_DATA, UserQuestion } from '../data/researchData';
import { Search, ChevronDown, ChevronUp, AlertCircle, Lightbulb, CheckCircle2, Filter } from 'lucide-react';

export const QuestionExplorer: React.FC = () => {
  const [selectedIntent, setSelectedIntent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<number[]>([1, 19, 40]); // default open some items

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const intentFilters = [
    { key: 'all', label: 'All Questions' },
    { key: 'weight-loss', label: 'Weight Loss & Deficit' },
    { key: 'food-lookup', label: 'Indian Food Lookups' },
    { key: 'protein', label: 'Protein & Macros' },
    { key: 'exercise', label: 'Exercise & Steps' },
    { key: 'hydration', label: 'Hydration & Drinks' },
    { key: 'culture-family', label: 'Family & Culture' },
    { key: 'medical', label: 'Medical & PCOS' },
  ];

  const filteredQuestions = USER_QUESTIONS_DATA.filter((q) => {
    const matchesIntent = selectedIntent === 'all' || q.intentKey === selectedIntent;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.scientificAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.commonMyth.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIntent && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <span>Phase 2 Research Corpus · Community Voice & Intent</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          The 100+ Real User Questions on Indian Nutrition
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Curated from Reddit r/Fitness_India, Quora, and app store reviews. Each question reveals genuine consumer dilemmas regarding home-cooked food, katoris, vegetarian protein, and family eating.
        </p>
      </div>

      {/* Control Bar: Search + Intent Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by food, roti, paneer, deficit, pcos, katori..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Intent Filter Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {intentFilters.map((tab) => {
            const isActive = selectedIntent === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedIntent(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            No questions match your search query. Try searching for "roti", "paneer", "deficit", or "katori".
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedIds.includes(q.id);
            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl transition-shadow overflow-hidden shadow-xs hover:border-slate-300"
              >
                <button
                  onClick={() => toggleExpand(q.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span className="font-semibold text-emerald-700">Q#{q.id}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-600">{q.intent}</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 leading-snug">
                      "{q.question}"
                    </h3>
                  </div>
                  <div className="p-1 rounded-lg bg-slate-50 text-slate-500 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-5 sm:px-5 border-t border-slate-100 pt-4 space-y-3 text-xs bg-slate-50/50">
                    {/* Scientific Answer Box */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold text-emerald-800 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Scientific Answer (ICMR-NIN & IFCT 2017 Grounded)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[13px]">{q.scientificAnswer}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Myth Debunked Box */}
                      <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/80 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-amber-900 text-xs">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Common Indian Myth Debunked</span>
                        </div>
                        <p className="text-amber-900 leading-relaxed">{q.commonMyth}</p>
                      </div>

                      {/* Product Takeaway Box */}
                      <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-200/80 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-blue-900 text-xs">
                          <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                          <span>Product UX & Feature Implication</span>
                        </div>
                        <p className="text-blue-900 leading-relaxed">{q.productTakeaway}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
