// Globalize Google Ads & Analytics Measurement Library
// Single, clean, direct Google Tag integration (AW-18001004291)

export const GOOGLE_ADS_ID = 'AW-18001004291';
export const GA_MEASUREMENT_ID = 'G-549YEXN01F';
export const GA_SECONDARY_ID = 'G-Y9K9XBC2Q9';
export const WHATSAPP_CONVERSION_LABEL = 'AW-18001004291/k8NtCKOM-oUcEIOOxodD';
export const PHONE_CONVERSION_LABEL = 'AW-18001004291/Uv5LCNClu_EcEIOOxodD';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface WhatsAppTrackingParams {
  cta_location: string;
  service?: string;
  language?: string;
  page_path?: string;
}

export interface PhoneTrackingParams {
  cta_location: string;
  language?: string;
  page_path?: string;
}

/**
 * Track intentional user click on WhatsApp CTA button or link.
 * Fires:
 * 1. Custom event 'whatsapp_click' (for GA4 and analytics)
 * 2. Primary Google Ads Conversion ('AW-18001004291/k8NtCKOM-oUcEIOOxodD')
 * STRICTLY MANUAL: Never call from programmatic window.open or form submit callbacks!
 */
export function trackWhatsAppClick(params: WhatsAppTrackingParams) {
  if (typeof window === 'undefined') return;

  const payload = {
    cta_location: params.cta_location,
    service: params.service || 'general',
    language: params.language || (document.documentElement.lang || 'ar'),
    page_path: params.page_path || window.location.pathname,
  };

  // Safe gtag dispatch
  if (typeof window.gtag === 'function') {
    // 1. Custom analytics event
    window.gtag('event', 'whatsapp_click', payload);

    // 2. Primary Google Ads conversion
    window.gtag('event', 'conversion', {
      send_to: WHATSAPP_CONVERSION_LABEL,
    });
  } else {
    // Fallback queue to dataLayer if gtag not yet initialized
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'whatsapp_click',
      ...payload,
    });
    window.dataLayer.push({
      event: 'conversion',
      send_to: WHATSAPP_CONVERSION_LABEL,
    });
  }

  // Developer logging in debug/development
  if (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined' && (window as any).__DEBUG_TRACKING__) {
    console.log('[Tracking] 🟢 WhatsApp Click Tracked:', payload);
  }
}

/**
 * Track intentional user click on tel: link.
 * Fires:
 * 1. Custom event 'phone_click'
 * 2. Secondary Google Ads Conversion ('AW-18001004291/Uv5LCNClu_EcEIOOxodD')
 */
export function trackPhoneClick(params: PhoneTrackingParams) {
  if (typeof window === 'undefined') return;

  const payload = {
    cta_location: params.cta_location,
    language: params.language || (document.documentElement.lang || 'ar'),
    page_path: params.page_path || window.location.pathname,
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'phone_click', payload);
    window.gtag('event', 'conversion', {
      send_to: PHONE_CONVERSION_LABEL,
    });
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'phone_click',
      ...payload,
    });
    window.dataLayer.push({
      event: 'conversion',
      send_to: PHONE_CONVERSION_LABEL,
    });
  }

  if (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined' && (window as any).__DEBUG_TRACKING__) {
    console.log('[Tracking] 📞 Phone Click Tracked:', payload);
  }
}
