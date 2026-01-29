import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://realocation.app'),
  title: {
    default: 'Realocation | Cost of Living Calculator',
    template: '%s | Realocation',
  },
  description: 'Compare your real take-home pay across 50+ US cities. Factor in federal taxes, state taxes, and rent to see where your money goes further.',
  keywords: [
    'cost of living calculator',
    'relocation calculator',
    'salary comparison',
    'take home pay calculator',
    'state tax comparison',
    'best cities to live',
    'remote work cities',
    'moving calculator',
  ],
  authors: [{ name: 'Realocation' }],
  creator: 'Realocation',
  publisher: 'Realocation',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://realocation.app',
    siteName: 'Realocation',
    title: 'Where Would Your Money Go Further?',
    description: 'Compare your real take-home pay across 50+ US cities. Factor in taxes and rent to make smarter relocation decisions.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Realocation - Cost of Living Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Where Would Your Money Go Further?',
    description: 'Compare your real take-home pay across 50+ US cities.',
    images: ['/og-image.png'],
    creator: '@realocationapp',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://realocation.app',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Realocation',
  description: 'Cost of living calculator that compares take-home pay across US cities',
  url: 'https://realocation.app',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
