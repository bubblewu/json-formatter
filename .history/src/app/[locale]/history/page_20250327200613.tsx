export const runtime = 'edge';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh' },
  ];
}

import HistoryClient from './HistoryClient';

export default function HistoryPage() {
  return <HistoryClient />;
} 