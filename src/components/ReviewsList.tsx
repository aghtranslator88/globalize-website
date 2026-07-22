"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Star, Video, Play, MessageSquare } from "lucide-react";

interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  serviceType: 'CERTIFIED' | 'LOCALIZATION' | 'INTERPRETATION';
  date: string; // ISO date string
  videoUrl: string | null;
}

export default function ReviewsList({ reviews = [] }: { reviews: ReviewItem[] }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [filter, setFilter] = useState<string>("ALL");

  const filteredReviews = reviews.filter((r) => {
    if (filter === "ALL") return true;
    return r.serviceType === filter;
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 5;

  const categories = [
    { key: "ALL", label: isAr ? "كل التقييمات" : "All Reviews" },
    { key: "CERTIFIED", label: isAr ? "ترجمة معتمدة" : "Certified Translation" },
    { key: "LOCALIZATION", label: isAr ? "توطين مواقع" : "Localization" },
    { key: "INTERPRETATION", label: isAr ? "ترجمة فورية" : "Interpretation" },
  ];

  return (
    <div className="space-y-10">
      {/* Summary Banner */}
      <div className="rounded-2xl bg-gradient-to-tr from-dark-navy to-primary-blue text-white p-8 border border-white/10 shadow-lg max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-right space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gold">
            {isAr ? "معدل تقييم العملاء" : "Client Satisfaction Score"}
          </h2>
          <p className="text-xs text-gray-200 max-w-md leading-relaxed">
            {isAr 
              ? "فخورون بثقة عملائنا في جودة الترجمة المعتمدة وقبولها الرسمي. نقيس نجاحنا بمستوى رضاكم."
              : "We take pride in our clients trust and successful acceptance rates. We measure success by your satisfaction."}
          </p>
        </div>

        <div className="flex items-center gap-6 bg-white/10 rounded-2xl p-6 border border-white/10 text-center">
          <div className="space-y-1">
            <p className="text-4xl font-black text-gold">{averageRating.toFixed(1)}</p>
            <div className="flex gap-0.5 text-yellow-400 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4.5 w-4.5 fill-current" />
              ))}
            </div>
            <p className="text-[10px] text-gray-300 font-semibold mt-1">
              {isAr ? `بناءً على ${reviews.length} تقييم حقيقي` : `Based on ${reviews.length} genuine reviews`}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gray-150 pb-6 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`rounded-xl px-4.5 py-2.5 text-xs font-bold transition-all duration-300 ${
              filter === cat.key
                ? "bg-primary-blue text-white shadow-md shadow-primary-blue/20"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-gray-150"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm hover-lift flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Rating stars */}
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 fill-current ${i < rev.rating ? "text-yellow-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
              
              {/* Text */}
              <p className="text-gray-600 text-xs leading-relaxed italic font-arabic">
                "{rev.text}"
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-6 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-xs text-dark-navy">{rev.authorName}</span>
                <span className="text-[9px] text-gray-400 mt-0.5">
                  {new Date(rev.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <span className="text-[10px] font-bold text-primary-blue bg-primary-blue/5 rounded px-2.5 py-1">
                {rev.serviceType === "CERTIFIED"
                  ? (isAr ? "ترجمة معتمدة" : "Certified")
                  : rev.serviceType === "LOCALIZATION"
                  ? (isAr ? "توطين" : "Localization")
                  : (isAr ? "ترجمة فورية" : "Interpretation")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
