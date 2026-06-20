'use client';

import { useTranslation } from '@/lib/useTranslation';

export function T({ k }: { k: string }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}
