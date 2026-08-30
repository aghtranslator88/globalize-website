import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      // .html duplicate & extension catch-all redirects (Phase 2)
      { source: '/:locale(ar|en)/embassies/accredited-office-embassy-cyprus.html', destination: '/:locale/embassies/accredited-office-embassy-cyprus', permanent: true },
      { source: '/:locale(ar|en)/embassies/greek-translation-office-accredited-embassy.html', destination: '/:locale/embassies/greek-translation-office-accredited-embassy', permanent: true },
      { source: '/:locale(ar|en)/embassies/translation-certified-by-the-turkish-embassy.html', destination: '/:locale/embassies/translation-certified-by-the-turkish-embassy', permanent: true },
      { source: '/:locale(ar|en)/embassies/translation-italian-embassy.html', destination: '/:locale/embassies/translation-italian-embassy', permanent: true },
      { source: '/:locale(ar|en)/:path*.html', destination: '/:locale/:path*', permanent: true },
      { source: '/:path*.html', destination: '/ar/:path*', permanent: true },

      // Phase 3 & 4: Truncated, Mangled, Competitor Brand & Duplicate Slugs Redirects
      { source: '/:locale(ar|en)/embassies/افضل-مترجم-ايطالي-معتمد-من-السفارة-الا', destination: '/:locale/embassies/افضل-مترجم-ايطالي-معتمد-من-السفارة-الايطالية', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-معتمد-من-السفارة-الاوكراني', destination: '/:locale/embassies/مكتب-ترجمة-معتمد-من-السفارة-الاوكرانية', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-معتمد-من-السفارة-سان-بيار-مي', destination: '/:locale/embassies/مكتب-ترجمة-معتمد-من-السفارة-سان-بيار-وميكلون', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-معتمد-لدى-سفارة-الولايات-ال', destination: '/:locale/embassies/مكتب-ترجمة-معتمد-لدى-سفارة-الولايات-المتحدة', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-معتمد-من-سفارة-جزر-الأنتيل-ا', destination: '/:locale/embassies/مكتب-ترجمة-معتمد-من-سفارة-جزر-الأنتيل-الهولندية', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-معتمد-من-سفارة-منغوليا-في-ال', destination: '/:locale/embassies/مكتب-ترجمة-معتمد-من-سفارة-منغوليا', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-معتمد-من-سفارة-كاليدونيا', destination: '/:locale/embassies/مكتب-ترجمة-معتمد-من-سفارة-كاليدونيا-الجديدة', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-فيا-ترنسليشن-سفارة-الجبل', destination: '/:locale/embassies/مكتب-ترجمة-معتمد-سفارة-الجبل-الأسود', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-فيا-ترنسليشن-سفارة-المملكة', destination: '/:locale/embassies/مكتب-ترجمة-معتمد-سفارة-المملكة-المتحدة', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-معتمدة-من-السفارة-الامريكي', destination: '/:locale/embassies/مكتب-ترجمة-معتمد-من-السفارة-الامريكية', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-معتمد-لدى-السفارات-والجهات', destination: '/:locale/embassies/مكتب-ترجمة-معتمد-لدى-السفارات-والجهات-الحكومية', permanent: true },
      { source: '/:locale(ar|en)/embassies/قائمة-المترجمين-المعتمدين-من-السفارة', destination: '/:locale/embassies/قائمة-المترجمين-المعتمدين-من-السفارات', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-معتمد-من-السفارة-اليبانية', destination: '/:locale/embassies/مكتب-ترجمة-معتمد-من-السفارة-اليابانية', permanent: true },
      { source: '/:locale(ar|en)/blog/أفضل-مترجم-معتمد-في-دبي-والشرق-الأوسط-في-مع', destination: '/:locale/blog/أفضل-مترجم-معتمد-في-دبي-والشرق-الأوسط', permanent: true },
      { source: '/:locale(ar|en)/blog/أفضل-مكتب-ترجمة-معتمد-في-الشرق-الأوسط-في', destination: '/:locale/blog/أفضل-مكتب-ترجمة-معتمد-في-الشرق-الأوسط', permanent: true },
      { source: '/:locale(ar|en)/blog/إيجار-سماعات-وشاشات-وكافة-معدات-الترجمة-الفورية-في', destination: '/:locale/blog/إيجار-سماعات-وشاشات-ومعدات-الترجمة-الفورية', permanent: true },
      { source: '/:locale(ar|en)/blog/جلوباليز-جروب-للترجمة-المعتمدة-أفضل-مكتب-ترجمة-فورية-في', destination: '/:locale/blog/جلوباليز-جروب-أفضل-مكتب-ترجمة-فورية', permanent: true },
      { source: '/:locale(ar|en)/blog/حجز-موعد-سفارة-المانيا-في-خدمات-الترجمة-المعتمدة', destination: '/:locale/blog/حجز-موعد-سفارة-المانيا-للترجمة-المعتمدة', permanent: true },
      { source: '/:locale(ar|en)/blog/مكتب-ترجمة-معتمد-في-رمسيس-والقاهرة-وجمهورية-مصر-العربية', destination: '/:locale/blog/مكتب-ترجمة-معتمد-في-رمسيس-والقاهرة', permanent: true },
      { source: '/:locale(ar|en)/blog/services-في-خدمات-الترجمة-المعتمدة', destination: '/:locale/blog/خدمات-الترجمة-المعتمدة-الشاملة', permanent: true },
      { source: '/:locale(ar|en)/blog/about-us-في-خدمات-الترجمة-المعتمدة', destination: '/:locale/blog/عن-جلوباليز-جروب-للترجمة-المعتمدة', permanent: true },
      { source: '/:locale(ar|en)/blog/contact-us-في-خدمات-الترجمة-المعتمدة', destination: '/:locale/blog/تواصل-مع-مكتب-ترجمة-معتمد', permanent: true },
      { source: '/:locale(ar|en)/blog/quotes-delivery-في-خدمات-الترجمة-المعتمدة', destination: '/:locale/blog/أسعار-وتسليم-الترجمة-المعتمدة', permanent: true },
      { source: '/:locale(ar|en)/blog/transcription-في-خدمات-الترجمة-المعتمدة', destination: '/:locale/blog/خدمات-التفريغ-الصوتي-والترجمة', permanent: true },
      { source: '/:locale(ar|en)/blog/content-writing-في-خدمات-الترجمة-المعتمدة', destination: '/:locale/blog/خدمات-صناعة-المحتوى-والترجمة', permanent: true },
      { source: '/:locale(ar|en)/blog/e-الدفع-الإلكتروني-في-خدمات-الترجمة-المعتمدة', destination: '/:locale/blog/طرق-الدفع-الإلكتروني-للترجمة', permanent: true },
      { source: '/:locale(ar|en)/blog/medical-ترجمة', destination: '/:locale/blog/الترجمة-الطبية-المعتمدة', permanent: true },
      { source: '/:locale(ar|en)/blog/جلوباليز-جروب-للترجمة-المعتمدة-is-translation', destination: '/:locale/blog/معايير-الترجمة-المعتمدة-جلوباليز-جروب', permanent: true },
      { source: '/:locale(ar|en)/blog/مكتب-ترجمة-معتمد-2', destination: '/:locale/blog/مكتب-ترجمة-معتمد', permanent: true },
      { source: '/:locale(ar|en)/blog/مكتب-ترجمة-معتمد-3', destination: '/:locale/blog/مكتب-ترجمة-معتمد', permanent: true },
      { source: '/:locale(ar|en)/blog/مكتب-ترجمة-معتمد-4', destination: '/:locale/blog/مكتب-ترجمة-معتمد', permanent: true },
      { source: '/:locale(ar|en)/blog/مكتب-ترجمة-معتمد-5', destination: '/:locale/blog/مكتب-ترجمة-معتمد', permanent: true },
      { source: '/:locale(ar|en)/blog/ترجمة-معتمدة-2', destination: '/:locale/blog/ترجمة-معتمدة', permanent: true },
      { source: '/:locale(ar|en)/blog/الترجمة-التجارية-2', destination: '/:locale/blog/الترجمة-التجارية', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-معتمد-من-سفارة-مالطا-2', destination: '/:locale/embassies/مكتب-ترجمة-معتمد-من-سفارة-مالطا', permanent: true },
      { source: '/:locale(ar|en)/embassies/مكتب-ترجمة-معتمد-من-السفارة-الامريكية-2', destination: '/:locale/embassies/certified-translation-us-embassy-cairo', permanent: true },

      // Old home paths
      { source: '/home', destination: '/ar', permanent: true },
      { source: '/home/:path*', destination: '/ar', permanent: true },

      // About & Teams
      { source: '/about', destination: '/ar/team', permanent: true },
      { source: '/about-us', destination: '/ar/team', permanent: true },
      { source: '/teams', destination: '/ar/team', permanent: true },

      // Services root
      { source: '/services', destination: '/ar/certified', permanent: true },

      // Old blogs path
      { source: '/blogs', destination: '/ar/blog', permanent: true },
      { source: '/blogs/:path*', destination: '/ar/blog', permanent: true },

      // Marketing, Localization & Media service details
      { source: '/service-details/2/:slug*', destination: '/ar/localization', permanent: true },
      { source: '/service-details/4/marketing-translation-project', destination: '/ar/localization', permanent: true },
      { source: '/service-details/6/:slug*', destination: '/ar/localization', permanent: true },
      { source: '/service-details/8/:slug*', destination: '/ar/localization', permanent: true },
      { source: '/service-details/10/:slug*', destination: '/ar/localization', permanent: true },

      // Legal, Technical, Educational & Certified service details
      { source: '/service-details/1/:slug*', destination: '/ar/certified', permanent: true },
      { source: '/service-details/3/:slug*', destination: '/ar/certified', permanent: true },
      { source: '/service-details/4/:slug*', destination: '/ar/certified', permanent: true },
      { source: '/service-details/5/:slug*', destination: '/ar/certified', permanent: true },
      { source: '/service-details/7/:slug*', destination: '/ar/certified', permanent: true },
      { source: '/service-details/:path*', destination: '/ar/certified', permanent: true },

      // Old project details & portfolio
      { source: '/project-details/1/:slug*', destination: '/ar/certified', permanent: true },
      { source: '/project-details/3/:slug*', destination: '/ar/certified', permanent: true },
      { source: '/project-details/4/:slug*', destination: '/ar/localization', permanent: true },
      { source: '/project-details/7/:slug*', destination: '/ar/certified', permanent: true },
      { source: '/project-details/:path*', destination: '/ar/reviews', permanent: true },
      { source: '/projects/:path*', destination: '/ar/reviews', permanent: true },
      { source: '/portfolio/:path*', destination: '/ar/reviews', permanent: true },

      // Old job paths
      { source: '/job/:path*', destination: '/ar/team', permanent: true },
      { source: '/jobs/:path*', destination: '/ar/team', permanent: true },

      // Public prefix stripping from legacy CMS
      { source: '/public/:path*', destination: '/:path*', permanent: true },

      // Legacy standalone blog post slugs
      { source: '/power-of-words', destination: '/ar/blog', permanent: true },
      { source: '/power-of-words/:path*', destination: '/ar/blog', permanent: true },
      { source: '/why-human-translators-will-not-be-replaced-by-machine-translation', destination: '/ar/blog', permanent: true },
      { source: '/why-human-translators-will-not-be-replaced-by-machine-translation/:path*', destination: '/ar/blog', permanent: true },
      { source: '/ar/blog/altkaryr-altby-ahmytha-omkonatha-okyfy-aaadadha', destination: '/ar/blog', permanent: true },

      // Specialized Service & Project details
      { source: '/service-details/1/transcription-services', destination: '/ar/interpretation', permanent: true },
      { source: '/service-details/2/medical-translation-project', destination: '/ar/certified', permanent: true },
      { source: '/service-details/8/it-translation-project', destination: '/ar/localization', permanent: true },
      { source: '/project-details/8/it-translation-project', destination: '/ar/localization', permanent: true },
      { source: '/project-details/6/e-commerce-translation-project', destination: '/ar/localization', permanent: true },
      { source: '/project-details/5/financial-translation-project', destination: '/ar/certified', permanent: true },

      // Legacy locale prefixes
      { source: '/ja', destination: '/ar', permanent: true },
      { source: '/ja/:path*', destination: '/ar', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);

