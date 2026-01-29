// Perplexity API integration for dynamic location research

export interface LocationData {
  location: string;
  country: string;
  currency: string;
  currencySymbol: string;
  
  // Housing (monthly, in local currency)
  housing: {
    rentStudio: number;
    rent1BR: number;
    rent2BR: number;
    rent3BR: number;
    rent4BR: number;
    buyPricePerSqMeter: number; // to buy property
    propertyTaxRate: number; // annual, as % of property value
    homeInsuranceMonthly: number;
  };
  
  // Utilities (monthly)
  utilities: {
    electricity: number;
    water: number;
    gas: number;
    internet: number;
    mobilePhone: number;
    cableTV: number;
    total: number;
  };
  
  // Food & Groceries (monthly per person)
  food: {
    groceriesBasic: number; // basic food basket
    groceriesMidRange: number; // mid-range shopping
    restaurantCheapMeal: number; // single meal, cheap restaurant
    restaurantMidRange: number; // 3-course meal, mid-range
    restaurantHighEnd: number; // fine dining per person
    coffee: number; // cappuccino
    beer: number; // domestic, restaurant
    fastFood: number; // combo meal
  };
  
  // Transportation (monthly)
  transportation: {
    publicTransitPass: number;
    taxiPerKm: number;
    taxiStartFare: number;
    gasPerLiter: number;
    carInsuranceMonthly: number;
    carPaymentAverage: number; // average car loan payment
    parkingMonthly: number; // city center
    rideSharePerKm: number; // Uber/Lyft equivalent
  };
  
  // Healthcare (monthly)
  healthcare: {
    insurancePremium: number; // private health insurance
    doctorVisit: number; // general practitioner
    dentistVisit: number;
    prescriptionAverage: number;
    hospitalDayPrivate: number;
  };
  
  // Childcare & Education (monthly)
  childcare: {
    daycareInfant: number; // 0-1 year, full-time
    daycareToddler: number; // 1-3 years, full-time
    preschool: number; // 3-5 years
    privateSchoolPrimary: number; // per year
    privateSchoolSecondary: number; // per year
    collegeTuitionLocal: number; // per year, public university
    collegeTuitionPrivate: number; // per year
    babysitterHourly: number;
    summerCampWeekly: number;
  };
  
  // Personal Care & Fitness (monthly)
  lifestyle: {
    gymMembership: number;
    movieTicket: number;
    theaterTicket: number;
    clothingBrand: number; // jeans, mid-range
    shoes: number; // running shoes, mid-range
    haircut: number;
    cosmetics: number; // monthly average
  };
  
  // Taxes
  taxes: {
    incomeTaxBrackets: { min: number; max: number; rate: number }[];
    effectiveRateMedian: number; // for median income
    effectiveRateHigh: number; // for high earners ($150k+)
    capitalGainsTax: number;
    salesTaxRate: number;
    propertyTaxRate: number;
    socialSecurityRate: number; // employee portion
  };
  
  // Income (annual, in local currency)
  income: {
    minimumWageMonthly: number;
    medianSalary: number;
    averageSalary: number;
    techSalaryAverage: number;
    financeSalaryAverage: number;
    healthcareSalaryAverage: number;
    teacherSalaryAverage: number;
  };
  
  // Quality of Life (indices 0-100)
  quality: {
    safetyIndex: number;
    healthcareIndex: number;
    pollutionIndex: number; // lower is better
    trafficIndex: number; // lower is better
    climateIndex: number;
    costOfLivingIndex: number; // relative to NYC (100)
    qualityOfLifeIndex: number;
    climateDescription: string;
    averageCommute: number; // minutes
  };
  
  // Exchange rate
  exchangeRateToUSD: number;
  
  // Metadata
  dataDate: string;
  sources: string[];
}

export interface ComparisonInput {
  origin: string;
  destination: string;
  salary: number;
  bedrooms: 'studio' | '1BR' | '2BR' | '3BR' | '4BR';
  numAdults: number;
  children: { age: number }[];
  hasCar: boolean;
  diningOutFrequency: 'rarely' | 'sometimes' | 'often'; // per week
  lifestyleLevel: 'budget' | 'moderate' | 'comfortable' | 'luxury';
}

export interface ComparisonResult {
  origin: LocationData;
  destination: LocationData;
  inputs: ComparisonInput;
  
  // Detailed monthly breakdown (in USD)
  breakdown: {
    origin: MonthlyBreakdown;
    destination: MonthlyBreakdown;
  };
  
  // Summary comparison
  comparison: {
    totalMonthlyCostOrigin: number;
    totalMonthlyCostDestination: number;
    costDifferencePercent: number;
    monthlySurplusOrigin: number;
    monthlySurplusDestination: number;
    surplusDifferenceMonthly: number;
    surplusDifferenceAnnual: number;
    salaryNeededToMatchLifestyle: number; // in destination currency
    purchasingPowerIndex: number; // 100 = same, >100 = better in dest
  };
  
  // Recommendations
  recommendations: string[];
}

export interface MonthlyBreakdown {
  grossIncome: number;
  taxes: number;
  netIncome: number;
  housing: number;
  utilities: number;
  food: number;
  transportation: number;
  healthcare: number;
  childcare: number;
  lifestyle: number;
  totalExpenses: number;
  surplus: number;
}

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// Default values for US cities (in USD) to use when data is missing/zero
const US_DEFAULTS = {
  utilities: {
    electricity: 120,
    water: 50,
    gas: 60,
    internet: 70,
    mobilePhone: 60,
    cableTV: 50,
    total: 410,
  },
  healthcare: {
    insurancePremium: 450,
    doctorVisit: 150,
    dentistVisit: 100,
    prescriptionAverage: 30,
    hospitalDayPrivate: 2500,
  },
  food: {
    groceriesBasic: 350,
    groceriesMidRange: 500,
    restaurantCheapMeal: 18,
    restaurantMidRange: 65,
    restaurantHighEnd: 150,
    coffee: 5,
    beer: 8,
    fastFood: 12,
  },
  transportation: {
    publicTransitPass: 130,
    taxiPerKm: 2.5,
    taxiStartFare: 3.5,
    gasPerLiter: 1.0,
    carInsuranceMonthly: 150,
    carPaymentAverage: 500,
    parkingMonthly: 200,
    rideSharePerKm: 2.0,
  },
  lifestyle: {
    gymMembership: 60,
    movieTicket: 16,
    theaterTicket: 100,
    clothingBrand: 50,
    shoes: 90,
    haircut: 30,
    cosmetics: 40,
  },
};

function validateLocationData(data: LocationData): LocationData {
  // Deep clone to avoid mutation
  const validated = JSON.parse(JSON.stringify(data));
  
  // Check if this is a US location
  const isUS = validated.country?.toLowerCase().includes('united states') || 
               validated.country?.toLowerCase() === 'usa' ||
               validated.currency === 'USD';
  
  // Use US_DEFAULTS as base for all locations (reasonable fallbacks)
  const defaults = US_DEFAULTS;
  
  // Validate utilities - if total is 0 or very low, use defaults
  if (!validated.utilities || validated.utilities.total < 50) {
    validated.utilities = { ...defaults.utilities };
  } else {
    // Validate individual utility values
    for (const key of Object.keys(defaults.utilities) as (keyof typeof defaults.utilities)[]) {
      if (!validated.utilities[key] || validated.utilities[key] === 0) {
        validated.utilities[key] = defaults.utilities[key];
      }
    }
    // Recalculate total
    validated.utilities.total = 
      validated.utilities.electricity +
      validated.utilities.water +
      validated.utilities.gas +
      validated.utilities.internet +
      validated.utilities.mobilePhone +
      validated.utilities.cableTV;
  }
  
  // Validate healthcare
  if (!validated.healthcare || validated.healthcare.insurancePremium === 0) {
    validated.healthcare = { ...validated.healthcare, ...defaults.healthcare };
  }
  
  // Validate food
  if (!validated.food || validated.food.groceriesBasic === 0) {
    validated.food = { ...defaults.food, ...validated.food };
    // Ensure no zeros in critical fields
    for (const key of Object.keys(defaults.food) as (keyof typeof defaults.food)[]) {
      if (!validated.food[key] || validated.food[key] === 0) {
        validated.food[key] = defaults.food[key];
      }
    }
  }
  
  // Validate transportation  
  if (!validated.transportation || validated.transportation.publicTransitPass === 0) {
    validated.transportation = { ...defaults.transportation, ...validated.transportation };
    for (const key of Object.keys(defaults.transportation) as (keyof typeof defaults.transportation)[]) {
      if (!validated.transportation[key] || validated.transportation[key] === 0) {
        validated.transportation[key] = defaults.transportation[key];
      }
    }
  }
  
  // Validate lifestyle
  if (!validated.lifestyle || validated.lifestyle.gymMembership === 0) {
    validated.lifestyle = { ...defaults.lifestyle, ...validated.lifestyle };
    for (const key of Object.keys(defaults.lifestyle) as (keyof typeof defaults.lifestyle)[]) {
      if (!validated.lifestyle[key] || validated.lifestyle[key] === 0) {
        validated.lifestyle[key] = defaults.lifestyle[key];
      }
    }
  }
  
  // Validate exchange rate (should never be 0)
  if (!validated.exchangeRateToUSD || validated.exchangeRateToUSD === 0) {
    validated.exchangeRateToUSD = 1; // Assume USD if unknown
  }
  
  // Validate tax brackets
  if (!validated.taxes?.incomeTaxBrackets?.length) {
    validated.taxes = validated.taxes || {};
    validated.taxes.incomeTaxBrackets = [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 },
      { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 },
      { min: 243725, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 },
    ];
  }
  
  // Validate social security rate
  if (!validated.taxes?.socialSecurityRate) {
    validated.taxes.socialSecurityRate = 0.0765; // US FICA rate
  }
  
  return validated;
}

async function callPerplexity(location: string, retryCount = 0): Promise<LocationData> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY not configured');
  }

  const prompt = `Research comprehensive cost of living data for "${location}". 

Provide accurate, up-to-date data (2024-2025) in JSON format. All monetary values in LOCAL CURRENCY.

{
  "location": "City, Country",
  "country": "Country name",
  "currency": "ISO code (USD/EUR/GBP/etc)",
  "currencySymbol": "$€£ etc",
  
  "housing": {
    "rentStudio": monthly studio apartment rent (city center),
    "rent1BR": monthly 1-bedroom rent (city center),
    "rent2BR": monthly 2-bedroom rent (city center),
    "rent3BR": monthly 3-bedroom rent (city center),
    "rent4BR": monthly 4-bedroom house/apartment rent,
    "buyPricePerSqMeter": price to buy property per square meter (city center),
    "propertyTaxRate": annual property tax as decimal (e.g. 0.01 for 1%),
    "homeInsuranceMonthly": average monthly home insurance
  },
  
  "utilities": {
    "electricity": monthly electricity (85sqm apartment),
    "water": monthly water,
    "gas": monthly gas/heating,
    "internet": monthly internet (60+ Mbps),
    "mobilePhone": monthly mobile plan with data,
    "cableTV": monthly cable/streaming,
    "total": sum of all utilities
  },
  
  "food": {
    "groceriesBasic": monthly basic groceries (1 person),
    "groceriesMidRange": monthly mid-range groceries (1 person),
    "restaurantCheapMeal": cheap restaurant meal,
    "restaurantMidRange": 3-course mid-range restaurant (1 person),
    "restaurantHighEnd": fine dining per person,
    "coffee": cappuccino at cafe,
    "beer": domestic beer at restaurant,
    "fastFood": fast food combo meal
  },
  
  "transportation": {
    "publicTransitPass": monthly public transit pass,
    "taxiPerKm": taxi price per km,
    "taxiStartFare": taxi start/flag fare,
    "gasPerLiter": gasoline price per liter,
    "carInsuranceMonthly": average car insurance monthly,
    "carPaymentAverage": average monthly car loan payment,
    "parkingMonthly": monthly parking (city center),
    "rideSharePerKm": Uber/Lyft per km
  },
  
  "healthcare": {
    "insurancePremium": monthly private health insurance (individual),
    "doctorVisit": general practitioner visit,
    "dentistVisit": dental checkup,
    "prescriptionAverage": average prescription cost,
    "hospitalDayPrivate": private hospital per day
  },
  
  "childcare": {
    "daycareInfant": monthly full-time daycare (0-1 year),
    "daycareToddler": monthly full-time daycare (1-3 years),
    "preschool": monthly preschool (3-5 years),
    "privateSchoolPrimary": annual private primary school tuition,
    "privateSchoolSecondary": annual private secondary school tuition,
    "collegeTuitionLocal": annual public university tuition (local students),
    "collegeTuitionPrivate": annual private university tuition,
    "babysitterHourly": babysitter hourly rate,
    "summerCampWeekly": summer camp weekly cost
  },
  
  "lifestyle": {
    "gymMembership": monthly gym membership,
    "movieTicket": cinema ticket,
    "theaterTicket": theater/concert average ticket,
    "clothingBrand": mid-range jeans,
    "shoes": mid-range running shoes,
    "haircut": average haircut,
    "cosmetics": monthly cosmetics/toiletries average
  },
  
  "taxes": {
    "incomeTaxBrackets": [{"min": 0, "max": X, "rate": 0.X}, ...],
    "effectiveRateMedian": effective tax rate at median income (decimal),
    "effectiveRateHigh": effective tax rate at $150k equivalent (decimal),
    "capitalGainsTax": capital gains tax rate (decimal),
    "salesTaxRate": sales/VAT tax rate (decimal),
    "propertyTaxRate": annual property tax rate (decimal),
    "socialSecurityRate": employee social security/national insurance rate (decimal)
  },
  
  "income": {
    "minimumWageMonthly": monthly minimum wage (full-time),
    "medianSalary": annual median salary,
    "averageSalary": annual average salary,
    "techSalaryAverage": annual average tech/software salary,
    "financeSalaryAverage": annual average finance salary,
    "healthcareSalaryAverage": annual average healthcare professional salary,
    "teacherSalaryAverage": annual average teacher salary
  },
  
  "quality": {
    "safetyIndex": 0-100 (100 safest),
    "healthcareIndex": 0-100 (100 best),
    "pollutionIndex": 0-100 (0 cleanest),
    "trafficIndex": 0-100 (0 least traffic),
    "climateIndex": 0-100 (100 most pleasant),
    "costOfLivingIndex": relative to NYC=100,
    "qualityOfLifeIndex": 0-100,
    "climateDescription": "brief climate description",
    "averageCommute": average commute minutes one-way
  },
  
  "exchangeRateToUSD": 1 local currency = X USD,
  "sources": ["data sources used"]
}

Use data from Numbeo, Expatistan, government statistics, and local sources. If exact data unavailable, provide reasonable estimates. Return ONLY valid JSON.`;

  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [
        {
          role: 'system',
          content: 'You are a cost of living research expert. Always respond with valid JSON only. Use accurate, recent data. Be comprehensive and precise with numbers.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000,
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

  try {
    // Clean up the response - remove markdown code blocks and any extra text
    let cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    // Try to extract JSON if there's extra text around it
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedContent = jsonMatch[0];
    }
    
    const locationData = JSON.parse(cleanedContent);
    locationData.dataDate = new Date().toISOString().split('T')[0];
    
    // Validate and apply sensible defaults for missing/zero data
    const validated = validateLocationData(locationData);
    
    return validated as LocationData;
  } catch (parseError) {
    console.error('Failed to parse Perplexity response. Content preview:', content?.substring(0, 500));
    console.error('Parse error:', parseError);
    // Retry once if this is the first attempt
    if (retryCount < 1) {
      console.log(`Retrying research for ${location} (attempt ${retryCount + 2})`);
      return callPerplexity(location, retryCount + 1);
    }
    throw new Error(`Failed to parse location data. The AI response was malformed. Please try again.`);
  }
}

export async function researchLocation(location: string): Promise<LocationData> {
  return callPerplexity(location, 0);
}

export function calculateComparison(
  origin: LocationData,
  destination: LocationData,
  input: ComparisonInput
): ComparisonResult {
  const { salary, bedrooms, numAdults, children, hasCar, diningOutFrequency, lifestyleLevel } = input;
  
  const originToUSD = origin.exchangeRateToUSD;
  const destToUSD = destination.exchangeRateToUSD;
  
  // Lifestyle multipliers
  const lifestyleMultiplier = {
    budget: 0.7,
    moderate: 1.0,
    comfortable: 1.3,
    luxury: 1.8,
  }[lifestyleLevel];
  
  const diningMultiplier = {
    rarely: 2, // 2 meals out per month
    sometimes: 8, // 2 per week
    often: 16, // 4 per week
  }[diningOutFrequency];
  
  // Helper functions
  const getRent = (data: LocationData) => {
    const rents = {
      studio: data.housing.rentStudio,
      '1BR': data.housing.rent1BR,
      '2BR': data.housing.rent2BR,
      '3BR': data.housing.rent3BR,
      '4BR': data.housing.rent4BR,
    };
    return rents[bedrooms];
  };
  
  const getChildcareCost = (data: LocationData) => {
    return children.reduce((total, child) => {
      if (child.age < 1) return total + data.childcare.daycareInfant;
      if (child.age < 3) return total + data.childcare.daycareToddler;
      if (child.age < 6) return total + data.childcare.preschool;
      return total;
    }, 0);
  };
  
  const getFoodCost = (data: LocationData) => {
    const groceries = lifestyleLevel === 'budget' 
      ? data.food.groceriesBasic 
      : data.food.groceriesMidRange;
    const diningOut = diningMultiplier * (
      lifestyleLevel === 'luxury' 
        ? data.food.restaurantHighEnd 
        : lifestyleLevel === 'budget'
          ? data.food.restaurantCheapMeal
          : data.food.restaurantMidRange
    );
    return (groceries * numAdults) + diningOut;
  };
  
  const getTransportCost = (data: LocationData) => {
    if (hasCar) {
      return data.transportation.carInsuranceMonthly + 
             data.transportation.carPaymentAverage + 
             data.transportation.parkingMonthly +
             (data.transportation.gasPerLiter * 60); // ~60L/month average
    }
    return data.transportation.publicTransitPass * numAdults;
  };
  
  const getLifestyleCost = (data: LocationData) => {
    return (
      data.lifestyle.gymMembership +
      (data.lifestyle.movieTicket * 2) +
      data.lifestyle.haircut +
      data.lifestyle.cosmetics
    ) * lifestyleMultiplier;
  };
  
  // Calculate tax
  const calculateTax = (data: LocationData, annualIncome: number) => {
    let tax = 0;
    let remaining = annualIncome;
    
    for (const bracket of data.taxes.incomeTaxBrackets) {
      if (remaining <= 0) break;
      const taxableInBracket = Math.min(remaining, bracket.max - bracket.min);
      tax += taxableInBracket * bracket.rate;
      remaining -= taxableInBracket;
    }
    
    // Add social security
    tax += annualIncome * data.taxes.socialSecurityRate;
    
    return tax;
  };
  
  // Calculate monthly breakdown for origin
  const originAnnualTax = calculateTax(origin, salary);
  const originMonthlyNet = (salary - originAnnualTax) / 12;
  
  const originBreakdown: MonthlyBreakdown = {
    grossIncome: salary / 12,
    taxes: originAnnualTax / 12,
    netIncome: originMonthlyNet,
    housing: getRent(origin),
    utilities: origin.utilities.total,
    food: getFoodCost(origin),
    transportation: getTransportCost(origin),
    healthcare: origin.healthcare.insurancePremium,
    childcare: getChildcareCost(origin),
    lifestyle: getLifestyleCost(origin),
    totalExpenses: 0,
    surplus: 0,
  };
  originBreakdown.totalExpenses = 
    originBreakdown.housing +
    originBreakdown.utilities +
    originBreakdown.food +
    originBreakdown.transportation +
    originBreakdown.healthcare +
    originBreakdown.childcare +
    originBreakdown.lifestyle;
  originBreakdown.surplus = originBreakdown.netIncome - originBreakdown.totalExpenses;
  
  // For destination, convert salary to local currency (same USD value)
  const salaryUSD = salary * originToUSD;
  const destSalaryLocal = salaryUSD / destToUSD;
  const destAnnualTax = calculateTax(destination, destSalaryLocal);
  const destMonthlyNet = (destSalaryLocal - destAnnualTax) / 12;
  
  const destBreakdown: MonthlyBreakdown = {
    grossIncome: destSalaryLocal / 12,
    taxes: destAnnualTax / 12,
    netIncome: destMonthlyNet,
    housing: getRent(destination),
    utilities: destination.utilities.total,
    food: getFoodCost(destination),
    transportation: getTransportCost(destination),
    healthcare: destination.healthcare.insurancePremium,
    childcare: getChildcareCost(destination),
    lifestyle: getLifestyleCost(destination),
    totalExpenses: 0,
    surplus: 0,
  };
  destBreakdown.totalExpenses = 
    destBreakdown.housing +
    destBreakdown.utilities +
    destBreakdown.food +
    destBreakdown.transportation +
    destBreakdown.healthcare +
    destBreakdown.childcare +
    destBreakdown.lifestyle;
  destBreakdown.surplus = destBreakdown.netIncome - destBreakdown.totalExpenses;
  
  // Convert breakdowns to USD for comparison
  const originExpensesUSD = originBreakdown.totalExpenses * originToUSD;
  const destExpensesUSD = destBreakdown.totalExpenses * destToUSD;
  const originSurplusUSD = originBreakdown.surplus * originToUSD;
  const destSurplusUSD = destBreakdown.surplus * destToUSD;
  
  // Calculate salary needed in destination to match origin surplus
  const targetSurplusLocal = originSurplusUSD / destToUSD;
  const neededMonthlyNet = targetSurplusLocal + destBreakdown.totalExpenses;
  const neededAnnualNet = neededMonthlyNet * 12;
  // Rough inverse of tax calculation
  const effectiveTaxRate = destAnnualTax / destSalaryLocal;
  const salaryNeededToMatch = neededAnnualNet / (1 - effectiveTaxRate);
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  const costDiff = ((destExpensesUSD - originExpensesUSD) / originExpensesUSD) * 100;
  if (costDiff < -20) {
    recommendations.push(`${destination.location} is significantly cheaper (${Math.abs(Math.round(costDiff))}% lower cost of living)`);
  } else if (costDiff > 20) {
    recommendations.push(`${destination.location} is significantly more expensive (${Math.round(costDiff)}% higher cost of living)`);
  }
  
  if (destSurplusUSD > originSurplusUSD * 1.2) {
    recommendations.push(`You'd have ${Math.round(((destSurplusUSD / originSurplusUSD) - 1) * 100)}% more surplus in ${destination.location}`);
  }
  
  if (destination.quality.safetyIndex > origin.quality.safetyIndex + 10) {
    recommendations.push(`${destination.location} has a notably higher safety index`);
  }
  
  if (children.length > 0 && getChildcareCost(destination) * destToUSD < getChildcareCost(origin) * originToUSD * 0.7) {
    recommendations.push(`Childcare is significantly cheaper in ${destination.location}`);
  }
  
  return {
    origin,
    destination,
    inputs: input,
    breakdown: {
      origin: originBreakdown,
      destination: destBreakdown,
    },
    comparison: {
      totalMonthlyCostOrigin: Math.round(originExpensesUSD),
      totalMonthlyCostDestination: Math.round(destExpensesUSD),
      costDifferencePercent: Math.round(costDiff * 10) / 10,
      monthlySurplusOrigin: Math.round(originSurplusUSD),
      monthlySurplusDestination: Math.round(destSurplusUSD),
      surplusDifferenceMonthly: Math.round(destSurplusUSD - originSurplusUSD),
      surplusDifferenceAnnual: Math.round((destSurplusUSD - originSurplusUSD) * 12),
      salaryNeededToMatchLifestyle: Math.round(salaryNeededToMatch),
      purchasingPowerIndex: Math.round((originExpensesUSD / destExpensesUSD) * 100),
    },
    recommendations,
  };
}
