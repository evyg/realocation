// Perplexity API integration for dynamic location research

export interface LocationData {
  location: string;
  country: string;
  currency: string;
  currencySymbol: string;
  
  // Cost of Living (monthly, in local currency)
  costs: {
    rentStudio: number;
    rent1BR: number;
    rent2BR: number;
    rent3BR: number;
    rent4BR: number;
    utilities: number; // electricity, water, gas, internet
    groceries: number; // per person
    transportation: number; // public transit or car costs
    healthcare: number; // insurance/out of pocket average
    childcareInfant: number; // per child, full-time
    childcareToddler: number; // per child, full-time
    childcarePreschool: number; // per child, full-time
  };
  
  // Taxes
  taxes: {
    incomeTaxRate: number; // effective rate for median income
    salesTaxRate: number;
    propertyTaxRate: number; // annual, as % of property value
  };
  
  // Income
  income: {
    medianSalary: number; // annual, in local currency
    averageSalary: number;
    minimumWage: number; // hourly
  };
  
  // Quality of life indicators
  quality: {
    safetyIndex: number; // 0-100
    healthcareIndex: number; // 0-100
    pollutionIndex: number; // 0-100 (lower is better)
    climateDescription: string;
  };
  
  // Exchange rate to USD (for conversions)
  exchangeRateToUSD: number;
  
  // Data freshness
  dataDate: string;
  sources: string[];
}

export interface ComparisonResult {
  origin: LocationData;
  destination: LocationData;
  
  // Calculated comparisons (all in USD for consistency)
  comparison: {
    costOfLivingDifference: number; // % difference
    rentDifference: number; // % difference
    purchasingPowerDifference: number; // % difference
    monthlyNetDifference: number; // absolute USD difference in monthly surplus
    annualNetDifference: number;
    recommendedSalary: number; // to maintain same lifestyle in destination
  };
}

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export async function researchLocation(location: string): Promise<LocationData> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY not configured');
  }

  const prompt = `Research the cost of living in "${location}". Provide accurate, up-to-date data in JSON format with these exact fields:

{
  "location": "City, Country",
  "country": "Country name",
  "currency": "Currency code (e.g., USD, EUR, GBP)",
  "currencySymbol": "Symbol (e.g., $, €, £)",
  "costs": {
    "rentStudio": monthly rent for studio apartment in city center,
    "rent1BR": monthly rent for 1-bedroom apartment in city center,
    "rent2BR": monthly rent for 2-bedroom apartment in city center,
    "rent3BR": monthly rent for 3-bedroom apartment in city center,
    "rent4BR": monthly rent for 4-bedroom apartment/house,
    "utilities": monthly utilities (electricity, water, gas, internet) for 85m2 apartment,
    "groceries": monthly groceries for one person,
    "transportation": monthly transportation (public transit pass or average car costs),
    "healthcare": monthly healthcare costs (insurance or out of pocket average),
    "childcareInfant": monthly full-time childcare for infant (0-1 year),
    "childcareToddler": monthly full-time childcare for toddler (1-3 years),
    "childcarePreschool": monthly full-time childcare for preschooler (3-5 years)
  },
  "taxes": {
    "incomeTaxRate": effective income tax rate as decimal (e.g., 0.25 for 25%) for someone earning median salary,
    "salesTaxRate": sales/VAT tax rate as decimal,
    "propertyTaxRate": annual property tax rate as decimal (% of property value)
  },
  "income": {
    "medianSalary": median annual salary in local currency,
    "averageSalary": average annual salary in local currency,
    "minimumWage": minimum wage per hour in local currency
  },
  "quality": {
    "safetyIndex": safety index 0-100 (100 is safest),
    "healthcareIndex": healthcare quality index 0-100,
    "pollutionIndex": pollution index 0-100 (0 is cleanest),
    "climateDescription": brief climate description
  },
  "exchangeRateToUSD": current exchange rate (1 local currency = X USD),
  "sources": ["list of data sources used"]
}

All monetary values should be in the LOCAL CURRENCY for that location.
Use the most recent data available (2024-2025).
If exact data isn't available, provide reasonable estimates based on similar cities.
Return ONLY the JSON object, no additional text.`;

  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: 'You are a cost of living research assistant. Always respond with valid JSON only, no markdown or explanations. Use accurate, recent data from reliable sources like Numbeo, Expatistan, government statistics, and local real estate listings.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1, // Low temperature for more consistent/factual responses
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Perplexity API error:', error);
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No response from Perplexity');
  }

  // Parse the JSON response
  try {
    // Clean up the response in case it has markdown code blocks
    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const locationData = JSON.parse(cleanedContent);
    
    // Add data date
    locationData.dataDate = new Date().toISOString().split('T')[0];
    
    return locationData as LocationData;
  } catch (parseError) {
    console.error('Failed to parse Perplexity response:', content);
    throw new Error('Failed to parse location data');
  }
}

export function calculateComparison(
  origin: LocationData,
  destination: LocationData,
  salary: number, // in origin currency
  bedrooms: '1BR' | '2BR' | '3BR' | '4BR' = '1BR',
  numAdults: number = 1,
  children: { age: number }[] = []
): ComparisonResult {
  // Convert everything to USD for comparison
  const originToUSD = origin.exchangeRateToUSD;
  const destToUSD = destination.exchangeRateToUSD;
  
  // Get rent based on bedroom selection
  const getRent = (data: LocationData) => {
    switch (bedrooms) {
      case '1BR': return data.costs.rent1BR;
      case '2BR': return data.costs.rent2BR;
      case '3BR': return data.costs.rent3BR;
      case '4BR': return data.costs.rent4BR;
      default: return data.costs.rent1BR;
    }
  };
  
  // Calculate childcare costs
  const getChildcareCost = (data: LocationData) => {
    return children.reduce((total, child) => {
      if (child.age < 1) return total + data.costs.childcareInfant;
      if (child.age < 3) return total + data.costs.childcareToddler;
      if (child.age < 5) return total + data.costs.childcarePreschool;
      return total; // School age, no childcare cost
    }, 0);
  };
  
  // Calculate monthly costs in local currencies
  const originMonthlyCosts = 
    getRent(origin) +
    origin.costs.utilities +
    (origin.costs.groceries * numAdults) +
    origin.costs.transportation +
    origin.costs.healthcare +
    getChildcareCost(origin);
  
  const destMonthlyCosts = 
    getRent(destination) +
    destination.costs.utilities +
    (destination.costs.groceries * numAdults) +
    destination.costs.transportation +
    destination.costs.healthcare +
    getChildcareCost(destination);
  
  // Convert to USD
  const originCostsUSD = originMonthlyCosts * originToUSD;
  const destCostsUSD = destMonthlyCosts * destToUSD;
  
  // Calculate net income
  const originMonthlyGross = salary / 12;
  const originMonthlyNet = originMonthlyGross * (1 - origin.taxes.incomeTaxRate);
  const originMonthlySurplus = originMonthlyNet - originMonthlyCosts;
  const originSurplusUSD = originMonthlySurplus * originToUSD;
  
  // For destination, assume same USD-equivalent salary initially
  const salaryUSD = salary * originToUSD;
  const destSalaryLocal = salaryUSD / destToUSD;
  const destMonthlyGross = destSalaryLocal / 12;
  const destMonthlyNet = destMonthlyGross * (1 - destination.taxes.incomeTaxRate);
  const destMonthlySurplus = destMonthlyNet - destMonthlyCosts;
  const destSurplusUSD = destMonthlySurplus * destToUSD;
  
  // Calculate differences
  const costOfLivingDifference = ((destCostsUSD - originCostsUSD) / originCostsUSD) * 100;
  const rentDifference = ((getRent(destination) * destToUSD - getRent(origin) * originToUSD) / (getRent(origin) * originToUSD)) * 100;
  const monthlyNetDifference = destSurplusUSD - originSurplusUSD;
  
  // Calculate salary needed in destination to maintain same surplus
  const targetSurplusLocal = originSurplusUSD / destToUSD;
  const neededMonthlyNet = targetSurplusLocal + destMonthlyCosts;
  const neededMonthlyGross = neededMonthlyNet / (1 - destination.taxes.incomeTaxRate);
  const recommendedSalary = neededMonthlyGross * 12;
  
  return {
    origin,
    destination,
    comparison: {
      costOfLivingDifference: Math.round(costOfLivingDifference * 10) / 10,
      rentDifference: Math.round(rentDifference * 10) / 10,
      purchasingPowerDifference: Math.round(-costOfLivingDifference * 10) / 10, // Inverse of cost difference
      monthlyNetDifference: Math.round(monthlyNetDifference),
      annualNetDifference: Math.round(monthlyNetDifference * 12),
      recommendedSalary: Math.round(recommendedSalary),
    },
  };
}
