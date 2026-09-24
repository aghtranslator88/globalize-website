"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ExternalLink, X, ZoomIn, ShieldCheck, ChevronRight, ChevronLeft } from "lucide-react";
import googleReviewsManifest from "@/lib/google-reviews-manifest.json";

interface ReviewItem {
  id: string;
  authorName: string;
  avatarUrl?: string;
  date: string;
  rating: number;
  comment: string;
  reply?: string;
  imagePath: string;
  googleReviewUrl: string;
}

export default function GoogleReviewsGallery({ locale = "ar" }: { locale?: string }) {
  const isAr = locale === "ar";
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"screenshots" | "cards">("screenshots");

  const reviews: ReviewItem[] = googleReviewsManifest as ReviewItem[];

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setSelectedReview(reviews[index]);
  };

  const closeLightbox = () => {
    setSelectedReview(null);
  };

  const nextReview = () => {
    const nextIdx = (currentIndex + 1) % reviews.length;
    setCurrentIndex(nextIdx);
    setSelectedReview(reviews[nextIdx]);
  };

  const prevReview = () => {
    const prevIdx = (currentIndex - 1 + reviews.length) % reviews.length;
    setCurrentIndex(prevIdx);
    setSelectedReview(reviews[prevIdx]);
  };

  return (
    <section className="mt-16 pt-12 border-t border-gray-150">
      {/* Google Trust Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-dark-navy via-[#1e293b] to-[#0f172a] text-white p-6 sm:p-10 border border-white/10 shadow-2xl max-w-5xl mx-auto mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? "تقييمات رسمية موثقة من Google" : "Verified Google Maps Reviews"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr ? "توثيقات وتجارب عملائنا على خرائط جوجل" : "Real Customer Proof from Google Maps"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              {isAr
                ? "لقطات شاشة وسجلات حية لتقييمات عملائنا الكرام على صفحتنا الرسمية في Google Business Profile، لضمان أعلى درجات المصداقية والشفافية."
                : "Live screenshots and official records of our verified Google Business reviews, showcasing transparency and exceptional customer satisfaction."}
            </p>
          </div>

          {/* Rating Badge */}
          <div className="flex flex-col items-center bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 min-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span className="font-bold text-sm tracking-wide">Google Reviews</span>
            </div>
            <span className="text-4xl font-black text-amber-400">4.9</span>
            <div className="flex gap-1 text-amber-400 my-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 font-medium">
              {isAr ? "بناءً على 100+ تقييم معتمد" : "Based on 100+ verified reviews"}
            </span>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setActiveTab("screenshots")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "screenshots"
              ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          📸 {isAr ? "سكرين شوتس التقييمات الموثقة" : "Verified Screenshots Gallery"}
        </button>
        <button
          onClick={() => setActiveTab("cards")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "cards"
              ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          💬 {isAr ? "عرض البطاقات التفاعلية" : "Interactive Cards View"}
        </button>
      </div>

      {/* Tab 1: Screenshots Grid */}
      {activeTab === "screenshots" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((rev, idx) => (
            <div
              key={rev.id}
              onClick={() => openLightbox(idx)}
              className="group cursor-pointer rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                <img
                  src={rev.imagePath}
                  alt={`Google Review by ${rev.authorName}`}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-dark-navy/0 group-hover:bg-dark-navy/40 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-dark-navy px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <ZoomIn className="w-4 h-4 text-primary-blue" />
                    <span>{isAr ? "تكبير السكرين شوت" : "View Screenshot"}</span>
                  </span>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-dark-navy">{rev.authorName}</h4>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Interactive Cards */}
      {activeTab === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-blue to-dark-navy text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {rev.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-dark-navy">{rev.authorName}</h4>
                      <span className="text-[10px] text-gray-400">{rev.date}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-arabic italic">
                  "{rev.comment}"
                </p>
              </div>

              {rev.reply && (
                <div className="mt-4 pt-3 border-t border-gray-100 bg-gray-50/70 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-primary-blue block mb-1">
                    ↩️ {isAr ? "رد إدارة جلوباليز جروب:" : "Reply from Globalize Group:"}
                  </span>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {rev.reply}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Controls */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full pointer-events-auto backdrop-blur-md">
                {currentIndex + 1} / {reviews.length}
              </span>
              <button
                onClick={closeLightbox}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors pointer-events-auto backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Screenshot Image */}
            <div className="relative max-h-[80vh] flex items-center justify-center p-6 bg-slate-950">
              <img
                src={selectedReview.imagePath}
                alt={`Google Review by ${selectedReview.authorName}`}
                className="max-h-[72vh] w-auto rounded-xl shadow-2xl object-contain"
              />

              {/* Prev / Next buttons */}
              <button
                onClick={prevReview}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                title="السابق"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                onClick={nextReview}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                title="التالي"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-900 p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{selectedReview.authorName}</span>
                <span>•</span>
                <span>{selectedReview.date}</span>
              </div>
              <a
                href={selectedReview.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors"
              >
                <span>{isAr ? "عرض على Google Maps" : "View on Google Maps"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
