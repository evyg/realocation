'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';

const pricingFAQs = [
  {
    question: "Is this a subscription?",
    answer: "No! Realocation Pro is a one-time payment of $39. You get lifetime access with no recurring fees."
  },
  {
    question: "Can I try before I buy?",
    answer: "Absolutely. The free calculator shows you your top 5 cities and basic results. This gives you a great sense of the value before upgrading."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, Amex) and also support Apple Pay and Google Pay through our secure payment processor, Stripe."
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes. If you're not satisfied within 7 days of purchase, email us and we'll refund you—no questions asked."
  },
  {
    question: "Do you offer team or family pricing?",
    answer: "Not yet, but we're considering it. If you have multiple family members looking to relocate, reach out to us at hello@realocation.app."
  },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpgrade = async () => {
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'pro_lifetime' }),
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout coming soon! For now, enjoy the free tier.');
        setIsLoading(false);
      }
    } catch {
      alert('Checkout coming soon! For now, enjoy the free tier.');
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more. One-time payment, lifetime access.
            </p>
          </div>
        </section>
        
        {/* Pricing Cards */}
        <section className="py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Tier */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Free</h2>
                  <p className="text-gray-600 text-sm">Perfect for a quick check</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500 ml-2">forever</span>
                </div>
                
                <Link
                  href="/"
                  className="block w-full py-3 px-4 text-center bg-gray-100 text-gray-700 
                           font-semibold rounded-xl hover:bg-gray-200 transition-colors mb-8"
                >
                  Start Free Calculator
                </Link>
                
                <ul className="space-y-4">
                  {[
                    'Compare your city to 50+ others',
                    'See your top 5 best options',
                    'Federal + state tax calculations',
                    'Basic monthly surplus breakdown',
                    'No sign-up required',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Pro Tier */}
              <div className="relative bg-white rounded-2xl border-2 border-blue-500 p-8 shadow-lg">
                {/* Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Pro</h2>
                  <p className="text-gray-600 text-sm">For serious relocation planning</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$39</span>
                  <span className="text-gray-500 ml-2">one-time</span>
                </div>
                
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="block w-full py-3 px-4 text-center bg-blue-600 text-white 
                           font-semibold rounded-xl hover:bg-blue-700 transition-colors mb-8
                           disabled:opacity-50 touch-manipulation"
                >
                  {isLoading ? 'Loading...' : 'Upgrade to Pro'}
                </button>
                
                <ul className="space-y-4">
                  {[
                    { text: 'Everything in Free, plus:', bold: true },
                    'See ALL 50+ cities ranked',
                    'Compare up to 5 cities side-by-side',
                    'Adjust for housing size (studio–3BR)',
                    'Family size adjustments',
                    'Detailed tax breakdown by bracket',
                    'Export results to PDF',
                    'Priority email support',
                    'Lifetime access + free updates',
                  ].map((feature, i) => {
                    const text = typeof feature === 'string' ? feature : feature.text;
                    const bold = typeof feature === 'object' && feature.bold;
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`text-sm ${bold ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                          {text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Guarantee */}
        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">7-Day Money-Back Guarantee</h3>
              <p className="text-gray-600">
                Not satisfied? Email us within 7 days for a full refund. No questions asked.
              </p>
            </div>
          </div>
        </section>
        
        {/* FAQ */}
        <FAQ 
          items={pricingFAQs}
          title="Pricing FAQ"
        />
        
        {/* Final CTA */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Start with the free calculator
            </h2>
            <p className="text-gray-400 mb-8">
              See your top 5 cities for free. Upgrade anytime for the complete picture.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold 
                         rounded-xl hover:bg-gray-100 transition-colors touch-manipulation"
            >
              Try Free Calculator
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
