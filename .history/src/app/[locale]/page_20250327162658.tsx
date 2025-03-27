'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import StructuredData from '@/components/StructuredData';

// 动态导入JsonFormatter组件以减少初始加载体积
const JsonFormatter = dynamic(() => import('@/components/JsonFormatter'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
  ssr: false // 禁用SSR，因为Monaco编辑器依赖浏览器API
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
