'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function Breadcrumb() {
  const pathname = usePathname();
  const t = useTranslations();
  
  // 移除语言前缀
  const path = pathname.replace(/^\/[a-z]{2}/, '');
  
  // 分割路径
  const segments = path.split('/').filter(Boolean);
  
  // 生成面包屑项
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const label = t(`breadcrumb.${segment}`) || segment;
    
    return {
      href,
      label,
      isLast: index === segments.length - 1,
    };
  });

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <motion.nav 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-4"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          href="/" 
          className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          aria-label={t('breadcrumb.home')}
        >
          <HomeIcon className="h-4 w-4" />
          <span className="sr-only">{t('breadcrumb.home')}</span>
        </Link>
      </motion.div>
      {breadcrumbs.map((breadcrumb, index) => (
        <motion.div 
          key={breadcrumb.href} 
          className="flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ChevronRightIcon className="h-4 w-4 mx-1" />
          {breadcrumb.isLast ? (
            <motion.span 
              className="text-gray-700 dark:text-gray-300 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {breadcrumb.label}
            </motion.span>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={breadcrumb.href}
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                {breadcrumb.label}
              </Link>
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.nav>
  );
} 