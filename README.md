# Realocation

**Where would your money go further?**

A cost of living calculator that compares your real take-home pay across 50+ US cities. Factor in federal taxes, state taxes, and rent to make smarter relocation decisions.

🔗 **Live:** [realocation.app](https://realocation.app)

## Features

- ✅ **Real Tax Calculations** - Federal + state income tax using actual 2024 brackets
- ✅ **50+ US Cities** - Compare major metros and emerging destinations  
- ✅ **Monthly Surplus** - See exactly what you'll have after taxes and rent
- ✅ **Instant Results** - No sign-up required, results in 10 seconds
- ✅ **Mobile-First** - Optimized for any device
- ✅ **Email Results** - Save your results for later review
- ✅ **Pro Upgrade** - Full rankings, side-by-side comparisons, housing adjustments

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Vercel (recommended)

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/realocation.git
cd realocation
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys (see Setup Checklist below).

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Setup Checklist

### 1. Supabase (Database)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`
3. Run the migration in SQL Editor:
   ```
   supabase/migrations/001_initial_schema.sql
   ```

### 2. Stripe (Payments)

1. Create account at [stripe.com](https://stripe.com)
2. Go to Developers > API keys and copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
3. Create a Product:
   - Name: "Realocation Pro"
   - Price: $39 (one-time)
   - Copy the price ID → `STRIPE_PRICE_ID`
4. Set up Webhook:
   - Endpoint: `https://yoursite.com/api/webhook`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy webhook secret → `STRIPE_WEBHOOK_SECRET`

### 3. Resend (Email)

1. Create account at [resend.com](https://resend.com)
2. Add and verify your domain (e.g., `realocation.app`)
3. Create an API key → `RESEND_API_KEY`

### 4. Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new).

**Important:** Add all environment variables in the Vercel dashboard.

## Project Structure

```
realocation/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── api/              # API routes (checkout, webhook, subscribe)
│   │   ├── blog/             # Blog pages
│   │   ├── pricing/          # Pricing page
│   │   ├── results/          # Calculator results
│   │   └── ...
│   ├── components/           # React components
│   └── lib/                  # Utilities (calculations, etc.)
├── public/                   # Static assets
├── supabase/                 # Database migrations
└── content/                  # Blog/social content
```

## Revenue Model

- **Free Tier:** Top 5 cities, basic results
- **Pro ($39 one-time):** All 50+ cities, comparisons, housing adjustments, PDF export

## License

MIT

---

Built with ☕ and data.
