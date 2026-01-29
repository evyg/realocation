'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: "How accurate are the calculations?",
    answer: "Our calculations use 2024 federal and state tax brackets, along with cost of living data updated monthly from multiple sources. While we strive for accuracy, actual costs may vary based on your specific lifestyle, neighborhood choice, and spending habits."
  },
  {
    question: "What's included in the cost of living?",
    answer: "We factor in median rent for a 1-bedroom apartment, state income tax rates, and federal income tax. The Pro version includes adjustable housing options (studio to 3BR) and additional factors like utilities, groceries, and transportation."
  },
  {
    question: "Do you account for local/city taxes?",
    answer: "Currently, we focus on state-level income taxes, which have the biggest impact for most people. Some cities (like NYC) have local income taxes—we're working on adding these in a future update."
  },
  {
    question: "What's the difference between Free and Pro?",
    answer: "The free version shows your top 5 cities and basic calculations. Pro unlocks all 50+ cities, side-by-side comparisons, adjustable housing sizes, family size considerations, and more detailed breakdowns."
  },
  {
    question: "Is my data saved or shared?",
    answer: "We don't require an account for the free calculator, and we don't store your salary or personal information. If you email yourself results, we only store your email to send that one message."
  },
  {
    question: "Can I compare specific cities?",
    answer: "Yes! With the Pro version, you can compare up to 5 cities side-by-side with detailed breakdowns of taxes, rent, and monthly surplus."
  },
];

interface FAQProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
}

export default function FAQ({ items = defaultFAQs, title, subtitle }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600">{subtitle}</p>
            )}
          </div>
        )}
        
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4
                         hover:bg-gray-50 transition-colors touch-manipulation"
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-5 pb-4 pt-0">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
