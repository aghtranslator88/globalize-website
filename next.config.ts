import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
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

      // Legacy locale prefixes
      { source: '/ja', destination: '/ar', permanent: true },
      { source: '/ja/:path*', destination: '/ar', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);

