"use client";

import { useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { WEBSITE_URL, TUTORIALS_URL, METADATA } from '@/utils/constants';

export default function MetadataClient() {
  // 添加结构化数据  
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': 'JSON基础 - 数据类型、语法和结构',
      'description': '全面了解JSON的基础知识，包括数据类型、语法规则和结构。面向初学者的完整JSON指南，提供丰富示例和最佳实践。',
      'image': METADATA.IMAGES.JSON_BASICS,
      'author': {
        '@type': 'Organization',
        'name': 'JSON Formatter',
        'url': WEBSITE_URL
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'JSON Formatter',
        'logo': {
          '@type': 'ImageObject',
          'url': METADATA.LOGO_URL
        }
      },
      'datePublished': '2023-04-01T08:00:00+08:00',
      'dateModified': '2023-04-01T08:00:00+08:00',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${TUTORIALS_URL}/json-basics`
      },
      'skill': ['初级', 'JSON', '数据格式']
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return (
    <NextSeo
      title="JSON基础 - 数据类型、语法和结构 | 完整指南"
      description="全面了解JSON的基础知识，包括数据类型、语法规则和结构。面向初学者的完整JSON指南，提供丰富示例和最佳实践。"
      canonical={`${TUTORIALS_URL}/json-basics`}
      openGraph={{
        title: 'JSON基础 - 数据类型、语法和结构 | 完整指南',
        description: '全面了解JSON的基础知识，包括数据类型、语法规则和结构。面向初学者的完整JSON指南，提供丰富示例和最佳实践。',
        images: [{ url: '/images/og-image.png' }],
        type: 'article',
      }}
    />
  );
} 