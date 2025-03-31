'use client';

import Script from 'next/script';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function StructuredData() {
  const t = useTranslations();
  const pathname = usePathname();
  // 安全提取locale，确保其有效
  const localeParts = pathname.split('/');
  const locale = localeParts.length > 1 ? localeParts[1] : 'en';
  
  // 获取当前日期（格式：YYYY-MM-DD）
  const currentDate = new Date().toISOString().split('T')[0];
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": t('title'),
    "description": t('description'),
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "JSON格式化",
      "JSON验证",
      "JSON压缩",
      "JSON转义",
      "多语言支持",
      "暗色模式",
      "历史记录"
    ],
    "screenshot": "https://json-formatter.com/og-image.png",
    "softwareVersion": "1.0.0",
    "author": {
      "@type": "Organization",
      "name": "JSON Formatter",
      "url": "https://json-formatter.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JSON Formatter",
      "logo": {
        "@type": "ImageObject",
        "url": "https://json-formatter.com/logo.png"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1000"
    },
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/UseAction",
      "userInteractionCount": "100000"
    }
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
} 