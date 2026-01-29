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
    <footer className="bg-zinc-900 text-zinc-400">
      {/* Newsletter Section */}
      <div className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 text-teal-400 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Newsletter
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">
              Get relocation insights weekly
            </h3>
            <p className="text-zinc-400 mb-8">
              Cost of living updates, tax changes, and city spotlights. Zero spam, unsubscribe anytime.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-4 py-3.5 bg-zinc-800 border border-zinc-700 rounded-xl
                         text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 
                         focus:ring-teal-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl
                         hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50 shadow-lg shadow-teal-500/20"
              >
                {status === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
            
            {status === 'success' && (
              <p className="mt-4 text-teal-400 text-sm flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                You&apos;re subscribed!
              </p>
            )}
            {status === 'error' && (
              <p className="mt-4 text-red-400 text-sm">Something went wrong. Try again.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Links Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2C9.925 2 5 6.925 5 13C5 21.5 16 30 16 30C16 30 27 21.5 27 13C27 6.925 22.075 2 16 2Z" fill="url(#footer-gradient)"/>
                <circle cx="16" cy="13" r="5" fill="#18181B"/>
                <path d="M14 15L16 11L18 15" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 11V16" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="footer-gradient" x1="5" y1="2" x2="27" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#14B8A6"/>
                    <stop offset="1" stopColor="#0F766E"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-white font-bold text-lg">realocation</span>
            </div>
            <p className="text-sm text-zinc-500 mb-4">
              Making relocation decisions smarter with AI-powered cost comparisons.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-teal-400 transition-colors text-sm">Calculator</Link></li>
              <li><Link href="/pricing" className="hover:text-teal-400 transition-colors text-sm">Pricing</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-teal-400 transition-colors text-sm">How It Works</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/blog" className="hover:text-teal-400 transition-colors text-sm">Blog</Link></li>
              <li><Link href="/blog/cost-of-living-calculator-guide" className="hover:text-teal-400 transition-colors text-sm">Calculator Guide</Link></li>
              <li><Link href="/blog/best-cities-remote-workers-2026" className="hover:text-teal-400 transition-colors text-sm">Best Cities 2026</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-teal-400 transition-colors text-sm">About</Link></li>
              <li><a href="mailto:hello@realocation.app" className="hover:text-teal-400 transition-colors text-sm">Contact</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="hover:text-teal-400 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Realocation. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="https://twitter.com/realocationapp" target="_blank" rel="noopener noreferrer" 
               className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://linkedin.com/company/realocation" target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
