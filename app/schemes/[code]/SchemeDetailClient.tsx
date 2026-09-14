"use client";

import React from 'react';
import Link from 'next/link';
import GovHeader from '../../../components/GovHeader';
import GovFooter from '../../../components/GovFooter';
import { AlertTriangle, ArrowLeft, ArrowRight, Building2, CheckCircle2, TrendingUp, Flag } from 'lucide-react';
import TrackInterestButton from '../../../components/TrackInterestButton';
import { useTranslation } from '../../../components/TranslationProvider';
import { SchemeEngine } from '../../../lib/astEvaluator';
import { schemeTranslations } from '../../../lib/schemeTranslations';

export default function SchemeDetailClient({ scheme, rulesText, fallbackSchemes }: { scheme: any, rulesText: string, fallbackSchemes: any[] }) {
  const { lang } = useTranslation();
  const translatedRulesText = SchemeEngine.astToText(scheme.rulesAST, lang as any);
  const translatedTitle = schemeTranslations[lang as keyof typeof schemeTranslations]?.[scheme.code] || scheme.title;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <GovHeader />
      
      <main id="main-content" className="flex-1 max-w-[1000px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        
        <Link 
          href="/schemes" 
          className="print:hidden inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold mb-4 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 rounded"
        >
          <ArrowLeft size={18} /> Back to All Schemes
        </Link>

        <div className="bg-white rounded-md p-6 sm:p-8 shadow-sm border border-gray-200 print:shadow-none print:border-none print:m-0 print:p-0">
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase bg-gray-100 px-3 py-1.5 rounded-full">{scheme.category}</span>
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-full">{scheme.level}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
            {translatedTitle}
          </h1>

          <div className="flex items-center gap-2 text-gray-600 font-medium border-b border-gray-100 pb-6 mb-6">
            <Building2 size={18} className="text-gray-400 shrink-0" />
            {scheme.ministry}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" /> Eligibility Criteria
                </h2>
                <div className="bg-gray-50 p-5 rounded-md border border-gray-200 text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
                  {translatedRulesText}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-blue-600" /> General Benefits
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Beneficiaries of the {translatedTitle} receive financial, material, or service-based assistance directly from the government. Specific disbursements are calculated based on applicant profiles during the formal application process.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Flag className="text-amber-600" /> Application Process
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Citizens can verify their eligibility and track their application progress directly through this portal. Official documentation and identity verification will be required during the officer review stage.
                </p>
              </section>

            </div>

            <div className="space-y-6">
              
              <div className="print:hidden">
                <TrackInterestButton scheme={scheme} />
              </div>

              {fallbackSchemes.length > 0 && (
                <div className="print:hidden bg-amber-50 border border-amber-200 p-5 rounded-md">
                  <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} /> Related Alternatives
                  </h3>
                  <p className="text-sm text-amber-800 mb-3">If you do not meet the criteria for this scheme, you might qualify for these alternatives:</p>
                  <ul className="space-y-2">
                    {fallbackSchemes.map((fscheme) => {
                       const fTitle = schemeTranslations[lang as keyof typeof schemeTranslations]?.[fscheme.code] || fscheme.title;
                       return (
                      <li key={fscheme.id}>
                        <Link href={`/schemes/${fscheme.code}`} className="text-sm font-bold text-blue-700 hover:underline flex items-center gap-1">
                          <ArrowRight size={14} /> {fTitle}
                        </Link>
                      </li>
                    )})}
                  </ul>
                </div>
              )}

              <div className="print:hidden bg-gray-50 border border-gray-200 p-5 rounded-md mt-6">
                <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">If you face issues applying for this scheme or believe your eligibility was incorrectly calculated, please submit a report.</p>
                <Link href="/connect" className="inline-block text-sm font-bold text-blue-600 hover:text-blue-800 underline focus:outline-2 focus:outline-offset-2 focus:outline-blue-600">
                  Report an Issue &rarr;
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
}
