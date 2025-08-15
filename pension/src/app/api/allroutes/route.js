import { NextResponse } from 'next/server';
import pensionDB from '../../../../PensionDB.json';
import { calculatePensionsForSchemes, getPensionInsights } from '@/lib/pensionCalculator';

// GET /api/allroutes?countries=India,Japan&age=30&annualSalary=600000
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Accept multiple forms: ?countries=India,Japan or ?countries=India&countries=Japan
    // Also accept a single fallback key: ?country=India
    let countriesParam = searchParams.getAll('countries');
    if (countriesParam.length === 0) {
      const single = searchParams.get('country');
      if (single) {
        countriesParam = [single];
      }
    }

    if (countriesParam.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required parameter: countries (use comma-separated or repeated params)',
          examples: [
            '/api/allroutes?countries=India,Japan',
            '/api/allroutes?countries=USA&countries=UK'
          ]
        },
        { status: 400 }
      );
    }

    // Normalize and flatten countries
    const normalizedCountries = countriesParam
      .flatMap(entry => String(entry).split(','))
      .map(s => s.trim())
      .filter(Boolean);

    if (normalizedCountries.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No valid country names provided after parsing the "countries" parameter'
        },
        { status: 400 }
      );
    }

    const countriesLower = new Set(normalizedCountries.map(c => c.toLowerCase()));

    // Filter dataset by selected countries (case-insensitive)
    const filteredSchemes = pensionDB.filter(s =>
      s.country && countriesLower.has(String(s.country).toLowerCase())
    );

    if (filteredSchemes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No schemes found for the requested countries',
          requestedCountries: normalizedCountries
        },
        { status: 404 }
      );
    }

    // Optional user inputs for calculations
    const ageStr = searchParams.get('age');
    const annualSalaryStr = searchParams.get('annualSalary');
    const age = ageStr ? parseInt(ageStr, 10) : undefined;
    const annualSalary = annualSalaryStr ? parseInt(annualSalaryStr, 10) : undefined;

    // If age and salary provided, enrich with calculations and insights
    if (Number.isFinite(age) && Number.isFinite(annualSalary)) {
      const schemesWithPensions = calculatePensionsForSchemes(filteredSchemes, {
        age,
        annualSalary,
        monthlySalary: Math.round(annualSalary / 12)
      });

      const insights = getPensionInsights(schemesWithPensions, {
        age,
        annualSalary
      });

      return NextResponse.json({
        success: true,
        message: 'Schemes fetched and calculations computed successfully',
        countries: normalizedCountries,
        userProfile: {
          age,
          annualSalary,
          monthlySalary: Math.round(annualSalary / 12)
        },
        totalSchemes: schemesWithPensions.length,
        schemes: schemesWithPensions,
        pensionInsights: insights,
        timestamp: new Date().toISOString()
      });
    }

    // Otherwise, return just the filtered schemes without calculations
    return NextResponse.json({
      success: true,
      message: 'Schemes fetched successfully',
      countries: normalizedCountries,
      totalSchemes: filteredSchemes.length,
      schemes: filteredSchemes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in allroutes GET:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch schemes',
        error: error.message
      },
      { status: 500 }
    );
  }
}


