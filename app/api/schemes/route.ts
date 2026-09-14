import { NextResponse } from 'next/server';
import type { Scheme } from '../../../types/scheme';
import { REGISTRY_VERSION, REGISTRY_LAST_UPDATED } from '../../../lib/seedData';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 
// Scheme Registry Endpoint
//
// Default behaviour (no configuration required): serves the curated local
// scheme registry from the database. This is honest - we do NOT pretend
// to hit a live government API we don't actually have access to.
//
// Optional real live augmentation: if EXTERNAL_SCHEME_FEED_URL is set in
// the environment, this route genuinely attempts to fetch additional
// schemes from that URL (with a timeout) and merges any that pass basic
// shape validation. If the env var is unset, no network call is made at
// all - there is nothing fake happening under the hood either way.
// 

export const dynamic = 'force-dynamic';

type RegistrySource = 'local-registry' | 'external-feed' | 'external-feed-unavailable';

function isValidScheme(x: any): x is Scheme {
  return (
    x &&
    typeof x.id === 'string' &&
    typeof x.code === 'string' &&
    typeof x.title === 'string' &&
    typeof x.category === 'string' &&
    (x.level === 'Central' || x.level === 'State') &&
    typeof x.rulesAST === 'object' &&
    typeof x.numericLimits === 'object' &&
    Array.isArray(x.fallbackSchemeIds)
  );
}

async function getLocalSchemes(): Promise<Scheme[]> {
  const dbSchemes = await prisma.scheme.findMany();
  return dbSchemes.map(s => ({
    id: s.id,
    code: s.code,
    title: s.title,
    category: s.category,
    level: s.level as 'Central' | 'State',
    ministry: s.ministry,
    rulesAST: JSON.parse(s.rulesAST),
    numericLimits: JSON.parse(s.numericLimits),
    fallbackSchemeIds: JSON.parse(s.fallbackSchemeIds),
  }));
}

async function loadSchemes(): Promise<{
  schemes: Scheme[];
  source: RegistrySource;
  externalFeedError?: string;
}> {
  const localSchemes = await getLocalSchemes();
  const feedUrl = process.env.EXTERNAL_SCHEME_FEED_URL;

  // No external feed configured -> serve the local registry only.
  // This is the default, truthful state for this project.
  if (!feedUrl) {
    return { schemes: localSchemes, source: 'local-registry' };
  }

  // A real external feed IS configured -> genuinely attempt to reach it.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(feedUrl, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`External feed returned HTTP ${res.status}`);

    const raw = await res.json();
    const incoming: unknown[] = Array.isArray(raw) ? raw : raw?.schemes;
    if (!Array.isArray(incoming)) throw new Error('External feed payload was not a scheme array');

    const validExternalSchemes = incoming.filter(isValidScheme);
    const localIds = new Set(localSchemes.map((s) => s.id));
    const merged = [...localSchemes, ...validExternalSchemes.filter((s) => !localIds.has(s.id))];

    return { schemes: merged, source: 'external-feed' };
  } catch (err) {
    // Real failure, honestly reported - we still return the local registry
    // so the app stays usable, but we do NOT claim the external feed worked.
    return {
      schemes: localSchemes,
      source: 'external-feed-unavailable',
      externalFeedError: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function GET() {
  const { schemes, source, externalFeedError } = await loadSchemes();

  return NextResponse.json(
    {
      success: true,
      schemes,
      source,
      registryVersion: REGISTRY_VERSION,
      registryLastUpdated: REGISTRY_LAST_UPDATED,
      totalSchemes: schemes.length,
      timestamp: new Date().toISOString(),
      ...(externalFeedError ? { externalFeedError } : {}),
    },
    { status: 200 }
  );
}
