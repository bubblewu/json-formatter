'use client';

import Script from 'next/script';
import { useTranslations } from 'next-intl';

export default function StructuredData() {
  const t = useTranslations();
  
  // 获取当前日期（格式：YYYY-MM-DD）
  const currentDate = new Date().toISOString().split('T')[0];
  
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
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
            'datePublished': '2023-01-01',
            'dateModified': currentDate,
            'author': {
              '@type': 'Organization',
              'name': 'JSON格式化工具',
              'url': 'https://jsonformatter.example.com'
            },
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
              'target': {
                '@type': 'EntryPoint',
                'urlTemplate': 'https://jsonformatter.example.com'
              }
            }
          })
        }}
      />
    </>
  );
} 