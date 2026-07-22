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
  return getSEOHeaders(service.name, service.description, "/interpretation", service.indexable, locale);
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
