import { Scheme } from '../types/scheme';

export const SCHEME_DB: Scheme[] = [
  {
    id: 'scheme_1',
    code: 'PM-KISAN',
    title: 'Pradhan Mantri Kisan Samman Nidhi',
    category: 'Agriculture',
    level: 'Central',
    rulesAST: {
      "==": [{ "var": "occupation" }, "Farmer"]
    },
    numericLimits: {
      maxLandholdingAcres: 4.94
    },
    fallbackSchemeIds: ['scheme_2']
  },
  {
    id: 'scheme_2',
    code: 'MP-KISAN-KALYAN',
    title: 'Mukhyamantri Kisan Kalyan Yojana',
    category: 'Agriculture',
    level: 'State',
    rulesAST: {
      "and": [
        { "==": [{ "var": "occupation" }, "Farmer"] },
        { "==": [{ "var": "state" }, "Madhya Pradesh"] }
      ]
    },
    numericLimits: {
      maxLandholdingAcres: 10.0
    },
    fallbackSchemeIds: []
  }
];
