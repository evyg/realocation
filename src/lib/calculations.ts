import citiesData from '@/data/cities.json';

export interface City {
  id: string;
  name: string;
  state: string;
  stateTaxRate: number;
  localTaxRate: number;
  salesTaxRate: number;
  medianRentStudio?: number;
  medianRent1BR: number;
  medianRent2BR: number;
  medianRent3BR: number;
  medianRent4BR: number;
  costIndex: number;
}

export type BedroomType = 'studio' | '1br' | '2br' | '3br' | '4br';

export interface HouseholdOptions {
  bedrooms?: BedroomType;
  adults?: number;
  children?: number;
  hasCar?: boolean;
}

export interface CityResult {
  city: City;
  grossIncome: number;
  federalTax: number;
  stateTax: number;
  localTax: number;
  ficaTax: number;
  netIncome: number;
  monthlyRent: number;
  monthlyCostOfLiving: number;
  monthlyCostOfLivingBase: number;
  monthlyCarCost: number;
  monthlySurplus: number;
  annualSurplus: number;
  differenceFromCurrent: number;
}

// 2024 Federal Tax Brackets (Single filer)
const FEDERAL_BRACKETS = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

// FICA constants
const SOCIAL_SECURITY_RATE = 0.062;
const SOCIAL_SECURITY_CAP = 168600;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD = 200000;

// Standard deduction 2024
const STANDARD_DEDUCTION = 14600;

// Base cost of living (monthly, national average)
const BASE_MONTHLY_COL = 2500; // groceries, transport, utilities, etc. (excluding rent)
const CAR_MONTHLY_COST = 450;

export function calculateFederalTax(income: number): number {
  // Apply standard deduction
  const taxableIncome = Math.max(0, income - STANDARD_DEDUCTION);
  
  let tax = 0;
  let remainingIncome = taxableIncome;
  
  for (const bracket of FEDERAL_BRACKETS) {
    if (remainingIncome <= 0) break;
    
    const taxableInBracket = Math.min(
      remainingIncome,
      bracket.max - bracket.min
    );
    
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }
  
  return Math.round(tax);
}

export function calculateStateTax(income: number, stateTaxRate: number): number {
  // Simplified: flat rate on income (many states have brackets, but this is MVP)
  // Apply a rough deduction equivalent
  const taxableIncome = Math.max(0, income - 10000);
  return Math.round(taxableIncome * stateTaxRate);
}

export function calculateLocalTax(income: number, localTaxRate: number): number {
  return Math.round(income * localTaxRate);
}

export function calculateFICA(income: number): number {
  // Social Security
  const socialSecurityTax = Math.min(income, SOCIAL_SECURITY_CAP) * SOCIAL_SECURITY_RATE;
  
  // Medicare
  let medicareTax = income * MEDICARE_RATE;
  
  // Additional Medicare
  if (income > ADDITIONAL_MEDICARE_THRESHOLD) {
    medicareTax += (income - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE;
  }
  
  return Math.round(socialSecurityTax + medicareTax);
}

export function getRent(city: City, bedrooms: BedroomType = '1br'): number {
  switch (bedrooms) {
    case 'studio':
      return Math.round(city.medianRentStudio ?? city.medianRent1BR * 0.8);
    case '1br': return city.medianRent1BR;
    case '2br': return city.medianRent2BR;
    case '3br': return city.medianRent3BR;
    case '4br': return city.medianRent4BR;
    default: return city.medianRent1BR;
  }
}

export function calculateMonthlyCostOfLiving(
  city: City,
  options: HouseholdOptions = {}
): number {
  const { adults = 1, children = 0, hasCar = false } = options;
  const safeAdults = Math.max(1, Math.floor(adults));
  const safeChildren = Math.max(0, Math.floor(children));
  const familyMultiplier = 1 + Math.max(safeAdults - 1, 0) * 0.65 + safeChildren * 0.4;
  const baseCost = BASE_MONTHLY_COL * (city.costIndex / 100);
  const carCost = hasCar ? CAR_MONTHLY_COST : 0;
  return Math.round(baseCost * familyMultiplier + carCost);
}

export function calculateMonthlyCostOfLivingDetails(
  city: City,
  options: HouseholdOptions = {}
): { baseCost: number; carCost: number; total: number } {
  const { adults = 1, children = 0, hasCar = false } = options;
  const safeAdults = Math.max(1, Math.floor(adults));
  const safeChildren = Math.max(0, Math.floor(children));
  const familyMultiplier = 1 + Math.max(safeAdults - 1, 0) * 0.65 + safeChildren * 0.4;
  const baseCost = Math.round(BASE_MONTHLY_COL * (city.costIndex / 100) * familyMultiplier);
  const carCost = hasCar ? CAR_MONTHLY_COST : 0;
  return {
    baseCost,
    carCost,
    total: Math.round(baseCost + carCost),
  };
}

export function calculateCityResult(
  salary: number,
  city: City,
  options: HouseholdOptions = {}
): CityResult {
  const { bedrooms = '1br', adults = 1, children = 0, hasCar = false } = options;
  const grossIncome = salary;
  const federalTax = calculateFederalTax(salary);
  const stateTax = calculateStateTax(salary, city.stateTaxRate);
  const localTax = calculateLocalTax(salary, city.localTaxRate);
  const ficaTax = calculateFICA(salary);
  
  const totalTax = federalTax + stateTax + localTax + ficaTax;
  const netIncome = grossIncome - totalTax;
  
  const monthlyRent = getRent(city, bedrooms);
  const colDetails = calculateMonthlyCostOfLivingDetails(city, { adults, children, hasCar });
  const monthlyCostOfLiving = colDetails.total;
  const monthlyExpenses = monthlyRent + monthlyCostOfLiving;
  
  const monthlyNetIncome = netIncome / 12;
  const monthlySurplus = monthlyNetIncome - monthlyExpenses;
  const annualSurplus = monthlySurplus * 12;
  
  return {
    city,
    grossIncome,
    federalTax,
    stateTax,
    localTax,
    ficaTax,
    netIncome,
    monthlyRent,
    monthlyCostOfLiving,
    monthlyCostOfLivingBase: colDetails.baseCost,
    monthlyCarCost: colDetails.carCost,
    monthlySurplus: Math.round(monthlySurplus),
    annualSurplus: Math.round(annualSurplus),
    differenceFromCurrent: 0, // Will be calculated by comparison
  };
}

export function compareCities(
  salary: number,
  currentCityId: string,
  options: HouseholdOptions = {}
): { currentCity: CityResult; rankedCities: CityResult[] } {
  const cities = citiesData as City[];
  const currentCity = cities.find(c => c.id === currentCityId);
  
  if (!currentCity) {
    throw new Error(`City not found: ${currentCityId}`);
  }
  
  const currentResult = calculateCityResult(salary, currentCity, options);
  
  const allResults = cities.map(city => {
    const result = calculateCityResult(salary, city, options);
    return {
      ...result,
      differenceFromCurrent: result.monthlySurplus - currentResult.monthlySurplus,
    };
  });
  
  // Sort by difference (best first)
  const rankedCities = allResults
    .filter(r => r.city.id !== currentCityId)
    .sort((a, b) => b.differenceFromCurrent - a.differenceFromCurrent);
  
  return {
    currentCity: currentResult,
    rankedCities,
  };
}

export function getCities(): City[] {
  return citiesData as City[];
}

export function getCityById(id: string): City | undefined {
  return (citiesData as City[]).find(c => c.id === id);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount);
}
