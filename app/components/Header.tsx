'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import ThemeToggle from './ThemeToggle';

// 创建本地化导航工具
const locales = ['en', 'zh'] as const;
const { useLocale, usePathname: useLocalPathname } = createLocalizedPathnamesNavigation({ 
  locales 
});

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const switchLocale = (newLocale: string) => {
    // 假设当前路径是 /en/page 或 /zh/page
    const segments = pathname.split('/');
    segments[1] = newLocale; // 替换语言部分
    router.push(segments.join('/'));
  };

  // 点击页面其他区域关闭菜单
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
      <div className="container-apple py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/${locale}`} 
              className="text-xl font-semibold text-apple-blue-light dark:text-apple-blue-dark"
            >
              {t('app.title')}
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link href={`/${locale}`} className="text-gray-600 hover:text-apple-blue-light dark:text-gray-300 dark:hover:text-apple-blue-dark">
              {t('nav.home')}
            </Link>
            <Link href={`/${locale}/tools`} className="text-gray-600 hover:text-apple-blue-light dark:text-gray-300 dark:hover:text-apple-blue-dark">
              {t('nav.tools')}
            </Link>
            <Link href={`/${locale}/about`} className="text-gray-600 hover:text-apple-blue-light dark:text-gray-300 dark:hover:text-apple-blue-dark">
              {t('nav.about')}
            </Link>
            
            <div className="relative ml-2">
              <button
                className="text-gray-600 hover:text-apple-blue-light dark:text-gray-300 dark:hover:text-apple-blue-dark"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
              >
                {t('nav.language')}
              </button>
              
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      className={`block px-4 py-2 text-sm text-left w-full ${locale === 'en' ? 'text-apple-blue-light dark:text-apple-blue-dark' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-800`}
                      onClick={() => switchLocale('en')}
                    >
                      English
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm text-left w-full ${locale === 'zh' ? 'text-apple-blue-light dark:text-apple-blue-dark' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-800`}
                      onClick={() => switchLocale('zh')}
                    >
                      中文
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <ThemeToggle />
          </nav>
          
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
            >
              {isMobileMenuOpen ? (
                <span className="sr-only">Close menu</span>
              ) : (
                <span className="sr-only">Open menu</span>
              )}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 移动菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-800">
            <Link 
              href={`/${locale}`}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-apple-blue-light dark:text-gray-300 dark:hover:text-apple-blue-dark"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link 
              href={`/${locale}/tools`}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-apple-blue-light dark:text-gray-300 dark:hover:text-apple-blue-dark"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.tools')}
            </Link>
            <Link 
              href={`/${locale}/about`}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-apple-blue-light dark:text-gray-300 dark:hover:text-apple-blue-dark"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.about')}
            </Link>
            
            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-800">
              <div className="px-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t('nav.language')}
              </div>
              <div className="mt-2 space-y-1">
                <button
                  className={`block w-full text-left px-3 py-2 text-base font-medium ${locale === 'en' ? 'text-apple-blue-light dark:text-apple-blue-dark' : 'text-gray-700 dark:text-gray-300'}`}
                  onClick={() => {
                    switchLocale('en');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  English
                </button>
                <button
                  className={`block w-full text-left px-3 py-2 text-base font-medium ${locale === 'zh' ? 'text-apple-blue-light dark:text-apple-blue-dark' : 'text-gray-700 dark:text-gray-300'}`}
                  onClick={() => {
                    switchLocale('zh');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  中文
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 