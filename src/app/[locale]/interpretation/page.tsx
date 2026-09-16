import { setRequestLocale } from "next-intl/server";
import { getServiceBySlug, getFAQs } from "@/lib/data";
import { getSEOHeaders, generateServiceJsonLd, generateFAQJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { Link } from "@/i18n/routing";
import { Headphones, Users, Mic, Laptop, HelpCircle, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const service = await getServiceBySlug("interpretation", locale);
  if (!service) return {};
  const isAr = locale === "ar";
  const title = isAr
    ? "تأجير أجهزة وخدمات الترجمة الفورية للمؤتمرات في مصر 2026 | جلوبالايز"
    : "Simultaneous Interpretation Services & Equipment Rental Egypt 2026 | Globalize";
  const description = isAr
    ? "أفضل خدمات الترجمة الفورية وتأجير أجهزة المؤتمرات في مصر لعام 2026. كبائن عازلة للصوت، سماعات استقبال رقمية، ومترجمون فوريون معتمدون لكافة اللغات والفعاليات."
    : "Premier conference interpretation and audio equipment rental in Egypt 2026. Soundproof booths, wireless digital receivers, and certified simultaneous interpreters.";
  return getSEOHeaders(title, description, "/interpretation", service.indexable, locale);
}

export default async function InterpretationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const service = await getServiceBySlug("interpretation", locale);
  if (!service) return null;

  const faqs = await getFAQs("service", service.id, locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: service.name, url: "/interpretation" },
  ];

  const serviceJsonLd = generateServiceJsonLd({
    name: service.name,
    description: service.description,
    url: `/${locale}/interpretation`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQJsonLd(faqs)) }}
        />
      )}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5">
            {breadcrumbs.map((b, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300">/</span>}
                <Link href={b.url} className="hover:text-primary-blue transition-colors">
                  {b.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-4 font-arabic">
                {service.name}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Definition answer box */}
            <div className="answer-box p-6 sm:p-8">
              <h3 className="font-bold text-xs text-primary-blue uppercase tracking-wide mb-2">
                {isAr ? "مفهوم الترجمة الفورية" : "Simultaneous Interpretation"}
              </h3>
              <p className="text-sm font-semibold text-dark-navy leading-relaxed font-arabic">
                {service.definition}
              </p>
            </div>

            {/* Conference Interpretation & Equipment Rental */}
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                {isAr ? "خدمات الترجمة الفورية وتأجير الأجهزة" : "Conference Interpretation & Audio Equipment"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-xl border border-gray-100 p-6 bg-white shadow-sm">
                  <Mic className="h-7 w-7 text-primary-blue mb-4" />
                  <h3 className="font-bold text-sm text-dark-navy mb-2">{isAr ? "ترجمة فورية للمؤتمرات" : "Simultaneous Interpretation"}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{isAr ? "مترجمون فوريون ذوو كفاءة عالية يغطون الفعاليات الطبية والاقتصادية والقانونية والتقنية بكافة اللغات." : "Highly qualified simultaneous interpreters covering medical, financial, and legal sectors across languages."}</p>
                </div>

                <div className="rounded-xl border border-gray-100 p-6 bg-white shadow-sm">
                  <Headphones className="h-7 w-7 text-primary-blue mb-4" />
                  <h3 className="font-bold text-sm text-dark-navy mb-2">{isAr ? "تأجير كبائن وأجهزة الترجمة" : "Interpretation Booth Rental"}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{isAr ? "تأجير كبائن الترجمة الفورية العازلة للصوت، وسماعات الرأس اللاسلكية ذات الجودة العالية، وأجهزة البث." : "Renting out soundproof interpreter booths, high-fidelity wireless headsets, and transmitters."}</p>
                </div>

                <div className="rounded-xl border border-gray-100 p-6 bg-white shadow-sm">
                  <Users className="h-7 w-7 text-primary-blue mb-4" />
                  <h3 className="font-bold text-sm text-dark-navy mb-2">{isAr ? "ترجمة الاجتماعات والوفود" : "Consecutive Interpretation"}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{isAr ? "مترجمون مرافقون للاجتماعات المغلقة، وزيارات الوفود، وجولات المصانع، والمفاوضات التجارية." : "Consecutive interpreters to accompany trade delegations, factory tours, and closed board meetings."}</p>
                </div>

                <div className="rounded-xl border border-gray-100 p-6 bg-white shadow-sm">
                  <Laptop className="h-7 w-7 text-primary-blue mb-4" />
                  <h3 className="font-bold text-sm text-dark-navy mb-2">{isAr ? "الترجمة الفورية عن بعد (RSI)" : "Remote Interpretation (RSI)"}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{isAr ? "ترجمة فورية عبر زووم ومنصات البث الرقمي للاجتماعات والمؤتمرات الافتراضية بدقة وكفاءة." : "Providing remote interpretation services via Zoom and digital web platforms for virtual events."}</p>
                </div>
              </div>
            </div>

            {/* Specialized Conference Equipment Section */}
            <div className="bg-gradient-to-br from-blue-50/50 via-white to-amber-50/30 rounded-2xl border border-blue-150/60 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-dark-navy mb-4 font-arabic flex items-center gap-2">
                <Headphones className="h-6 w-6 text-primary-blue" />
                <span>{isAr ? "تأجير وتجهيز أجهزة الترجمة الفورية للمؤتمرات في مصر" : "Conference Interpretation Equipment Rental in Egypt"}</span>
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed mb-6 font-arabic">
                {isAr
                  ? "توفر جلوباليز جروب أحدث منظومات الترجمة الفورية المتكاملة للمؤتمرات والندوات والمعارض الدولية في القاهرة والجيزة وجميع محافظات مصر، شاملة النقل والتركيب والتشغيل الميداني بواسطة مهندسي صوت معتمدين:"
                  : "Globalize Group supplies state-of-the-art simultaneous interpretation equipment for international summits, conferences, and corporate events across Egypt:"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-xs">
                  <h4 className="font-bold text-dark-navy mb-1.5 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-primary-blue" />
                    <span>{isAr ? "كبائن ترجمة عازلة للصوت (ISO 4043)" : "Soundproof Interpreter Booths (ISO 4043)"}</span>
                  </h4>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    {isAr ? "كبائن معيارية متنقلة عازلة للصوت بنسبة 100% مزودة بأنظمة تهوية هادئة وإضاءة متوافقة مع المعايير الدبلوماسية الدولية." : "Fully isolated modular booths with silent ventilation and high-clarity viewing panels."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-xs">
                  <h4 className="font-bold text-dark-navy mb-1.5 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-primary-blue" />
                    <span>{isAr ? "سماعات وأجهزة استقبال رقمية للحضور" : "Wireless Digital Receivers & Headsets"}</span>
                  </h4>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    {isAr ? "أجهزة استقبال متعددة القنوات تدعم حتى 16 لغة متزامنة بنقاء صوتي رقمي فائق وخالي من التشويش أو التداخل اللاسلكي." : "Multi-channel digital receivers supporting up to 16 languages with zero static or frequency drift."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-xs">
                  <h4 className="font-bold text-dark-navy mb-1.5 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-primary-blue" />
                    <span>{isAr ? "ميكروفونات المؤتمرات والمناقشة" : "Digital Conference Discussion Microphones"}</span>
                  </h4>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    {isAr ? "ميكروفونات عنقية (Gooseneck) وشاشات تحكم للمترجمين وموزعات صوت رقمية تناسب منصات كبار الشخصيات والوفود." : "Premium gooseneck delegate microphones with priority switching and DSP audio distribution."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-xs">
                  <h4 className="font-bold text-dark-navy mb-1.5 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-primary-blue" />
                    <span>{isAr ? "طاقم هندسي ودعم فني طوال الفعالية" : "Dedicated On-Site Sound Engineering"}</span>
                  </h4>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    {isAr ? "مهندسو وفنيو صوت متخصصون لإدارة الأجهزة وتوزيع واستلام السماعات ومراقبة بث الصوت المباشر من البداية للنهاية." : "Expert technical crew overseeing setup, live frequency balancing, and equipment management."}
                  </p>
                </div>
              </div>
            </div>

            {/* Execution checklist */}
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-6 border-b border-gray-100 pb-3 font-arabic">
                {isAr ? "ضوابط التجهيز والتشغيل للمؤتمرات" : "Conference Execution Standards"}
              </h2>
              <div className="space-y-4 text-xs text-gray-600">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p><strong>{isAr ? "توفير المترجمين في ثنائيات" : "Dual Interpreter Pairs"}</strong>: {isAr ? "نلتزم بتوفير مترجمين اثنين على الأقل لكل لغة ليتناوبا العمل كل 30 دقيقة حفاظاً على التركيز والجودة." : "We enforce staffing at least 2 interpreters per language booth to rotate every 30 minutes for optimum focus."}</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p><strong>{isAr ? "الدعم الفني الميداني" : "On-site Technical Support"}</strong>: {isAr ? "يتواجد مهندس صوت متخصص طوال فترة المؤتمر لتركيب وتجهيز الكبائن وتوزيع وصيانة أجهزة الاستقبال والسماعات." : "A dedicated sound engineer is on-site to set up booths, distribute headsets, and monitor live audio feeds."}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <QuoteForm services={[{ slug: "interpretation", name: isAr ? "ترجمة فورية للمؤتمرات" : "Interpretation" }]} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
