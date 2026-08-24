import { Scheme } from '../types/scheme';

// ───
// Local Scheme Registry
//
// This is the single source of truth for scheme data served by
// `/api/schemes`. It is a curated, hand-verified set of eligibility rules
// compiled into the deterministic AST format the SchemeEngine evaluates.
//
// Honesty note: this data is NOT fetched live from data.gov.in or any
// external registry by default. Government open-data portals publish raw
// datasets, not machine-readable eligibility rule ASTs, so "real-time
// syncing" of eligibility logic from an open-data endpoint isn't something
// that can genuinely exist without a real data-sharing agreement. What CAN
// be real is an optional external augmentation feed (see
// app/api/schemes/route.ts) that merges additional schemes when one is
// actually configured. Bump REGISTRY_VERSION whenever this file changes.
// ───

export const REGISTRY_VERSION = '1.3.0';
export const REGISTRY_LAST_UPDATED = '2026-08-23';

export const SCHEME_DB: Scheme[] = [
  {
    id: 'scheme_1',
    code: 'PM-KISAN',
    title: 'Pradhan Mantri Kisan Samman Nidhi',
    category: 'Agriculture',
    level: 'Central',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    rulesAST: { '==': [{ var: 'occupation' }, 'Farmer'] },
    numericLimits: { maxLandholdingAcres: 4.94 },
    fallbackSchemeIds: ['scheme_3'],
  },
  {
    id: 'scheme_2',
    code: 'MP-KISAN-KALYAN',
    title: 'Mukhyamantri Kisan Kalyan Yojana',
    category: 'Agriculture',
    level: 'State',
    ministry: 'State Government Schemes',
    rulesAST: {
      and: [
        { '==': [{ var: 'occupation' }, 'Farmer'] },
        { '==': [{ var: 'state' }, 'Madhya Pradesh'] },
      ],
    },
    numericLimits: { maxLandholdingAcres: 10.0 },
    fallbackSchemeIds: ['scheme_1'],
  },
  {
    id: 'scheme_3',
    code: 'PM-FASAL-BIMA',
    title: 'Pradhan Mantri Fasal Bima Yojana',
    category: 'Agriculture',
    level: 'Central',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    rulesAST: { '==': [{ var: 'occupation' }, 'Farmer'] },
    numericLimits: { maxLandholdingAcres: 25.0 },
    fallbackSchemeIds: ['scheme_1'],
  },
  // Source: https://www.pmuy.gov.in/about.html
  // SC/ST women are auto-eligible as a priority category without BPL card.
  // No separate income ceiling is applied once a citizen qualifies via BPL
  // status or SC/ST category — matching the AST, not contradicting it (see
  // AYUSHMAN-BHARAT below for the same pattern).
  {
    id: 'scheme_4',
    code: 'PM-UJJWALA',
    title: 'Pradhan Mantri Ujjwala Yojana',
    category: 'Financial Inclusion',
    level: 'Central',
    ministry: 'Ministry of Petroleum and Natural Gas',
    rulesAST: {
      and: [
        { '==': [{ var: 'gender' }, 'Female'] },
        { or: [
          { '==': [{ var: 'isBPLCardHolder' }, true] },
          { in: [{ var: 'casteCategory' }, ['SC', 'ST']] },
        ]},
      ],
    },
    numericLimits: { minAge: 18 },
    fallbackSchemeIds: ['scheme_5'],
  },
  // Source: https://pmayg.nic.in/
  // SC/ST households have 60% reserved allocation; PwD households are
  // also prioritised in beneficiary selection. As with PM-UJJWALA, no
  // separate income ceiling is applied once a citizen qualifies via BPL,
  // SC/ST category, or disability — the AST already gates on those.
  {
    id: 'scheme_5',
    code: 'PM-AWAS-GRAMIN',
    title: 'Pradhan Mantri Awas Yojana - Gramin',
    category: 'Housing',
    level: 'Central',
    ministry: 'Ministry of Rural Development',
    rulesAST: {
      or: [
        { '==': [{ var: 'isBPLCardHolder' }, true] },
        { in: [{ var: 'casteCategory' }, ['SC', 'ST']] },
        { '==': [{ var: 'isDisabled' }, true] },
      ],
    },
    numericLimits: {},
    fallbackSchemeIds: [],
  },
  {
    id: 'scheme_6',
    code: 'PMJDY',
    title: 'Pradhan Mantri Jan Dhan Yojana',
    category: 'Financial Inclusion',
    level: 'Central',
    ministry: 'Ministry of Finance',
    rulesAST: { '>=': [{ var: 'age' }, 10] },
    numericLimits: { minAge: 10, maxAge: 65 },
    fallbackSchemeIds: [],
  },
  {
    id: 'scheme_7',
    code: 'PM-SVANidhi',
    title: "PM Street Vendor's AtmaNirbhar Nidhi",
    category: 'Financial Inclusion',
    level: 'Central',
    ministry: 'Ministry of Housing & Urban Affairs',
    rulesAST: {
      and: [
        { '==': [{ var: 'occupation' }, 'Street Vendor'] },
        { '>=': [{ var: 'age' }, 18] },
      ],
    },
    numericLimits: { minAge: 18, maxAge: 65 },
    fallbackSchemeIds: ['scheme_6'],
  },
  {
    id: 'scheme_8',
    code: 'PMSBY',
    title: 'Pradhan Mantri Suraksha Bima Yojana',
    category: 'Insurance',
    level: 'Central',
    ministry: 'Ministry of Finance',
    rulesAST: {
      and: [
        { '>=': [{ var: 'age' }, 18] },
        { '<=': [{ var: 'age' }, 70] },
      ],
    },
    numericLimits: { minAge: 18, maxAge: 70 },
    fallbackSchemeIds: [],
  },
  {
    id: 'scheme_9',
    code: 'PM-MUDRA',
    title: 'Pradhan Mantri MUDRA Yojana',
    category: 'Financial Inclusion',
    level: 'Central',
    ministry: 'Ministry of Finance',
    rulesAST: {
      and: [
        { '>=': [{ var: 'age' }, 18] },
        { '!=': [{ var: 'occupation' }, ''] },
      ],
    },
    numericLimits: { minAge: 18, maxIncome: 1000000 },
    fallbackSchemeIds: ['scheme_6'],
  },
  {
    id: 'scheme_10',
    code: 'SUKANYA-SAMRIDDHI',
    title: 'Sukanya Samriddhi Yojana',
    category: 'Women & Child Development',
    level: 'Central',
    ministry: 'Ministry of Women & Child Development',
    rulesAST: { '==': [{ var: 'gender' }, 'Female'] },
    numericLimits: { maxAge: 10 },
    fallbackSchemeIds: [],
  },
  {
    id: 'scheme_11',
    code: 'PM-KAUSHAL',
    title: 'Pradhan Mantri Kaushal Vikas Yojana',
    category: 'Education',
    level: 'Central',
    ministry: 'Ministry of Skill Development and Entrepreneurship',
    rulesAST: {
      and: [
        { '>=': [{ var: 'age' }, 15] },
        { '<=': [{ var: 'age' }, 45] },
      ],
    },
    numericLimits: { minAge: 15, maxAge: 45 },
    fallbackSchemeIds: [],
  },
  // Source: https://mera.pmjay.gov.in/
  // SC/ST households are auto-included under SECC 2011 deprivation
  // criterion D5, bypassing the BPL / income requirement.
  {
    id: 'scheme_12',
    code: 'AYUSHMAN-BHARAT',
    title: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
    category: 'Healthcare',
    level: 'Central',
    ministry: 'Ministry of Health & Family Welfare',
    rulesAST: {
      or: [
        { '==': [{ var: 'isBPLCardHolder' }, true] },
        { in: [{ var: 'casteCategory' }, ['SC', 'ST']] },
      ],
    },
    numericLimits: {},
    fallbackSchemeIds: ['scheme_5'],
  },
  // Source: https://dsel.education.gov.in/nmmss
  // Education scheme for students whose parental income is not more than ₹3,50,000.
  {
    id: 'scheme_13',
    code: 'NMMSS',
    title: 'National Means-cum-Merit Scholarship Scheme',
    category: 'Education',
    level: 'Central',
    ministry: 'Ministry of Education',
    rulesAST: { '==': [{ var: 'occupation' }, 'Student'] },
    numericLimits: { maxIncome: 350000 },
    fallbackSchemeIds: [],
  },
  // Source: https://www.aicte-india.org/schemes/students-development-schemes/Pragati
  // Scholarship for girl students in AICTE institutions; family income <= ₹8,00,000.
  {
    id: 'scheme_14',
    code: 'PRAGATI',
    title: 'AICTE Pragati Scholarship for Girls',
    category: 'Education',
    level: 'Central',
    ministry: 'Ministry of Education',
    rulesAST: {
      and: [
        { '==': [{ var: 'gender' }, 'Female'] },
        { '==': [{ var: 'occupation' }, 'Student'] },
      ],
    },
    numericLimits: { maxIncome: 800000 },
    fallbackSchemeIds: ['scheme_10'],
  },
  // Source: https://nsap.nic.in/guidelines.html
  // Old age pension for BPL citizens aged 60 and above.
  {
    id: 'scheme_15',
    code: 'IGNOAPS',
    title: 'Indira Gandhi National Old Age Pension Scheme',
    category: 'Senior Citizen',
    level: 'Central',
    ministry: 'Ministry of Rural Development',
    rulesAST: { '==': [{ var: 'isBPLCardHolder' }, true] },
    numericLimits: { minAge: 60 },
    fallbackSchemeIds: [],
  },
  // Source: https://nsap.nic.in/guidelines.html
  // Pension for BPL citizens with severe/multiple disabilities, aged 18+.
  {
    id: 'scheme_16',
    code: 'IGNDPS',
    title: 'Indira Gandhi National Disability Pension Scheme',
    category: 'Disability',
    level: 'Central',
    ministry: 'Ministry of Rural Development',
    rulesAST: {
      and: [
        { '==': [{ var: 'isBPLCardHolder' }, true] },
        { '==': [{ var: 'isDisabled' }, true] },
      ],
    },
    numericLimits: { minAge: 18 },
    fallbackSchemeIds: [],
  },
  // Source: https://www.standupmitra.in/
  // Bank loans between ₹10 lakh and ₹1 Crore to at least one SC/ST or woman borrower.
  {
    id: 'scheme_17',
    code: 'STAND-UP-INDIA',
    title: 'Stand-Up India Scheme',
    category: 'MSME',
    level: 'Central',
    ministry: 'Ministry of Finance',
    rulesAST: {
      or: [
        { in: [{ var: 'casteCategory' }, ['SC', 'ST']] },
        { '==': [{ var: 'gender' }, 'Female'] },
      ],
    },
    numericLimits: { minAge: 18 },
    fallbackSchemeIds: ['scheme_9'],
  },
  // Source: https://msme.gov.in/11-prime-ministers-employment-generation-programme-pmegp
  // Credit-linked subsidy programme for generating employment; above 18 years.
  {
    id: 'scheme_18',
    code: 'PMEGP',
    title: "Prime Minister's Employment Generation Programme",
    category: 'MSME',
    level: 'Central',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    rulesAST: { '==': [1, 1] },
    numericLimits: { minAge: 18 },
    fallbackSchemeIds: ['scheme_9'],
  },
  // Source: https://www.jeevandayee.gov.in/
  // Health insurance for Maharashtra residents.
  {
    id: 'scheme_19',
    code: 'MJPJAY',
    title: 'Mahatma Jyotirao Pule Jan Arogya Yojana',
    category: 'Healthcare',
    level: 'State',
    ministry: 'State Government Schemes',
    rulesAST: { '==': [{ var: 'state' }, 'Maharashtra'] },
    numericLimits: {},
    fallbackSchemeIds: ['scheme_12'],
  },
  // Source: https://mksy.up.gov.in/women_welfare/index.php
  // Conditional cash transfer for the girl child in Uttar Pradesh; max income ₹3 lakh.
  {
    id: 'scheme_20',
    code: 'MKSY',
    title: 'Mukhyamantri Kanya Sumangala Yojana',
    category: 'Women & Child Development',
    level: 'State',
    ministry: 'State Government Schemes',
    rulesAST: {
      and: [
        { '==': [{ var: 'state' }, 'Uttar Pradesh'] },
        { '==': [{ var: 'gender' }, 'Female'] },
      ],
    },
    numericLimits: { maxIncome: 300000 },
    fallbackSchemeIds: ['scheme_10'],
  },
  // Source: https://disabilityaffairs.gov.in/content/page/adip.php
  // Assistance to disabled persons for purchase of aids. Monthly income <= ₹30,000.
  {
    id: 'scheme_21',
    code: 'ADIP',
    title: 'Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances',
    category: 'Disability',
    level: 'Central',
    ministry: 'Ministry of Social Justice and Empowerment',
    rulesAST: { '==': [{ var: 'isDisabled' }, true] },
    numericLimits: { maxIncome: 360000 },
    fallbackSchemeIds: [],
  },
  // Source: https://state.bihar.gov.in/sspmis/
  // Old age pension for Bihar residents aged 60 and above.
  {
    id: 'scheme_22',
    code: 'MVPY',
    title: 'Mukhyamantri Vriddhjan Pension Yojana',
    category: 'Senior Citizen',
    level: 'State',
    ministry: 'State Government Schemes',
    rulesAST: { '==': [{ var: 'state' }, 'Bihar'] },
    numericLimits: { minAge: 60 },
    fallbackSchemeIds: ['scheme_15'],
  },
];
