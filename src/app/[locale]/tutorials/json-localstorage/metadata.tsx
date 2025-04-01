import { Metadata } from 'next';
import { TUTORIALS_URL, WEBSITE_URL } from '@/utils/constants';

export function generateMetadata(): Metadata {
  return {
    title: 'JSON与LocalStorage教程 | 前端数据存储指南',
    description: '学习如何使用LocalStorage存储和管理JSON数据。包括基本API、序列化与反序列化、存储限制以及最佳实践的完整教程。',
    openGraph: {
      title: 'JSON与LocalStorage教程 | 前端数据存储指南',
      description: '学习如何使用LocalStorage存储和管理JSON数据。包括基本API、序列化与反序列化、存储限制以及最佳实践的完整教程。',
      url: `${TUTORIALS_URL}/json-localstorage`,
      type: 'website',
      images: [
        {
          url: `${WEBSITE_URL}/images/tutorials/json-localstorage.png`,
          width: 1200,
          height: 630,
          alt: 'JSON与LocalStorage教程',
        },
      ],
    },
    alternates: {
      canonical: `${TUTORIALS_URL}/json-localstorage`,
    },
  };
} 