"use client";

import React from "react";
import { trackPhoneClick } from "@/lib/gtag";

interface TrackedPhoneLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  ctaLocation: string;
  language?: string;
  children: React.ReactNode;
}

/**
 * Reusable accessible client link for tel: phone numbers.
 * Fires Secondary Google Ads Conversion ('AW-18001004291/Uv5LCNClu_EcEIOOxodD')
 * and custom GA4 'phone_click' ONLY on intentional user click.
 */
export default function TrackedPhoneLink({
  href = "tel:+201062990808",
  ctaLocation,
  language,
  className,
  children,
  onClick,
  ...rest
}: TrackedPhoneLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackPhoneClick({
      cta_location: ctaLocation,
      language,
    });
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
