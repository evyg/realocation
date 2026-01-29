'use client';

const steps = [
  {
    number: '1',
    title: 'Enter Your Details',
    description: 'Tell us your current salary and which city you live in now.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    number: '2',
    title: 'We Crunch the Numbers',
    description: 'Our calculator factors in federal taxes, state taxes, and cost of living for 50+ cities.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: '3',
    title: 'See Your Options',
    description: 'Get a ranked list of cities where your money would go further—with exact dollar amounts.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
            Simple & Fast
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get personalized results in under 10 seconds. No sign-up required.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200" />
              )}
              
              {/* Step circle */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full mb-6">
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
                <div className="text-blue-600">
                  {step.icon}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
