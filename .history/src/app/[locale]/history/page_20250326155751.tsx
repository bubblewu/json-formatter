'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/request';

interface HistoryItem {
  id: string;
  timestamp: number;
  input: string;
  output: string;
  operation: 'format' | 'compress' | 'unescape';
}

export default function HistoryPage() {
  const t = useTranslations();
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // 从 localStorage 获取历史记录
    const savedHistory = localStorage.getItem('jsonFormatterHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    // 根据搜索词过滤历史记录
    const filtered = history.filter(item => 
      item.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.output.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
  }, [searchTerm, history]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getOperationText = (operation: string) => {
    switch (operation) {
      case 'format':
        return t('history.operations.format');
      case 'compress':
        return t('history.operations.compress');
      case 'unescape':
        return t('history.operations.unescape');
      default:
        return operation;
    }
  };

  const handleLanguageChange = (locale: string) => {
    const currentLocale = pathname.split('/')[1];
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Logo和站点标题 */}
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg shadow-md">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5H20V19H4V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 15H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('title')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('subtitle')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* 右侧导航项目 */}
            <div className="flex items-center space-x-4">
              {/* 主题切换按钮 */}
              <button
                onClick={() => router.push(`/${pathname.split('/')[1]}`)}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('backToFormatter')}
              </button>
              
              {/* 语言切换下拉菜单 */}
              <div className="relative">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <select
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="appearance-none bg-transparent focus:outline-none text-gray-700 dark:text-gray-300 pr-8"
                    value={pathname.split('/')[1]}
                  >
                    {locales.map((locale) => (
                      <option key={locale} value={locale}>
                        {locale === 'en' ? 'English' : '中文'}
                      </option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 ml-1 text-gray-500 dark:text-gray-400 pointer-events-none absolute right-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800">
            <div className="flex items-center">
              <div className="w-1 h-5 bg-blue-600 rounded-r mr-3"></div>
              <h2 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                {t('history.title')}
              </h2>
            </div>
          </div>
          
          {/* 搜索框 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('history.searchPlaceholder')}
                className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* 历史记录列表 */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {getOperationText(item.operation)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.output);
                        // 这里可以添加复制成功的提示
                      }}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {t('history.copy')}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {t('history.input')}
                      </div>
                      <pre className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md overflow-x-auto">
                        {item.input}
                      </pre>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {t('history.output')}
                      </div>
                      <pre className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md overflow-x-auto">
                        {item.output}
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {searchTerm ? t('history.noResults') : t('history.empty')}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('footer.copyright')}
        </div>
      </footer>
    </div>
  );
} 