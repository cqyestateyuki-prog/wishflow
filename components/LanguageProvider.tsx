'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Language } from '../lib/i18n';

const STORAGE_KEY = 'wishflow:lang';

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  language: Language; // Alias for consistency
  setLanguage: (lang: Language) => void; // Alias for consistency
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === 'en' || stored === 'zh') {
      setLangState(stored);
    }
  }, []);

  const setLang = (next: Language) => {
    setLangState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const value = useMemo(() => ({ 
    lang, 
    setLang,
    language: lang, // Alias
    setLanguage: setLang, // Alias
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
