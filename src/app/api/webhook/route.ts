import { NextRequest, NextResponse } from 'next/server';

// Stripe webhook handler
// Processes payment events and updates user access

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    // Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!stripeKey || !webhookSecret) {
      console.log('Stripe webhook: not configured');
      return NextResponse.json({ received: true });
    }
    
    // Dynamic import
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);
    
    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Get customer email
        const customerEmail = session.customer_details?.email;
        
        if (customerEmail) {
          // TODO: When Supabase is configured, update user's pro status here
          // await supabase.from('purchases').insert({
          //   email: customerEmail,
          //   product: session.metadata?.product,
          //   stripe_payment_id: session.payment_intent,
          //   amount: session.amount_total,
          // });
          
          console.log(`Pro purchase completed for: ${customerEmail}`);
        }
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log(`Payment failed: ${paymentIntent.id}`);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
