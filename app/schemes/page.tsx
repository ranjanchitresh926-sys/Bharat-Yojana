import React from 'react';
import Link from 'next/link';
import GovHeader from '../../components/GovHeader';
import GovFooter from '../../components/GovFooter';
import { SCHEME_DB } from '../../lib/seedData';
import { Landmark, ArrowRight } from 'lucide-react';

export default function SchemesCatalogPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <GovHeader />
      
      <main id="main-content" className="flex-1 max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Offerings & Schemes</h1>
          <p className="text-gray-500 mt-2">Browse the complete catalog of government schemes available on Bharat Yojana.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCHEME_DB.map((scheme) => (
            <Link 
              href={`/schemes/${scheme.code}`}
              key={scheme.id}
              className="group bg-white rounded-md p-6 shadow-sm border border-gray-200 flex flex-col h-full hover:border-blue-300 transition-all relative overflow-hidden focus:outline-2 focus:outline-offset-2 focus:outline-blue-600"
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[11px] font-bold tracking-widest text-gray-500 uppercase bg-gray-100 px-2.5 py-1 rounded-full">{scheme.category}</span>
                <span className="text-[11px] font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-full">{scheme.level}</span>
              </div>
              
              <h3 className="text-xl font-black text-gray-800 leading-snug mb-3 group-hover:text-blue-700 transition-colors">
                {scheme.title}
              </h3>

              <div className="mt-auto pt-4 flex items-center justify-between text-blue-600 font-bold text-sm border-t border-gray-100">
                View Details
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <GovFooter />
    </div>
  );
}

export const metadata = {
  title: 'All Schemes - Bharat Yojana',
  description: 'Browse the complete catalog of government schemes available on Bharat Yojana.'
};

