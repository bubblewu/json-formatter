import { Metadata } from 'next';
import { TUTORIALS_URL, WEBSITE_URL } from '@/utils/constants';

export function generateMetadata(): Metadata {
  return {
    title: 'JSON Schema教程 | 数据验证完整指南',
    description: '全面学习JSON Schema，掌握如何验证和描述JSON数据结构。包括基础概念、验证关键字、高级用法和实用示例的详细指南。',
    openGraph: {
      title: 'JSON Schema教程 | 数据验证完整指南',
      description: '全面学习JSON Schema，掌握如何验证和描述JSON数据结构。包括基础概念、验证关键字、高级用法和实用示例的详细指南。',
      url: `${TUTORIALS_URL}/json-schema`,
      type: 'website',
      images: [
        {
          url: `${WEBSITE_URL}/images/tutorials/json-schema.png`,
          width: 1200,
          height: 630,
          alt: 'JSON Schema教程',
        },
      ],
    },
    alternates: {
      canonical: `${TUTORIALS_URL}/json-schema`,
    },
  };
} 