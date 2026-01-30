'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();
  
  useEffect(() => {
    setUserEmail(getCookie('realocation_email'));
  }, []);
  
  const navLinks = [
    { href: '/calculator', label: 'Calculator' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
  ];
  
  const isActive = (href: string) => {
    if (href.startsWith('/#')) return pathname === '/';
    return pathname.startsWith(href);
  };
  
  return (
    <nav className="glass border-b border-zinc-200/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 touch-manipulation">
            <div className="flex items-center gap-2">
              {/* Icon */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2C9.925 2 5 6.925 5 13C5 21.5 16 30 16 30C16 30 27 21.5 27 13C27 6.925 22.075 2 16 2Z" fill="url(#nav-gradient)"/>
                <circle cx="16" cy="13" r="5" fill="white"/>
                <path d="M14 15L16 11L18 15" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 11V16" stroke="#0F766E" strokeWidth="2" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="nav-gradient" x1="5" y1="2" x2="27" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#14B8A6"/>
                    <stop offset="1" stopColor="#0F766E"/>
                  </linearGradient>
                </defs>
              </svg>
              {/* Wordmark */}
              <span className="text-xl font-bold tracking-tight">
                <span className="text-zinc-900">real</span>
                <span className="text-teal-600">ocation</span>
              </span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-teal-600'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {userEmail ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                My Reports
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/calculator"
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-xl
                         hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/20"
            >
              Try Free Calculator
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 -mr-2 text-zinc-600 touch-manipulation"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 text-base font-medium ${
                  isActive(link.href)
                    ? 'text-teal-600'
                    : 'text-zinc-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {userEmail ? (
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-base font-medium text-zinc-600"
              >
                My Reports
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-base font-medium text-zinc-600"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/calculator"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full py-3 mt-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-center font-semibold rounded-xl"
            >
              Try Free Calculator
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
