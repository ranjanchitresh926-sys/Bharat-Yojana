"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Landmark, Search, Glasses } from 'lucide-react';

interface GovHeaderProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Offerings / Schemes', href: '/', matchExact: true },
  { label: 'Connect', href: '/connect' },
];

export default function GovHeader({ searchQuery = '', onSearchChange }: GovHeaderProps) {
  const pathname = usePathname();

  const openLanguageModal = () => {
    window.dispatchEvent(new Event('openLanguageModal'));
  };

  const isActive = (item: typeof NAV_ITEMS[number]) => {
    if (item.label === 'Offerings / Schemes') {
      return pathname === '/';
    }
    return pathname === item.href;
  };

  return (
    <header className="w-full bg-white shadow-sm relative z-40 font-sans">
      {/* Utility Bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-2 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left: Branding */}
          <Link href="/" className="flex items-center gap-4 shrink-0 hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="Bharat Yojana Since 2026 Logo" className="h-16 w-auto object-contain mix-blend-multiply" />
            <div className="hidden sm:flex flex-col border-l border-gray-300 pl-4 ml-2">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">भारत सरकार</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Government of India</span>
            </div>
          </Link>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-lg w-full relative group mx-4">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search schemes by name, category, or code..." 
              className="w-full pl-11 pr-4 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-600 focus:bg-white bg-gray-50 text-sm transition-all shadow-inner"
            />
            <Search className="absolute left-4 top-2.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={16} />
          </div>

          {/* Center-Right: Swachh Bharat */}
          <div className="hidden xl:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 shrink-0">
            <Glasses size={24} className="text-gray-700" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-orange-600 leading-tight">एक कदम स्वच्छता की ओर</span>
              <span className="text-[10px] text-gray-500 font-medium">Swachh Bharat</span>
            </div>
          </div>

          {/* Far-Right: Accessibility & Language */}
          <div className="flex items-center gap-2 text-gray-700 shrink-0">
            {/* Font Size Controls */}
            <div className="flex bg-gray-100 rounded border border-gray-200 p-0.5">
              <button onClick={() => document.documentElement.style.fontSize = '14px'} className="px-2 hover:bg-white hover:shadow-sm rounded text-[10px] font-bold h-6 flex items-center justify-center" title="Decrease Text Size">A-</button>
              <button onClick={() => document.documentElement.style.fontSize = '16px'} className="px-2 hover:bg-white hover:shadow-sm rounded text-xs font-bold h-6 flex items-center justify-center border-l border-r border-gray-200" title="Normal Text Size">A</button>
              <button onClick={() => document.documentElement.style.fontSize = '18px'} className="px-2 hover:bg-white hover:shadow-sm rounded text-sm font-bold h-6 flex items-center justify-center" title="Increase Text Size">A+</button>
            </div>
            
            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            <button 
              onClick={openLanguageModal} 
              className="flex items-center justify-center px-3 py-1 ml-1 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded border border-blue-200 transition shadow-sm"
              title="Change Language"
            >
              <span className="text-lg font-bold leading-none mb-0.5">अ</span>
              <span className="text-xs text-blue-400 mx-1 font-black">/</span>
              <span className="text-sm font-bold">A</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu Bar */}
      <div className="bg-[#0f2142] border-t border-[#1e3a6e] shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex gap-0 overflow-x-auto text-sm font-medium text-gray-200">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`py-3.5 px-5 whitespace-nowrap transition-colors ${
                isActive(item)
                  ? 'border-b-[3px] border-blue-400 text-white font-bold bg-blue-900/40'
                  : 'border-b-[3px] border-transparent hover:text-white hover:border-gray-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
