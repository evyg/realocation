import { NextRequest, NextResponse } from 'next/server';
import { researchLocation, calculateComparison, LocationData } from '@/lib/perplexity';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for caching
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Cache duration: 7 days (location data doesn't change that fast)
const CACHE_DAYS = 7;

interface CachedLocation {
  id: string;
  location_key: string;
  data: LocationData;
  created_at: string;
}

async function getCachedLocation(locationKey: string): Promise<LocationData | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - CACHE_DAYS);

    const { data, error } = await supabase
      .from('location_cache')
      .select('*')
      .eq('location_key', locationKey.toLowerCase())
      .gte('created_at', cutoffDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return (data as CachedLocation).data;
  } catch {
    return null;
  }
}

async function cacheLocation(locationKey: string, data: LocationData): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    await supabase.from('location_cache').upsert({
      location_key: locationKey.toLowerCase(),
      data,
      created_at: new Date().toISOString(),
    }, {
      onConflict: 'location_key',
    });
  } catch (error) {
    console.error('Failed to cache location:', error);
  }
}

// Research a single location
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json(
      { error: 'Location parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Check cache first
    const cached = await getCachedLocation(location);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Research via Perplexity
    const data = await researchLocation(location);
    
    // Cache the result
    await cacheLocation(location, data);

    return NextResponse.json({
      success: true,
      data,
      cached: false,
    });
  } catch (error) {
    console.error('Research error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Research failed' },
      { status: 500 }
    );
  }
}

// Compare two locations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      origin, 
      destination, 
      salary, 
      bedrooms = '1BR',
      numAdults = 1,
      children = [] 
    } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Origin and destination are required' },
        { status: 400 }
      );
    }

    if (!salary || salary <= 0) {
      return NextResponse.json(
        { error: 'Valid salary is required' },
        { status: 400 }
      );
    }

    // Research both locations (with caching)
    const [originData, destData] = await Promise.all([
      getCachedLocation(origin).then(cached => 
        cached || researchLocation(origin).then(data => {
          cacheLocation(origin, data);
          return data;
        })
      ),
      getCachedLocation(destination).then(cached => 
        cached || researchLocation(destination).then(data => {
          cacheLocation(destination, data);
          return data;
        })
      ),
    ]);

    // Calculate comparison
    const comparison = calculateComparison(
      originData,
      destData,
      salary,
      bedrooms,
      numAdults,
      children
    );

    // Log the calculation for analytics
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('calculations').insert({
        salary,
        current_city: origin,
        top_cities: { destination, comparison: comparison.comparison },
      }).catch(() => {}); // Don't fail if logging fails
    }

    return NextResponse.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error('Comparison error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Comparison failed' },
      { status: 500 }
    );
  }
}
