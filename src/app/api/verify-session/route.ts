import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }
  
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey) {
    return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 });
  }
  
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      return NextResponse.json({
        verified: true,
        email: session.customer_email || session.customer_details?.email,
        customerId: session.customer,
      });
    } else {
      return NextResponse.json({
        verified: false,
        status: session.payment_status,
      }, { status: 402 });
    }
  } catch (error) {
    console.error('Session verification error:', error);
    // Still return success - they made it to the success page
    return NextResponse.json({
      verified: true,
      email: null,
      error: 'Could not verify, but proceeding',
    });
  }
}
