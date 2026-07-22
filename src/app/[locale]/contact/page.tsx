import { setRequestLocale } from "next-intl/server";
import { getBranches, getSiteSettings } from "@/lib/data";
import { getSEOHeaders, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";
import { Link } from "@/i18n/routing";
import { Phone, Mail, MapPin, Clock, Landmark } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ar" ? "اتصل بنا واطلب عرض سعر مجاني" : "Contact Us & Request a Free Quote";
  const description = locale === "ar"
    ? "تواصل مع جلوبالايز جروب للترجمة المعتمدة. عناوين مكاتبنا وأرقام الهواتف ونموذج طلب التسعير السريع."
    : "Get in touch with Globalize Group. Office addresses, phone numbers, and fast online quote request form.";
  return getSEOHeaders(title, description, "/contact", true, locale);
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const branches = await getBranches(locale);
  const settings = await getSiteSettings();
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "اتصل بنا" : "Contact Us", url: "/contact" },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
          {/* H1 Title & Contact Form */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-4 font-arabic">
                {isAr ? "اتصل بنا واطلب تسعيرك مجاناً" : "Contact Us & Get a Quote"}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isAr
                  ? "يسعدنا تلقي طلباتكم واستفساراتكم على مدار اليوم. تواصل معنا بالنموذج التالي أو عبر الواتساب والفرع."
                  : "We are pleased to receive your requests. Reach out via the form, WhatsApp, or visit our branches."}
              </p>
            </div>

            <QuoteForm />
          </div>

          {/* Contact Details Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* WhatsApp CTA Card */}
            <div className="rounded-2xl bg-whatsapp-green/5 border border-whatsapp-green/20 p-6 text-center">
              <h3 className="font-bold text-sm text-whatsapp-green mb-2 flex items-center justify-center gap-1">
                <Phone className="h-4.5 w-4.5" />
                <span>{isAr ? "التواصل الفوري بالواتساب" : "WhatsApp Quick Chat"}</span>
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-6">
                {isAr 
                  ? "أرسل صور المستندات والشهادات مباشرة عبر الواتساب للحصول على تسعير فوري وموافقة الاعتماد."
                  : "Send your document pictures directly via WhatsApp for instant quoting and turnaround times."}
              </p>
              <a
                href={`https://wa.me/${settings.whatsapp?.replace("+", "")}?text=${encodeURIComponent(
                  isAr ? "أريد الاستفسار عن ترجمة معتمدة" : "I want to inquire about certified translation"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp-green text-white py-3.5 text-xs font-bold shadow-md hover:scale-[1.02] transition-transform animate-pulse-glow"
              >
                <Phone className="h-4 w-4" />
                <span>{isAr ? "راسل خبير الترجمة الآن" : "Chat on WhatsApp Now"}</span>
              </a>
            </div>

            {/* Email & Info Card */}
            <div className="rounded-2xl border border-gray-150 p-6 bg-white shadow-sm space-y-4">
              <h3 className="font-bold text-xs text-dark-navy uppercase tracking-wide border-b border-gray-100 pb-3">
                {isAr ? "قنوات التواصل العامة" : "General Contact Info"}
              </h3>
              <div className="space-y-3.5 text-xs text-gray-600">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary-blue flex-shrink-0" />
                  <span>{settings.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary-blue flex-shrink-0" />
                  <span dir="ltr">{settings.phone}</span>
                </div>
              </div>
            </div>

            {/* Branches Card */}
            <div className="rounded-2xl border border-gray-150 p-6 bg-white shadow-sm space-y-6">
              <h3 className="font-bold text-xs text-dark-navy uppercase tracking-wide border-b border-gray-100 pb-3">
                {isAr ? "مكاتبنا وفروعنا" : "Our Office Locations"}
              </h3>
              
              <div className="space-y-6">
                {branches.map((b) => (
                  <div key={b.id} className="space-y-2">
                    <h4 className="font-bold text-xs text-primary-blue flex items-center gap-1.5 font-arabic">
                      <Landmark className="h-4 w-4" />
                      <span>{b.name}</span>
                    </h4>
                    <div className="space-y-1.5 text-[11px] text-gray-500 pl-5 pr-5">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                        <span className="font-arabic">{b.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                        <span className="font-arabic">{b.workingHours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
