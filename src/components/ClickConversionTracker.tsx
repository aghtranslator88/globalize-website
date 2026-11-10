"use client";

import { useEffect } from "react";
import { trackWhatsAppClick, trackPhoneClick, wasRecentlyTracked } from "@/lib/gtag";

const WHATSAPP_HREF = /^(https?:)?\/\/(wa\.me|api\.whatsapp\.com|(www\.)?whatsapp\.com|web\.whatsapp\.com)\//i;

/**
 * Site-wide safety net for click conversions.
 *
 * One delegated, document-level click listener that catches every WhatsApp
 * link (wa.me / api.whatsapp.com), any element marked data-track="whatsapp",
 * and every tel: link — on all /ar and /en pages — and fires the GA4 event +
 * Google Ads conversion via trackWhatsAppClick / trackPhoneClick.
 *
 * Components that already call those functions in their own onClick
 * (TrackedWhatsAppLink, TrackedPhoneLink, Navbar, Footer, floating widget)
 * are skipped via wasRecentlyTracked(), so nothing is double-counted.
 * Runs in the bubble phase (after React's handlers) and never calls
 * preventDefault, so navigation to WhatsApp / the dialer is not delayed.
 */
export default function ClickConversionTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (typeof window === "undefined" || typeof window.gtag !== "function") return;
      // auxclick: only count middle-click (opens a new tab), not right-click.
      if (event.type === "auxclick" && event.button !== 1) return;

      const target = event.target as Element | null;
      if (!target || typeof target.closest !== "function") return;

      const el = target.closest<HTMLElement>('a[href], [data-track="whatsapp"], [data-track="phone"]');
      if (!el) return;

      const href = (el.getAttribute("href") || "").trim();
      const track = el.getAttribute("data-track");
      const ctaLocation = el.getAttribute("data-cta-location") || "auto_delegated";

      try {
        if (track === "whatsapp" || WHATSAPP_HREF.test(href)) {
          if (!wasRecentlyTracked("whatsapp")) {
            trackWhatsAppClick({ cta_location: ctaLocation });
          }
        } else if (track === "phone" || href.toLowerCase().startsWith("tel:")) {
          if (!wasRecentlyTracked("phone")) {
            trackPhoneClick({ cta_location: ctaLocation });
          }
        }
      } catch {
        // Tracking must never break the click.
      }
    };

    document.addEventListener("click", onClick);
    // Middle-click / ctrl-click on WhatsApp links opens a new tab via auxclick.
    document.addEventListener("auxclick", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("auxclick", onClick);
    };
  }, []);

  return null;
}
