'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations('footer');
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
      <div className="container-apple">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} JSON Formatter. {t('rights')}
          </div>
          <div className="flex flex-wrap justify-center space-x-4">
            <Link 
              href={`/${locale}/privacy`} 
              className="text-gray-600 hover:text-apple-blue-light dark:text-gray-400 dark:hover:text-apple-blue-dark"
            >
              {t('privacy')}
            </Link>
            <Link 
              href={`/${locale}/terms`} 
              className="text-gray-600 hover:text-apple-blue-light dark:text-gray-400 dark:hover:text-apple-blue-dark"
            >
              {t('terms')}
            </Link>
            <Link 
              href={`/${locale}/contact`} 
              className="text-gray-600 hover:text-apple-blue-light dark:text-gray-400 dark:hover:text-apple-blue-dark"
            >
              {t('contact')}
            </Link>
            <a 
              href="https://github.com/yourusername/json-formatter" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-apple-blue-light dark:text-gray-400 dark:hover:text-apple-blue-dark"
            >
              {t('github')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 