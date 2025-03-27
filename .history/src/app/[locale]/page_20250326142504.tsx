'use client';

import { useTranslations } from 'next-intl';
import JsonFormatter from '@/components/JsonFormatter';

export default function Home() {
  const t = useTranslations();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <JsonFormatter />
      </main>
    </div>
  );
}
