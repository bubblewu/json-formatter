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
      'headline': 'JSON Schema教程 - 验证和描述JSON数据结构',
      'description': '学习使用JSON Schema验证和描述JSON数据结构，包括基本概念、验证规则和实际应用',
      'image': METADATA.IMAGES.JSON_SCHEMA,
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
        '@id': `${TUTORIALS_URL}/json-schema`
      },
      'skill': ['中级', 'JSON', '数据验证']
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return (
    <NextSeo
      title="JSON Schema教程 - 验证和描述JSON数据结构"
      description="学习使用JSON Schema验证和描述JSON数据结构，包括基本概念、验证规则和实际应用"
      canonical={`${TUTORIALS_URL}/json-schema`}
      openGraph={{
        title: 'JSON Schema教程 - 验证和描述JSON数据结构',
        description: '学习使用JSON Schema验证和描述JSON数据结构，包括基本概念、验证规则和实际应用',
        images: [{ url: '/images/json-schema.png' }],
        type: 'article',
      }}
    />
  );
} 