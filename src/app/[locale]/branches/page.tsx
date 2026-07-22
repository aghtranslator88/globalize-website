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
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center flex-shrink-0">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-dark-navy font-arabic">
                    {b.name}
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs text-gray-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4.5 w-4.5 text-primary-blue mt-0.5 flex-shrink-0" />
                    <p className="leading-relaxed font-arabic">{b.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4.5 w-4.5 text-primary-blue flex-shrink-0" />
                    <span dir="ltr">{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4.5 w-4.5 text-whatsapp-green flex-shrink-0" />
                    <a
                      href={`https://wa.me/${b.whatsapp.replace("+", "")}`}
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

              {/* Map Embed Placeholder */}
              <div className="h-52 bg-gray-100 relative border-t border-gray-100 flex items-center justify-center text-center p-4">
                <div className="space-y-2">
                  <MapPin className="h-8 w-8 text-primary-blue/60 mx-auto" />
                  <p className="text-[10px] text-gray-500 font-bold">
                    {isAr ? "موقع الخريطة الجغرافي" : "Geographic Map Coordinates"}
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium">
                    Lat: {b.lat} | Lng: {b.lng}
                  </p>
                  <a
                    href={b.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[10px] text-primary-blue hover:underline font-bold mt-2"
                  >
                    {isAr ? "افتح في خرائط جوجل ↗" : "Open in Google Maps ↗"}
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
