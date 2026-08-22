import jsonLogic from 'json-logic-js';
import { CitizenProfile, Scheme, EligibilityResult, QuantitativeGap } from '../types/scheme';

export class SchemeEngine {
  static evaluate(profile: CitizenProfile, scheme: Scheme): EligibilityResult {
    const gaps: QuantitativeGap[] = [];

    // Evaluate quantitative limits
    if (scheme.numericLimits.maxIncome !== undefined && profile.annualIncome > scheme.numericLimits.maxIncome) {
      gaps.push({
        field: 'annualIncome',
        actual: profile.annualIncome,
        required: scheme.numericLimits.maxIncome,
        delta: profile.annualIncome - scheme.numericLimits.maxIncome,
        message: `Income exceeds maximum limit by ₹${profile.annualIncome - scheme.numericLimits.maxIncome}`
      });
    }

    if (scheme.numericLimits.maxLandholdingAcres !== undefined && profile.landholdingAcres > scheme.numericLimits.maxLandholdingAcres) {
      gaps.push({
        field: 'landholdingAcres',
        actual: profile.landholdingAcres,
        required: scheme.numericLimits.maxLandholdingAcres,
        delta: profile.landholdingAcres - scheme.numericLimits.maxLandholdingAcres,
        message: `Landholding exceeds maximum limit by ${profile.landholdingAcres - scheme.numericLimits.maxLandholdingAcres} acres`
      });
    }

    if (scheme.numericLimits.minAge !== undefined && profile.age < scheme.numericLimits.minAge) {
      gaps.push({
        field: 'age',
        actual: profile.age,
        required: scheme.numericLimits.minAge,
        delta: scheme.numericLimits.minAge - profile.age,
        message: `Age is below minimum requirement by ${scheme.numericLimits.minAge - profile.age} years`
      });
    }

    if (scheme.numericLimits.maxAge !== undefined && profile.age > scheme.numericLimits.maxAge) {
      gaps.push({
        field: 'age',
        actual: profile.age,
        required: scheme.numericLimits.maxAge,
        delta: profile.age - scheme.numericLimits.maxAge,
        message: `Age exceeds maximum limit by ${profile.age - scheme.numericLimits.maxAge} years`
      });
    }

    // Evaluate AST boolean logic
    // json-logic-js applies rules on the given data object
    const astResult = jsonLogic.apply(scheme.rulesAST, profile as unknown as Record<string, unknown>);

    const isEligible = astResult === true && gaps.length === 0;

    return {
      schemeId: scheme.id,
      isEligible,
      quantitativeGaps: gaps,
      suggestedFallbacks: isEligible ? [] : scheme.fallbackSchemeIds
    };
  }
}