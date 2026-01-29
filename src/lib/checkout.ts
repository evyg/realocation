// Checkout helper functions

export async function createCheckoutSession(): Promise<string | null> {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'pro_lifetime',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Checkout error:', data.error || data.message);
      return null;
    }

    return data.url;
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return null;
  }
}

// Simple pro status tracking using localStorage
// In production, this should use Supabase auth + user table
const PRO_KEY = 'realocation_pro';
const PRO_EMAIL_KEY = 'realocation_pro_email';

export function isPro(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(PRO_KEY) === 'true';
}

export function setProStatus(email?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRO_KEY, 'true');
  if (email) {
    localStorage.setItem(PRO_EMAIL_KEY, email);
  }
}

export function getProEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PRO_EMAIL_KEY);
}

export function clearProStatus(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PRO_KEY);
  localStorage.removeItem(PRO_EMAIL_KEY);
}
