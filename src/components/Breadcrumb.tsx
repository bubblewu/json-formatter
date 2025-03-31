'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Breadcrumb() {
  const pathname = usePathname();
  const t = useTranslations();
  const [isMobile, setIsMobile] = useState(false);
  // 延迟加载,以避免出现闪烁和水合错误
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 移除语言前缀 (确保处理静态资源路径等特殊情况)
  if (pathname.includes('.') || pathname.startsWith('/_next')) {
    return null; // 不显示面包屑导航在静态资源或Next.js内部路径
  }
  
  const path = pathname.replace(/^\/[a-z]{2}/, '');
  
  // 分割路径
  const segments = path.split('/').filter(Boolean);
  
  // 生成面包屑项（确保键的安全）
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    let label = '';
    try {
      label = t(`breadcrumb.${segment}`) || segment;
    } catch (error) {
      // 如果翻译找不到，直接使用段名
      label = segment;
    }
    
    return {
      href,
      label,
      isLast: index === segments.length - 1,
    };
  });

  // 如果没有面包屑项或还没有客户端渲染,返回null
  if (breadcrumbs.length === 0 || !isClient) {
    return null;
  }

  // 移动端只显示最后一个面包屑
  const displayBreadcrumbs = isMobile 
    ? breadcrumbs.slice(-1)
    : breadcrumbs;

  return (
    <motion.nav 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-4 overflow-x-auto py-2 scrollbar-hide max-w-full sm:flex-wrap"
      aria-label="Breadcrumb"
    >
      {!isMobile && (
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
      )}
      {displayBreadcrumbs.map((breadcrumb, index) => (
        <motion.div 
          key={breadcrumb.href} 
          className="flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {(index > 0 || !isMobile) && <ChevronRightIcon className="h-4 w-4 mx-1 flex-shrink-0" />}
          {breadcrumb.isLast ? (
            <motion.span 
              className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[150px] sm:max-w-xs"
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
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 truncate max-w-[150px] sm:max-w-xs inline-block"
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