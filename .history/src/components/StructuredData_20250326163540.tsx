'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function StructuredData() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('title'),
    description: t('description'),
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: `https://json-formatter.vercel.app/${locale}`,
    inLanguage: locale,
    featureList: [
      t('subtitle'),
      'JSON Format',
      'JSON Validation',
      'JSON Compress',
      'JSON Unescape',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 