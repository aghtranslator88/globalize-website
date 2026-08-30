"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { 
  BarChart, MessageSquare, FileText, Landmark, Globe, MapPin, 
  Users, Star, HelpCircle, Settings, LogOut, Search, Plus, 
  Edit, Trash, ArrowLeft, Check, Clock, Eye, AlertTriangle 
} from "lucide-react";

interface DashboardClientProps {
  user: { name: string; email: string; role: string };
  initialQuotes: any[];
  initialDocs: any[];
  initialEmbassies: any[];
  initialGovs: any[];
  initialLangs: any[];
  initialBranches: any[];
  initialTeam: any[];
  initialReviews: any[];
  initialPosts: any[];
  initialFaqs: any[];
  initialSettings: any[];
}

export default function DashboardClient({
  user,
  initialQuotes,
  initialDocs,
  initialEmbassies,
  initialGovs,
  initialLangs,
  initialBranches,
  initialTeam,
  initialReviews,
  initialPosts,
  initialFaqs,
  initialSettings
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data lists
  const [quotes, setQuotes] = useState(initialQuotes);
  const [docs, setDocs] = useState(initialDocs);
  const [embassies, setEmbassies] = useState(initialEmbassies);
  const [govs, setGovs] = useState(initialGovs);
  const [langs, setLangs] = useState(initialLangs);
  const [branches, setBranches] = useState(initialBranches);
  const [team, setTeam] = useState(initialTeam);
  const [reviews, setReviews] = useState(initialReviews);
  const [posts, setPosts] = useState(initialPosts);
  const [faqs, setFaqs] = useState(initialFaqs);
  const [settings, setSettings] = useState(initialSettings);

  // Modal / Editing states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [formTab, setFormTab] = useState<"ar" | "en">("ar");

  // Selected Quote Detail State
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

  // Form states
  const [formData, setFormData] = useState<any>({});

  // Loading state
  const [loading, setLoading] = useState(false);

  const isEditor = user.role === "EDITOR";

  const menuItems = [
    { key: "overview", label: "نظرة عامة", icon: BarChart },
    { key: "quotes", label: "طلبات التسعير", icon: MessageSquare, count: quotes.filter(q => q.status === 'NEW').length },
    { key: "documents", label: "الوثائق والأسعار", icon: FileText },
    { key: "embassies", label: "السفارات المعتمدة", icon: Landmark },
    { key: "government", label: "الهيئات الحكومية", icon: Landmark },
    { key: "languages", label: "اللغات", icon: Globe },
    { key: "branches", label: "الفروع", icon: MapPin },
    { key: "team", label: "فريق العمل", icon: Users },
    { key: "reviews", label: "التقييمات", icon: Star },
    { key: "posts", label: "المدونة", icon: FileText },
    { key: "faqs", label: "الأسئلة الشائعة", icon: HelpCircle },
    { key: "settings", label: "إعدادات الموقع", icon: Settings },
  ];

  // Helper for updates
  const handleUpdateStatus = async (quoteId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/dashboard/quote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: quoteId, status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuotes(quotes.map(q => q.id === quoteId ? data.result : q));
        if (selectedQuote && selectedQuote.id === quoteId) {
          setSelectedQuote(data.result);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper for CRUD requests
  const handleCrudSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const action = editItem ? "update" : "create";
    let modelName = "";
    if (activeTab === "documents") modelName = "document";
    else if (activeTab === "embassies") modelName = "embassy";
    else if (activeTab === "government") modelName = "govEntity";
    else if (activeTab === "languages") modelName = "language";
    else if (activeTab === "branches") modelName = "branch";
    else if (activeTab === "team") modelName = "teamMember";
    else if (activeTab === "reviews") modelName = "review";
    else if (activeTab === "posts") modelName = "blogPost";
    else if (activeTab === "faqs") modelName = "fAQ";
    else if (activeTab === "settings") modelName = "siteSetting";

    try {
      // Setup payload parsing for arrays
      let cleanData = { ...formData };
      if (modelName === "embassy" || modelName === "govEntity") {
        if (typeof cleanData.requirementsAr === 'string') {
          cleanData.requirementsAr = cleanData.requirementsAr.split('\n').filter((l: string) => l.trim() !== '');
        }
        if (typeof cleanData.requirementsEn === 'string') {
          cleanData.requirementsEn = cleanData.requirementsEn.split('\n').filter((l: string) => l.trim() !== '');
        }
        if (typeof cleanData.useCasesAr === 'string') {
          cleanData.useCasesAr = cleanData.useCasesAr.split('\n').filter((l: string) => l.trim() !== '');
        }
        if (typeof cleanData.useCasesEn === 'string') {
          cleanData.useCasesEn = cleanData.useCasesEn.split('\n').filter((l: string) => l.trim() !== '');
        }
      }

      if (modelName === "teamMember" && typeof cleanData.certifications === 'string') {
        cleanData.certifications = cleanData.certifications.split('\n').filter((l: string) => l.trim() !== '');
      }

      const res = await fetch("/api/dashboard/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          model: modelName,
          id: editItem?.id,
          data: cleanData
        }),
      });

      if (res.ok) {
        const body = await res.json();
        // Refresh local lists
        if (activeTab === "documents") {
          setDocs(action === "create" ? [...docs, body.result] : docs.map(d => d.id === editItem.id ? body.result : d));
        } else if (activeTab === "embassies") {
          setEmbassies(action === "create" ? [...embassies, body.result] : embassies.map(e => e.id === editItem.id ? body.result : e));
        } else if (activeTab === "government") {
          setGovs(action === "create" ? [...govs, body.result] : govs.map(g => g.id === editItem.id ? body.result : g));
        } else if (activeTab === "languages") {
          setLangs(action === "create" ? [...langs, body.result] : langs.map(l => l.id === editItem.id ? body.result : l));
        } else if (activeTab === "branches") {
          setBranches(action === "create" ? [...branches, body.result] : branches.map(b => b.id === editItem.id ? body.result : b));
        } else if (activeTab === "team") {
          setTeam(action === "create" ? [...team, body.result] : team.map(t => t.id === editItem.id ? body.result : t));
        } else if (activeTab === "reviews") {
          setReviews(action === "create" ? [...reviews, body.result] : reviews.map(r => r.id === editItem.id ? body.result : r));
        } else if (activeTab === "posts") {
          setPosts(action === "create" ? [...posts, body.result] : posts.map(p => p.id === editItem.id ? body.result : p));
        } else if (activeTab === "faqs") {
          setFaqs(action === "create" ? [...faqs, body.result] : faqs.map(f => f.id === editItem.id ? body.result : f));
        } else if (activeTab === "settings") {
          setSettings(action === "create" ? [...settings, body.result] : settings.map(s => s.id === editItem.id ? body.result : s));
        }

        setIsModalOpen(false);
        setEditItem(null);
        setFormData({});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrudDelete = async (modelName: string, itemId: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    
    try {
      const res = await fetch("/api/dashboard/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          model: modelName,
          id: itemId
        }),
      });

      if (res.ok) {
        if (activeTab === "documents") setDocs(docs.filter(d => d.id !== itemId));
        else if (activeTab === "embassies") setEmbassies(embassies.filter(e => e.id !== itemId));
        else if (activeTab === "government") setGovs(govs.filter(g => g.id !== itemId));
        else if (activeTab === "languages") setLangs(langs.filter(l => l.id !== itemId));
        else if (activeTab === "branches") setBranches(branches.filter(b => b.id !== itemId));
        else if (activeTab === "team") setTeam(team.filter(t => t.id !== itemId));
        else if (activeTab === "reviews") setReviews(reviews.filter(r => r.id !== itemId));
        else if (activeTab === "posts") setPosts(posts.filter(p => p.id !== itemId));
        else if (activeTab === "faqs") setFaqs(faqs.filter(f => f.id !== itemId));
        else if (activeTab === "settings") setSettings(settings.filter(s => s.id !== itemId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditItem(null);
    setFormTab("ar");
    
    // Initialize default fields
    let initialFields: any = {};
    if (activeTab === "documents") {
      initialFields = { nameAr: "", nameEn: "", slug: "", priceEGP: 200, deliveryHours: 24, descriptionAr: "", descriptionEn: "", answerBoxAr: "", answerBoxEn: "", indexable: true };
    } else if (activeTab === "embassies") {
      initialFields = { nameAr: "", nameEn: "", slug: "", countryCode: "DE", region: "EUROPE", requirementsAr: "", requirementsEn: "", useCasesAr: "", useCasesEn: "", indexable: false };
    } else if (activeTab === "government") {
      initialFields = { nameAr: "", nameEn: "", slug: "", requirementsAr: "", requirementsEn: "", useCasesAr: "", useCasesEn: "", indexable: false };
    } else if (activeTab === "languages") {
      initialFields = { nameAr: "", nameEn: "", slug: "", code: "", popular: false, descriptionAr: "", descriptionEn: "" };
    } else if (activeTab === "branches") {
      initialFields = { nameAr: "", nameEn: "", slug: "", addressAr: "", addressEn: "", phone: "", whatsapp: "", workingHoursAr: "", workingHoursEn: "", lat: 30.0, lng: 31.0, googleMapsUrl: "" };
    } else if (activeTab === "team") {
      initialFields = { nameAr: "", nameEn: "", titleAr: "", titleEn: "", languagePair: "", yearsExperience: 5, certifications: "", isLeadership: false, bioAr: "", bioEn: "" };
    } else if (activeTab === "reviews") {
      initialFields = { authorName: "", rating: 5, textAr: "", textEn: "", serviceType: "CERTIFIED", date: new Date().toISOString(), published: true };
    } else if (activeTab === "posts") {
      initialFields = { titleAr: "", titleEn: "", slug: "", excerptAr: "", excerptEn: "", bodyAr: "", bodyEn: "", categoryAr: "", categoryEn: "", authorId: team[0]?.id || "", readMinutes: 5, published: true };
    } else if (activeTab === "faqs") {
      initialFields = { questionAr: "", questionEn: "", answerAr: "", answerEn: "", sortOrder: 0, homepage: false };
    } else if (activeTab === "settings") {
      initialFields = { key: "", value: "" };
    }

    setFormData(initialFields);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditItem(item);
    setFormTab("ar");
    
    // Copy data
    let editableData = { ...item };
    if (activeTab === "embassies" || activeTab === "government") {
      editableData.requirementsAr = Array.isArray(item.requirementsAr) ? item.requirementsAr.join('\n') : "";
      editableData.requirementsEn = Array.isArray(item.requirementsEn) ? item.requirementsEn.join('\n') : "";
      editableData.useCasesAr = Array.isArray(item.useCasesAr) ? item.useCasesAr.join('\n') : "";
      editableData.useCasesEn = Array.isArray(item.useCasesEn) ? item.useCasesEn.join('\n') : "";
    }
    if (activeTab === "team") {
      editableData.certifications = Array.isArray(item.certifications) ? item.certifications.join('\n') : "";
    }

    setFormData(editableData);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-right" dir="rtl">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-dark-navy text-white flex flex-col flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-white/10 gap-3">
          <div className="h-9 w-9 bg-gold text-dark-navy font-bold flex items-center justify-center rounded-xl text-lg">G</div>
          <div className="flex flex-col">
            <span className="font-bold text-sm">لوحة تحكم الإدارة</span>
            <span className="text-[10px] text-gray-300">جلوبالايز جروب</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            if (isEditor && item.key === "settings") return null; // Hide settings tab for Editor
            
            return (
              <button
                key={item.key}
                onClick={() => { setActiveTab(item.key); setSearchQuery(""); }}
                className={`flex items-center justify-between w-full rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                  activeTab === item.key
                    ? "bg-primary-blue text-white shadow-sm"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-[9px] font-black">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div className="border-t border-white/10 p-4 space-y-4">
          <div className="flex flex-col gap-0.5 text-center">
            <span className="text-xs font-bold text-white">{user.name}</span>
            <span className="text-[9px] text-gray-400">{user.role === 'ADMIN' ? 'مدير عام (Admin)' : 'محرر محتوى (Editor)'}</span>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/20 hover:bg-white/5 hover:text-red-400 py-3 text-xs font-bold text-gray-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 bg-white border-b border-gray-150 flex items-center justify-between px-8 z-10 flex-shrink-0">
          <h1 className="text-lg font-bold text-dark-navy">
            {menuItems.find(m => m.key === activeTab)?.label}
          </h1>
          <div className="text-[11px] text-gray-400 font-semibold">
            {new Date().toLocaleDateString("ar-EG", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="p-8 flex-1">
          {/* VIEW: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-slide-up">
              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="rounded-2xl bg-white p-6 border border-gray-150 shadow-sm">
                  <h3 className="text-xs text-gray-400 font-semibold mb-2">طلبات التسعير الجديدة</h3>
                  <p className="text-3xl font-black text-dark-navy">{quotes.filter(q => q.status === 'NEW').length}</p>
                </div>
                <div className="rounded-2xl bg-white p-6 border border-gray-150 shadow-sm">
                  <h3 className="text-xs text-gray-400 font-semibold mb-2">إجمالي عروض الأسعار</h3>
                  <p className="text-3xl font-black text-primary-blue">{quotes.length}</p>
                </div>
                <div className="rounded-2xl bg-white p-6 border border-gray-150 shadow-sm">
                  <h3 className="text-xs text-gray-400 font-semibold mb-2">مقالات المدونة المنشورة</h3>
                  <p className="text-3xl font-black text-green-600">{posts.filter(p => p.published).length}</p>
                </div>
                <div className="rounded-2xl bg-white p-6 border border-gray-150 shadow-sm">
                  <h3 className="text-xs text-gray-400 font-semibold mb-2">الصفحات المفهرسة (SEO)</h3>
                  <p className="text-3xl font-black text-gold">{docs.filter(d => d.indexable).length + embassies.filter(e => e.indexable).length + govs.filter(g => g.indexable).length}</p>
                </div>
              </div>

              {/* Quick Quote Inbox */}
              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3">آخر طلبات عروض الأسعار الواردة</h3>
                <div className="space-y-4">
                  {quotes.slice(0, 5).map((q) => (
                    <div key={q.id} className="flex items-center justify-between border-b border-gray-50 pb-3">
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-dark-navy">{q.name} - {q.phone}</h4>
                        <p className="text-[10px] text-gray-500">الخدمة: {q.serviceType} | {new Date(q.createdAt).toLocaleString("ar-EG")}</p>
                      </div>
                      <span className={`text-[9px] font-black rounded px-2.5 py-1 ${
                        q.status === 'NEW' ? 'bg-red-50 text-red-600 border border-red-200' :
                        q.status === 'CONTACTED' ? 'bg-blue-50 text-blue-600' :
                        q.status === 'WON' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                      }`}>
                        {q.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: QUOTES INBOX */}
          {activeTab === "quotes" && (
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm animate-slide-up">
              <div className="p-6 border-b border-gray-150 flex items-center justify-between">
                <h3 className="text-sm font-bold text-dark-navy">وارد علبة عروض الأسعار</h3>
                <div className="relative w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 outline-none text-xs rounded-xl bg-gray-50"
                    placeholder="بحث في الطلبات..."
                  />
                  <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-gray-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-right text-xs">
                  <thead className="bg-gray-50 text-dark-navy font-bold">
                    <tr>
                      <th className="px-6 py-4">العميل</th>
                      <th className="px-6 py-4">رقم الهاتف</th>
                      <th className="px-6 py-4">الخدمة المطلوبة</th>
                      <th className="px-6 py-4">التاريخ</th>
                      <th className="px-6 py-4">الملف</th>
                      <th className="px-6 py-4">حالة الطلب</th>
                      <th className="px-6 py-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-gray-700">
                    {quotes.filter(q => q.name.includes(searchQuery) || q.phone.includes(searchQuery)).map((q) => (
                      <tr key={q.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-bold text-dark-navy">{q.name}</td>
                        <td className="px-6 py-4 font-semibold text-gray-500" dir="ltr">{q.phone}</td>
                        <td className="px-6 py-4">{q.serviceType}</td>
                        <td className="px-6 py-4 text-gray-400">{new Date(q.createdAt).toLocaleString("ar-EG")}</td>
                        <td className="px-6 py-4">
                          {q.fileUrl ? (
                            <a href={q.fileUrl} target="_blank" className="text-primary-blue hover:underline font-bold">
                              تحميل الملف
                            </a>
                          ) : (
                            <span className="text-gray-300 italic">لا يوجد</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-black rounded px-2.5 py-1 ${
                            q.status === 'NEW' ? 'bg-red-50 text-red-600' :
                            q.status === 'CONTACTED' ? 'bg-blue-50 text-blue-600' :
                            q.status === 'WON' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                          }`}>
                            {q.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedQuote(q)}
                            className="bg-primary-blue text-white rounded px-3 py-1 font-bold text-[10px]"
                          >
                            متابعة الحالة
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: CRUD LISTS FOR DOCUMENTS, EMBASSIES, GOV ENTITIES, LANGUAGES, ETC. */}
          {!["overview", "quotes"].includes(activeTab) && (
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm animate-slide-up">
              <div className="p-6 border-b border-gray-150 flex items-center justify-between flex-wrap gap-4">
                <div className="relative w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 outline-none text-xs rounded-xl bg-gray-50"
                    placeholder="بحث..."
                  />
                  <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-gray-400" />
                </div>
                
                {/* Disable Create for Editor on Settings */}
                {(!isEditor || activeTab !== "settings") && (
                  <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-yellow-500 px-5 py-2.5 text-xs font-bold text-dark-navy shadow-sm hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    <span>إضافة جديد</span>
                  </button>
                )}
              </div>

              {/* CRUD Tables */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-right text-xs">
                  <thead className="bg-gray-50 text-dark-navy font-bold">
                    {activeTab === "documents" && (
                      <tr>
                        <th className="px-6 py-4">الاسم (عربي)</th>
                        <th className="px-6 py-4">السعر</th>
                        <th className="px-6 py-4">زمن التسليم</th>
                        <th className="px-6 py-4">الحالة (SEO)</th>
                        <th className="px-6 py-4 text-center">إجراءات</th>
                      </tr>
                    )}
                    {activeTab === "embassies" && (
                      <tr>
                        <th className="px-6 py-4">الاسم (عربي)</th>
                        <th className="px-6 py-4">المنطقة</th>
                        <th className="px-6 py-4">الرمز</th>
                        <th className="px-6 py-4">الحالة (SEO)</th>
                        <th className="px-6 py-4 text-center">إجراءات</th>
                      </tr>
                    )}
                    {activeTab === "government" && (
                      <tr>
                        <th className="px-6 py-4">الاسم (عربي)</th>
                        <th className="px-6 py-4">الحالة (SEO)</th>
                        <th className="px-6 py-4 text-center">إجراءات</th>
                      </tr>
                    )}
                    {activeTab === "languages" && (
                      <tr>
                        <th className="px-6 py-4">اللغة</th>
                        <th className="px-6 py-4">كود اللغة</th>
                        <th className="px-6 py-4">رائجة؟</th>
                        <th className="px-6 py-4 text-center">إجراءات</th>
                      </tr>
                    )}
                    {activeTab === "branches" && (
                      <tr>
                        <th className="px-6 py-4">الفرع</th>
                        <th className="px-6 py-4">العنوان</th>
                        <th className="px-6 py-4">رقم الهاتف</th>
                        <th className="px-6 py-4 text-center">إجراءات</th>
                      </tr>
                    )}
                    {activeTab === "team" && (
                      <tr>
                        <th className="px-6 py-4">الاسم</th>
                        <th className="px-6 py-4">الوظيفة</th>
                        <th className="px-6 py-4">اللغات</th>
                        <th className="px-6 py-4 text-center">إجراءات</th>
                      </tr>
                    )}
                    {activeTab === "reviews" && (
                      <tr>
                        <th className="px-6 py-4">العميل</th>
                        <th className="px-6 py-4">التقييم</th>
                        <th className="px-6 py-4">الخدمة</th>
                        <th className="px-6 py-4">منشور؟</th>
                        <th className="px-6 py-4 text-center">إجراءات</th>
                      </tr>
                    )}
                    {activeTab === "posts" && (
                      <tr>
                        <th className="px-6 py-4">عنوان المقال</th>
                        <th className="px-6 py-4">التصنيف</th>
                        <th className="px-6 py-4">تاريخ النشر</th>
                        <th className="px-6 py-4">منشور؟</th>
                        <th className="px-6 py-4 text-center">إجراءات</th>
                      </tr>
                    )}
                    {activeTab === "faqs" && (
                      <tr>
                        <th className="px-6 py-4">السؤال</th>
                        <th className="px-6 py-4">الترتيب</th>
                        <th className="px-6 py-4">الرئيسية؟</th>
                        <th className="px-6 py-4 text-center">إجراءات</th>
                      </tr>
                    )}
                    {activeTab === "settings" && (
                      <tr>
                        <th className="px-6 py-4">المفتاح</th>
                        <th className="px-6 py-4">القيمة</th>
                        <th className="px-6 py-4 text-center">إجراءات</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-gray-700">
                    {/* Render List items */}
                    {activeTab === "documents" && docs.filter(d => d.nameAr.includes(searchQuery)).map((d) => (
                      <tr key={d.id}>
                        <td className="px-6 py-4 font-bold text-dark-navy">{d.nameAr}</td>
                        <td className="px-6 py-4 font-semibold text-primary-blue">{d.priceEGP} ج.م</td>
                        <td className="px-6 py-4 text-gray-500">{d.deliveryHours} ساعة</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-black rounded px-2 py-0.5 ${d.indexable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {d.indexable ? 'Indexable' : 'NoIndex'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(d)} className="p-1.5 text-gray-500 hover:text-primary-blue"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleCrudDelete("document", d.id)} className="p-1.5 text-gray-500 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === "embassies" && embassies.filter(e => e.nameAr.includes(searchQuery)).map((emb) => (
                      <tr key={emb.id}>
                        <td className="px-6 py-4 font-bold text-dark-navy">{emb.nameAr}</td>
                        <td className="px-6 py-4 text-gray-500">{emb.region}</td>
                        <td className="px-6 py-4 font-mono">{emb.countryCode}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-black rounded px-2 py-0.5 ${emb.indexable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {emb.indexable ? 'Indexable' : 'NoIndex'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(emb)} className="p-1.5 text-gray-500 hover:text-primary-blue"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleCrudDelete("embassy", emb.id)} className="p-1.5 text-gray-500 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === "government" && govs.filter(g => g.nameAr.includes(searchQuery)).map((gov) => (
                      <tr key={gov.id}>
                        <td className="px-6 py-4 font-bold text-dark-navy">{gov.nameAr}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-black rounded px-2 py-0.5 ${gov.indexable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {gov.indexable ? 'Indexable' : 'NoIndex'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(gov)} className="p-1.5 text-gray-500 hover:text-primary-blue"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleCrudDelete("govEntity", gov.id)} className="p-1.5 text-gray-500 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === "languages" && langs.filter(l => l.nameAr.includes(searchQuery)).map((lang) => (
                      <tr key={lang.id}>
                        <td className="px-6 py-4 font-bold text-dark-navy">{lang.nameAr}</td>
                        <td className="px-6 py-4 font-mono">{lang.code}</td>
                        <td className="px-6 py-4 text-gray-500">{lang.popular ? "نعم" : "لا"}</td>
                        <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(lang)} className="p-1.5 text-gray-500 hover:text-primary-blue"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleCrudDelete("language", lang.id)} className="p-1.5 text-gray-500 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === "branches" && branches.filter(b => b.nameAr.includes(searchQuery)).map((b) => (
                      <tr key={b.id}>
                        <td className="px-6 py-4 font-bold text-dark-navy">{b.nameAr}</td>
                        <td className="px-6 py-4 text-gray-500">{b.addressAr}</td>
                        <td className="px-6 py-4 font-mono text-left" dir="ltr">{b.phone}</td>
                        <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(b)} className="p-1.5 text-gray-500 hover:text-primary-blue"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleCrudDelete("branch", b.id)} className="p-1.5 text-gray-500 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === "team" && team.filter(t => t.nameAr.includes(searchQuery)).map((t) => (
                      <tr key={t.id}>
                        <td className="px-6 py-4 font-bold text-dark-navy">{t.nameAr}</td>
                        <td className="px-6 py-4 text-gray-500">{t.titleAr}</td>
                        <td className="px-6 py-4">{t.languagePair}</td>
                        <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(t)} className="p-1.5 text-gray-500 hover:text-primary-blue"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleCrudDelete("teamMember", t.id)} className="p-1.5 text-gray-500 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === "reviews" && reviews.filter(r => r.authorName.includes(searchQuery)).map((r) => (
                      <tr key={r.id}>
                        <td className="px-6 py-4 font-bold text-dark-navy">{r.authorName}</td>
                        <td className="px-6 py-4 font-bold text-yellow-500">{r.rating} / 5</td>
                        <td className="px-6 py-4">{r.serviceType}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-black rounded px-2 py-0.5 ${r.published ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {r.published ? 'Published' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(r)} className="p-1.5 text-gray-500 hover:text-primary-blue"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleCrudDelete("review", r.id)} className="p-1.5 text-gray-500 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === "posts" && posts.filter(p => p.titleAr.includes(searchQuery)).map((p) => (
                      <tr key={p.id}>
                        <td className="px-6 py-4 font-bold text-dark-navy">{p.titleAr}</td>
                        <td className="px-6 py-4 text-gray-500">{p.categoryAr}</td>
                        <td className="px-6 py-4 text-gray-400">{new Date(p.publishedAt).toLocaleDateString("ar-EG")}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-black rounded px-2 py-0.5 ${p.published ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {p.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(p)} className="p-1.5 text-gray-500 hover:text-primary-blue"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleCrudDelete("blogPost", p.id)} className="p-1.5 text-gray-500 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === "faqs" && faqs.filter(f => f.questionAr.includes(searchQuery)).map((f) => (
                      <tr key={f.id}>
                        <td className="px-6 py-4 font-bold text-dark-navy">{f.questionAr}</td>
                        <td className="px-6 py-4 font-semibold text-gray-500">{f.sortOrder}</td>
                        <td className="px-6 py-4 text-gray-500">{f.homepage ? "نعم" : "لا"}</td>
                        <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(f)} className="p-1.5 text-gray-500 hover:text-primary-blue"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleCrudDelete("fAQ", f.id)} className="p-1.5 text-gray-500 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === "settings" && settings.filter(s => s.key.includes(searchQuery)).map((s) => (
                      <tr key={s.id}>
                        <td className="px-6 py-4 font-mono font-bold text-dark-navy">{s.key}</td>
                        <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{s.value}</td>
                        <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(s)} className="p-1.5 text-gray-500 hover:text-primary-blue"><Edit className="h-4 w-4" /></button>
                          {!isEditor && (
                            <button onClick={() => handleCrudDelete("siteSetting", s.id)} className="p-1.5 text-gray-500 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: CRUD CREATE & EDIT FORM WITH BILINGUAL TABS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-dark-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-scale-up border border-gray-150">
            {/* Modal header */}
            <div className="p-6 border-b border-gray-150 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-dark-navy font-arabic">
                {editItem ? "تعديل البيانات" : "إضافة سجل جديد"}
              </h3>
              
              {/* Language switcher inside Form */}
              <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setFormTab("ar")}
                  className={`px-3 py-1 text-[10px] font-bold rounded ${formTab === "ar" ? "bg-primary-blue text-white" : "text-gray-500"}`}
                >
                  العربية
                </button>
                <button
                  type="button"
                  onClick={() => setFormTab("en")}
                  className={`px-3 py-1 text-[10px] font-bold rounded ${formTab === "en" ? "bg-primary-blue text-white" : "text-gray-500"}`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Modal body (Form) */}
            <form onSubmit={handleCrudSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* DOCUMENT FIELDS */}
              {activeTab === "documents" && (
                <div className="space-y-4 text-xs text-gray-700">
                  {formTab === "ar" ? (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">الاسم (بالعربية)</label>
                        <input type="text" required value={formData.nameAr || ""} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">الوصف (بالعربية)</label>
                        <textarea rows={2} required value={formData.descriptionAr || ""} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">جملة الإجابة السريعة (بالعربية)</label>
                        <textarea rows={2} required value={formData.answerBoxAr || ""} onChange={(e) => setFormData({...formData, answerBoxAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">Name (English)</label>
                        <input type="text" required value={formData.nameEn || ""} onChange={(e) => setFormData({...formData, nameEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Description (English)</label>
                        <textarea rows={2} required value={formData.descriptionEn || ""} onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Answer Box text (English)</label>
                        <textarea rows={2} required value={formData.answerBoxEn || ""} onChange={(e) => setFormData({...formData, answerBoxEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  )}

                  {/* Pricing and parameters */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">السعر (جنيه مصري)</label>
                      <input type="number" required value={formData.priceEGP || 0} onChange={(e) => setFormData({...formData, priceEGP: parseInt(e.target.value)})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">زمن التسليم (بالساعات)</label>
                      <input type="number" required value={formData.deliveryHours || 24} onChange={(e) => setFormData({...formData, deliveryHours: parseInt(e.target.value)})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">الرابط الفريد (Slug)</label>
                      <input type="text" required value={formData.slug || ""} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">مفهرس (Indexable)؟</label>
                      <select value={formData.indexable ? "true" : "false"} onChange={(e) => setFormData({...formData, indexable: e.target.value === "true"})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="true">نعم (Index)</option>
                        <option value="false">لا (NoIndex)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* EMBASSY FIELDS */}
              {activeTab === "embassies" && (
                <div className="space-y-4 text-xs text-gray-700">
                  {formTab === "ar" ? (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">الاسم (بالعربية)</label>
                        <input type="text" required value={formData.nameAr || ""} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">متطلبات السفارة (سطر لكل متطلب)</label>
                        <textarea rows={4} value={formData.requirementsAr || ""} onChange={(e) => setFormData({...formData, requirementsAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" placeholder="ترجمة شهادة الميلاد بالألمانية..." />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">حالات الاستخدام (سطر لكل حالة)</label>
                        <textarea rows={3} value={formData.useCasesAr || ""} onChange={(e) => setFormData({...formData, useCasesAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" placeholder="تأشيرات الدراسة..." />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">Name (English)</label>
                        <input type="text" required value={formData.nameEn || ""} onChange={(e) => setFormData({...formData, nameEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Requirements (one per line)</label>
                        <textarea rows={4} value={formData.requirementsEn || ""} onChange={(e) => setFormData({...formData, requirementsEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Use cases (one per line)</label>
                        <textarea rows={3} value={formData.useCasesEn || ""} onChange={(e) => setFormData({...formData, useCasesEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">المنطقة</label>
                      <select value={formData.region || "EUROPE"} onChange={(e) => setFormData({...formData, region: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="EUROPE">أوروبا</option>
                        <option value="GULF_ARAB">الخليج العربي</option>
                        <option value="AMERICAS">الأمريكتين</option>
                        <option value="ASIA_AUSTRALIA">آسيا وأستراليا</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">رمز الدولة (كود العلم)</label>
                      <input type="text" required value={formData.countryCode || "DE"} onChange={(e) => setFormData({...formData, countryCode: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">مفهرس (Indexable)؟</label>
                      <select value={formData.indexable ? "true" : "false"} onChange={(e) => setFormData({...formData, indexable: e.target.value === "true"})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="true">نعم (مكتملة المتطلبات)</option>
                        <option value="false">لا (غير مكتملة)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1.5">الرابط الفريد (Slug)</label>
                    <input type="text" required value={formData.slug || ""} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                  </div>
                </div>
              )}

              {/* GOVERNMENT FIELDS */}
              {activeTab === "government" && (
                <div className="space-y-4 text-xs text-gray-700">
                  {formTab === "ar" ? (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">الاسم (بالعربية)</label>
                        <input type="text" required value={formData.nameAr || ""} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">المتطلبات (سطر لكل متطلب)</label>
                        <textarea rows={4} value={formData.requirementsAr || ""} onChange={(e) => setFormData({...formData, requirementsAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">حالات الاستخدام (سطر لكل حالة)</label>
                        <textarea rows={3} value={formData.useCasesAr || ""} onChange={(e) => setFormData({...formData, useCasesAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">Name (English)</label>
                        <input type="text" required value={formData.nameEn || ""} onChange={(e) => setFormData({...formData, nameEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Requirements (one per line)</label>
                        <textarea rows={4} value={formData.requirementsEn || ""} onChange={(e) => setFormData({...formData, requirementsEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Use cases (one per line)</label>
                        <textarea rows={3} value={formData.useCasesEn || ""} onChange={(e) => setFormData({...formData, useCasesEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">الرابط الفريد (Slug)</label>
                      <input type="text" required value={formData.slug || ""} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">مفهرس (Indexable)؟</label>
                      <select value={formData.indexable ? "true" : "false"} onChange={(e) => setFormData({...formData, indexable: e.target.value === "true"})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="true">نعم (مكتمل)</option>
                        <option value="false">لا (غير مكتمل)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* LANGUAGES FIELDS */}
              {activeTab === "languages" && (
                <div className="space-y-4 text-xs text-gray-700">
                  {formTab === "ar" ? (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">اسم اللغة (بالعربية)</label>
                        <input type="text" required value={formData.nameAr || ""} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">الوصف (بالعربية)</label>
                        <textarea rows={3} required value={formData.descriptionAr || ""} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">Language Name (English)</label>
                        <input type="text" required value={formData.nameEn || ""} onChange={(e) => setFormData({...formData, nameEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Description (English)</label>
                        <textarea rows={3} required value={formData.descriptionEn || ""} onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">كود اللغة (ISO)</label>
                      <input type="text" required value={formData.code || ""} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">رائجة (Popular)؟</label>
                      <select value={formData.popular ? "true" : "false"} onChange={(e) => setFormData({...formData, popular: e.target.value === "true"})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="true">نعم (رائجة)</option>
                        <option value="false">لا (عادية)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">الرابط الفريد (Slug)</label>
                      <input type="text" required value={formData.slug || ""} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* BRANCHES FIELDS */}
              {activeTab === "branches" && (
                <div className="space-y-4 text-xs text-gray-700">
                  {formTab === "ar" ? (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">اسم الفرع (بالعربية)</label>
                        <input type="text" required value={formData.nameAr || ""} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">العنوان (بالعربية)</label>
                        <textarea rows={2} required value={formData.addressAr || ""} onChange={(e) => setFormData({...formData, addressAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">مواعيد العمل (بالعربية)</label>
                        <input type="text" required value={formData.workingHoursAr || ""} onChange={(e) => setFormData({...formData, workingHoursAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">Branch Name (English)</label>
                        <input type="text" required value={formData.nameEn || ""} onChange={(e) => setFormData({...formData, nameEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Address (English)</label>
                        <textarea rows={2} required value={formData.addressEn || ""} onChange={(e) => setFormData({...formData, addressEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Working Hours (English)</label>
                        <input type="text" required value={formData.workingHoursEn || ""} onChange={(e) => setFormData({...formData, workingHoursEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">رقم الهاتف</label>
                      <input type="text" required value={formData.phone || ""} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">رقم الواتساب</label>
                      <input type="text" required value={formData.whatsapp || ""} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">خط العرض (Latitude)</label>
                      <input type="number" step="0.0001" required value={formData.lat || 0.0} onChange={(e) => setFormData({...formData, lat: parseFloat(e.target.value)})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">خط الطول (Longitude)</label>
                      <input type="number" step="0.0001" required value={formData.lng || 0.0} onChange={(e) => setFormData({...formData, lng: parseFloat(e.target.value)})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1.5">رابط خرائط جوجل (Google Maps Link)</label>
                    <input type="text" required value={formData.googleMapsUrl || ""} onChange={(e) => setFormData({...formData, googleMapsUrl: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">الرابط الفريد (Slug)</label>
                      <input type="text" required value={formData.slug || ""} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* TEAM MEMBERS FIELDS */}
              {activeTab === "team" && (
                <div className="space-y-4 text-xs text-gray-700">
                  {formTab === "ar" ? (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">اسم المترجم (بالعربية)</label>
                        <input type="text" required value={formData.nameAr || ""} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">المسمى الوظيفي (بالعربية)</label>
                        <input type="text" required value={formData.titleAr || ""} onChange={(e) => setFormData({...formData, titleAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">السيرة الذاتية القصيرة (بالعربية)</label>
                        <textarea rows={3} required value={formData.bioAr || ""} onChange={(e) => setFormData({...formData, bioAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">Translator Name (English)</label>
                        <input type="text" required value={formData.nameEn || ""} onChange={(e) => setFormData({...formData, nameEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Job Title (English)</label>
                        <input type="text" required value={formData.titleEn || ""} onChange={(e) => setFormData({...formData, titleEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Short Bio (English)</label>
                        <textarea rows={3} required value={formData.bioEn || ""} onChange={(e) => setFormData({...formData, bioEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">التخصص اللغوي</label>
                      <input type="text" required value={formData.languagePair || ""} onChange={(e) => setFormData({...formData, languagePair: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" placeholder="الألمانية - العربية..." />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">أعوام الخبرة</label>
                      <input type="number" required value={formData.yearsExperience || 0} onChange={(e) => setFormData({...formData, yearsExperience: parseInt(e.target.value)})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">إدارة / قيادة؟</label>
                      <select value={formData.isLeadership ? "true" : "false"} onChange={(e) => setFormData({...formData, isLeadership: e.target.value === "true"})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="true">نعم (قيادة)</option>
                        <option value="false">لا (مترجم)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1.5">الشهادات والاعتمادات (سطر لكل شهادة)</label>
                    <textarea rows={2} value={formData.certifications || ""} onChange={(e) => setFormData({...formData, certifications: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                  </div>
                </div>
              )}

              {/* REVIEWS FIELDS */}
              {activeTab === "reviews" && (
                <div className="space-y-4 text-xs text-gray-700">
                  <div>
                    <label className="block font-bold mb-1.5">اسم العميل</label>
                    <input type="text" required value={formData.authorName || ""} onChange={(e) => setFormData({...formData, authorName: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">التقييم (1-5 نجوم)</label>
                      <input type="number" min="1" max="5" required value={formData.rating || 5} onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">نوع الخدمة</label>
                      <select value={formData.serviceType || "CERTIFIED"} onChange={(e) => setFormData({...formData, serviceType: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="CERTIFIED">ترجمة معتمدة</option>
                        <option value="LOCALIZATION">توطين برمجيات ومواقع</option>
                        <option value="INTERPRETATION">ترجمة فورية للمؤتمرات</option>
                      </select>
                    </div>
                  </div>

                  {formTab === "ar" ? (
                    <div>
                      <label className="block font-bold mb-1.5">نص التقييم (بالعربية)</label>
                      <textarea rows={3} required value={formData.textAr || ""} onChange={(e) => setFormData({...formData, textAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                  ) : (
                    <div>
                      <label className="block font-bold mb-1.5">Review Text (English)</label>
                      <textarea rows={3} required value={formData.textEn || ""} onChange={(e) => setFormData({...formData, textEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">رابط الفيديو (اختياري)</label>
                      <input type="text" value={formData.videoUrl || ""} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">حالة النشر</label>
                      <select value={formData.published ? "true" : "false"} onChange={(e) => setFormData({...formData, published: e.target.value === "true"})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="true">منشور (ظاهر بالموقع)</option>
                        <option value="false">مخفي (معلق)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOG POSTS FIELDS */}
              {activeTab === "posts" && (
                <div className="space-y-4 text-xs text-gray-700">
                  {formTab === "ar" ? (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">عنوان المقال (بالعربية)</label>
                        <input type="text" required value={formData.titleAr || ""} onChange={(e) => setFormData({...formData, titleAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">مقتطف المقال (بالعربية)</label>
                        <textarea rows={2} required value={formData.excerptAr || ""} onChange={(e) => setFormData({...formData, excerptAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">محتوى المقال (Markdown - بالعربية)</label>
                        <textarea rows={6} required value={formData.bodyAr || ""} onChange={(e) => setFormData({...formData, bodyAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none font-mono" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">التصنيف (بالعربية)</label>
                        <input type="text" required value={formData.categoryAr || ""} onChange={(e) => setFormData({...formData, categoryAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">Article Title (English)</label>
                        <input type="text" required value={formData.titleEn || ""} onChange={(e) => setFormData({...formData, titleEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Excerpt (English)</label>
                        <textarea rows={2} required value={formData.excerptEn || ""} onChange={(e) => setFormData({...formData, excerptEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Article Body (Markdown - English)</label>
                        <textarea rows={6} required value={formData.bodyEn || ""} onChange={(e) => setFormData({...formData, bodyEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none font-mono" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Category (English)</label>
                        <input type="text" required value={formData.categoryEn || ""} onChange={(e) => setFormData({...formData, categoryEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">الرابط الفريد (Slug)</label>
                      <input type="text" required value={formData.slug || ""} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">الكاتب (عضو فريق العمل)</label>
                      <select value={formData.authorId || ""} onChange={(e) => setFormData({...formData, authorId: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        {team.map((t) => (
                          <option key={t.id} value={t.id}>{t.nameAr}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">زمن القراءة (بالدقائق)</label>
                      <input type="number" required value={formData.readMinutes || 5} onChange={(e) => setFormData({...formData, readMinutes: parseInt(e.target.value)})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">حالة النشر</label>
                      <select value={formData.published ? "true" : "false"} onChange={(e) => setFormData({...formData, published: e.target.value === "true"})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="true">منشور</option>
                        <option value="false">مسودة</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">رابط الصورة المميزة</label>
                      <input type="text" value={formData.featuredImageUrl || ""} onChange={(e) => setFormData({...formData, featuredImageUrl: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* FAQS FIELDS */}
              {activeTab === "faqs" && (
                <div className="space-y-4 text-xs text-gray-700">
                  {formTab === "ar" ? (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">السؤال (بالعربية)</label>
                        <input type="text" required value={formData.questionAr || ""} onChange={(e) => setFormData({...formData, questionAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">الإجابة (بالعربية)</label>
                        <textarea rows={3} required value={formData.answerAr || ""} onChange={(e) => setFormData({...formData, answerAr: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-bold mb-1.5">Question (English)</label>
                        <input type="text" required value={formData.questionEn || ""} onChange={(e) => setFormData({...formData, questionEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold mb-1.5">Answer (English)</label>
                        <textarea rows={3} required value={formData.answerEn || ""} onChange={(e) => setFormData({...formData, answerEn: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">رقم الترتيب</label>
                      <input type="number" required value={formData.sortOrder || 0} onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value)})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">يتبع الصفحة الرئيسية؟</label>
                      <select value={formData.homepage ? "true" : "false"} onChange={(e) => setFormData({...formData, homepage: e.target.value === "true"})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="true">نعم (يظهر بالرئيسية)</option>
                        <option value="false">لا (مخصص لوثيقة/سفارة)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold mb-1.5">معرف المستند (اختياري)</label>
                      <select value={formData.documentId || ""} onChange={(e) => setFormData({...formData, documentId: e.target.value || null})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="">لا يوجد</option>
                        {docs.map((d) => (<option key={d.id} value={d.id}>{d.nameAr}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">معرف السفارة (اختياري)</label>
                      <select value={formData.embassyId || ""} onChange={(e) => setFormData({...formData, embassyId: e.target.value || null})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="">لا يوجد</option>
                        {embassies.map((em) => (<option key={em.id} value={em.id}>{em.nameAr}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1.5">معرف الهيئة (اختياري)</label>
                      <select value={formData.govEntityId || ""} onChange={(e) => setFormData({...formData, govEntityId: e.target.value || null})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none">
                        <option value="">لا يوجد</option>
                        {govs.map((gv) => (<option key={gv.id} value={gv.id}>{gv.nameAr}</option>))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SITE SETTINGS FIELDS */}
              {activeTab === "settings" && (
                <div className="space-y-4 text-xs text-gray-700">
                  <div>
                    <label className="block font-bold mb-1.5">مفتاح الإعداد (Key)</label>
                    <input type="text" required disabled={editItem !== null} value={formData.key || ""} onChange={(e) => setFormData({...formData, key: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5">القيمة (Value)</label>
                    <textarea rows={4} required value={formData.value || ""} onChange={(e) => setFormData({...formData, value: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2.5 outline-none" />
                  </div>
                </div>
              )}

              {/* SEO PREVIEW SECTION FOR INDEXABLE CONTENT */}
              {["documents", "embassies", "government", "posts"].includes(activeTab) && (
                <div className="mt-8 pt-6 border-t border-gray-150 bg-gray-50/50 rounded-xl p-4 space-y-4">
                  <h4 className="font-bold text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Eye className="h-4 w-4 text-primary-blue" />
                    <span>معاينة محرك البحث (Google SEO Preview)</span>
                  </h4>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1 shadow-inner">
                    <div className="text-blue-800 font-medium text-sm hover:underline cursor-pointer truncate">
                      {formTab === "ar"
                        ? `${formData.nameAr || formData.titleAr || "عنوان الصفحة"} | جلوبالايز جروب`
                        : `${formData.nameEn || formData.titleEn || "Page Title"} | Globalize Group`}
                    </div>
                    <div className="text-green-700 text-[10px] truncate" dir="ltr">
                      https://globalizetl.com/{formTab}/{activeTab}/{formData.slug || "page-slug"}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {formTab === "ar"
                        ? formData.descriptionAr || formData.excerptAr || "أدخل وصفاً للمحتوى..."
                        : formData.descriptionEn || formData.excerptEn || "Enter content description..."}
                    </div>
                  </div>

                  {/* Quality gating checklist indicator */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500">حالة الفهرسة الافتراضية:</span>
                    <span className={`text-[9px] font-black rounded px-2.5 py-1 ${
                      formData.indexable || (activeTab === "posts" && formData.published)
                        ? "bg-green-50 text-green-600 border border-green-200" 
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}>
                      {formData.indexable || (activeTab === "posts" && formData.published) 
                        ? (formTab === "ar" ? "مفهرس (Indexable) ✓" : "Indexable ✓")
                        : (formTab === "ar" ? "غير مفهرس (NoIndex) ✗" : "NoIndex ✗")}
                    </span>
                  </div>
                </div>
              )}

              {/* Form buttons */}
              <div className="mt-8 border-t border-gray-150 pt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-gold to-yellow-500 px-6 py-3 text-xs font-bold text-dark-navy shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QUOTE REQUEST STATUS WORKFLOW DETAILS */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-dark-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 border border-gray-150 animate-scale-up text-xs space-y-6 text-gray-700">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-sm text-dark-navy">تفاصيل طلب عرض السعر</h3>
              <button onClick={() => setSelectedQuote(null)} className="text-gray-400 hover:text-gray-900 font-bold">X</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-gray-400 font-semibold mb-1">العميل:</span>
                  <span className="font-bold text-dark-navy text-sm">{selectedQuote.name}</span>
                </div>
                <div>
                  <span className="block text-gray-400 font-semibold mb-1">الهاتف:</span>
                  <span className="font-semibold text-gray-600 text-sm" dir="ltr">{selectedQuote.phone}</span>
                </div>
              </div>

              <div>
                <span className="block text-gray-400 font-semibold mb-1">نوع الخدمة:</span>
                <span className="font-semibold text-gray-700">{selectedQuote.serviceType}</span>
              </div>

              <div>
                <span className="block text-gray-400 font-semibold mb-1">ملاحظات العميل:</span>
                <p className="bg-gray-50 border border-gray-200 rounded-xl p-4 leading-relaxed font-arabic">
                  {selectedQuote.notes || "لا توجد ملاحظات إضافية."}
                </p>
              </div>

              {selectedQuote.fileUrl && (
                <div>
                  <span className="block text-gray-400 font-semibold mb-1">المستندات المرفقة:</span>
                  <a href={selectedQuote.fileUrl} target="_blank" className="inline-flex items-center gap-1.5 text-primary-blue hover:underline font-bold">
                    <FileText className="h-4 w-4" />
                    <span>تحميل المستند للمراجعة</span>
                  </a>
                </div>
              )}
            </div>

            {/* Workflow status updates */}
            <div className="border-t border-gray-100 pt-6 space-y-3">
              <h4 className="font-bold text-dark-navy">تحديث حالة الطلب (Workflow Status)</h4>
              <div className="flex flex-wrap gap-2">
                {["NEW", "CONTACTED", "QUOTED", "WON", "LOST"].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedQuote.id, st)}
                    className={`rounded px-3 py-1.5 font-black text-[9px] border transition-all ${
                      selectedQuote.status === st 
                        ? "bg-primary-blue text-white border-primary-blue" 
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-end">
              <button
                onClick={() => setSelectedQuote(null)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-50"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
