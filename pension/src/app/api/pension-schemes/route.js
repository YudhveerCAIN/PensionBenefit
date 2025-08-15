import { NextResponse } from 'next/server';
import pensionSchemesData from '../../../../PensionDB.json';
import { calculatePensionsForSchemes, getPensionInsights } from '@/lib/pensionCalculator';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const age = parseInt(searchParams.get('age'));
    const origin = searchParams.get('origin');
    const annualSalary = parseInt(searchParams.get('annualSalary'));

    // Validate required parameters
    if (!age || !origin || !annualSalary) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required parameters: age, origin, and annualSalary are required',
          requiredParams: ['age', 'origin', 'annualSalary']
        },
        { status: 400 }
      );
    }

    // Validate age
    if (age < 0 || age > 120) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid age: Age must be between 0 and 120'
        },
        { status: 400 }
      );
    }

    // Validate origin (for now, only India is supported)
    if (origin.toLowerCase() !== 'india') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid origin: Only India is currently supported'
        },
        { status: 400 }
      );
    }

    // Validate annual salary
    if (annualSalary < 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid annual salary: Salary must be positive'
        },
        { status: 400 }
      );
    }

    // Filter schemes based on eligibility criteria
    const eligibleSchemes = pensionSchemesData.filter(scheme => {
      // Check age eligibility
      const minAge = scheme.eligibility_age_min;
      const maxAge = scheme.eligibility_age_max;
      
      let ageEligible = true;
      if (minAge !== undefined && minAge !== null && minAge !== '') {
        ageEligible = age >= minAge;
      }
      if (maxAge !== undefined && maxAge !== null && maxAge !== '') {
        ageEligible = ageEligible && age <= maxAge;
      }

      // Check income criteria for schemes that have income limits
      let incomeEligible = true;
      const incomeCriteria = scheme.income_criteria?.toLowerCase() || '';
      
      if (incomeCriteria.includes('bpl') || incomeCriteria.includes('below poverty line')) {
        // For BPL schemes, assume salary should be low (you can adjust this threshold)
        incomeEligible = annualSalary <= 300000; // 3 lakhs per annum as BPL threshold
      }
      
      if (incomeCriteria.includes('income cap') || incomeCriteria.includes('threshold')) {
        // For schemes with income caps, check if salary is within limits
        // This is a simplified check - you might want to add more specific logic
        incomeEligible = annualSalary <= 500000; // 5 lakhs per annum as general threshold
      }

      // Check for specific scheme eligibility
      let schemeSpecificEligible = true;
      
      // NPS Tier I - available for all
      if (scheme.scheme_id === 'NPS_Tier_I') {
        schemeSpecificEligible = age >= 18 && age <= 70;
      }
      
      // APY - for unorganized sector, age 18-40
      if (scheme.scheme_id === 'APY') {
        schemeSpecificEligible = age >= 18 && age <= 40;
      }
      
      // PM-SYM - for unorganized workers, age 18-40
      if (scheme.scheme_id === 'PM_SYM') {
        schemeSpecificEligible = age >= 18 && age <= 40;
      }
      
      // PMKMY - for farmers, age 18-40
      if (scheme.scheme_id === 'PMKMY') {
        schemeSpecificEligible = age >= 18 && age <= 40;
      }
      
      // PM-LVM - for traders, age 18-40
      if (scheme.scheme_id === 'PM_LVM') {
        schemeSpecificEligible = age >= 18 && age <= 40;
      }
      
      // IGNOAPS - for senior citizens 60+
      if (scheme.scheme_id === 'NSAP_IGNOAPS') {
        schemeSpecificEligible = age >= 60;
      }
      
      // SCSS - for senior citizens 60+
      if (scheme.scheme_id === 'SCSS') {
        schemeSpecificEligible = age >= 60;
      }
      
      // PMVVY - for senior citizens 60+
      if (scheme.scheme_id === 'PMVVY') {
        schemeSpecificEligible = age >= 60;
      }

      return ageEligible && incomeEligible && schemeSpecificEligible;
    });

    // Add relevance score and recommendations
    const schemesWithRecommendations = eligibleSchemes.map(scheme => {
      let relevanceScore = 0;
      let recommendation = '';

      // Score based on age appropriateness
      if (age >= 18 && age <= 40) {
        if (['APY', 'PM_SYM', 'PMKMY', 'PM_LVM', 'NPS_Tier_I'].includes(scheme.scheme_id)) {
          relevanceScore += 3;
          recommendation = 'Excellent for long-term retirement planning';
        }
      } else if (age >= 41 && age <= 59) {
        if (['NPS_Tier_I', 'EPF', 'EPS'].includes(scheme.scheme_id)) {
          relevanceScore += 3;
          recommendation = 'Good for mid-career retirement planning';
        }
      } else if (age >= 60) {
        if (['NSAP_IGNOAPS', 'SCSS', 'PMVVY'].includes(scheme.scheme_id)) {
          relevanceScore += 3;
          recommendation = 'Suitable for immediate pension benefits';
        }
      }

      // Score based on salary level
      if (annualSalary <= 300000) {
        if (['APY', 'PM_SYM', 'PMKMY', 'PM_LVM', 'NSAP_IGNOAPS'].includes(scheme.scheme_id)) {
          relevanceScore += 2;
        }
      } else if (annualSalary <= 1000000) {
        if (['NPS_Tier_I', 'EPF', 'EPS'].includes(scheme.scheme_id)) {
          relevanceScore += 2;
        }
      } else {
        if (['NPS_Tier_I', 'SCSS', 'PMVVY'].includes(scheme.scheme_id)) {
          relevanceScore += 2;
        }
      }

      // Score based on sector
      if (scheme.sector === 'All') {
        relevanceScore += 1;
      }

      return {
        ...scheme,
        relevanceScore,
        recommendation: recommendation || 'Consider based on your specific needs',
        eligibility: {
          ageEligible: true,
          incomeEligible: true,
          sectorEligible: true
        }
      };
    });

         // Sort by relevance score (highest first)
     schemesWithRecommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
 
     // Calculate pension amounts for each scheme
     const schemesWithPensions = calculatePensionsForSchemes(schemesWithRecommendations, {
       age,
       annualSalary,
       monthlySalary: Math.round(annualSalary / 12)
     });
 
     // Get pension insights and recommendations
     const insights = getPensionInsights(schemesWithPensions, {
       age,
       annualSalary
     });
 
     return NextResponse.json({
       success: true,
       message: 'Pension schemes retrieved successfully',
       userProfile: {
         age,
         origin,
         annualSalary,
         monthlySalary: Math.round(annualSalary / 12)
       },
       totalSchemes: schemesWithPensions.length,
       schemes: schemesWithPensions,
       pensionInsights: insights,
       timestamp: new Date().toISOString()
     });

  } catch (error) {
    console.error('Error fetching pension schemes:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch pension schemes',
        error: error.message
      },
      { status: 500 }
    );
  }
}
