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

      // Old blogs path
      { source: '/blogs', destination: '/ar/blog', permanent: true },
      { source: '/blogs/:path*', destination: '/ar/blog', permanent: true },

      // Old service-details paths
      { source: '/service-details/1/:slug*', destination: '/ar/certified', permanent: true },
      { source: '/service-details/4/:slug*', destination: '/ar/certified', permanent: true },
      { source: '/service-details/5/:slug*', destination: '/ar/certified', permanent: true },
      { source: '/service-details/8/:slug*', destination: '/ar/localization', permanent: true },
      { source: '/service-details/:path*', destination: '/ar/certified', permanent: true },

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

