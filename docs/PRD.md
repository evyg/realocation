# Realocation - Product Requirements

## What to Build

### Landing Page (/)
- Hero: "Where would your money go further?"
- Input 1: Salary (number input with $ formatting)
- Input 2: Current City (dropdown with 50 US cities)
- Button: "Show Me Where →"
- Mobile-first, clean Tailwind design

### Results Page (/results)
- Shows ranked list of cities where user would have MORE money
- Each card: City name, state, monthly difference, annual difference
- Top 5 visible free
- Below 5: blur/lock with upgrade CTA
- Upgrade button: "Unlock Full Calculator — $39"

### Calculation Logic
- Federal tax (2024 brackets)
- State tax (per state rates)
- FICA (6.2% SS + 1.45% Medicare)
- Cost of living adjustments per city

### City Data (50 cities)
Create data/cities.ts with:
- City name, state
- State tax rate
- Median rent (1BR, 2BR, 3BR)
- Cost of living index
- Use realistic estimates

## Tech Details
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- No external API calls for MVP (all data local)

## Design
- Colors: Blue primary (#2563EB), Green for money (#16A34A)
- Mobile-first responsive
- Clean, modern look
