export type CasteCategory = 'General' | 'OBC' | 'SC' | 'ST';
export type Gender = 'Male' | 'Female' | 'Other';
export type SchemeLevel = 'Central' | 'State';
export type Role = 'citizen' | 'officer' | 'admin';

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
  actionable?: string;
}

/**
 * Per-category override: if the citizen's category matches a key, that value
 * is used instead of the top-level default. When a plain number is given the
 * limit applies uniformly to all categories.
 */
export type CategoryOverride<T> = T | {
  default: T;
  General?: T;
  SC?: T;
  ST?: T;
  OBC?: T;
};

export interface SchemeLimits {
  maxIncome?: CategoryOverride<number>;
  minAge?: CategoryOverride<number>;
  maxAge?: CategoryOverride<number>;
  maxLandholdingAcres?: CategoryOverride<number>;
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

export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Verified' | 'Approved' | 'Rejected';

export interface Application {
  id: string;
  citizenId?: string;
  schemeId: string; // The scheme code or id
  schemeTitle: string;
  profileSnapshot: CitizenProfile;
  status: ApplicationStatus;
  rejectionReason?: string;
  submittedAt: string;
  updatedAt: string;
}