import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | Realocation',
  description: 'Learn how Realocation collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> January 1, 2026
            </p>
            
            <p className="text-gray-600 mb-6">
              Realocation (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Information You Provide</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li><strong>Calculator inputs:</strong> When you use our calculator, you provide your salary and current city. This information is processed in your browser and is not stored on our servers.</li>
              <li><strong>Email address:</strong> If you choose to email yourself results or subscribe to our newsletter, we collect your email address.</li>
              <li><strong>Payment information:</strong> If you purchase Realocation Pro, payment is processed by Stripe. We do not store your full credit card information.</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Information Collected Automatically</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li><strong>Usage data:</strong> We collect anonymous analytics about how visitors use our site (pages viewed, time spent, etc.).</li>
              <li><strong>Device information:</strong> We may collect information about your device, browser type, and IP address for security and optimization purposes.</li>
            </ul>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>To provide and improve our calculator service</li>
              <li>To send you results when requested</li>
              <li>To send newsletter updates (only if you subscribe)</li>
              <li>To process payments for Realocation Pro</li>
              <li>To respond to customer support inquiries</li>
              <li>To analyze usage patterns and improve our service</li>
            </ul>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Data Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li><strong>Service providers:</strong> Companies that help us operate our business (e.g., Stripe for payments, Resend for emails)</li>
              <li><strong>Legal requirements:</strong> If required by law or to protect our rights</li>
            </ul>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement industry-standard security measures to protect your information. However, no method of transmission over the Internet is 100% secure.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="text-gray-600 mb-4">
              To exercise these rights, contact us at <a href="mailto:privacy@realocation.app" className="text-blue-600 hover:underline">privacy@realocation.app</a>.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Cookies</h2>
            <p className="text-gray-600 mb-4">
              We use essential cookies to make our site work. We may also use analytics cookies to understand how visitors use our site. 
              You can control cookies through your browser settings.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Children&apos;s Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our service is not directed to children under 13. We do not knowingly collect information from children under 13.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: <a href="mailto:privacy@realocation.app" className="text-blue-600 hover:underline">privacy@realocation.app</a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
