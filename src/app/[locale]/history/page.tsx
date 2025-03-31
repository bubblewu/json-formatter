'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/request';
import StructuredData from '@/components/StructuredData';

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
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [userId, setUserId] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // 获取用户ID
    const storedUserId = localStorage.getItem('jsonFormatterUserId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // 如果没有用户ID，重定向到首页
      router.push(`/${pathname.split('/')[1]}`);
    }
  }, [pathname, router]);

  useEffect(() => {
    // 从 localStorage 获取当前用户的历史记录
    if (userId) {
      const historyKey = `jsonFormatterHistory_${userId}`;
      const savedHistory = localStorage.getItem(historyKey);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, [userId]);

  useEffect(() => {
    // 根据搜索词和时间筛选过滤历史记录
    const now = new Date();
    const filtered = history.filter(item => {
      const itemDate = new Date(item.timestamp);
      const matchesSearch = 
        item.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.output.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesTime = true;
      switch (timeFilter) {
        case 'today':
          matchesTime = itemDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesTime = itemDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesTime = itemDate >= monthAgo;
          break;
        default:
          matchesTime = true;
      }
      
      return matchesSearch && matchesTime;
    });
    setFilteredHistory(filtered);
  }, [searchTerm, history, timeFilter]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // 如果是今天
    if (date.toDateString() === now.toDateString()) {
      return t('history.time.today', { time: date.toLocaleTimeString() });
    }
    
    // 如果是昨天
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return t('history.time.yesterday', { time: date.toLocaleTimeString() });
    }
    
    // 如果是一周内
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return t('history.time.daysAgo', { days, time: date.toLocaleTimeString() });
    }
    
    // 其他情况显示完整日期时间
    return date.toLocaleString();
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

  // 清除历史记录
  const handleClearHistory = () => {
    if (userId) {
      const historyKey = `jsonFormatterHistory_${userId}`;
      localStorage.removeItem(historyKey);
      setHistory([]);
      setFilteredHistory([]);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <StructuredData />
      {/* 导航栏 */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Logo和站点标题 */}
              <div 
                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => router.push(`/${pathname.split('/')[1]}`)}
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 sm:p-2 rounded-lg shadow-md">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5H20V19H4V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 15H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="ml-2 sm:ml-3">
                  <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                    {t('title')}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                    {t('subtitle')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* 移动端菜单按钮 */}
            <button 
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={toggleMenu}
            >
              <span className="sr-only">打开菜单</span>
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* 右侧导航项目 - 桌面端 */}
            <div className="hidden md:flex items-center space-x-4">
              {/* 返回按钮 */}
              <button
                onClick={() => {
                  const locale = pathname.split('/')[1];
                  router.push(`/${locale}`);
                }}
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
                        {t(`languages.${locale}`)}
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
          
          {/* 移动端菜单 */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200 dark:border-gray-700 py-2`}>
            <div className="flex flex-col space-y-3 pt-2 pb-3">
              {/* 返回按钮 */}
              <button
                onClick={() => {
                  const locale = pathname.split('/')[1];
                  router.push(`/${locale}`);
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full justify-center"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('backToFormatter')}
              </button>
              
              {/* 语言切换下拉菜单 */}
              <div className="flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('language')}</span>
                </div>
                <select
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="appearance-none bg-transparent focus:outline-none text-gray-700 dark:text-gray-300 pr-8"
                  value={pathname.split('/')[1]}
                >
                  {locales.map((locale) => (
                    <option key={locale} value={locale}>
                      {t(`languages.${locale}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="flex-1 container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-3 sm:px-4 py-3 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-2">
              <div className="flex items-center">
                <div className="w-1 h-5 bg-blue-600 rounded-r mr-3"></div>
                <h2 className="text-base sm:text-lg font-medium text-blue-800 dark:text-blue-200">
                  {t('history.title')}
                </h2>
              </div>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  {t('history.clear')}
                </button>
              )}
            </div>
          </div>
          
          {/* 搜索和筛选区域 */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-4">
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
            
            {/* 时间筛选 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTimeFilter('all')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  timeFilter === 'all'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('history.timeFilter.all')}
              </button>
              <button
                onClick={() => setTimeFilter('today')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  timeFilter === 'today'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('history.timeFilter.today')}
              </button>
              <button
                onClick={() => setTimeFilter('week')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  timeFilter === 'week'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('history.timeFilter.week')}
              </button>
              <button
                onClick={() => setTimeFilter('month')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  timeFilter === 'month'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('history.timeFilter.month')}
              </button>
            </div>
          </div>

          {/* 历史记录列表 */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-full ${
                        item.operation === 'format'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          : item.operation === 'compress'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                      }`}>
                        {getOperationText(item.operation)}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.input);
                          // 这里可以添加复制成功的提示
                        }}
                        className="inline-flex items-center px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        {t('history.copy')}
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <pre className="text-xs sm:text-sm p-2 sm:p-3 overflow-x-auto whitespace-pre-wrap break-all">
                      {item.input}
                    </pre>
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

      {/* 添加页脚 */}
      <footer className="py-4 sm:py-6 px-3 sm:px-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="container mx-auto text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
} 