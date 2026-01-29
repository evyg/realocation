'use client';

import { useState } from 'react';

interface CityResult {
  name: string;
  state: string;
  monthlySurplus: number;
  difference: number;
}

interface EmailResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  salary: number;
  currentCity: { name: string; state: string; monthlySurplus: number };
  results: CityResult[];
}

export default function EmailResultsModal({
  isOpen,
  onClose,
  salary,
  currentCity,
  results,
}: EmailResultsModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          salary,
          currentCity,
          results,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setStatus('success');
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setEmail('');
      }, 2000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              📧 Save Your Results
            </h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 touch-manipulation"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-1 text-sm">
            Get your results emailed so you can review them later.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Check your inbox!</h3>
              <p className="text-gray-600 text-sm">Results sent to {email}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder:text-gray-400"
                  autoComplete="email"
                  autoFocus
                />
                {status === 'error' && (
                  <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 px-6 text-lg font-semibold text-white bg-blue-600 
                         rounded-xl hover:bg-blue-700 active:bg-blue-800 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         touch-manipulation"
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send My Results'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                We&apos;ll only use this to send your results. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
