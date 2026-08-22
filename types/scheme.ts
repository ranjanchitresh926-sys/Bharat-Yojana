export type CasteCategory = 'General' | 'OBC' | 'SC' | 'ST';
export type Gender = 'Male' | 'Female' | 'Other';
export type SchemeLevel = 'Central' | 'State';

export interface CitizenProfile {
  age: number;
  annualIncome: number;
  casteCategory: CasteCategory;
  gender: Gender;
  occupation: string;
  state: string;
  landholdingAcres: number;
  isBPLCardHolder: boolean;
  isDisabled: boolean;
}

export interface QuantitativeGap {
  field: keyof CitizenProfile;
  actual: number;
  required: number;
  delta: number;
  message: string;
}

export interface SchemeLimits {
  maxIncome?: number;
  minAge?: number;
  maxAge?: number;
  maxLandholdingAcres?: number;
}

export interface Scheme {
  id: string;
  code: string;
  title: string;
  category: string;
  level: SchemeLevel;
  rulesAST: Record<string, any>;
  numericLimits: SchemeLimits;
  fallbackSchemeIds: string[];
}

export interface EligibilityResult {
  schemeId: string;
  isEligible: boolean;
  quantitativeGaps: QuantitativeGap[];
  suggestedFallbacks: string[];
}