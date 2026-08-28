import React from 'react';
import { notFound } from 'next/navigation';
import { SCHEME_DB } from '../../../lib/seedData';
import { SchemeEngine } from '../../../lib/astEvaluator';
import SchemeDetailClient from './SchemeDetailClient';

export default async function SchemeDetailPage(props: { params: Promise<{ code: string }> | { code: string } }) {
  // Handle both Next.js 14 and 15+ params format
  const resolvedParams = await Promise.resolve(props.params);
  const code = resolvedParams.code;

  const scheme = SCHEME_DB.find(s => s.code === code);
  
  if (!scheme) {
    notFound();
  }

  const rulesText = SchemeEngine.astToText(scheme.rulesAST);
  const fallbackSchemes = scheme.fallbackSchemeIds
    .map(id => SCHEME_DB.find(s => s.id === id))
    .filter(Boolean);

  return <SchemeDetailClient scheme={scheme} rulesText={rulesText} fallbackSchemes={fallbackSchemes} />;
}

export async function generateMetadata(props: { params: Promise<{ code: string }> | { code: string } }) {
  const resolvedParams = await Promise.resolve(props.params);
  const code = resolvedParams.code;
  const scheme = SCHEME_DB.find(s => s.code === code);
  
  if (!scheme) {
    return {
      title: 'Scheme Not Found',
    };
  }

  return {
    title: `${scheme.title} - Bharat Yojana`,
    description: `Eligibility and benefits information for ${scheme.title} (${scheme.ministry}).`,
  };
}
