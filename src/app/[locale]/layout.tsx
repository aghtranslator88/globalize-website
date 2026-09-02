import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Cairo, Inter } from 'next/font/google';
import AuthProvider from '@/components/SessionProvider';
import '../globals.css';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-cairo',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-inter',
});

export const metadata = {
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming locale is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Set request locale (essential for static generation / optimization in next-intl)
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className={locale === 'ar' ? 'font-arabic' : 'font-latin'} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
