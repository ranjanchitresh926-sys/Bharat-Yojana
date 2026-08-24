import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import GovHeader from '../../../components/GovHeader';
import GovFooter from '../../../components/GovFooter';
import { SCHEME_DB } from '../../../lib/seedData';
import { SchemeEngine } from '../../../lib/astEvaluator';
import { AlertTriangle, ArrowLeft, Building2, CheckCircle2, TrendingUp, Flag } from 'lucide-react';
import TrackInterestButton from '../../../components/TrackInterestButton';

export default async function SchemeDetailPage(props: { params: Promise<{ code: string }> | { code: string } }) {
  // Handle both Next.js 14 and 15+ params format
  const resolvedParams = await Promise.resolve(props.params);
  const code = resolvedParams.code;

  const scheme = SCHEME_DB.find(s => s.code === code);
  
  if (!scheme) {
    notFound();
  }

  const ministry = scheme.ministry;
  const rulesText = SchemeEngine.astToText(scheme.rulesAST);
  const fallbackSchemes = scheme.fallbackSchemeIds
    .map(id => SCHEME_DB.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <GovHeader />
      
      <main id="main-content" className="flex-1 max-w-[1000px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">
        
        <Link 
          href="/schemes"
          className="print:hidden inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0B3D91] transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 rounded"
        >
          <ArrowLeft size={16} /> Back to all schemes
        </Link>

        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0">
          {/* Header */}
          <div className="bg-[#0B3D91] p-6 sm:p-10 text-white">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-[11px] font-bold tracking-widest text-[#0B3D91] uppercase bg-white px-2.5 py-1 rounded-full">{scheme.category}</span>
              <span className="text-[11px] font-bold tracking-widest text-white uppercase border border-white/40 px-2.5 py-1 rounded-full">{scheme.level}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {scheme.title}
            </h1>
            <div className="flex items-center gap-2 text-blue-200 font-medium">
              <Building2 size={18} />
              {ministry}
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-10">
            {/* Eligibility Section */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                <CheckCircle2 className="text-green-600" /> Eligibility Criteria
              </h2>
              <div className="bg-gray-50 p-5 rounded-md border border-gray-200 text-gray-700 leading-relaxed font-medium">
                {rulesText !== '{}' && rulesText !== 'No specific categorical conditions apply' 
                  ? rulesText 
                  : 'Open to all citizens regardless of specific categorical conditions.'}
              </div>
              <div className="print:hidden">
                <TrackInterestButton scheme={scheme} />
              </div>
            </section>

            {/* Related Schemes */}
            {fallbackSchemes.length > 0 && (
              <section className="print:hidden">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                  <TrendingUp className="text-blue-600" /> Related Alternatives
                </h2>
                <div className="flex flex-wrap gap-3">
                  {fallbackSchemes.map(fb => fb && (
                    <Link
                      key={fb.id}
                      href={`/schemes/${fb.code}`}
                      className="text-sm bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-blue-100 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-blue-600"
                    >
                      {fb.title} ({fb.code})
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Report Issue Action */}
            <section className="bg-amber-50 border border-amber-200 rounded-md p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
              <div>
                <h3 className="font-bold text-amber-900 flex items-center gap-2">
                  <AlertTriangle size={18} /> Spotted incorrect data?
                </h3>
                <p className="text-sm text-amber-800 mt-1">
                  If the eligibility rule or categorization for this scheme seems wrong, let us know.
                </p>
              </div>
              <Link
                href={`/report?schemeCode=${scheme.code}`}
                className="shrink-0 flex items-center gap-2 bg-white text-amber-700 border border-amber-300 px-4 py-2 rounded-md font-bold text-sm hover:bg-amber-100 transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-amber-600"
              >
                <Flag size={16} /> Report Data Issue
              </Link>
            </section>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
}

export async function generateMetadata(props: { params: Promise<{ code: string }> | { code: string } }) {
  const resolvedParams = await Promise.resolve(props.params);
  const code = resolvedParams.code;
  const scheme = SCHEME_DB.find(s => s.code === code);
  return {
    title: scheme ? `${scheme.title} - Bharat Yojana` : 'Scheme Details - Bharat Yojana',
    description: scheme ? `Details and eligibility for ${scheme.title}` : 'View government scheme details'
  };
}
