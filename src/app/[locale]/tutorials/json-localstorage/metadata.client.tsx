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
      'headline': 'JSON与LocalStorage - 客户端数据存储指南',
      'description': '学习如何使用JSON格式与LocalStorage结合，实现Web应用中的客户端数据存储、检索和管理。',
      'image': METADATA.IMAGES.JSON_LOCALSTORAGE,
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
        '@id': `${TUTORIALS_URL}/json-localstorage`
      },
      'skill': ['中级', 'JSON', '前端开发', 'LocalStorage']
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return (
    <NextSeo
      title="JSON与LocalStorage - 客户端数据存储指南"
      description="学习如何使用JSON格式与LocalStorage结合，实现Web应用中的客户端数据存储、检索和管理。"
      canonical={`${TUTORIALS_URL}/json-localstorage`}
      openGraph={{
        title: 'JSON与LocalStorage - 客户端数据存储指南',
        description: '学习如何使用JSON格式与LocalStorage结合，实现Web应用中的客户端数据存储、检索和管理。',
        images: [{ url: '/images/json-localstorage.png' }],
        type: 'article',
      }}
    />
  );
} 