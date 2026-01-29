# Realocation - Build Instructions

## Project Overview

Build a relocation cost calculator web app using Next.js 14, Tailwind CSS, and TypeScript.

**Read these docs first:**
- `docs/PRD.md` — Full product requirements
- `docs/BUSINESS_MODEL.md` — Business context
- `docs/DATA_SOURCES.md` — Where data comes from

## What To Build

### Phase 1: Core App (DO THIS FIRST)

1. **Initialize Next.js project**
   ```bash
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
   ```

2. **Landing Page (`/`)**
   - Hero: "Where would your money go further?"
   - Two inputs: Salary (number), Current City (dropdown)
   - Submit button → redirects to `/results?salary=X&city=Y`
   - Mobile-first, clean design

3. **Results Page (`/results`)**
   - Shows ranked list of cities where user would have more money
   - Each city card shows: City name, monthly difference, annual difference
   - Top 5 visible for free
   - Upgrade CTA at bottom
   - "See all 25+ cities" locked behind paywall

4. **Calculation Logic (`lib/calculations.ts`)**
   - Federal tax calculation (2024 brackets)
   - State tax calculation (per state rates)
   - FICA calculation
   - Cost of living adjustments
   - See PRD.md for formulas

5. **City Data (`data/cities.json`)**
   - Start with 50 major US cities
   - Include: state tax rate, rent by bedroom, cost indices
   - Use realistic data (can be estimated for MVP)

### Phase 2: Paid Features (After Phase 1 Works)

6. **Calculator Page (`/calculator`)**
   - Full dynamic calculator (locked behind auth)
   - Salary slider
   - Housing type dropdown
   - Family size inputs
   - Compare up to 5 cities side-by-side
   - Real-time updates as inputs change

7. **Stripe Integration**
   - Checkout session creation
   - Success page
   - Webhook handling
   - Leave placeholders for env vars

8. **Supabase Auth**
   - Sign up / sign in
   - Track paid status
   - Leave placeholders for env vars

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (auth + database) — placeholder for now
- Stripe — placeholder for now

## File Structure

```
realocation/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── results/page.tsx         # Results page
│   │   ├── calculator/page.tsx      # Paid calculator
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   └── api/
│   │       ├── calculate/route.ts   # Free calculation
│   │       └── checkout/route.ts    # Stripe checkout
│   ├── components/
│   │   ├── Calculator.tsx
│   │   ├── CityCard.tsx
│   │   ├── SalaryInput.tsx
│   │   ├── CitySelect.tsx
│   │   └── ComparisonTable.tsx
│   ├── lib/
│   │   ├── calculations.ts          # Tax & cost math
│   │   ├── cities.ts                # City data helpers
│   │   └── utils.ts                 # Utility functions
│   └── data/
│       └── cities.json              # City database
├── public/
├── docs/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

## Design Guidelines

- **Mobile-first**: All layouts work on 375px width
- **Colors**: Blue primary (#2563EB), Green for money (#16A34A)
- **Typography**: System fonts, clear hierarchy
- **Spacing**: Generous padding, readable
- **Numbers**: Right-aligned, formatted with commas

## Important Notes

1. **No Supabase/Stripe keys yet** — Use placeholders, owner will add later
2. **Make it work locally first** — Focus on UI + calculation logic
3. **Commit often** — Push to GitHub as you build
4. **Test calculations** — Make sure tax math is correct

## Sample Data for Testing

```
User: $150,000 salary, San Francisco
Expected results:
- Austin, TX: ~+$2,500-3,500/month better
- Miami, FL: ~+$2,000-2,800/month better
- Denver, CO: ~+$1,500-2,200/month better
```

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Deployment

Will deploy to Vercel. Make sure:
- All env vars are documented in .env.example
- Build passes (`npm run build`)
- No TypeScript errors

## When Done

1. Push all code to GitHub
2. Test locally on mobile viewport
3. Report back with what's working and what needs env vars
