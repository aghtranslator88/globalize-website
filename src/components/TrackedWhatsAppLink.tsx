"use client";

import React from "react";
import { trackWhatsAppClick } from "@/lib/gtag";

interface TrackedWhatsAppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  ctaLocation: string;
  service?: string;
  language?: string;
  children: React.ReactNode;
}

/**
 * Reusable accessible client link for WhatsApp CTAs.
 * Fires Google Ads Primary conversion ('AW-18001004291/k8NtCKOM-oUcEIOOxodD')
 * and custom GA4 'whatsapp_click' ONLY on intentional user click.
 */
export default function TrackedWhatsAppLink({
  href,
  ctaLocation,
  service,
  language,
  className,
  children,
  onClick,
  ...rest
}: TrackedWhatsAppLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackWhatsAppClick({
      cta_location: ctaLocation,
      service,
      language,
    });
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
