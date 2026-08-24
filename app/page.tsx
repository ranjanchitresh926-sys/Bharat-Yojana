"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CitizenProfile, Scheme } from '../types/scheme';
import { SchemeEngine } from '../lib/astEvaluator';
import { getTranslations, TranslationSet } from '../lib/translations';
import VoiceIntake from '../components/VoiceIntake';
import LanguageSelector from '../components/LanguageSelector';
import GovHeader from '../components/GovHeader';
import HeroBanner from '../components/HeroBanner';
import GovFooter from '../components/GovFooter';
import Reveal from '../components/Reveal';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Search, Download } from 'lucide-react';

const MINISTRIES = [
  'All Ministries',
  'Ministry of Agriculture & Farmers Welfare',
  'Ministry of Finance',
  'Ministry of Rural Development',
  'Ministry of Women & Child Development',
  'Ministry of Housing & Urban Affairs',
  'Ministry of Health & Family Welfare',
  'Ministry of Education',
  'Ministry of Petroleum and Natural Gas',
  'Ministry of Skill Development and Entrepreneurship',
  'Ministry of Micro, Small and Medium Enterprises',
  'Ministry of Social Justice and Empowerment',
  'State Government Schemes',
];

// Map schemes to ministries for filtering. Central schemes map to their
// real administering ministry. State schemes (level: 'State' in
// lib/seedData.ts) don't sit under any single central ministry, so they're
// grouped under 'State Government Schemes' instead of being force-fit into
// a central ministry they don't actually belong to.
const SCHEME_MINISTRY_MAP: Record<string, string> = {
  'PM-KISAN': 'Ministry of Agriculture & Farmers Welfare',
  'MP-KISAN-KALYAN': 'State Government Schemes',
  'PM-FASAL-BIMA': 'Ministry of Agriculture & Farmers Welfare',
  'PM-UJJWALA': 'Ministry of Petroleum and Natural Gas',
  'PM-AWAS-GRAMIN': 'Ministry of Rural Development',
  'PMJDY': 'Ministry of Finance',
  'PM-SVANidhi': 'Ministry of Housing & Urban Affairs',
  'PMSBY': 'Ministry of Finance',
  'PM-MUDRA': 'Ministry of Finance',
  'SUKANYA-SAMRIDDHI': 'Ministry of Women & Child Development',
  'PM-KAUSHAL': 'Ministry of Skill Development and Entrepreneurship',
  'AYUSHMAN-BHARAT': 'Ministry of Health & Family Welfare',
  'NMMSS': 'Ministry of Education',
  'PRAGATI': 'Ministry of Education',
  'IGNOAPS': 'Ministry of Rural Development',
  'IGNDPS': 'Ministry of Rural Development',
  'STAND-UP-INDIA': 'Ministry of Finance',
  'PMEGP': 'Ministry of Micro, Small and Medium Enterprises',
  'MJPJAY': 'State Government Schemes',
  'MKSY': 'State Government Schemes',
  'ADIP': 'Ministry of Social Justice and Empowerment',
  'MVPY': 'State Government Schemes',
};

const defaultProfile: CitizenProfile = {
  age: 25,
  annualIncome: 50000,
  casteCategory: 'General',
  gender: 'Male',
  occupation: '',
  state: '',
  landholdingAcres: 0,
  isBPLCardHolder: false,
  isDisabled: false,
};

export default function Dashboard() {
  const [profile, setProfile] = useState<CitizenProfile>(defaultProfile);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [registrySource, setRegistrySource] = useState<string | null>(null);
  const [registryTime, setRegistryTime] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState('All Ministries');
  const [langCode, setLangCode] = useState('en-IN');
  const [t, setT] = useState<TranslationSet>(getTranslations('en-IN'));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('bharat_yojana_state');
    if (saved) {
      try {
        const { profile: sp, results: sr, hasSearched: sh, searchQuery: sq, selectedMinistry: sm } = JSON.parse(saved);
        if (sp) setProfile(sp);
        if (sr) setResults(sr);
        if (sh !== undefined) setHasSearched(sh);
        if (sq !== undefined) setSearchQuery(sq);
        if (sm) setSelectedMinistry(sm);
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    
    // Check if we came from another page with a search query
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) {
        setSearchQuery(q);
        // Will be triggered by a useEffect down below once schemes are loaded
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bharat_yojana_state', JSON.stringify({ profile, results, hasSearched, searchQuery, selectedMinistry }));
    }
  }, [isLoaded, profile, results, hasSearched, searchQuery, selectedMinistry]);

  // Listen for language changes and cross-component search
  useEffect(() => {
    const updateLang = () => {
      const stored = localStorage.getItem('preferredLang') || 'en-IN';
      setLangCode(stored);
      setT(getTranslations(stored));
    };
    updateLang();
    window.addEventListener('languageChanged', updateLang);

    const handleTriggerSearch = (e: any) => {
      setSearchQuery(e.detail);
      // We need to wait for state to settle, then run search.
      // Easiest is to set a flag or just call a search function that reads the latest state.
      // But we can just use a setTimeout to let React update the state first.
      setTimeout(() => {
        document.getElementById('run-search-btn')?.click();
      }, 0);
    };
    window.addEventListener('triggerSearch', handleTriggerSearch);

    return () => {
      window.removeEventListener('languageChanged', updateLang);
      window.removeEventListener('triggerSearch', handleTriggerSearch);
    };
  }, []);

  // Fetch schemes from the API on mount
  useEffect(() => {
    async function fetchSchemes() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await fetch('/api/schemes');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        if (data.success && data.schemes) {
          setSchemes(data.schemes);
          setRegistrySource(data.source);
          setRegistryTime(data.timestamp);
        } else {
          setSchemes(data); // Fallback if old API response format
        }
      } catch (err: any) {
        setFetchError(err.message || 'Failed to fetch schemes');
      } finally {
        setIsLoading(false);
      }
    }
    fetchSchemes();
  }, []);

  // Auto-search if q is present in URL and schemes are loaded
  useEffect(() => {
    if (!isLoading && schemes.length > 0 && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('q')) {
        setTimeout(() => {
          document.getElementById('run-search-btn')?.click();
        }, 0);
      }
    }
  }, [isLoading, schemes.length]);

  const runSearch = () => {
    if (schemes.length === 0) return;

    const q = searchQuery.toLowerCase().trim();
    const filteredSchemes = schemes.filter(scheme => {
      // Text filter
      const matchesText = !q || scheme.title.toLowerCase().includes(q) || scheme.code.toLowerCase().includes(q) || scheme.category.toLowerCase().includes(q);
      // Ministry filter
      const schemeMinistry = SCHEME_MINISTRY_MAP[scheme.code] || '';
      const matchesMinistry = selectedMinistry === 'All Ministries' || schemeMinistry === selectedMinistry;
      return matchesText && matchesMinistry;
    });

    const evals = filteredSchemes.map(scheme => SchemeEngine.evaluate(profile, scheme, schemes, t));
    setResults(evals);
    setHasSearched(true);
  };

  const handleProfileChange = (field: keyof CitizenProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasSearched(false); // Reset so user knows to search again
  };

  const handleVoiceParsed = (parsedProfile: Partial<CitizenProfile>) => {
    setProfile(prev => ({ ...prev, ...parsedProfile }));
    setHasSearched(false);
  };

  const applyPreset = (presetType: string) => {
    if (presetType === 'Small Farmer MP') {
      setProfile({ ...defaultProfile, occupation: 'Farmer', state: 'Madhya Pradesh', landholdingAcres: 2.5, annualIncome: 40000 });
    } else if (presetType === 'High Income Farmer') {
      setProfile({ ...defaultProfile, occupation: 'Farmer', state: 'Uttar Pradesh', landholdingAcres: 15, annualIncome: 500000 });
    } else if (presetType === 'BPL Applicant') {
      setProfile({ ...defaultProfile, occupation: 'Laborer', state: 'Madhya Pradesh', isBPLCardHolder: true, annualIncome: 20000, landholdingAcres: 0 });
    }
    setHasSearched(false);
  };

  const generatePDFReport = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(({ default: autoTable }) => {
        const doc = new jsPDF();
        const primaryColor: [number, number, number] = [11, 61, 145]; // #0B3D91

        // Helper to format currency and remove rupees symbol which breaks jsPDF font
        const formatCurrency = (val: number) => `Rs. ${(val || 0).toLocaleString('en-IN')}`;

        // Header Background
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, 210, 40, 'F');
        
        // Header Text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('BHARAT YOJANA', 14, 20);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Government Schemes, Simplified for You.', 14, 28);
        
        doc.setFontSize(10);
        doc.setTextColor(200, 220, 255);
        doc.text(`Eligibility Report - Generated on: ${new Date().toLocaleString()}`, 14, 35);

        // Reset text color for body
        doc.setTextColor(33, 33, 33);

        // Citizen Profile section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Citizen Profile Overview', 14, 52);
        
        autoTable(doc, {
          startY: 57,
          head: [['Profile Attribute', 'Provided Value']],
          body: [
            ['Age', `${profile.age} Years`],
            ['Annual Income', formatCurrency(profile.annualIncome)],
            ['Gender', profile.gender],
            ['Caste Category', profile.casteCategory],
            ['Occupation', profile.occupation || 'N/A'],
            ['State of Residence', profile.state || 'N/A'],
            ['Landholding', `${profile.landholdingAcres} Acres`],
            ['BPL Card Holder', profile.isBPLCardHolder ? 'Yes' : 'No'],
            ['Disability Status', profile.isDisabled ? 'Yes (Disabled)' : 'No'],
          ],
          theme: 'grid',
          headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 248, 252] },
          styles: { font: 'helvetica', fontSize: 10, cellPadding: 5 },
          margin: { left: 14, right: 14 }
        });

        // Evaluation Results section
        const finalY = (doc as any).lastAutoTable.finalY || 130;
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Scheme Evaluation Results', 14, finalY + 15);

        const tableData = results.map((result) => {
          const scheme = schemes.find(s => s.id === result.schemeId);
          if (!scheme) return [];
          const status = result.isEligible ? 'Eligible' : 'Not Eligible';
          
          // Sanitize text to remove Rupee/unknown symbols which cause PDF font rendering issues
          // Converts something like "?200000" or "¹ 200000" to "Rs. 2,00,000"
          const rawGaps = result.quantitativeGaps.map((g: any) => g.message).join('\n');
          const gaps = rawGaps.replace(/(?:₹|\?|¹\s*)(\d+)/g, (match: string, p1: string) => {
            return `Rs. ${Number(p1).toLocaleString('en-IN')}`;
          });

          return [scheme.code, scheme.title, status, gaps || 'Meets all criteria'];
        }).filter(row => row.length > 0);

        autoTable(doc, {
          startY: finalY + 20,
          head: [['Scheme Code', 'Scheme Name', 'Status', 'Eligibility Notes']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 248, 252] },
          styles: { font: 'helvetica', fontSize: 9, cellPadding: 5, overflow: 'linebreak' },
          columnStyles: {
            0: { cellWidth: 28, fontStyle: 'bold' },
            1: { cellWidth: 52 },
            2: { cellWidth: 26, fontStyle: 'bold' },
            3: { cellWidth: 76 }
          },
          didParseCell: function(data: any) {
            if (data.section === 'body' && data.column.index === 2) {
              if (data.cell.raw === 'Eligible') {
                data.cell.styles.textColor = [34, 139, 34]; // Green
              } else {
                data.cell.styles.textColor = [211, 47, 47]; // Red
              }
            }
          }
        });
        
        // Add footer with page numbers
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(9);
          doc.setTextColor(150);
          doc.text(
            `Page ${i} of ${pageCount} - Bharat Yojana Platform`, 
            doc.internal.pageSize.getWidth() / 2, 
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        }

        doc.save('Bharat_Yojana_Eligibility_Report.pdf');
      });
    });
  };

  const eligibleResults = results.filter(r => r.isEligible);
  const eligibleCountByCategory = eligibleResults.reduce((acc, result) => {
    const scheme = schemes.find(s => s.id === result.schemeId);
    if (scheme) {
      acc[scheme.category] = (acc[scheme.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <GovHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <LanguageSelector />
      
      <HeroBanner />

      <main id="main-content" className="flex-1 max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-12">
        
        {/* Intake Form Section */}
        <Reveal delay={100}>
        <section id="applicant-info-section" className="bg-[#fcfbf7] rounded-md shadow-sm border border-[#e2dfd2] overflow-hidden">
          <div className="border-b border-[#e2dfd2] px-6 py-4 bg-white/80 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#007b8f] tracking-tight">{t.applicantInfo}</h2>
            <p className="text-sm text-gray-500">{t.fillDetails}</p>
          </div>
          
          <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left side: Voice Intake & Presets */}
            <div className="lg:w-1/3 flex flex-col space-y-6">
              <VoiceIntake onProfileParsed={handleVoiceParsed} speakLabel={t.speakProfile} listeningLabel={t.listeningIn} />
              
              <div className="bg-[#f0ede1] p-5 rounded-lg border border-[#e2dfd2]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                  <span className="w-4 h-px bg-gray-400"></span>
                  {t.quickPresets}
                  <span className="flex-1 h-px bg-gray-400"></span>
                </h3>
                <div className="flex flex-col gap-2.5">
                  <button onClick={() => applyPreset('Small Farmer MP')} className="w-full text-left px-4 py-2.5 bg-white border border-[#e2dfd2] hover:border-orange-400 rounded shadow-sm text-sm font-semibold text-gray-700 transition-all">{t.smallFarmerMP}</button>
                  <button onClick={() => applyPreset('High Income Farmer')} className="w-full text-left px-4 py-2.5 bg-white border border-[#e2dfd2] hover:border-orange-400 rounded shadow-sm text-sm font-semibold text-gray-700 transition-all">{t.highIncomeFarmer}</button>
                  <button onClick={() => applyPreset('BPL Applicant')} className="w-full text-left px-4 py-2.5 bg-white border border-[#e2dfd2] hover:border-orange-400 rounded shadow-sm text-sm font-semibold text-gray-700 transition-all">{t.bplApplicant}</button>
                </div>
              </div>
            </div>

            {/* Right side: Manual Form */}
            <div className="lg:w-2/3 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.age}<span className="text-red-500">*</span></label>
                  <input type="number" value={profile.age} onChange={e => handleProfileChange('age', parseInt(e.target.value) || 0)} className="w-full p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none text-gray-900 transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.annualIncome}<span className="text-red-500">*</span></label>
                  <input type="number" value={profile.annualIncome} onChange={e => handleProfileChange('annualIncome', parseInt(e.target.value) || 0)} className="w-full p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none text-gray-900 transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.state}</label>
                  <input type="text" value={profile.state} onChange={e => handleProfileChange('state', e.target.value)} className="w-full p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none text-gray-900 transition-shadow" placeholder="e.g. Madhya Pradesh" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.occupation}</label>
                  <input type="text" value={profile.occupation} onChange={e => handleProfileChange('occupation', e.target.value)} className="w-full p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none text-gray-900 transition-shadow" placeholder="e.g. Farmer" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.landholding}</label>
                  <input type="number" step="0.1" value={profile.landholdingAcres} onChange={e => handleProfileChange('landholdingAcres', parseFloat(e.target.value) || 0)} className="w-full p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none text-gray-900 transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.ministry}</label>
                  <select
                    value={selectedMinistry}
                    onChange={e => { setSelectedMinistry(e.target.value); setHasSearched(false); }}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none text-gray-900 transition-shadow"
                  >
                    {MINISTRIES.map(m => (
                      <option key={m} value={m}>{m === 'All Ministries' ? t.allMinistries : m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender */}
              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.gender}<span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2.5">
                  {(['Male', 'Female', 'Other'] as const).map(g => (
                    <button 
                      key={g} 
                      onClick={() => handleProfileChange('gender', g)}
                      className={`px-5 py-2 rounded border text-sm font-bold transition-all shadow-sm ${
                        profile.gender === g 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {g === 'Male' ? t.male : g === 'Female' ? t.female : t.other}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.category}<span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2.5">
                  {['General', 'OBC', 'SC', 'ST'].map(c => (
                    <button 
                      key={c} 
                      onClick={() => handleProfileChange('casteCategory', c)}
                      className={`px-6 py-2 rounded border text-sm font-bold transition-all shadow-sm ${
                        profile.casteCategory === c 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-8 pt-4">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${profile.isBPLCardHolder ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400 group-hover:border-blue-500'}`}>
                    {profile.isBPLCardHolder && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={profile.isBPLCardHolder} onChange={e => handleProfileChange('isBPLCardHolder', e.target.checked)} />
                  <span className="text-sm font-semibold text-gray-700">{t.bplCardHolder}</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${profile.isDisabled ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400 group-hover:border-blue-500'}`}>
                    {profile.isDisabled && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={profile.isDisabled} onChange={e => handleProfileChange('isDisabled', e.target.checked)} />
                  <span className="text-sm font-semibold text-gray-700">{t.differentlyAbled}</span>
                </label>
              </div>

              {/* Search Schemes Button */}
              <div className="pt-6 border-t border-[#e2dfd2] flex flex-col sm:flex-row items-center gap-4">
                <button
                  id="run-search-btn"
                  onClick={runSearch}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-md font-bold text-base shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-2 focus:outline-offset-2 focus:outline-orange-800"
                >
                  <Search size={20} />
                  {t.searchSchemes}
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('bharat_yojana_state');
                    setProfile(defaultProfile);
                    setResults([]);
                    setHasSearched(false);
                    setSearchQuery('');
                    setSelectedMinistry('All Ministries');
                  }}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Clear saved data
                </button>
              </div>

            </div>
          </div>
        </section>
        </Reveal>

        {/* Results Grid Section */}
        {hasSearched && (
          <Reveal delay={200}>
          <section className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{t.eligibilityResults}</h2>
                  <span className="bg-blue-100 text-blue-800 text-sm py-1.5 px-4 rounded-full font-bold shadow-sm">{results.length} {t.schemesAnalyzed}</span>
                </div>
                <button
                  onClick={generatePDFReport}
                  className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  <Download size={16} />
                  Download Report
                </button>
              </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-md p-6 shadow-sm border border-gray-200 animate-pulse">
                    <div className="flex gap-2 mb-4">
                      <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                      <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/3 bg-gray-200 rounded mb-8"></div>
                    <div className="border-t border-gray-100 pt-5">
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        <div className="h-7 w-24 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {fetchError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-8 text-center">
                <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
                <p className="text-red-700 font-semibold">Failed to load schemes</p>
                <p className="text-red-500 text-sm mt-1">{fetchError}</p>
              </div>
            )}

            {/* Results */}
            {!isLoading && !fetchError && (
              <>
                  {eligibleResults.length > 0 && (
                    <div className="bg-green-50/80 border border-green-200 rounded-md p-6 mb-6">
                      <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-green-600" />
                        You are eligible for {eligibleResults.length} schemes
                      </h3>
                      <div className="text-gray-700 font-medium text-[15px] flex flex-wrap items-center gap-1">
                        {Object.entries(eligibleCountByCategory).map(([category, count], index, arr) => (
                          <span key={category}>
                            {category} ({String(count)})
                            {index < arr.length - 1 && <span className="mx-2 text-gray-400 font-bold">·</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result, idx) => {
                  const scheme = schemes.find(s => s.id === result.schemeId)!;
                  const ministry = SCHEME_MINISTRY_MAP[scheme.code] || '';
                  
                  return (
                    <div key={idx} className="bg-white rounded-md p-6 shadow-sm border border-gray-200 flex flex-col h-full transition-shadow relative overflow-hidden">
                      <div className="flex-1 flex flex-col">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="text-[11px] font-bold tracking-widest text-gray-500 uppercase bg-gray-100 px-2.5 py-1 rounded-full">{scheme.category}</span>
                          <span className="text-[11px] font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-full">{scheme.level}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{scheme.title}</h3>
                        <p className="text-sm text-gray-500 mb-1 font-mono bg-gray-50 inline-block px-2 py-1 rounded border border-gray-100">{scheme.code}</p>
                        {ministry && <p className="text-xs text-gray-400 mt-1 mb-4">{ministry}</p>}
                        
                        <div className="pt-4 mt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{t.status}</span>
                            {result.isEligible ? (
                              <span className="flex items-center gap-1.5 bg-green-100 text-green-800 px-3.5 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                <CheckCircle2 size={16} /> {t.eligible}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 bg-red-100 text-red-800 px-3.5 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                <XCircle size={16} /> {t.notEligible}
                              </span>
                            )}
                          </div>

                          {!result.isEligible && result.quantitativeGaps.length > 0 && (
                            <div className="bg-red-50/80 rounded-xl p-4 space-y-3 border border-red-100 mb-4">
                              <h4 className="text-[11px] font-extrabold text-red-800 uppercase tracking-widest flex items-center gap-1.5">
                                <AlertCircle size={14} /> {t.gapAnalysis}
                              </h4>
                              {result.quantitativeGaps.map((gap: any, i: number) => (
                                <div key={i} className="text-xs bg-white p-3 rounded-lg shadow-sm border border-red-50">
                                  <span className="text-gray-800 font-medium block mb-1">{gap.message}</span>
                                  {gap.actionable && (
                                    <span className="text-blue-700 font-semibold block mb-2 leading-relaxed bg-blue-50 p-2 rounded">{gap.actionable}</span>
                                  )}
                                  <div className="flex items-center justify-between font-mono text-[11px] bg-gray-50 p-1.5 rounded">
                                    <span className="text-gray-600">Actual: {gap.actual}</span>
                                    <span className="text-green-600 font-bold">Req: {gap.required}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {!result.isEligible && result.suggestedFallbacks.length > 0 && (
                            <div className="pt-1 border-gray-100 mb-4">
                              <h4 className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                                <TrendingUp size={14} /> {t.alternativeSchemes}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {result.suggestedFallbacks.map((fallbackId: string) => {
                                  const fallbackScheme = schemes.find(s => s.id === fallbackId);
                                  return fallbackScheme ? (
                                    <Link key={fallbackId} href={`/schemes/${fallbackScheme.code}`} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full font-bold shadow-sm hover:bg-blue-100 transition-colors cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-600">
                                      {fallbackScheme.code}
                                    </Link>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <details className="group mt-4 pt-4 border-t border-gray-100">
                          <summary className="cursor-pointer text-[12px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 list-none focus:outline-2 focus:outline-offset-2 focus:outline-blue-600">
                            <span className="text-[10px] group-open:rotate-90 transition-transform">▶</span> Why this result?
                          </summary>
                          <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed font-medium">
                            <span className="block mb-1 text-xs text-gray-500 uppercase tracking-wider font-bold">Rules Evaluated:</span>
                            {SchemeEngine.astToText(scheme.rulesAST)}
                          </div>
                      </details>
                    </div>
                  );
                  })}
                </div>
                </>
              )}
            </section>
          </Reveal>
        )}
      </main>

      <GovFooter />
    </div>
  );
}
