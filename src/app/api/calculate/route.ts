import { NextRequest, NextResponse } from 'next/server';
import { compareCities, getCityById } from '@/lib/calculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salary, currentCityId, bedrooms = '1br' } = body;
    
    // Validate inputs
    if (!salary || typeof salary !== 'number' || salary <= 0) {
      return NextResponse.json(
        { error: 'Invalid salary. Must be a positive number.' },
        { status: 400 }
      );
    }
    
    if (!currentCityId || typeof currentCityId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid city ID.' },
        { status: 400 }
      );
    }
    
    const city = getCityById(currentCityId);
    if (!city) {
      return NextResponse.json(
        { error: 'City not found.' },
        { status: 404 }
      );
    }
    
    // Calculate results
    const results = compareCities(salary, currentCityId, bedrooms);
    
    return NextResponse.json({
      success: true,
      data: {
        salary,
        currentCity: results.currentCity,
        rankedCities: results.rankedCities,
        betterCitiesCount: results.rankedCities.filter(r => r.differenceFromCurrent > 0).length,
      },
    });
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'An error occurred during calculation.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to calculate results',
    example: {
      salary: 150000,
      currentCityId: 'san-francisco-ca',
      bedrooms: '1br',
    },
  });
}
