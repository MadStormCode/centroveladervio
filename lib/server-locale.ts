import { cookies } from 'next/headers';
import { translations } from './translations';

export function getLocale(): 'it' | 'en' {
  try {
    const c = cookies();
    const val = c.get('cv-locale')?.value;
    if (val === 'en') return 'en';
  } catch {
    // Fallback if cookies() not available
  }
  return 'it';
}

export function serverT(locale: 'it' | 'en', key: string): string {
  const dict = (translations as any)[locale];
  return dict?.[key] ?? (translations as any).it?.[key] ?? key;
}
