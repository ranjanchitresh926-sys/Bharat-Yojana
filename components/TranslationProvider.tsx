"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTranslations, TranslationSet } from '../lib/translations';

interface TranslationContextType {
  t: TranslationSet;
  lang: string;
}

const TranslationContext = createContext<TranslationContextType>({
  t: getTranslations('en-IN'),
  lang: 'en-IN'
});

export const useTranslation = () => useContext(TranslationContext);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState('en-IN');
  const [t, setT] = useState<TranslationSet>(getTranslations('en-IN'));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateLang = () => {
      const stored = localStorage.getItem('preferredLang') || 'en-IN';
      setLang(stored);
      setT(getTranslations(stored));
    };
    updateLang();
    setMounted(true);
    
    window.addEventListener('languageChanged', updateLang);
    return () => window.removeEventListener('languageChanged', updateLang);
  }, []);

  // Prevent hydration mismatch by not rendering until we know the client language,
  // OR render with English and accept a small flash. We will render children directly
  // to avoid blocking the whole app, but use mounted state if needed by specific components.
  // The small flash is acceptable and better than a blank screen.

  return (
    <TranslationContext.Provider value={{ t, lang }}>
      {children}
    </TranslationContext.Provider>
  );
}
