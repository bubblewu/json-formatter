'use client';

import { useTranslations } from 'next-intl';
import JsonFormatter from '@/app/components/JsonFormatter';

export default function Home() {
  const t = useTranslations();

  return (
    <div className="container-apple py-6 md:py-12 min-h-[calc(100vh-150px)]">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
          {t('app.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {t('app.tagline')}
        </p>
      </div>

      <div className="h-[calc(100vh-350px)] min-h-[500px]">
        <JsonFormatter />
      </div>
    </div>
  );
} 