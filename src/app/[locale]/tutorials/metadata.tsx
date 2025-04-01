import { Metadata } from 'next';
import { TUTORIALS_URL, WEBSITE_URL } from '@/utils/constants';

export function generateMetadata(): Metadata {
  return {
    title: 'JSON教程与指南 | 从基础到高级',
    description: '探索我们全面的JSON教程集合，从基础知识到高级技术应用。包括数据类型、结构、验证、最佳实践和实用工具的详细指南。',
    openGraph: {
      title: 'JSON教程与指南 | 从基础到高级',
      description: '探索我们全面的JSON教程集合，从基础知识到高级技术应用。包括数据类型、结构、验证、最佳实践和实用工具的详细指南。',
      url: `${TUTORIALS_URL}`,
      type: 'website',
      images: [
        {
          url: `${WEBSITE_URL}/images/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'JSON教程与指南',
        },
      ],
    },
    alternates: {
      canonical: `${TUTORIALS_URL}`,
    },
  };
} 