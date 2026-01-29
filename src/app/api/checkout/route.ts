import { NextRequest, NextResponse } from 'next/server';

// This will use Stripe when STRIPE_SECRET_KEY is configured

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId } = body;
    
    // Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey || stripeKey.startsWith('sk_test_your')) {
      return NextResponse.json({
        error: 'Payment system not configured',
        message: 'Stripe integration pending. Please check back soon!',
        debug: { hasKey: !!stripeKey, keyPrefix: stripeKey?.substring(0, 12) }
      }, { status: 503 });
    }
    
    // Dynamic import to avoid build errors when Stripe isn't installed
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-12-18.acacia',
    });
    
    // Get the price ID from environment or use a default
    const actualPriceId = priceId === 'pro_lifetime' 
      ? process.env.STRIPE_PRICE_ID || 'price_placeholder'
      : priceId;
    
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: actualPriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        product: 'realocation_pro',
      },
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session', 
        details: errorMessage,
        debug: {
          keyLength: stripeKey?.length,
          keyPrefix: stripeKey?.substring(0, 12),
          priceId: process.env.STRIPE_PRICE_ID,
        }
      },
      { status: 500 }
    );
  }
}
