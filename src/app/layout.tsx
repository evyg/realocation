import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Realocation - Where Would Your Money Go Further?',
  description: 'Calculate how much more money you would have if you moved to a different city. Compare cost of living, taxes, and take-home pay across 50 US cities.',
  keywords: ['cost of living calculator', 'relocation calculator', 'salary comparison', 'tax calculator', 'move to new city'],
  openGraph: {
    title: 'Realocation - Where Would Your Money Go Further?',
    description: 'Find out how much more money you could have in a different city.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
