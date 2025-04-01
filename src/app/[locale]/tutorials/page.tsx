'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

const tutorials = [
  {
    id: 'json-basics',
    title: 'JSON基础',
    description: '了解JSON的语法、数据类型和结构',
    icon: '📝',
    level: '初级',
    category: 'basic'
  },
  {
    id: 'json-schema',
    title: 'JSON Schema',
    description: '学习使用JSON Schema验证JSON数据的方法',
    icon: '🔍',
    level: '中级',
    category: 'advanced'
  },
  {
    id: 'json-vs-xml',
    title: 'JSON与XML比较',
    description: '了解JSON和XML的区别以及何时使用它们',
    icon: '⚖️',
    level: '初级',
    category: 'basic'
  },
  {
    id: 'json-path',
    title: 'JSONPath查询',
    description: '使用JSONPath查询和操作JSON数据',
    icon: '🔎',
    level: '中级',
    category: 'advanced'
  },
  {
    id: 'json-api',
    title: 'JSON API设计',
    description: '学习设计和构建基于JSON的API',
    icon: '🌐',
    level: '高级',
    category: 'advanced'
  },
  {
    id: 'json-formats',
    title: 'JSON格式化最佳实践',
    description: '格式化JSON数据的技巧和最佳实践',
    icon: '✨',
    level: '初级',
    category: 'basic'
  },
  {
    id: 'json-to-code',
    title: 'JSON转代码',
    description: '将JSON数据转换为各种编程语言的代码',
    icon: '💻',
    level: '中级',
    category: 'conversion'
  },
  {
    id: 'json-localstorage',
    title: 'JSON与LocalStorage',
    description: '使用JSON和LocalStorage在浏览器中存储数据',
    icon: '💾',
    level: '初级',
    category: 'basic'
  }
];

export default function TutorialsPage() {
  const t = useTranslations();
  
  // 动画配置
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  // 教程分类
  const categories = {
    basic: {
      name: '基础知识',
      description: 'JSON的基本概念和使用方法'
    },
    advanced: {
      name: '高级技巧',
      description: '深入了解JSON的高级应用和技术'
    },
    conversion: {
      name: '转换技术',
      description: 'JSON与其他格式的转换方法和工具'
    }
  };
  
  // 按分类分组教程
  const tutorialsByCategory = tutorials.reduce((acc, tutorial) => {
    if (!acc[tutorial.category]) {
      acc[tutorial.category] = [];
    }
    acc[tutorial.category].push(tutorial);
    return acc;
  }, {} as Record<string, typeof tutorials>);
  
  useEffect(() => {
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
    };
  }, []);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <NextSeo
        title="JSON教程 - 从基础到高级的完整指南"
        description="全面的JSON教程和指南，涵盖基础语法、高级技巧、最佳实践和格式转换。适合初学者和专业开发者的JSON学习资源。"
        canonical="https://yourwebsite.com/tutorials"
        openGraph={{
          title: 'JSON教程 - 从基础到高级的完整指南',
          description: '全面的JSON教程和指南，涵盖基础语法、高级技巧、最佳实践和格式转换。适合初学者和专业开发者的JSON学习资源。',
          images: [{ url: '/images/og-image.png' }],
        }}
      />
      
      <Breadcrumb />
      
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          JSON教程中心
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          从基础到高级的完整JSON指南，帮助您掌握JSON数据格式的使用和最佳实践。
        </p>
      </header>
      
      <section className="mb-16">
        <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-blue-100 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400">为什么学习JSON?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm">
              <div className="text-3xl mb-2">🌐</div>
              <h3 className="font-medium text-lg mb-2">网络标准</h3>
              <p className="text-gray-600 dark:text-gray-300">JSON是现代Web API和数据交换的标准格式，几乎所有编程语言都支持。</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-medium text-lg mb-2">轻量高效</h3>
              <p className="text-gray-600 dark:text-gray-300">相比XML等格式，JSON更轻量、解析更快，是前后端数据传输的理想选择。</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm">
              <div className="text-3xl mb-2">🛠️</div>
              <h3 className="font-medium text-lg mb-2">工具丰富</h3>
              <p className="text-gray-600 dark:text-gray-300">丰富的工具生态系统使处理JSON变得简单，从验证到转换都有专门工具。</p>
            </div>
          </div>
        </div>
      </section>
      
      {Object.entries(tutorialsByCategory).map(([category, categoryTutorials]) => (
        <section key={category} className="mb-16">
          <div className="border-b pb-2 mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {categories[category as keyof typeof categories].name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {categories[category as keyof typeof categories].description}
              </p>
            </div>
          </div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categoryTutorials.map((tutorial) => (
              <motion.div 
                key={tutorial.id}
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <Link href={`/tutorials/${tutorial.id}`} className="block p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">{tutorial.icon}</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {tutorial.level}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-white">{tutorial.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{tutorial.description}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      ))}
      
      <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">还没找到你要的教程？</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            我们正在不断添加新的教程内容。如果你有特定主题的需求，请告诉我们！
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            请求教程主题
          </Link>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">常见JSON问题</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-4 cursor-pointer bg-white dark:bg-gray-800">
                <h3 className="font-medium">JSON和JavaScript对象有什么区别？</h3>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <p className="text-gray-600 dark:text-gray-300">
                  虽然JSON基于JavaScript对象语法，但它们有几个关键区别：
                  JSON是纯文本格式，而JavaScript对象是活动实体；
                  JSON键必须用双引号包围，JavaScript对象可以不用；
                  JSON不支持函数或方法，而JavaScript对象可以包含方法；
                  JSON不允许注释，JavaScript对象可以。
                </p>
              </div>
            </details>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-4 cursor-pointer bg-white dark:bg-gray-800">
                <h3 className="font-medium">如何验证我的JSON是否有效？</h3>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <p className="text-gray-600 dark:text-gray-300">
                  您可以使用我们的JSON验证工具来检查JSON的有效性。常见错误包括：
                  缺少或多余的逗号、引号不匹配、使用单引号而非双引号、属性名未加引号等。
                  有效的JSON必须遵循严格的语法规则，我们的工具会帮您找出并修复错误。
                </p>
              </div>
            </details>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-4 cursor-pointer bg-white dark:bg-gray-800">
                <h3 className="font-medium">JSON支持哪些数据类型？</h3>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <p className="text-gray-600 dark:text-gray-300">
                  JSON支持六种数据类型：
                  字符串（用双引号包围）、数字（整数或浮点数）、布尔值（true或false）、
                  数组（有序值集合）、对象（键值对集合）和null。
                  JSON不直接支持日期、函数、undefined或正则表达式等类型。
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>
      
      <section>
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">相关工具</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              href="/beautify"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-2xl mr-3">✨</span>
              <span>JSON格式化</span>
            </Link>
            <Link 
              href="/minify"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-2xl mr-3">📦</span>
              <span>JSON压缩</span>
            </Link>
            <Link 
              href="/validate"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-2xl mr-3">✅</span>
              <span>JSON验证</span>
            </Link>
            <Link 
              href="/json-to-xml"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-2xl mr-3">🔄</span>
              <span>JSON转XML</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 