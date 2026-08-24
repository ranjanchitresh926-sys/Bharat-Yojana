"use client";

import React from 'react';
import { ChevronRight, Leaf, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative w-full bg-white overflow-hidden border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10">

          {/* Left Text Area */}
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <div className="flex items-center text-xs font-bold text-gray-500 mb-6 tracking-wide uppercase">
              <span>Home</span>
              <ChevronRight size={14} className="mx-2 opacity-50" />
              <span>Offerings</span>
              <ChevronRight size={14} className="mx-2 opacity-50" />
              <span className="text-gray-800 border-b-2 border-orange-400 pb-0.5">Schemes</span>
            </div>

            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-3">
                <span className="text-green-700">Bharat</span> Yojana
              </h1>

              <h2 className="text-3xl md:text-4xl font-bold text-[#0B3D91] leading-tight mb-4 mt-4">
                Government Schemes,<br/>
                <span className="text-orange-600">Simplified for You.</span>
              </h2>

              <p className="text-gray-600 text-lg md:text-xl font-medium max-w-lg">
                Discover programmes aimed at enhancing social welfare, economic development, and agriculture. <span className="font-bold text-[#0B3D91]">Find the best schemes in your own language.</span>
              </p>
            </div>

            <button
              onClick={() => document.getElementById('applicant-info-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-bold text-lg shadow-sm transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-orange-800"
            >
              Explore Schemes
              <span className="bg-white text-orange-600 rounded p-1">
                <ArrowRight size={18} strokeWidth={3} />
              </span>
            </button>
          </div>

          {/* Right Visual Area (Simulated Phone App) */}
          <div className="hidden lg:flex relative items-center justify-center w-full max-w-md">
            <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-4 w-72 h-[500px] flex flex-col overflow-hidden">
              {/* Phone Notch */}
              <div className="w-32 h-6 bg-gray-200 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20"></div>

              <div className="bg-gray-50 flex-1 rounded-xl mt-4 p-4 border border-gray-100 relative overflow-hidden">
                <div className="text-center mb-6 mt-4">
                  <h3 className="font-black text-gray-800 text-xl">Explore eligible schemes</h3>
                  <div className="h-1 w-12 bg-orange-500 mx-auto mt-2 rounded"></div>
                </div>

                {/* Mock UI Cards inside phone */}
                <div className="space-y-3">
                  <div className="bg-[#0B3D91] text-white p-3 rounded-lg shadow-sm text-sm">
                    <span className="font-bold block mb-1">Recommended for you</span>
                    Find relevant schemes based on your region, age and gender.
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-md text-orange-600"><Leaf size={16}/></div>
                    <div className="font-semibold text-xs text-gray-700">Agriculture</div>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-md text-green-700"><ShieldCheck size={16}/></div>
                    <div className="font-semibold text-xs text-gray-700">Financial Inclusion</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
