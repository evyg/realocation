import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'About Realocation | Our Story',
  description: 'Learn about Realocation and our mission to help people make smarter relocation decisions.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Making relocation decisions clearer
            </h1>
            <p className="text-lg text-gray-600">
              We believe everyone deserves to know where their money goes further—before they make a life-changing move.
            </p>
          </div>
        </section>
        
        {/* Story */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4">
            <div className="prose prose-lg mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">The Problem</h2>
              <p className="text-gray-600 mb-6">
                When you&apos;re considering a move to a new city, the math is surprisingly complicated. 
                Sure, rent might be cheaper in Austin than San Francisco—but what about state income tax? 
                What about federal tax brackets? What&apos;s your actual take-home after everything?
              </p>
              <p className="text-gray-600 mb-6">
                Most &quot;cost of living calculators&quot; online just compare rent or give you vague percentages. 
                They don&apos;t show you the real number that matters: <strong>how much money will you actually have left each month?</strong>
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Our Solution</h2>
              <p className="text-gray-600 mb-6">
                Realocation calculates your actual monthly surplus in any city—factoring in federal income tax 
                (using real 2024 brackets), state income tax, and median rent prices. No guessing, no percentages, 
                just real dollar amounts.
              </p>
              <p className="text-gray-600 mb-6">
                Enter your salary, pick your current city, and in 10 seconds you&apos;ll see exactly which cities 
                would leave you with more money in your pocket.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Who We Are</h2>
              <p className="text-gray-600 mb-6">
                Realocation was built by a small team of remote workers who&apos;ve personally navigated the 
                &quot;where should I live?&quot; question multiple times. We got frustrated with the lack of clear, 
                actionable data—so we built the tool we wished existed.
              </p>
              <p className="text-gray-600 mb-6">
                We&apos;re not a big corporation. We&apos;re just a few people who believe in building useful 
                tools that help people make better decisions.
              </p>
            </div>
          </div>
        </section>
        
        {/* Values */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">What We Believe</h2>
            
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  icon: '🎯',
                  title: 'Clarity over complexity',
                  description: 'Real numbers, not vague percentages. Your time is valuable.',
                },
                {
                  icon: '🔓',
                  title: 'Accessible by default',
                  description: 'The core calculator is free. No sign-up walls for basic results.',
                },
                {
                  icon: '🤝',
                  title: 'Honest recommendations',
                  description: 'We show all cities fairly—we don\'t get paid to promote any location.',
                },
              ].map((value, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Contact CTA */}
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions, feedback, or just want to say hi? We&apos;d love to hear from you.
            </p>
            <a
              href="mailto:hello@realocation.app"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white 
                       font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              hello@realocation.app
            </a>
          </div>
        </section>
        
        {/* Final CTA */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to find your ideal city?
            </h2>
            <p className="text-blue-100 mb-8">
              See where your money goes further in 10 seconds.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold 
                         rounded-xl hover:bg-blue-50 transition-colors"
            >
              Try the Free Calculator
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
