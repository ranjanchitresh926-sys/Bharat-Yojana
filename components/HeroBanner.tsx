"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Leaf, ShieldCheck, ArrowRight } from "lucide-react";
import { getTranslations, TranslationSet } from "../lib/translations";

export default function HeroBanner() {
  const [t, setT] = useState<TranslationSet>(getTranslations("en-IN"));

  useEffect(() => {
    const updateLang = () => {
      const stored = localStorage.getItem("preferredLang") || "en-IN";
      setT(getTranslations(stored));
    };
    updateLang();
    window.addEventListener("languageChanged", updateLang);
    return () => window.removeEventListener("languageChanged", updateLang);
  }, []);

  return (
    <div className="relative w-full overflow-hidden border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center text-xs font-bold text-gray-500 mb-6 tracking-wide uppercase">
              <span>{t.heroHome}</span>
              <ChevronRight size={14} className="mx-2 opacity-50" />
              <span>{t.heroOfferings}</span>
              <ChevronRight size={14} className="mx-2 opacity-50" />
              <span className="text-gray-800 border-b-2 border-orange-400 pb-0.5">{t.heroSchemes}</span>
            </div>

            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-3">
                <span className="text-green-700">{t.heroBharat}</span> {t.heroYojana}
              </h1>

              <h2 className="text-3xl md:text-4xl font-bold text-[#0B3D91] leading-tight mb-4 mt-4">
                {t.heroGovSchemes}<br/>
                <span className="text-orange-600">{t.heroSimplified}</span>
              </h2>

              <p className="text-gray-600 text-lg md:text-xl font-medium max-w-lg">
                {t.heroDesc1} <span className="font-bold text-[#0B3D91]">{t.heroDesc2}</span>
              </p>
            </div>

            <button
              onClick={() => document.getElementById("applicant-info-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="flex items-center gap-3 bg-[#C2410C] hover:bg-[#a3370a] text-white px-6 py-3 rounded-md font-bold text-lg shadow-sm transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-orange-800"
            >
              {t.heroExploreBtn}
              <span className="bg-white text-orange-600 rounded p-1">
                <ArrowRight size={18} strokeWidth={3} />
              </span>
            </button>
          </div>

          <div className="hidden lg:flex relative items-center justify-center w-full max-w-md">
            <div className="relative bg-white border border-gray-200 rounded-md shadow-sm p-4 w-72 h-[500px] flex flex-col overflow-hidden">
              <div className="w-32 h-6 bg-gray-200 rounded-b-md mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20"></div>

              <div className="flex-1 mt-4 p-4 relative overflow-hidden">
                <div className="text-center mb-6 mt-4">
                  <h3 className="font-black text-gray-800 text-xl">{t.phoneExploreTitle}</h3>
                  <div className="h-1 w-12 bg-orange-500 mx-auto mt-2 rounded"></div>
                </div>

                <div className="space-y-3">
                  <div className="text-gray-700 py-2 border-b border-gray-200/50 text-sm">
                    <span className="font-bold text-gray-900 block mb-1">{t.phoneRecForYou}</span>
                    {t.phoneRecDesc}
                  </div>
                  <div className="flex items-center gap-3 py-2 border-b border-gray-200/50">
                    <div className="p-2 text-orange-600"><Leaf size={16}/></div>
                    <div className="font-semibold text-xs text-gray-700">{t.phoneAgri}</div>
                  </div>
                  <div className="flex items-center gap-3 py-2">
                    <div className="p-2 text-green-700"><ShieldCheck size={16}/></div>
                    <div className="font-semibold text-xs text-gray-700">{t.phoneFin}</div>
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
