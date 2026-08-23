import jsonLogic from 'json-logic-js';
import {
  CasteCategory,
  CategoryOverride,
  CitizenProfile,
  Scheme,
  EligibilityResult,
  QuantitativeGap,
} from '../types/scheme';

/**
 * Resolve a potentially per-category numeric limit to a concrete number.
 * If the limit is a plain number it applies to every category uniformly.
 * If it is a { default, SC?, ST?, OBC? } object, the citizen's category is
 * looked up first and falls back to `default`.
 */
function resolveCategoryLimit(
  limit: CategoryOverride<number> | undefined,
  category: CasteCategory,
): number | undefined {
  if (limit === undefined) return undefined;
  if (typeof limit === 'number') return limit;
  return limit[category] ?? limit.default;
}

import { TranslationSet } from './translations';

export class SchemeEngine {
  static astToText(ast: any): string {
    if (!ast || typeof ast !== 'object') return String(ast);

    const keys = Object.keys(ast);
    if (keys.length !== 1) return JSON.stringify(ast);

    const op = keys[0];
    const args = ast[op];

    if (op === '==' && Array.isArray(args) && args[0] === 1 && args[1] === 1) {
      return 'No specific categorical conditions apply';
    }

    if (op === 'and' && Array.isArray(args)) {
      return '(' + args.map(a => SchemeEngine.astToText(a)).join(' AND ') + ')';
    }

    if (op === 'or' && Array.isArray(args)) {
      return '(' + args.map(a => SchemeEngine.astToText(a)).join(' OR ') + ')';
    }

    if (Array.isArray(args) && args.length >= 2 && args[0]?.var) {
      let field = args[0].var;
      if (field === 'occupation') field = 'Occupation';
      else if (field === 'state') field = 'State';
      else if (field === 'isBPLCardHolder') field = 'BPL Status';
      else if (field === 'isDisabled') field = 'Disability Status';
      else if (field === 'casteCategory') field = 'Caste';
      else if (field === 'gender') field = 'Gender';
      else if (field === 'age') field = 'Age';

      let val = args[1];
      if (val === true) val = 'Yes';
      else if (val === false) val = 'No';
      else if (val === '') val = 'empty';
      else if (Array.isArray(val)) val = val.join(' or ');

      if (op === '==') return `${field} must be ${val}`;
      if (op === '!=') return `${field} must not be ${val}`;
      if (op === 'in') return `${field} must be ${val}`;
      if (op === '>=') return `${field} must be at least ${val}`;
      if (op === '<=') return `${field} must be at most ${val}`;
      if (op === '>') return `${field} must be greater than ${val}`;
      if (op === '<') return `${field} must be less than ${val}`;
    }

    return JSON.stringify(ast);
  }

  static evaluate(profile: CitizenProfile, scheme: Scheme, allSchemes: Scheme[] = [], t?: TranslationSet): EligibilityResult {
    const gaps: QuantitativeGap[] = [];

    // Helper to format fallback text
    const getFallbackText = (fieldLimit: keyof Scheme['numericLimits']): string => {
      if (!t || !scheme.fallbackSchemeIds.length) return '';
      const fallback = allSchemes.find(s => s.id === scheme.fallbackSchemeIds[0]);
      if (!fallback) return '';
      const limitVal = resolveCategoryLimit(fallback.numericLimits[fieldLimit], profile.casteCategory);
      if (limitVal === undefined) return '';
      return t.actionFallbackText
        .replace('{fallbackCode}', fallback.code)
        .replace('{fallbackLimit}', String(limitVal));
    };

    // Resolve category-aware limits
    const maxIncome = resolveCategoryLimit(scheme.numericLimits.maxIncome, profile.casteCategory);
    const maxLandholding = resolveCategoryLimit(scheme.numericLimits.maxLandholdingAcres, profile.casteCategory);
    const minAge = resolveCategoryLimit(scheme.numericLimits.minAge, profile.casteCategory);
    const maxAge = resolveCategoryLimit(scheme.numericLimits.maxAge, profile.casteCategory);

    // Evaluate quantitative limits
    if (maxIncome !== undefined && profile.annualIncome > maxIncome) {
      const delta = profile.annualIncome - maxIncome;
      gaps.push({
        field: 'annualIncome',
        actual: profile.annualIncome,
        required: maxIncome,
        delta,
        message: `Income exceeds maximum limit by ?${delta}`,
        actionable: t?.actionReduceIncome.replace('{delta}', String(delta)).replace('{fallbackText}', getFallbackText('maxIncome'))
      });
    }

    if (maxLandholding !== undefined && profile.landholdingAcres > maxLandholding) {
      const delta = +(profile.landholdingAcres - maxLandholding).toFixed(2);
      gaps.push({
        field: 'landholdingAcres',
        actual: profile.landholdingAcres,
        required: maxLandholding,
        delta,
        message: `Landholding exceeds maximum limit by ${delta} acres`,
        actionable: t?.actionReduceLand.replace('{delta}', String(delta)).replace('{fallbackText}', getFallbackText('maxLandholdingAcres'))
      });
    }

    if (minAge !== undefined && profile.age < minAge) {
      const delta = minAge - profile.age;
      gaps.push({
        field: 'age',
        actual: profile.age,
        required: minAge,
        delta,
        message: `Age is below minimum requirement by ${delta} years`,
        actionable: t?.actionIncreaseAge.replace('{delta}', String(delta)).replace('{fallbackText}', getFallbackText('minAge'))
      });
    }

    if (maxAge !== undefined && profile.age > maxAge) {
      const delta = profile.age - maxAge;
      gaps.push({
        field: 'age',
        actual: profile.age,
        required: maxAge,
        delta,
        message: `Age exceeds maximum limit by ${delta} years`,
        actionable: t?.actionReduceAge.replace('{delta}', String(delta)).replace('{fallbackText}', getFallbackText('maxAge'))
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