import type { Metadata } from 'next';
import { getSiteUrl } from './siteUrl';

const SITE_URL = getSiteUrl();

interface AlternateLinks {
  canonical: string;
  languages: Record<string, string>;
}

export function getSEOHeaders(
  title: string,
  description: string,
  path: string,
  indexable: boolean = true,
  locale: string = 'ar',
  hasEnglishTranslation: boolean = true
): Metadata {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const arUrl = `${SITE_URL}/ar${cleanPath}`;
  const enUrl = `${SITE_URL}/en${cleanPath}`;

  // If locale is 'en' and no genuine English translation exists:
  // 1. noindex, follow
  // 2. Cross-canonical to /ar counterpart
  // 3. Do not declare invalid hreflang
  const isUntranslatedEn = locale === 'en' && !hasEnglishTranslation;
  
  const canonicalUrl = isUntranslatedEn ? arUrl : `${SITE_URL}/${locale}${cleanPath}`;

  const robots = (indexable && !isUntranslatedEn)
    ? { index: true, follow: true }
    : { index: false, follow: true };

  // Hreflang alternates: If no English translation exists, hreflang must NOT point to noindex /en
  const languages: Record<string, string> = {
    'ar': arUrl,
    'x-default': arUrl,
  };

  if (hasEnglishTranslation) {
    languages['en'] = enUrl;
  }

  return {
    title,
    description,
    robots,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: locale === 'ar' ? 'جلوباليز جروب' : 'Globalize Group',
      images: [
        {
          url: `${SITE_URL}/globalize-og.jpg`,
          width: 1200,
          height: 630,
          alt: locale === 'ar' ? 'شعار جلوباليز جروب' : 'Globalize Group Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/globalize-og.jpg`],
    },
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
}

// JSON-LD Structured Data Generators

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    'name': 'جلوباليز جروب لأعمال الترجمة المعتمدة',
    'alternateName': 'Globalize Group for Certified Translation',
    'url': SITE_URL,
    'logo': `${SITE_URL}/logo.png`,
    'image': `${SITE_URL}/globalize-og.jpg`,
    'email': 'info@globalizetl.com',
    'telephone': '+20 106 299 0808',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '1 Cairo University St., Office 29, 8th Floor, Above Omar Effendi',
      'addressLocality': 'Giza',
      'addressCountry': 'EG',
    },
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'telephone': '+20 106 299 0808',
        'contactType': 'customer service',
        'areaServed': ['EG', 'GCC'],
        'availableLanguage': ['Arabic', 'English'],
      },
    ],
    'sameAs': [
      'https://facebook.com/globalizegroup',
      'https://twitter.com/globalizegroup',
      'https://linkedin.com/company/globalizegroup',
    ],
  };
}

// Resolve a path or URL to an absolute, canonical-host URL.
// When a locale is given, locale-less paths ("/documents") are prefixed ("/ar/documents")
// so structured data points at the real, indexable URL instead of a redirecting one.
export function toAbsoluteSiteUrl(urlOrPath: string, locale?: string): string {
  let path = urlOrPath.trim();
  if (/^https?:\/\//i.test(path)) {
    try {
      const parsed = new URL(path);
      if (!/(^|\.)globalizetl\.com$/i.test(parsed.hostname)) return path;
      path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return path;
    }
  }
  if (!path.startsWith('/')) path = `/${path}`;
  if (locale && !/^\/(ar|en)(\/|$)/.test(path)) {
    path = path === '/' ? `/${locale}` : `/${locale}${path}`;
  }
  return `${SITE_URL}${path}`;
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[], locale?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': toAbsoluteSiteUrl(item.url, locale),
    })),
  };
}

export function generateServiceJsonLd(service: { name: string; description: string; url: string }) {
  const serviceUrl = toAbsoluteSiteUrl(service.url);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${serviceUrl}#service`,
    'name': service.name,
    'description': service.description,
    'url': serviceUrl,
    'serviceType': service.name,
    'areaServed': { '@type': 'Country', 'name': 'Egypt' },
    'provider': {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#organization`,
      'name': 'جلوباليز جروب لأعمال الترجمة المعتمدة',
      'image': `${SITE_URL}/logo.png`,
      'telephone': '+20 106 299 0808',
      'url': SITE_URL,
    },
  };
}

// Egyptian local mobile numbers (01xxxxxxxxx) -> E.164-style international format for structured data.
function toInternationalPhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (/^01\d{9}$/.test(digits)) return `+20${digits.slice(1)}`;
  return phone;
}

// Best-effort city for a branch address (the branches are in Giza or Cairo).
function branchLocality(address: string): string {
  if (/cairo|heliopolis|القاهرة|مصر الجديدة/i.test(address)) return 'Cairo';
  if (/giza|الجيزة/i.test(address)) return 'Giza';
  return 'Giza/Cairo';
}

export function generateLocalBusinessJsonLd(branch: {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  workingHours: string;
  lat: number;
  lng: number;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': branch.name,
    'image': `${SITE_URL}/logo.png`,
    '@id': branch.url,
    'url': branch.url,
    'telephone': toInternationalPhone(branch.phone),
    'email': 'info@globalizetl.com',
    'parentOrganization': { '@id': `${SITE_URL}/#organization` },
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': branch.address,
      'addressLocality': branchLocality(branch.address),
      'addressCountry': 'EG',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': branch.lat,
      'longitude': branch.lng,
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        'opens': '09:00',
        'closes': '21:00',
      },
    ],
  };
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };
}

// Certified translation of a document is a service, not a physical product:
// emit Service + Offer (price per page) instead of Product.
export function generateOfferJsonLd(doc: { name: string; priceEGP: number; url: string; description?: string }) {
  const url = toAbsoluteSiteUrl(doc.url);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    'name': doc.name,
    'description': doc.description || doc.name,
    'url': url,
    'serviceType': 'Certified translation',
    'areaServed': { '@type': 'Country', 'name': 'Egypt' },
    'provider': { '@id': `${SITE_URL}/#organization` },
    'offers': {
      '@type': 'Offer',
      'url': url,
      'priceCurrency': 'EGP',
      'price': doc.priceEGP,
      'availability': 'https://schema.org/InStock',
      'priceSpecification': {
        '@type': 'UnitPriceSpecification',
        'price': doc.priceEGP,
        'priceCurrency': 'EGP',
        'unitText': 'page',
      },
    },
  };
}

export function generateArticleJsonLd(post: {
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  publishedAt: Date;
  updatedAt: Date;
  url: string;
  authorName: string;
  locale?: string;
}) {
  // Team bylines ("Globalize Group Translation Team") are organizations, not people.
  const isTeamAuthor = /globalize|جلوباليز|فريق|team/i.test(post.authorName);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.excerpt,
    'image': toAbsoluteSiteUrl(post.featuredImageUrl || '/globalize-og.jpg'),
    'url': post.url,
    ...(post.locale ? { 'inLanguage': post.locale } : {}),
    'datePublished': post.publishedAt.toISOString(),
    'dateModified': post.updatedAt.toISOString(),
    'author': isTeamAuthor
      ? { '@type': 'Organization', 'name': post.authorName, 'url': SITE_URL }
      : { '@type': 'Person', 'name': post.authorName },
    'publisher': {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      'name': 'جلوباليز جروب',
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_URL}/logo.png`,
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': post.url,
    },
  };
}

export function generateAggregateRatingJsonLd(rating: number, count: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'جلوباليز جروب لأعمال الترجمة المعتمدة',
    'image': `${SITE_URL}/logo.png`,
    'telephone': '+201062990808',
    'url': SITE_URL,
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': rating.toFixed(1),
      'reviewCount': count,
      'bestRating': '5',
      'worstRating': '1',
    },
  };
}
