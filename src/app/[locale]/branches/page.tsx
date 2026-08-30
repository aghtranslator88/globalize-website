import { setRequestLocale } from "next-intl/server";
import { getBranches } from "@/lib/data";
import { getSEOHeaders, generateLocalBusinessJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import { Phone, Clock, MapPin, Landmark } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ar" ? "فروع ومكاتب جلوبالايز جروب للترجمة" : "Globalize Group Branches & Offices";
  const description = locale === "ar"
    ? "عناوين فروعنا وأرقام الهواتف ومواعيد العمل لفرع الهرم وفروعنا الأخرى بمصر."
    : "Addresses, phone numbers, and working hours for our Haram and other branches in Egypt.";
  return getSEOHeaders(title, description, "/branches", true, locale);
}

export default async function BranchesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const branches = await getBranches(locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "فروعنا" : "Our Branches", url: "/branches" },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {branches.map((b) => (
        <script
          key={b.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateLocalBusinessJsonLd({
                name: b.name,
                address: b.address,
                phone: b.phone,
                whatsapp: b.whatsapp,
                workingHours: b.workingHours,
                lat: b.lat,
                lng: b.lng,
                url: `https://globalizetl.com/${locale}/branches#${b.slug}`,
              })
            ),
          }}
        />
      ))}
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

        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-4 font-arabic">
            {isAr ? "فروع ومكاتب جلوبالايز جروب" : "Globalize Group Branches & Offices"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "تفضل بزيارتنا في أقرب فرع إليك لاستلام وتوثيق مستنداتك المترجمة. نوفر تغطية كاملة لمحافظات القاهرة الكبرى والجيزة."
              : "Visit us at our nearest office to pick up and legalize your translations. We fully cover Cairo and Giza."}
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {branches.map((b) => (
            <div
              key={b.id}
              id={b.slug}
              className="rounded-2xl border border-gray-150 bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center flex-shrink-0">
                      <Landmark className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-bold text-dark-navy font-arabic">
                      {b.name}
                    </h2>
                  </div>
                  <a
                    href={b.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-primary-blue text-[11px] font-bold transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{isAr ? "Google Maps" : "Google Maps"}</span>
                  </a>
                </div>

                <div className="space-y-3.5 text-xs text-gray-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4.5 w-4.5 text-primary-blue mt-0.5 flex-shrink-0" />
                    <a
                      href={b.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="leading-relaxed font-arabic hover:text-primary-blue hover:underline transition-colors"
                      title={isAr ? "افتح الموقع في خرائط جوجل" : "Open location in Google Maps"}
                    >
                      {b.address}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4.5 w-4.5 text-primary-blue flex-shrink-0" />
                    <a href={`tel:${b.phone}`} className="hover:text-primary-blue hover:underline" dir="ltr">
                      {b.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4.5 w-4.5 text-whatsapp-green flex-shrink-0" />
                    <a
                      href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        isAr ? `مرحباً، أود الاستفسار عن زيارة ${b.name}` : `Hello, I'd like to inquire about visiting ${b.name}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-whatsapp-green font-bold"
                    >
                      {b.whatsapp}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-4.5 w-4.5 text-primary-blue mt-0.5 flex-shrink-0" />
                    <span className="font-arabic">{b.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Google Map Box & Direct Link */}
              <div className="bg-gray-50 border-t border-gray-150 p-4 space-y-3">
                <div className="w-full h-44 rounded-xl overflow-hidden border border-gray-200 shadow-inner relative bg-gray-100">
                  <iframe
                    title={`Google Map - ${b.name}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${b.lat},${b.lng}&hl=${locale}&z=15&output=embed`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={b.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary-blue hover:bg-blue-800 text-white py-2.5 px-4 text-xs font-bold shadow-xs hover:shadow-md transition-all text-center"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{isAr ? "فتح في خرائط Google ↗" : "Open in Google Maps ↗"}</span>
                  </a>

                  <a
                    href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      isAr ? `أريد الاستفسار عن ترجمة أوراق في ${b.name}` : `I want to translate documents at ${b.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp-green hover:bg-emerald-600 text-white py-2.5 px-4 text-xs font-bold shadow-xs hover:shadow-md transition-all text-center"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{isAr ? "تواصل مع الفرع واتساب" : "WhatsApp This Branch"}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
