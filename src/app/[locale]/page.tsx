'use client';

import { useTranslations } from 'next-intl';
import JsonFormatter from '@/components/JsonFormatter';
import StructuredData from '@/components/StructuredData';

export default function Home() {
  const t = useTranslations();
  
  return (
    <>
      <StructuredData />
      <JsonFormatter />
    </>
  );
}
