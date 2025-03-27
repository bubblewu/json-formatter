'use client';

import { useTranslations } from 'next-intl';
import JsonFormatter from '@/components/JsonFormatter';
import StructuredData from '@/components/StructuredData';

export default function Home() {
  const t = useTranslations();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StructuredData />
      <main className="container mx-auto px-4 py-8">
        <JsonFormatter />
      </main>
      <footer className="py-6 px-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
