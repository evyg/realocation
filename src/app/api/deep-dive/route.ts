import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import citiesData from '@/data/cities-full.json';

interface City {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  population: number;
  stateTaxRate: number;
  localTaxRate: number;
  medianRent1BR: number;
  medianRent2BR: number;
  medianRent3BR: number;
  medianRent4BR: number;
  costIndex: number;
}

const cities = citiesData as City[];
const cityMap = new Map(cities.map(c => [c.id, c]));

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function getRentForBedrooms(city: City, bedrooms: string): number {
  switch (bedrooms) {
    case 'studio': return city.medianRent1BR * 0.8;
    case '1BR': return city.medianRent1BR;
    case '2BR': return city.medianRent2BR;
    case '3BR': return city.medianRent3BR;
    case '4BR': return city.medianRent4BR;
    default: return city.medianRent1BR;
  }
}

// Generate detailed breakdown using static data + Perplexity for extras
async function generateDeepDive(
  city: City,
  salary: number,
  bedrooms: string,
  numAdults: number,
  numChildren: number,
  hasCar: boolean
) {
  const rent = getRentForBedrooms(city, bedrooms);
  const indexMultiplier = city.costIndex / 100;
  
  // Calculate breakdown
  const housing = rent;
  const utilities = Math.round((150 + numAdults * 30) * indexMultiplier);
  const food = Math.round((numAdults * 400 + numChildren * 250) * indexMultiplier);
  const transportation = hasCar ? Math.round(600 * indexMultiplier) : Math.round(150 * indexMultiplier);
  const healthcare = Math.round((numAdults * 200 + numChildren * 100) * indexMultiplier);
  const childcare = numChildren * Math.round(800 * indexMultiplier);
  const lifestyle = Math.round((salary > 100000 ? 500 : salary > 60000 ? 300 : 150) * indexMultiplier);
  
  // Tax calculation
  const federalRate = salary > 200000 ? 0.32 : salary > 100000 ? 0.24 : salary > 50000 ? 0.22 : 0.12;
  const monthlyGross = salary / 12;
  const taxes = Math.round(monthlyGross * (federalRate + city.stateTaxRate));
  
  const total = housing + utilities + food + transportation + healthcare + childcare + lifestyle + taxes;
  
  // Quality indices (simulated based on data we have)
  const safetyIndex = Math.min(95, Math.max(40, 80 - (city.costIndex - 100) * 0.2 + (city.population > 1000000 ? -5 : 5)));
  const healthcareIndex = Math.min(95, Math.max(50, 70 + (city.population > 500000 ? 10 : 0)));
  
  // Climate description based on state
  const climateMap: Record<string, string> = {
    CA: 'Mediterranean climate with warm, dry summers and mild winters',
    FL: 'Subtropical climate with hot, humid summers and mild winters',
    TX: 'Varied climate from humid subtropical to semi-arid, hot summers',
    NY: 'Humid continental climate with warm summers and cold, snowy winters',
    WA: 'Marine west coast climate with mild, wet winters and warm, dry summers',
    AZ: 'Desert climate with very hot summers and mild winters, low humidity',
    CO: 'Semi-arid continental climate with cold winters and warm summers',
    GA: 'Humid subtropical climate with hot summers and mild winters',
    NC: 'Humid subtropical climate with mild winters and warm, humid summers',
    TN: 'Humid subtropical climate with mild winters and warm, humid summers',
    OR: 'Marine west coast climate, mild and rainy winters, dry summers',
    MA: 'Humid continental climate with warm summers and cold, snowy winters',
  };
  const climateDescription = climateMap[city.stateCode] || 'Temperate climate with seasonal variations';
  
  // Generate insights
  const insights: string[] = [];
  
  if (city.stateTaxRate === 0) {
    insights.push(`${city.state} has no state income tax, saving you approximately ${formatCurrency(salary * 0.05)} annually compared to high-tax states`);
  }
  
  if (city.costIndex < 90) {
    insights.push(`Cost of living is ${100 - city.costIndex}% below national average, your money goes further here`);
  } else if (city.costIndex > 120) {
    insights.push(`Cost of living is ${city.costIndex - 100}% above national average, budget accordingly`);
  }
  
  if (city.population > 1000000) {
    insights.push('Major metro with diverse job market, cultural amenities, and public transit options');
  } else if (city.population < 100000) {
    insights.push('Smaller city with lower costs, less traffic, and tight-knit community feel');
  }
  
  if (hasCar && city.population > 500000) {
    insights.push('Consider public transit options to reduce transportation costs in this major city');
  }
  
  if (numChildren > 0) {
    insights.push('Research school district ratings and proximity to family-friendly amenities');
  }
  
  return {
    city,
    breakdown: {
      housing,
      utilities,
      food,
      transportation,
      healthcare,
      childcare,
      lifestyle,
      taxes,
      total,
    },
    quality: {
      safetyIndex: Math.round(safetyIndex),
      healthcareIndex: Math.round(healthcareIndex),
      climateDescription,
    },
    insights,
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(amount);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, cityId, salary, bedrooms, numAdults, numChildren, hasCar } = body;
    
    if (!email || !cityId) {
      return NextResponse.json({ error: 'Email and cityId required' }, { status: 400 });
    }
    
    const city = cityMap.get(cityId);
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }
    
    const supabase = getSupabase();
    
    if (supabase) {
      // Check if user has credits
      const { data: credits } = await supabase
        .from('deep_dive_credits')
        .select('id, credits_total, credits_used')
        .eq('email', email.toLowerCase())
        .gt('credits_total', 0);
      
      const availableCredits = credits?.reduce((sum, c) => sum + (c.credits_total - c.credits_used), 0) || 0;
      
      if (availableCredits <= 0) {
        return NextResponse.json({ 
          error: 'No credits remaining. Please purchase to continue.',
          requiresPayment: true,
        }, { status: 402 });
      }
      
      // Use a credit
      const creditToUse = credits?.find(c => c.credits_used < c.credits_total);
      if (creditToUse) {
        await supabase
          .from('deep_dive_credits')
          .update({ credits_used: creditToUse.credits_used + 1 })
          .eq('id', creditToUse.id);
      }
      
      // Generate the report
      const report = await generateDeepDive(city, salary || 100000, bedrooms || '1BR', numAdults || 1, numChildren || 0, hasCar || false);
      
      // Save the report
      await supabase.from('deep_dive_reports').insert({
        email: email.toLowerCase(),
        city: cityId,
        credit_id: creditToUse?.id,
        report_data: report,
      });
      
      // Get remaining credits
      const newAvailableCredits = availableCredits - 1;
      
      return NextResponse.json({
        success: true,
        report,
        creditsRemaining: newAvailableCredits,
      });
    } else {
      // No Supabase - generate report anyway (for testing)
      const report = await generateDeepDive(city, salary || 100000, bedrooms || '1BR', numAdults || 1, numChildren || 0, hasCar || false);
      
      return NextResponse.json({
        success: true,
        report,
        creditsRemaining: 0,
      });
    }
  } catch (error) {
    console.error('Deep dive error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
