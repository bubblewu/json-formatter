'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function TutorialsPage() {
  const t = useTranslations();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const params = useParams();
  const locale = params.locale as string;
  
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

  const tutorials = [
    {
      id: 'json-basics',
      title: t('breadcrumb.json-basics'),
      description: t('basics.introduction.description').split('.')[0],
      icon: '📝',
      level: t('tutorialsPage.levels.beginner', { defaultMessage: '初级' }),
      category: 'basic',
      available: true
    },
    {
      id: 'json-schema',
      title: t('breadcrumb.json-schema'),
      description: t('schema.pageDescription'),
      icon: '🔍',
      level: t('tutorialsPage.levels.intermediate', { defaultMessage: '中级' }),
      category: 'advanced',
      available: true
    },
    {
      id: 'json-vs-xml',
      title: t('breadcrumb.json-vs-xml'),
      description: t('xmlcompare.introduction.description').split('.')[0],
      icon: '⚖️',
      level: t('tutorialsPage.levels.beginner', { defaultMessage: '初级' }),
      category: 'basic',
      available: true
    },
    {
      id: 'json-path',
      title: t('breadcrumb.json-path'),
      description: t('jsonPath.description', { defaultMessage: '使用JSONPath查询和操作JSON数据' }),
      icon: '🔎',
      level: t('tutorialsPage.levels.intermediate', { defaultMessage: '中级' }),
      category: 'advanced',
      available: false
    },
    {
      id: 'json-api',
      title: t('breadcrumb.json-api'),
      description: t('jsonApi.description', { defaultMessage: '学习设计和构建基于JSON的API' }),
      icon: '🌐',
      level: t('tutorialsPage.levels.advanced', { defaultMessage: '高级' }),
      category: 'advanced',
      available: false
    },
    {
      id: 'json-formats',
      title: t('breadcrumb.json-formats'),
      description: t('formats.introduction.description').split('.')[0],
      icon: '✨',
      level: t('tutorialsPage.levels.beginner', { defaultMessage: '初级' }),
      category: 'basic',
      available: true
    },
    {
      id: 'json-to-code',
      title: t('breadcrumb.json-to-code'),
      description: t('jsonToCode.description', { defaultMessage: '将JSON数据转换为各种编程语言的代码' }),
      icon: '💻',
      level: t('tutorialsPage.levels.intermediate', { defaultMessage: '中级' }),
      category: 'conversion',
      available: false
    },
    {
      id: 'json-localstorage',
      title: t('breadcrumb.json-localstorage'),
      description: t('localstorage.introduction.description').split('.')[0],
      icon: '💾',
      level: t('tutorialsPage.levels.beginner', { defaultMessage: '初级' }),
      category: 'basic',
      available: true
    }
  ];
  
  // 教程分类
  const categories = {
    basic: {
      name: t('categories.basic.name', { defaultMessage: '基础知识' }),
      description: t('categories.basic.description', { defaultMessage: 'JSON的基本概念和使用方法' })
    },
    advanced: {
      name: t('categories.advanced.name', { defaultMessage: '高级技巧' }),
      description: t('categories.advanced.description', { defaultMessage: '深入了解JSON的高级应用和技术' })
    },
    conversion: {
      name: t('categories.conversion.name', { defaultMessage: '转换技术' }),
      description: t('categories.conversion.description', { defaultMessage: 'JSON与其他格式的转换方法和工具' })
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
  
  // 处理教程点击
  const handleTutorialClick = (e: React.MouseEvent, tutorial: typeof tutorials[0]) => {
    if (!tutorial.available) {
      e.preventDefault();
      setShowTooltip(tutorial.id);
      setTimeout(() => setShowTooltip(null), 3000);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          {t('tutorials')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('tutorialsPage.description', { defaultMessage: '通过我们的教程和指南，从基础到高级掌握JSON。无论您是初学者还是专业开发者，这里都有适合您的内容。' })}
        </p>
      </header>
      
      <section className="mb-16">
        <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-blue-100 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400">{t('tutorialsPage.whyLearnJson', { defaultMessage: '为什么学习JSON?' })}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm">
              <div className="text-3xl mb-2">🌐</div>
              <h3 className="font-medium text-lg mb-2">{t('tutorialsPage.webStandard', { defaultMessage: '网络标准' })}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('tutorialsPage.webStandardDesc', { defaultMessage: 'JSON是现代Web API和数据交换的标准格式，几乎所有编程语言都支持。' })}</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-medium text-lg mb-2">{t('tutorialsPage.lightweight', { defaultMessage: '轻量高效' })}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('tutorialsPage.lightweightDesc', { defaultMessage: '相比XML等格式，JSON更轻量、解析更快，是前后端数据传输的理想选择。' })}</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm">
              <div className="text-3xl mb-2">🛠️</div>
              <h3 className="font-medium text-lg mb-2">{t('tutorialsPage.richTools', { defaultMessage: '工具丰富' })}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('tutorialsPage.richToolsDesc', { defaultMessage: '丰富的工具生态系统使处理JSON变得简单，从验证到转换都有专门工具。' })}</p>
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
                className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 relative ${!tutorial.available ? 'cursor-not-allowed' : ''}`}
              >
                <Link 
                  href={tutorial.available ? `/${locale}/tutorials/${tutorial.id}` : '#'} 
                  className={`block p-6 ${!tutorial.available ? 'opacity-80' : ''}`}
                  onClick={(e) => handleTutorialClick(e, tutorial)}
                >
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">{tutorial.icon}</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {tutorial.level}
                    </span>
                    {!tutorial.available && (
                      <span className="ml-auto text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        {t('tutorialsPage.comingSoon', { defaultMessage: '即将推出' })}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-white">{tutorial.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{tutorial.description}</p>
                </Link>
                
                {showTooltip === tutorial.id && (
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white py-2 px-4 text-center transform translate-y-0 animate-fade-up">
                    {t('tutorialsPage.tooltipComingSoon', { defaultMessage: '此教程正在创建中，敬请期待！' })}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>
      ))}
      
      {/* <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            {t('tutorialsPage.notFound', { defaultMessage: '还没找到你要的教程？' })}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('tutorialsPage.addingMore', { defaultMessage: '我们正在不断添加新的教程内容。如果你有特定主题的需求，请告诉我们！' })}
          </p>
          <Link 
            href={`/${locale}/contact`} 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            {t('tutorialsPage.requestTopic', { defaultMessage: '请求教程主题' })}
          </Link>
        </div>
      </section> */}
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          {t('tutorialsPage.commonQuestions', { defaultMessage: '常见JSON问题' })}
        </h2>
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-4 cursor-pointer bg-white dark:bg-gray-800">
                <h3 className="font-medium">
                  {t('tutorialsPage.questions.jsObjectDiff.question', { defaultMessage: 'JSON和JavaScript对象有什么区别？' })}
                </h3>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <p className="text-gray-600 dark:text-gray-300">
                  {t('tutorialsPage.questions.jsObjectDiff.answer', { defaultMessage: '虽然JSON基于JavaScript对象语法，但它们有几个关键区别：JSON是纯文本格式，而JavaScript对象是活动实体；JSON键必须用双引号包围，JavaScript对象可以不用；JSON不支持函数或方法，而JavaScript对象可以包含方法；JSON不允许注释，JavaScript对象可以。' })}
                </p>
              </div>
            </details>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-4 cursor-pointer bg-white dark:bg-gray-800">
                <h3 className="font-medium">
                  {t('tutorialsPage.questions.validation.question', { defaultMessage: '如何验证我的JSON是否有效？' })}
                </h3>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <p className="text-gray-600 dark:text-gray-300">
                  {t('tutorialsPage.questions.validation.answer', { defaultMessage: '您可以使用我们的JSON验证工具来检查JSON的有效性。常见错误包括：缺少或多余的逗号、引号不匹配、使用单引号而非双引号、属性名未加引号等。有效的JSON必须遵循严格的语法规则，我们的工具会帮您找出并修复错误。' })}
                </p>
              </div>
            </details>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center p-4 cursor-pointer bg-white dark:bg-gray-800">
                <h3 className="font-medium">
                  {t('tutorialsPage.questions.dataTypes.question', { defaultMessage: 'JSON支持哪些数据类型？' })}
                </h3>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <p className="text-gray-600 dark:text-gray-300">
                  {t('tutorialsPage.questions.dataTypes.answer', { defaultMessage: 'JSON支持六种数据类型：字符串（用双引号包围）、数字（整数或浮点数）、布尔值（true或false）、数组（有序值集合）、对象（键值对集合）和null。JSON不直接支持日期、函数、undefined或正则表达式等类型。' })}
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>
      
      <section>
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            {t('tutorialsPage.relatedTools.title', { defaultMessage: '相关工具' })}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              href={`/${locale}`}
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-2xl mr-3">✨</span>
              <span>{t('tutorialsPage.relatedTools.formatter', { defaultMessage: 'JSON格式化' })}</span>
            </Link>
            <Link 
              href={`/${locale}`}
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-2xl mr-3">📦</span>
              <span>{t('tutorialsPage.relatedTools.compressor', { defaultMessage: 'JSON压缩' })}</span>
            </Link>
            <Link 
              href={`/${locale}`}
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-2xl mr-3">✅</span>
              <span>{t('tutorialsPage.relatedTools.validator', { defaultMessage: 'JSON验证' })}</span>
            </Link>
            <Link 
              href={`/${locale}`}
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-2xl mr-3">🔄</span>
              <span>{t('tutorialsPage.relatedTools.jsonToXml', { defaultMessage: 'JSON转XML' })}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 