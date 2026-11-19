'use client';

import React, { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

export const DEFAULT_META_PIXEL_ID = '1675849973927613';

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ||
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
  DEFAULT_META_PIXEL_ID;

// Declare global fbq interface for TypeScript
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Fires standard Meta Pixel PageView event
 */
export function trackMetaPageView() {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}

/**
 * Fires a custom or standard Meta Pixel event (e.g. InitiateCheckout, Purchase, ViewContent)
 */
export function trackMetaEvent(
  eventName: string,
  parameters?: Record<string, any>
) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (parameters) {
      window.fbq('track', eventName, parameters);
    } else {
      window.fbq('track', eventName);
    }
  }
}

function MetaPixelRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track PageView on route change in Next.js App Router SPA navigation
    trackMetaPageView();
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixel({ pixelId = META_PIXEL_ID }: { pixelId?: string }) {
  if (!pixelId) return null;

  return (
    <>
      {/* Route change listener wrapped in Suspense for useSearchParams */}
      <Suspense fallback={null}>
        <MetaPixelRouteTracker />
      </Suspense>

      {/* Official Meta Pixel Script with strategy afterInteractive */}
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Fallback tracking image for non-JS clients */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

export default MetaPixel;

