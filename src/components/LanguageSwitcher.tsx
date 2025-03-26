'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { locales, Locale } from '@/i18n';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 确保只在客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  // 语言名称映射
  const languageNames: Record<string, string> = {
    en: 'English',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
  };

  // 获取切换语言的路径
  const getLocalePath = (newLocale: string) => {
    // 检查路径是否已经包含语言前缀
    if (pathname.startsWith(`/${locale}`)) {
      return pathname.replace(`/${locale}`, `/${newLocale}`);
    } else {
      // 如果没有语言前缀，直接添加新的语言前缀
      return `/${newLocale}${pathname}`;
    }
  };

  // 避免服务端渲染时出现闪烁
  if (!mounted) {
    return <div className="w-8 h-8"></div>;
  }

  return (
    <div className="relative">
      <button
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span suppressHydrationWarning>{languageNames[locale as Locale] || locale}</span>
        <svg
          className="ml-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {locales.map((l) => (
              <Link
                key={l}
                href={getLocalePath(l)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  locale === l
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <span suppressHydrationWarning>{languageNames[l] || l}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 