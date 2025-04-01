'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function JsonBasicsPage() {
  const t = useTranslations();
  
  // 动画配置
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  // 示例代码
  const jsonExample = `{
  "name": "John Doe",
  "age": 30,
  "isEmployee": true,
  "address": {
    "street": "123 Main St",
    "city": "Boston",
    "zipCode": "02101"
  },
  "phoneNumbers": [
    "555-1234",
    "555-5678"
  ],
  "languages": ["English", "Spanish"],
  "spouse": null
}`;

  const jsonArrayExample = `[
  {
    "id": 1,
    "name": "Alice",
    "skills": ["JavaScript", "React"]
  },
  {
    "id": 2,
    "name": "Bob",
    "skills": ["Python", "Django"]
  }
]`;

  const jsonStringExample = `"This is a string value in JSON"`;

  const jsonNumberExample = `42
3.14159
-273.15`;

  const jsonBooleanExample = `true
false`;

  const jsonNullExample = `null`;

  // 添加结构化数据  
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': 'JSON基础 - 数据类型、语法和结构',
      'description': '全面了解JSON的基础知识，包括数据类型、语法规则和结构。面向初学者的完整JSON指南，提供丰富示例和最佳实践。',
      'image': 'https://yourwebsite.com/images/json-basics.png',
      'author': {
        '@type': 'Organization',
        'name': 'JSON Formatter',
        'url': 'https://yourwebsite.com'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'JSON Formatter',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://yourwebsite.com/logo.png'
        }
      },
      'datePublished': '2023-04-01T08:00:00+08:00',
      'dateModified': '2023-04-01T08:00:00+08:00',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': 'https://yourwebsite.com/tutorials/json-basics'
      },
      'skill': ['初级', 'JSON', '数据格式']
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <NextSeo
        title="JSON基础 - 数据类型、语法和结构 | 完整指南"
        description="全面了解JSON的基础知识，包括数据类型、语法规则和结构。面向初学者的完整JSON指南，提供丰富示例和最佳实践。"
        canonical="https://yourwebsite.com/tutorials/json-basics"
        openGraph={{
          title: 'JSON基础 - 数据类型、语法和结构 | 完整指南',
          description: '全面了解JSON的基础知识，包括数据类型、语法规则和结构。面向初学者的完整JSON指南，提供丰富示例和最佳实践。',
          images: [{ url: '/images/og-image.png' }],
          type: 'article',
        }}
      />
      
      <Breadcrumb />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <header className="mb-12">
          <div className="flex items-center text-blue-600 dark:text-blue-400 mb-4">
            <span className="text-4xl mr-3">📝</span>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              初级
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            JSON基础 - 数据类型、语法和结构
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            了解JSON的基本概念、语法规则和数据类型，为您的开发工作打下坚实基础。
          </p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <section className="mb-12">
            <h2 className="group flex items-center" id="what-is-json">
              什么是JSON
              <a href="#what-is-json" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              JSON (JavaScript Object Notation) 是一种轻量级的数据交换格式。它易于人阅读和编写，同时也易于机器解析和生成。
              尽管名称中包含"JavaScript"，但JSON是一种独立于语言的文本格式，被众多编程语言所支持。
            </p>
            <p>
              JSON被广泛应用于Web API、配置文件、数据存储和前后端通信中。它已成为替代XML的主流数据交换格式，尤其在构建REST API时更为常见。
            </p>
            <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-blue-700 dark:text-blue-400 font-medium mb-2">JSON的关键特点</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>基于文本，格式简单且人类可读</li>
                <li>与语言无关，几乎所有编程语言都支持</li>
                <li>相比XML更轻量，解析更快</li>
                <li>语法规则简单，容易学习</li>
                <li>支持嵌套结构，可表示复杂数据</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="group flex items-center" id="json-syntax">
              JSON语法规则
              <a href="#json-syntax" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              JSON语法非常简单，基于以下几条规则：
            </p>
            <ul>
              <li>数据是由键值对组成</li>
              <li>数据由逗号分隔</li>
              <li>大括号 <code>{}</code> 保存对象</li>
              <li>方括号 <code>[]</code> 保存数组</li>
              <li>键必须是字符串，且必须使用双引号</li>
              <li>值可以是字符串、数字、对象、数组、布尔值或null</li>
            </ul>
            <p>
              下面是一个完整的JSON对象示例：
            </p>
            <div className="mb-6">
              <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg">
                {jsonExample}
              </SyntaxHighlighter>
            </div>
            <p>
              有效的JSON必须以对象 <code>{}</code> 或数组 <code>[]</code> 开始。不像JavaScript，JSON不支持注释，也不支持尾随逗号。
            </p>
          </section>

          <section className="mb-12">
            <h2 className="group flex items-center" id="json-data-types">
              JSON数据类型
              <a href="#json-data-types" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              JSON支持以下几种数据类型：
            </p>
            
            <h3>字符串 (String)</h3>
            <p>
              字符串是由双引号包围的任何Unicode字符序列。支持转义字符。
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-4">
              {jsonStringExample}
            </SyntaxHighlighter>
            
            <h3>数字 (Number)</h3>
            <p>
              JSON中的数字可以是整数或浮点数。不支持十六进制、八进制表示法，也不支持NaN和Infinity。
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-4">
              {jsonNumberExample}
            </SyntaxHighlighter>
            
            <h3>布尔值 (Boolean)</h3>
            <p>
              布尔值只能是true或false，必须小写。
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-4">
              {jsonBooleanExample}
            </SyntaxHighlighter>
            
            <h3>空值 (null)</h3>
            <p>
              null代表空值或不存在的值。
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-4">
              {jsonNullExample}
            </SyntaxHighlighter>
            
            <h3>对象 (Object)</h3>
            <p>
              对象是包含键值对的无序集合，由大括号 <code>{}</code> 包围。每个键值对由冒号 <code>:</code> 分隔，多个键值对之间用逗号 <code>,</code> 分隔。
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-4" showLineNumbers>
              {`{
  "name": "John Doe",
  "age": 30,
  "isEmployee": true
}`}
            </SyntaxHighlighter>
            
            <h3>数组 (Array)</h3>
            <p>
              数组是有序的值的集合，由方括号 <code>[]</code> 包围。多个值之间用逗号 <code>,</code> 分隔。
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-4">
              {jsonArrayExample}
            </SyntaxHighlighter>
            
            <div className="bg-yellow-50 dark:bg-amber-900 p-4 rounded-lg border-l-4 border-yellow-500 my-6">
              <h4 className="text-yellow-700 dark:text-yellow-400 font-medium mb-2">注意</h4>
              <p className="text-yellow-800 dark:text-yellow-200 mb-0">
                与JavaScript不同，JSON不支持以下内容：
              </p>
              <ul className="list-disc pl-5 space-y-1 text-yellow-800 dark:text-yellow-200">
                <li>函数或方法</li>
                <li>日期对象（需转换为字符串）</li>
                <li>undefined值</li>
                <li>正则表达式</li>
                <li>注释</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="group flex items-center" id="json-structure">
              JSON结构和嵌套
              <a href="#json-structure" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              JSON的强大之处在于它支持嵌套结构，可以构建复杂的数据层次。对象可以包含对象，数组可以包含对象，对象也可以包含数组。
            </p>
            <p>
              这种灵活性使JSON能够表示几乎任何结构化数据：
            </p>
            <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg mb-6" showLineNumbers>
              {`{
  "id": 1,
  "name": "Product Catalog",
  "categories": [
    {
      "id": 101,
      "name": "Electronics",
      "products": [
        {
          "id": 1001,
          "name": "Smartphone",
          "price": 699.99,
          "specs": {
            "cpu": "Octa-core",
            "ram": "8GB",
            "storage": "128GB"
          },
          "inStock": true,
          "colors": ["Black", "White", "Blue"]
        },
        {
          "id": 1002,
          "name": "Laptop",
          "price": 1299.99,
          "specs": {
            "cpu": "Quad-core",
            "ram": "16GB",
            "storage": "512GB SSD"
          },
          "inStock": false,
          "colors": ["Silver", "Gray"]
        }
      ]
    }
  ],
  "lastUpdated": "2023-04-01T10:30:00Z"
}`}
            </SyntaxHighlighter>
            <p>
              这个示例展示了一个包含多层嵌套的产品目录，包括：
            </p>
            <ul>
              <li>顶层对象包含ID、名称、分类数组和更新时间</li>
              <li>分类数组包含分类对象</li>
              <li>每个分类对象包含产品数组</li>
              <li>每个产品对象包含规格对象和颜色数组</li>
            </ul>
            <p>
              这种灵活的嵌套能力是JSON成为通用数据交换格式的关键原因之一。
            </p>
          </section>

          <section className="mb-12">
            <h2 className="group flex items-center" id="common-mistakes">
              常见错误和最佳实践
              <a href="#common-mistakes" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              在使用JSON时，新手常常会犯一些错误。以下是一些常见错误和最佳实践：
            </p>
            
            <h3>常见错误</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <h4 className="text-red-700 dark:text-red-400 font-medium">使用单引号</h4>
                <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg my-2">
                  {`{ 'name': 'John' }`}
                </SyntaxHighlighter>
                <p className="text-red-800 dark:text-red-300 text-sm">
                  错误：JSON中的字符串必须使用双引号
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <h4 className="text-red-700 dark:text-red-400 font-medium">添加尾随逗号</h4>
                <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg my-2">
                  {`{
  "name": "John",
  "age": 30,
}`}
                </SyntaxHighlighter>
                <p className="text-red-800 dark:text-red-300 text-sm">
                  错误：JSON不允许末尾有逗号
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <h4 className="text-red-700 dark:text-red-400 font-medium">不给属性名加引号</h4>
                <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg my-2">
                  {`{
  name: "John"
}`}
                </SyntaxHighlighter>
                <p className="text-red-800 dark:text-red-300 text-sm">
                  错误：JSON中的属性名必须加双引号
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <h4 className="text-red-700 dark:text-red-400 font-medium">使用注释</h4>
                <SyntaxHighlighter language="json" style={atomDark} className="rounded-lg my-2">
                  {`{
  // User info
  "name": "John"
}`}
                </SyntaxHighlighter>
                <p className="text-red-800 dark:text-red-300 text-sm">
                  错误：JSON不支持注释
                </p>
              </div>
            </div>
            
            <h3>最佳实践</h3>
            <ul>
              <li><strong>使用工具验证</strong> - 始终使用JSON验证工具确保您的JSON有效</li>
              <li><strong>适当缩进</strong> - 使用一致的缩进（通常是2或4个空格）提高可读性</li>
              <li><strong>合理命名</strong> - 使用清晰、具有描述性的属性名</li>
              <li><strong>保持结构一致</strong> - 同类对象应保持相同的结构和属性名</li>
              <li><strong>避免过深嵌套</strong> - 尽量限制嵌套层级，通常不超过5层</li>
              <li><strong>使用标准日期格式</strong> - 推荐使用ISO 8601格式（如"2023-04-01T12:00:00Z"）</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="group flex items-center" id="tools-libraries">
              常用JSON工具和库
              <a href="#tools-libraries" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              为了更高效地处理JSON，你可以使用各种工具和库：
            </p>
            
            <h3>在线工具</h3>
            <ul>
              <li><strong>JSON Formatter</strong> - 用于格式化和验证JSON</li>
              <li><strong>JSON Lint</strong> - 严格的JSON验证器</li>
              <li><strong>JSON Path Finder</strong> - 测试JSONPath表达式</li>
              <li><strong>JSON to XML/CSV/YAML Converter</strong> - 转换格式</li>
            </ul>
            
            <h3>编程库</h3>
            <div className="grid md:grid-cols-3 gap-4 my-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">JavaScript</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>JSON.parse() / JSON.stringify()</li>
                  <li>lodash</li>
                  <li>ajv (JSON Schema验证)</li>
                </ul>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Python</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>json模块</li>
                  <li>simplejson</li>
                  <li>jsonschema</li>
                </ul>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Java</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>Jackson</li>
                  <li>Gson</li>
                  <li>org.json</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="group flex items-center" id="conclusion">
              总结
              <a href="#conclusion" className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #
              </a>
            </h2>
            <p>
              JSON是一种简单而强大的数据交换格式，具有简洁的语法和广泛的语言支持。通过本教程，您已经了解了：
            </p>
            <ul>
              <li>JSON的基本概念和用途</li>
              <li>JSON的语法规则和数据类型</li>
              <li>如何构建和嵌套复杂的JSON结构</li>
              <li>常见错误和最佳实践</li>
              <li>用于处理JSON的工具和库</li>
            </ul>
            <p>
              掌握这些基础知识后，您可以更有效地使用JSON进行数据交换、API开发和配置管理。
            </p>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <Link href="/tutorials" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              返回教程列表
            </Link>
            
            <Link href="/tutorials/json-schema" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              下一篇: JSON Schema
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 