'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function Analytics() {
  // Don't render anything if GA ID is not configured
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Common events
export const events = {
  calculateStart: () => trackEvent('calculate_start', 'calculator'),
  calculateComplete: (city: string) => trackEvent('calculate_complete', 'calculator', city),
  emailResults: () => trackEvent('email_results', 'engagement'),
  shareResults: () => trackEvent('share_results', 'engagement'),
  upgradeClick: () => trackEvent('upgrade_click', 'conversion'),
  checkoutStart: () => trackEvent('checkout_start', 'conversion'),
  newsletterSubscribe: () => trackEvent('newsletter_subscribe', 'engagement'),
};
