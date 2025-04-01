'use client';

import Script from 'next/script';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function StructuredData() {
  const t = useTranslations();
  const pathname = usePathname();
  
  // 安全提取locale，确保其有效
  const pathParts = pathname.split('/');
  // 避免将静态资源路径解析为locale
  let locale = 'en';
  if (pathParts.length > 1 && /^[a-z]{2}$/.test(pathParts[1])) {
    locale = pathParts[1];
  }
  
  // 获取当前日期（格式：YYYY-MM-DD）
  const currentDate = new Date().toISOString().split('T')[0];
  const baseUrl = 'https://jsonformatplus.com';
  
  // 提取路径，用于breadcrumb
  const path = pathname.replace(/^\/[a-z]{2}/, '');
  const segments = path.split('/').filter(Boolean);
  
  // 构建面包屑结构化数据
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": t('breadcrumb.home'),
        "item": `${baseUrl}/${locale}`
      },
      ...segments.map((segment, index) => {
        let name = '';
        try {
          name = t(`breadcrumb.${segment}`);
        } catch (error) {
          name = segment.charAt(0).toUpperCase() + segment.slice(1);
        }
        
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": name,
          "item": `${baseUrl}/${locale}/${segments.slice(0, index + 1).join('/')}`
        };
      })
    ]
  };
  
  // 主要结构化数据
  const webAppData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": t('title'),
    "description": t('description'),
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "url": `${baseUrl}/${locale}`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "JSON Formatting",
      "JSON Validation",
      "JSON Minification",
      "JSON to XML",
      "JSON to CSV",
      "JSON to YAML",
      "JSON to Java",
      "JSON to C#",
      "JSON to TypeScript",
      "Multi-language support",
      "Dark mode",
      "History tracking"
    ],
    "screenshot": `${baseUrl}/og-image.png`,
    "softwareVersion": "1.1.0",
    "author": {
      "@type": "Organization",
      "name": "JSON Format Plus",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "JSON Format Plus",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1850",
      "bestRating": "5",
      "worstRating": "1"
    },
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/UseAction",
      "userInteractionCount": "325000"
    },
    "datePublished": "2023-01-01",
    "dateModified": currentDate,
    "keywords": "JSON formatter, JSON validator, JSON beautifier, JSON editor, JSON converter"
  };
  
  // FAQ结构化数据
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is JSON?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "JSON (JavaScript Object Notation) is a lightweight data interchange format. It is based on JavaScript language but is language-independent. JSON is easy for humans to read and write and easy for machines to parse and generate."
        }
      },
      {
        "@type": "Question",
        "name": "How to use the JSON formatter tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply paste your JSON data in the editor on the left and click the 'Format' button. Your JSON will be automatically formatted and any syntax errors will be highlighted."
        }
      },
      {
        "@type": "Question",
        "name": "Is the JSON formatter tool free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our JSON formatter tool is completely free to use without any registration or software installation required."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all processing is done in your browser and no data is sent to our servers."
        }
      },
      {
        "@type": "Question",
        "name": "What formats can I convert JSON to?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can convert JSON to XML, CSV, YAML, Java, C#, TypeScript, Python, PHP, and more programming languages for easy integration with your projects."
        }
      },
      {
        "@type": "Question",
        "name": "Can I save my JSON for later use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can save your JSON data to your browser's local storage through our History feature, allowing you to access it later without having to copy-paste again."
        }
      }
    ]
  };

  // 网站结构化数据
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "JSON Format Plus",
    "alternateName": "JSONFormatPlus",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/${locale}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://twitter.com/jsonformatplus",
      "https://github.com/jsonformatplus",
      "https://www.facebook.com/jsonformatplus"
    ]
  };

  return (
    <>
      <Script
        id="structured-data-webapp"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppData) }}
      />
      <Script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <Script
        id="structured-data-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <Script
        id="structured-data-website"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  );
} 