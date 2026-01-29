import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId } = body;
    
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey) {
      return NextResponse.json({
        error: 'Payment system not configured',
      }, { status: 503 });
    }
    
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);
    
    // Get the price ID from environment
    const actualPriceId = priceId === 'pro_lifetime' 
      ? process.env.STRIPE_PRICE_ID
      : priceId;
    
    if (!actualPriceId) {
      return NextResponse.json({ error: 'Price not configured' }, { status: 503 });
    }
    
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
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
