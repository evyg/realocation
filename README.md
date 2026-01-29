# Realocation 📍

**"Where would your money go further?"**

An AI-powered relocation calculator that helps people discover cities where their salary would give them a better lifestyle.

## The Product

### Free (Viral Hook)
- Input: Salary + current city
- Output: Ranked list of cities where you'd have more money monthly
- Goal: Create "holy shit" moment → drive to paid

### Paid ($39 one-time)
- Full dynamic calculator
- Adjust salary, housing, family size in real-time
- Compare up to 5 cities side-by-side
- Detailed breakdown (taxes, rent, childcare, etc.)
- PDF export
- Save & share

## Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (auth + saved reports)
- **Payments:** Stripe Checkout
- **AI/Data:** Perplexity API (for research), custom calculations
- **Deployment:** Vercel

## Project Structure

```
realocation/
├── app/
│   ├── page.tsx              # Landing + free calculator
│   ├── results/
│   │   └── page.tsx          # Free results (ranked cities)
│   ├── calculator/
│   │   └── page.tsx          # Paid dynamic calculator
│   ├── api/
│   │   ├── calculate/
│   │   │   └── route.ts      # Free calculation endpoint
│   │   ├── full-calculate/
│   │   │   └── route.ts      # Paid full calculation
│   │   └── checkout/
│   │       └── route.ts      # Stripe checkout session
│   └── layout.tsx
├── components/
│   ├── Calculator.tsx        # Main calculator component
│   ├── CityCard.tsx          # City result card
│   ├── ComparisonTable.tsx   # Side-by-side comparison
│   ├── SalarySlider.tsx      # Dynamic salary input
│   └── PricingCard.tsx       # Upgrade CTA
├── lib/
│   ├── calculations.ts       # Tax & cost of living math
│   ├── cities-data.ts        # City database
│   ├── supabase.ts           # Supabase client
│   └── stripe.ts             # Stripe helpers
├── data/
│   └── cities.json           # City cost data
├── docs/
│   ├── PRD.md                # Product Requirements
│   ├── BUSINESS_MODEL.md     # Business model details
│   └── DATA_SOURCES.md       # Where data comes from
└── public/
    └── og-image.png          # Social share image
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your keys:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET

# Run development server
npm run dev
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional: Perplexity for AI research
PERPLEXITY_API_KEY=pplx_...
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

## License

MIT
