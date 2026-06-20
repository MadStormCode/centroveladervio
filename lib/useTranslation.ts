import { useLocale } from '@/components/locale-context';
import { translations } from './translations';

export function useTranslation() {
  const { locale } = useLocale();

  const t = (key: string) => {
    const dict = (translations as Record<string, Record<string, string>>)[locale];
    const fallback = (translations as Record<string, Record<string, string>>).it;
    return dict?.[key] ?? fallback?.[key] ?? key;
  };

  return { t, locale };
}
