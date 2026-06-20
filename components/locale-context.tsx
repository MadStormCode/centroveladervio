'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type Locale = 'it' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (it: string, en: string) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'it',
  setLocale: () => {},
  t: (it: string) => it,
});

export function useLocale() {
  return useContext(LocaleContext);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('it');

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cv-locale', newLocale);
    }
  }, []);

  const t = useCallback((it: string, en: string) => {
    return locale === 'en' ? en : it;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
