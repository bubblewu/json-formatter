'use client';

import Script from 'next/script';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function StructuredData() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  
  // 获取当前日期（格式：YYYY-MM-DD）
  const currentDate = new Date().toISOString().split('T')[0];
  
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            'name': t('title'),
            'description': t('description'),
            'applicationCategory': 'DeveloperApplication',
            'operatingSystem': 'All',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD'
            },
            'url': `https://json-formatter.vercel.app/${locale}`,
            'inLanguage': locale,
            'datePublished': '2023-01-01',
            'dateModified': currentDate,
            'author': {
              '@type': 'Organization',
              'name': 'JSON格式化工具',
              'url': 'https://json-formatter.vercel.app'
            },
            'featureList': [
              t('subtitle'),
              'JSON Format',
              'JSON Validation',
              'JSON Compress',
              'JSON Unescape',
            ],
            'review': {
              '@type': 'Review',
              'reviewRating': {
                '@type': 'Rating',
                'ratingValue': '5',
                'bestRating': '5'
              },
              'author': {
                '@type': 'Person',
                'name': 'Web开发用户'
              }
            },
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.8',
              'ratingCount': '1024',
              'bestRating': '5',
              'worstRating': '1'
            },
            'potentialAction': {
              '@type': 'UseAction',
              'target': `https://json-formatter.vercel.app/${locale}`
            }
          })
        }}
      />
    </>
  );
} 