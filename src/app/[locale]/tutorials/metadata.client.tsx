"use client";

import { useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { TUTORIALS_URL } from '@/utils/constants';

const tutorials = [
  {
    id: 'json-basics',
    title: 'JSON基础',
    description: '了解JSON的语法、数据类型和结构',
    icon: '📝',
    level: '初级',
    category: 'basic',
    available: true
  },
  {
    id: 'json-schema',
    title: 'JSON Schema',
    description: '学习使用JSON Schema验证JSON数据的方法',
    icon: '🔍',
    level: '中级',
    category: 'advanced',
    available: true
  },
  {
    id: 'json-vs-xml',
    title: 'JSON与XML比较',
    description: '了解JSON和XML的区别以及何时使用它们',
    icon: '⚖️',
    level: '初级',
    category: 'basic',
    available: true
  },
  {
    id: 'json-formats',
    title: 'JSON格式化最佳实践',
    description: '格式化JSON数据的技巧和最佳实践',
    icon: '✨',
    level: '初级',
    category: 'basic',
    available: true
  },
  {
    id: 'json-localstorage',
    title: 'JSON与LocalStorage',
    description: '使用JSON和LocalStorage在浏览器中存储数据',
    icon: '💾',
    level: '初级',
    category: 'basic',
    available: true
  }
];

export default function MetadataClient() {
  // 添加结构化数据  
  useEffect(() => {
    // 添加动画样式
    const fadeUpAnimation = `
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(100%);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-fade-up {
        animation: fadeUp 0.3s ease-out forwards;
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.innerHTML = fadeUpAnimation;
    document.head.appendChild(styleElement);
    
    // 添加结构化数据
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'itemListElement': tutorials.map((tutorial, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Article',
          'name': tutorial.title,
          'description': tutorial.description,
          'url': `/tutorials/${tutorial.id}`
        }
      }))
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return (
    <NextSeo
      title="JSON教程 - 从基础到高级的完整指南"
      description="全面的JSON教程和指南，涵盖基础语法、高级技巧、最佳实践和格式转换。适合初学者和专业开发者的JSON学习资源。"
      canonical={TUTORIALS_URL}
      openGraph={{
        title: 'JSON教程 - 从基础到高级的完整指南',
        description: '全面的JSON教程和指南，涵盖基础语法、高级技巧、最佳实践和格式转换。适合初学者和专业开发者的JSON学习资源。',
        images: [{ url: '/images/og-image.png' }],
      }}
    />
  );
} 