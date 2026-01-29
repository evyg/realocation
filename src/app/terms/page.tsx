import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | Realocation',
  description: 'Terms and conditions for using Realocation.',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> January 1, 2026
            </p>
            
            <p className="text-gray-600 mb-6">
              Please read these Terms of Service (&quot;Terms&quot;) carefully before using Realocation (&quot;Service&quot;). 
              By accessing or using the Service, you agree to be bound by these Terms.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Use of Service</h2>
            <p className="text-gray-600 mb-4">
              Realocation provides a cost of living calculator and related tools to help users compare living costs across cities. 
              You may use our Service for personal, non-commercial purposes.
            </p>
            <p className="text-gray-600 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Scrape or collect data from our Service without permission</li>
              <li>Interfere with the proper functioning of the Service</li>
            </ul>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Accuracy of Information</h2>
            <p className="text-gray-600 mb-4">
              While we strive to provide accurate tax and cost of living data, the information provided by our calculator is for 
              informational purposes only. We make no guarantees about the accuracy, completeness, or timeliness of this data.
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Our calculator should not be used as the sole basis for financial decisions.</strong> We recommend consulting 
              with a financial advisor or tax professional for important financial planning.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Purchases and Refunds</h2>
            <p className="text-gray-600 mb-4">
              Realocation Pro is available for a one-time payment of $39. This grants you lifetime access to Pro features.
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Refund Policy:</strong> We offer a 7-day money-back guarantee. If you&apos;re not satisfied with your purchase, 
              email us at <a href="mailto:support@realocation.app" className="text-blue-600 hover:underline">support@realocation.app</a> within 
              7 days of purchase for a full refund.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The Service and its original content, features, and functionality are owned by Realocation and are protected by 
              copyright, trademark, and other intellectual property laws.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. 
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, REALOCATION SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
              CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting 
              the updated Terms on this page. Your continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These Terms shall be governed by the laws of the State of California, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: <a href="mailto:legal@realocation.app" className="text-blue-600 hover:underline">legal@realocation.app</a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
