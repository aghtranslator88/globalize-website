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
      siteName: locale === 'ar' ? 'جلوبالايز جروب' : 'Globalize Group',
      images: [
        {
          url: `${SITE_URL}/globalize-og.jpg`,
          width: 1200,
          height: 630,
          alt: locale === 'ar' ? 'شعار جلوبالايز جروب' : 'Globalize Group Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/globalize-og.jpg`],
    },
  };
}

// JSON-LD Structured Data Generators

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    'name': 'جلوبالايز جروب لأعمال الترجمة المعتمدة',
    'alternateName': 'Globalize Group for Certified Translation',
    'url': SITE_URL,
    'logo': `${SITE_URL}/logo.png`,
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

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateServiceJsonLd(service: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': service.name,
    'description': service.description,
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'جلوبالايز جروب لأعمال الترجمة المعتمدة',
      'image': `${SITE_URL}/logo.png`,
      'telephone': '+20 106 299 0808',
      'url': SITE_URL,
    },
  };
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
    'image': `${SITE_URL}/branch.jpg`,
    '@id': branch.url,
    'url': branch.url,
    'telephone': branch.phone,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': branch.address,
      'addressLocality': 'Giza/Cairo',
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

export function generateOfferJsonLd(doc: { name: string; priceEGP: number; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': doc.name,
    'description': doc.name,
    'offers': {
      '@type': 'Offer',
      'url': doc.url,
      'priceCurrency': 'EGP',
      'price': doc.priceEGP,
      'availability': 'https://schema.org/InStock',
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
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.excerpt,
    'image': post.featuredImageUrl || `${SITE_URL}/blog-default.jpg`,
    'datePublished': post.publishedAt.toISOString(),
    'dateModified': post.updatedAt.toISOString(),
    'author': {
      '@type': 'Person',
      'name': post.authorName,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'جلوبالايز جروب',
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
    'name': 'جلوبالايز جروب لأعمال الترجمة المعتمدة',
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
