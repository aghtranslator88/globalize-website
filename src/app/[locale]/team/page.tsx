import { setRequestLocale } from "next-intl/server";
import { getTeamMembers } from "@/lib/data";
import { getSEOHeaders, generateBreadcrumbJsonLd } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import { Users, Award, ShieldAlert, GraduationCap, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ar" ? "فريق عمل ومترجمي جلوبالايز جروب" : "Globalize Group Translation Team";
  const description = locale === "ar"
    ? "تعرف على خبراء اللغة والمترجمين القانونيين المعتمدين والمترجمين الفوريين بجلوبالايز جروب."
    : "Meet our language experts, certified legal translators, and conference interpreters at Globalize Group.";
  return getSEOHeaders(title, description, "/team", true, locale);
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const team = await getTeamMembers(locale);
  const isAr = locale === "ar";

  const breadcrumbs = [
    { name: isAr ? "الرئيسية" : "Home", url: "/" },
    { name: isAr ? "فريق المترجمين" : "Our Team", url: "/team" },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  // Split into leadership and translators
  const leadership = team.filter((t) => t.isLeadership);
  const translators = team.filter((t) => !t.isLeadership);

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

        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-4xl font-black text-dark-navy mb-4 font-arabic">
            {isAr ? "فريق عمل وخبراء جلوبالايز جروب" : "Globalize Group Translation Team"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "نخبة من المترجمين القانونيين المعتمدين واللغويين المتخصصين ممن يحملون شهادات عليا وعضوية نقابات المترجمين الدولية."
              : "An elite group of certified legal translators and linguistics experts holding postgraduate degrees and international memberships."}
          </p>
        </div>

        {/* Stats Strip */}
        <section className="bg-gradient-to-r from-dark-navy to-primary-blue text-white rounded-2xl p-8 mb-16 shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-black text-gold mb-1 font-arabic">15+</p>
              <p className="text-[10px] text-gray-200">{isAr ? "عاماً من الخبرة" : "Years of Experience"}</p>
            </div>
            <div>
              <p className="text-3xl font-black text-gold mb-1 font-arabic">50+</p>
              <p className="text-[10px] text-gray-200">{isAr ? "مترجماً ولغوياً" : "Translators & Linguists"}</p>
            </div>
            <div>
              <p className="text-3xl font-black text-gold mb-1 font-arabic">100%</p>
              <p className="text-[10px] text-gray-200">{isAr ? "دقة وقبول لدى الجهات" : "Accuracy & Acceptance"}</p>
            </div>
            <div>
              <p className="text-3xl font-black text-gold mb-1 font-arabic">+100K</p>
              <p className="text-[10px] text-gray-200">{isAr ? "صفحة مترجمة معتمدة" : "Certified Pages Translated"}</p>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        {leadership.length > 0 && (
          <div className="space-y-8 mb-16">
            <h2 className="text-xl font-bold text-dark-navy border-b border-gray-100 pb-3 flex items-center gap-2 font-arabic">
              <span className="h-4 w-1 bg-primary-blue rounded-full"></span>
              <span>{isAr ? "الإدارة والقيادة اللغوية" : "Management & Leadership"}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadership.map((member) => (
                <div key={member.id} className="rounded-2xl border border-gray-150 p-6 bg-white shadow-sm flex flex-col justify-between hover-lift">
                  <div>
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-gold to-yellow-500 text-dark-navy font-bold text-xl flex items-center justify-center mb-4">
                      {member.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy mb-1 font-arabic">{member.name}</h3>
                    <span className="inline-block text-[9px] font-bold text-primary-blue bg-primary-blue/10 rounded px-2.5 py-1 mb-4">
                      {member.title}
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed mb-6 font-arabic">{member.bio}</p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 text-[10px] text-gray-500 space-y-2 mt-auto">
                    <div><strong>{isAr ? "الزوج اللغوي:" : "Language Pair:"}</strong> {member.languagePair}</div>
                    <div><strong>{isAr ? "سنوات الخبرة:" : "Experience:"}</strong> {member.yearsExperience} {isAr ? "عاماً" : "years"}</div>
                    {member.certifications && member.certifications.length > 0 && (
                      <div className="pt-2 border-t border-gray-50 flex flex-wrap gap-1">
                        {member.certifications.slice(0, 2).map((cert, idx) => (
                          <span key={idx} className="bg-gray-50 border border-gray-200 text-[8px] font-bold px-2 py-0.5 rounded text-gray-600">
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Translators Section */}
        {translators.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-dark-navy border-b border-gray-100 pb-3 flex items-center gap-2 font-arabic">
              <span className="h-4 w-1 bg-primary-blue rounded-full"></span>
              <span>{isAr ? "أخصائيو الترجمة والتدقيق" : "Translators & Reviewers"}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {translators.map((member) => (
                <div key={member.id} className="rounded-2xl border border-gray-150 p-6 bg-white shadow-sm flex flex-col justify-between hover-lift">
                  <div>
                    <div className="h-16 w-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-gray-300" />
                    </div>
                    <h3 className="font-bold text-sm text-dark-navy mb-1 font-arabic">{member.name}</h3>
                    <span className="inline-block text-[9px] font-bold text-gray-500 bg-gray-100 rounded px-2.5 py-1 mb-4">
                      {member.title}
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed mb-6 font-arabic">{member.bio}</p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 text-[10px] text-gray-500 space-y-2 mt-auto">
                    <div><strong>{isAr ? "التخصص:" : "Specialty:"}</strong> {member.languagePair}</div>
                    <div><strong>{isAr ? "الخبرة:" : "Experience:"}</strong> {member.yearsExperience} {isAr ? "أعوام" : "years"}</div>
                    {member.certifications && member.certifications.length > 0 && (
                      <div className="pt-2 border-t border-gray-55 flex flex-wrap gap-1">
                        {member.certifications.slice(0, 2).map((cert, idx) => (
                          <span key={idx} className="bg-gray-50 border border-gray-200 text-[8px] font-bold px-2 py-0.5 rounded text-gray-600">
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
