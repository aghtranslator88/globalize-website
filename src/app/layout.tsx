import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.globalizetl.com'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/logo-icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

type Props = {
  children: ReactNode;
};

// Since we have a `[locale]` dynamic segment, a top-level Layout is required
// but next-intl redirects from root, so this layout can just render children.
export default function RootLayout({ children }: Props) {
  return children;
}

