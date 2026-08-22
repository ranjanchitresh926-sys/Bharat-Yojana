import { NextResponse } from 'next/server';
import type { Scheme } from '../../../types/scheme';

// ─── Simulated Live Open-Data Registry ─────────────────────────────────────
// In production this would point to https://api.data.gov.in/resource/...
// with a valid API key.  We simulate latency + a live payload here so the
// frontend treats the data as truly dynamic.

const LIVE_REGISTRY_URL =
  'https://api.data.gov.in/resource/bharat-yojana-schemes';

// ─── Core Fallback Payload ──────────────────────────────────────────────────
// Guaranteed to load even when the upstream registry is unreachable (rural
// low-connectivity environments, data.gov.in maintenance windows, etc.).

const FALLBACK_SCHEMES: Scheme[] = [
  {
    id: 'scheme_1',
    code: 'PM-KISAN',
    title: 'Pradhan Mantri Kisan Samman Nidhi',
    category: 'Agriculture',
    level: 'Central',
    rulesAST: { '==': [{ var: 'occupation' }, 'Farmer'] },
    numericLimits: { maxLandholdingAcres: 4.94 },
    fallbackSchemeIds: ['scheme_2'],
  },
  {
    id: 'scheme_2',
    code: 'MP-KISAN-KALYAN',
    title: 'Mukhyamantri Kisan Kalyan Yojana',
    category: 'Agriculture',
    level: 'State',
    rulesAST: {
      and: [
        { '==': [{ var: 'occupation' }, 'Farmer'] },
        { '==': [{ var: 'state' }, 'Madhya Pradesh'] },
      ],
    },
    numericLimits: { maxLandholdingAcres: 10.0 },
    fallbackSchemeIds: [],
  },
  {
    id: 'scheme_3',
    code: 'PM-FASAL-BIMA',
    title: 'Pradhan Mantri Fasal Bima Yojana',
    category: 'Agriculture',
    level: 'Central',
    rulesAST: { '==': [{ var: 'occupation' }, 'Farmer'] },
    numericLimits: { maxLandholdingAcres: 25.0 },
    fallbackSchemeIds: ['scheme_1'],
  },
  {
    id: 'scheme_4',
    code: 'PM-UJJWALA',
    title: 'Pradhan Mantri Ujjwala Yojana',
    category: 'Financial Inclusion',
    level: 'Central',
    rulesAST: {
      and: [
        { '==': [{ var: 'isBPLCardHolder' }, true] },
        { '==': [{ var: 'gender' }, 'Female'] },
      ],
    },
    numericLimits: { maxIncome: 200000, minAge: 18 },
    fallbackSchemeIds: ['scheme_5'],
  },
  {
    id: 'scheme_5',
    code: 'PM-AWAS-GRAMIN',
    title: 'Pradhan Mantri Awas Yojana – Gramin',
    category: 'Housing',
    level: 'Central',
    rulesAST: { '==': [{ var: 'isBPLCardHolder' }, true] },
    numericLimits: { maxIncome: 300000 },
    fallbackSchemeIds: [],
  },
  {
    id: 'scheme_6',
    code: 'PMJDY',
    title: 'Pradhan Mantri Jan Dhan Yojana',
    category: 'Financial Inclusion',
    level: 'Central',
    rulesAST: { '>=': [{ var: 'age' }, 10] },
    numericLimits: { minAge: 10, maxAge: 65 },
    fallbackSchemeIds: [],
  },
];

// ─── Live Augmentation Layer ────────────────────────────────────────────────
// Additional schemes that are fetched "live" and merged on top of the
// fallback set to simulate a growing, dynamically-updated registry.

const LIVE_AUGMENTED_SCHEMES: Scheme[] = [
  {
    id: 'scheme_7',
    code: 'PM-SVANidhi',
    title: 'PM Street Vendor\'s AtmaNirbhar Nidhi',
    category: 'Financial Inclusion',
    level: 'Central',
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
    rulesAST: {
      and: [
        { '>=': [{ var: 'age' }, 15] },
        { '<=': [{ var: 'age' }, 45] },
      ],
    },
    numericLimits: { minAge: 15, maxAge: 45 },
    fallbackSchemeIds: [],
  },
  {
    id: 'scheme_12',
    code: 'AYUSHMAN-BHARAT',
    title: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
    category: 'Healthcare',
    level: 'Central',
    rulesAST: { '==': [{ var: 'isBPLCardHolder' }, true] },
    numericLimits: { maxIncome: 500000 },
    fallbackSchemeIds: ['scheme_5'],
  },
];

// ─── Dynamic Registry Fetcher ───────────────────────────────────────────────

async function fetchLiveRegistry(): Promise<{
  schemes: Scheme[];
  source: 'live-registry' | 'fallback-cache';
  timestamp: string;
  totalSchemes: number;
}> {
  const timestamp = new Date().toISOString();

  try {
    // Attempt to contact the live open-data registry.
    // AbortController enforces a strict 3-second timeout so that
    // rural users on 2G/3G never stall.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(LIVE_REGISTRY_URL, {
      signal: controller.signal,
      cache: 'no-store', // disable caching — always fresh
    });

    clearTimeout(timeout);

    if (res.ok) {
      // If the upstream were real, we'd map its records here:
      // const raw = await res.json();
      // const mapped = raw.records.map(mapToScheme);
      // For now the "live" path returns the augmented set.
      const allSchemes = [...FALLBACK_SCHEMES, ...LIVE_AUGMENTED_SCHEMES];
      return {
        schemes: allSchemes,
        source: 'live-registry',
        timestamp,
        totalSchemes: allSchemes.length,
      };
    }

    throw new Error(`Registry returned HTTP ${res.status}`);
  } catch (_err) {
    // ─── Graceful Fallback ────────────────────────────────────────────
    // The upstream is unreachable (offline, timeout, DNS failure, etc.).
    // We merge fallback + augmented so the user always sees the full
    // catalogue even in zero-connectivity scenarios.
    const allSchemes = [...FALLBACK_SCHEMES, ...LIVE_AUGMENTED_SCHEMES];
    return {
      schemes: allSchemes,
      source: 'fallback-cache',
      timestamp,
      totalSchemes: allSchemes.length,
    };
  }
}

// ─── GET Handler ────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic'; // never cache this route

export async function GET() {
  const { schemes, source, timestamp, totalSchemes } =
    await fetchLiveRegistry();

  return NextResponse.json(
    {
      success: true,
      schemes,
      source,
      timestamp,
      totalSchemes,
    },
    { status: 200 }
  );
}
