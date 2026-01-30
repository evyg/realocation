import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, email } = body;
    
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const stripePriceId = process.env.STRIPE_PRICE_ID;
    
    if (!stripeKey) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 });
    }
    
    // Get the price ID
    const actualPriceId = priceId === 'pro_lifetime' ? stripePriceId : (priceId || stripePriceId);
    
    if (!actualPriceId) {
      return NextResponse.json({ error: 'Price not configured' }, { status: 503 });
    }
    
    console.log('Creating checkout session for price:', actualPriceId);
    
    // Use fetch directly to Stripe API
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('payment_method_types[]', 'card');
    params.append('line_items[0][price]', actualPriceId);
    params.append('line_items[0][quantity]', '1');
    const baseUrl = 'https://realocation.app';
    params.append('success_url', `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${baseUrl}/pricing`);
    params.append('metadata[product]', 'realocation_pro');
    if (email) {
      params.append('customer_email', email);
    }
    
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Stripe API error:', data);
      return NextResponse.json({ 
        error: 'Failed to create checkout', 
        details: data.error?.message || 'Unknown Stripe error' 
      }, { status: 500 });
    }
    
    console.log('Checkout session created:', data.id);
    return NextResponse.json({ url: data.url });
    
  } catch (error) {
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    );
  }
}
