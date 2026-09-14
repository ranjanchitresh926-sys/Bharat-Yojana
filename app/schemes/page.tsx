import React from 'react';
import SchemesCatalogClient from './SchemesCatalogClient';
import { prisma } from '../../lib/prisma';
import type { Scheme } from '../../types/scheme';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All Schemes - Bharat Yojana',
  description: 'Browse the complete catalog of government schemes available on Bharat Yojana.'
};

export default async function SchemesCatalogPage() {
  const dbSchemes = await prisma.scheme.findMany();
  const schemes: Scheme[] = dbSchemes.map(s => ({
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

  return <SchemesCatalogClient schemes={schemes} />;
}
