import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* 404 Illustration */}
          <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Page not found
          </h1>
          
          <p className="text-gray-600 mb-8">
            Looks like this page has relocated. Let&apos;s get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold 
                       rounded-xl hover:bg-blue-700 transition-colors"
            >
              Go to Calculator
            </Link>
            <Link
              href="/blog"
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 font-semibold 
                       rounded-xl hover:bg-gray-200 transition-colors"
            >
              Read Blog
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
