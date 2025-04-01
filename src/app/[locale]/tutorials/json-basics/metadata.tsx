import { Metadata } from 'next';
import { TUTORIALS_URL, WEBSITE_URL } from '@/utils/constants';

export function generateMetadata(): Metadata {
  return {
    title: 'JSON基础教程 | 数据类型、语法与结构',
    description: '全面了解JSON基础知识，包括数据类型、语法、结构以及实际应用。面向初学者的详细指南，帮助掌握JSON格式的基本概念。',
    openGraph: {
      title: 'JSON基础教程 | 数据类型、语法与结构',
      description: '全面了解JSON基础知识，包括数据类型、语法、结构以及实际应用。面向初学者的详细指南，帮助掌握JSON格式的基本概念。',
      url: `${TUTORIALS_URL}/json-basics`,
      type: 'website',
      images: [
        {
          url: `${WEBSITE_URL}/images/tutorials/json-basics.png`,
          width: 1200,
          height: 630,
          alt: 'JSON基础教程',
        },
      ],
    },
    alternates: {
      canonical: `${TUTORIALS_URL}/json-basics`,
    },
  };
} 