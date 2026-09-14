import React from 'react';
import { notFound } from 'next/navigation';
import { SchemeEngine } from '../../../lib/astEvaluator';
import SchemeDetailClient from './SchemeDetailClient';
import { prisma } from '../../../lib/prisma';
import type { Scheme } from '../../../types/scheme';

async function getSchemeByCode(code: string): Promise<Scheme | null> {
  const dbScheme = await prisma.scheme.findUnique({ where: { code } });
  if (!dbScheme) return null;
  return {
    id: dbScheme.id,
    code: dbScheme.code,
    title: dbScheme.title,
    category: dbScheme.category,
    level: dbScheme.level as 'Central' | 'State',
    ministry: dbScheme.ministry,
    rulesAST: JSON.parse(dbScheme.rulesAST),
    numericLimits: JSON.parse(dbScheme.numericLimits),
    fallbackSchemeIds: JSON.parse(dbScheme.fallbackSchemeIds),
  };
}

async function getSchemesByIds(ids: string[]): Promise<Scheme[]> {
  const dbSchemes = await prisma.scheme.findMany({ where: { id: { in: ids } } });
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

export default async function SchemeDetailPage(props: { params: Promise<{ code: string }> | { code: string } }) {
  // Handle both Next.js 14 and 15+ params format
  const resolvedParams = await Promise.resolve(props.params);
  const code = resolvedParams.code;

  const scheme = await getSchemeByCode(code);
  
  if (!scheme) {
    notFound();
  }

  const rulesText = SchemeEngine.astToText(scheme.rulesAST);
  const fallbackSchemes = await getSchemesByIds(scheme.fallbackSchemeIds);

  return <SchemeDetailClient scheme={scheme} rulesText={rulesText} fallbackSchemes={fallbackSchemes} />;
}

export async function generateMetadata(props: { params: Promise<{ code: string }> | { code: string } }) {
  const resolvedParams = await Promise.resolve(props.params);
  const code = resolvedParams.code;
  const dbScheme = await prisma.scheme.findUnique({ where: { code } });
  
  if (!dbScheme) {
    return {
      title: 'Scheme Not Found',
    };
  }

  return {
    title: `${dbScheme.title} - Bharat Yojana`,
    description: `Eligibility and benefits information for ${dbScheme.title} (${dbScheme.ministry}).`,
  };
}
