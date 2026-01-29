/**
 * City Data Fetcher
 * 
 * Fetches comprehensive US city data from Census Bureau
 * Run: node scripts/fetch-cities.mjs
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// State tax rates (2024)
const STATE_TAX_RATES = {
  'AL': { rate: 0.05, hasLocalTax: true },
  'AK': { rate: 0, hasLocalTax: false },
  'AZ': { rate: 0.025, hasLocalTax: false },
  'AR': { rate: 0.055, hasLocalTax: false },
  'CA': { rate: 0.093, hasLocalTax: false },
  'CO': { rate: 0.044, hasLocalTax: true },
  'CT': { rate: 0.0699, hasLocalTax: false },
  'DE': { rate: 0.066, hasLocalTax: false },
  'FL': { rate: 0, hasLocalTax: false },
  'GA': { rate: 0.055, hasLocalTax: false },
  'HI': { rate: 0.11, hasLocalTax: false },
  'ID': { rate: 0.058, hasLocalTax: false },
  'IL': { rate: 0.0495, hasLocalTax: false },
  'IN': { rate: 0.0315, hasLocalTax: true },
  'IA': { rate: 0.06, hasLocalTax: false },
  'KS': { rate: 0.057, hasLocalTax: false },
  'KY': { rate: 0.045, hasLocalTax: true },
  'LA': { rate: 0.0425, hasLocalTax: false },
  'ME': { rate: 0.0715, hasLocalTax: false },
  'MD': { rate: 0.0575, hasLocalTax: true },
  'MA': { rate: 0.05, hasLocalTax: false },
  'MI': { rate: 0.0425, hasLocalTax: true },
  'MN': { rate: 0.0985, hasLocalTax: false },
  'MS': { rate: 0.05, hasLocalTax: false },
  'MO': { rate: 0.054, hasLocalTax: true },
  'MT': { rate: 0.0675, hasLocalTax: false },
  'NE': { rate: 0.0684, hasLocalTax: false },
  'NV': { rate: 0, hasLocalTax: false },
  'NH': { rate: 0, hasLocalTax: false },
  'NJ': { rate: 0.1075, hasLocalTax: false },
  'NM': { rate: 0.059, hasLocalTax: false },
  'NY': { rate: 0.109, hasLocalTax: true },
  'NC': { rate: 0.0525, hasLocalTax: false },
  'ND': { rate: 0.029, hasLocalTax: false },
  'OH': { rate: 0.04, hasLocalTax: true },
  'OK': { rate: 0.0475, hasLocalTax: false },
  'OR': { rate: 0.099, hasLocalTax: false },
  'PA': { rate: 0.0307, hasLocalTax: true },
  'RI': { rate: 0.0599, hasLocalTax: false },
  'SC': { rate: 0.065, hasLocalTax: false },
  'SD': { rate: 0, hasLocalTax: false },
  'TN': { rate: 0, hasLocalTax: false },
  'TX': { rate: 0, hasLocalTax: false },
  'UT': { rate: 0.0485, hasLocalTax: false },
  'VT': { rate: 0.0875, hasLocalTax: false },
  'VA': { rate: 0.0575, hasLocalTax: false },
  'WA': { rate: 0, hasLocalTax: false },
  'WV': { rate: 0.065, hasLocalTax: false },
  'WI': { rate: 0.0765, hasLocalTax: false },
  'WY': { rate: 0, hasLocalTax: false },
  'DC': { rate: 0.1075, hasLocalTax: false },
};

// State full names
const STATE_NAMES = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia',
};

// State FIPS codes
const FIPS_TO_STATE = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
  '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
  '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
  '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
  '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
  '56': 'WY',
};

// Regional rent multipliers
const RENT_MULTIPLIERS = {
  'CA': 1.8, 'NY': 1.7, 'MA': 1.5, 'WA': 1.4, 'CO': 1.3,
  'NJ': 1.5, 'CT': 1.4, 'HI': 1.9, 'DC': 1.6, 'MD': 1.3,
  'OR': 1.2, 'VA': 1.2, 'IL': 1.1, 'MN': 1.1, 'AZ': 1.1,
  'FL': 1.15, 'NV': 1.2, 'UT': 1.1, 'NH': 1.2, 'RI': 1.2,
  'TX': 1.0, 'GA': 0.95, 'NC': 0.95, 'PA': 0.95, 'TN': 0.9,
  'OH': 0.85, 'MI': 0.85, 'IN': 0.8, 'MO': 0.8, 'WI': 0.9,
  'AL': 0.75, 'AR': 0.7, 'KY': 0.75, 'MS': 0.65, 'WV': 0.65,
  'OK': 0.75, 'KS': 0.8, 'NE': 0.8, 'IA': 0.8, 'LA': 0.8,
  'SC': 0.85, 'NM': 0.85, 'ND': 0.85, 'SD': 0.8, 'MT': 0.9,
  'ID': 0.95, 'WY': 0.9, 'AK': 1.3, 'ME': 1.0, 'VT': 1.1,
  'DE': 1.1,
};

const NATIONAL_MEDIAN_1BR = 1400;

// Directories
const CACHE_DIR = path.join(__dirname, '../.cache');
const DATA_DIR = path.join(__dirname, '../src/data');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getCacheFile(name) {
  return path.join(CACHE_DIR, `${name}.json`);
}

function readCache(name) {
  const file = getCacheFile(name);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    if (data._cachedAt && Date.now() - data._cachedAt < 7 * 24 * 60 * 60 * 1000) {
      return data.data;
    }
  }
  return null;
}

function writeCache(name, data) {
  ensureDir(CACHE_DIR);
  fs.writeFileSync(getCacheFile(name), JSON.stringify({ _cachedAt: Date.now(), data }, null, 2));
}

async function fetchCensusPlaces() {
  const cached = readCache('census-places');
  if (cached) {
    console.log('✓ Using cached Census data');
    return cached;
  }

  console.log('📡 Fetching Census places data...');
  
  const url = 'https://api.census.gov/data/2020/dec/pl?get=NAME,P1_001N&for=place:*&in=state:*';
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    const places = data.slice(1).map((row) => ({
      name: row[0].split(',')[0],
      population: parseInt(row[1]) || 0,
      stateCode: row[2],
      placeCode: row[3],
    }));
    
    writeCache('census-places', places);
    console.log(`✓ Fetched ${places.length} places from Census`);
    return places;
  } catch (error) {
    console.error('✗ Failed to fetch Census data:', error.message);
    return [];
  }
}

function getStateRents(stateCode) {
  const multiplier = RENT_MULTIPLIERS[stateCode] || 1.0;
  const rent1BR = Math.round(NATIONAL_MEDIAN_1BR * multiplier);
  
  return {
    rent1BR,
    rent2BR: Math.round(rent1BR * 1.35),
    rent3BR: Math.round(rent1BR * 1.75),
    rent4BR: Math.round(rent1BR * 2.1),
  };
}

async function generateCityData() {
  const places = await fetchCensusPlaces();
  
  if (places.length === 0) {
    console.error('No places data available');
    return [];
  }
  
  const cities = [];
  const seenIds = new Set();
  
  for (const place of places) {
    const stateCode = FIPS_TO_STATE[place.stateCode];
    if (!stateCode) continue;
    
    const stateName = STATE_NAMES[stateCode];
    if (!stateName) continue;
    
    // Include places with population >= 500 for max SEO coverage
    if (place.population < 500) continue;
    
    const stateRents = getStateRents(stateCode);
    const stateTax = STATE_TAX_RATES[stateCode] || { rate: 0, hasLocalTax: false };
    
    // Clean name and create ID
    const cleanName = place.name.replace(/ city$| town$| village$| CDP$/i, '').trim();
    const id = `${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${stateCode.toLowerCase()}`;
    
    if (seenIds.has(id)) continue;
    seenIds.add(id);
    
    // Population-based rent adjustment
    let rentMultiplier = 1.0;
    if (place.population > 1000000) rentMultiplier = 1.5;
    else if (place.population > 500000) rentMultiplier = 1.3;
    else if (place.population > 200000) rentMultiplier = 1.15;
    else if (place.population > 100000) rentMultiplier = 1.05;
    else if (place.population > 50000) rentMultiplier = 1.0;
    else if (place.population > 20000) rentMultiplier = 0.95;
    else if (place.population > 10000) rentMultiplier = 0.9;
    else rentMultiplier = 0.85;
    
    const baseCostIndex = (stateRents.rent1BR / NATIONAL_MEDIAN_1BR) * 100;
    const costIndex = Math.round(baseCostIndex * (0.85 + rentMultiplier * 0.3));
    
    cities.push({
      id,
      name: cleanName,
      state: stateName,
      stateCode,
      population: place.population,
      stateTaxRate: stateTax.rate,
      localTaxRate: 0,
      medianRent1BR: Math.round(stateRents.rent1BR * rentMultiplier),
      medianRent2BR: Math.round(stateRents.rent2BR * rentMultiplier),
      medianRent3BR: Math.round(stateRents.rent3BR * rentMultiplier),
      medianRent4BR: Math.round(stateRents.rent4BR * rentMultiplier),
      costIndex,
    });
  }
  
  // Sort by population
  cities.sort((a, b) => (b.population || 0) - (a.population || 0));
  
  return cities;
}

async function main() {
  console.log('🏙️  Fetching comprehensive US city data...\n');
  
  ensureDir(DATA_DIR);
  
  const cities = await generateCityData();
  
  if (cities.length === 0) {
    console.error('No cities generated');
    process.exit(1);
  }
  
  // Save full dataset
  const fullPath = path.join(DATA_DIR, 'cities-full.json');
  fs.writeFileSync(fullPath, JSON.stringify(cities, null, 2));
  console.log(`\n✅ Saved ${cities.length} cities to cities-full.json`);
  
  // Save compact version (top 500 for main calculator)
  const top500 = cities.slice(0, 500);
  const compactPath = path.join(DATA_DIR, 'cities.json');
  fs.writeFileSync(compactPath, JSON.stringify(top500, null, 2));
  console.log(`✅ Saved top ${top500.length} cities to cities.json`);
  
  // Save by state
  const byState = {};
  cities.forEach(city => {
    if (!byState[city.stateCode]) byState[city.stateCode] = [];
    byState[city.stateCode].push(city);
  });
  
  const statesPath = path.join(DATA_DIR, 'cities-by-state.json');
  fs.writeFileSync(statesPath, JSON.stringify(byState, null, 2));
  console.log(`✅ Saved cities by state to cities-by-state.json`);
  
  // Stats
  console.log('\n📊 Stats:');
  console.log(`   Total cities/places: ${cities.length.toLocaleString()}`);
  console.log(`   States covered: ${Object.keys(byState).length}`);
  console.log(`   Population > 100k: ${cities.filter(c => c.population > 100000).length}`);
  console.log(`   Population > 50k: ${cities.filter(c => c.population > 50000).length}`);
  console.log(`   Population > 10k: ${cities.filter(c => c.population > 10000).length}`);
  console.log(`   Population > 1k: ${cities.filter(c => c.population > 1000).length}`);
}

main().catch(console.error);
