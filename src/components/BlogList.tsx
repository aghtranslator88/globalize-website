"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Search, Calendar, User, Clock, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  featuredImageUrl: string | null;
  publishedAt: string; // Serialized Date ISO string
  readMinutes: number;
  author: {
    name: string;
    title: string;
  };
}

export default function BlogList({ posts = [] }: { posts: BlogPostItem[] }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Get unique categories
  const categories = ["ALL", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "ALL" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-10">
      {/* Search & Category Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-gray-150 rounded-2xl p-6 shadow-sm max-w-4xl mx-auto">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none text-xs focus:ring-4 focus:ring-primary-blue/10 bg-gray-50 focus:bg-white transition-all"
            placeholder={isAr ? "ابحث في 100 مقال محدد..." : "Search 100 articles..."}
          />
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeCategory === cat
                  ? "bg-primary-blue text-white shadow-sm"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-gray-150"
              }`}
            >
              {cat === "ALL" ? (isAr ? "الكل" : "All") : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="text-center text-xs text-gray-400 font-semibold">
        {isAr 
          ? `إجمالي المقالات المتاحة: ${filteredPosts.length} مقال` 
          : `Showing ${paginatedPosts.length} of ${filteredPosts.length} articles`}
      </div>

      {/* Blog Cards Grid */}
      {paginatedPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {paginatedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm hover-lift flex flex-col justify-between group"
              >
                {post.featuredImageUrl && (
                  <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden border-b border-gray-100">
                    <img
                      src={post.featuredImageUrl}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <span className="inline-block text-[9px] font-bold text-primary-blue bg-primary-blue/5 rounded px-2.5 py-1 mb-3">
                    {post.category}
                  </span>
                  
                  <h3 className="font-bold text-sm text-dark-navy mb-3 line-clamp-2 hover:text-primary-blue transition-colors font-arabic">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-4 line-clamp-3 font-arabic">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer Meta */}
                <div className="border-t border-gray-100 p-6 pt-4 flex flex-col gap-3 mt-auto bg-gray-50/20">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-arabic">{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span>{post.readMinutes} {isAr ? "دقائق" : "min"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold border-t border-gray-50 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-blue hover:underline"
                    >
                      <span>{isAr ? "اقرأ المقال" : "Read Post"}</span>
                      {isAr ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous Page"
              >
                {isAr ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>

              <div className="flex items-center gap-1 text-xs font-bold text-dark-navy px-3">
                <span>{currentPage}</span>
                <span className="text-gray-300">/</span>
                <span>{totalPages}</span>
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next Page"
              >
                {isAr ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">
            {isAr ? "لا توجد مقالات تطابق بحثك حالياً." : "No articles match your search query."}
          </p>
        </div>
      )}
    </div>
  );
}
