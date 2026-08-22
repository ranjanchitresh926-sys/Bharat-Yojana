"use client";

import React, { useState, useEffect } from 'react';

const LANGUAGES = [
  { code: 'en-IN', name: 'English', native: 'English' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' }
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('preferredLang');
    if (!stored) {
      setIsOpen(true);
    }
    
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openLanguageModal', handleOpen);
    return () => window.removeEventListener('openLanguageModal', handleOpen);
  }, []);

  const selectLanguage = (code: string) => {
    localStorage.setItem('preferredLang', code);
    window.dispatchEvent(new Event('languageChanged'));
    setIsOpen(false);
  };

  if (!isMounted) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-transform">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Select Your Language</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-gray-400 hover:text-gray-800 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className="flex flex-col items-center justify-center p-4 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <span className="text-2xl mb-2 group-hover:text-blue-600 font-medium">{lang.native}</span>
                  <span className="text-sm text-gray-500 font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
