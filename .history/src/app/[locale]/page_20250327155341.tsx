'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import StructuredData from '@/components/common/StructuredData';

// 动态导入JsonFormatter组件以减少初始加载体积
const JsonFormatter = dynamic(() => import('@/components/formatter'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});

export default function Home() {
  const t = useTranslations();
  
  return (
    <>
      <StructuredData />
      <JsonFormatter />
    </>
  );
}
