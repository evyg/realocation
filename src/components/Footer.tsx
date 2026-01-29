'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });
      
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Get relocation insights in your inbox
            </h3>
            <p className="text-gray-400 mb-6">
              Cost of living updates, tax changes, and city spotlights. No spam.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                         text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg
                         hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
            
            {status === 'success' && (
              <p className="mt-3 text-green-400 text-sm">✓ You&apos;re subscribed!</p>
            )}
            {status === 'error' && (
              <p className="mt-3 text-red-400 text-sm">Something went wrong. Try again.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Links Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-white transition-colors">Calculator</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/blog/cost-of-living-calculator-guide" className="hover:text-white transition-colors">Calculator Guide</Link></li>
              <li><Link href="/blog/best-cities-remote-workers-2026" className="hover:text-white transition-colors">Best Cities 2026</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><a href="mailto:hello@realocation.app" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <span className="text-white font-semibold">Realocation</span>
          </div>
          
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Realocation. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="https://twitter.com/realocationapp" target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://linkedin.com/company/realocation" target="_blank" rel="noopener noreferrer"
               className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
